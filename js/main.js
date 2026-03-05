// Main Application Entry Point

/**
 * Initialize the application after config is loaded
 */
function init() {
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

// Start the application
startApp();
