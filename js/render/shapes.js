// Shape rendering functions

function renderShapesList() {
    const container = document.getElementById('shapes-list');
    container.innerHTML = Object.entries(SHAPE_PRESETS).map(([shapeId, shape]) => {
        const isActive = state.masterShapes.some(s => s.id === shapeId);
        const shapeState = state.masterShapes.find(s => s.id === shapeId);

        let optionsHtml = '';
        if (shape.configType === 'thickness-positions') {
            // New thickness-positions config
            const currentThickness = shapeState?.thickness || shape.defaultThickness;
            const currentPositions = shapeState?.positions || shape.defaultPositions || [];

            // Thickness dropdown
            const thicknessOptions = Object.entries(shape.thickness)
                .map(([id, t]) => `<option value="${id}" ${currentThickness === id ? 'selected' : ''}>${t.label}</option>`)
                .join('');

            // Position checkboxes
            const positionCheckboxes = Object.entries(shape.positions)
                .map(([id, p]) => {
                    const isChecked = currentPositions.includes(id);
                    return `<label class="position-checkbox">
                        <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="updateShapePosition('${shapeId}', '${id}', this.checked)">
                        <span>${p.label}</span>
                    </label>`;
                })
                .join('');

            optionsHtml = `
                <div class="option-row">
                    <label>大小</label>
                    <select onchange="updateShapeThickness('${shapeId}', this.value)">${thicknessOptions}</select>
                </div>
                <div class="option-row">
                    <label>位置</label>
                    <div class="position-checkboxes">${positionCheckboxes}</div>
                </div>
            `;
        } else {
            // Legacy preset-based config
            const currentPreset = shapeState?.preset || shape.presets[0].id;
            optionsHtml = `
                <div class="option-row">
                    <label>Variant</label>
                    <select onchange="updateShapePreset('${shapeId}', this.value)">
                        ${shape.presets.map(p => `<option value="${p.id}" ${currentPreset === p.id ? 'selected' : ''}>${p.name}</option>`).join('')}
                    </select>
                </div>
            `;
        }

        return `
            <div class="shape-item ${isActive ? 'active' : ''}" data-shape="${shapeId}">
                <div class="shape-item-header" onclick="toggleShape('${shapeId}')">
                    <input type="checkbox" ${isActive ? 'checked' : ''} onclick="event.stopPropagation(); toggleShape('${shapeId}')">
                    <span class="item-label">${shape.label}</span>
                </div>
                <div class="shape-item-options">${optionsHtml}</div>
            </div>
        `;
    }).join('');
}

function renderThicknessPositionShape(shapeId, thickness, position, thicknessConfig, defaultStyle) {
    const presetKey = `${thickness}-${position}`;
    const decorativeClass = SHAPE_PRESETS[shapeId]?.occupiesSpace === false ? 'decorative' : '';

    switch (shapeId) {
        case 'side-bar': {
            return `<div class="master-shape ${decorativeClass} side-bar" data-preset="${presetKey}"></div>`;
        }
        case 'corner': {
            return `<div class="master-shape ${decorativeClass} corner-shape" data-preset="${presetKey}"></div>`;
        }
        case 'corner-dots': {
            const size = thicknessConfig.size || 60;
            const dotSize = thicknessConfig.dotSize || 2;
            const gap = thicknessConfig.gap || 10;
            const opacity = defaultStyle?.opacity || 0.3;
            const posStyle = getCornerPositionStyle(position, size);
            const style = `${posStyle}; width: ${size}px; height: ${size}px; background-image: radial-gradient(var(--theme-accent) ${dotSize}px, transparent ${dotSize}px); background-size: ${gap + dotSize}px ${gap + dotSize}px; opacity: ${opacity};`;
            return `<div class="master-shape ${decorativeClass} corner-dots-dynamic" style="${style}"></div>`;
        }
        case 'corner-lines': {
            const size = thicknessConfig.size || 40;
            const lineWidth = thicknessConfig.lineWidth || 1;
            const gap = thicknessConfig.gap || 8;
            const opacity = defaultStyle?.opacity || 0.2;
            const posStyle = getCornerPositionStyle(position, size);
            // Render 3 diagonal lines
            const lineCount = Math.floor(size / (gap + lineWidth));
            let linesHtml = '';
            for (let i = 0; i < Math.min(lineCount, 5); i++) {
                const offset = i * (gap + lineWidth);
                linesHtml += `<div style="position:absolute; background:var(--theme-accent); ${getLineStyle(position, offset, size, lineWidth)}"></div>`;
            }
            return `<div class="master-shape ${decorativeClass} corner-lines-dynamic" style="${posStyle}; width: ${size}px; height: ${size}px; opacity: ${opacity}; overflow: hidden;">${linesHtml}</div>`;
        }
        case 'accent-circle': {
            const size = thicknessConfig.size || 100;
            const offset = thicknessConfig.offset || -25;
            const opacity = defaultStyle?.opacity || 0.08;
            const posStyle = getCornerPositionStyle(position, size, offset);
            const style = `${posStyle}; width: ${size}px; height: ${size}px; border-radius: 50%; opacity: ${opacity};`;
            return `<div class="master-shape ${decorativeClass} accent-circle-dynamic" style="${style}"></div>`;
        }
        case 'accent-ring': {
            const size = thicknessConfig.size || 80;
            const strokeWidth = thicknessConfig.strokeWidth || 3;
            const offset = thicknessConfig.offset || -20;
            const opacity = defaultStyle?.opacity || 0.15;
            const posStyle = getCornerPositionStyle(position, size, offset);
            const style = `${posStyle}; width: ${size}px; height: ${size}px; border-radius: 50%; border: ${strokeWidth}px solid var(--theme-accent); background: transparent; opacity: ${opacity};`;
            return `<div class="master-shape ${decorativeClass} accent-ring-dynamic" style="${style}"></div>`;
        }
        default:
            return '';
    }
}

function getCornerPositionStyle(position, size, offset = 20) {
    switch (position) {
        case 'tl': return `position: absolute; top: ${offset}px; left: ${offset}px`;
        case 'tr': return `position: absolute; top: ${offset}px; right: ${offset}px`;
        case 'bl': return `position: absolute; bottom: ${offset}px; left: ${offset}px`;
        case 'br': return `position: absolute; bottom: ${offset}px; right: ${offset}px`;
        case 'left': return `position: absolute; top: 0; bottom: 0; left: 0`;
        case 'right': return `position: absolute; top: 0; bottom: 0; right: 0`;
        case 'top': return `position: absolute; left: 0; right: 0; top: 0`;
        case 'bottom': return `position: absolute; left: 0; right: 0; bottom: 0`;
        default: return '';
    }
}

function getLineStyle(position, offset, size, lineWidth) {
    switch (position) {
        case 'tl': return `top: ${offset}px; left: 0; width: ${size - offset}px; height: ${lineWidth}px; transform: rotate(-45deg); transform-origin: top left;`;
        case 'tr': return `top: ${offset}px; right: 0; width: ${size - offset}px; height: ${lineWidth}px; transform: rotate(45deg); transform-origin: top right;`;
        case 'bl': return `bottom: ${offset}px; left: 0; width: ${size - offset}px; height: ${lineWidth}px; transform: rotate(45deg); transform-origin: bottom left;`;
        case 'br': return `bottom: ${offset}px; right: 0; width: ${size - offset}px; height: ${lineWidth}px; transform: rotate(-45deg); transform-origin: bottom right;`;
        default: return '';
    }
}
