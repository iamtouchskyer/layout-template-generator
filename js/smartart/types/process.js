/**
 * Process Layouts
 * Handles: lProcess2, hProcess7, IncreasingCircleProcess, PieProcess
 */

import { childColors, getItem, getItemText, resolveCount } from './cycle.js';

export function processLayout(option, config = {}) {
    const variant = config.variant || 'lProcess2';

    switch (variant) {
        case 'process4':
            return layoutProcess4(option);
        case 'hProcess7':
            return layoutHProcess7(option);
        case 'IncreasingCircleProcess':
            return layoutIncreasingCircleProcess(option);
        case 'PieProcess':
            return layoutPieProcess(option);
        case 'lProcess2':
        default:
            return layoutLProcess2(option);
    }
}

/* ── process4: stepped process blocks with directional connectors ── */
function layoutProcess4(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = resolveCount(items, { typeId: 'process4', min: 2 });
    const colors = childColors(theme);
    const shapes = [];
    const connectors = [];
    const gap = width * 0.02;
    const blockW = (width - gap * (count + 1)) / count;
    const baseH = height * 0.7;
    const yTop = height * 0.15;

    for (let i = 0; i < count; i += 1) {
        const item = getItem(items, i);
        const x = gap + i * (blockW + gap);
        const y = yTop + i * (height * 0.03);
        const h = Math.max(height * 0.28, baseH - i * (height * 0.06));
        shapes.push({
            id: `proc-${i}`,
            type: 'roundRect',
            x, y, width: blockW, height: h,
            text: getItemText(item),
            fill: colors[i % colors.length],
            stroke: theme.light1, strokeWidth: 2,
            textColor: theme.light1, fontSize: 12, rx: 6, ry: 6
        });

        if (i < count - 1) {
            const nx = gap + (i + 1) * (blockW + gap);
            connectors.push({
                id: `c-${i}`,
                type: 'arrow',
                x: (x + blockW + nx) / 2 - gap * 0.6,
                y: y + h * 0.5 - gap * 0.6,
                size: gap * 1.2,
                rotation: 0,
                fill: colors[i % colors.length]
            });
        }
    }
    return { type: 'process', shapes, connectors, bounds: { x: 0, y: 0, width, height } };
}

/* ── lProcess2: L-shaped process (stacked roundRects with sub-text) ── */

function layoutLProcess2(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = resolveCount(items, { typeId: 'l-process2', min: 1 });
    const colors = childColors(theme);
    const shapes = [];
    const gap = height * 0.02;
    const rowH = (height - gap * (count + 1)) / count;
    const mainW = width * 0.4;
    const subW = width * 0.45;

    for (let i = 0; i < count; i += 1) {
        const y = gap + i * (rowH + gap);
        const item = getItem(items, i);
        const firstChild = item.children && item.children[0];
        shapes.push({
            id: `main-${i}`, type: 'roundRect',
            x: width * 0.03, y,
            width: mainW, height: rowH,
            text: getItemText(item),
            fill: colors[i % colors.length], stroke: theme.light1, strokeWidth: 2,
            textColor: theme.light1, fontSize: 14, rx: 6, ry: 6
        });
        shapes.push({
            id: `sub-${i}`, type: 'roundRect',
            x: width * 0.03 + mainW + width * 0.04, y,
            width: subW, height: rowH,
            text: firstChild ? getItemText(firstChild) : '',
            fill: theme.light1 || '#FFF',
            stroke: colors[i % colors.length], strokeWidth: 2,
            textColor: theme.dark1 || '#000', fontSize: 12, rx: 6, ry: 6
        });
    }
    return { type: 'process', shapes, connectors: [], bounds: { x: 0, y: 0, width, height } };
}

/* ── hProcess7: overlapping roundRect+rect + flowChartExtract arrows ── */

function layoutHProcess7(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = resolveCount(items, { typeId: 'h-process7', min: 1 });
    const colors = childColors(theme);
    const shapes = [];
    const connectors = [];
    const gap = width * 0.02;
    const colW = (width - gap * (count + 1)) / count;
    const boxH = height * 0.55;
    const boxY = height * 0.05;
    const descPad = colW * 0.06;
    const descY = boxY + boxH * 0.35;
    const arrowSize = Math.min(colW, height) * 0.12;
    const arrowY = boxY + boxH + height * 0.08;

    for (let i = 0; i < count; i += 1) {
        const x = gap + i * (colW + gap);
        const item = getItem(items, i);
        const firstChild = item.children && item.children[0];

        // Outer roundRect (accent color)
        shapes.push({
            id: `step-${i}`, type: 'roundRect',
            x, y: boxY,
            width: colW, height: boxH,
            text: getItemText(item),
            fill: colors[i % colors.length], stroke: theme.light1, strokeWidth: 2,
            textColor: theme.light1, fontSize: 14, rx: 8, ry: 8
        });
        // Inner rect (content, overlapping inside roundRect)
        shapes.push({
            id: `desc-${i}`, type: 'rect',
            x: x + descPad, y: descY,
            width: colW - descPad * 2, height: boxH - (descY - boxY) - descPad,
            text: firstChild ? getItemText(firstChild) : '',
            fill: theme.light1 || '#FFF',
            stroke: colors[i % colors.length], strokeWidth: 2,
            textColor: theme.dark1 || '#000', fontSize: 12, rx: 2, ry: 2
        });

        // flowChartExtract arrows between steps (inverted triangle, below)
        if (i < count - 1) {
            const ax = x + colW + (gap - arrowSize) / 2;
            shapes.push({
                id: `arrow-${i}`, type: 'flowChartExtract',
                x: ax, y: arrowY,
                width: arrowSize, height: arrowSize,
                text: '', fill: colors[i % colors.length],
                stroke: 'none', strokeWidth: 0
            });
        }
    }
    return { type: 'process', shapes, connectors, bounds: { x: 0, y: 0, width, height } };
}

/* ── IncreasingCircleProcess: equal circles + chord overlay + labels right ── */

function layoutIncreasingCircleProcess(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = resolveCount(items, { typeId: 'increasing-circle-process', min: 2 });
    const colors = childColors(theme);
    const shapes = [];
    const gap = width * 0.02;
    const r = Math.min(height * 0.15, width / (count * 3.5));
    const labelW = r * 2.5;
    const labelH = height * 0.12;
    const cellW = (width - gap) / count;
    const cy = height * 0.4;

    for (let i = 0; i < count; i += 1) {
        const cx = gap + i * cellW + r + gap;
        const item = getItem(items, i);
        const firstChild = item.children && item.children[0];
        const chordEnd = -90 + 360 * ((i + 1) / count);

        // Main circle
        shapes.push({
            id: `circle-${i}`, type: 'ellipse',
            cx, cy, rx: r, ry: r,
            text: '', fill: colors[i % colors.length],
            stroke: theme.light1, strokeWidth: 2
        });
        // Chord overlay (progress indicator)
        shapes.push({
            id: `chord-${i}`, type: 'chord',
            cx, cy, rx: r * 0.85, ry: r * 0.85,
            startAngle: -90, endAngle: chordEnd,
            text: '', fill: colors[i % colors.length],
            stroke: 'none', strokeWidth: 0, opacity: 0.5
        });
        // Title label (right of circle)
        shapes.push({
            id: `title-${i}`, type: 'rect',
            x: cx + r + gap * 0.5, y: cy - labelH,
            width: labelW, height: labelH,
            text: getItemText(item), fill: 'transparent',
            stroke: 'none', textColor: theme.dark1 || '#000',
            fontSize: 12, textAlign: 'left', textVAlign: 'bottom'
        });
        // Description label (right of circle, below title)
        shapes.push({
            id: `desc-${i}`, type: 'rect',
            x: cx + r + gap * 0.5, y: cy,
            width: labelW, height: labelH,
            text: firstChild ? getItemText(firstChild) : '', fill: 'transparent',
            stroke: 'none', textColor: theme.dark1 || '#000',
            fontSize: 10, textAlign: 'left', textVAlign: 'top'
        });
    }
    return { type: 'process', shapes, connectors: [], bounds: { x: 0, y: 0, width, height } };
}

/* ── PieProcess: chord bg + pie fill + labels right ── */

function layoutPieProcess(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = resolveCount(items, { typeId: 'pie-process', min: 2 });
    const colors = childColors(theme);
    const shapes = [];
    const gap = width * 0.02;
    const r = Math.min(height * 0.18, width / (count * 3.5));
    const labelW = r * 2.5;
    const labelH = height * 0.12;
    const cellW = (width - gap) / count;
    const cy = height * 0.4;

    for (let i = 0; i < count; i += 1) {
        const cx = gap + i * cellW + r + gap;
        const item = getItem(items, i);
        const firstChild = item.children && item.children[0];
        const fillAngle = 360 * ((i + 1) / count);

        // Chord background (circle outline)
        shapes.push({
            id: `chord-${i}`, type: 'chord',
            cx, cy, rx: r, ry: r,
            startAngle: 0, endAngle: 360,
            text: '', fill: '#E0E0E0',
            stroke: theme.light1, strokeWidth: 2
        });
        // Pie fill portion
        shapes.push({
            id: `pie-${i}`, type: 'pie',
            cx, cy, innerRadius: 0, outerRadius: r * 0.9,
            startAngle: -90, endAngle: -90 + fillAngle,
            text: '', fill: colors[i % colors.length],
            stroke: 'none', strokeWidth: 0
        });
        // Title label (right of circle)
        shapes.push({
            id: `title-${i}`, type: 'rect',
            x: cx + r + gap * 0.5, y: cy - labelH,
            width: labelW, height: labelH,
            text: getItemText(item), fill: 'transparent',
            stroke: 'none', textColor: theme.dark1 || '#000',
            fontSize: 12, textAlign: 'left', textVAlign: 'bottom'
        });
        // Description label
        shapes.push({
            id: `desc-${i}`, type: 'rect',
            x: cx + r + gap * 0.5, y: cy,
            width: labelW, height: labelH,
            text: firstChild ? getItemText(firstChild) : '', fill: 'transparent',
            stroke: 'none', textColor: theme.dark1 || '#000',
            fontSize: 10, textAlign: 'left', textVAlign: 'top'
        });
    }
    return { type: 'process', shapes, connectors: [], bounds: { x: 0, y: 0, width, height } };
}
