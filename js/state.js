// Application State (Doc/UI layered model with legacy aliases)

function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
}

const DEFAULT_MASTER_PLACEHOLDERS = {
    logo: { enabled: false, position: 'tl', size: 'medium', imageUrl: null },
    'page-number': { enabled: true, position: 'br' },
    date: { enabled: false, position: 'bl' }
};

const DEFAULT_MASTER_CONTENT_AREAS = {
    titleStyle: 'with-tag',      // 'none' | 'simple' | 'with-tag'
    headerHeight: 'compact',     // 'compact' | 'normal' | 'spacious'
    sourceStyle: 'citation',     // 'none' | 'citation'
    footerHeight: 'compact',     // 'compact' | 'normal' | 'spacious'
};

const DEFAULT_COVER_CONTENT = {
    year: '2025',
    title: '年度汇报',
    highlight: 'XXXX项目',
    subtitle: '本次演示将围绕项目展开，旨在向您展示年度的重点工作',
    tag: '工作汇报',
    brandTag: '人力资源工作总结汇报',
    footer: {
        location: '芝士科技大厦',
        date: '2025.01',
        contact: '400-123-4567',
        logo: 'LOGO'
    }
};

const PAGE_MODEL_BY_TYPE = {
    cover: { shell: 'cover', renderer: 'cover' },
    divider: { shell: 'divider', renderer: 'divider' },
    'content-grid': { shell: 'content', renderer: 'grid' },
    'content-smartart': { shell: 'content', renderer: 'smartart' },
};

function normalizePageType(value) {
    const type = String(value || '').trim();
    return PAGE_MODEL_BY_TYPE[type] ? type : 'content-grid';
}

function inferTypeFromModel(shell, renderer) {
    const normalizedShell = String(shell || '').trim();
    const normalizedRenderer = String(renderer || '').trim();

    if (normalizedShell === 'cover') return 'cover';
    if (normalizedShell === 'divider') return 'divider';
    if (normalizedShell === 'content' && normalizedRenderer === 'smartart') return 'content-smartart';
    if (normalizedShell === 'content' && normalizedRenderer === 'grid') return 'content-grid';
    if (normalizedShell === 'content') return 'content-grid';
    return null;
}

function getPageModelFromType(type) {
    const normalizedType = normalizePageType(type);
    const model = PAGE_MODEL_BY_TYPE[normalizedType] || PAGE_MODEL_BY_TYPE['content-grid'];
    return { ...model };
}

function derivePageLayout(type, data, fallbackLayout) {
    const pageData = (data && typeof data === 'object') ? data : {};
    if (type === 'cover') return pageData.coverLayout || (typeof fallbackLayout === 'string' && fallbackLayout.trim()) || 'cross_rectangles';
    if (type === 'divider') {
        return pageData.dividerLayout || pageData.divider?.layout || (typeof fallbackLayout === 'string' && fallbackLayout.trim()) || 'cards-highlight';
    }
    if (type === 'content-smartart') {
        return pageData.smartartPlacement || pageData.smartart?.placement || (typeof fallbackLayout === 'string' && fallbackLayout.trim()) || 'left-desc';
    }
    return pageData.gridLayout || pageData.grid?.layout || (typeof fallbackLayout === 'string' && fallbackLayout.trim()) || 'two-col-equal';
}

function normalizePageRecord(pageLike, fallbackType = 'content-grid') {
    const page = (pageLike && typeof pageLike === 'object') ? pageLike : {};
    const rawType = page.type;
    const inferredType = inferTypeFromModel(page.shell || page.pageShell, page.renderer || page.bodyRenderer);
    const nextType = normalizePageType(rawType || inferredType || fallbackType);
    const model = getPageModelFromType(nextType);

    page.type = nextType;
    page.shell = model.shell;
    page.renderer = model.renderer;
    page.pageShell = model.shell;
    page.bodyRenderer = model.renderer;
    if (!page.data || typeof page.data !== 'object') page.data = {};
    page.layout = derivePageLayout(nextType, page.data, page.layout || page.bodyLayout);
    page.bodyLayout = page.layout;
    return page;
}

function createDefaultPageData(type) {
    if (type === 'cover') {
        return {
            coverLayout: 'cross_rectangles',
            coverContent: deepClone(DEFAULT_COVER_CONTENT),
        };
    }

    if (type === 'divider') {
        return {
            dividerLayout: 'cards-highlight',
            dividerSectionCount: 4,
            dividerNumberStyle: 'arabic',  // 'arabic' | 'roman' | 'chinese' | 'circled'
            dividerTextLevel: 'full',      // 'full' | 'compact'
            dividerBgStyle: 'solid',       // 'solid' | 'gradient' | 'split' | 'light'
            dividerIndex: 0,
        };
    }

    if (type === 'content-smartart') {
        return {
            smartartCategory: 'pyramid',
            smartartType: 'pyramid',
            smartartPlacement: 'left-desc',
            smartartItemCount: 4,
            smartartColorScheme: 'colorful1',  // see SMARTART_COLOR_SCHEMES in config.js
            smartartItems: null,  // current type's items (for backward compat)
            smartartItemsByType: {},  // { typeId: items[] } - each type has independent data
        };
    }

    // content-grid default
    return {
        gridLayout: 'two-col-equal',
        zoneContents: { A: 'chart', B: 'text' },
    };
}

function createDefaultPage(type = 'content-grid', id = 'page-1') {
    const normalizedType = normalizePageType(type);
    const model = getPageModelFromType(normalizedType);
    const data = createDefaultPageData(normalizedType);
    return {
        id,
        type: normalizedType,
        shell: model.shell,
        renderer: model.renderer,
        layout: derivePageLayout(normalizedType, data),
        pageShell: model.shell,
        bodyRenderer: model.renderer,
        bodyLayout: derivePageLayout(normalizedType, data),
        data,
    };
}

function mergePageDefaults(page, type) {
    const nextType = normalizePageType(type);
    const defaults = createDefaultPageData(nextType);
    const currentData = (page && page.data && typeof page.data === 'object') ? page.data : {};
    const model = getPageModelFromType(nextType);
    page.type = nextType;
    page.shell = model.shell;
    page.renderer = model.renderer;
    page.pageShell = model.shell;
    page.bodyRenderer = model.renderer;
    page.data = {
        ...deepClone(defaults),
        ...currentData,
    };
    page.layout = derivePageLayout(nextType, page.data);
    page.bodyLayout = page.layout;
}

function ensureCurrentPage(stateObj) {
    if (!stateObj.doc || !Array.isArray(stateObj.doc.pages)) {
        stateObj.doc = stateObj.doc || {};
        stateObj.doc.pages = [];
    }

    if (stateObj.doc.pages.length === 0) {
        stateObj.doc.pages.push(createDefaultPage('content-grid', 'page-1'));
    }

    const currentId = stateObj.ui.currentPageId;
    let page = stateObj.doc.pages.find(p => p.id === currentId);
    if (!page) {
        page = stateObj.doc.pages[0];
        stateObj.ui.currentPageId = page.id;
    }

    normalizePageRecord(page, 'content-grid');
    mergePageDefaults(page, page.type);
    return page;
}

function getCurrentPageData(stateObj) {
    return ensureCurrentPage(stateObj).data;
}

const state = {
    // ========== UI state (ephemeral) ==========
    ui: {
        activeLayer: 1,
        currentPageId: 'page-1',
        previewTab: 'preview',
        zoom: 100,
        expandedSection: 'l2',
        expandedSmartartCat: 'pyramid',
        expandedDivider: null,
        history: {
            undoStack: [],
            redoStack: [],
            maxEntries: 50,
        },
    },

    // ========== Doc state (persistable) ==========
    doc: {
        schemaVersion: 2,
        master: {
            theme: 'forest_green',
            masterShapes: [],
            masterPlaceholders: deepClone(DEFAULT_MASTER_PLACEHOLDERS),
            masterContentAreas: deepClone(DEFAULT_MASTER_CONTENT_AREAS),
        },
        pages: [
            createDefaultPage('content-grid', 'page-1'),
        ],
    },

    // Legacy layout editor fields (kept for compatibility with legacy modules)
    layoutType: 'single',
    cards: [],
};

function defineUiAlias(alias, key) {
    Object.defineProperty(state, alias, {
        get() {
            return state.ui[key];
        },
        set(value) {
            state.ui[key] = value;
        },
        enumerable: true,
        configurable: true,
    });
}

function defineMasterAlias(alias, key) {
    Object.defineProperty(state, alias, {
        get() {
            return state.doc.master[key];
        },
        set(value) {
            state.doc.master[key] = value;
        },
        enumerable: true,
        configurable: true,
    });
}

function definePageDataAlias(alias, key, fallbackFactory) {
    Object.defineProperty(state, alias, {
        get() {
            const data = getCurrentPageData(state);
            if (data[key] === undefined && typeof fallbackFactory === 'function') {
                data[key] = fallbackFactory();
            }
            return data[key];
        },
        set(value) {
            const data = getCurrentPageData(state);
            data[key] = value;
        },
        enumerable: true,
        configurable: true,
    });
}

Object.defineProperty(state, 'pageType', {
    get() {
        return ensureCurrentPage(state).type;
    },
    set(value) {
        const page = ensureCurrentPage(state);
        mergePageDefaults(page, value || 'content-grid');
    },
    enumerable: true,
    configurable: true,
});

// UI aliases
defineUiAlias('activeLayer', 'activeLayer');
defineUiAlias('previewTab', 'previewTab');
defineUiAlias('zoom', 'zoom');
defineUiAlias('expandedSmartartCat', 'expandedSmartartCat');
defineUiAlias('expandedDivider', 'expandedDivider');

// Master aliases
defineMasterAlias('theme', 'theme');
defineMasterAlias('masterShapes', 'masterShapes');
defineMasterAlias('masterPlaceholders', 'masterPlaceholders');
defineMasterAlias('masterContentAreas', 'masterContentAreas');

// Page data aliases
definePageDataAlias('coverLayout', 'coverLayout', () => 'cross_rectangles');
definePageDataAlias('coverContent', 'coverContent', () => deepClone(DEFAULT_COVER_CONTENT));

definePageDataAlias('dividerLayout', 'dividerLayout', () => 'cards-highlight');
definePageDataAlias('dividerSectionCount', 'dividerSectionCount', () => 4);
definePageDataAlias('dividerNumberStyle', 'dividerNumberStyle', () => 'arabic');
definePageDataAlias('dividerTextLevel', 'dividerTextLevel', () => 'full');
definePageDataAlias('dividerBgStyle', 'dividerBgStyle', () => 'solid');
definePageDataAlias('dividerIndex', 'dividerIndex', () => 0);

definePageDataAlias('smartartCategory', 'smartartCategory', () => 'pyramid');
definePageDataAlias('smartartType', 'smartartType', () => 'pyramid');
definePageDataAlias('smartartPlacement', 'smartartPlacement', () => 'left-desc');
definePageDataAlias('smartartItemCount', 'smartartItemCount', () => 4);
definePageDataAlias('smartartColorScheme', 'smartartColorScheme', () => 'colorful1');
definePageDataAlias('smartartItems', 'smartartItems', () => null);
definePageDataAlias('smartartItemsByType', 'smartartItemsByType', () => ({}));

definePageDataAlias('gridLayout', 'gridLayout', () => 'two-col-equal');
definePageDataAlias('zoneContents', 'zoneContents', () => ({ A: 'chart', B: 'text' }));

// Internal helpers exposed for selector API module.
window.__stateInternals = {
    deepClone,
    normalizePageType,
    inferTypeFromModel,
    getPageModelFromType,
    derivePageLayout,
    normalizePageRecord,
    createDefaultPageData,
    createDefaultPage,
    ensureCurrentPage,
    mergePageDefaults,
};
