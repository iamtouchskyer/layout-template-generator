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
 * AlternatingHexagons Layout - 2x2 matrix with center circle
 * Based on OOXML drawing13.xml:
 * - 4 roundRect at corners: x=6.7%/60.4%, y=0%/68%, w=32.9%, h=32%
 * - 4 pieWedge forming center circle
 * - Curved arrows between boxes
 */
function hexagonLayout(option, config) {
    const { items, size, theme } = option;
    const { width, height } = size;

    const shapes = [];
    const connectors = [];

    // Layout constants from OOXML (drawing13.xml)
    const boxW = width * 0.329;
    const boxH = height * 0.32;
    const leftX = width * 0.067;
    const rightX = width * 0.604;
    const topY = height * 0.0;
    const bottomY = height * 0.68;

    // Corner positions: [topLeft, topRight, bottomRight, bottomLeft]
    const positions = [
        { x: leftX, y: topY },
        { x: rightX, y: topY },
        { x: rightX, y: bottomY },
        { x: leftX, y: bottomY }
    ];

    // Add 4 corner boxes (use first 4 items, cycle if fewer)
    for (let i = 0; i < 4; i++) {
        const item = items[i % items.length] || { text: `Item ${i + 1}` };
        const pos = positions[i];
        const colorIdx = i % 6;
        const accentKey = `accent${colorIdx + 1}`;

        shapes.push({
            id: `box-${i}`,
            type: 'roundRect',
            x: pos.x,
            y: pos.y,
            width: boxW,
            height: boxH,
            text: item.text || item,
            fill: theme[accentKey] || theme.accent1,
            stroke: 'none',
            strokeWidth: 0,
            textColor: theme.light1,
            fontSize: 14,
            rx: 8,
            ry: 8
        });
    }

    // Center circle made of 4 pie wedges
    const cx = width / 2;
    const cy = height / 2;
    const outerR = Math.min(width, height) * 0.18;
    const innerR = outerR * 0.3;

    // 4 pie wedges (0°, 90°, 180°, 270°)
    for (let i = 0; i < 4; i++) {
        const startAngle = i * 90 - 45;  // -45, 45, 135, 225
        const endAngle = startAngle + 90;
        const colorIdx = i % 6;
        const accentKey = `accent${colorIdx + 1}`;

        shapes.push({
            id: `pie-${i}`,
            type: 'pie',
            cx,
            cy,
            innerRadius: innerR,
            outerRadius: outerR,
            startAngle,
            endAngle,
            fill: theme[accentKey] || theme.accent1,
            stroke: theme.light1,
            strokeWidth: 1
        });
    }

    // Curved arrows between corners
    const arrowRadius = Math.min(width, height) * 0.32;
    // Arrow from top-right to bottom-right (clockwise)
    connectors.push({
        type: 'curvedArrow',
        cx,
        cy,
        radius: arrowRadius,
        startAngle: -45,
        endAngle: 45,
        stroke: theme.dark2 || '#666'
    });
    // Arrow from bottom-left to top-left (clockwise)
    connectors.push({
        type: 'curvedArrow',
        cx,
        cy,
        radius: arrowRadius,
        startAngle: 135,
        endAngle: 225,
        stroke: theme.dark2 || '#666'
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
