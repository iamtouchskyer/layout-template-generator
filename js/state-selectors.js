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

function _renderIfReady() {
    if (typeof render === 'function') render();
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

function patchCurrentPage(partial) {
    const page = getCurrentPage();
    if (!page || !_isPlainObject(partial)) return;
    recordDocHistory();
    page.data = _deepMerge(page.data || {}, partial);
    _renderIfReady();
}

function patchMaster(partial) {
    if (!_isPlainObject(partial)) return;
    recordDocHistory();
    state.doc.master = _deepMerge(state.doc.master || {}, partial);
    _renderIfReady();
}

function setCurrentPage(pageId) {
    if (!pageId || !Array.isArray(state.doc?.pages)) return;
    const hit = state.doc.pages.find(p => p.id === pageId);
    if (!hit) return;
    state.ui.currentPageId = pageId;
    _stateEnsureCurrentPage();
    _renderIfReady();
}

// ========== Page Operations ==========

function addPage(type, afterIndex = null) {
    recordDocHistory();
    const pageType = type || 'content-grid';
    const id = _generatePageId();
    const newPage = _stateCreateDefaultPage(pageType, id);
    if (!Array.isArray(state.doc.pages)) state.doc.pages = [];

    let insertIndex = state.doc.pages.length;
    if (Number.isInteger(afterIndex)) {
        insertIndex = Math.max(0, Math.min(state.doc.pages.length, afterIndex + 1));
    }

    state.doc.pages.splice(insertIndex, 0, newPage);
    state.ui.currentPageId = newPage.id;
    _stateEnsureCurrentPage();
    _renderIfReady();
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
window.setCurrentPage = setCurrentPage;
window.addPage = addPage;
window.deletePage = deletePage;
window.duplicatePage = duplicatePage;
window.movePage = movePage;
window.recordDocHistory = recordDocHistory;
window.undoDoc = undoDoc;
window.redoDoc = redoDoc;
