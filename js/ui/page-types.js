// Page Type Management Functions

/**
 * Update current page type and show/hide corresponding operation bars
 */
function updatePageType(type) {
    state.pageType = type;

    // Show/hide cover operation bar
    const coverBar = document.getElementById('cover-operation-bar');
    if (type === 'cover') {
        coverBar.classList.add('visible');
        renderCoverLayoutSelector();
    } else {
        coverBar.classList.remove('visible');
    }

    // Show/hide divider operation bar
    const dividerBar = document.getElementById('divider-operation-bar');
    if (type === 'divider') {
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
    if (type === 'content-grid') {
        gridBar.classList.add('visible');
        renderGridOperationBar();
    } else {
        gridBar.classList.remove('visible');
    }

    // Show/hide smartart operation bar
    const smartartBar = document.getElementById('smartart-operation-bar');
    if (type === 'content-smartart') {
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
    state.coverLayout = layoutId;
    renderCoverLayoutSelector();
    render();
}
