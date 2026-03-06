/**
 * Cycle layout variants.
 *
 * Supports:
 * - cycle1, cycle2, cycle3, cycle4, cycle5, cycle6, cycle7, cycle8
 * - legacy flag: { segmented: true } -> cycle8
 */

import { getDataSchema } from './data-schema.js';

export function cycleLayout(option, config = {}) {
    const variant = config.variant || (config.segmented ? 'cycle8' : 'cycle4');

    switch (variant) {
        case 'cycle1':
            return layoutCycle1(option);
        case 'cycle2':
            return layoutCycle2(option);
        case 'cycle3':
            return layoutCycle3(option);
        case 'cycle5':
            return layoutCycle5(option);
        case 'cycle6':
            return layoutCycle6(option);
        case 'cycle7':
            return layoutCycle7(option);
        case 'cycle8':
            return layoutCycle8(option);
        case 'chart3':
            return layoutChart3(option);
        case 'cycle4':
        default:
            return layoutCycle4(option);
    }
}

function layoutCycle1(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = resolveCount(items, { typeId: 'cycle1' });
    const cx = width / 2;
    const cy = height / 2;
    const minSide = Math.min(width, height);
    const ringR = minSide * 0.35;
    const step = 360 / count;
    const centers = ringCenters(count, cx, cy, ringR, -90);
    const chord = count > 1 ? (2 * ringR * Math.sin(Math.PI / count)) : ringR;
    const nodeW = chord * 0.55;
    const nodeH = nodeW * 0.8;
    const shapes = [];
    const connectors = [];
    const colors = childColors(theme);

    const thickness = chord * 0.12;
    const outerR = ringR + thickness / 2;
    const innerR = ringR - thickness / 2;
    const gapDeg = Math.min(15, step * 0.15);

    for (let i = 0; i < count; i += 1) {
        const color = colors[i % colors.length];
        const start = -90 + i * step + gapDeg;
        const end = start + step - gapDeg * 2;
        connectors.push({
            id: `flow-${i}`,
            type: 'thickCurvedArrow',
            cx,
            cy,
            outerR,
            innerR,
            startAngle: start,
            endAngle: end,
            fill: color
        });
    }

    for (let i = 0; i < count; i += 1) {
        const p = centers[i];
        const item = getItem(items, i);
        shapes.push({
            id: `node-${i}`,
            type: 'roundRect',
            x: p.x - nodeW / 2,
            y: p.y - nodeH / 2,
            width: nodeW,
            height: nodeH,
            text: getItemText(item),
            fill: 'none',
            stroke: 'none',
            strokeWidth: 0,
            textColor: theme.dark1 || '#333333',
            fontSize: 14,
            rx: 0,
            ry: 0
        });
    }

    return {
        type: 'cycle',
        shapes,
        connectors,
        bounds: { x: 0, y: 0, width, height }
    };
}

function layoutCycle2(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = resolveCount(items, { typeId: 'cycle2' });
    const cx = width / 2;
    const cy = height / 2;
    const ringR = Math.min(width, height) * 0.35;
    const centers = ringCenters(count, cx, cy, ringR, -90);
    const chord = count > 1 ? (2 * ringR * Math.sin(Math.PI / count)) : ringR;
    const nodeW = chord * 0.65;
    const nodeH = nodeW;
    const shapes = [];
    const connectors = [];
    const colors = childColors(theme);
    const arrowSize = Math.max(10, chord * 0.25);

    for (let i = 0; i < count; i += 1) {
        const p = centers[i];
        const item = getItem(items, i);
        shapes.push({
            id: `node-${i}`,
            type: 'ellipse',
            cx: p.x,
            cy: p.y,
            rx: nodeW / 2,
            ry: nodeH / 2,
            text: getItemText(item),
            fill: colors[i % colors.length],
            stroke: theme.light1 || '#FFFFFF',
            strokeWidth: 2,
            textColor: theme.light1 || '#FFFFFF',
            fontSize: 14
        });

        const next = centers[(i + 1) % count];
        const mx = (p.x + next.x) / 2;
        const my = (p.y + next.y) / 2;
        const angle = Math.atan2(next.y - p.y, next.x - p.x) * 180 / Math.PI;
        connectors.push({
            id: `arrow-${i}`,
            type: 'arrow',
            style: 'textCycleSvg',
            fromX: p.x,
            fromY: p.y,
            toX: next.x,
            toY: next.y,
            x: mx - arrowSize / 2,
            y: my - arrowSize / 2,
            size: arrowSize,
            rotation: angle,
            fill: colors[i % colors.length] || theme.accent1 || '#666666'
        });
    }

    return {
        type: 'cycle',
        shapes,
        connectors,
        bounds: { x: 0, y: 0, width, height }
    };
}

function layoutCycle3(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = resolveCount(items, { typeId: 'cycle3' });
    const cx = width / 2;
    const cy = height / 2;
    const minSide = Math.min(width, height);
    const ringR = minSide * 0.35;
    const step = 360 / count;
    const centers = ringCenters(count, cx, cy, ringR, -90);
    const nodeW = width * 0.2;
    const nodeH = height * 0.13;
    const shapes = [];
    const connectors = [];
    const colors = childColors(theme);

    for (let i = 0; i < count; i += 1) {
        const color = colors[i % colors.length];
        const start = -90 + i * step + 12;
        const end = -90 + (i + 1) * step - 12;
        connectors.push({
            id: `arc-${i}`,
            type: 'arc',
            cx,
            cy,
            radius: ringR,
            startAngle: start,
            endAngle: end,
            stroke: color,
            strokeWidth: minSide * 0.03
        });
    }

    for (let i = 0; i < count; i += 1) {
        const p = centers[i];
        const item = getItem(items, i);
        const color = colors[i % colors.length];
        shapes.push({
            id: `node-${i}`,
            type: 'roundRect',
            x: p.x - nodeW / 2,
            y: p.y - nodeH / 2,
            width: nodeW,
            height: nodeH,
            text: getItemText(item),
            fill: color,
            stroke: theme.light1 || '#FFFFFF',
            strokeWidth: 2,
            textColor: theme.light1 || '#FFFFFF',
            fontSize: 14,
            rx: 8,
            ry: 8
        });
    }

    return {
        type: 'cycle',
        shapes,
        connectors,
        bounds: { x: 0, y: 0, width, height }
    };
}

function layoutCycle4(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const centerX = width / 2;
    const centerY = height / 2;
    const quadrantSize = Math.min(width, height) * 0.368;
    const boxW = width * 0.32;
    const boxH = height * 0.342;
    const gap = Math.min(width, height) * 0.01;
    const shapes = [];
    const connectors = [];
    const colors = childColors(theme);

    function getQuadrantCenter(quadrantIndex) {
        const bisectorAngles = [225, 315, 45, 135];
        const angle = bisectorAngles[quadrantIndex] * Math.PI / 180;
        const centerDist = quadrantSize * 0.55;
        return {
            x: centerX + Math.cos(angle) * centerDist,
            y: centerY + Math.sin(angle) * centerDist
        };
    }

    const cornerPositions = [
        { x: getQuadrantCenter(0).x - boxW, y: getQuadrantCenter(0).y - boxH },
        { x: getQuadrantCenter(1).x, y: getQuadrantCenter(1).y - boxH },
        { x: getQuadrantCenter(2).x, y: getQuadrantCenter(2).y },
        { x: getQuadrantCenter(3).x - boxW, y: getQuadrantCenter(3).y }
    ];

    const quadrantAngles = [
        { start: 180, end: 270 },
        { start: 270, end: 360 },
        { start: 0, end: 90 },
        { start: 90, end: 180 }
    ];

    for (let i = 0; i < 4; i += 1) {
        const item = getItem(items, i);
        const quadrantColor = colors[i % colors.length];
        const pos = cornerPositions[i];
        const childText = getFirstChildText(item) || getItemText(item);

        shapes.push({
            id: `corner-${i}`,
            type: 'roundRect',
            x: pos.x,
            y: pos.y,
            width: boxW,
            height: boxH,
            text: `• ${childText}`,
            fill: theme.light1 || '#FFFFFF',
            stroke: quadrantColor,
            strokeWidth: 1.5,
            textColor: theme.dark1 || '#333333',
            fontSize: 14,
            rx: 8,
            ry: 8
        });
    }

    for (let i = 0; i < 4; i += 1) {
        const item = getItem(items, i);
        const quadrantColor = colors[i % colors.length];
        const angles = quadrantAngles[i];
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
            text: getItemText(item),
            textColor: theme.light1 || '#FFFFFF',
            fontSize: 16
        });
    }

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

    return {
        type: 'cycle',
        shapes,
        connectors,
        bounds: { x: 0, y: 0, width, height }
    };
}

function layoutCycle5(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = resolveCount(items, { typeId: 'cycle5' });
    const cx = width / 2;
    const cy = height / 2;
    const ringR = Math.min(width, height) * 0.35;
    const step = 360 / count;
    const centers = ringCenters(count, cx, cy, ringR, -90);
    const nodeW = width * 0.15;
    const nodeH = height * 0.12;
    const shapes = [];
    const connectors = [];
    const colors = childColors(theme);

    for (let i = 0; i < count; i += 1) {
        const p = centers[i];
        const item = getItem(items, i);
        const color = colors[i % colors.length];
        shapes.push({
            id: `node-${i}`,
            type: 'roundRect',
            x: p.x - nodeW / 2,
            y: p.y - nodeH / 2,
            width: nodeW,
            height: nodeH,
            text: getItemText(item),
            fill: color,
            stroke: theme.light1 || '#FFFFFF',
            strokeWidth: 2,
            textColor: theme.light1 || '#FFFFFF',
            fontSize: 14,
            rx: 8,
            ry: 8
        });

        const start = -90 + i * step + 8;
        const end = start + step - 16;
        connectors.push({
            id: `flow-${i}`,
            type: 'curvedArrow',
            cx,
            cy,
            radius: ringR * 0.9,
            startAngle: start,
            endAngle: end,
            stroke: color
        });
    }

    return {
        type: 'cycle',
        shapes,
        connectors,
        bounds: { x: 0, y: 0, width, height }
    };
}

function layoutCycle6(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = resolveCount(items, { typeId: 'cycle6' });
    const cx = width / 2;
    const cy = height / 2;
    const minSide = Math.min(width, height);
    const ringR = minSide * 0.35;
    const centers = ringCenters(count, cx, cy, ringR, -90);
    const nodeW = width * 0.2;
    const nodeH = height * 0.13;
    const shapes = [];
    const connectors = [];
    const colors = childColors(theme);

    connectors.push({
        id: 'ring',
        type: 'circle',
        cx,
        cy,
        radius: ringR,
        fill: 'none',
        stroke: theme.accent1 || colors[0] || '#666666',
        strokeWidth: minSide * 0.035
    });

    for (let i = 0; i < count; i += 1) {
        const p = centers[i];
        const item = getItem(items, i);
        shapes.push({
            id: `node-${i}`,
            type: 'roundRect',
            x: p.x - nodeW / 2,
            y: p.y - nodeH / 2,
            width: nodeW,
            height: nodeH,
            text: getItemText(item),
            fill: theme.light1 || '#FFFFFF',
            stroke: colors[i % colors.length],
            strokeWidth: 1.5,
            textColor: theme.dark1 || '#333333',
            fontSize: 14,
            rx: 8,
            ry: 8
        });
    }

    return {
        type: 'cycle',
        shapes,
        connectors,
        bounds: { x: 0, y: 0, width, height }
    };
}

function layoutCycle7(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = resolveCount(items, { typeId: 'cycle7' });
    const cx = width / 2;
    const cy = height / 2;
    const minSide = Math.min(width, height);
    const ringR = minSide * 0.38;
    const centers = ringCenters(count, cx, cy, ringR, -90);
    const nodeW = width * 0.18;
    const nodeH = height * 0.14;
    const shapes = [];
    const connectors = [];
    const colors = childColors(theme);
    const chord = count > 1 ? (2 * ringR * Math.sin(Math.PI / count)) : 0;
    const nodeDiag = Math.sqrt(nodeW * nodeW + nodeH * nodeH) / 2;
    const gap = Math.max(0, chord - nodeDiag * 2);
    const arrowLen = Math.max(12, gap * 0.6);

    for (let i = 0; i < count; i += 1) {
        const p = centers[i];
        const next = centers[(i + 1) % count];
        const mx = (p.x + next.x) / 2;
        const my = (p.y + next.y) / 2;
        const angle = Math.atan2(next.y - p.y, next.x - p.x) * 180 / Math.PI;
        const color = colors[i % colors.length];
        connectors.push({
            id: `edge-${i}`,
            type: 'biArrow',
            x: mx,
            y: my,
            length: arrowLen,
            rotation: angle,
            fill: color
        });
    }

    for (let i = 0; i < count; i += 1) {
        const p = centers[i];
        const item = getItem(items, i);
        const color = colors[i % colors.length];
        shapes.push({
            id: `node-${i}`,
            type: 'roundRect',
            x: p.x - nodeW / 2,
            y: p.y - nodeH / 2,
            width: nodeW,
            height: nodeH,
            text: getItemText(item),
            fill: color,
            stroke: theme.light1 || '#FFFFFF',
            strokeWidth: 2,
            textColor: theme.light1 || '#FFFFFF',
            fontSize: 14,
            rx: 8,
            ry: 8
        });
    }

    return {
        type: 'cycle',
        shapes,
        connectors,
        bounds: { x: 0, y: 0, width, height }
    };
}

function layoutCycle8(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = resolveCount(items, { typeId: 'cycle8', min: 3 });
    const cx = width / 2;
    const cy = height / 2;
    const outerR = Math.min(width, height) * 0.36;
    const innerR = outerR * 0.28;
    const step = 360 / count;
    const shapes = [];
    const connectors = [];
    const colors = childColors(theme);

    for (let i = 0; i < count; i += 1) {
        const item = getItem(items, i);
        const start = i * step - 90;
        const end = start + step;
        shapes.push({
            id: `segment-${i}`,
            type: 'pie',
            cx,
            cy,
            innerRadius: innerR,
            outerRadius: outerR,
            startAngle: start,
            endAngle: end,
            text: getItemText(item),
            fill: colors[i % colors.length],
            stroke: theme.light1 || '#FFFFFF',
            strokeWidth: 2,
            textColor: theme.light1 || '#FFFFFF',
            fontSize: 14
        });
        connectors.push({
            id: `flow-${i}`,
            type: 'curvedArrow',
            cx,
            cy,
            radius: outerR * 0.97,
            startAngle: start + 8,
            endAngle: end - 8,
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

function layoutChart3(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = resolveCount(items, { typeId: 'chart3', min: 2 });
    const cx = width / 2;
    const cy = height / 2;
    const outerR = Math.min(width, height) * 0.4;
    const step = 360 / count;
    const shapes = [];
    const colors = childColors(theme);

    for (let i = 0; i < count; i += 1) {
        const item = getItem(items, i);
        const start = i * step - 90;
        const end = start + step;
        shapes.push({
            id: `segment-${i}`,
            type: 'pie',
            cx,
            cy,
            innerRadius: 0,
            outerRadius: outerR,
            startAngle: start,
            endAngle: end,
            text: getItemText(item),
            fill: colors[i % colors.length],
            stroke: theme.light1 || '#FFFFFF',
            strokeWidth: 2,
            textColor: theme.light1 || '#FFFFFF',
            fontSize: 16
        });
    }

    return {
        type: 'cycle',
        shapes,
        connectors: [],
        bounds: { x: 0, y: 0, width, height }
    };
}

export function childColors(theme) {
    return theme.childColors || [
        theme.accent1,
        theme.accent2,
        theme.accent3,
        theme.accent4,
        theme.accent5,
        theme.accent6
    ];
}

export function ringCenters(count, cx, cy, radius, startDeg) {
    const points = [];
    const step = 360 / count;
    for (let i = 0; i < count; i += 1) {
        const angle = (startDeg + i * step) * Math.PI / 180;
        points.push({
            x: cx + Math.cos(angle) * radius,
            y: cy + Math.sin(angle) * radius
        });
    }
    return points;
}

export function getItem(items, idx) {
    if (!Array.isArray(items) || items.length === 0) {
        return { text: `Item ${idx + 1}`, children: [] };
    }
    return items[idx % items.length] || { text: `Item ${idx + 1}`, children: [] };
}

export function resolveCount(items, { typeId, min = 1, max = Infinity } = {}) {
    let count = 0;
    if (Array.isArray(items) && items.length > 0) {
        count = items.length;
    } else {
        const schema = getDataSchema(typeId);
        count = Number(schema && schema.itemCount) || 1;
    }
    return Math.max(min, Math.min(count, max));
}

function softRingFill(theme) {
    const light = normalizeHex(theme?.light1) || '#FFFFFF';
    const accent = normalizeHex(theme?.accent4) || normalizeHex(theme?.accent2) || '#D7C39B';
    return mixHex(light, accent, 0.2);
}

function normalizeHex(value) {
    if (typeof value !== 'string') return null;
    const hex = value.trim();
    if (!/^#([0-9a-fA-F]{6})$/.test(hex)) return null;
    return hex.toUpperCase();
}

function mixHex(baseHex, targetHex, ratio) {
    const clampRatio = Math.max(0, Math.min(1, Number(ratio) || 0));
    const br = parseInt(baseHex.slice(1, 3), 16);
    const bg = parseInt(baseHex.slice(3, 5), 16);
    const bb = parseInt(baseHex.slice(5, 7), 16);
    const tr = parseInt(targetHex.slice(1, 3), 16);
    const tg = parseInt(targetHex.slice(3, 5), 16);
    const tb = parseInt(targetHex.slice(5, 7), 16);
    const r = Math.round(br + (tr - br) * clampRatio);
    const g = Math.round(bg + (tg - bg) * clampRatio);
    const b = Math.round(bb + (tb - bb) * clampRatio);
    return `#${toHex2(r)}${toHex2(g)}${toHex2(b)}`;
}

function toHex2(value) {
    return Math.max(0, Math.min(255, value)).toString(16).padStart(2, '0').toUpperCase();
}

export function getItemText(item) {
    if (item && typeof item === 'object') {
        return item.text || '';
    }
    return String(item || '');
}

export function getFirstChildText(item) {
    if (!item || typeof item !== 'object' || !Array.isArray(item.children) || item.children.length === 0) {
        return '';
    }
    const child = item.children[0];
    if (child && typeof child === 'object') return child.text || '';
    return String(child || '');
}
