/**
 * Arrow Layouts
 * Handles: arrow1 (opposing up arrows), arrow4 (up/down balance arrows)
 */

import { childColors, getItem, getItemText, resolveCount } from './cycle.js';

export function arrowLayout(option, config = {}) {
    const variant = config.variant || 'arrow1';

    switch (variant) {
        case 'arrow4':
            return layoutArrow4(option);
        case 'arrow1':
        default:
            return layoutArrow1(option);
    }
}

/* ── arrow1: 2 opposing up arrows ── */

function layoutArrow1(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const colors = childColors(theme);
    const shapes = [];
    const gap = width * 0.05;
    const arrowW = (width - gap * 3) / 2;
    const arrowH = height * 0.85;
    const y = (height - arrowH) / 2;

    for (let i = 0; i < 2; i += 1) {
        const x = gap + i * (arrowW + gap);
        const item = getItem(items, i);
        shapes.push({
            id: `arrow-${i}`,
            type: 'upArrow',
            x, y,
            width: arrowW, height: arrowH,
            direction: 'up',
            text: getItemText(item),
            fill: colors[i % colors.length],
            stroke: theme.light1, strokeWidth: 2,
            textColor: theme.light1, fontSize: 16
        });
    }

    return { type: 'arrow', shapes, connectors: [], bounds: { x: 0, y: 0, width, height } };
}

/* ── arrow4: rect labels + up arrow + down arrow (balance) ── */

function layoutArrow4(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const colors = childColors(theme);
    const shapes = [];
    const gap = width * 0.04;
    const arrowW = width * 0.2;
    const arrowH = height * 0.7;
    const labelW = width * 0.25;
    const labelH = height * 0.15;
    const arrowY = (height - arrowH) / 2;

    // Left label
    const item0 = getItem(items, 0);
    shapes.push({
        id: 'label-0', type: 'rect',
        x: gap, y: height * 0.1,
        width: labelW, height: labelH,
        text: getItemText(item0),
        fill: colors[0], stroke: theme.light1, strokeWidth: 2,
        textColor: theme.light1, fontSize: 14, rx: 4, ry: 4
    });

    // Up arrow
    const item1 = getItem(items, 1);
    shapes.push({
        id: 'arrow-up', type: 'upArrow',
        x: gap + labelW + gap, y: arrowY,
        width: arrowW, height: arrowH,
        direction: 'up',
        text: getItemText(item1),
        fill: colors[1 % colors.length],
        stroke: theme.light1, strokeWidth: 2,
        textColor: theme.light1, fontSize: 14
    });

    // Down arrow
    const item2 = getItem(items, 2);
    shapes.push({
        id: 'arrow-down', type: 'upArrow',
        x: gap + labelW + gap + arrowW + gap, y: arrowY,
        width: arrowW, height: arrowH,
        direction: 'down',
        text: getItemText(item2),
        fill: colors[2 % colors.length],
        stroke: theme.light1, strokeWidth: 2,
        textColor: theme.light1, fontSize: 14
    });

    // Right label
    const item3 = getItem(items, 3);
    shapes.push({
        id: 'label-1', type: 'rect',
        x: width - gap - labelW, y: height * 0.75,
        width: labelW, height: labelH,
        text: getItemText(item3),
        fill: colors[3 % colors.length],
        stroke: theme.light1, strokeWidth: 2,
        textColor: theme.light1, fontSize: 14, rx: 4, ry: 4
    });

    return { type: 'arrow', shapes, connectors: [], bounds: { x: 0, y: 0, width, height } };
}
