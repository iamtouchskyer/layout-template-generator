/**
 * Extended List Layouts
 * Handles: LinedList, vList2, hList1, hList2, default, SquareAccentList,
 *          PictureStrips, AlternatingPictureBlocks, pList1, pList2,
 *          bList2, hList9
 */

import { childColors, getItem, getItemText, resolveCount } from './cycle.js';

export function listExtLayout(option, config = {}) {
    const variant = config.variant || 'default';

    switch (variant) {
        case 'LinedList':
            return layoutLinedList(option);
        case 'vList2':
            return layoutVList2(option);
        case 'vList5':
            return layoutVList5(option);
        case 'vList6':
            return layoutVList6(option);
        case 'VerticalAccentList':
            return layoutVerticalAccentList(option);
        case 'VerticalCurvedList':
            return layoutVerticalCurvedList(option);
        case 'hList1':
            return layoutHList1(option);
        case 'hList2':
            return layoutHList2(option);
        case 'hList3':
            return layoutHList3(option);
        case 'hList6':
            return layoutHList6(option);
        case 'hList7':
            return layoutHList7(option);
        case 'PictureAccentList':
            return layoutPictureAccentList(option);
        case 'BlockDescendingList':
            return layoutBlockDescendingList(option);
        case 'SquareAccentList':
            return layoutSquareAccentList(option);
        case 'PictureStrips':
            return layoutPictureStrips(option);
        case 'AlternatingPictureBlocks':
            return layoutAlternatingPictureBlocks(option);
        case 'pList1':
            return layoutPList1(option);
        case 'hList9':
            return layoutHList9(option);
        case 'bList2':
            return layoutBList2(option);
        case 'pList2':
            return layoutPList2(option);
        default:
            return layoutDefault(option);
    }
}

/* ── default: basic vertical block list (5 rects) ── */

function layoutDefault(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = resolveCount(items, { typeId: 'default', min: 1 });
    const colors = childColors(theme);
    const shapes = [];
    const gap = height * 0.02;
    const itemHeight = (height - gap * (count + 1)) / count;
    const itemWidth = width * 0.85;
    const x = (width - itemWidth) / 2;

    for (let i = 0; i < count; i += 1) {
        const y = gap + i * (itemHeight + gap);
        const item = getItem(items, i);
        shapes.push({
            id: `item-${i}`,
            type: 'rect',
            x, y,
            width: itemWidth, height: itemHeight,
            text: getItemText(item),
            fill: colors[i % colors.length],
            stroke: theme.light1, strokeWidth: 2,
            textColor: theme.light1, fontSize: 16,
            rx: 4, ry: 4
        });
    }

    return { type: 'list', shapes, connectors: [], bounds: { x: 0, y: 0, width, height } };
}

/* ── LinedList: top-line + sidebar + N×(text + sep-line) ── */

function layoutLinedList(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = resolveCount(items, { typeId: 'lined-list', min: 1 });
    const colors = childColors(theme);
    const shapes = [];
    const sidebarW = width * 0.2;
    const sidebarX = 0;
    const contentX = sidebarW + width * 0.015;
    const contentW = width - contentX;
    const sepLineX = sidebarW;
    const sepLineW = width - sidebarW;
    const itemH = height / count;

    // Top border line (full width)
    shapes.push({
        id: 'line-top', type: 'rect',
        x: 0, y: 0, width, height: 1,
        text: '', fill: colors[0], stroke: 'none', strokeWidth: 0
    });

    // Sidebar accent rect (full height)
    shapes.push({
        id: 'sidebar', type: 'rect',
        x: sidebarX, y: 0,
        width: sidebarW, height,
        text: '', fill: colors[0],
        stroke: 'none', strokeWidth: 0
    });

    for (let i = 0; i < count; i += 1) {
        const y = i * itemH + itemH * 0.05;
        const item = getItem(items, i);

        // Text rect (right of sidebar)
        shapes.push({
            id: `item-${i}`, type: 'rect',
            x: contentX, y,
            width: contentW, height: itemH * 0.9,
            text: getItemText(item), fill: 'transparent',
            stroke: 'none', strokeWidth: 0,
            textColor: theme.dark1 || '#000', fontSize: 14,
            textAlign: 'left', textVAlign: 'center'
        });

        // Separator line after each text rect (from sidebar right edge)
        const lineY = (i + 1) * itemH;
        shapes.push({
            id: `line-${i}`, type: 'rect',
            x: sepLineX, y: lineY, width: sepLineW, height: 1,
            text: '', fill: colors[0], stroke: 'none', strokeWidth: 0
        });
    }

    return { type: 'list', shapes, connectors: [], bounds: { x: 0, y: 0, width, height } };
}

/* ── vList2: vertical paired blocks (accent roundRect + content rect) ── */

function layoutVList2(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = resolveCount(items, { typeId: 'v-list2', min: 1 });
    const colors = childColors(theme);
    const shapes = [];
    const gap = height * 0.04;
    const itemHeight = (height - gap * (count + 1)) / count;
    const accentW = width * 0.3;
    const contentW = width * 0.55;
    const accentX = width * 0.05;
    const contentX = accentX + accentW + width * 0.05;

    for (let i = 0; i < count; i += 1) {
        const y = gap + i * (itemHeight + gap);
        const item = getItem(items, i);
        const firstChild = item.children && item.children[0];

        shapes.push({
            id: `accent-${i}`,
            type: 'roundRect',
            x: accentX, y,
            width: accentW, height: itemHeight,
            text: getItemText(item),
            fill: colors[i % colors.length],
            stroke: theme.light1, strokeWidth: 2,
            textColor: theme.light1, fontSize: 16,
            rx: 6, ry: 6
        });

        shapes.push({
            id: `content-${i}`,
            type: 'rect',
            x: contentX, y,
            width: contentW, height: itemHeight,
            text: firstChild ? getItemText(firstChild) : '',
            fill: theme.light1 || '#FFFFFF',
            stroke: colors[i % colors.length], strokeWidth: 2,
            textColor: theme.dark1 || '#000000', fontSize: 14,
            rx: 2, ry: 2
        });
    }

    return { type: 'list', shapes, connectors: [], bounds: { x: 0, y: 0, width, height } };
}

/* ── vList5: compact alias of vList2 ── */
function layoutVList5(option) {
    return layoutVList2(option);
}

/* ── vList6: vertical cards with circular accent dots ── */
function layoutVList6(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = resolveCount(items, { typeId: 'v-list6', min: 1 });
    const colors = childColors(theme);
    const shapes = [];
    const gap = height * 0.03;
    const rowH = (height - gap * (count + 1)) / count;
    const dotR = rowH * 0.2;
    const cardX = width * 0.2;
    const cardW = width * 0.74;

    for (let i = 0; i < count; i += 1) {
        const y = gap + i * (rowH + gap);
        const item = getItem(items, i);
        shapes.push({
            id: `dot-${i}`, type: 'ellipse',
            cx: width * 0.11, cy: y + rowH / 2,
            rx: dotR, ry: dotR,
            text: '', fill: colors[i % colors.length],
            stroke: theme.light1, strokeWidth: 2
        });
        shapes.push({
            id: `card-${i}`, type: 'roundRect',
            x: cardX, y, width: cardW, height: rowH,
            text: getItemText(item),
            fill: colors[i % colors.length],
            stroke: theme.light1, strokeWidth: 2,
            textColor: theme.light1, fontSize: 14, rx: 8, ry: 8
        });
    }
    return { type: 'list', shapes, connectors: [], bounds: { x: 0, y: 0, width, height } };
}

/* ── VerticalAccentList: OOXML 2008 variant, mapped to vList2 semantics ── */
function layoutVerticalAccentList(option) {
    return layoutVList2(option);
}

/* ── VerticalCurvedList: stacked round2SameRect with curved arrows ── */
function layoutVerticalCurvedList(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = resolveCount(items, { typeId: 'vertical-curved-list', min: 1 });
    const colors = childColors(theme);
    const shapes = [];
    const connectors = [];
    const gap = height * 0.03;
    const rowH = (height - gap * (count + 1)) / count;
    const x = width * 0.12;
    const w = width * 0.76;

    for (let i = 0; i < count; i += 1) {
        const y = gap + i * (rowH + gap);
        const item = getItem(items, i);
        shapes.push({
            id: `item-${i}`, type: 'round2SameRect',
            x, y, width: w, height: rowH,
            text: getItemText(item),
            fill: colors[i % colors.length],
            stroke: theme.light1, strokeWidth: 2,
            textColor: theme.light1, fontSize: 14
        });

        if (i < count - 1) {
            const mx = x + w * 0.9;
            const my = y + rowH + gap * 0.5;
            connectors.push({
                id: `arrow-${i}`,
                type: 'arrow',
                x: mx - gap * 0.8,
                y: my - gap * 0.8,
                size: gap * 1.6,
                rotation: 90,
                fill: colors[i % colors.length]
            });
        }
    }
    return { type: 'list', shapes, connectors, bounds: { x: 0, y: 0, width, height } };
}

/* ── hList1: horizontal grouped list (title + description per column) ── */

function layoutHList1(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = resolveCount(items, { typeId: 'h-list1', min: 1 });
    const colors = childColors(theme);
    const shapes = [];
    const gap = width * 0.02;
    const colWidth = (width - gap * (count + 1)) / count;
    const titleH = height * 0.25;
    const descH = height * 0.6;
    const titleY = height * 0.05;
    const descY = titleY + titleH + height * 0.03;

    for (let i = 0; i < count; i += 1) {
        const x = gap + i * (colWidth + gap);
        const item = getItem(items, i);
        const firstChild = item.children && item.children[0];

        shapes.push({
            id: `title-${i}`,
            type: 'rect',
            x, y: titleY,
            width: colWidth, height: titleH,
            text: getItemText(item),
            fill: colors[i % colors.length],
            stroke: theme.light1, strokeWidth: 2,
            textColor: theme.light1, fontSize: 16,
            rx: 4, ry: 4
        });

        shapes.push({
            id: `desc-${i}`,
            type: 'rect',
            x, y: descY,
            width: colWidth, height: descH,
            text: firstChild ? getItemText(firstChild) : '',
            fill: theme.light1 || '#FFFFFF',
            stroke: colors[i % colors.length], strokeWidth: 2,
            textColor: theme.dark1 || '#000000', fontSize: 12,
            rx: 2, ry: 2
        });
    }

    return { type: 'list', shapes, connectors: [], bounds: { x: 0, y: 0, width, height } };
}

/* ── hList2: horizontal list with title bar + 2 sub-items per column ── */

function layoutHList2(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = resolveCount(items, { typeId: 'h-list2', min: 1 });
    const colors = childColors(theme);
    const shapes = [];
    const gap = width * 0.02;
    const colW = (width - gap * (count + 1)) / count;
    const titleH = height * 0.2;
    const subH = (height * 0.7) / 2;
    const titleY = height * 0.03;

    for (let i = 0; i < count; i += 1) {
        const x = gap + i * (colW + gap);
        const item = getItem(items, i);
        const children = item.children || [];
        shapes.push({
            id: `title-${i}`, type: 'rect', x, y: titleY,
            width: colW, height: titleH, text: getItemText(item),
            fill: colors[i % colors.length], stroke: theme.light1, strokeWidth: 2,
            textColor: theme.light1, fontSize: 14, rx: 4, ry: 4
        });
        for (let j = 0; j < 2; j += 1) {
            const sy = titleY + titleH + gap + j * (subH + gap * 0.5);
            const child = children[j];
            shapes.push({
                id: `sub-${i}-${j}`, type: 'rect', x, y: sy,
                width: colW, height: subH, text: child ? getItemText(child) : '',
                fill: theme.light1 || '#FFF', stroke: colors[i % colors.length], strokeWidth: 2,
                textColor: theme.dark1 || '#000', fontSize: 12, rx: 2, ry: 2
            });
        }
    }
    return { type: 'list', shapes, connectors: [], bounds: { x: 0, y: 0, width, height } };
}

/* ── hList3/hList6/hList7: sibling horizontal-list variants ── */
function layoutHList3(option) {
    return layoutHList2(option);
}

function layoutHList6(option) {
    return layoutHList1(option);
}

function layoutHList7(option) {
    return layoutHList9(option);
}

/* ── PictureAccentList: picture + right accent text block ── */
function layoutPictureAccentList(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = resolveCount(items, { typeId: 'picture-accent-list', min: 1 });
    const colors = childColors(theme);
    const shapes = [];
    const gap = height * 0.03;
    const rowH = (height - gap * (count + 1)) / count;
    const picW = width * 0.28;
    const txtW = width * 0.58;

    for (let i = 0; i < count; i += 1) {
        const y = gap + i * (rowH + gap);
        const item = getItem(items, i);
        shapes.push({
            id: `pic-${i}`, type: 'roundRect',
            x: width * 0.06, y, width: picW, height: rowH,
            text: '', fill: colors[i % colors.length],
            stroke: theme.light1, strokeWidth: 2, rx: 8, ry: 8,
            isPlaceholder: true
        });
        shapes.push({
            id: `txt-${i}`, type: 'round2SameRect',
            x: width * 0.06 + picW + width * 0.04, y,
            width: txtW, height: rowH,
            text: getItemText(item),
            fill: theme.light1 || '#FFFFFF',
            stroke: colors[i % colors.length], strokeWidth: 2,
            textColor: theme.dark1 || '#000000', fontSize: 13
        });
    }
    return { type: 'list', shapes, connectors: [], bounds: { x: 0, y: 0, width, height } };
}

/* ── BlockDescendingList: staircase blocks with text ── */
function layoutBlockDescendingList(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = resolveCount(items, { typeId: 'block-descending-list', min: 1 });
    const colors = childColors(theme);
    const shapes = [];
    const stepH = height / count;
    const stepW = width / count;

    for (let i = 0; i < count; i += 1) {
        const item = getItem(items, i);
        shapes.push({
            id: `step-${i}`,
            type: 'roundRect',
            x: i * stepW * 0.35,
            y: i * stepH,
            width: width - i * stepW * 0.35,
            height: stepH * 0.9,
            text: getItemText(item),
            fill: colors[i % colors.length],
            stroke: theme.light1,
            strokeWidth: 2,
            textColor: theme.light1,
            fontSize: Math.min(16, stepH * 0.35),
            rx: 6,
            ry: 6
        });
    }
    return { type: 'list', shapes, connectors: [], bounds: { x: 0, y: 0, width, height } };
}

/* ── SquareAccentList: N-column hierarchical (title + bar + children) ── */

function layoutSquareAccentList(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = resolveCount(items, { typeId: 'square-accent-list', min: 1 });
    const colors = childColors(theme);
    const shapes = [];
    const marginX = width * 0.035;
    const marginTop = height * 0.055;
    const marginBottom = height * 0.05;
    const colGap = width * 0.012;
    const colW = (width - marginX * 2 - colGap * (count - 1)) / count;
    const titleH = Math.max(20, height * 0.11);
    const barH = Math.max(3, height * 0.012);
    const titleToBarGap = Math.max(1, height * 0.004);
    const barToRowsGap = Math.max(2, height * 0.012);
    const textGap = Math.max(6, colW * 0.06);
    const childCounts = Array.from({ length: count }, (_, i) => {
        const item = getItem(items, i);
        return Array.isArray(item.children) ? item.children.length : 0;
    });
    const maxChildren = Math.max(0, ...childCounts);
    const defaultRows = 6; // include top parent accent row + list rows
    const maxRows = Math.max(defaultRows, maxChildren + 1);
    const firstRowY = marginTop + titleH + titleToBarGap + barH + barToRowsGap;
    const rowH = Math.max(12, (height - marginBottom - firstRowY) / maxRows);
    const squareSize = Math.max(4, Math.min(rowH * 0.45, colW * 0.1));
    const textColor = theme.dark1 || '#1F2937';
    const baseLight = theme.light1 || '#FFFFFF';

    for (let i = 0; i < count; i += 1) {
        const x = marginX + i * (colW + colGap);
        const item = getItem(items, i);
        const children = Array.isArray(item.children) ? item.children : [];
        const color = colors[i % colors.length] || theme.accent1 || '#4472C4';

        shapes.push({
            id: `title-${i}`, type: 'rect',
            x, y: marginTop, width: colW, height: titleH,
            text: getItemText(item), fill: 'transparent',
            stroke: 'none', strokeWidth: 0,
            textColor,
            fontSize: Math.max(12, Math.min(34, titleH * 0.68)),
            textAlign: 'left',
            textVAlign: 'top'
        });

        shapes.push({
            id: `bar-${i}`, type: 'rect',
            x, y: marginTop + titleH + titleToBarGap,
            width: colW, height: barH, text: '',
            fill: color,
            stroke: 'none', strokeWidth: 0
        });

        shapes.push({
            id: `accent-${i}`, type: 'rect',
            x,
            y: firstRowY + (rowH - squareSize) / 2,
            width: squareSize,
            height: squareSize,
            text: '',
            fill: baseLight,
            stroke: color,
            strokeWidth: 1.5,
            rx: 0,
            ry: 0
        });

        for (let j = 0; j < children.length; j += 1) {
            const rowY = firstRowY + (j + 1) * rowH;
            const bulletColor = colors[(i + j + 1) % colors.length] || color;
            shapes.push({
                id: `sq-${i}-${j}`, type: 'rect',
                x,
                y: rowY + (rowH - squareSize) / 2,
                width: squareSize,
                height: squareSize,
                text: '',
                fill: baseLight,
                stroke: bulletColor,
                strokeWidth: 1.5,
                rx: 0,
                ry: 0
            });
            shapes.push({
                id: `child-${i}-${j}`, type: 'rect',
                x: x + squareSize + textGap,
                y: rowY,
                width: Math.max(1, colW - squareSize - textGap),
                height: rowH,
                text: getItemText(children[j]), fill: 'transparent',
                stroke: 'none',
                strokeWidth: 0,
                textColor,
                fontSize: Math.max(10, Math.min(20, rowH * 0.64)),
                textAlign: 'left',
                textVAlign: 'center'
            });
        }
    }
    return { type: 'list', shapes, connectors: [], bounds: { x: 0, y: 0, width, height } };
}

/* ── PictureStrips: horizontal strips with picture placeholder + text ── */

function layoutPictureStrips(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = resolveCount(items, { typeId: 'picture-strips', min: 1 });
    const colors = childColors(theme);
    const shapes = [];
    const gap = height * 0.03;
    const stripH = (height - gap * (count + 1)) / count;
    const picW = width * 0.35;
    const textW = width * 0.55;

    for (let i = 0; i < count; i += 1) {
        const y = gap + i * (stripH + gap);
        const item = getItem(items, i);
        shapes.push({
            id: `pic-${i}`, type: 'rect',
            x: width * 0.03, y, width: picW, height: stripH,
            text: '', fill: colors[i % colors.length],
            stroke: theme.light1, strokeWidth: 2, rx: 4, ry: 4,
            isPlaceholder: true
        });
        shapes.push({
            id: `text-${i}`, type: 'rect',
            x: width * 0.03 + picW + width * 0.04, y,
            width: textW, height: stripH,
            text: getItemText(item), fill: 'transparent',
            stroke: 'none', textColor: theme.dark1 || '#000',
            fontSize: 14, textAlign: 'left'
        });
    }
    return { type: 'list', shapes, connectors: [], bounds: { x: 0, y: 0, width, height } };
}

/* ── AlternatingPictureBlocks: alternating left/right picture+text ── */

function layoutAlternatingPictureBlocks(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = resolveCount(items, { typeId: 'alternating-picture-blocks', min: 1 });
    const colors = childColors(theme);
    const shapes = [];
    const gap = height * 0.03;
    const rowH = (height - gap * (count + 1)) / count;
    const picW = width * 0.4;
    const textW = width * 0.45;

    for (let i = 0; i < count; i += 1) {
        const y = gap + i * (rowH + gap);
        const item = getItem(items, i);
        const leftIsPic = i % 2 === 0;
        const picX = leftIsPic ? width * 0.03 : width * 0.03 + textW + width * 0.04;
        const textX = leftIsPic ? width * 0.03 + picW + width * 0.04 : width * 0.03;
        shapes.push({
            id: `pic-${i}`, type: 'rect',
            x: picX, y, width: picW, height: rowH,
            text: '', fill: colors[i % colors.length],
            stroke: theme.light1, strokeWidth: 2, rx: 4, ry: 4,
            isPlaceholder: true
        });
        shapes.push({
            id: `text-${i}`, type: 'rect',
            x: textX, y, width: textW, height: rowH,
            text: getItemText(item), fill: 'transparent',
            stroke: 'none', textColor: theme.dark1 || '#000',
            fontSize: 14, textAlign: leftIsPic ? 'left' : 'right'
        });
    }
    return { type: 'list', shapes, connectors: [], bounds: { x: 0, y: 0, width, height } };
}

/* ── pList1: vertical picture list (roundRect placeholder + rect text) ── */

function layoutPList1(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = resolveCount(items, { typeId: 'p-list1', min: 1 });
    const colors = childColors(theme);
    const shapes = [];
    const gap = height * 0.03;
    const rowH = (height - gap * (count + 1)) / count;
    const picW = Math.min(rowH * 0.9, width * 0.2);
    const textW = width * 0.65;

    for (let i = 0; i < count; i += 1) {
        const y = gap + i * (rowH + gap);
        const item = getItem(items, i);
        shapes.push({
            id: `pic-${i}`, type: 'roundRect',
            x: width * 0.05, y: y + (rowH - picW) / 2,
            width: picW, height: picW,
            text: '', fill: colors[i % colors.length],
            stroke: theme.light1, strokeWidth: 2, rx: 8, ry: 8,
            isPlaceholder: true
        });
        shapes.push({
            id: `text-${i}`, type: 'rect',
            x: width * 0.05 + picW + width * 0.05, y,
            width: textW, height: rowH,
            text: getItemText(item), fill: 'transparent',
            stroke: 'none', textColor: theme.dark1 || '#000',
            fontSize: 14, textAlign: 'left'
        });
    }
    return { type: 'list', shapes, connectors: [], bounds: { x: 0, y: 0, width, height } };
}

/* ── hList9: 2-item list with large ellipse tab + 2 stacked rects ── */

function layoutHList9(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = resolveCount(items, { typeId: 'h-list9', min: 1 });
    const colors = childColors(theme);
    const shapes = [];
    const gap = width * 0.03;
    const colW = (width - gap * (count + 1)) / count;
    const ellipseW = colW * 0.22;
    const rectX = ellipseW + gap * 0.5;
    const rectW = colW - rectX;
    const rectH = (height - gap * 3) / 2;

    for (let i = 0; i < count; i += 1) {
        const x = gap + i * (colW + gap);
        const item = getItem(items, i);
        const firstChild = item.children && item.children[0];

        // Large ellipse tab on the left
        shapes.push({
            id: `tab-${i}`, type: 'ellipse',
            cx: x + ellipseW / 2, cy: height / 2,
            rx: ellipseW / 2, ry: height * 0.4,
            text: '', fill: colors[i % colors.length],
            stroke: theme.light1, strokeWidth: 2
        });
        // Upper content rect
        shapes.push({
            id: `upper-${i}`, type: 'rect',
            x: x + rectX, y: gap,
            width: rectW, height: rectH,
            text: getItemText(item),
            fill: colors[i % colors.length], stroke: theme.light1, strokeWidth: 2,
            textColor: theme.light1, fontSize: 14, rx: 4, ry: 4
        });
        // Lower content rect
        shapes.push({
            id: `lower-${i}`, type: 'rect',
            x: x + rectX, y: gap * 2 + rectH,
            width: rectW, height: rectH,
            text: firstChild ? getItemText(firstChild) : '',
            fill: theme.light1 || '#FFF',
            stroke: colors[i % colors.length], strokeWidth: 2,
            textColor: theme.dark1 || '#000', fontSize: 12, rx: 4, ry: 4
        });
    }
    return { type: 'list', shapes, connectors: [], bounds: { x: 0, y: 0, width, height } };
}

/* ── bList2: bending list (round2SameRect + rect + ellipse per item) ── */

function layoutBList2(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = resolveCount(items, { typeId: 'b-list2', min: 1 });
    const colors = childColors(theme);
    const shapes = [];
    const gap = width * 0.02;
    const colW = (width - gap * (count + 1)) / count;
    const accentH = height * 0.35;
    const descH = height * 0.25;
    const circleR = Math.min(colW, height) * 0.1;

    for (let i = 0; i < count; i += 1) {
        const x = gap + i * (colW + gap);
        const item = getItem(items, i);
        const firstChild = item.children && item.children[0];
        shapes.push({
            id: `accent-${i}`, type: 'round2SameRect',
            x, y: height * 0.05,
            width: colW, height: accentH,
            text: getItemText(item),
            fill: colors[i % colors.length], stroke: theme.light1, strokeWidth: 2,
            textColor: theme.light1, fontSize: 14
        });
        shapes.push({
            id: `desc-${i}`, type: 'rect',
            x, y: height * 0.05 + accentH + height * 0.03,
            width: colW, height: descH,
            text: firstChild ? getItemText(firstChild) : '',
            fill: theme.light1 || '#FFF',
            stroke: colors[i % colors.length], strokeWidth: 2,
            textColor: theme.dark1 || '#000', fontSize: 12, rx: 2, ry: 2
        });
        shapes.push({
            id: `dot-${i}`, type: 'ellipse',
            cx: x + colW / 2, cy: height * 0.85,
            rx: circleR, ry: circleR,
            text: '', fill: colors[i % colors.length],
            stroke: theme.light1, strokeWidth: 2
        });
    }
    return { type: 'list', shapes, connectors: [], bounds: { x: 0, y: 0, width, height } };
}

/* ── pList2: banner + horizontal columns (roundRect pic + round2SameRect text) ── */

function layoutPList2(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = resolveCount(items, { typeId: 'p-list2', min: 1 });
    const colors = childColors(theme);
    const shapes = [];
    const gap = width * 0.02;
    const bannerH = height * 0.45;
    const picH = bannerH * 0.8;
    const textH = height * 0.35;
    const colW = (width - gap * (count + 1)) / count;

    // Background banner roundRect (full width)
    shapes.push({
        id: 'banner', type: 'roundRect',
        x: gap, y: height * 0.05,
        width: width - gap * 2, height: bannerH,
        text: '', fill: colors[0],
        stroke: 'none', strokeWidth: 0, rx: 8, ry: 8,
        opacity: 0.15
    });

    for (let i = 0; i < count; i += 1) {
        const x = gap + i * (colW + gap);
        const item = getItem(items, i);

        // Picture placeholder (inside banner area)
        shapes.push({
            id: `pic-${i}`, type: 'roundRect',
            x, y: height * 0.05 + (bannerH - picH) / 2,
            width: colW, height: picH,
            text: '', fill: colors[i % colors.length],
            stroke: theme.light1, strokeWidth: 2, rx: 6, ry: 6,
            isPlaceholder: true
        });
        // Text area (below banner)
        shapes.push({
            id: `text-${i}`, type: 'round2SameRect',
            x, y: height * 0.05 + bannerH + gap,
            width: colW, height: textH,
            text: getItemText(item),
            fill: theme.light1 || '#FFF',
            stroke: colors[i % colors.length], strokeWidth: 2,
            textColor: theme.dark1 || '#000', fontSize: 12
        });
    }
    return { type: 'list', shapes, connectors: [], bounds: { x: 0, y: 0, width, height } };
}
