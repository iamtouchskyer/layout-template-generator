/**
 * Config Loader - Loads slide-master.json and exposes configuration
 * This is the single source of truth for both JS preview and Python pptx generator
 */

let CONFIG = null;

// Derived configs (populated after loading)
let SLIDE_CONFIG = null;
let ASPECT_RATIOS = null;
let CURRENT_ASPECT_RATIO = null;
let SHAPE_PRESETS = null;
let GRID_LAYOUTS = null;
let ZONE_CONTENT_TYPES = null;
let PLACEHOLDERS_CONFIG = null;
let CONTENT_AREAS = null;

/**
 * Load configuration from JSON file
 */
async function loadConfig() {
    try {
        const response = await fetch('/config/slide-master.json');
        if (!response.ok) {
            throw new Error(`Failed to load config: ${response.status}`);
        }
        CONFIG = await response.json();

        // Derive configs for backward compatibility
        deriveConfigs();
        return CONFIG;
    } catch (error) {
        console.error('Failed to load config:', error);
        throw error;
    }
}

/**
 * Derive configs from loaded JSON for backward compatibility with existing code
 */
function deriveConfigs() {
    // Aspect ratios config
    ASPECT_RATIOS = CONFIG.slide.aspectRatios;
    CURRENT_ASPECT_RATIO = CONFIG.slide.defaultAspectRatio || '16:9';

    // Slide config (derived from current aspect ratio)
    updateSlideConfigForAspectRatio(CURRENT_ASPECT_RATIO);

    // Derive other configs
    deriveOtherConfigs();
}

/**
 * Update SLIDE_CONFIG for a given aspect ratio
 */
function updateSlideConfigForAspectRatio(aspectRatio) {
    const ar = ASPECT_RATIOS[aspectRatio];
    if (!ar) {
        console.error(`Unknown aspect ratio: ${aspectRatio}`);
        return;
    }

    CURRENT_ASPECT_RATIO = aspectRatio;
    SLIDE_CONFIG = {
        width: ar.width.px,
        height: ar.height.px,
        widthInches: ar.width.inches,
        heightInches: ar.height.inches,
        baseMargin: {
            top: CONFIG.slide.baseMargin.top.px,
            right: CONFIG.slide.baseMargin.right.px,
            bottom: CONFIG.slide.baseMargin.bottom.px,
            left: CONFIG.slide.baseMargin.left.px,
        }
    };
}

/**
 * Continue deriving other configs (called after aspect ratio is set)
 */
function deriveOtherConfigs() {

    // Placeholders config
    PLACEHOLDERS_CONFIG = CONFIG.placeholders;

    // Shape presets - transform to match existing code structure
    // Now supports two config types:
    // 1. preset-based (legacy): { presets: { presetId: { name, position, size } } }
    // 2. thickness-positions: { configType: "thickness-positions", thickness: {}, positions: {} }
    SHAPE_PRESETS = {};
    for (const [shapeId, shapeConfig] of Object.entries(CONFIG.shapes)) {
        if (shapeConfig.configType === 'thickness-positions') {
            // New thickness-positions config
            SHAPE_PRESETS[shapeId] = {
                label: shapeConfig.label,
                occupiesSpace: shapeConfig.occupiesSpace,
                configType: 'thickness-positions',
                thickness: shapeConfig.thickness,
                positions: shapeConfig.positions,
                defaultThickness: shapeConfig.defaultThickness,
                defaultPositions: shapeConfig.defaultPositions,
                style: shapeConfig.style || {},
            };
        } else {
            // Legacy preset-based config
            SHAPE_PRESETS[shapeId] = {
                label: shapeConfig.label,
                occupiesSpace: shapeConfig.occupiesSpace,
                configType: 'presets',
                presets: Object.entries(shapeConfig.presets).map(([presetId, preset]) => ({
                    id: presetId,
                    name: preset.name,
                }))
            };
        }
    }

    // Grid layouts
    GRID_LAYOUTS = CONFIG.gridLayouts;

    // Zone content types
    ZONE_CONTENT_TYPES = CONFIG.zoneContentTypes;

    // Content areas
    const areas = CONFIG.contentAreas;

    // Helper to build height config with getHeight method
    const buildHeightConfig = (config) => ({
        heights: Object.fromEntries(
            Object.entries(config.heights).map(([k, v]) => [k, { px: v.px, label: v.label }])
        ),
        default: config.default,
        getHeight(style) {
            const h = this.heights[style] || this.heights[this.default];
            return h.px;
        }
    });

    CONTENT_AREAS = {
        header: buildHeightConfig(areas.header),
        footer: buildHeightConfig(areas.footer),
        titleStyles: areas.titleStyles,
        titleStyleDefault: areas.titleStyleDefault,
        sourceStyles: areas.sourceStyles,
        sourceStyleDefault: areas.sourceStyleDefault,
        bodyGap: areas.bodyGap.px,
    };
}

/**
 * Get content bounds based on enabled placeholders and shapes
 * @param {Object} state - Current application state
 * @returns {Object} { top, right, bottom, left } in pixels
 */
function getContentBoundsFromConfig(state) {
    const base = SLIDE_CONFIG.baseMargin;
    let bounds = {
        top: base.top,
        right: base.right,
        bottom: base.bottom,
        left: base.left,
    };

    const applyBounds = (boundsObj) => {
        if (!boundsObj) return;
        if (boundsObj.top) bounds.top = Math.max(bounds.top, boundsObj.top);
        if (boundsObj.right) bounds.right = Math.max(bounds.right, boundsObj.right);
        if (boundsObj.bottom) bounds.bottom = Math.max(bounds.bottom, boundsObj.bottom);
        if (boundsObj.left) bounds.left = Math.max(bounds.left, boundsObj.left);
    };

    // Apply placeholder bounds (if any)
    // Note: Current placeholders don't have bounds as they're decorative
    Object.entries(state.masterPlaceholders).forEach(([placeholderId, phState]) => {
        if (!phState.enabled) return;
        const placeholder = PLACEHOLDERS_CONFIG[placeholderId];
        if (placeholder && placeholder.bounds) {
            applyBounds(placeholder.bounds);
        }
    });

    // Apply shape bounds (only for occupiesSpace: true)
    state.masterShapes.forEach((shapeState) => {
        const shapeId = shapeState.id;
        const shapeConfig = CONFIG.shapes[shapeId];
        if (!shapeConfig || shapeConfig.occupiesSpace === false) {
            return;
        }

        if (shapeConfig.configType === 'thickness-positions') {
            // New thickness-positions config
            const thickness = shapeState.thickness || shapeConfig.defaultThickness;
            const positions = shapeState.positions || shapeConfig.defaultPositions || [];
            const thicknessConfig = shapeConfig.thickness[thickness];
            const boundsOffset = thicknessConfig?.boundsOffset || thicknessConfig?.size || 0;

            positions.forEach(pos => {
                if (pos === 'left') bounds.left = Math.max(bounds.left, base.left + boundsOffset);
                if (pos === 'right') bounds.right = Math.max(bounds.right, base.right + boundsOffset);
                if (pos === 'top') bounds.top = Math.max(bounds.top, base.top + boundsOffset);
                if (pos === 'bottom') bounds.bottom = Math.max(bounds.bottom, base.bottom + boundsOffset);
            });
        } else {
            // Legacy preset-based config
            const presetId = shapeState.preset;
            const presetConfig = shapeConfig.presets?.[presetId];
            if (presetConfig && presetConfig.bounds) {
                applyBounds(presetConfig.bounds);
            }
        }
    });

    return bounds;
}

/**
 * Get header area bounds (for title)
 * Header is ALWAYS at baseMargin.top - not pushed down by shapes
 * Only left/right are affected by shapes (like sidebar)
 * @param {Object} state - Current application state
 * @returns {Object} { top, left, right, height } in pixels
 */
function getHeaderBoundsFromConfig(state) {
    const base = SLIDE_CONFIG.baseMargin;

    // Header top is FIXED - not affected by shapes
    let left = base.left;
    let right = base.right;

    // Only apply left/right bounds from shapes (not top/bottom)
    state.masterShapes.forEach((shapeState) => {
        const shapeId = shapeState.id;
        const shapeConfig = CONFIG.shapes[shapeId];
        if (!shapeConfig || shapeConfig.occupiesSpace === false) return;

        if (shapeConfig.configType === 'thickness-positions') {
            // New thickness-positions config - only apply left/right
            const thickness = shapeState.thickness || shapeConfig.defaultThickness;
            const positions = shapeState.positions || shapeConfig.defaultPositions || [];
            const thicknessConfig = shapeConfig.thickness[thickness];
            const boundsOffset = thicknessConfig?.boundsOffset || thicknessConfig?.size || 0;

            if (positions.includes('left')) left = Math.max(left, base.left + boundsOffset);
            if (positions.includes('right')) right = Math.max(right, base.right + boundsOffset);
        } else {
            // Legacy preset-based config
            const presetId = shapeState.preset;
            const presetConfig = shapeConfig.presets?.[presetId];
            if (presetConfig && presetConfig.bounds) {
                if (presetConfig.bounds.left) left = Math.max(left, presetConfig.bounds.left);
                if (presetConfig.bounds.right) right = Math.max(right, presetConfig.bounds.right);
            }
        }
    });

    // Apply placeholder left/right bounds (if any)
    Object.entries(state.masterPlaceholders).forEach(([placeholderId, phState]) => {
        if (!phState.enabled) return;
        const placeholder = PLACEHOLDERS_CONFIG[placeholderId];
        if (placeholder && placeholder.bounds) {
            if (placeholder.bounds.left) left = Math.max(left, placeholder.bounds.left);
            if (placeholder.bounds.right) right = Math.max(right, placeholder.bounds.right);
        }
    });

    // Get header height from state (default to 'compact')
    const headerHeight = CONTENT_AREAS.header.getHeight(state.masterContentAreas.headerHeight || 'compact');

    return {
        top: base.top,  // Fixed at baseMargin, not pushed by shapes
        left: left,
        right: right,
        height: headerHeight,
    };
}

/**
 * Get body area bounds (for content zones)
 * Body starts below header area, respects ALL shape bounds
 * baseMargin.bottom already reserves space for footer elements
 * @param {Object} state - Current application state
 * @param {boolean} hasTitle - Whether title is shown
 * @returns {Object} { top, right, bottom, left } in pixels
 */
function getBodyBoundsFromConfig(state, hasTitle = true) {
    const base = SLIDE_CONFIG.baseMargin;
    const contentBounds = getContentBoundsFromConfig(state);

    // Body top: below header if title exists
    // Also respect shape top bounds (like header-badge)
    let bodyTop;
    if (hasTitle) {
        // Start below header area
        const headerHeight = CONTENT_AREAS.header.getHeight(state.masterContentAreas.headerHeight || 'compact');
        const headerBottom = base.top + headerHeight + CONTENT_AREAS.bodyGap;
        // But also respect shape top bounds
        bodyTop = Math.max(headerBottom, contentBounds.top);
    } else {
        bodyTop = contentBounds.top;
    }

    // Body bottom: keep a stable footer-safe reserve regardless of footer-line
    // visibility, so preview/export geometry stays deterministic.
    const footerReserveBottom = getFooterSafeBottomFromConfig();
    const bodyBottom = Math.max(contentBounds.bottom, footerReserveBottom);

    return {
        top: bodyTop,
        left: contentBounds.left,
        right: contentBounds.right,
        bottom: bodyBottom,
    };
}

/**
 * Footer safe bottom reserve from config.
 * This keeps content area independent from decorative footer-line show/hide.
 * @returns {number} Bottom reserve in px
 */
function getFooterSafeBottomFromConfig() {
    const baseBottom = SLIDE_CONFIG?.baseMargin?.bottom || 0;
    const footerLine = CONFIG?.shapes?.['footer-line'];
    const presets = footerLine?.presets || {};
    let maxBottom = baseBottom;

    Object.values(presets).forEach((preset) => {
        const posBottom = Number(preset?.position?.bottom);
        if (Number.isFinite(posBottom)) {
            maxBottom = Math.max(maxBottom, posBottom);
        }
    });

    return maxBottom;
}

/**
 * Generate CSS style string from position/size config
 * @param {Object} config - Preset config with position and size
 * @returns {string} CSS style string
 */
function generateStyleFromConfig(config) {
    const styles = [];

    // Position
    if (config.position) {
        for (const [key, value] of Object.entries(config.position)) {
            const cssValue = typeof value === 'number' ? `${value}px` : value;
            styles.push(`${key}: ${cssValue}`);
        }
    }

    // Size
    if (config.size) {
        for (const [key, value] of Object.entries(config.size)) {
            if (['width', 'height'].includes(key)) {
                const cssValue = typeof value === 'number' ? `${value}px` : value;
                styles.push(`${key}: ${cssValue}`);
            }
        }
    }

    // Custom styles
    if (config.style) {
        if (config.style.borderRadius) {
            styles.push(`border-radius: ${config.style.borderRadius}`);
        }
        if (config.style.opacity !== undefined) {
            styles.push(`opacity: ${config.style.opacity}`);
        }
    }

    return styles.join('; ');
}

// Export for use in other modules
window.CONFIG = null;  // Will be set after loading
window.loadConfig = loadConfig;
window.getContentBoundsFromConfig = getContentBoundsFromConfig;
window.getHeaderBoundsFromConfig = getHeaderBoundsFromConfig;
window.getBodyBoundsFromConfig = getBodyBoundsFromConfig;
window.generateStyleFromConfig = generateStyleFromConfig;
window.updateSlideConfigForAspectRatio = updateSlideConfigForAspectRatio;
window.getAspectRatios = () => ASPECT_RATIOS;
window.getCurrentAspectRatio = () => CURRENT_ASPECT_RATIO;
