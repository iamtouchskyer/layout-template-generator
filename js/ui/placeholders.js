// Placeholder Management Functions

/**
 * Toggle placeholder on/off
 */
function togglePlaceholder(phId) {
    if (!state.masterPlaceholders[phId]) {
        const phConfig = PLACEHOLDERS_CONFIG[phId];
        state.masterPlaceholders[phId] = {
            enabled: true,
            position: phConfig.defaultPosition,
            size: phConfig.defaultSize || null,
            imageUrl: null
        };
    } else {
        state.masterPlaceholders[phId].enabled = !state.masterPlaceholders[phId].enabled;
    }
    renderPlaceholderList();
    render();
}

/**
 * Update placeholder position
 */
function updatePlaceholderPosition(phId, position) {
    if (state.masterPlaceholders[phId]) {
        state.masterPlaceholders[phId].position = position;
        render();
    }
}

/**
 * Update placeholder size
 */
function updatePlaceholderSize(phId, size) {
    if (state.masterPlaceholders[phId]) {
        state.masterPlaceholders[phId].size = size;
        render();
    }
}

/**
 * Handle logo image upload
 */
function handleLogoUpload(phId, input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        if (state.masterPlaceholders[phId]) {
            state.masterPlaceholders[phId].imageUrl = e.target.result;
            renderPlaceholderList();
            render();
        }
    };
    reader.readAsDataURL(file);
}

/**
 * Clear logo image
 */
function clearLogoImage(phId) {
    if (state.masterPlaceholders[phId]) {
        state.masterPlaceholders[phId].imageUrl = null;
        renderPlaceholderList();
        render();
    }
}
