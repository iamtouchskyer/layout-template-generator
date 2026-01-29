/**
 * Matrix Layout - 2x2 or NxN grid
 * Based on OOXML matrix1/matrix2/matrix3 layouts
 */

export function matrixLayout(option, config = {}) {
    const { items, size, theme } = option;
    const { titled = false, cycle = false } = config;
    const { width, height } = size;

    // Matrix is typically 2x2
    const cols = 2;
    const rows = Math.ceil(items.length / cols);
    const gap = Math.min(width, height) * 0.03;

    // Reserve space for title if needed
    const titleHeight = titled ? height * 0.15 : 0;
    const gridHeight = height - titleHeight;

    const cellWidth = (width - gap * (cols + 1)) / cols;
    const cellHeight = (gridHeight - gap * (rows + 1)) / rows;

    const shapes = [];

    // Add title cell if titled
    if (titled && items.length > 0) {
        shapes.push({
            id: 'title',
            type: 'rect',
            x: gap,
            y: gap,
            width: width - gap * 2,
            height: titleHeight - gap,
            text: items[0].title || 'Title',
            fill: theme.accent1,
            stroke: 'none',
            textColor: theme.light1,
            fontSize: 18
        });
    }

    // Add matrix cells
    const startIdx = titled ? 0 : 0;
    items.slice(startIdx, startIdx + 4).forEach((item, idx) => {
        const row = Math.floor(idx / cols);
        const col = idx % cols;

        const x = gap + col * (cellWidth + gap);
        const y = titleHeight + gap + row * (cellHeight + gap);

        const colorIdx = idx % 4;
        const colors = [theme.accent1, theme.accent2, theme.accent3, theme.accent4];

        shapes.push({
            id: `cell-${idx}`,
            type: 'rect',
            x,
            y,
            width: cellWidth,
            height: cellHeight,
            text: item.text || item,
            fill: colors[colorIdx],
            stroke: theme.light1,
            strokeWidth: 2,
            textColor: theme.light1,
            fontSize: Math.min(20, cellHeight * 0.15),
            rx: 4,
            ry: 4
        });
    });

    // Add cycle arrows if cycle matrix
    const connectors = [];
    if (cycle && items.length >= 4) {
        const arrowSize = Math.min(cellWidth, cellHeight) * 0.15;
        const centerX = width / 2;
        const centerY = titleHeight + gridHeight / 2;

        // Four arrows in circular pattern
        const arrowAngles = [45, 135, 225, 315];
        arrowAngles.forEach((angle, idx) => {
            const rad = (angle * Math.PI) / 180;
            const r = Math.min(cellWidth, cellHeight) * 0.3;
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
    }

    return {
        type: 'matrix',
        shapes,
        connectors,
        bounds: { x: 0, y: 0, width, height }
    };
}
