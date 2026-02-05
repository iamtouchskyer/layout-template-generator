/**
 * Radial Layout - center with satellite items
 * Based on OOXML radial3 layout
 */

export function radialLayout(option, config = {}) {
    const { items, size, theme } = option;
    const { width, height } = size;

    const shapes = [];
    const connectors = [];

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;

    // Center node (first item or generated) - uses parentColor
    const centerItem = items[0] || { text: 'Center' };
    const centerSize = radius * 0.6;

    shapes.push({
        id: 'center',
        type: 'ellipse',
        cx: centerX,
        cy: centerY,
        rx: centerSize / 2,
        ry: centerSize / 2,
        text: centerItem.text || centerItem,
        fill: theme.parentColor || theme.accent1,
        stroke: theme.light1,
        strokeWidth: 2,
        textColor: theme.light1,
        fontSize: 16
    });

    // Satellite nodes - use childColors
    const satellites = items.slice(1);
    const count = satellites.length || 4;
    const satelliteSize = radius * 0.4;
    const childColors = theme.childColors || [theme.accent1, theme.accent2, theme.accent3, theme.accent4, theme.accent5, theme.accent6];

    satellites.forEach((item, idx) => {
        const angle = (idx * 360 / count) - 90; // Start from top
        const rad = (angle * Math.PI) / 180;

        const x = centerX + Math.cos(rad) * radius;
        const y = centerY + Math.sin(rad) * radius;

        shapes.push({
            id: `satellite-${idx}`,
            type: 'rect',
            x: x - satelliteSize / 2,
            y: y - satelliteSize / 2,
            width: satelliteSize,
            height: satelliteSize * 0.6,
            text: item.text || item,
            fill: childColors[idx % childColors.length],
            stroke: theme.light1,
            strokeWidth: 2,
            textColor: theme.light1,
            fontSize: 12,
            rx: 4,
            ry: 4
        });

        // Connector line from center to satellite - uses parentColor
        connectors.push({
            id: `conn-${idx}`,
            type: 'line',
            x1: centerX + Math.cos(rad) * (centerSize / 2),
            y1: centerY + Math.sin(rad) * (centerSize / 2),
            x2: x - Math.cos(rad) * (satelliteSize / 2),
            y2: y - Math.sin(rad) * (satelliteSize * 0.3),
            stroke: theme.parentColor || theme.accent1,
            strokeWidth: 2
        });
    });

    return {
        type: 'radial',
        shapes,
        connectors,
        bounds: { x: 0, y: 0, width, height }
    };
}
