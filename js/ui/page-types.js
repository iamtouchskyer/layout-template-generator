// Page Type / Page Model management

function _pageModelHelpers() {
    return window.__pageModelUtils || {};
}

function _resolveTypeFromModel(shell, renderer) {
    const helper = _pageModelHelpers();
    if (typeof helper.resolveTypeFromModel === 'function') {
        return helper.resolveTypeFromModel(shell, renderer, 'content-grid');
    }
    if (shell === 'cover') return 'cover';
    if (shell === 'divider') return 'divider';
    if (shell === 'content' && renderer === 'smartart') return 'content-smartart';
    return 'content-grid';
}

function _resolveModelFromType(type) {
    const helper = _pageModelHelpers();
    if (typeof helper.getPageModelFromType === 'function') {
        return helper.getPageModelFromType(type);
    }
    if (type === 'cover') return { shell: 'cover', renderer: 'cover' };
    if (type === 'divider') return { shell: 'divider', renderer: 'divider' };
    if (type === 'content-smartart') return { shell: 'content', renderer: 'smartart' };
    return { shell: 'content', renderer: 'grid' };
}

function _getCurrentPageRecord() {
    if (typeof getCurrentPage === 'function') return getCurrentPage();
    return null;
}

function _layoutOptionsForType(type) {
    if (type === 'cover') {
        return Object.entries(COVER_LAYOUTS || {}).map(([id, cfg]) => ({
            value: id,
            label: cfg?.name || id,
        }));
    }
    if (type === 'divider') {
        return Object.entries(DIVIDER_LAYOUTS || {}).map(([id, cfg]) => ({
            value: id,
            label: cfg?.label || id,
        }));
    }
    if (type === 'content-smartart') {
        return Object.entries(SMARTART_PLACEMENTS || {}).map(([id, cfg]) => ({
            value: id,
            label: cfg?.label || id,
        }));
    }
    return Object.entries(GRID_LAYOUTS || {}).map(([id, cfg]) => ({
        value: id,
        label: cfg?.label || id,
    }));
}

function _currentLayoutByType(type, page) {
    const helper = _pageModelHelpers();
    if (typeof helper.derivePageLayout === 'function') {
        return helper.derivePageLayout(type, page?.data || {}, page?.layout);
    }
    const data = page?.data || {};
    if (type === 'cover') return data.coverLayout || page?.layout || 'cross_rectangles';
    if (type === 'divider') return data.dividerLayout || data.divider?.layout || page?.layout || 'cards-highlight';
    if (type === 'content-smartart') return data.smartartPlacement || data.smartart?.placement || page?.layout || 'left-desc';
    return data.gridLayout || data.grid?.layout || page?.layout || 'two-col-equal';
}

function _renderModelRendererOptions(shell, selectedRenderer) {
    const rendererSelect = document.getElementById('page-renderer-select');
    if (!rendererSelect) return;
    const options = shell === 'cover'
        ? [{ value: 'cover', label: 'cover' }]
        : shell === 'divider'
            ? [{ value: 'divider', label: 'divider' }]
            : [{ value: 'grid', label: 'grid' }, { value: 'smartart', label: 'smartart' }];
    rendererSelect.innerHTML = options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('');
    const hit = options.some(opt => opt.value === selectedRenderer);
    rendererSelect.value = hit ? selectedRenderer : options[0].value;
}

function refreshPageModelControls() {
    const page = _getCurrentPageRecord();
    const type = state.pageType || 'content-grid';
    const model = _resolveModelFromType(type);
    const shell = page?.shell || page?.pageShell || model.shell;
    const renderer = page?.renderer || page?.bodyRenderer || model.renderer;

    const shellSelect = document.getElementById('page-shell-select');
    if (shellSelect) shellSelect.value = shell;

    _renderModelRendererOptions(shell, renderer);

    const layoutSelect = document.getElementById('page-layout-select');
    if (layoutSelect) {
        const effectiveType = _resolveTypeFromModel(shell, renderer);
        const options = _layoutOptionsForType(effectiveType);
        const currentLayout = _currentLayoutByType(effectiveType, page);
        layoutSelect.innerHTML = options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('');
        const hit = options.some(opt => opt.value === currentLayout);
        layoutSelect.value = hit ? currentLayout : (options[0]?.value || '');
    }

    document.querySelectorAll('input[name="page-type"]').forEach(input => {
        input.checked = input.value === type;
    });
}

function _applyLayoutToCurrentPage(type, layoutValue) {
    if (!layoutValue || typeof patchCurrentPage !== 'function') return;
    if (type === 'cover') {
        patchCurrentPage({ coverLayout: layoutValue }, { recordHistory: false, render: false });
        return;
    }
    if (type === 'divider') {
        patchCurrentPage({ dividerLayout: layoutValue }, { recordHistory: false, render: false });
        return;
    }
    if (type === 'content-smartart') {
        patchCurrentPage({ smartartPlacement: layoutValue }, { recordHistory: false, render: false });
        return;
    }
    patchCurrentPage({ gridLayout: layoutValue }, { recordHistory: false, render: false });
}

function _syncOperationBarsByType(currentType) {
    const contentShellBar = document.getElementById('content-shell-operation-bar');
    if (contentShellBar) {
        if (currentType === 'content-grid' || currentType === 'content-smartart') {
            contentShellBar.classList.add('visible');
            renderContentShellOperationBar();
        } else {
            contentShellBar.classList.remove('visible');
        }
    }

    const coverBar = document.getElementById('cover-operation-bar');
    if (currentType === 'cover') {
        coverBar.classList.add('visible');
        renderCoverLayoutSelector();
    } else {
        coverBar.classList.remove('visible');
    }

    const dividerBar = document.getElementById('divider-operation-bar');
    if (currentType === 'divider') {
        dividerBar.classList.add('visible');
        renderDividerStyleSelector();
        renderDividerCountSelector();
        renderDividerNumberSelector();
        renderDividerTextSelector();
        renderDividerBgSelector();
        renderDividerIndexSelector();
    } else {
        dividerBar.classList.remove('visible');
    }

    const gridBar = document.getElementById('grid-operation-bar');
    if (currentType === 'content-grid') {
        gridBar.classList.add('visible');
        renderGridOperationBar();
    } else {
        gridBar.classList.remove('visible');
    }

    const smartartBar = document.getElementById('smartart-operation-bar');
    if (currentType === 'content-smartart') {
        smartartBar.classList.add('visible');
        renderSmartartTypeSelector();
        renderSmartartCountSelector();
        renderSmartartPlacements();
        renderSmartartColorSelector();
    } else {
        smartartBar.classList.remove('visible');
    }
}

function _currentContentShellValue(page, key, fallback) {
    const value = page?.data?.[key];
    const text = String(value ?? '').trim();
    return text || fallback;
}

function renderContentShellOperationBar() {
    const page = _getCurrentPageRecord();
    const titleInput = document.getElementById('content-shell-title-input');
    const tagInput = document.getElementById('content-shell-tag-input');
    const sourceInput = document.getElementById('content-shell-source-input');
    if (!titleInput || !tagInput || !sourceInput) return;

    titleInput.value = _currentContentShellValue(page, 'contentTitle', '市场趋势分析');
    tagInput.value = _currentContentShellValue(page, 'contentTag', '分析报告');
    sourceInput.value = _currentContentShellValue(page, 'contentSource', '行业研究报告 2024');
}

function updateCurrentPageShellText(field, value) {
    if (typeof patchCurrentPage !== 'function') return;
    const normalized = String(value ?? '').trim();
    const fallbackMap = {
        contentTitle: '市场趋势分析',
        contentTag: '分析报告',
        contentSource: '行业研究报告 2024',
    };
    const nextValue = normalized || fallbackMap[field] || '';
    patchCurrentPage({ [field]: nextValue });
}

/**
 * Compatibility entry: still supports old page-type radio group.
 */
function updatePageType(type, options = {}) {
    const shouldRecordHistory = options.recordHistory !== false;
    if (typeof setCurrentPageType === 'function') {
        setCurrentPageType(type, { recordHistory: shouldRecordHistory, render: false });
    } else if (shouldRecordHistory && type !== state.pageType && typeof recordDocHistory === 'function') {
        recordDocHistory();
        state.pageType = type;
    } else {
        state.pageType = type;
    }

    refreshPageModelControls();
    _syncOperationBarsByType(state.pageType);
    render();
}

/**
 * Primary entry: page model editing via shell/renderer/layout controls.
 */
function updatePageModelFromControls(options = {}) {
    const shouldRecordHistory = options.recordHistory !== false;
    const shellSelect = document.getElementById('page-shell-select');
    const rendererSelect = document.getElementById('page-renderer-select');
    const layoutSelect = document.getElementById('page-layout-select');
    if (!shellSelect || !rendererSelect || !layoutSelect) return;

    const shell = shellSelect.value || 'content';
    const normalizedRenderer = shell === 'cover' ? 'cover' : shell === 'divider' ? 'divider' : (rendererSelect.value || 'grid');
    const nextType = _resolveTypeFromModel(shell, normalizedRenderer);
    const nextLayoutOptions = _layoutOptionsForType(nextType);
    const selectedLayout = layoutSelect.value;
    const nextLayout = nextLayoutOptions.some(opt => opt.value === selectedLayout)
        ? selectedLayout
        : (nextLayoutOptions[0]?.value || '');

    if (typeof setCurrentPageModel === 'function') {
        setCurrentPageModel(shell, normalizedRenderer, nextLayout, {
            recordHistory: shouldRecordHistory,
            render: false,
        });
    } else {
        const typeChanged = nextType !== state.pageType;
        if (typeChanged) {
            if (typeof setCurrentPageType === 'function') {
                setCurrentPageType(nextType, { recordHistory: shouldRecordHistory, render: false });
            } else if (shouldRecordHistory && typeof recordDocHistory === 'function') {
                recordDocHistory();
                state.pageType = nextType;
            } else {
                state.pageType = nextType;
            }
        }
        const page = _getCurrentPageRecord();
        const currentLayout = _currentLayoutByType(nextType, page);
        if (nextLayout && nextLayout !== currentLayout) {
            if (!typeChanged && shouldRecordHistory && typeof recordDocHistory === 'function') {
                recordDocHistory();
            }
            _applyLayoutToCurrentPage(nextType, nextLayout);
        }
    }

    refreshPageModelControls();
    _syncOperationBarsByType(state.pageType);
    render();
}

/**
 * Render cover layout selector
 */
function renderCoverLayoutSelector() {
    const container = document.getElementById('cover-layout-selector');
    if (!container) return;

    container.innerHTML = `
        <div class="cover-layout-row">
            ${Object.entries(COVER_LAYOUTS).map(([id, layout]) => `
                <button class="cover-layout-btn ${state.coverLayout === id ? 'active' : ''}"
                        onclick="selectCoverLayout('${id}')" title="${layout.description}">
                    ${layout.name}
                </button>
            `).join('')}
        </div>
    `;
}

/**
 * Select cover layout
 */
function selectCoverLayout(layoutId) {
    patchCurrentPage({ coverLayout: layoutId });
    refreshPageModelControls();
    renderCoverLayoutSelector();
}

window.refreshPageModelControls = refreshPageModelControls;
window.updatePageModelFromControls = updatePageModelFromControls;
window.renderContentShellOperationBar = renderContentShellOperationBar;
window.updateCurrentPageShellText = updateCurrentPageShellText;
