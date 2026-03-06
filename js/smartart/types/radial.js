/**
 * Radial Layout variants.
 *
 * Supports: radial4 (default), radial1, radial3, radial5, radial6,
 *           radialCluster, circleArrowProcess, target3
 */

import { getDataSchema } from './data-schema.js';
import {
    childColors,
    ringCenters,
    getItem,
    getItemText,
    resolveCount,
} from './cycle.js';

export function radialLayout(option, config = {}) {
    const variant = config.variant || 'radial4';

    switch (variant) {
        case 'radial1':
            return layoutRadial1(option);
        case 'radial3':
            return layoutRadial3(option);
        case 'radial5':
            return layoutRadial5(option);
        case 'radial6':
            return layoutRadial6(option);
        case 'radialCluster':
            return layoutRadialCluster(option);
        case 'circleArrowProcess':
            return layoutCircleArrowProcess(option);
        case 'target3':
            return layoutTarget3(option);
        case 'radial4':
        default:
            return layoutRadial4(option);
    }
}

/* ── radial4 (original "Basic Radial"): center ellipse + rect satellites ── */

function layoutRadial4(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const shapes = [];
    const connectors = [];
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.35;
    const centerItem = items[0] || { text: 'Center' };
    const centerR = radius * 0.3;
    const colors = childColors(theme);

    shapes.push({
        id: 'center',
        type: 'ellipse',
        cx, cy,
        rx: centerR, ry: centerR,
        text: getItemText(centerItem),
        fill: theme.parentColor || theme.accent1,
        stroke: theme.light1, strokeWidth: 2,
        textColor: theme.light1, fontSize: 16
    });

    const satellites = items.slice(1);
    const count = satellites.length || 4;
    const satW = radius * 0.4;
    const satH = satW * 0.6;

    satellites.forEach((item, idx) => {
        const angle = (idx * 360 / count) - 90;
        const rad = angle * Math.PI / 180;
        const x = cx + Math.cos(rad) * radius;
        const y = cy + Math.sin(rad) * radius;

        shapes.push({
            id: `satellite-${idx}`,
            type: 'rect',
            x: x - satW / 2, y: y - satH / 2,
            width: satW, height: satH,
            text: getItemText(item),
            fill: colors[idx % colors.length],
            stroke: theme.light1, strokeWidth: 2,
            textColor: theme.light1, fontSize: 12,
            rx: 4, ry: 4
        });

        connectors.push({
            id: `conn-${idx}`,
            type: 'line',
            x1: cx + Math.cos(rad) * centerR,
            y1: cy + Math.sin(rad) * centerR,
            x2: x - Math.cos(rad) * (satW / 2),
            y2: y - Math.sin(rad) * (satH / 2),
            stroke: theme.parentColor || theme.accent1,
            strokeWidth: 2
        });
    });

    return { type: 'radial', shapes, connectors, bounds: { x: 0, y: 0, width, height } };
}

/* ── radial1: center ellipse + satellite ellipses + line connectors ── */

function layoutRadial1(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = resolveCount(items, { typeId: 'radial1' });
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.35;
    const centerR = radius * 0.3;
    const satR = radius * 0.2;
    const colors = childColors(theme);
    const shapes = [];
    const connectors = [];

    const centerItem = getItem(items, 0);
    shapes.push({
        id: 'center',
        type: 'ellipse',
        cx, cy, rx: centerR, ry: centerR,
        text: getItemText(centerItem),
        fill: theme.parentColor || theme.accent1,
        stroke: theme.light1, strokeWidth: 2,
        textColor: theme.light1, fontSize: 16
    });

    const satCount = Math.max(1, count - 1);
    for (let i = 0; i < satCount; i += 1) {
        const angle = (i * 360 / satCount) - 90;
        const rad = angle * Math.PI / 180;
        const sx = cx + Math.cos(rad) * radius;
        const sy = cy + Math.sin(rad) * radius;
        const item = getItem(items, i + 1);

        shapes.push({
            id: `satellite-${i}`,
            type: 'ellipse',
            cx: sx, cy: sy, rx: satR, ry: satR,
            text: getItemText(item),
            fill: colors[i % colors.length],
            stroke: theme.light1, strokeWidth: 2,
            textColor: theme.light1, fontSize: 12
        });

        connectors.push({
            id: `conn-${i}`,
            type: 'line',
            x1: cx + Math.cos(rad) * centerR,
            y1: cy + Math.sin(rad) * centerR,
            x2: sx - Math.cos(rad) * satR,
            y2: sy - Math.sin(rad) * satR,
            stroke: theme.parentColor || theme.accent1,
            strokeWidth: 2
        });
    }

    return { type: 'radial', shapes, connectors, bounds: { x: 0, y: 0, width, height } };
}

/* ── radial3: ring of overlapping semi-transparent ellipses (Venn) ── */

function layoutRadial3(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = resolveCount(items, { typeId: 'radial3', min: 2 });
    const cx = width / 2;
    const cy = height / 2;
    const minSide = Math.min(width, height);
    const ringR = minSide * 0.22;
    const ellipseR = minSide * 0.2;
    const colors = childColors(theme);
    const centers = ringCenters(count, cx, cy, ringR, -90);
    const shapes = [];

    for (let i = 0; i < count; i += 1) {
        const p = centers[i];
        const item = getItem(items, i);
        shapes.push({
            id: `node-${i}`,
            type: 'ellipse',
            cx: p.x, cy: p.y,
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

    return { type: 'radial', shapes, connectors: [], bounds: { x: 0, y: 0, width, height } };
}

/* ── radial5: center + satellites with outward arrow connectors ── */

function layoutRadial5(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = resolveCount(items, { typeId: 'radial5' });
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.35;
    const centerR = radius * 0.3;
    const satR = radius * 0.2;
    const colors = childColors(theme);
    const shapes = [];
    const connectors = [];

    const centerItem = getItem(items, 0);
    shapes.push({
        id: 'center',
        type: 'ellipse',
        cx, cy, rx: centerR, ry: centerR,
        text: getItemText(centerItem),
        fill: theme.parentColor || theme.accent1,
        stroke: theme.light1, strokeWidth: 2,
        textColor: theme.light1, fontSize: 16
    });

    const satCount = Math.max(1, count - 1);
    const arrowSize = Math.max(10, radius * 0.15);
    for (let i = 0; i < satCount; i += 1) {
        const angle = (i * 360 / satCount) - 90;
        const rad = angle * Math.PI / 180;
        const sx = cx + Math.cos(rad) * radius;
        const sy = cy + Math.sin(rad) * radius;
        const item = getItem(items, i + 1);

        shapes.push({
            id: `satellite-${i}`,
            type: 'ellipse',
            cx: sx, cy: sy, rx: satR, ry: satR,
            text: getItemText(item),
            fill: colors[i % colors.length],
            stroke: theme.light1, strokeWidth: 2,
            textColor: theme.light1, fontSize: 12
        });

        const mx = (cx + sx) / 2;
        const my = (cy + sy) / 2;
        const angleDeg = Math.atan2(sy - cy, sx - cx) * 180 / Math.PI;
        connectors.push({
            id: `arrow-${i}`,
            type: 'arrow',
            x: mx - arrowSize / 2,
            y: my - arrowSize / 2,
            size: arrowSize,
            rotation: angleDeg,
            fill: colors[i % colors.length],
            fromX: cx, fromY: cy,
            toX: sx, toY: sy
        });
    }

    return { type: 'radial', shapes, connectors, bounds: { x: 0, y: 0, width, height } };
}

/* ── radial6: center + satellites + blockArc connectors ── */

function layoutRadial6(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = resolveCount(items, { typeId: 'radial6' });
    const cx = width / 2;
    const cy = height / 2;
    const minSide = Math.min(width, height);
    const radius = minSide * 0.35;
    const centerR = radius * 0.3;
    const satR = radius * 0.18;
    const colors = childColors(theme);
    const shapes = [];
    const connectors = [];

    const centerItem = getItem(items, 0);
    shapes.push({
        id: 'center',
        type: 'ellipse',
        cx, cy, rx: centerR, ry: centerR,
        text: getItemText(centerItem),
        fill: theme.parentColor || theme.accent1,
        stroke: theme.light1, strokeWidth: 2,
        textColor: theme.light1, fontSize: 16
    });

    const satCount = Math.max(1, count - 1);
    const step = 360 / satCount;
    const arcThick = minSide * 0.03;

    for (let i = 0; i < satCount; i += 1) {
        const angle = (i * 360 / satCount) - 90;
        const rad = angle * Math.PI / 180;
        const sx = cx + Math.cos(rad) * radius;
        const sy = cy + Math.sin(rad) * radius;
        const item = getItem(items, i + 1);

        shapes.push({
            id: `satellite-${i}`,
            type: 'ellipse',
            cx: sx, cy: sy, rx: satR, ry: satR,
            text: getItemText(item),
            fill: colors[i % colors.length],
            stroke: theme.light1, strokeWidth: 2,
            textColor: theme.light1, fontSize: 12
        });

        const arcMidR = (centerR + (radius - satR)) / 2;
        const arcStart = angle + 5;
        const arcEnd = angle + step - 5;
        connectors.push({
            id: `arc-${i}`,
            type: 'blockArc',
            cx, cy,
            outerR: arcMidR + arcThick / 2,
            innerR: arcMidR - arcThick / 2,
            startAngle: arcStart,
            endAngle: arcEnd,
            fill: colors[i % colors.length]
        });
    }

    return { type: 'radial', shapes, connectors, bounds: { x: 0, y: 0, width, height } };
}

/* ── radialCluster: center roundRect + satellite roundRects ── */

function layoutRadialCluster(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = resolveCount(items, { typeId: 'radial-cluster', min: 2 });
    const cx = width / 2;
    const cy = height / 2;
    const minSide = Math.min(width, height);
    const radius = minSide * 0.35;
    const centerW = minSide * 0.22;
    const centerH = minSide * 0.16;
    const satW = minSide * 0.16;
    const satH = minSide * 0.12;
    const colors = childColors(theme);
    const shapes = [];
    const connectors = [];

    const centerItem = getItem(items, 0);
    shapes.push({
        id: 'center',
        type: 'roundRect',
        x: cx - centerW / 2, y: cy - centerH / 2,
        width: centerW, height: centerH,
        text: getItemText(centerItem),
        fill: theme.parentColor || theme.accent1,
        stroke: theme.light1, strokeWidth: 2,
        textColor: theme.light1, fontSize: 14,
        rx: 8, ry: 8
    });

    const satCount = Math.max(1, count - 1);
    const centers = ringCenters(satCount, cx, cy, radius, -90);

    for (let i = 0; i < satCount; i += 1) {
        const p = centers[i];
        const item = getItem(items, i + 1);
        const angle = (i * 360 / satCount) - 90;
        const rad = angle * Math.PI / 180;

        shapes.push({
            id: `satellite-${i}`,
            type: 'roundRect',
            x: p.x - satW / 2, y: p.y - satH / 2,
            width: satW, height: satH,
            text: getItemText(item),
            fill: colors[i % colors.length],
            stroke: theme.light1, strokeWidth: 2,
            textColor: theme.light1, fontSize: 12,
            rx: 6, ry: 6
        });

        connectors.push({
            id: `conn-${i}`,
            type: 'line',
            x1: cx + Math.cos(rad) * (centerW / 2),
            y1: cy + Math.sin(rad) * (centerH / 2),
            x2: p.x - Math.cos(rad) * (satW / 2),
            y2: p.y - Math.sin(rad) * (satH / 2),
            stroke: theme.parentColor || theme.accent1,
            strokeWidth: 2
        });
    }

    return { type: 'radial', shapes, connectors, bounds: { x: 0, y: 0, width, height } };
}

/* ── circleArrowProcess: rects arranged in circle + thick curved arrows ── */

function layoutCircleArrowProcess(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = resolveCount(items, { typeId: 'circle-arrow-process', min: 2 });
    const cx = width / 2;
    const cy = height / 2;
    const minSide = Math.min(width, height);
    const ringR = minSide * 0.32;
    const nodeW = minSide * 0.2;
    const nodeH = minSide * 0.14;
    const colors = childColors(theme);
    const centers = ringCenters(count, cx, cy, ringR, -90);
    const shapes = [];
    const connectors = [];

    const step = 360 / count;
    const thickness = minSide * 0.035;
    const outerR = ringR + thickness / 2;
    const innerR = ringR - thickness / 2;
    const gapDeg = Math.min(20, step * 0.2);

    for (let i = 0; i < count; i += 1) {
        const color = colors[i % colors.length];
        const start = -90 + i * step + gapDeg;
        const end = start + step - gapDeg * 2;

        if (i % 2 === 0) {
            connectors.push({
                id: `flow-${i}`,
                type: 'thickCurvedArrow',
                cx, cy, outerR, innerR,
                startAngle: start, endAngle: end,
                fill: color
            });
        } else {
            connectors.push({
                id: `flow-${i}`,
                type: 'blockArc',
                cx, cy, outerR, innerR,
                startAngle: start, endAngle: end,
                fill: color
            });
        }
    }

    for (let i = 0; i < count; i += 1) {
        const p = centers[i];
        const item = getItem(items, i);
        const color = colors[i % colors.length];
        shapes.push({
            id: `node-${i}`,
            type: 'roundRect',
            x: p.x - nodeW / 2, y: p.y - nodeH / 2,
            width: nodeW, height: nodeH,
            text: getItemText(item),
            fill: color,
            stroke: theme.light1 || '#FFFFFF',
            strokeWidth: 2,
            textColor: theme.light1 || '#FFFFFF',
            fontSize: 14,
            rx: 8, ry: 8
        });
    }

    return { type: 'radial', shapes, connectors, bounds: { x: 0, y: 0, width, height } };
}

/* ── target3: nested target with callout labels ── */
function layoutTarget3(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = resolveCount(items, { typeId: 'target3', min: 3 });
    const colors = childColors(theme);
    const shapes = [];
    const connectors = [];
    const cx = width * 0.38;
    const cy = height * 0.5;
    const maxR = Math.min(width, height) * 0.34;

    for (let i = 0; i < count; i += 1) {
        const item = getItem(items, i);
        const ratio = (count - i) / count;
        const r = maxR * ratio;
        const color = colors[i % colors.length];
        shapes.push({
            id: `ring-${i}`,
            type: 'ellipse',
            cx,
            cy,
            rx: r,
            ry: r,
            text: '',
            fill: color,
            stroke: theme.light1 || '#FFFFFF',
            strokeWidth: 2,
            opacity: i === 0 ? 1 : 0.9
        });

        const ly = cy - maxR + (i * (2 * maxR / Math.max(1, count - 1)));
        const lx = width * 0.72;
        shapes.push({
            id: `label-${i}`,
            type: 'roundRect',
            x: lx,
            y: ly - height * 0.05,
            width: width * 0.22,
            height: height * 0.1,
            text: getItemText(item),
            fill: color,
            stroke: theme.light1 || '#FFFFFF',
            strokeWidth: 2,
            textColor: theme.light1 || '#FFFFFF',
            fontSize: 12,
            rx: 6,
            ry: 6
        });
        connectors.push({
            id: `guide-${i}`,
            type: 'line',
            x1: cx + r * 0.55,
            y1: ly,
            x2: lx,
            y2: ly,
            stroke: color,
            strokeWidth: 2
        });
    }

    return { type: 'radial', shapes, connectors, bounds: { x: 0, y: 0, width, height } };
}
