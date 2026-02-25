// Placeholder Management Functions

/**
 * Toggle placeholder on/off
 */
function togglePlaceholder(phId) {
    const nextPlaceholders = JSON.parse(JSON.stringify(state.masterPlaceholders || {}));
    if (!nextPlaceholders[phId]) {
        const phConfig = PLACEHOLDERS_CONFIG[phId];
        nextPlaceholders[phId] = {
            enabled: true,
            position: phConfig.defaultPosition,
            size: phConfig.defaultSize || null,
            imageUrl: null
        };
    } else {
        nextPlaceholders[phId].enabled = !nextPlaceholders[phId].enabled;
    }
    patchMaster({ masterPlaceholders: nextPlaceholders });
    renderPlaceholderList();
}

/**
 * Update placeholder position
 */
function updatePlaceholderPosition(phId, position) {
    if (!state.masterPlaceholders[phId]) return;
    const nextPlaceholders = JSON.parse(JSON.stringify(state.masterPlaceholders || {}));
    nextPlaceholders[phId].position = position;
    patchMaster({ masterPlaceholders: nextPlaceholders });
}

/**
 * Update placeholder size
 */
function updatePlaceholderSize(phId, size) {
    if (!state.masterPlaceholders[phId]) return;
    const nextPlaceholders = JSON.parse(JSON.stringify(state.masterPlaceholders || {}));
    nextPlaceholders[phId].size = size;
    patchMaster({ masterPlaceholders: nextPlaceholders });
}

/**
 * Handle logo image upload
 */
function handleLogoUpload(phId, input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        if (!state.masterPlaceholders[phId]) return;
        const nextPlaceholders = JSON.parse(JSON.stringify(state.masterPlaceholders || {}));
        nextPlaceholders[phId].imageUrl = e.target.result;
        patchMaster({ masterPlaceholders: nextPlaceholders });
        renderPlaceholderList();
    };
    reader.readAsDataURL(file);
}

/**
 * Clear logo image
 */
function clearLogoImage(phId) {
    if (!state.masterPlaceholders[phId]) return;
    const nextPlaceholders = JSON.parse(JSON.stringify(state.masterPlaceholders || {}));
    nextPlaceholders[phId].imageUrl = null;
    patchMaster({ masterPlaceholders: nextPlaceholders });
    renderPlaceholderList();
}
