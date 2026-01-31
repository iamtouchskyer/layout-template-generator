/**
 * Cycle Layout - circular arrangement
 * Based on OOXML cycle4/cycle8 layouts
 */

export function cycleLayout(option, config = {}) {
    const { items, size, theme } = option;
    const { segmented = false } = config;
    const { width, height } = size;

    const count = items.length || 4;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;

    const shapes = [];
    const connectors = [];

    if (segmented) {
        // Pie/segment style (cycle8)
        const anglePerItem = 360 / count;
        const innerRadius = radius * 0.3;

        items.forEach((item, idx) => {
            const startAngle = idx * anglePerItem - 90; // Start from top
            const endAngle = startAngle + anglePerItem;

            const colorIdx = idx % 6;
            const accentKey = `accent${colorIdx + 1}`;

            shapes.push({
                id: `segment-${idx}`,
                type: 'pie',
                cx: centerX,
                cy: centerY,
                innerRadius,
                outerRadius: radius,
                startAngle,
                endAngle,
                text: item.text || item,
                fill: theme[accentKey] || theme.accent1,
                stroke: theme.light1,
                strokeWidth: 2,
                textColor: theme.dark1,
                fontSize: 14
            });
        });
    } else {
        // Basic cycle (cycle4): center circle + 4 corner boxes + cycle arrows
        const circleR = Math.min(width, height) * 0.32;
        const boxW = width * 0.22;
        const boxH = height * 0.15;
        const margin = width * 0.02;

        // 4 corner text boxes
        const cornerPositions = [
            { x: margin, y: margin },
            { x: width - boxW - margin, y: margin },
            { x: width - boxW - margin, y: height - boxH - margin },
            { x: margin, y: height - boxH - margin }
        ];

        for (let i = 0; i < 4; i++) {
            const item = items[i % items.length] || { text: `Item ${i + 1}` };
            const pos = cornerPositions[i];
            shapes.push({
                id: `corner-${i}`,
                type: 'roundRect',
                x: pos.x,
                y: pos.y,
                width: boxW,
                height: boxH,
                text: '• ' + (item.text || item),
                fill: theme.light1 || '#FFFFFF',
                stroke: theme.accent1 || '#156082',
                strokeWidth: 1.5,
                textColor: theme.dark1 || '#333333',
                fontSize: 12,
                rx: 6,
                ry: 6
            });
        }

        // 4 pie quadrants forming center circle
        const quadrantAngles = [
            { start: 180, end: 270 },  // top-left
            { start: 270, end: 360 },  // top-right
            { start: 0, end: 90 },     // bottom-right
            { start: 90, end: 180 }    // bottom-left
        ];

        for (let i = 0; i < 4; i++) {
            const item = items[i % items.length] || { text: `Item ${i + 1}` };
            const angles = quadrantAngles[i];
            shapes.push({
                id: `quadrant-${i}`,
                type: 'pie',
                cx: centerX,
                cy: centerY,
                innerRadius: 0,
                outerRadius: circleR,
                startAngle: angles.start,
                endAngle: angles.end,
                fill: theme.accent1 || '#156082',
                stroke: theme.light1 || '#FFFFFF',
                strokeWidth: 2,
                text: item.text || item,
                textColor: theme.light1 || '#FFFFFF',
                fontSize: 14
            });
        }

        // Center cycle arrows
        const arrowR = circleR * 0.2;
        connectors.push({
            type: 'curvedArrow',
            cx: centerX,
            cy: centerY,
            radius: arrowR,
            startAngle: -30,
            endAngle: 150,
            stroke: theme.light1 || '#FFFFFF'
        });
        connectors.push({
            type: 'curvedArrow',
            cx: centerX,
            cy: centerY,
            radius: arrowR,
            startAngle: 150,
            endAngle: 330,
            stroke: theme.light1 || '#FFFFFF'
        });
    }

    return {
        type: 'cycle',
        shapes,
        connectors,
        bounds: { x: 0, y: 0, width, height }
    };
}
