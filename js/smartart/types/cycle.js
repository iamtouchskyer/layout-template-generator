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
    const childColors = theme.childColors || [theme.accent1, theme.accent2, theme.accent3, theme.accent4, theme.accent5, theme.accent6];

    if (segmented) {
        // Pie/segment style (cycle8)
        const anglePerItem = 360 / count;
        const innerRadius = radius * 0.3;

        items.forEach((item, idx) => {
            const startAngle = idx * anglePerItem - 90; // Start from top
            const endAngle = startAngle + anglePerItem;

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
                fill: childColors[idx % childColors.length],
                stroke: theme.light1,
                strokeWidth: 2,
                textColor: theme.dark1,
                fontSize: 14
            });
        });
    } else {
        // Basic cycle (cycle4) - OOXML constraints from layout4.xml
        const quadrantSize = Math.min(width, height) * 0.433;
        const boxW = width * 0.38;
        const boxH = height * 0.22;  // shorter
        const gap = Math.min(width, height) * 0.01;
        const innerOffset = quadrantSize * 0.3;  // fixed inner corner offset

        // Fixed inner corner positions (independent of box size)
        const innerY = { top: centerY - quadrantSize + innerOffset, bottom: centerY + quadrantSize - innerOffset };
        const innerX = { left: centerX - quadrantSize + innerOffset, right: centerX + quadrantSize - innerOffset };

        // Position boxes so inner corners stay at fixed positions
        const cornerPositions = [
            { x: innerX.left - boxW, y: innerY.top - boxH },   // top-left
            { x: innerX.right, y: innerY.top - boxH },         // top-right
            { x: innerX.right, y: innerY.bottom },             // bottom-right
            { x: innerX.left - boxW, y: innerY.bottom }        // bottom-left
        ];

        // Quadrant angles: top-left, top-right, bottom-right, bottom-left
        const quadrantAngles = [
            { start: 180, end: 270 },
            { start: 270, end: 360 },
            { start: 0, end: 90 },
            { start: 90, end: 180 }
        ];

        // First pass: draw corner boxes (lower z-order)
        for (let i = 0; i < 4; i++) {
            const item = items[i % items.length] || { text: `Item ${i + 1}` };
            const quadrantColor = childColors[i % childColors.length];
            const pos = cornerPositions[i];

            const childItem = item.children?.[0] || { text: item.text || item };
            shapes.push({
                id: `corner-${i}`,
                type: 'roundRect',
                x: pos.x,
                y: pos.y,
                width: boxW,
                height: boxH,
                text: '• ' + (childItem.text || childItem),
                fill: theme.light1 || '#FFFFFF',
                stroke: quadrantColor,
                strokeWidth: 1.5,
                textColor: theme.dark1 || '#333333',
                fontSize: 14,
                rx: 8,
                ry: 8
            });
        }

        // Second pass: draw quadrants (higher z-order, overlay corner boxes)
        for (let i = 0; i < 4; i++) {
            const item = items[i % items.length] || { text: `Item ${i + 1}` };
            const angles = quadrantAngles[i];
            const quadrantColor = childColors[i % childColors.length];

            shapes.push({
                id: `quadrant-${i}`,
                type: 'pie',
                cx: centerX,
                cy: centerY,
                innerRadius: 0,
                outerRadius: quadrantSize,
                startAngle: angles.start,
                endAngle: angles.end,
                fill: quadrantColor,
                stroke: theme.light1 || '#FFFFFF',
                strokeWidth: gap * 2,
                text: item.text || item,
                textColor: theme.light1 || '#FFFFFF',
                fontSize: 16
            });
        }

        // Center cycle arrows (OOXML: w=0.115, h=0.1)
        const arrowR = Math.min(width, height) * 0.05;
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
