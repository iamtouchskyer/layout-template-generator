// Shape Control Functions

/**
 * Toggle shape on/off
 */
function toggleShape(shapeId) {
    const existingIndex = state.masterShapes.findIndex(s => s.id === shapeId);
    if (existingIndex >= 0) {
        state.masterShapes.splice(existingIndex, 1);
    } else {
        const shapeConfig = SHAPE_PRESETS[shapeId];
        if (shapeConfig.configType === 'thickness-positions') {
            // New thickness-positions config
            state.masterShapes.push({
                id: shapeId,
                thickness: shapeConfig.defaultThickness,
                positions: [...shapeConfig.defaultPositions]
            });
        } else {
            // Legacy preset-based config
            const defaultPreset = shapeConfig.presets[0].id;
            state.masterShapes.push({ id: shapeId, preset: defaultPreset });
        }
    }
    renderShapesList();
    render();
}

/**
 * Update shape preset (legacy config)
 */
function updateShapePreset(shapeId, presetId) {
    const shape = state.masterShapes.find(s => s.id === shapeId);
    if (shape) {
        shape.preset = presetId;
        render();
    }
}

/**
 * Update shape thickness (thickness-positions config)
 */
function updateShapeThickness(shapeId, thickness) {
    const shape = state.masterShapes.find(s => s.id === shapeId);
    if (shape) {
        shape.thickness = thickness;
        render();
    }
}

/**
 * Update shape position (thickness-positions config)
 */
function updateShapePosition(shapeId, positionId, isChecked) {
    const shape = state.masterShapes.find(s => s.id === shapeId);
    if (!shape) return;

    if (!shape.positions) shape.positions = [];

    if (isChecked) {
        if (!shape.positions.includes(positionId)) {
            shape.positions.push(positionId);
        }
    } else {
        const idx = shape.positions.indexOf(positionId);
        if (idx >= 0) shape.positions.splice(idx, 1);
    }
    render();
}
