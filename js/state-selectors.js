// State selectors and mutations (single entry for doc/page operations)

function _stateDeepClone(value) {
    const helper = window.__stateInternals;
    if (helper && typeof helper.deepClone === 'function') return helper.deepClone(value);
    return JSON.parse(JSON.stringify(value));
}

function _stateCreateDefaultPage(type, id) {
    const helper = window.__stateInternals;
    if (helper && typeof helper.createDefaultPage === 'function') {
        return helper.createDefaultPage(type, id);
    }
    return { id, type, data: {} };
}

function _stateEnsureCurrentPage() {
    const helper = window.__stateInternals;
    if (helper && typeof helper.ensureCurrentPage === 'function') {
        return helper.ensureCurrentPage(state);
    }
    if (!Array.isArray(state.doc?.pages) || state.doc.pages.length === 0) {
        state.doc.pages = [_stateCreateDefaultPage('content-grid', 'page-1')];
        state.ui.currentPageId = state.doc.pages[0].id;
    }
    return state.doc.pages[0];
}

function _stateMergePageDefaults(page, type) {
    const helper = window.__stateInternals;
    if (helper && typeof helper.mergePageDefaults === 'function') {
        helper.mergePageDefaults(page, type);
    }
}

function _stateNormalizePageRecord(page, fallbackType) {
    const helper = window.__stateInternals;
    if (helper && typeof helper.normalizePageRecord === 'function') {
        return helper.normalizePageRecord(page, fallbackType);
    }
    return page;
}

function _stateResolveModelFromType(type) {
    const helper = window.__stateInternals;
    if (helper && typeof helper.getPageModelFromType === 'function') {
        return helper.getPageModelFromType(type);
    }
    if (type === 'cover') return { shell: 'cover', renderer: 'cover' };
    if (type === 'divider') return { shell: 'divider', renderer: 'divider' };
    if (type === 'content-smartart') return { shell: 'content', renderer: 'smartart' };
    return { shell: 'content', renderer: 'grid' };
}

function _stateResolveTypeFromModel(shell, renderer, fallbackType = 'content-grid') {
    const helper = window.__stateInternals;
    const inferTypeFromModel = helper && helper.inferTypeFromModel;
    const normalizePageType = helper && helper.normalizePageType;
    const inferred = typeof inferTypeFromModel === 'function'
        ? inferTypeFromModel(shell, renderer)
        : null;
    const preferred = inferred || fallbackType;
    return typeof normalizePageType === 'function'
        ? normalizePageType(preferred)
        : (preferred || 'content-grid');
}

function _stateApplyLayoutToPageData(page, pageType, layoutValue) {
    if (!page || !layoutValue) return;
    page.layout = layoutValue;
    page.bodyLayout = layoutValue;
    if (!page.data || typeof page.data !== 'object') page.data = {};
    if (pageType === 'cover') {
        page.data.coverLayout = layoutValue;
        return;
    }
    if (pageType === 'divider') {
        page.data.dividerLayout = layoutValue;
        if (page.data.divider && typeof page.data.divider === 'object') {
            page.data.divider.layout = layoutValue;
        }
        return;
    }
    if (pageType === 'content-smartart') {
        page.data.smartartPlacement = layoutValue;
        if (page.data.smartart && typeof page.data.smartart === 'object') {
            page.data.smartart.placement = layoutValue;
        }
        return;
    }
    page.data.gridLayout = layoutValue;
    if (page.data.grid && typeof page.data.grid === 'object') {
        page.data.grid.layout = layoutValue;
    }
}

function _renderIfReady() {
    if (typeof render === 'function') render();
}

function _postMutation(shouldRender) {
    if (shouldRender) {
        _renderIfReady();
        return;
    }
    if (typeof updateHistoryButtons === 'function') updateHistoryButtons();
}

function _generatePageId() {
    const seed = Math.random().toString(36).slice(2, 8);
    return `page-${Date.now().toString(36)}-${seed}`;
}

function _isPlainObject(value) {
    return value && typeof value === 'object' && !Array.isArray(value);
}

function _historyState() {
    if (!state.ui.history) {
        state.ui.history = { undoStack: [], redoStack: [], maxEntries: 50 };
    }
    return state.ui.history;
}

function _snapshotDocSelection() {
    return {
        doc: _stateDeepClone(state.doc),
        currentPageId: state.ui.currentPageId,
    };
}

function recordDocHistory() {
    const history = _historyState();
    history.undoStack.push(_snapshotDocSelection());
    history.redoStack = [];
    const max = history.maxEntries || 50;
    if (history.undoStack.length > max) {
        history.undoStack.splice(0, history.undoStack.length - max);
    }
}

function undoDoc() {
    const history = _historyState();
    if (!history.undoStack.length) return;
    history.redoStack.push(_snapshotDocSelection());
    const prev = history.undoStack.pop();
    state.doc = _stateDeepClone(prev.doc || {});
    state.ui.currentPageId = prev.currentPageId || state.ui.currentPageId;
    _stateEnsureCurrentPage();
    _renderIfReady();
}

function redoDoc() {
    const history = _historyState();
    if (!history.redoStack.length) return;
    history.undoStack.push(_snapshotDocSelection());
    const next = history.redoStack.pop();
    state.doc = _stateDeepClone(next.doc || {});
    state.ui.currentPageId = next.currentPageId || state.ui.currentPageId;
    _stateEnsureCurrentPage();
    _renderIfReady();
}

function _deepMerge(target, source) {
    if (!_isPlainObject(target) || !_isPlainObject(source)) return source;
    const out = { ...target };
    for (const [key, value] of Object.entries(source)) {
        if (_isPlainObject(value) && _isPlainObject(out[key])) {
            out[key] = _deepMerge(out[key], value);
        } else {
            out[key] = value;
        }
    }
    return out;
}

// ========== Read ==========

function getCurrentPageId() {
    return state.ui.currentPageId;
}

function getCurrentPage() {
    return _stateEnsureCurrentPage();
}

function getPageByIndex(index) {
    if (!Array.isArray(state.doc?.pages)) return null;
    return state.doc.pages[index] || null;
}

function listPages() {
    return Array.isArray(state.doc?.pages) ? state.doc.pages : [];
}

function getMaster() {
    return state.doc.master;
}

function getTheme() {
    return state.doc.master?.theme;
}

// ========== Write ==========

function patchCurrentPage(partial, options = {}) {
    const page = getCurrentPage();
    if (!page || !_isPlainObject(partial)) return;
    if (options.recordHistory !== false) recordDocHistory();
    page.data = _deepMerge(page.data || {}, partial);
    _stateNormalizePageRecord(page, page.type || 'content-grid');
    _postMutation(options.render !== false);
}

function patchMaster(partial, options = {}) {
    if (!_isPlainObject(partial)) return;
    if (options.recordHistory !== false) recordDocHistory();
    state.doc.master = _deepMerge(state.doc.master || {}, partial);
    _postMutation(options.render !== false);
}

function mutateCurrentPageData(mutator, options = {}) {
    const page = getCurrentPage();
    if (!page || typeof mutator !== 'function') return;
    if (options.recordHistory !== false) recordDocHistory();

    const draft = _stateDeepClone(page.data || {});
    const result = mutator(draft);
    if (_isPlainObject(result)) {
        page.data = result;
    } else {
        page.data = draft;
    }
    _stateNormalizePageRecord(page, page.type || 'content-grid');
    _postMutation(options.render !== false);
}

function mutateMaster(mutator, options = {}) {
    if (typeof mutator !== 'function') return;
    if (options.recordHistory !== false) recordDocHistory();

    const draft = _stateDeepClone(state.doc.master || {});
    const result = mutator(draft);
    if (_isPlainObject(result)) {
        state.doc.master = result;
    } else {
        state.doc.master = draft;
    }
    _postMutation(options.render !== false);
}

function setCurrentPage(pageId) {
    if (!pageId || !Array.isArray(state.doc?.pages)) return;
    const hit = state.doc.pages.find(p => p.id === pageId);
    if (!hit) return;
    _stateNormalizePageRecord(hit, hit.type || 'content-grid');
    state.ui.currentPageId = pageId;
    _stateEnsureCurrentPage();
    _renderIfReady();
}

function setCurrentPageType(type, options = {}) {
    const page = getCurrentPage();
    const nextType = type || 'content-grid';
    if (!page) return;
    if (page.type === nextType) return;
    if (options.recordHistory !== false) recordDocHistory();
    _stateMergePageDefaults(page, nextType);
    _postMutation(options.render !== false);
}

function setCurrentPageModel(shell, renderer, layout = null, options = {}) {
    const page = getCurrentPage();
    if (!page) return;
    const nextType = _stateResolveTypeFromModel(shell, renderer, page.type || 'content-grid');
    const shouldRecordHistory = options.recordHistory !== false;
    const typeChanged = page.type !== nextType;

    const pageModel = _stateResolveModelFromType(nextType);
    const nextLayout = layout || page.layout || page.bodyLayout || null;
    const layoutChanged = Boolean(nextLayout) && nextLayout !== page.layout;

    if (!typeChanged && !layoutChanged) {
        page.shell = pageModel.shell;
        page.renderer = pageModel.renderer;
        page.pageShell = pageModel.shell;
        page.bodyRenderer = pageModel.renderer;
        _postMutation(options.render !== false);
        return;
    }

    if (shouldRecordHistory) recordDocHistory();

    if (typeChanged) {
        _stateMergePageDefaults(page, nextType);
    } else {
        page.shell = pageModel.shell;
        page.renderer = pageModel.renderer;
        page.pageShell = pageModel.shell;
        page.bodyRenderer = pageModel.renderer;
    }
    _stateNormalizePageRecord(page, nextType);

    if (nextLayout) {
        _stateApplyLayoutToPageData(page, nextType, nextLayout);
        _stateNormalizePageRecord(page, nextType);
    }

    _postMutation(options.render !== false);
}

// ========== Page Operations ==========

function addPage(type, afterIndex = null) {
    const pageType = type || 'content-grid';
    const model = _stateResolveModelFromType(pageType);
    return addPageByModel(model.shell, model.renderer, null, afterIndex, { recordHistory: true });
}

function addPageByModel(shell, renderer, layout = null, afterIndex = null, options = {}) {
    if (options.recordHistory !== false) recordDocHistory();
    const pageType = _stateResolveTypeFromModel(shell, renderer, 'content-grid');
    const id = _generatePageId();
    const newPage = _stateCreateDefaultPage(pageType, id);
    _stateNormalizePageRecord(newPage, pageType);
    if (layout) {
        _stateApplyLayoutToPageData(newPage, pageType, layout);
        _stateNormalizePageRecord(newPage, pageType);
    }
    if (!Array.isArray(state.doc.pages)) state.doc.pages = [];

    let insertIndex = state.doc.pages.length;
    if (Number.isInteger(afterIndex)) {
        insertIndex = Math.max(0, Math.min(state.doc.pages.length, afterIndex + 1));
    }

    state.doc.pages.splice(insertIndex, 0, newPage);
    state.ui.currentPageId = newPage.id;
    _stateEnsureCurrentPage();
    _postMutation(options.render !== false);
    return newPage;
}

function deletePage(pageId) {
    if (!Array.isArray(state.doc?.pages) || state.doc.pages.length === 0) return;
    const index = state.doc.pages.findIndex(p => p.id === pageId);
    if (index === -1) return;
    recordDocHistory();

    state.doc.pages.splice(index, 1);

    if (state.doc.pages.length === 0) {
        const fallback = _stateCreateDefaultPage('content-grid', _generatePageId());
        state.doc.pages.push(fallback);
        state.ui.currentPageId = fallback.id;
        _renderIfReady();
        return;
    }

    if (state.ui.currentPageId === pageId) {
        const nextIndex = Math.min(index, state.doc.pages.length - 1);
        state.ui.currentPageId = state.doc.pages[nextIndex].id;
    }
    _stateEnsureCurrentPage();
    _renderIfReady();
}

function duplicatePage(pageId) {
    if (!Array.isArray(state.doc?.pages)) return null;
    const index = state.doc.pages.findIndex(p => p.id === pageId);
    if (index === -1) return null;
    recordDocHistory();

    const page = state.doc.pages[index];
    const copy = {
        id: _generatePageId(),
        type: page.type || 'content-grid',
        shell: page.shell,
        renderer: page.renderer,
        layout: page.layout,
        pageShell: page.pageShell,
        bodyRenderer: page.bodyRenderer,
        bodyLayout: page.bodyLayout,
        data: _stateDeepClone(page.data || {}),
    };
    _stateMergePageDefaults(copy, copy.type);
    state.doc.pages.splice(index + 1, 0, copy);
    state.ui.currentPageId = copy.id;
    _stateEnsureCurrentPage();
    _renderIfReady();
    return copy;
}

function movePage(fromIndex, toIndex) {
    if (!Array.isArray(state.doc?.pages) || state.doc.pages.length <= 1) return;
    if (!Number.isInteger(fromIndex) || !Number.isInteger(toIndex)) return;
    if (fromIndex < 0 || fromIndex >= state.doc.pages.length) return;

    const clampedTo = Math.max(0, Math.min(state.doc.pages.length - 1, toIndex));
    if (fromIndex === clampedTo) return;
    recordDocHistory();

    const [page] = state.doc.pages.splice(fromIndex, 1);
    state.doc.pages.splice(clampedTo, 0, page);
    _stateEnsureCurrentPage();
    _renderIfReady();
}

// Expose API
window.getCurrentPageId = getCurrentPageId;
window.getCurrentPage = getCurrentPage;
window.getPageByIndex = getPageByIndex;
window.listPages = listPages;
window.getMaster = getMaster;
window.getTheme = getTheme;
window.patchCurrentPage = patchCurrentPage;
window.patchMaster = patchMaster;
window.mutateCurrentPageData = mutateCurrentPageData;
window.mutateMaster = mutateMaster;
window.setCurrentPage = setCurrentPage;
window.setCurrentPageType = setCurrentPageType;
window.setCurrentPageModel = setCurrentPageModel;
window.addPage = addPage;
window.addPageByModel = addPageByModel;
window.deletePage = deletePage;
window.duplicatePage = duplicatePage;
window.movePage = movePage;
window.recordDocHistory = recordDocHistory;
window.undoDoc = undoDoc;
window.redoDoc = redoDoc;
