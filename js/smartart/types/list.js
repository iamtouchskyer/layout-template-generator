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
        // Vertical stack
        const itemHeight = (height - gap * (count + 1)) / count;
        const itemWidth = width - gap * 2;

        items.forEach((item, idx) => {
            const x = gap;
            const y = gap + idx * (itemHeight + gap);

            const colorIdx = idx % 6;
            const accentKey = `accent${colorIdx + 1}`;

            shapes.push({
                id: `item-${idx}`,
                type: 'rect',
                x,
                y,
                width: itemWidth,
                height: itemHeight,
                text: item.text || item,
                fill: theme[accentKey] || theme.accent1,
                stroke: theme.light1,
                strokeWidth: 2,
                textColor: theme.light1,
                fontSize: Math.min(18, itemHeight * 0.3),
                rx: 4,
                ry: 4
            });
        });
    } else {
        // Horizontal row
        const itemWidth = (width - gap * (count + 1)) / count;
        const itemHeight = height - gap * 2;

        items.forEach((item, idx) => {
            const x = gap + idx * (itemWidth + gap);
            const y = gap;

            const colorIdx = idx % 6;
            const accentKey = `accent${colorIdx + 1}`;

            shapes.push({
                id: `item-${idx}`,
                type: 'rect',
                x,
                y,
                width: itemWidth,
                height: itemHeight,
                text: item.text || item,
                fill: theme[accentKey] || theme.accent1,
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

function hexagonLayout(option, config) {
    const { items, size, theme } = option;
    const { width, height } = size;

    const count = items.length || 3;
    const shapes = [];

    // Alternating hexagons - zigzag pattern
    const hexWidth = width / (count * 0.8);
    const hexHeight = hexWidth * 0.866; // Regular hexagon ratio

    items.forEach((item, idx) => {
        const row = idx % 2;
        const col = Math.floor(idx / 2) * 2 + row;
        const x = col * hexWidth * 0.75 + (width - count * hexWidth * 0.75) / 2;
        const y = row * hexHeight * 0.5 + (height - hexHeight) / 2;

        const colorIdx = idx % 6;
        const accentKey = `accent${colorIdx + 1}`;

        shapes.push({
            id: `hex-${idx}`,
            type: 'hexagon',
            x,
            y,
            width: hexWidth,
            height: hexHeight,
            text: item.text || item,
            fill: theme[accentKey] || theme.accent1,
            stroke: theme.light1,
            strokeWidth: 2,
            textColor: theme.light1,
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

function pictureLayout(option, config) {
    const { items, size, theme } = option;
    const { width, height } = size;

    const count = items.length || 3;
    const shapes = [];
    const gap = width * 0.02;

    const itemWidth = (width - gap * (count + 1)) / count;
    const picHeight = height * 0.6;
    const textHeight = height * 0.3;

    items.forEach((item, idx) => {
        const x = gap + idx * (itemWidth + gap);

        const colorIdx = idx % 6;
        const accentKey = `accent${colorIdx + 1}`;

        // Picture placeholder (circle)
        shapes.push({
            id: `pic-${idx}`,
            type: 'ellipse',
            cx: x + itemWidth / 2,
            cy: gap + picHeight / 2,
            rx: Math.min(itemWidth, picHeight) / 2 - gap,
            ry: Math.min(itemWidth, picHeight) / 2 - gap,
            text: '',
            fill: theme[accentKey] || theme.accent1,
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

    const itemWidth = (width - gap * (count + 1)) / count;
    const picHeight = height * 0.55;
    const captionHeight = height * 0.12;
    const descHeight = height * 0.2;

    items.forEach((item, idx) => {
        const x = gap + idx * (itemWidth + gap);
        const colorIdx = idx % 6;
        const accentKey = `accent${colorIdx + 1}`;

        // Picture placeholder (rectangle)
        shapes.push({
            id: `pic-${idx}`,
            type: 'rect',
            x,
            y: gap,
            width: itemWidth,
            height: picHeight,
            text: '',
            fill: theme[accentKey] || theme.accent1,
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
