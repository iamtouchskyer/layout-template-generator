/**
 * Matrix Layout - 2x2 grid with center node
 * Based on OOXML matrix1/matrix2/matrix3 layouts
 *
 * Basic Matrix (matrix1):
 * - 2x2 quadrant grid with rounded corners
 * - Center node (parent) overlays quadrants with higher z-order
 * - Data: items[0] = center, items[1-4] = quadrants (top-left, top-right, bottom-left, bottom-right)
 * - Always shows 4 quadrants, empty text if fewer items
 */

export function matrixLayout(option, config = {}) {
    const { items, size, theme } = option;
    const { titled = false, cycle = false } = config;
    const { width, height } = size;

    if (titled) {
        return matrixTitledLayout(option, config);
    }

    if (cycle) {
        return matrixCycleLayout(option, config);
    }

    // Basic matrix: center parent + 4 quadrant children
    return matrixBasicLayout(option);
}

/**
 * Basic Matrix (matrix1) - 2x2 cells with center node overlay
 * Data: items[0] = center parent, items[1-4] = quadrant children
 */
function matrixBasicLayout(option) {
    const { items, size, theme } = option;
    const { width, height } = size;

    const shapes = [];
    const gap = 4;
    const cellW = (width - gap) / 2;
    const cellH = (height - gap) / 2;

    // 4 quadrant cells (items[1-4]) with different accent colors
    for (let i = 0; i < 4; i++) {
        const row = Math.floor(i / 2);
        const col = i % 2;
        const item = items[i + 1]; // items[1-4] are quadrants
        const accentKey = `accent${(i % 4) + 1}`;
        shapes.push({
            id: `cell-${i}`,
            type: 'roundRect',
            x: col * (cellW + gap),
            y: row * (cellH + gap),
            width: cellW,
            height: cellH,
            text: item?.text || item || '',
            fill: theme[accentKey] || theme.accent1,
            stroke: theme.light1,
            strokeWidth: 2,
            textColor: theme.light1,
            fontSize: Math.min(24, cellH * 0.2),
            rx: 16,
            ry: 16
        });
    }

    // Center node (items[0]) - overlays quadrants
    const centerW = width * 0.28;
    const centerH = height * 0.22;
    shapes.push({
        id: 'center',
        type: 'roundRect',
        x: (width - centerW) / 2,
        y: (height - centerH) / 2,
        width: centerW,
        height: centerH,
        fill: theme.light1,
        stroke: theme.accent1,
        strokeWidth: 2,
        text: items[0]?.text || items[0] || '',
        textColor: theme.dark1,
        fontSize: Math.min(20, centerH * 0.35),
        rx: 8,
        ry: 8
    });

    return {
        type: 'matrix',
        shapes,
        connectors: [],
        bounds: { x: 0, y: 0, width, height }
    };
}

/**
 * Titled Matrix (matrix2)
 */
function matrixTitledLayout(option, config) {
    const { items, size, theme } = option;
    const { width, height } = size;

    const shapes = [];
    const titleHeight = height * 0.15;
    const gridHeight = height - titleHeight;
    const gap = 8;

    // Title bar
    shapes.push({
        id: 'title',
        type: 'rect',
        x: 0,
        y: 0,
        width,
        height: titleHeight - gap,
        text: items[0]?.text || items[0] || 'Title',
        fill: theme.accent1,
        stroke: 'none',
        textColor: theme.light1,
        fontSize: 18
    });

    // 2x2 grid cells
    const cellW = (width - gap) / 2;
    const cellH = (gridHeight - gap) / 2;

    for (let i = 0; i < 4; i++) {
        const row = Math.floor(i / 2);
        const col = i % 2;
        const item = items[i + 1];

        shapes.push({
            id: `cell-${i}`,
            type: 'rect',
            x: col * (cellW + gap),
            y: titleHeight + row * (cellH + gap),
            width: cellW,
            height: cellH,
            text: item?.text || item || '',
            fill: theme[`accent${(i % 4) + 1}`],
            stroke: 'none',
            textColor: theme.light1,
            fontSize: Math.min(18, cellH * 0.15)
        });
    }

    return {
        type: 'matrix',
        shapes,
        connectors: [],
        bounds: { x: 0, y: 0, width, height }
    };
}

/**
 * Cycle Matrix (matrix3) - 2x2 with circular arrows
 */
function matrixCycleLayout(option, config) {
    const { items, size, theme } = option;
    const { width, height } = size;

    const shapes = [];
    const gap = 12;
    const cellW = (width - gap) / 2;
    const cellH = (height - gap) / 2;

    // 2x2 grid cells
    for (let i = 0; i < 4; i++) {
        const row = Math.floor(i / 2);
        const col = i % 2;
        const item = items[i];

        shapes.push({
            id: `cell-${i}`,
            type: 'rect',
            x: col * (cellW + gap),
            y: row * (cellH + gap),
            width: cellW,
            height: cellH,
            text: item?.text || item || '',
            fill: theme[`accent${(i % 4) + 1}`],
            stroke: 'none',
            textColor: theme.light1,
            fontSize: Math.min(18, cellH * 0.15),
            rx: 4,
            ry: 4
        });
    }

    // Cycle arrows in center
    const connectors = [];
    const centerX = width / 2;
    const centerY = height / 2;
    const arrowSize = Math.min(cellW, cellH) * 0.12;
    const r = gap * 1.5;

    [45, 135, 225, 315].forEach((angle, idx) => {
        const rad = (angle * Math.PI) / 180;
        connectors.push({
            id: `arrow-${idx}`,
            type: 'arrow',
            x: centerX + Math.cos(rad) * r - arrowSize / 2,
            y: centerY + Math.sin(rad) * r - arrowSize / 2,
            rotation: angle + 90,
            size: arrowSize,
            fill: theme.accent5
        });
    });

    return {
        type: 'matrix',
        shapes,
        connectors,
        bounds: { x: 0, y: 0, width, height }
    };
}
