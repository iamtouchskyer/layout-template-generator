/**
 * Chevron/Process Layout - horizontal flow
 * Based on OOXML chevron1/arrow2/DescendingProcess layouts
 */

export function chevronLayout(option, config = {}) {
    const { items, size, theme } = option;
    const { style = 'chevron' } = config; // 'chevron', 'arrow', 'descending'
    const { width, height } = size;

    const count = items.length || 3;
    const shapes = [];
    const connectors = [];
    const childColors = theme.childColors || [theme.accent1, theme.accent2, theme.accent3, theme.accent4, theme.accent5, theme.accent6];

    if (style === 'chevron2') {
        return layoutChevron2(option);
    }

    if (style === 'descending') {
        // Descending stairs pattern
        const stepWidth = width / count;
        const stepHeight = height / count;

        items.forEach((item, idx) => {
            const x = idx * stepWidth;
            const y = idx * stepHeight;
            const w = width - idx * stepWidth;
            const h = stepHeight;

            shapes.push({
                id: `step-${idx}`,
                type: 'rect',
                x,
                y,
                width: w,
                height: h,
                text: item.text || item,
                fill: childColors[idx % childColors.length],
                stroke: theme.light1,
                strokeWidth: 2,
                textColor: theme.light1,
                fontSize: Math.min(18, h * 0.4),
                rx: 4,
                ry: 4
            });
        });
    } else {
        // Chevron or arrow style
        const gap = width * 0.02;
        const overlap = style === 'chevron' ? width * 0.03 : 0;
        const itemWidth = (width + overlap * (count - 1)) / count;
        const itemHeight = height * 0.6;
        const y = (height - itemHeight) / 2;

        items.forEach((item, idx) => {
            const x = idx * (itemWidth - overlap);

            shapes.push({
                id: `item-${idx}`,
                type: style === 'arrow' ? 'arrow-right' : 'chevron',
                x,
                y,
                width: itemWidth,
                height: itemHeight,
                text: item.text || item,
                fill: childColors[idx % childColors.length],
                stroke: theme.light1,
                strokeWidth: 2,
                textColor: theme.light1,
                fontSize: Math.min(18, itemHeight * 0.25),
                // Chevron point depth
                pointDepth: itemWidth * 0.15
            });
        });
    }

    return {
        type: 'chevron',
        shapes,
        connectors,
        bounds: { x: 0, y: 0, width, height }
    };
}

/* ── chevron2: round2SameRect accent + chevron per item ── */

function layoutChevron2(option) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const count = items.length || 3;
    const colors = theme.childColors || [theme.accent1, theme.accent2, theme.accent3, theme.accent4, theme.accent5, theme.accent6];
    const shapes = [];
    const gap = width * 0.02;
    const itemW = (width - gap * (count + 1)) / count;
    const accentH = height * 0.35;
    const chevronH = height * 0.35;
    const accentY = height * 0.05;
    const chevronY = accentY + accentH + height * 0.08;

    items.forEach((item, idx) => {
        const x = gap + idx * (itemW + gap);
        shapes.push({
            id: `accent-${idx}`, type: 'round2SameRect',
            x, y: accentY, width: itemW, height: accentH,
            text: item.text || item,
            fill: colors[idx % colors.length], stroke: theme.light1, strokeWidth: 2,
            textColor: theme.light1, fontSize: 14
        });
        shapes.push({
            id: `chevron-${idx}`, type: 'chevron',
            x, y: chevronY, width: itemW, height: chevronH,
            text: '', fill: colors[idx % colors.length],
            stroke: theme.light1, strokeWidth: 2,
            textColor: theme.light1, fontSize: 12,
            pointDepth: itemW * 0.15, opacity: 0.6
        });
    });

    return { type: 'chevron', shapes, connectors: [], bounds: { x: 0, y: 0, width, height } };
}
