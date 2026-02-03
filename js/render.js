// Render Functions

function render() {
    const slide = document.getElementById('slide');
    const masterLayer = document.getElementById('master-layer');
    const contentLayer = document.getElementById('content-layer');

    slide.setAttribute('data-theme', state.theme);
    let pageClass = `page-type-${state.pageType}`;
    if (state.pageType === 'divider') {
        pageClass = `page-type-divider-${state.dividerLayout} bg-${state.dividerBgStyle}`;
    } else if (state.pageType === 'content-smartart') {
        pageClass = `page-type-smartart placement-${state.smartartPlacement}`;
    }
    slide.className = `slide-container ${pageClass}`;

    // Hide content during update to prevent flash
    contentLayer.style.visibility = 'hidden';
    masterLayer.innerHTML = renderMasterLayer();
    contentLayer.innerHTML = renderContentLayer();

    // Show content after async renders complete (double rAF to ensure SmartArt is rendered)
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            contentLayer.style.visibility = '';
        });
    });

    updateNavValues();
    if (state.previewTab === 'json') updateJsonOutput();

    // Initialize ECharts after DOM update
    if (state.pageType === 'content-grid') {
        setTimeout(() => initZoneCharts(), 0);
    }
}

// Initialize ECharts in chart zones
function initZoneCharts() {
    if (typeof echarts === 'undefined') return;

    const gridLayout = GRID_LAYOUTS[state.gridLayout];
    if (!gridLayout) return;

    gridLayout.zones.forEach(zone => {
        const contentType = state.zoneContents[zone.id] || 'text';
        if (contentType !== 'chart') return;

        const container = document.getElementById(`chart-${zone.id}`);
        if (!container) return;

        const idx = getZoneIndex(zone.id);
        const sample = CHART_SAMPLES[idx % CHART_SAMPLES.length];

        // Dispose existing chart
        const existingChart = echarts.getInstanceByDom(container);
        if (existingChart) existingChart.dispose();

        // Create new chart using portable data format
        const chart = echarts.init(container);
        const option = toEChartsOption(sample);

        // Apply theme colors
        const themeAccent = getComputedStyle(document.documentElement).getPropertyValue('--theme-accent').trim() || '#e07b56';
        if (option.series) {
            option.series.forEach((s, i) => {
                if (!s.itemStyle) s.itemStyle = {};
                s.itemStyle.color = i === 0 ? themeAccent : adjustColor(themeAccent, i * 30);
                if (s.areaStyle) s.areaStyle.color = themeAccent;
            });
        }

        chart.setOption(option);
    });
}

function adjustColor(hex, amount) {
    // Simple color adjustment
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

function renderPlaceholderList() {
    const container = document.getElementById('placeholder-list');
    if (!container || !PLACEHOLDERS_CONFIG) return;

    container.innerHTML = Object.entries(PLACEHOLDERS_CONFIG).map(([phId, phConfig]) => {
        const phState = state.masterPlaceholders[phId] || { enabled: false };
        const isActive = phState.enabled;

        // Position options
        const positionOptions = Object.entries(phConfig.positions)
            .map(([posId, pos]) => `<option value="${posId}" ${phState.position === posId ? 'selected' : ''}>${pos.label}</option>`)
            .join('');

        // Size options (only for logo)
        let sizeOptionsHtml = '';
        if (phConfig.sizes) {
            const sizeOptions = Object.entries(phConfig.sizes)
                .map(([sizeId, size]) => `<option value="${sizeId}" ${phState.size === sizeId ? 'selected' : ''}>${size.label}</option>`)
                .join('');
            sizeOptionsHtml = `
                <div class="option-row">
                    <label>大小</label>
                    <select onchange="updatePlaceholderSize('${phId}', this.value)">${sizeOptions}</select>
                </div>
            `;
        }

        // Upload button (only for logo)
        let uploadHtml = '';
        if (phConfig.allowUpload) {
            const hasImage = phState.imageUrl;
            uploadHtml = `
                <div class="option-row logo-upload-row">
                    <label>图片</label>
                    <div class="logo-upload-controls">
                        <input type="file" id="logo-upload-${phId}" accept="image/*" onchange="handleLogoUpload('${phId}', this)" style="display:none">
                        <button class="upload-btn" onclick="document.getElementById('logo-upload-${phId}').click()">
                            ${hasImage ? '更换' : '上传'}
                        </button>
                        ${hasImage ? `<button class="clear-btn" onclick="clearLogoImage('${phId}')">清除</button>` : ''}
                    </div>
                </div>
            `;
        }

        return `
            <div class="placeholder-item ${isActive ? 'active' : ''}" data-placeholder="${phId}">
                <div class="placeholder-item-header" onclick="togglePlaceholder('${phId}')">
                    <input type="checkbox" ${isActive ? 'checked' : ''} onclick="event.stopPropagation(); togglePlaceholder('${phId}')">
                    <span class="item-label">${phConfig.label}</span>
                </div>
                <div class="placeholder-item-options">
                    <div class="option-row">
                        <label>位置</label>
                        <select onchange="updatePlaceholderPosition('${phId}', this.value)">${positionOptions}</select>
                    </div>
                    ${sizeOptionsHtml}
                    ${uploadHtml}
                </div>
            </div>
        `;
    }).join('');
}

function renderShapesList() {
    const container = document.getElementById('shapes-list');
    container.innerHTML = Object.entries(SHAPE_PRESETS).map(([shapeId, shape]) => {
        const isActive = state.masterShapes.some(s => s.id === shapeId);
        const shapeState = state.masterShapes.find(s => s.id === shapeId);

        let optionsHtml = '';
        if (shape.configType === 'thickness-positions') {
            // New thickness-positions config
            const currentThickness = shapeState?.thickness || shape.defaultThickness;
            const currentPositions = shapeState?.positions || shape.defaultPositions || [];

            // Thickness dropdown
            const thicknessOptions = Object.entries(shape.thickness)
                .map(([id, t]) => `<option value="${id}" ${currentThickness === id ? 'selected' : ''}>${t.label}</option>`)
                .join('');

            // Position checkboxes
            const positionCheckboxes = Object.entries(shape.positions)
                .map(([id, p]) => {
                    const isChecked = currentPositions.includes(id);
                    return `<label class="position-checkbox">
                        <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="updateShapePosition('${shapeId}', '${id}', this.checked)">
                        <span>${p.label}</span>
                    </label>`;
                })
                .join('');

            optionsHtml = `
                <div class="option-row">
                    <label>大小</label>
                    <select onchange="updateShapeThickness('${shapeId}', this.value)">${thicknessOptions}</select>
                </div>
                <div class="option-row">
                    <label>位置</label>
                    <div class="position-checkboxes">${positionCheckboxes}</div>
                </div>
            `;
        } else {
            // Legacy preset-based config
            const currentPreset = shapeState?.preset || shape.presets[0].id;
            optionsHtml = `
                <div class="option-row">
                    <label>Variant</label>
                    <select onchange="updateShapePreset('${shapeId}', this.value)">
                        ${shape.presets.map(p => `<option value="${p.id}" ${currentPreset === p.id ? 'selected' : ''}>${p.name}</option>`).join('')}
                    </select>
                </div>
            `;
        }

        return `
            <div class="shape-item ${isActive ? 'active' : ''}" data-shape="${shapeId}">
                <div class="shape-item-header" onclick="toggleShape('${shapeId}')">
                    <input type="checkbox" ${isActive ? 'checked' : ''} onclick="event.stopPropagation(); toggleShape('${shapeId}')">
                    <span class="item-label">${shape.label}</span>
                </div>
                <div class="shape-item-options">${optionsHtml}</div>
            </div>
        `;
    }).join('');
}

function renderLayoutTypes() {
    const container = document.getElementById('layout-type-selector');
    const categories = {
        'image': { label: 'Image Layouts', items: [] },
        'chart': { label: 'Chart Layouts', items: [] },
        'text': { label: 'Text Layouts', items: [] },
        'comparison': { label: 'Comparison', items: [] },
        'fancy': { label: 'Fancy Layouts', items: [] },
    };
    Object.entries(LAYOUT_TYPES).forEach(([id, layout]) => {
        if (categories[layout.category]) categories[layout.category].items.push({ id, ...layout });
    });
    container.innerHTML = Object.entries(categories).map(([catId, cat]) => {
        if (cat.items.length === 0) return '';
        return `
            <div class="layout-category" data-category="${catId}">
                <div class="layout-category-title">${cat.label}</div>
                <div class="layout-category-items">
                    ${cat.items.map(item => `
                        <div class="layout-type-item ${state.layoutType === item.id ? 'active' : ''}"
                             data-layout="${item.id}" onclick="selectLayoutType('${item.id}')">
                            <div class="layout-preview ${getLayoutPreviewClass(item)}">${renderLayoutPreviewZones(item)}</div>
                            <div class="layout-label">${item.label}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
}

function getLayoutPreviewClass(layout) {
    const id = layout.id;
    if (['image-left', 'image-right', 'chart-left', 'chart-right', 'two-column-equal', 'split-screen'].includes(id)) return 'horizontal';
    if (['image-top', 'image-bottom', 'hero-banner'].includes(id)) return 'vertical';
    if (['stats-dashboard', 'icon-grid'].includes(id)) return 'grid-4';
    if (['comparison-2', 'comparison-3', 'conclusion'].includes(id)) return 'grid-3';
    return 'center-single';
}

function renderLayoutPreviewZones(layout) {
    const { zones, id } = layout;
    if (id === 'edge-to-edge') return `<div class="zone zone-image" style="flex:1;position:relative;"><div style="position:absolute;bottom:0;left:0;right:0;height:40%;background:linear-gradient(transparent,rgba(0,0,0,0.5))"></div></div>`;
    if (id === 'timeline') return `<div class="zone zone-text" style="flex:1;display:flex;align-items:center;justify-content:center;"><div style="width:80%;height:3px;background:var(--accent-l3);position:relative;"><div style="position:absolute;top:-4px;left:10%;width:10px;height:10px;border-radius:50%;background:var(--accent-l3);"></div><div style="position:absolute;top:-4px;left:45%;width:10px;height:10px;border-radius:50%;background:var(--accent-l3);"></div><div style="position:absolute;top:-4px;left:80%;width:10px;height:10px;border-radius:50%;background:var(--accent-l3);"></div></div></div>`;
    return zones.map(zone => {
        let zoneClass = 'zone-text';
        if (['image', 'background', 'hero'].includes(zone)) zoneClass = 'zone-image';
        else if (zone === 'chart') zoneClass = 'zone-chart';
        else if (zone === 'metric') zoneClass = 'zone-metric';
        else if (zone === 'quote') zoneClass = 'zone-quote';
        else if (['card', 'icon', 'summary'].includes(zone)) zoneClass = 'zone-card';
        return `<div class="zone ${zoneClass}"></div>`;
    }).join('');
}

function renderMasterLayer() {
    let decorativeHtml = '';  // Background decorations (z-index: 0)
    let shapeHtml = '';       // Space-occupying shapes (z-index: 1)

    state.masterShapes.forEach((shapeState) => {
        const shapeId = shapeState.id;
        const shapeConfig = SHAPE_PRESETS[shapeId];
        if (!shapeConfig) return;

        const isDecorative = shapeConfig.occupiesSpace === false;

        if (shapeConfig.configType === 'thickness-positions') {
            // New thickness-positions config - render for each position
            const thickness = shapeState.thickness || shapeConfig.defaultThickness;
            const positions = shapeState.positions || shapeConfig.defaultPositions || [];
            const thicknessConfig = shapeConfig.thickness[thickness];

            positions.forEach(pos => {
                const presetKey = `${thickness}-${pos}`;
                const html = renderThicknessPositionShape(shapeId, thickness, pos, thicknessConfig, shapeConfig.style);
                if (isDecorative) {
                    decorativeHtml += html;
                } else {
                    shapeHtml += html;
                }
            });
        } else {
            // Legacy preset-based config
            const presetId = shapeState.preset;
            const shapeMap = {
                'header-badge': `<div class="master-shape header-badge" data-preset="${presetId}">SECTION</div>`,
                'header-line': `<div class="master-shape header-line" data-preset="${presetId}"></div>`,
                'footer-line': `<div class="master-shape footer-line" data-preset="${presetId}"></div>`,
            };

            const shapeHtmlContent = shapeMap[shapeId] || '';
            if (isDecorative) {
                decorativeHtml += shapeHtmlContent;
            } else {
                shapeHtml += shapeHtmlContent;
            }
        }
    });

    // Placeholders
    let placeholderHtml = '';
    Object.entries(state.masterPlaceholders).forEach(([phId, phState]) => {
        if (!phState.enabled) return;

        const phConfig = PLACEHOLDERS_CONFIG[phId];
        if (!phConfig) return;

        const posConfig = phConfig.positions[phState.position];
        if (!posConfig) return;

        const posStyle = generatePlaceholderPositionStyle(posConfig.position);

        if (phId === 'logo') {
            const sizeConfig = phConfig.sizes[phState.size || phConfig.defaultSize];
            const width = sizeConfig?.width || 80;
            const height = sizeConfig?.height || 30;
            const sizeStyle = `width: ${width}px; height: ${height}px;`;
            const hasImageClass = phState.imageUrl ? 'has-image' : '';

            if (phState.imageUrl) {
                placeholderHtml += `<div class="master-placeholder logo ${hasImageClass}" style="${posStyle}; ${sizeStyle}">
                    <img src="${phState.imageUrl}" alt="Logo">
                </div>`;
            } else {
                placeholderHtml += `<div class="master-placeholder logo" style="${posStyle}; ${sizeStyle}">LOGO</div>`;
            }
        } else if (phId === 'page-number') {
            const extraStyle = phState.position === 'bc' ? 'left: 50%; transform: translateX(-50%);' : '';
            placeholderHtml += `<div class="master-placeholder page-number" style="${posStyle}; ${extraStyle}">3 / 12</div>`;
        } else if (phId === 'date') {
            placeholderHtml += `<div class="master-placeholder date-field" style="${posStyle}">2024-01-15</div>`;
        }
    });

    // Content boundary indicator for L2
    let boundaryHtml = '';
    if (state.activeLayer === 2 && (state.pageType === 'content-grid' || state.pageType === 'content-smartart')) {
        boundaryHtml = renderContentBoundary();
    }

    // Order: decorative (back) → shapes → placeholders → boundary (front)
    return decorativeHtml + shapeHtml + placeholderHtml + boundaryHtml;
}

/**
 * Render a shape with thickness-positions config for a specific position
 */
function renderThicknessPositionShape(shapeId, thickness, position, thicknessConfig, defaultStyle) {
    const presetKey = `${thickness}-${position}`;
    const decorativeClass = SHAPE_PRESETS[shapeId]?.occupiesSpace === false ? 'decorative' : '';

    switch (shapeId) {
        case 'side-bar': {
            return `<div class="master-shape ${decorativeClass} side-bar" data-preset="${presetKey}"></div>`;
        }
        case 'corner': {
            return `<div class="master-shape ${decorativeClass} corner-shape" data-preset="${presetKey}"></div>`;
        }
        case 'corner-dots': {
            const size = thicknessConfig.size || 60;
            const dotSize = thicknessConfig.dotSize || 2;
            const gap = thicknessConfig.gap || 10;
            const opacity = defaultStyle?.opacity || 0.3;
            const posStyle = getCornerPositionStyle(position, size);
            const style = `${posStyle}; width: ${size}px; height: ${size}px; background-image: radial-gradient(var(--theme-accent) ${dotSize}px, transparent ${dotSize}px); background-size: ${gap + dotSize}px ${gap + dotSize}px; opacity: ${opacity};`;
            return `<div class="master-shape ${decorativeClass} corner-dots-dynamic" style="${style}"></div>`;
        }
        case 'corner-lines': {
            const size = thicknessConfig.size || 40;
            const lineWidth = thicknessConfig.lineWidth || 1;
            const gap = thicknessConfig.gap || 8;
            const opacity = defaultStyle?.opacity || 0.2;
            const posStyle = getCornerPositionStyle(position, size);
            // Render 3 diagonal lines
            const lineCount = Math.floor(size / (gap + lineWidth));
            let linesHtml = '';
            for (let i = 0; i < Math.min(lineCount, 5); i++) {
                const offset = i * (gap + lineWidth);
                linesHtml += `<div style="position:absolute; background:var(--theme-accent); ${getLineStyle(position, offset, size, lineWidth)}"></div>`;
            }
            return `<div class="master-shape ${decorativeClass} corner-lines-dynamic" style="${posStyle}; width: ${size}px; height: ${size}px; opacity: ${opacity}; overflow: hidden;">${linesHtml}</div>`;
        }
        case 'accent-circle': {
            const size = thicknessConfig.size || 100;
            const offset = thicknessConfig.offset || -25;
            const opacity = defaultStyle?.opacity || 0.08;
            const posStyle = getCornerPositionStyle(position, size, offset);
            const style = `${posStyle}; width: ${size}px; height: ${size}px; border-radius: 50%; opacity: ${opacity};`;
            return `<div class="master-shape ${decorativeClass} accent-circle-dynamic" style="${style}"></div>`;
        }
        case 'accent-ring': {
            const size = thicknessConfig.size || 80;
            const strokeWidth = thicknessConfig.strokeWidth || 3;
            const offset = thicknessConfig.offset || -20;
            const opacity = defaultStyle?.opacity || 0.15;
            const posStyle = getCornerPositionStyle(position, size, offset);
            const style = `${posStyle}; width: ${size}px; height: ${size}px; border-radius: 50%; border: ${strokeWidth}px solid var(--theme-accent); background: transparent; opacity: ${opacity};`;
            return `<div class="master-shape ${decorativeClass} accent-ring-dynamic" style="${style}"></div>`;
        }
        default:
            return '';
    }
}

/**
 * Get CSS position style for corner positions (tl, tr, bl, br) or side positions (left, right, top, bottom)
 */
function getCornerPositionStyle(position, size, offset = 20) {
    switch (position) {
        case 'tl': return `position: absolute; top: ${offset}px; left: ${offset}px`;
        case 'tr': return `position: absolute; top: ${offset}px; right: ${offset}px`;
        case 'bl': return `position: absolute; bottom: ${offset}px; left: ${offset}px`;
        case 'br': return `position: absolute; bottom: ${offset}px; right: ${offset}px`;
        case 'left': return `position: absolute; top: 0; bottom: 0; left: 0`;
        case 'right': return `position: absolute; top: 0; bottom: 0; right: 0`;
        case 'top': return `position: absolute; left: 0; right: 0; top: 0`;
        case 'bottom': return `position: absolute; left: 0; right: 0; bottom: 0`;
        default: return '';
    }
}

/**
 * Generate CSS position style for placeholders
 */
function generatePlaceholderPositionStyle(posConfig) {
    const styles = [];
    if (posConfig.top !== undefined) styles.push(`top: ${posConfig.top}px`);
    if (posConfig.bottom !== undefined) styles.push(`bottom: ${posConfig.bottom}px`);
    if (posConfig.left !== undefined) styles.push(`left: ${posConfig.left}px`);
    if (posConfig.right !== undefined) styles.push(`right: ${posConfig.right}px`);
    return styles.join('; ');
}

/**
 * Get line style for corner-lines based on position
 */
function getLineStyle(position, offset, size, lineWidth) {
    // Diagonal lines from corner
    switch (position) {
        case 'tl': return `top: ${offset}px; left: 0; width: ${size - offset}px; height: ${lineWidth}px; transform: rotate(-45deg); transform-origin: top left;`;
        case 'tr': return `top: ${offset}px; right: 0; width: ${size - offset}px; height: ${lineWidth}px; transform: rotate(45deg); transform-origin: top right;`;
        case 'bl': return `bottom: ${offset}px; left: 0; width: ${size - offset}px; height: ${lineWidth}px; transform: rotate(45deg); transform-origin: bottom left;`;
        case 'br': return `bottom: ${offset}px; right: 0; width: ${size - offset}px; height: ${lineWidth}px; transform: rotate(-45deg); transform-origin: bottom right;`;
        default: return '';
    }
}

/**
 * Calculate content area bounds based on header/footer placeholders and space-occupying shapes
 * Note: Decorative shapes (corner, corner-dots, accent-circle) do NOT affect bounds
 * Returns { top, right, bottom, left } in pixels
 */
function getContentBounds() {
    // Use the config-loader function
    return getContentBoundsFromConfig(state);
}

/**
 * Render content boundary with zone visualization
 */
function renderContentBoundary() {
    const slideWidth = SLIDE_CONFIG.width;
    const slideHeight = SLIDE_CONFIG.height;
    const hasTitle = state.masterContentAreas.titleStyle !== 'none';
    // Check if any footer element is enabled
    const hasSourceCitation = state.masterContentAreas.sourceStyle === 'citation';
    const hasPageNumber = state.masterPlaceholders['page-number']?.enabled;
    const hasDate = state.masterPlaceholders['date']?.enabled;
    const hasFooter = hasSourceCitation || hasPageNumber || hasDate;

    let html = '';

    // Header boundary
    if (hasTitle) {
        const headerBounds = getHeaderBoundsFromConfig(state);
        const headerWidth = slideWidth - headerBounds.left - headerBounds.right;
        html += `
            <div class="content-boundary header-boundary" style="top: ${headerBounds.top}px; left: ${headerBounds.left}px; width: ${headerWidth}px; height: ${headerBounds.height}px;">
                <div class="content-boundary-label">Header (${headerWidth}×${headerBounds.height}px)</div>
            </div>
        `;
    }

    // Body boundary
    const bodyBounds = getBodyBoundsFromConfig(state, hasTitle);
    const bodyWidth = slideWidth - bodyBounds.left - bodyBounds.right;
    const bodyHeight = slideHeight - bodyBounds.top - bodyBounds.bottom;

    const gridLayout = GRID_LAYOUTS[state.gridLayout];
    const zoneColors = {
        'A': 'rgba(56, 161, 105, 0.15)',
        'B': 'rgba(66, 153, 225, 0.15)',
        'C': 'rgba(237, 137, 54, 0.15)',
        'D': 'rgba(159, 122, 234, 0.15)'
    };

    let zonesHtml = '';
    if (gridLayout) {
        if (gridLayout.direction === 'grid') {
            zonesHtml = `<div class="zone-grid-2x2">
                ${gridLayout.zones.map(zone => {
                    const contentType = state.zoneContents[zone.id] || 'text';
                    return `<div class="zone-box" style="background: ${zoneColors[zone.id]}">
                        <span class="zone-label">${zone.id}</span>
                        <span class="zone-type">${contentType}</span>
                    </div>`;
                }).join('')}
            </div>`;
        } else if (gridLayout.direction === 'custom') {
            zonesHtml = `<div class="zone-custom-layout" data-layout="${state.gridLayout}">
                ${gridLayout.zones.map(zone => {
                    const contentType = state.zoneContents[zone.id] || 'text';
                    return `<div class="zone-box" style="flex: ${zone.flex}; background: ${zoneColors[zone.id]}">
                        <span class="zone-label">${zone.id}</span>
                        <span class="zone-type">${contentType}</span>
                    </div>`;
                }).join('')}
            </div>`;
        } else {
            const direction = gridLayout.direction === 'column' ? 'column' : 'row';
            zonesHtml = `<div class="zone-flex-layout" style="flex-direction: ${direction}">
                ${gridLayout.zones.map(zone => {
                    const contentType = state.zoneContents[zone.id] || 'text';
                    return `<div class="zone-box" style="flex: ${zone.flex}; background: ${zoneColors[zone.id]}">
                        <span class="zone-label">${zone.id}</span>
                        <span class="zone-type">${contentType}</span>
                    </div>`;
                }).join('')}
            </div>`;
        }
    }

    const bodyLabel = gridLayout ? `Body (${bodyWidth}×${bodyHeight}px) · ${gridLayout.label}` : `Body (${bodyWidth}×${bodyHeight}px)`;
    html += `
        <div class="content-boundary body-boundary" style="top: ${bodyBounds.top}px; left: ${bodyBounds.left}px; width: ${bodyWidth}px; height: ${bodyHeight}px;">
            <div class="content-boundary-label">${bodyLabel}</div>
            ${zonesHtml}
        </div>
    `;

    // Footer boundary (shown if any footer element is enabled)
    if (hasFooter) {
        const contentBounds = getContentBoundsFromConfig(state);
        const footerWidth = slideWidth - contentBounds.left - contentBounds.right;
        const footerHeight = CONTENT_AREAS.footer.getHeight(state.masterContentAreas.footerHeight || 'compact');
        html += `
            <div class="content-boundary footer-boundary" style="left: ${contentBounds.left}px; right: ${contentBounds.right}px; bottom: ${contentBounds.bottom}px; height: ${footerHeight}px; width: ${footerWidth}px;">
                <div class="content-boundary-label">Footer (${footerWidth}×${footerHeight}px)</div>
            </div>
        `;
    }

    return html;
}

function renderContentLayer() {
    if (state.pageType === 'cover') return renderCover();
    if (state.pageType === 'divider') return renderDivider();
    if (state.pageType === 'content-smartart') return renderSmartartPage();
    if (state.pageType === 'content-grid') return renderGridContent();
    return '';
}

// Cover Page Rendering
function renderCover() {
    const layout = COVER_LAYOUTS[state.coverLayout];
    if (!layout) return '';
    const content = state.coverContent || {};

    let html = '<div class="cover-container">';

    // Render shapes
    (layout.shapes || []).forEach(shape => {
        html += renderCoverShape(shape);
    });

    // Render text areas
    const textAreas = layout.textAreas || {};
    if (textAreas.year && content.year) {
        html += renderCoverTextArea(textAreas.year, content.year);
    }
    if (textAreas.tag && content.tag) {
        html += renderCoverTextArea(textAreas.tag, content.tag);
    }
    if (textAreas.title && content.title) {
        html += renderCoverTextArea(textAreas.title, content.title);
    }
    if (textAreas.highlight && content.highlight) {
        html += renderCoverTextArea(textAreas.highlight, content.highlight);
    }
    if (textAreas.subtitle && content.subtitle) {
        html += renderCoverTextArea(textAreas.subtitle, content.subtitle);
    }

    // Render brand tag if present
    if (layout.brandTag && content.brandTag) {
        html += renderCoverTextArea(layout.brandTag, content.brandTag);
    }

    // Render footer
    if (layout.footer && layout.footer.enabled) {
        html += renderCoverFooter(layout.footer, content.footer || {});
    }

    html += '</div>';
    return html;
}

function resolveCoverColor(colorRef) {
    if (colorRef.startsWith('#')) return colorRef;
    // Map color references to CSS variables
    const colorMap = {
        'accent': 'var(--theme-accent)',
        'accent1': 'var(--theme-accent1, var(--theme-accent))',
        'accent2': 'var(--theme-accent2, var(--theme-accent))',
        'accent3': 'var(--theme-accent3, var(--theme-accent))',
        'accent4': 'var(--theme-accent4, var(--theme-accent))',
        'text': 'var(--theme-text)',
        'text_muted': 'var(--theme-text-muted)',
        'primary': 'var(--theme-primary)',
        'bg': 'var(--theme-bg)',
        'bg2': 'var(--theme-card-bg, var(--theme-bg))',
        'tx2': 'var(--theme-accent1, var(--theme-accent))',
    };
    return colorMap[colorRef] || 'var(--theme-accent)';
}

function renderCoverShape(shape) {
    const { type, x, y, w, h, fill, rotation } = shape;
    const color = resolveCoverColor(fill || 'accent');
    let style = `position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: ${h}px; background: ${color};`;
    if (rotation) style += ` transform: rotate(${rotation}deg);`;

    let shapeClass = 'cover-shape';
    if (type === 'ellipse') {
        style += ' border-radius: 50%;';
    } else if (type === 'triangle' || type === 'rtTriangle') {
        // CSS triangle using borders
        style = `position: absolute; left: ${x}px; top: ${y}px; width: 0; height: 0;`;
        style += ` border-left: ${w}px solid transparent; border-bottom: ${h}px solid ${color};`;
        if (rotation) style += ` transform: rotate(${rotation}deg); transform-origin: bottom left;`;
    }

    return `<div class="${shapeClass}" style="${style}"></div>`;
}

function renderCoverTextArea(config, text) {
    const { x, y, w, h, fontSize, color, bold, align } = config;
    const textColor = resolveCoverColor(color || 'text');
    let style = `position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: ${h}px;`;
    style += ` font-size: ${fontSize || 16}px; color: ${textColor};`;
    if (bold) style += ' font-weight: bold;';
    if (align) style += ` text-align: ${align};`;
    return `<div class="cover-text" style="${style}">${text}</div>`;
}

function renderCoverFooter(footerConfig, footerContent) {
    const bar = footerConfig.bar || {};
    const barColor = resolveCoverColor(bar.fill || 'bg2');
    const barStyle = `position: absolute; left: ${bar.x}px; top: ${bar.y}px; width: ${bar.w}px; height: ${bar.h}px; background: ${barColor}; border-radius: ${bar.type === 'roundRect' ? '8px' : '0'};`;

    const location = footerContent.location || '芝士科技大厦';
    const date = footerContent.date || '2025.01';
    const contact = footerContent.contact || '400-123-4567';
    const logo = footerContent.logo || 'LOGO';

    return `
        <div class="cover-footer-bar" style="${barStyle}">
            <div class="cover-footer-items">
                <span class="cover-footer-item"><span class="icon">📍</span>${location}</span>
                <span class="cover-footer-item"><span class="icon">📅</span>${date}</span>
                <span class="cover-footer-item"><span class="icon">📞</span>${contact}</span>
                <span class="cover-footer-logo">${logo}</span>
            </div>
        </div>
    `;
}

function renderGridContent() {
    const gridLayout = GRID_LAYOUTS[state.gridLayout];
    if (!gridLayout) return '';

    const hasTitle = state.masterContentAreas.titleStyle !== 'none';
    // Check if any footer element is enabled (source citation, page-number, date)
    const hasSourceCitation = state.masterContentAreas.sourceStyle === 'citation';
    const hasPageNumber = state.masterPlaceholders['page-number']?.enabled;
    const hasDate = state.masterPlaceholders['date']?.enabled;
    const hasFooter = hasSourceCitation || hasPageNumber || hasDate;

    let html = '';

    // Header area (title) - always at top, separate from body
    if (hasTitle) {
        const headerBounds = getHeaderBoundsFromConfig(state);
        const headerStyle = `position: absolute; top: ${headerBounds.top}px; left: ${headerBounds.left}px; right: ${headerBounds.right}px; height: ${headerBounds.height}px; display: flex; flex-direction: column; justify-content: flex-end;`;

        if (state.masterContentAreas.titleStyle === 'simple') {
            html += `<div class="header-area" style="${headerStyle}"><div class="title-zone"><h1>市场趋势分析</h1></div></div>`;
        } else if (state.masterContentAreas.titleStyle === 'with-tag') {
            html += `<div class="header-area" style="${headerStyle}"><div class="title-zone"><span class="title-tag">分析报告</span><h1>市场趋势分析</h1></div></div>`;
        }
    }

    // Body area (content zones) - starts below header
    const bodyBounds = getBodyBoundsFromConfig(state, hasTitle);
    const bodyStyle = `position: absolute; top: ${bodyBounds.top}px; left: ${bodyBounds.left}px; right: ${bodyBounds.right}px; bottom: ${bodyBounds.bottom}px; display: flex; flex-direction: column; overflow: hidden;`;

    const direction = gridLayout.direction === 'column' ? 'column' : 'row';
    let layoutClass;
    let customDataAttr = '';
    if (gridLayout.direction === 'grid') {
        // Support different grid sizes: 2x2, 3x2, 4x6, etc.
        const cols = gridLayout.columns || 2;
        const rows = gridLayout.rows || 2;
        layoutClass = `grid-layout-${cols}x${rows}`;
    } else if (gridLayout.direction === 'custom') {
        layoutClass = 'custom-layout';
        customDataAttr = ` data-layout="${gridLayout.customType || 'top-two-bottom'}"`;
    } else {
        layoutClass = `flex-layout-${direction}`;
    }

    let bodyHtml = `<div class="grid-content ${layoutClass}"${customDataAttr} style="flex: 1;">`;
    gridLayout.zones.forEach(zone => {
        const contentType = state.zoneContents[zone.id] || 'text';
        const flexStyle = zone.flex ? `flex: ${zone.flex}` : '';
        bodyHtml += `<div class="grid-zone" style="${flexStyle}">
            ${renderZoneContent(contentType, zone.id)}
        </div>`;
    });
    bodyHtml += `</div>`;

    html += `<div class="body-area" style="${bodyStyle}">${bodyHtml}</div>`;

    // Footer area (source citation) - inside baseMargin area at bottom
    if (hasSourceCitation) {
        const contentBounds = getContentBoundsFromConfig(state);
        const footerHeight = CONTENT_AREAS.footer.getHeight(state.masterContentAreas.footerHeight || 'compact');
        // Footer sits inside baseMargin, not at its top edge
        const footerBottom = 10;  // Small offset from slide bottom
        const footerAreaStyle = `position: absolute; left: ${contentBounds.left}px; right: ${contentBounds.right}px; bottom: ${footerBottom}px; height: ${footerHeight}px;`;
        html += `<div class="footer-area" style="${footerAreaStyle}"><div class="source-zone">数据来源：行业研究报告 2024</div></div>`;
    }

    return html;
}

// Sample chart configurations - portable format for both ECharts (frontend) and python-pptx (export)
const CHART_SAMPLES = [
    {
        title: '月度销售趋势',
        chartType: 'line',  // python-pptx: LINE_MARKERS
        categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
        series: [{ name: '销售额', data: [820, 932, 901, 1234, 1290, 1430] }],
        // ECharts specific options
        echarts: {
            grid: { top: 30, right: 20, bottom: 30, left: 40 },
            smooth: true,
            areaStyle: { opacity: 0.3 }
        }
    },
    {
        title: '市场份额分布',
        chartType: 'pie',  // python-pptx: PIE
        categories: ['产品A', '产品B', '产品C', '其他'],
        series: [{ name: '份额', data: [35, 28, 22, 15] }],
        echarts: {
            radius: ['40%', '70%'],
            label: { fontSize: 10 }
        }
    },
    {
        title: '季度对比分析',
        chartType: 'bar',  // python-pptx: COLUMN_CLUSTERED
        categories: ['Q1', 'Q2', 'Q3', 'Q4'],
        series: [
            { name: '2023', data: [120, 145, 168, 190] },
            { name: '2024', data: [150, 178, 195, 230] }
        ],
        echarts: {
            grid: { top: 30, right: 20, bottom: 30, left: 40 },
            barGap: '10%'
        }
    },
    {
        title: '用户增长曲线',
        chartType: 'area',  // python-pptx: AREA
        categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        series: [{ name: 'DAU', data: [150, 230, 224, 318, 435, 410, 520] }],
        echarts: {
            grid: { top: 30, right: 20, bottom: 30, left: 50 },
            smooth: true,
            areaStyle: { opacity: 0.5 }
        }
    },
];

// Convert portable chart data to ECharts option
function toEChartsOption(chartData) {
    const { chartType, categories, series, echarts: opts = {} } = chartData;

    if (chartType === 'pie') {
        return {
            series: [{
                type: 'pie',
                radius: opts.radius || '50%',
                center: ['50%', '50%'],
                label: opts.label || { fontSize: 10 },
                data: categories.map((name, i) => ({ name, value: series[0].data[i] }))
            }]
        };
    }

    // Line, bar, area charts
    const option = {
        grid: opts.grid || { top: 30, right: 20, bottom: 30, left: 40 },
        xAxis: {
            type: 'category',
            data: categories,
            axisLine: { lineStyle: { color: '#ccc' } },
            axisLabel: { color: '#666', fontSize: 10 }
        },
        yAxis: {
            type: 'value',
            axisLine: { show: false },
            splitLine: { lineStyle: { color: '#eee' } },
            axisLabel: { color: '#666', fontSize: 10 }
        },
        series: series.map(s => {
            const seriesOpt = {
                type: chartType === 'area' ? 'line' : chartType,
                name: s.name,
                data: s.data
            };
            if (chartType === 'line' || chartType === 'area') {
                seriesOpt.smooth = opts.smooth !== false;
            }
            if (chartType === 'area') {
                seriesOpt.areaStyle = opts.areaStyle || { opacity: 0.5 };
            }
            if (chartType === 'bar' && opts.barGap) {
                seriesOpt.barGap = opts.barGap;
            }
            return seriesOpt;
        })
    };

    return option;
}

// Expose CHART_SAMPLES for JSON export
window.CHART_SAMPLES = CHART_SAMPLES;

const TEXT_SAMPLES = [
    { title: '核心优势', content: '通过技术创新和精细化运营，我们在行业内建立了独特的竞争壁垒，持续为客户创造价值。' },
    { title: '市场洞察', content: '根据最新市场研究，目标用户群体呈现年轻化趋势，数字化需求显著提升，为业务增长提供新机遇。' },
    { title: '战略方向', content: '聚焦核心业务，深化技术布局，拓展国际市场，构建可持续发展的商业生态系统。' },
    { title: '执行要点', content: '明确目标分解、资源高效配置、敏捷迭代推进、数据驱动决策，确保战略落地执行。' },
];

const METRIC_SAMPLES = [
    { value: '127%', label: '营收增长率', trend: '↑' },
    { value: '4.8', label: '客户满意度', trend: '★' },
    { value: '98.5%', label: '系统可用性', trend: '●' },
    { value: '2.3M', label: '活跃用户数', trend: '↑' },
];

const BULLETS_SAMPLES = [
    ['完成核心产品迭代升级', '拓展3个新兴市场区域', '团队规模增长40%', '获得行业创新大奖'],
    ['优化用户体验流程', '提升转化率15%', '降低获客成本20%', '建立品牌合作矩阵'],
    ['技术架构全面升级', '数据安全通过认证', '响应速度提升50%', '支持百万级并发'],
    ['建立人才培养体系', '完善绩效考核机制', '提升员工满意度', '降低人员流失率'],
];

const TABLE_SAMPLES = [
    { title: '季度业绩对比', headers: ['指标', 'Q1', 'Q2', 'Q3'], rows: [['营收', '120M', '145M', '168M'], ['利润', '18M', '22M', '28M']] },
    { title: '产品数据概览', headers: ['产品', '用户数', '增长率'], rows: [['产品A', '850K', '+12%'], ['产品B', '620K', '+28%']] },
];

const IMAGE_SAMPLES = [
    { title: '产品展示', desc: '新品发布主视觉' },
    { title: '团队风采', desc: '年度合影照片' },
    { title: '场景应用', desc: '实际使用案例' },
    { title: '数据可视化', desc: '信息图表展示' },
];

function getZoneIndex(zoneId) {
    return zoneId.charCodeAt(0) - 65; // A=0, B=1, C=2, etc.
}

function renderZoneContent(contentType, zoneId) {
    const idx = getZoneIndex(zoneId);

    switch (contentType) {
        case 'chart': {
            const sample = CHART_SAMPLES[idx % CHART_SAMPLES.length];
            return `<div class="zone-preview zone-chart-preview">
                <div class="chart-title">${sample.title}</div>
                <div class="chart-container" id="chart-${zoneId}"></div>
            </div>`;
        }
        case 'image': {
            const sample = IMAGE_SAMPLES[idx % IMAGE_SAMPLES.length];
            return `<div class="zone-preview zone-image-preview">
                <div class="image-icon">🖼️</div>
                <div class="image-title">${sample.title}</div>
                <div class="image-desc">${sample.desc}</div>
            </div>`;
        }
        case 'metric': {
            const sample = METRIC_SAMPLES[idx % METRIC_SAMPLES.length];
            return `<div class="zone-preview zone-metric-preview">
                <div class="metric-trend">${sample.trend}</div>
                <div class="metric-value">${sample.value}</div>
                <div class="metric-label">${sample.label}</div>
            </div>`;
        }
        case 'table': {
            const sample = TABLE_SAMPLES[idx % TABLE_SAMPLES.length];
            return `<div class="zone-preview zone-table-preview">
                <div class="table-title">${sample.title}</div>
                <table class="sample-table">
                    <thead><tr>${sample.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
                    <tbody>${sample.rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody>
                </table>
            </div>`;
        }
        case 'bullets': {
            const sample = BULLETS_SAMPLES[idx % BULLETS_SAMPLES.length];
            return `<div class="zone-preview zone-bullets-preview">
                <ul>${sample.map(item => `<li>${item}</li>`).join('')}</ul>
            </div>`;
        }
        case 'text':
        default: {
            const sample = TEXT_SAMPLES[idx % TEXT_SAMPLES.length];
            return `<div class="zone-preview zone-text-preview">
                <h3>${sample.title}</h3>
                <p>${sample.content}</p>
            </div>`;
        }
    }
}

function renderDivider() {
    const layout = state.dividerLayout;
    const idx = state.dividerIndex; // 0=全部, 1-4=specific section
    if (layout === 'strips') return renderStrips(idx);
    if (layout === 'cards') return renderCards(idx);
    if (layout === 'cards-highlight') return renderCardsHighlight(idx);
    if (layout === 'arrow') return renderArrow(idx);
    if (layout === 'fullbleed') return renderFullbleed(idx);
    if (layout === 'left-align') return renderLeftAlign(idx);
    if (layout === 'left-align-mirror') return renderLeftAlignMirror(idx);
    if (layout === 'left-align-minimal') return renderLeftAlignMinimal(idx);
    return '';
}

const SECTION_DATA = [
    { num: '1', zh: '年度工作概述', en: 'ANNUAL WORK OVERVIEW', part: '第一部分' },
    { num: '2', zh: '工作完成情况', en: 'WORK COMPLETION', part: '第二部分' },
    { num: '3', zh: '项目成果展示', en: 'PROJECT RESULTS', part: '第三部分' },
    { num: '4', zh: '工作不足与改进', en: 'IMPROVEMENTS', part: '第四部分' },
    { num: '5', zh: '未来发展规划', en: 'FUTURE PLANS', part: '第五部分' },
    { num: '6', zh: '总结与展望', en: 'SUMMARY & OUTLOOK', part: '第六部分' },
];

function getSectionData() {
    return SECTION_DATA.slice(0, state.dividerSectionCount);
}

// Number formatting based on style
const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI'];
const CHINESE_NUMERALS = ['一', '二', '三', '四', '五', '六'];
const CIRCLED_NUMERALS = ['①', '②', '③', '④', '⑤', '⑥'];

function formatNumber(n, style) {
    const idx = parseInt(n) - 1;
    switch (style || state.dividerNumberStyle) {
        case 'roman': return ROMAN_NUMERALS[idx] || n;
        case 'chinese': return CHINESE_NUMERALS[idx] || n;
        case 'circled': return CIRCLED_NUMERALS[idx] || n;
        case 'arabic':
        default: return n;
    }
}

function formatNumberPadded(n, style) {
    const formatted = formatNumber(n, style);
    // Only pad arabic numbers with leading zero
    if ((style || state.dividerNumberStyle) === 'arabic') {
        return '0' + formatted;
    }
    return formatted;
}

function formatPart(n, style) {
    const s = style || state.dividerNumberStyle;
    const num = formatNumber(n, s);
    switch (s) {
        case 'roman': return `Part ${num}`;
        case 'chinese': return `第${num}部分`;
        case 'circled': return `Part ${num}`;
        case 'arabic':
        default: return `第${num}部分`;
    }
}

function isCompact() {
    return state.dividerTextLevel === 'compact';
}

function renderStrips(activeIdx) {
    const sections = getSectionData();
    const compact = isCompact();
    return `
        <div class="toc-strips-left">
            <div class="toc-strips-label">CONTENTS</div>
            <h1 class="toc-strips-title">目录</h1>
            ${compact ? '' : '<div class="toc-strips-brand">WORK SUMMARY</div>'}
        </div>
        <div class="toc-strips-right">
            ${sections.map((item, i) => `
                <div class="toc-strip ${activeIdx > 0 && activeIdx - 1 === i ? 'active' : ''}" style="--strip-index:${i}">
                    <div class="strip-num">${formatNumberPadded(item.num)}</div>
                    ${compact ? '' : `<div class="strip-en">${item.en}</div>`}
                    <div class="strip-zh">${item.zh}</div>
                    ${compact ? '' : '<div class="strip-line"></div><div class="strip-desc">在这里输入本章节的简要概述</div>'}
                </div>
            `).join('')}
        </div>
    `;
}

function renderCards(activeIdx) {
    const sections = getSectionData();
    const compact = isCompact();
    return `
        <div class="toc-cards-header"><h1>目录 / CONTENTS</h1></div>
        <div class="toc-cards-grid">
            ${sections.map((item, i) => `
                <div class="toc-card ${activeIdx > 0 && activeIdx - 1 === i ? 'active' : ''}">
                    <div class="toc-card-num">${formatNumberPadded(item.num)}</div>
                    <div class="toc-card-title">${item.zh}</div>
                    ${compact ? '' : `<div class="toc-card-subtitle">${item.en}</div>
                    <div class="toc-card-divider"></div>
                    <ul class="toc-card-list"><li>${formatNumber(item.num)}.1 细分内容</li><li>${formatNumber(item.num)}.2 细分内容</li></ul>`}
                </div>
            `).join('')}
        </div>
    `;
}

function renderCardsHighlight(activeIdx) {
    const sections = getSectionData();
    const compact = isCompact();
    // activeIdx=0 means "全部", no highlight
    const showIdx = activeIdx > 0 ? activeIdx - 1 : -1;
    return `
        <div class="toc-highlight-header"><h1>目录</h1></div>
        <div class="toc-highlight-grid">
            ${sections.map((item, i) => `
                <div class="toc-highlight-card ${i === showIdx ? 'active' : ''}">
                    <div class="toc-highlight-title">${item.zh}</div>
                    ${compact ? '' : `<div class="toc-highlight-en">${item.en}</div>`}
                    <div class="toc-highlight-num">${formatNumber(item.num)}</div>
                </div>
            `).join('')}
        </div>
        ${compact ? '' : '<div class="toc-highlight-footer">PRIOR YEAR 2023 WORK SUMMARY</div>'}
    `;
}

function renderArrow(activeIdx) {
    const sections = getSectionData();
    const compact = isCompact();
    const idx = Math.min(activeIdx > 0 ? activeIdx - 1 : 0, sections.length - 1);
    const item = sections[idx];
    return `
        <div class="section-arrow-badge"><span>${formatPart(item.num)}</span></div>
        <h1 class="section-arrow-title">${item.zh}</h1>
        ${compact ? '' : `<p class="section-arrow-subtitle">${item.en}</p>
        <p class="section-arrow-desc">在这里输入本章节的简要概述，请将自己的内容在这个位置，展开简要描述</p>
        <div class="section-arrow-icons">
            <span>📋</span><span>📊</span><span>📁</span><span>👥</span><span>📥</span>
        </div>`}
    `;
}

function renderFullbleed(activeIdx) {
    const sections = getSectionData();
    const compact = isCompact();
    const idx = Math.min(activeIdx > 0 ? activeIdx - 1 : 0, sections.length - 1);
    const item = sections[idx];
    return `
        <div class="section-fullbleed-bg">PART ${formatNumberPadded(item.num)}</div>
        <div class="section-fullbleed-content">
            <div class="section-fullbleed-line"><span class="dot"></span><span class="line"></span></div>
            <h1 class="section-fullbleed-title">${item.zh}</h1>
            <div class="section-fullbleed-line"><span class="line"></span><span class="dot"></span></div>
            ${compact ? '' : `<p class="section-fullbleed-subtitle">${item.en}</p>
            <p class="section-fullbleed-desc">在这里输入本章节的简要概述，请将自己的内容在这个位置，展开简要描述</p>`}
        </div>
    `;
}

function renderLeftAlign(activeIdx) {
    const sections = getSectionData();
    const compact = isCompact();
    const idx = Math.min(activeIdx > 0 ? activeIdx - 1 : 0, sections.length - 1);
    const item = sections[idx];
    return `
        <div class="section-left-topline"></div>
        <div class="section-left-logo">/ LOGO</div>
        <div class="section-left-content">
            <div class="section-left-part">${formatPart(item.num)}</div>
            <h1 class="section-left-title">${item.zh}</h1>
            ${compact ? '' : `<p class="section-left-subtitle">${item.en}</p>`}
        </div>
        <div class="section-left-num">${formatNumber(item.num)}</div>
        ${compact ? '' : '<div class="section-left-footer">2023 WORK REPORT</div>'}
    `;
}

function renderLeftAlignMirror(activeIdx) {
    const sections = getSectionData();
    const compact = isCompact();
    const idx = Math.min(activeIdx > 0 ? activeIdx - 1 : 0, sections.length - 1);
    const item = sections[idx];
    return `
        <div class="section-left-topline mirror"></div>
        <div class="section-left-num mirror">${formatNumber(item.num)}</div>
        <div class="section-left-content mirror">
            <div class="section-left-part">${formatPart(item.num)}</div>
            <h1 class="section-left-title">${item.zh}</h1>
            ${compact ? '' : `<p class="section-left-subtitle">${item.en}</p>`}
        </div>
        <div class="section-left-logo mirror">LOGO /</div>
        ${compact ? '' : '<div class="section-left-footer mirror">2023 WORK REPORT</div>'}
    `;
}

function renderLeftAlignMinimal(activeIdx) {
    const sections = getSectionData();
    const compact = isCompact();
    const idx = Math.min(activeIdx > 0 ? activeIdx - 1 : 0, sections.length - 1);
    const item = sections[idx];
    return `
        <div class="section-left-content minimal">
            <div class="section-left-part">${formatPart(item.num)}</div>
            <h1 class="section-left-title">${item.zh}</h1>
            ${compact ? '' : `<p class="section-left-subtitle">${item.en}</p>`}
        </div>
        <div class="section-left-num">${formatNumber(item.num)}</div>
    `;
}

// SmartArt Page Rendering
function renderSmartartPage() {
    const placement = state.smartartPlacement;
    const typeInfo = SMARTART_TYPES[state.smartartType];
    const ooxmlId = typeInfo?.ooxmlId || state.smartartType;

    const smartartContainer = `<div class="smartart-main"><div id="smartart-render-target"></div></div>`;

    const descBlock = `
        <div class="smartart-desc-block">
            <h3>说明文字区域</h3>
            <p>这里可以放置对 SmartArt 图形的描述、解释或相关数据说明。</p>
            <ul>
                <li>要点一：关键信息</li>
                <li>要点二：补充说明</li>
                <li>要点三：总结概括</li>
            </ul>
        </div>
    `;

    let html = '';
    if (placement === 'full') {
        html = `<div class="smartart-layout smartart-full">${smartartContainer}</div>`;
    } else if (placement === 'left-desc') {
        html = `<div class="smartart-layout smartart-left-desc">${smartartContainer}<div class="smartart-side">${descBlock}</div></div>`;
    } else if (placement === 'right-desc') {
        html = `<div class="smartart-layout smartart-right-desc"><div class="smartart-side">${descBlock}</div>${smartartContainer}</div>`;
    } else if (placement === 'top-desc') {
        html = `<div class="smartart-layout smartart-top-desc">${smartartContainer}<div class="smartart-side">${descBlock}</div></div>`;
    } else if (placement === 'bottom-desc') {
        html = `<div class="smartart-layout smartart-bottom-desc"><div class="smartart-side">${descBlock}</div>${smartartContainer}</div>`;
    } else {
        html = smartartContainer;
    }

    // Schedule SmartArt rendering after DOM update (use requestAnimationFrame for smoother render)
    requestAnimationFrame(() => renderSmartArtChart());
    return html;
}

// Sample data for SmartArt (OOXML compatible format)
// More items than needed, will be sliced by smartartItemCount
const SMARTART_SAMPLE_DATA = {
    pyramid: ['战略愿景', '经营目标', '执行计划', '日常任务', '基础支撑', '资源保障'],
    // matrix: center node first, then 4 quadrants (top-left, top-right, bottom-left, bottom-right)
    matrix: ['战略矩阵', '高影响/低成本', '高影响/高成本', '低影响/低成本', '低影响/高成本'],
    cycle: ['计划', '执行', '检查', '改进', '总结', '优化'],
    process: ['需求分析', '方案设计', '开发实现', '测试验收', '上线运营', '迭代优化'],
    hierarchy: [
        { id: 'ceo', text: 'CEO' },
        { id: 'cto', text: 'CTO', parentId: 'ceo' },
        { id: 'cfo', text: 'CFO', parentId: 'ceo' },
        { id: 'dev', text: '研发部', parentId: 'cto' },
        { id: 'qa', text: '质量部', parentId: 'cto' },
        { id: 'fin', text: '财务部', parentId: 'cfo' },
    ],
    relationship: ['核心目标', '策略A', '策略B', '策略C', '策略D', '策略E'],
    list: ['要点一', '要点二', '要点三', '要点四', '要点五', '要点六'],
    picture: ['产品经理', '技术架构师', '项目经理', '设计师', 'QA工程师', '运维工程师'],
};

// SmartArt instance cache
let smartArtInstance = null;

function renderSmartArtChart() {
    const target = document.getElementById('smartart-render-target');
    if (!target || typeof SmartArt === 'undefined') return;

    const typeInfo = SMARTART_TYPES[state.smartartType];
    if (!typeInfo) return;

    // Get sample data based on category and slice by count
    const category = typeInfo.category;
    const count = state.smartartItemCount || 4;
    let sampleData = SMARTART_SAMPLE_DATA[category] || SMARTART_SAMPLE_DATA.list;
    // Slice to requested count (hierarchy/matrix are special - fixed structure)
    if (category !== 'hierarchy' && category !== 'matrix') {
        sampleData = sampleData.slice(0, count);
    }

    // Use custom items if available, otherwise use sample data
    // Initialize smartartItems if count changed or not set
    const expectedCount = (category === 'hierarchy' || category === 'matrix') ? sampleData.length : count;
    if (!state.smartartItems || state.smartartItems.length !== expectedCount) {
        state.smartartItems = sampleData.map(item =>
            typeof item === 'string' ? item : (item.text || item)
        );
    }
    const items = state.smartartItems;

    // Calculate size based on placement
    const isVertical = state.smartartPlacement === 'top-desc' || state.smartartPlacement === 'bottom-desc';
    const isFull = state.smartartPlacement === 'full';
    const width = isFull ? 1000 : (isVertical ? 1000 : 600);
    const height = isFull ? 500 : (isVertical ? 300 : 450);

    // Get theme colors from color scheme
    const themeColors = getSmartArtColorsFromScheme(state.smartartColorScheme);

    try {
        // Dispose previous instance
        if (smartArtInstance) {
            smartArtInstance.dispose();
        }

        // Create new SmartArt instance
        smartArtInstance = SmartArt.init(target);
        smartArtInstance.setOption({
            type: state.smartartType,
            items: items,
            size: { width, height },
            theme: themeColors
        });

        // Listen for text edits (remove old listener first to avoid duplicates)
        target.removeEventListener('smartart-text-change', handleSmartartTextChange);
        target.addEventListener('smartart-text-change', handleSmartartTextChange);
    } catch (e) {
        console.warn('SmartArt render failed:', e.message);
        target.innerHTML = `<div class="smartart-fallback">
            <div class="smartart-icon">${SMARTART_CATEGORIES[typeInfo.category]?.icon || '📊'}</div>
            <div class="smartart-type-name">${typeInfo.label}</div>
        </div>`;
    }
}

// Handle SmartArt text edits
function handleSmartartTextChange(e) {
    const { shapeId, text } = e.detail;
    // Extract index from shapeId (e.g., "list-2" -> 2)
    const match = shapeId.match(/(\d+)$/);
    if (match && state.smartartItems) {
        const idx = parseInt(match[1], 10);
        if (idx >= 0 && idx < state.smartartItems.length) {
            state.smartartItems[idx] = text;
        }
    }
}

// Convert color scheme ID to SmartArt accent colors (uses current theme's accentColors)
function getSmartArtColorsFromScheme(schemeId) {
    // Get dynamic color schemes based on current theme
    const colorSchemes = getSmartArtColorSchemes(state.theme);

    // Find the scheme
    let accents = null;
    for (const group of colorSchemes) {
        const item = group.items.find(i => i.id === schemeId);
        if (item && item.accents) {
            accents = item.accents;
            break;
        }
    }

    // Default to theme's accentColors if scheme not found
    if (!accents) {
        const theme = window.THEMES?.[state.theme];
        accents = theme?.accentColors || ['#156082', '#E97132', '#196B24', '#0F9ED5', '#A02B93', '#4EA72E'];
    }

    return {
        accent1: accents[0],
        accent2: accents[1],
        accent3: accents[2],
        accent4: accents[3],
        accent5: accents[4],
        accent6: accents[5],
        light1: '#FFFFFF',
        dark1: '#000000'
    };
}

// Map app themes to SmartArt color schemes (legacy, kept for reference)
function getSmartArtThemeColors(themeName) {
    const themeMap = {
        'soft_peach_cream': { accent1: '#E8998D', accent2: '#F2C4B6', accent3: '#A8DADC', accent4: '#457B9D', accent5: '#1D3557', accent6: '#F4A261' },
        'executive': { accent1: '#2C3E50', accent2: '#34495E', accent3: '#7F8C8D', accent4: '#95A5A6', accent5: '#BDC3C7', accent6: '#ECF0F1' },
        'forest_green': { accent1: '#2D5016', accent2: '#4A7C23', accent3: '#6B8E23', accent4: '#8FBC8F', accent5: '#556B2F', accent6: '#9ACD32' },
        'sunset_orange': { accent1: '#E74C3C', accent2: '#F39C12', accent3: '#E67E22', accent4: '#D35400', accent5: '#C0392B', accent6: '#F1C40F' },
        'cosmic': { accent1: '#6C5CE7', accent2: '#A29BFE', accent3: '#74B9FF', accent4: '#0984E3', accent5: '#00CEC9', accent6: '#81ECEC' },
        'azure': { accent1: '#4472C4', accent2: '#5B9BD5', accent3: '#70AD47', accent4: '#FFC000', accent5: '#ED7D31', accent6: '#A5A5A5' },
    };
    const colors = themeMap[themeName] || themeMap['azure'];
    return { ...colors, light1: '#FFFFFF', dark1: '#000000' };
}

// Expose for JSON export
window.getSmartArtOOXML = function() {
    if (smartArtInstance) {
        return smartArtInstance.toOOXML();
    }
    return null;
};

function renderLayoutContent() {
    let html = '';
    if (state.masterContentAreas.titleStyle === 'simple') html += `<div class="title-zone"><h1>市场趋势分析</h1></div>`;
    else if (state.masterContentAreas.titleStyle === 'with-tag') html += `<div class="title-zone"><span class="title-tag">分析报告</span><h1>市场趋势分析</h1></div>`;
    html += renderLayoutStructure();
    if (state.masterContentAreas.sourceStyle === 'citation') html += `<div class="source-zone">数据来源：行业研究报告 2024</div>`;
    return html;
}
