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

    const page = (typeof getCurrentPage === 'function') ? getCurrentPage() : null;
    const model = (window.__pageModelUtils && typeof window.__pageModelUtils.getPageModelFromType === 'function')
        ? window.__pageModelUtils.getPageModelFromType(state.pageType)
        : { shell: 'content', renderer: state.pageType === 'content-smartart' ? 'smartart' : 'grid' };
    const shell = page?.shell || page?.pageShell || model.shell;
    const renderer = page?.renderer || page?.bodyRenderer || model.renderer;
    const layoutFromPage = page?.layout || page?.bodyLayout;

    // L2 summary
    let l2Value = `${shell}/${renderer}`;
    if (state.pageType === 'divider') {
        const dividerLayout = DIVIDER_LAYOUTS[state.dividerLayout];
        const indexLabel = state.dividerIndex === 0 ? '全部' : state.dividerIndex;
        l2Value = `${shell}/${renderer} · ${dividerLayout?.label || state.dividerLayout || layoutFromPage} (${indexLabel})`;
    } else if (state.pageType === 'content-smartart') {
        const smartartType = SMARTART_TYPES[state.smartartType];
        const placement = SMARTART_PLACEMENTS[state.smartartPlacement];
        const smartartLabel = (typeof getSmartArtTypeLabel === 'function')
            ? getSmartArtTypeLabel(smartartType)
            : (smartartType?.label || state.smartartType);
        const placementLabel = (typeof getSmartArtPlacementLabel === 'function')
            ? getSmartArtPlacementLabel(placement)
            : (placement?.label || layoutFromPage || '');
        l2Value = `${shell}/${renderer} · ${smartartLabel} · ${placementLabel}`;
    } else if (state.pageType === 'content-grid') {
        const gridLayout = GRID_LAYOUTS[state.gridLayout];
        const zoneTypes = Object.values(state.zoneContents).join('+');
        l2Value = `${shell}/${renderer} · ${gridLayout?.label || state.gridLayout || layoutFromPage} (${zoneTypes})`;
    } else if (state.pageType === 'cover') {
        const coverLayout = COVER_LAYOUTS[state.coverLayout];
        l2Value = `${shell}/${renderer} · ${coverLayout?.name || state.coverLayout || layoutFromPage}`;
    }
    document.getElementById('nav-l2-value').textContent = l2Value;
}

function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
}

function isSmartartOOXMLAligned(ooxml, smartartType) {
    if (!ooxml || typeof ooxml !== 'object') return false;
    if (!smartartType || typeof smartartType !== 'string') return true;

    const expectedType = smartartType.trim();
    const actualType = typeof ooxml.smartArtType === 'string' ? ooxml.smartArtType.trim() : '';
    if (actualType && actualType !== expectedType) return false;

    const expectedOOXMLId = SMARTART_TYPES[expectedType]?.ooxmlId;
    if (!expectedOOXMLId) return true;

    const layoutId = typeof ooxml.layoutId === 'string' ? ooxml.layoutId.trim() : '';
    if (!layoutId) return true;
    const layoutTail = layoutId.split('/').pop();
    return layoutTail === expectedOOXMLId;
}

function getPageTypeForExport(page, fallbackType = 'content-grid') {
    const helper = window.__pageModelUtils || {};
    if (typeof helper.resolvePageType === 'function') {
        return helper.resolvePageType(page, fallbackType);
    }
    return String(page?.type || fallbackType || 'content-grid');
}

function getPageModelForExport(pageType) {
    const helper = window.__pageModelUtils || {};
    if (typeof helper.getPageModelFromType === 'function') {
        return helper.getPageModelFromType(pageType);
    }
    if (pageType === 'cover') return { shell: 'cover', renderer: 'cover' };
    if (pageType === 'divider') return { shell: 'divider', renderer: 'divider' };
    if (pageType === 'content-smartart') return { shell: 'content', renderer: 'smartart' };
    return { shell: 'content', renderer: 'grid' };
}

function getPageLayoutForExport(pageType, pageData, fallbackLayout) {
    const helper = window.__pageModelUtils || {};
    if (typeof helper.derivePageLayout === 'function') {
        return helper.derivePageLayout(pageType, pageData || {}, fallbackLayout);
    }
    if (pageType === 'cover') return pageData?.coverLayout || fallbackLayout || 'cross_rectangles';
    if (pageType === 'divider') return pageData?.dividerLayout || pageData?.divider?.layout || fallbackLayout || 'cards-highlight';
    if (pageType === 'content-smartart') return pageData?.smartartPlacement || pageData?.smartart?.placement || fallbackLayout || 'left-desc';
    return pageData?.gridLayout || pageData?.grid?.layout || fallbackLayout || 'two-col-equal';
}

function buildGridZones(layoutId, zoneContents) {
    const layout = GRID_LAYOUTS[layoutId];
    return (layout?.zones || []).map((zone, idx) => {
        const contentType = zoneContents?.[zone.id] || 'text';
        const zoneData = {
            id: zone.id,
            flex: zone.flex,
            content: contentType
        };

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
        if (contentType === 'text' && typeof TEXT_SAMPLES !== 'undefined') {
            const zoneIdx = zone.id.charCodeAt(0) - 65;
            const textSample = TEXT_SAMPLES[zoneIdx % TEXT_SAMPLES.length];
            zoneData.textData = {
                title: textSample.title,
                body: textSample.content
            };
        }
        return zoneData;
    });
}

function buildContentAreasWithBounds() {
    const hasTitle = state.masterContentAreas.titleStyle !== 'none';
    const headerBounds = getHeaderBoundsFromConfig(state);
    const bodyBounds = getBodyBoundsFromConfig(state, hasTitle);
    const contentBounds = getContentBoundsFromConfig(state);

    return {
        ...deepClone(state.masterContentAreas || {}),
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
}

function buildPageDataForExport(page, legacyFallback) {
    const pageType = getPageTypeForExport(page, legacyFallback?.pageType || 'content-grid');
    const sourceData = deepClone(page?.data || {});
    const contentShell = {
        contentTitle: sourceData.contentTitle || legacyFallback?.contentTitle || '市场趋势分析',
        contentTag: sourceData.contentTag || legacyFallback?.contentTag || '分析报告',
        contentSource: sourceData.contentSource || legacyFallback?.contentSource || '行业研究报告 2024',
    };

    if (pageType === 'cover') {
        return {
            coverLayout: sourceData.coverLayout || legacyFallback?.coverLayout || 'cross_rectangles',
            coverContent: deepClone(sourceData.coverContent || legacyFallback?.coverContent || {}),
        };
    }

    if (pageType === 'divider') {
        const dividerBase = deepClone(sourceData.divider || {});
        const divider = {
            ...dividerBase,
            // Flat fields are current editor state and must take precedence.
            layout: sourceData.dividerLayout ?? dividerBase.layout ?? legacyFallback?.divider?.layout ?? 'cards-highlight',
            sectionCount: sourceData.dividerSectionCount ?? dividerBase.sectionCount ?? legacyFallback?.divider?.sectionCount ?? 4,
            numberStyle: sourceData.dividerNumberStyle ?? dividerBase.numberStyle ?? legacyFallback?.divider?.numberStyle ?? 'arabic',
            textLevel: sourceData.dividerTextLevel ?? dividerBase.textLevel ?? legacyFallback?.divider?.textLevel ?? 'full',
            bgStyle: sourceData.dividerBgStyle ?? dividerBase.bgStyle ?? legacyFallback?.divider?.bgStyle ?? 'solid',
            sectionIndex: sourceData.dividerIndex ?? dividerBase.sectionIndex ?? legacyFallback?.divider?.sectionIndex ?? 0,
        };
        return {
            dividerLayout: divider.layout,
            dividerSectionCount: divider.sectionCount,
            dividerNumberStyle: divider.numberStyle,
            dividerTextLevel: divider.textLevel,
            dividerBgStyle: divider.bgStyle,
            dividerIndex: divider.sectionIndex,
            divider,
        };
    }

    if (pageType === 'content-smartart') {
        const smartartType = sourceData.smartartType || sourceData.smartart?.type || legacyFallback?.smartart?.type || 'pyramid';
        const byType = deepClone(sourceData.smartartItemsByType || {});
        const fromSmartart = sourceData.smartart?.items;
        const fromCurrent = sourceData.smartartItems;
        const fromByType = byType[smartartType];
        const items = Array.isArray(fromSmartart)
            ? deepClone(fromSmartart)
            : Array.isArray(fromCurrent)
                ? deepClone(fromCurrent)
                : Array.isArray(fromByType)
                    ? deepClone(fromByType)
                    : [];

        byType[smartartType] = deepClone(items);
        const smartart = {
            type: smartartType,
            category: sourceData.smartartCategory || sourceData.smartart?.category || legacyFallback?.smartart?.category || 'pyramid',
            placement: sourceData.smartartPlacement || sourceData.smartart?.placement || legacyFallback?.smartart?.placement || 'left-desc',
            colorScheme: sourceData.smartartColorScheme || sourceData.smartart?.colorScheme || legacyFallback?.smartart?.colorScheme || 'colorful1',
            items,
            ooxmlId: SMARTART_TYPES[smartartType]?.ooxmlId,
        };

        // Prefer live OOXML from current editor to avoid exporting stale layout/type pairs.
        if (typeof getSmartArtOOXML === 'function' && state.ui?.currentPageId === page?.id) {
            const liveOOXML = getSmartArtOOXML();
            if (isSmartartOOXMLAligned(liveOOXML, smartartType)) {
                smartart.ooxml = deepClone(liveOOXML);
            }
        }

        // For non-current pages, only reuse cached OOXML when it still matches current type.
        if (!smartart.ooxml && isSmartartOOXMLAligned(sourceData.smartart?.ooxml, smartartType)) {
            smartart.ooxml = deepClone(sourceData.smartart.ooxml);
        }

        return {
            smartartCategory: smartart.category,
            smartartType: smartart.type,
            smartartPlacement: smartart.placement,
            smartartColorScheme: smartart.colorScheme,
            smartartItemCount: sourceData.smartartItemCount ?? items.length,
            smartartItemsByType: byType,
            ...contentShell,
            smartart,
        };
    }

    const gridLayout = sourceData.gridLayout || sourceData.grid?.layout || legacyFallback?.grid?.layout || 'two-col-equal';
    const zoneContents = sourceData.zoneContents || {};
    const zones = (sourceData.grid && Array.isArray(sourceData.grid.zones))
        ? deepClone(sourceData.grid.zones)
        : buildGridZones(gridLayout, zoneContents);
    return {
        gridLayout,
        zoneContents: deepClone(zoneContents),
        ...contentShell,
        grid: {
            layout: gridLayout,
            zones,
        },
    };
}

function toV2PresentationConfig(legacyConfig) {
    const docPages = Array.isArray(state.doc?.pages) ? state.doc.pages : [];
    const pages = docPages.length > 0
        ? docPages.map((page, idx) => {
            const type = getPageTypeForExport(page, 'content-grid');
            const data = buildPageDataForExport(page, null);
            const model = getPageModelForExport(type);
            return {
                id: page?.id || `page-${idx + 1}`,
                type,
                shell: model.shell,
                renderer: model.renderer,
                layout: getPageLayoutForExport(type, data, page?.layout),
                pageShell: model.shell,
                bodyRenderer: model.renderer,
                bodyLayout: getPageLayoutForExport(type, data, page?.layout),
                data,
            };
        })
        : [{
            id: (state.ui && state.ui.currentPageId) || 'page-1',
            type: legacyConfig.pageType || 'content-grid',
            shell: getPageModelForExport(legacyConfig.pageType || 'content-grid').shell,
            renderer: getPageModelForExport(legacyConfig.pageType || 'content-grid').renderer,
            layout: getPageLayoutForExport(legacyConfig.pageType || 'content-grid', legacyConfig, null),
            pageShell: getPageModelForExport(legacyConfig.pageType || 'content-grid').shell,
            bodyRenderer: getPageModelForExport(legacyConfig.pageType || 'content-grid').renderer,
            bodyLayout: getPageLayoutForExport(legacyConfig.pageType || 'content-grid', legacyConfig, null),
            data: buildPageDataForExport(null, legacyConfig),
        }];

    // Keep master payload aligned with current master editor serialization.
    const masterContentAreas = deepClone(
        legacyConfig?.slideMaster?.contentAreas || buildContentAreasWithBounds()
    );
    return {
        schemaVersion: 2,
        slide: legacyConfig.slide,
        master: {
            theme: legacyConfig.theme,
            masterShapes: deepClone(state.masterShapes || []),
            masterPlaceholders: deepClone(state.masterPlaceholders || {}),
            masterContentAreas,
        },
        pages
    };
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

    const contentAreasWithBounds = buildContentAreasWithBounds();

    const legacyConfig = {
        slide: {
            width: SLIDE_CONFIG.width,
            height: SLIDE_CONFIG.height,
            widthInches: SLIDE_CONFIG.widthInches,
            heightInches: SLIDE_CONFIG.heightInches,
            baseMargin: deepClone(SLIDE_CONFIG.baseMargin || {}),
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

    const config = toV2PresentationConfig(legacyConfig);
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
