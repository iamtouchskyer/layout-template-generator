// Main Application Entry Point

/**
 * Initialize the application after config is loaded
 */
function init() {
    renderShapesList();
    setZoom(state.zoom);

    // Initialize grid operation bar if content-grid is selected
    if (state.pageType === 'content-grid') {
        document.getElementById('grid-operation-bar').classList.add('visible');
        renderGridOperationBar();
    }

    render();
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
        window.SHAPE_PRESETS = SHAPE_PRESETS;
        window.GRID_LAYOUTS = GRID_LAYOUTS;
        window.ZONE_CONTENT_TYPES = ZONE_CONTENT_TYPES;
        window.PLACEHOLDERS_CONFIG = PLACEHOLDERS_CONFIG;
        window.CONFIG = CONFIG;

        // Initialize the app
        init();

        console.log('App initialized successfully');
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
