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

/**
 * AlternatingHexagons Layout - Cycle matrix with corner text boxes
 * Based on PPT reference:
 * - Center: Large circle divided into 4 quadrants with text
 * - 4 corners: Small rounded rectangles with bullet text
 * - Center: Cycle arrows icon
 */
function hexagonLayout(option, config) {
    const { items, size, theme } = option;
    const { width, height } = size;

    const shapes = [];
    const connectors = [];

    const cx = width / 2;
    const cy = height / 2;
    const circleR = Math.min(width, height) * 0.38;

    // Corner text box dimensions
    const boxW = width * 0.22;
    const boxH = height * 0.15;
    const margin = width * 0.02;

    // 4 corner text boxes [topLeft, topRight, bottomRight, bottomLeft]
    const cornerPositions = [
        { x: margin, y: margin },
        { x: width - boxW - margin, y: margin },
        { x: width - boxW - margin, y: height - boxH - margin },
        { x: margin, y: height - boxH - margin }
    ];

    // Add corner text boxes (white bg, accent border)
    for (let i = 0; i < 4; i++) {
        const item = items[i % items.length] || { text: `Item ${i + 1}` };
        const pos = cornerPositions[i];

        shapes.push({
            id: `corner-${i}`,
            type: 'roundRect',
            x: pos.x,
            y: pos.y,
            width: boxW,
            height: boxH,
            text: '• ' + (item.text || item),
            fill: theme.light1 || '#FFFFFF',
            stroke: theme.accent1 || '#156082',
            strokeWidth: 1.5,
            textColor: theme.dark1 || '#333333',
            fontSize: 12,
            rx: 6,
            ry: 6
        });
    }

    // 4 pie quadrants forming the main circle
    // Quadrant order: top-left(AA), top-right(BB), bottom-right(CC), bottom-left(DDDD)
    const quadrantAngles = [
        { start: 180, end: 270 },  // top-left
        { start: 270, end: 360 },  // top-right
        { start: 0, end: 90 },     // bottom-right
        { start: 90, end: 180 }    // bottom-left
    ];

    for (let i = 0; i < 4; i++) {
        const item = items[i % items.length] || { text: `Item ${i + 1}` };
        const angles = quadrantAngles[i];

        shapes.push({
            id: `quadrant-${i}`,
            type: 'pie',
            cx,
            cy,
            innerRadius: 0,
            outerRadius: circleR,
            startAngle: angles.start,
            endAngle: angles.end,
            fill: theme.accent1 || '#156082',
            stroke: theme.light1 || '#FFFFFF',
            strokeWidth: 2,
            text: item.text || item,
            textColor: theme.light1 || '#FFFFFF',
            fontSize: 16
        });
    }

    // Center cycle arrows (two curved arrows)
    const arrowR = circleR * 0.18;
    connectors.push({
        type: 'curvedArrow',
        cx, cy,
        radius: arrowR,
        startAngle: -30,
        endAngle: 150,
        stroke: theme.light1 || '#FFFFFF'
    });
    connectors.push({
        type: 'curvedArrow',
        cx, cy,
        radius: arrowR,
        startAngle: 150,
        endAngle: 330,
        stroke: theme.light1 || '#FFFFFF'
    });

    return {
        type: 'list',
        shapes,
        connectors,
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
