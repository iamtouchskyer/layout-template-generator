// Shape Control Functions

/**
 * Toggle shape on/off
 */
function toggleShape(shapeId) {
    const nextShapes = JSON.parse(JSON.stringify(state.masterShapes || []));
    const existingIndex = nextShapes.findIndex(s => s.id === shapeId);
    if (existingIndex >= 0) {
        nextShapes.splice(existingIndex, 1);
    } else {
        const shapeConfig = SHAPE_PRESETS[shapeId];
        if (shapeConfig.configType === 'thickness-positions') {
            // New thickness-positions config
            nextShapes.push({
                id: shapeId,
                thickness: shapeConfig.defaultThickness,
                positions: [...shapeConfig.defaultPositions]
            });
        } else {
            // Legacy preset-based config
            const defaultPreset = shapeConfig.presets[0].id;
            nextShapes.push({ id: shapeId, preset: defaultPreset });
        }
    }
    patchMaster({ masterShapes: nextShapes });
    renderShapesList();
}

/**
 * Update shape preset (legacy config)
 */
function updateShapePreset(shapeId, presetId) {
    const nextShapes = JSON.parse(JSON.stringify(state.masterShapes || []));
    const shape = nextShapes.find(s => s.id === shapeId);
    if (!shape) return;
    shape.preset = presetId;
    patchMaster({ masterShapes: nextShapes });
}

/**
 * Update shape thickness (thickness-positions config)
 */
function updateShapeThickness(shapeId, thickness) {
    const nextShapes = JSON.parse(JSON.stringify(state.masterShapes || []));
    const shape = nextShapes.find(s => s.id === shapeId);
    if (!shape) return;
    shape.thickness = thickness;
    patchMaster({ masterShapes: nextShapes });
}

/**
 * Update shape position (thickness-positions config)
 */
function updateShapePosition(shapeId, positionId, isChecked) {
    const nextShapes = JSON.parse(JSON.stringify(state.masterShapes || []));
    const shape = nextShapes.find(s => s.id === shapeId);
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
    patchMaster({ masterShapes: nextShapes });
}
