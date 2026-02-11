// Basic UI Controls

/**
 * Toggle section collapse/expand
 */
function toggleSection(section) {
    const content = document.getElementById(`content-${section}`);
    const toggle = document.getElementById(`toggle-${section}`);
    const isCollapsed = content.classList.toggle('collapsed');
    toggle.textContent = isCollapsed ? '▶' : '▼';
}

/**
 * Switch between preview and JSON tabs
 */
function setPreviewTab(tab) {
    state.previewTab = tab;
    document.querySelectorAll('.preview-tab').forEach(el => {
        el.classList.toggle('active', el.textContent.toLowerCase() === tab);
    });
    document.getElementById('preview-viewport').style.display = tab === 'preview' ? 'flex' : 'none';
    document.getElementById('code-view').classList.toggle('active', tab === 'json');
    if (tab === 'json') updateJsonOutput();
}

/**
 * Set zoom level for preview
 */
function setZoom(value) {
    state.zoom = parseInt(value);
    document.getElementById('zoom-value').textContent = value + '%';
    document.querySelector('.slide-wrapper').style.setProperty('--zoom', value / 100);
}

/**
 * Update global theme state
 */
function updateState() {
    state.theme = document.getElementById('theme-select').value;
    // Re-render SmartArt color picker when theme changes (colors depend on theme)
    if (state.pageType === 'content-smartart') {
        renderSmartartColorSelector();
    }
    render();
}

/**
 * Initialize aspect ratio selector dropdown
 */
function initAspectRatioSelector() {
    const select = document.getElementById('aspect-ratio-select');
    if (!select || !ASPECT_RATIOS) return;

    select.innerHTML = Object.entries(ASPECT_RATIOS).map(([id, ar]) =>
        `<option value="${id}" ${id === CURRENT_ASPECT_RATIO ? 'selected' : ''}>${ar.label}</option>`
    ).join('');
}

/**
 * Update slide dimensions for selected aspect ratio
 */
function updateAspectRatio(aspectRatio) {
    updateSlideConfigForAspectRatio(aspectRatio);
    // Update global reference
    window.SLIDE_CONFIG = SLIDE_CONFIG;
    window.CURRENT_ASPECT_RATIO = aspectRatio;
    // Re-render with new dimensions
    render();
}
