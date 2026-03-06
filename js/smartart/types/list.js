/**
 * List Layout - horizontal or vertical blocks
 * Based on OOXML default/vList3/AccentedPicture/AlternatingHexagons layouts
 */

export function listLayout(option, config = {}) {
    const { items, size, theme } = option;
    const { direction = 'horizontal', style = 'block' } = config;
    const { width, height } = size;

    const count = items.length || 3;
    const shapes = [];
    const gap = Math.min(width, height) * 0.02;
    const childColors = theme.childColors || [theme.accent1, theme.accent2, theme.accent3, theme.accent4, theme.accent5, theme.accent6];

    if (style === 'hexagon') {
        // Alternating hexagons
        return hexagonLayout(option, config);
    }

    if (style === 'picture') {
        // Accented picture layout
        return pictureLayout(option, config);
    }

    if (style === 'captioned') {
        // Captioned pictures layout
        return captionedPicturesLayout(option, config);
    }

    if (direction === 'vertical') {
        // vList3-like layout: left ellipses + right arrow plates.
        const itemHeight = (height - gap * (count + 1)) / count;
        const markerR = itemHeight * 0.33;
        const markerCx = width * 0.245;
        const plateX = width * 0.29;
        const plateW = width * 0.5;
        const markerFill = blend(theme.dark1 || '#1F2937', theme.light1 || '#FFFFFF', 0.65);
        const plateFill = theme.accent1 || childColors[0];

        items.forEach((item, idx) => {
            const y = gap + idx * (itemHeight + gap);
            const cy = y + itemHeight / 2;

            shapes.push({
                id: `marker-${idx}`,
                type: 'ellipse',
                cx: markerCx,
                cy,
                rx: markerR,
                ry: markerR,
                text: '',
                fill: markerFill,
                stroke: theme.light1,
                strokeWidth: 1.5
            });

            shapes.push({
                id: `item-${idx}`,
                type: 'homePlate',
                x: plateX,
                y,
                width: plateW,
                height: itemHeight,
                text: item.text || item,
                fill: plateFill,
                stroke: theme.light1,
                strokeWidth: 1.5,
                textColor: theme.light1,
                fontSize: Math.min(18, itemHeight * 0.32)
            });
        });
    } else {
        // Horizontal row
        const itemWidth = (width - gap * (count + 1)) / count;
        const itemHeight = height - gap * 2;

        items.forEach((item, idx) => {
            const x = gap + idx * (itemWidth + gap);
            const y = gap;

            shapes.push({
                id: `item-${idx}`,
                type: 'rect',
                x,
                y,
                width: itemWidth,
                height: itemHeight,
                text: item.text || item,
                fill: childColors[idx % childColors.length],
                stroke: theme.light1,
                strokeWidth: 2,
                textColor: theme.light1,
                fontSize: Math.min(18, itemWidth * 0.12),
                rx: 4,
                ry: 4
            });
        });
    }

    return {
        type: 'list',
        shapes,
        connectors: [],
        bounds: { x: 0, y: 0, width, height }
    };
}

function blend(hexA, hexB, ratio = 0.5) {
    const a = String(hexA || '#888888').replace('#', '');
    const b = String(hexB || '#888888').replace('#', '');
    const ar = parseInt(a.substring(0, 2), 16);
    const ag = parseInt(a.substring(2, 4), 16);
    const ab = parseInt(a.substring(4, 6), 16);
    const br = parseInt(b.substring(0, 2), 16);
    const bg = parseInt(b.substring(2, 4), 16);
    const bb = parseInt(b.substring(4, 6), 16);
    const r = Math.round(ar * (1 - ratio) + br * ratio);
    const g = Math.round(ag * (1 - ratio) + bg * ratio);
    const bl = Math.round(ab * (1 - ratio) + bb * ratio);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${bl.toString(16).padStart(2, '0')}`;
}

/**
 * AlternatingHexagons Layout - Honeycomb pattern
 * Based on PPT reference: hexagons in staggered rows
 * Row 1: 2 hexagons (offset right)
 * Row 2: 2 hexagons (offset left)
 * Row 3: 2 hexagons (offset right)
 */
function hexagonLayout(option, config) {
    const { items, size, theme } = option;
    const { width, height } = size;

    const shapes = [];
    const count = Math.min(items.length, 6) || 4;
    const childColors = theme.childColors || [theme.accent1, theme.accent2, theme.accent3, theme.accent4, theme.accent5, theme.accent6];

    // Hexagon dimensions - fit nicely in container
    const hexW = width * 0.28;
    const hexH = hexW * 0.866;  // Regular hexagon ratio
    const overlapX = hexW * 0.25;  // Horizontal overlap
    const overlapY = hexH * 0.25;  // Vertical overlap

    // Honeycomb positions: alternating left/right offset per row
    // Pattern: [row][col] where odd rows are offset
    const positions = [];
    const cols = 2;
    const rows = Math.ceil(count / cols);

    const totalW = hexW * 2 - overlapX;
    const totalH = hexH * rows - overlapY * (rows - 1);
    const startX = (width - totalW) / 2;
    const startY = (height - totalH) / 2;

    for (let i = 0; i < count; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const rowOffset = (row % 2 === 0) ? hexW * 0.15 : -hexW * 0.15;

        positions.push({
            x: startX + col * (hexW - overlapX) + rowOffset,
            y: startY + row * (hexH - overlapY)
        });
    }

    // Add hexagons
    for (let i = 0; i < count; i++) {
        const item = items[i] || { text: `Item ${i + 1}` };
        const pos = positions[i];

        shapes.push({
            id: `hex-${i}`,
            type: 'hexagon',
            x: pos.x,
            y: pos.y,
            width: hexW,
            height: hexH,
            text: item.text || item,
            fill: childColors[i % childColors.length],
            stroke: theme.light1 || '#FFFFFF',
            strokeWidth: 2,
            textColor: theme.light1 || '#FFFFFF',
            fontSize: 14
        });
    }

    return {
        type: 'list',
        shapes,
        connectors: [],
        bounds: { x: 0, y: 0, width, height }
    };
}

function pictureLayout(option, config) {
    const { items, size, theme } = option;
    const { width, height } = size;

    const count = items.length || 3;
    const shapes = [];
    const gap = width * 0.02;
    const childColors = theme.childColors || [theme.accent1, theme.accent2, theme.accent3, theme.accent4, theme.accent5, theme.accent6];

    const itemWidth = (width - gap * (count + 1)) / count;
    const picHeight = height * 0.6;
    const textHeight = height * 0.3;

    items.forEach((item, idx) => {
        const x = gap + idx * (itemWidth + gap);

        // Picture placeholder (circle)
        shapes.push({
            id: `pic-${idx}`,
            type: 'ellipse',
            cx: x + itemWidth / 2,
            cy: gap + picHeight / 2,
            rx: Math.min(itemWidth, picHeight) / 2 - gap,
            ry: Math.min(itemWidth, picHeight) / 2 - gap,
            text: '',
            fill: childColors[idx % childColors.length],
            stroke: theme.light1,
            strokeWidth: 2,
            isPlaceholder: true
        });

        // Text below
        shapes.push({
            id: `text-${idx}`,
            type: 'rect',
            x,
            y: gap + picHeight,
            width: itemWidth,
            height: textHeight,
            text: item.text || item,
            fill: 'transparent',
            stroke: 'none',
            textColor: theme.dark1,
            fontSize: 14
        });
    });

    return {
        type: 'list',
        shapes,
        connectors: [],
        bounds: { x: 0, y: 0, width, height }
    };
}

/**
 * Captioned Pictures Layout - rectangular pictures with captions below
 * Based on OOXML CaptionedPictures layout
 */
function captionedPicturesLayout(option, config) {
    const { items, size, theme } = option;
    const { width, height } = size;

    const count = items.length || 3;
    const shapes = [];
    const gap = width * 0.03;
    const childColors = theme.childColors || [theme.accent1, theme.accent2, theme.accent3, theme.accent4, theme.accent5, theme.accent6];

    const itemWidth = (width - gap * (count + 1)) / count;
    const picHeight = height * 0.55;
    const captionHeight = height * 0.12;
    const descHeight = height * 0.2;

    items.forEach((item, idx) => {
        const x = gap + idx * (itemWidth + gap);

        // Picture placeholder (rectangle)
        shapes.push({
            id: `pic-${idx}`,
            type: 'rect',
            x,
            y: gap,
            width: itemWidth,
            height: picHeight,
            text: '',
            fill: childColors[idx % childColors.length],
            stroke: theme.light1,
            strokeWidth: 2,
            rx: 4,
            ry: 4,
            isPlaceholder: true
        });

        // Caption (title text)
        const itemText = item.text || item;
        shapes.push({
            id: `caption-${idx}`,
            type: 'rect',
            x,
            y: gap + picHeight + gap / 2,
            width: itemWidth,
            height: captionHeight,
            text: itemText,
            fill: 'transparent',
            stroke: 'none',
            textColor: theme.dark1,
            fontSize: 16,
            fontWeight: 'bold'
        });

        // Description text (optional)
        shapes.push({
            id: `desc-${idx}`,
            type: 'rect',
            x,
            y: gap + picHeight + captionHeight + gap / 2,
            width: itemWidth,
            height: descHeight,
            text: item.description || '',
            fill: 'transparent',
            stroke: 'none',
            textColor: theme.dark1,
            fontSize: 12,
            opacity: 0.7
        });
    });

    return {
        type: 'list',
        shapes,
        connectors: [],
        bounds: { x: 0, y: 0, width, height }
    };
}
