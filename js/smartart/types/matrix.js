/**
 * Matrix layouts aligned to OOXML matrix1/matrix2/matrix3 references.
 */

function mixColor(hexA, hexB, ratio = 0.5) {
    if (!hexA || !hexB) return hexA || hexB || '#999999';
    const a = hexA.replace('#', '');
    const b = hexB.replace('#', '');
    const ar = parseInt(a.substring(0, 2), 16);
    const ag = parseInt(a.substring(2, 4), 16);
    const ab = parseInt(a.substring(4, 6), 16);
    const br = parseInt(b.substring(0, 2), 16);
    const bg = parseInt(b.substring(2, 4), 16);
    const bb = parseInt(b.substring(4, 6), 16);
    const r = Math.round(ar * (1 - ratio) + br * ratio);
    const g = Math.round(ag * (1 - ratio) + bg * ratio);
    const bl = Math.round(ab * (1 - ratio) + bb * ratio);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${bl.toString(16).padStart(2, '0')}`;
}

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
    const gap = Math.max(2, Math.min(width, height) * 0.006);
    const cellW = (width - gap) / 2;
    const cellH = (height - gap) / 2;

    const childColors = theme.childColors || [theme.accent2, theme.accent3, theme.accent4, theme.accent5, theme.accent6];
    for (let i = 0; i < 4; i++) {
        const row = Math.floor(i / 2);
        const col = i % 2;
        const item = items[i + 1]; // items[1-4] are quadrants
        shapes.push({
            id: `cell-${i}`,
            type: 'roundRect',
            x: col * (cellW + gap),
            y: row * (cellH + gap),
            width: cellW,
            height: cellH,
            text: item?.text || item || '',
            fill: childColors[i % childColors.length],
            stroke: theme.light1,
            strokeWidth: 1.5,
            textColor: theme.light1,
            fontSize: Math.min(24, cellH * 0.2),
            rx: 16,
            ry: 16
        });
    }

    // Center node - light label plate.
    const centerW = width * 0.28;
    const centerH = height * 0.22;
    const centerFill = mixColor(childColors[0], theme.light1 || '#FFFFFF', 0.65);
    shapes.push({
        id: 'center',
        type: 'roundRect',
        x: (width - centerW) / 2,
        y: (height - centerH) / 2,
        width: centerW,
        height: centerH,
        fill: centerFill,
        stroke: theme.light1,
        strokeWidth: 1.5,
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
 * Matrix2 - 4 rounded rectangles with a gray quad-arrow background.
 */
function matrixTitledLayout(option, config) {
    const { items, size, theme } = option;
    const { width, height } = size;

    const shapes = [];
    const panel = Math.min(width, height) * 0.72;
    const panelX = (width - panel) / 2;
    const panelY = (height - panel) / 2;
    const gap = panel * 0.07;
    const cellW = (panel - gap) / 2;
    const cellH = (panel - gap) / 2;
    const childColors = theme.childColors || [theme.accent2, theme.accent3, theme.accent4, theme.accent5, theme.accent6];

    shapes.push({
        id: 'axes',
        type: 'quadArrow',
        x: panelX - panel * 0.08,
        y: panelY - panel * 0.08,
        width: panel * 1.16,
        height: panel * 1.16,
        fill: mixColor(theme.dark1 || '#1F2937', theme.light1 || '#FFFFFF', 0.75),
        stroke: 'none',
        strokeWidth: 0,
    });

    for (let i = 0; i < 4; i++) {
        const row = Math.floor(i / 2);
        const col = i % 2;
        const item = items[i];

        shapes.push({
            id: `cell-${i}`,
            type: 'roundRect',
            x: panelX + col * (cellW + gap),
            y: panelY + row * (cellH + gap),
            width: cellW,
            height: cellH,
            text: item?.text || item || '',
            fill: childColors[i % childColors.length],
            stroke: theme.light1 || '#FFFFFF',
            strokeWidth: 1.5,
            textColor: theme.light1,
            fontSize: Math.min(18, cellH * 0.28),
            rx: Math.max(8, cellW * 0.16),
            ry: Math.max(8, cellH * 0.16)
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
 * Matrix3 - 4 rounded rectangles over a gray diamond background.
 */
function matrixCycleLayout(option, config) {
    const { items, size, theme } = option;
    const { width, height } = size;

    const shapes = [];
    const panel = Math.min(width, height) * 0.72;
    const panelX = (width - panel) / 2;
    const panelY = (height - panel) / 2;
    const gap = panel * 0.06;
    const cellW = (panel - gap) / 2;
    const cellH = (panel - gap) / 2;
    const childColors = theme.childColors || [theme.accent2, theme.accent3, theme.accent4, theme.accent5, theme.accent6];

    shapes.push({
        id: 'diamond-bg',
        type: 'diamond',
        x: panelX - panel * 0.08,
        y: panelY - panel * 0.08,
        width: panel * 1.16,
        height: panel * 1.16,
        fill: mixColor(theme.dark1 || '#1F2937', theme.light1 || '#FFFFFF', 0.75),
        stroke: 'none',
        strokeWidth: 0
    });

    for (let i = 0; i < 4; i++) {
        const row = Math.floor(i / 2);
        const col = i % 2;
        const item = items[i];

        shapes.push({
            id: `cell-${i}`,
            type: 'roundRect',
            x: panelX + col * (cellW + gap),
            y: panelY + row * (cellH + gap),
            width: cellW,
            height: cellH,
            text: item?.text || item || '',
            fill: childColors[i % childColors.length],
            stroke: theme.light1 || '#FFFFFF',
            strokeWidth: 1.5,
            textColor: theme.light1,
            fontSize: Math.min(18, cellH * 0.28),
            rx: Math.max(8, cellW * 0.16),
            ry: Math.max(8, cellH * 0.16)
        });
    }

    return {
        type: 'matrix',
        shapes,
        connectors: [],
        bounds: { x: 0, y: 0, width, height }
    };
}
