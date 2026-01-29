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
        // Chevron/arrow style (cycle4)
        const itemWidth = radius * 0.6;
        const itemHeight = radius * 0.35;

        items.forEach((item, idx) => {
            const angle = (idx * 360 / count) - 90; // Start from top
            const rad = (angle * Math.PI) / 180;

            const x = centerX + Math.cos(rad) * radius - itemWidth / 2;
            const y = centerY + Math.sin(rad) * radius - itemHeight / 2;

            const colorIdx = idx % 6;
            const accentKey = `accent${colorIdx + 1}`;

            shapes.push({
                id: `item-${idx}`,
                type: 'chevron',
                x,
                y,
                width: itemWidth,
                height: itemHeight,
                rotation: angle + 90,
                text: item.text || item,
                fill: theme[accentKey] || theme.accent1,
                stroke: theme.light1,
                strokeWidth: 2,
                textColor: theme.light1,
                fontSize: 14
            });

            // Add connecting arrow to next item
            if (count > 1) {
                const nextAngle = ((idx + 1) * 360 / count) - 90;
                const midAngle = angle + (360 / count) / 2;
                const midRad = (midAngle * Math.PI) / 180;
                const arrowRadius = radius * 0.7;

                connectors.push({
                    id: `arrow-${idx}`,
                    type: 'curvedArrow',
                    startAngle: angle,
                    endAngle: nextAngle,
                    cx: centerX,
                    cy: centerY,
                    radius: arrowRadius,
                    fill: theme.accent5,
                    stroke: theme.accent5
                });
            }
        });
    }

    return {
        type: 'cycle',
        shapes,
        connectors,
        bounds: { x: 0, y: 0, width, height }
    };
}
