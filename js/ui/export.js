// Export and Navigation Functions

/**
 * Select layout type (for card-based layouts)
 */
function selectLayoutType(layoutId) {
    state.layoutType = layoutId;
    updateCardSlots();
    renderLayoutTypes();
    render();
}

/**
 * Update card type at index
 */
function updateCardType(index, type) {
    state.cards[index].type = type;
    render();
}

/**
 * Update card slots based on current layout
 */
function updateCardSlots() {
    const layout = LAYOUT_TYPES[state.layoutType];
    const zones = layout ? layout.zones : ['text'];
    const newCards = zones.map((zone, i) => {
        if (state.cards[i]) return state.cards[i];
        return { type: ZONE_TO_CARD_TYPE[zone] || 'text' };
    });
    state.cards = newCards;

    const container = document.getElementById('card-slots');
    container.innerHTML = state.cards.map((card, i) => {
        const zoneName = zones[i] || 'content';
        return `
            <div class="card-slot">
                <span class="slot-index">${i + 1}</span>
                <div style="flex:1;">
                    <div style="font-size:10px;color:var(--text-secondary);margin-bottom:4px;">${zoneName}</div>
                    <select onchange="updateCardType(${i}, this.value)">
                        ${CARD_TYPES.map(t => `<option value="${t.id}" ${card.type === t.id ? 'selected' : ''}>${t.label}</option>`).join('')}
                    </select>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Update navigation display values (L1/L2 info)
 */
function updateNavValues() {
    const shapeCount = state.masterShapes.length;
    const themeName = document.getElementById('theme-select').selectedOptions[0].text;
    document.getElementById('nav-l1-value').textContent = `${themeName.split(' ')[0]} + ${shapeCount} shapes`;

    // L2 value
    let l2Value = state.pageType;
    if (state.pageType === 'divider') {
        const dividerLayout = DIVIDER_LAYOUTS[state.dividerLayout];
        const indexLabel = state.dividerIndex === 0 ? '全部' : state.dividerIndex;
        l2Value = `${dividerLayout?.label || state.dividerLayout} (${indexLabel})`;
    } else if (state.pageType === 'content-smartart') {
        const smartartType = SMARTART_TYPES[state.smartartType];
        const placement = SMARTART_PLACEMENTS[state.smartartPlacement];
        l2Value = `${smartartType?.label || state.smartartType} · ${placement?.label || ''}`;
    } else if (state.pageType === 'content-grid') {
        const gridLayout = GRID_LAYOUTS[state.gridLayout];
        const zoneTypes = Object.values(state.zoneContents).join('+');
        l2Value = `${gridLayout?.label || state.gridLayout} (${zoneTypes})`;
    } else if (state.pageType === 'cover') {
        const coverLayout = COVER_LAYOUTS[state.coverLayout];
        l2Value = `封面 · ${coverLayout?.name || state.coverLayout}`;
    }
    document.getElementById('nav-l2-value').textContent = l2Value;
}

/**
 * Generate JSON config for export
 */
function updateJsonOutput() {
    const gridLayout = GRID_LAYOUTS[state.gridLayout];

    // Serialize shapes with full config
    const serializedShapes = state.masterShapes.map(shapeState => {
        const shapeConfig = SHAPE_PRESETS[shapeState.id];
        if (shapeConfig.configType === 'thickness-positions') {
            const thickness = shapeState.thickness || shapeConfig.defaultThickness;
            const positions = shapeState.positions || shapeConfig.defaultPositions || [];
            const thicknessConfig = shapeConfig.thickness[thickness];
            return {
                id: shapeState.id,
                configType: 'thickness-positions',
                thickness: thickness,
                positions: positions,
                thicknessConfig: thicknessConfig,
                occupiesSpace: shapeConfig.occupiesSpace,
                style: shapeConfig.style || {},
            };
        } else {
            // Preset-based config
            const presetConfig = shapeConfig.presets?.[shapeState.preset] || {};
            return {
                id: shapeState.id,
                configType: 'presets',
                preset: shapeState.preset,
                occupiesSpace: shapeConfig.occupiesSpace,
                positionConfig: {
                    ...presetConfig.position,
                    ...presetConfig.size,
                    text: shapeConfig.defaultContent || 'SECTION',
                },
            };
        }
    });

    // Serialize placeholders
    const serializedPlaceholders = {};
    Object.entries(state.masterPlaceholders).forEach(([phId, phState]) => {
        if (!phState.enabled) return;
        const phConfig = PLACEHOLDERS_CONFIG[phId];
        if (!phConfig) return;

        const posConfig = phConfig.positions[phState.position];
        const sizeConfig = phConfig.sizes?.[phState.size];

        serializedPlaceholders[phId] = {
            enabled: true,
            position: phState.position,
            positionConfig: posConfig?.position,
            size: phState.size,
            sizeConfig: sizeConfig,
            imageUrl: phState.imageUrl || null,
        };
    });

    // Calculate bounds
    const hasTitle = state.masterContentAreas.titleStyle !== 'none';
    const headerBounds = getHeaderBoundsFromConfig(state);
    const bodyBounds = getBodyBoundsFromConfig(state, hasTitle);
    const contentBounds = getContentBoundsFromConfig(state);

    const contentAreasWithBounds = {
        ...state.masterContentAreas,
        headerBounds: {
            x: headerBounds.left,
            y: headerBounds.top,
            width: SLIDE_CONFIG.width - headerBounds.left - headerBounds.right,
            height: headerBounds.height,
        },
        bodyBounds: {
            x: bodyBounds.left,
            y: bodyBounds.top,
            width: SLIDE_CONFIG.width - bodyBounds.left - bodyBounds.right,
            height: SLIDE_CONFIG.height - bodyBounds.top - bodyBounds.bottom,
        },
        footerBounds: {
            x: contentBounds.left,
            y: SLIDE_CONFIG.height - contentBounds.bottom,
            width: SLIDE_CONFIG.width - contentBounds.left - contentBounds.right,
            height: CONTENT_AREAS.footer.getHeight(state.masterContentAreas.footerHeight || 'compact'),
        },
    };

    const config = {
        slide: {
            width: SLIDE_CONFIG.width,
            height: SLIDE_CONFIG.height,
            widthInches: SLIDE_CONFIG.widthInches,
            heightInches: SLIDE_CONFIG.heightInches,
        },
        theme: state.theme,
        slideMaster: {
            decorativeShapes: serializedShapes,
            placeholders: serializedPlaceholders,
            contentAreas: contentAreasWithBounds,
        },
        pageType: state.pageType,
        ...(state.pageType === 'cover' ? {
            coverLayout: state.coverLayout,
            coverContent: state.coverContent
        } : {}),
        ...(state.pageType === 'divider' ? {
            divider: {
                layout: state.dividerLayout,
                sectionCount: state.dividerSectionCount,
                numberStyle: state.dividerNumberStyle,
                textLevel: state.dividerTextLevel,
                bgStyle: state.dividerBgStyle,
                sectionIndex: state.dividerIndex
            }
        } : {}),
        ...(state.pageType === 'content-smartart' ? {
            smartart: {
                engine: state.smartartEngine || 'next',
                type: state.smartartType,
                category: state.smartartCategory,
                placement: state.smartartPlacement,
                colorScheme: state.smartartColorScheme,
                items: Array.isArray(state.smartartItems)
                    ? JSON.parse(JSON.stringify(state.smartartItems))
                    : [],
                ooxmlId: SMARTART_TYPES[state.smartartType]?.ooxmlId,
                ...(typeof getSmartArtOOXML === 'function' ? { ooxml: getSmartArtOOXML() } : {})
            }
        } : {}),
        ...(state.pageType === 'content-grid' ? {
            grid: {
                layout: state.gridLayout,
                zones: gridLayout?.zones.map((zone, idx) => {
                    const contentType = state.zoneContents[zone.id] || 'text';
                    const zoneData = {
                        id: zone.id,
                        flex: zone.flex,
                        content: contentType
                    };
                    // Include chart data
                    if (contentType === 'chart' && typeof CHART_SAMPLES !== 'undefined') {
                        const zoneIdx = zone.id.charCodeAt(0) - 65;
                        const chartSample = CHART_SAMPLES[zoneIdx % CHART_SAMPLES.length];
                        zoneData.chartData = {
                            title: chartSample.title,
                            chartType: chartSample.chartType,
                            categories: chartSample.categories,
                            series: chartSample.series
                        };
                    }
                    // Include text data
                    if (contentType === 'text' && typeof TEXT_SAMPLES !== 'undefined') {
                        const zoneIdx = zone.id.charCodeAt(0) - 65;
                        const textSample = TEXT_SAMPLES[zoneIdx % TEXT_SAMPLES.length];
                        zoneData.textData = {
                            title: textSample.title,
                            body: textSample.content
                        };
                    }
                    return zoneData;
                })
            }
        } : {})
    };

    document.getElementById('json-output').textContent = JSON.stringify(config, null, 2);
}

/**
 * Export config as JSON file
 */
function exportConfig() {
    updateJsonOutput();
    const json = document.getElementById('json-output').textContent;
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'slide-config.json';
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Generate PPTX via backend API
 */
async function generatePPTX() {
    updateJsonOutput();
    const config = JSON.parse(document.getElementById('json-output').textContent);

    const btn = document.querySelector('.btn-primary');
    const originalText = btn.textContent;
    btn.textContent = 'Generating...';
    btn.disabled = true;

    try {
        const response = await fetch('/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config)
        });
        const result = await response.json();

        if (result.success) {
            const link = document.createElement('a');
            link.href = '/' + result.file;
            link.download = result.file;
            link.click();
        } else {
            alert('Generation failed: ' + result.error);
        }
    } catch (e) {
        alert('Request failed: ' + e.message);
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}
