// Master layer rendering functions

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

function getContentBounds() {
    return getContentBoundsFromConfig(state);
}

function renderContentBoundary() {
    const slideWidth = SLIDE_CONFIG.width;
    const slideHeight = SLIDE_CONFIG.height;
    const hasTitle = state.masterContentAreas.titleStyle !== 'none';
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

    // Footer boundary
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
