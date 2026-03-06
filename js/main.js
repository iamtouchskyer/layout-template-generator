// Main Application Entry Point

/**
 * Toggle light/dark theme
 */
function toggleAppTheme() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const next = isLight ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next === 'dark' ? '' : next);
    if (next === 'dark') document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('app-theme', next);
    const btn = document.getElementById('btn-theme-toggle');
    if (btn) btn.textContent = next === 'light' ? '\u2600' : '\u263E';

    if (state.pageType === 'content-smartart') {
        if (typeof renderSmartartColorSelector === 'function') renderSmartartColorSelector();
        if (typeof renderSmartartTypeSelector === 'function') renderSmartartTypeSelector();
    }
}

function _initAppTheme() {
    const saved = localStorage.getItem('app-theme') || 'dark';
    if (saved === 'light') document.documentElement.setAttribute('data-theme', 'light');
    const btn = document.getElementById('btn-theme-toggle');
    if (btn) btn.textContent = saved === 'light' ? '\u2600' : '\u263E';
}

/**
 * Initialize the application after config is loaded
 */
function init() {
    _initAppTheme();
    if (typeof applySiteI18n === 'function') {
        applySiteI18n();
    }
    initAspectRatioSelector();
    renderPlaceholderList();
    renderShapesList();
    renderContentAreasConfig();  // L1 content areas (title/footer config)
    setZoom(state.zoom);
    updatePageType(state.pageType, { recordHistory: false });
    if (typeof updateHistoryButtons === 'function') updateHistoryButtons();
}

/**
 * Application startup
 */
async function startApp() {
    try {
        // Load configuration from JSON
        await loadConfig();

        // Make derived configs globally available
        window.SLIDE_CONFIG = SLIDE_CONFIG;
        window.ASPECT_RATIOS = ASPECT_RATIOS;
        window.CURRENT_ASPECT_RATIO = CURRENT_ASPECT_RATIO;
        window.SHAPE_PRESETS = SHAPE_PRESETS;
        window.GRID_LAYOUTS = GRID_LAYOUTS;
        window.ZONE_CONTENT_TYPES = ZONE_CONTENT_TYPES;
        window.PLACEHOLDERS_CONFIG = PLACEHOLDERS_CONFIG;
        window.CONTENT_AREAS = CONTENT_AREAS;
        window.CONFIG = CONFIG;

        // Initialize the app
        init();
    } catch (error) {
        console.error('Failed to start app:', error);
        document.body.innerHTML = `<div style="color: red; padding: 20px;">
            Failed to load configuration: ${error.message}<br>
            Please check that the server is running and config/slide-master.json exists.
        </div>`;
    }
}

// Test Menu Functions
function _testAddAllCovers() {
    Object.keys(COVER_LAYOUTS).forEach(layout => {
        addPageByModel('cover', 'cover', layout);
    });
}

function _testAddAllDividers() {
    Object.keys(DIVIDER_LAYOUTS).forEach(layout => {
        addPageByModel('divider', 'divider', layout);
    });
}

function _testAddAllGrids() {
    Object.keys(GRID_LAYOUTS).forEach(layout => {
        addPageByModel('content', 'grid', layout);
    });
}

function _testAddAllSmartArt() {
    Object.keys(SMARTART_TYPES).forEach(typeId => {
        const page = addPageByModel('content', 'smartart', null);
        if (page) page.data.smartartType = typeId;
    });
}

// Start the application
startApp();
