/**
 * Pyramid Layout - trapezoid stacking
 * Based on OOXML pyramid1 layout algorithm
 */

export function pyramidLayout(option, config = {}) {
    const { items, size, theme } = option;
    const { inverted = false, listStyle = false, segmented = false } = config;
    const { width, height } = size;

    // Pyramid with list on the right (pyramid2 style)
    if (listStyle) {
        return pyramidListLayout(option, config);
    }

    // Segmented pyramid - triangular grid (pyramid4 style)
    if (segmented) {
        return pyramidSegmentedLayout(option, config);
    }

    const count = items.length || 1;
    const gap = 0; // Pyramids stack without gaps
    const totalHeight = height;
    const itemHeight = totalHeight / count;

    // Use childColors from scheme
    const childColors = theme.childColors || [theme.accent1, theme.accent2, theme.accent3, theme.accent4, theme.accent5, theme.accent6];

    // Check if any item has children - if so, shrink pyramid to make room for textboxes
    const hasAnyChildren = items.some(item => item.children && item.children.length > 0);
    const pyramidWidth = hasAnyChildren ? width * 0.55 : width;
    const textboxX = pyramidWidth + width * 0.02;
    const textboxW = width - textboxX - 10;

    // Calculate shapes - each level gets wider (or narrower if inverted)
    const shapes = [];

    items.forEach((item, idx) => {
        const level = inverted ? count - 1 - idx : idx;
        const levelRatio = (level + 1) / count;

        // Width increases with level (bottom is widest)
        const levelWidth = pyramidWidth * levelRatio;
        const prevWidth = level === 0 ? 0 : pyramidWidth * (level / count);

        const x = (pyramidWidth - levelWidth) / 2;
        const y = idx * itemHeight;

        // Pyramid shape (parent text, centered)
        shapes.push({
            id: `shape-${idx}`,
            type: 'trapezoid',
            x,
            y,
            width: levelWidth,
            height: itemHeight,
            text: item.text || item,
            fill: childColors[idx % childColors.length],
            stroke: theme.light1,
            strokeWidth: 2,
            topWidthRatio: prevWidth / levelWidth,
            invertedTrapezoid: inverted,  // Flip each trapezoid for inverted pyramid
            textColor: theme.light1,
            fontSize: Math.min(24, itemHeight * 0.4),
            ooxml: { prst: 'trapezoid', adj: 75000 }
        });

        // Textbox for children (bullet text, left-top aligned)
        const children = item.children || [];
        if (children.length > 0) {
            const bulletText = children.map(c => '• ' + (c.text || c)).join('\n');
            shapes.push({
                id: `textbox-${idx}`,
                type: 'roundRect',
                x: textboxX,
                y,
                width: textboxW,
                height: itemHeight,
                text: bulletText,
                fill: theme.light1 || '#FFFFFF',
                stroke: childColors[idx % childColors.length],
                strokeWidth: 1.5,
                textColor: theme.dark1 || '#333333',
                fontSize: Math.min(16, itemHeight * 0.3),
                rx: 6,
                ry: 6,
                textAlign: 'left',
                textVAlign: 'top'
            });
        }
    });

    // Reverse pyramid shapes for normal pyramid (top-down in data, bottom-up visually)
    // But keep textboxes in original order
    if (!inverted) {
        const pyramidShapes = shapes.filter(s => s.id.startsWith('shape-'));
        const textboxShapes = shapes.filter(s => s.id.startsWith('textbox-'));
        pyramidShapes.reverse();
        shapes.length = 0;
        shapes.push(...pyramidShapes, ...textboxShapes);
    }

    return {
        type: 'pyramid',
        shapes,
        connectors: [],
        bounds: { x: 0, y: 0, width, height }
    };
}

/**
 * Pyramid List Layout - triangle with overlapping list items (left-aligned)
 * Based on OOXML pyramid2 layout extracted from smartart.pptx
 *
 * Layout rules (from PPT):
 * - Triangle: x=11.7%, y=0%, w=66.7%, h=100%
 * - List boxes: x=45%, w=43.3%, h=14.2%, spacing=16%
 */
function pyramidListLayout(option, config) {
    const { items, size, theme } = option;
    const { width, height } = size;

    const count = items.length || 1;
    const shapes = [];

    // Triangle: offset from left, spans 66.7% width
    const triX = width * 0.117;
    const triW = width * 0.667;

    // List items layout (dynamic based on count)
    const listX = width * 0.45;
    const listW = width * 0.433;

    // Calculate height and spacing dynamically
    // For 5 items: startY=10%, spacing=16%, height=14.2%
    // Total used = 10% + 5*14.2% + 4*1.8% = 10% + 71% + 7.2% = 88.2%
    const startYRatio = 0.10;
    const gapRatio = 0.018;  // gap between items
    const availableHeight = 1 - startYRatio - 0.08;  // leave 8% at bottom
    const itemHeightRatio = (availableHeight - gapRatio * (count - 1)) / count;
    const stepRatio = itemHeightRatio + gapRatio;

    // Add pyramid background - uses parentColor
    shapes.push({
        id: 'pyramid-bg',
        type: 'triangle',
        x: triX,
        y: 0,
        width: triW,
        height: height,
        fill: theme.parentColor || theme.accent1 || '#156082',
        stroke: 'none',
        strokeWidth: 0,
        text: '',
        textColor: 'transparent'
    });

    // Add list items - use parentColor for border
    // Children are rendered as bullet text (left-top aligned)
    items.forEach((item, idx) => {
        const y = height * (startYRatio + idx * stepRatio);
        const itemH = height * itemHeightRatio;

        // Build text content: if has children, show as bullet list
        const children = item.children || [];
        const bulletText = children.length > 0
            ? children.map(c => '• ' + (c.text || c)).join('\n')
            : (item.text || item);
        const hasChildren = children.length > 0;

        shapes.push({
            id: `list-${idx}`,
            type: 'roundRect',
            x: listX,
            y,
            width: listW,
            height: itemH,
            text: bulletText,
            fill: theme.light1 || '#FFFFFF',
            stroke: theme.parentColor || theme.accent1 || '#CCCCCC',
            strokeWidth: 1.5,
            textColor: theme.dark1 || '#333333',
            fontSize: Math.min(18, itemH * 0.35),
            rx: 8,
            ry: 8,
            // Children use left-top alignment, parent text uses center
            textAlign: hasChildren ? 'left' : 'center',
            textVAlign: hasChildren ? 'top' : 'center'
        });
    });

    return {
        type: 'pyramid',
        shapes,
        connectors: [],
        bounds: { x: 0, y: 0, width, height }
    };
}

/**
 * Segmented Pyramid Layout (pyramid4 / OOXML pyramid4)
 *
 * Creates interlocking triangular grid forming a solid pyramid shape.
 *
 * Layout pattern:
 *   Row 0:     1 triangle  (up)
 *   Row 1:     3 triangles (up, down, up)
 *   Row 2:     5 triangles (up, down, up, down, up)
 *   Row n: (2n+1) triangles alternating up/down
 *
 * Capacity: n rows can hold up to n² items (1, 4, 9, 16...)
 *
 * Interlocking geometry:
 *   - halfBase = width / (2 * rows) is the positioning unit
 *   - Triangle width = 2 * halfBase (triangles overlap by halfBase)
 *   - Adjacent triangles offset by halfBase horizontally
 *   - Inverted triangles (odd columns) fill gaps between upward triangles
 *   - All triangles share edges, forming a solid pyramid with no gaps
 */
function pyramidSegmentedLayout(option, config) {
    const { items, size, theme } = option;
    const { width, height } = size;

    const shapes = [];
    const count = items.length || 5;

    // Rows needed: n² capacity per n rows
    let rows = Math.ceil(Math.sqrt(count));
    if (rows < 1) rows = 1;

    // Interlocking grid unit
    const halfBase = width / (2 * rows);
    const triW = halfBase * 2;
    const triH = height / rows;

    // Use childColors from scheme
    const childColors = theme.childColors || [theme.accent1, theme.accent2, theme.accent3, theme.accent4, theme.accent5, theme.accent6];
    let itemIdx = 0;

    for (let row = 0; row < rows && itemIdx < count; row++) {
        const trisInRow = 2 * row + 1;
        const rowStartX = (rows - row - 1) * halfBase;
        const y = row * triH;

        for (let col = 0; col < trisInRow && itemIdx < count; col++) {
            const x = rowStartX + col * halfBase;
            const item = items[itemIdx];
            const isInverted = col % 2 === 1;

            shapes.push({
                id: `seg-${itemIdx}`,
                type: 'triangle',
                x,
                y,
                width: triW,
                height: triH,
                inverted: isInverted,
                text: item.text || item,
                fill: childColors[itemIdx % childColors.length],
                stroke: theme.light1 || '#FFFFFF',
                strokeWidth: 2,
                textColor: theme.light1 || '#FFFFFF',
                fontSize: Math.min(16, Math.min(triW, triH) * 0.25)
            });
            itemIdx++;
        }
    }

    return {
        type: 'pyramid',
        shapes,
        connectors: [],
        bounds: { x: 0, y: 0, width, height }
    };
}
