/**
 * Venn Layout - overlapping ellipses
 * Based on OOXML venn2 (Linear Venn) layout
 */

import { childColors, getItem, getItemText, resolveCount } from './cycle.js';

export function vennLayout(option, config = {}) {
    const variant = config.variant || 'venn2';

    switch (variant) {
        case 'venn2':
        default:
            return layoutVenn2(option);
    }
}

/* ── venn2: Linear Venn – overlapping ellipses in a horizontal row ── */

function layoutVenn2(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = resolveCount(items, { typeId: 'venn2', min: 2 });
    const colors = childColors(theme);
    const shapes = [];

    const cy = height / 2;
    const ellipseR = Math.min(width / (count * 0.8), height * 0.4);
    const totalSpan = ellipseR * 2 * count * 0.7; // 0.7 = overlap factor
    const startX = (width - totalSpan) / 2 + ellipseR;
    const step = ellipseR * 2 * 0.7;

    for (let i = 0; i < count; i += 1) {
        const cx = startX + i * step;
        const item = getItem(items, i);
        shapes.push({
            id: `node-${i}`,
            type: 'ellipse',
            cx, cy,
            rx: ellipseR, ry: ellipseR,
            text: getItemText(item),
            fill: colors[i % colors.length],
            stroke: theme.light1 || '#FFFFFF',
            strokeWidth: 2,
            textColor: theme.light1 || '#FFFFFF',
            fontSize: 14,
            opacity: 0.7
        });
    }

    return { type: 'venn', shapes, connectors: [], bounds: { x: 0, y: 0, width, height } };
}
