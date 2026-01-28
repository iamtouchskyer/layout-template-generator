/**
 * Config Loader - Loads slide-master.json and exposes configuration
 * This is the single source of truth for both JS preview and Python pptx generator
 */

let CONFIG = null;

// Derived configs (populated after loading)
let SLIDE_CONFIG = null;
let SHAPE_PRESETS = null;
let GRID_LAYOUTS = null;
let ZONE_CONTENT_TYPES = null;
let PLACEHOLDERS_CONFIG = null;

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

        console.log('Config loaded successfully');
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
    // Slide config
    SLIDE_CONFIG = {
        width: CONFIG.slide.width.px,
        height: CONFIG.slide.height.px,
        widthEmu: CONFIG.slide.width.emu,
        heightEmu: CONFIG.slide.height.emu,
        baseMargin: {
            top: CONFIG.slide.baseMargin.top.px,
            right: CONFIG.slide.baseMargin.right.px,
            bottom: CONFIG.slide.baseMargin.bottom.px,
            left: CONFIG.slide.baseMargin.left.px,
        }
    };

    // Placeholders config
    PLACEHOLDERS_CONFIG = CONFIG.placeholders;

    // Shape presets - transform to match existing code structure
    SHAPE_PRESETS = {};
    for (const [shapeId, shapeConfig] of Object.entries(CONFIG.shapes)) {
        SHAPE_PRESETS[shapeId] = {
            label: shapeConfig.label,
            occupiesSpace: shapeConfig.occupiesSpace,
            presets: Object.entries(shapeConfig.presets).map(([presetId, preset]) => ({
                id: presetId,
                name: preset.name,
            }))
        };
    }

    // Grid layouts
    GRID_LAYOUTS = CONFIG.gridLayouts;

    // Zone content types
    ZONE_CONTENT_TYPES = CONFIG.zoneContentTypes;
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

    // Apply placeholder bounds
    state.masterPlaceholders.forEach(placeholderId => {
        const placeholder = PLACEHOLDERS_CONFIG[placeholderId];
        if (placeholder && placeholder.bounds) {
            applyBounds(placeholder.bounds);
        }
    });

    // Apply shape bounds (only for occupiesSpace: true)
    state.masterShapes.forEach(({ id: shapeId, preset: presetId }) => {
        const shapeConfig = CONFIG.shapes[shapeId];
        if (!shapeConfig || shapeConfig.occupiesSpace === false) {
            return;
        }

        const presetConfig = shapeConfig.presets[presetId];
        if (presetConfig && presetConfig.bounds) {
            applyBounds(presetConfig.bounds);
        }
    });

    return bounds;
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
window.generateStyleFromConfig = generateStyleFromConfig;
