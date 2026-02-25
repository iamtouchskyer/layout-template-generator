// Page Type Management Functions

/**
 * Update current page type and show/hide corresponding operation bars
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
    const currentType = state.pageType;
    document.querySelectorAll('input[name="page-type"]').forEach(input => {
        input.checked = input.value === currentType;
    });

    // Show/hide cover operation bar
    const coverBar = document.getElementById('cover-operation-bar');
    if (currentType === 'cover') {
        coverBar.classList.add('visible');
        renderCoverLayoutSelector();
    } else {
        coverBar.classList.remove('visible');
    }

    // Show/hide divider operation bar
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

    // Show/hide grid operation bar
    const gridBar = document.getElementById('grid-operation-bar');
    if (currentType === 'content-grid') {
        gridBar.classList.add('visible');
        renderGridOperationBar();
    } else {
        gridBar.classList.remove('visible');
    }

    // Show/hide smartart operation bar
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
    renderCoverLayoutSelector();
}
