// Import JSON config (v1/v2) into editor state

function _importDeepClone(value) {
    return JSON.parse(JSON.stringify(value));
}

function _importResolvePageType(pageLike, fallbackType = 'content-grid') {
    const helper = window.__stateInternals || {};
    const inferTypeFromModel = helper.inferTypeFromModel;
    const normalizePageType = helper.normalizePageType;
    const page = pageLike || {};
    const inferred = typeof inferTypeFromModel === 'function'
        ? inferTypeFromModel(page.shell || page.pageShell, page.renderer || page.bodyRenderer)
        : null;
    const preferred = page.type || inferred || fallbackType;
    return typeof normalizePageType === 'function'
        ? normalizePageType(preferred)
        : String(preferred || 'content-grid');
}

function _importResolvePageModel(pageType) {
    const helper = window.__stateInternals || {};
    if (typeof helper.getPageModelFromType === 'function') return helper.getPageModelFromType(pageType);
    if (pageType === 'cover') return { shell: 'cover', renderer: 'cover' };
    if (pageType === 'divider') return { shell: 'divider', renderer: 'divider' };
    if (pageType === 'content-smartart') return { shell: 'content', renderer: 'smartart' };
    return { shell: 'content', renderer: 'grid' };
}

function _importResolvePageLayout(pageType, data, rawLayout) {
    const helper = window.__stateInternals || {};
    if (typeof helper.derivePageLayout === 'function') {
        return helper.derivePageLayout(pageType, data || {}, rawLayout);
    }
    if (pageType === 'cover') return data?.coverLayout || rawLayout || 'cross_rectangles';
    if (pageType === 'divider') return data?.dividerLayout || data?.divider?.layout || rawLayout || 'cards-highlight';
    if (pageType === 'content-smartart') return data?.smartartPlacement || data?.smartart?.placement || rawLayout || 'left-desc';
    return data?.gridLayout || data?.grid?.layout || rawLayout || 'two-col-equal';
}

function _importNormalizeInput(raw) {
    if (!raw || typeof raw !== 'object') {
        return {
            schemaVersion: 2,
            master: {
                theme: state.theme,
                masterShapes: _importDeepClone(state.masterShapes || []),
                masterPlaceholders: _importDeepClone(state.masterPlaceholders || {}),
                masterContentAreas: _importDeepClone(state.masterContentAreas || {}),
            },
            pages: [{
                id: 'page-1',
                type: 'content-grid',
                shell: 'content',
                renderer: 'grid',
                layout: 'two-col-equal',
                pageShell: 'content',
                bodyRenderer: 'grid',
                bodyLayout: 'two-col-equal',
                data: {}
            }],
        };
    }

    if (raw.schemaVersion === 2 && Array.isArray(raw.pages)) {
        const master = raw.master || {};
        return {
            schemaVersion: 2,
            master: {
                theme: master.theme || raw.theme || 'forest_green',
                masterShapes: _importDeepClone(master.masterShapes || raw.slideMaster?.decorativeShapes || []),
                masterPlaceholders: _importDeepClone(master.masterPlaceholders || raw.slideMaster?.placeholders || {}),
                masterContentAreas: _importDeepClone(master.masterContentAreas || raw.slideMaster?.contentAreas || {}),
            },
            pages: raw.pages.map((page, idx) => {
                const data = _importDeepClone(page?.data || {});
                const type = _importResolvePageType(page, 'content-grid');
                const model = _importResolvePageModel(type);
                return {
                    id: String(page?.id || `page-${idx + 1}`),
                    type,
                    shell: model.shell,
                    renderer: model.renderer,
                    layout: _importResolvePageLayout(type, data, page?.layout || page?.bodyLayout),
                    pageShell: model.shell,
                    bodyRenderer: model.renderer,
                    bodyLayout: _importResolvePageLayout(type, data, page?.layout || page?.bodyLayout),
                    data,
                };
            }),
        };
    }

    // Legacy v1 single-page fallback
    const pageType = raw.pageType || 'content-grid';
    const data = {};
    if (pageType === 'cover') {
        data.coverLayout = raw.coverLayout;
        data.coverContent = _importDeepClone(raw.coverContent || {});
    } else if (pageType === 'divider') {
        data.divider = _importDeepClone(raw.divider || {});
        data.dividerLayout = raw.dividerLayout;
        data.dividerSectionCount = raw.dividerSectionCount;
        data.dividerNumberStyle = raw.dividerNumberStyle;
        data.dividerTextLevel = raw.dividerTextLevel;
        data.dividerBgStyle = raw.dividerBgStyle;
        data.dividerIndex = raw.dividerIndex;
    } else if (pageType === 'content-smartart') {
        data.smartart = _importDeepClone(raw.smartart || {});
        data.smartartType = raw.smartartType || raw.smartart?.type;
        data.smartartCategory = raw.smartartCategory || raw.smartart?.category;
        data.smartartPlacement = raw.smartartPlacement || raw.smartart?.placement;
        data.smartartColorScheme = raw.smartartColorScheme || raw.smartart?.colorScheme;
        data.smartartItems = _importDeepClone(raw.smartartItems || raw.smartart?.items || []);
        data.smartartItemsByType = _importDeepClone(raw.smartartItemsByType || {});
        data.contentTitle = raw.contentTitle || '市场趋势分析';
        data.contentTag = raw.contentTag || '分析报告';
        data.contentSource = raw.contentSource || '行业研究报告 2024';
        if (!data.smartartItemsByType[data.smartartType || 'pyramid'] && Array.isArray(data.smartartItems)) {
            data.smartartItemsByType[data.smartartType || 'pyramid'] = _importDeepClone(data.smartartItems);
        }
    } else {
        data.grid = _importDeepClone(raw.grid || {});
        data.gridLayout = raw.gridLayout || raw.grid?.layout;
        data.zoneContents = _importDeepClone(raw.zoneContents || {});
        data.contentTitle = raw.contentTitle || '市场趋势分析';
        data.contentTag = raw.contentTag || '分析报告';
        data.contentSource = raw.contentSource || '行业研究报告 2024';
    }

    return {
        schemaVersion: 2,
        master: {
            theme: raw.theme || 'forest_green',
            masterShapes: _importDeepClone(raw.slideMaster?.decorativeShapes || []),
            masterPlaceholders: _importDeepClone(raw.slideMaster?.placeholders || {}),
            masterContentAreas: _importDeepClone(raw.slideMaster?.contentAreas || {}),
        },
        pages: [
            {
                id: 'legacy-page-1',
                type: pageType,
                shell: _importResolvePageModel(pageType).shell,
                renderer: _importResolvePageModel(pageType).renderer,
                layout: _importResolvePageLayout(pageType, data, raw.layout),
                pageShell: _importResolvePageModel(pageType).shell,
                bodyRenderer: _importResolvePageModel(pageType).renderer,
                bodyLayout: _importResolvePageLayout(pageType, data, raw.layout),
                data,
            }
        ],
    };
}

function _applyThemeSelectorValue(themeId) {
    const select = document.getElementById('theme-select');
    if (!select) return;
    const hasOption = Array.from(select.options).some(opt => opt.value === themeId);
    if (hasOption) {
        select.value = themeId;
    }
}

function applyImportedConfig(rawConfig) {
    const normalized = _importNormalizeInput(rawConfig);
    if (typeof recordDocHistory === 'function') recordDocHistory();

    state.doc = {
        schemaVersion: 2,
        master: normalized.master,
        pages: normalized.pages.length > 0
            ? normalized.pages
            : [{
                id: 'page-1',
                type: 'content-grid',
                shell: 'content',
                renderer: 'grid',
                layout: 'two-col-equal',
                pageShell: 'content',
                bodyRenderer: 'grid',
                bodyLayout: 'two-col-equal',
                data: {}
            }],
    };

    state.ui.currentPageId = state.doc.pages[0].id;
    _applyThemeSelectorValue(state.doc.master.theme);

    if (typeof updatePageType === 'function') {
        updatePageType(state.pageType, { recordHistory: false });
    } else if (typeof render === 'function') {
        render();
    }
}

function triggerImportConfig() {
    const input = document.getElementById('config-import-input');
    if (!input) return;
    input.value = '';
    input.click();
}

async function handleImportConfigFile(event) {
    const file = event?.target?.files?.[0];
    if (!file) return;

    try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        applyImportedConfig(parsed);
    } catch (err) {
        alert(`Import failed: ${err.message}`);
    }
}

window.triggerImportConfig = triggerImportConfig;
window.handleImportConfigFile = handleImportConfigFile;
window.applyImportedConfig = applyImportedConfig;
