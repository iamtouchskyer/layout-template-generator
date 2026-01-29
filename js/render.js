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
    masterLayer.innerHTML = renderMasterLayer();
    contentLayer.innerHTML = renderContentLayer();
    updateNavValues();
    if (state.previewTab === 'json') updateJsonOutput();
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
    if (state.pageType === 'cover') return `<h1 class="page-title">演示文稿标题</h1><p class="page-subtitle">副标题或作者信息</p>`;
    if (state.pageType === 'divider') return renderDivider();
    if (state.pageType === 'content-smartart') return renderSmartartPage();
    if (state.pageType === 'content-grid') return renderGridContent();
    return '';
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

function renderZoneContent(contentType, zoneId) {
    switch (contentType) {
        case 'chart':
            return `<div class="zone-preview zone-chart-preview">
                <div class="chart-placeholder">📊 Chart ${zoneId}</div>
            </div>`;
        case 'image':
            return `<div class="zone-preview zone-image-preview">
                <div class="image-placeholder">🖼️ Image ${zoneId}</div>
            </div>`;
        case 'metric':
            return `<div class="zone-preview zone-metric-preview">
                <div class="metric-value">85%</div>
                <div class="metric-label">关键指标</div>
            </div>`;
        case 'table':
            return `<div class="zone-preview zone-table-preview">
                <div class="table-placeholder">📋 Table ${zoneId}</div>
            </div>`;
        case 'bullets':
            return `<div class="zone-preview zone-bullets-preview">
                <ul><li>要点一</li><li>要点二</li><li>要点三</li></ul>
            </div>`;
        case 'text':
        default:
            return `<div class="zone-preview zone-text-preview">
                <h3>区域 ${zoneId}</h3>
                <p>这里是文本内容区域，可以放置段落、描述或说明文字。</p>
            </div>`;
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

    // Schedule infographic rendering after DOM update
    setTimeout(() => renderInfographic(), 0);
    return html;
}

// Sample data for different SmartArt types
const SMARTART_SAMPLE_DATA = {
    sequential: [
        { label: '第一阶段', value: 25, description: '规划与准备' },
        { label: '第二阶段', value: 50, description: '执行与开发' },
        { label: '第三阶段', value: 75, description: '测试与优化' },
        { label: '第四阶段', value: 100, description: '发布与维护' },
    ],
    funnel: [
        { label: '曝光', value: 10000, description: '广告展示' },
        { label: '点击', value: 3000, description: '用户点击' },
        { label: '注册', value: 800, description: '完成注册' },
        { label: '付费', value: 200, description: '付费转化' },
    ],
    journey: [
        { label: '需求分析', description: '明确项目目标' },
        { label: '方案设计', description: '制定实施计划' },
        { label: '开发实现', description: '编码与集成' },
        { label: '上线运营', description: '部署与监控' },
    ],
    hierarchy: [
        { label: '战略层', description: '企业愿景与目标' },
        { label: '管理层', description: '资源调配与决策' },
        { label: '执行层', description: '任务执行与反馈' },
        { label: '支撑层', description: '基础设施与工具' },
    ],
    comparison: [
        { label: '方案 A', description: '成本低，周期长' },
        { label: '方案 B', description: '成本中，周期中' },
        { label: '方案 C', description: '成本高，周期短' },
    ],
};

function renderInfographic() {
    const target = document.getElementById('smartart-render-target');
    if (!target) return;

    const typeInfo = SMARTART_TYPES[state.smartartType];
    if (!typeInfo) return;

    const dataType = typeInfo.dataType || 'comparison';
    const sampleData = SMARTART_SAMPLE_DATA[dataType] || SMARTART_SAMPLE_DATA.comparison;

    // Calculate size based on placement
    const isVertical = state.smartartPlacement === 'top-desc' || state.smartartPlacement === 'bottom-desc';
    const isFull = state.smartartPlacement === 'full';
    const width = isFull ? 1000 : (isVertical ? 1000 : 600);
    const height = isFull ? 500 : (isVertical ? 300 : 450);

    // Map theme to infographic color scheme
    const themeToScheme = {
        'soft_peach_cream': 'warm',
        'executive': 'professional',
        'forest_green': 'nature',
        'sunset_orange': 'sunset',
        'cosmic': 'cool',
        'azure': 'professional',
        'bright_red_blue': 'vibrant',
        'bright_blue_red': 'vibrant',
        'deep_red_blue': 'professional',
        'deep_green_gold': 'nature',
        'deep_blue_gold': 'professional',
        'blue_green_gold': 'ocean',
    };
    const colorScheme = themeToScheme[state.theme] || 'professional';

    try {
        target.innerHTML = '';
        new Infographic({
            container: target,
            type: state.smartartType,
            data: sampleData,
            width: width,
            height: height,
            theme: colorScheme,
        });
    } catch (e) {
        console.warn('Infographic render failed:', e.message);
        target.innerHTML = `<div class="smartart-fallback">
            <div class="smartart-icon">${SMARTART_CATEGORIES[typeInfo.category]?.icon || '📊'}</div>
            <div class="smartart-type-name">${typeInfo.label}</div>
            <div class="smartart-error">${e.message}</div>
        </div>`;
    }
}

function renderLayoutContent() {
    let html = '';
    if (state.masterContentAreas.titleStyle === 'simple') html += `<div class="title-zone"><h1>市场趋势分析</h1></div>`;
    else if (state.masterContentAreas.titleStyle === 'with-tag') html += `<div class="title-zone"><span class="title-tag">分析报告</span><h1>市场趋势分析</h1></div>`;
    html += renderLayoutStructure();
    if (state.masterContentAreas.sourceStyle === 'citation') html += `<div class="source-zone">数据来源：行业研究报告 2024</div>`;
    return html;
}
