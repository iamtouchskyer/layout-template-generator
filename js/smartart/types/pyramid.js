/**
 * Pyramid Layout - trapezoid stacking
 * Based on OOXML pyramid1 layout algorithm
 */

export function pyramidLayout(option, config = {}) {
    const { items, size, theme } = option;
    const { inverted = false, listStyle = false } = config;
    const { width, height } = size;

    // Pyramid with list on the right (pyramid2 style)
    if (listStyle) {
        return pyramidListLayout(option, config);
    }

    const count = items.length || 1;
    const gap = 0; // Pyramids stack without gaps
    const totalHeight = height;
    const itemHeight = totalHeight / count;

    // Calculate shapes - each level gets wider (or narrower if inverted)
    const shapes = items.map((item, idx) => {
        const level = inverted ? count - 1 - idx : idx;
        const levelRatio = (level + 1) / count;

        // Width increases with level (bottom is widest)
        const levelWidth = width * levelRatio;
        const prevWidth = level === 0 ? 0 : width * (level / count);

        const x = (width - levelWidth) / 2;
        const y = inverted ? idx * itemHeight : (count - 1 - idx) * itemHeight;

        // Color gradient - use accent colors with offset
        const colorIdx = idx % 6;
        const accentKey = `accent${colorIdx + 1}`;

        return {
            id: `shape-${idx}`,
            type: 'trapezoid',
            x,
            y,
            width: levelWidth,
            height: itemHeight,
            text: item.text || item,
            fill: theme[accentKey] || theme.accent1,
            stroke: theme.light1,
            strokeWidth: 2,
            // Trapezoid specific - top width ratio
            topWidthRatio: prevWidth / levelWidth,
            textColor: theme.light1,
            fontSize: Math.min(24, itemHeight * 0.4),
            // OOXML reference data
            ooxml: {
                prst: 'trapezoid',
                adj: 75000 // adjustment value from drawing5.xml
            }
        };
    });

    // Reverse for normal pyramid (top-down in data, bottom-up visually)
    if (!inverted) {
        shapes.reverse();
    }

    return {
        type: 'pyramid',
        shapes,
        connectors: [], // Pyramids don't have connectors
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

    // Add pyramid background (normal triangle: apex at top)
    shapes.push({
        id: 'pyramid-bg',
        type: 'triangle',
        x: triX,
        y: 0,
        width: triW,
        height: height,
        fill: theme.accent1 || '#156082',
        stroke: 'none',
        strokeWidth: 0,
        text: '',
        textColor: 'transparent'
    });

    // Add list items - all left-aligned at 45%
    items.forEach((item, idx) => {
        const y = height * (startYRatio + idx * stepRatio);
        const itemH = height * itemHeightRatio;

        shapes.push({
            id: `list-${idx}`,
            type: 'roundRect',
            x: listX,
            y,
            width: listW,
            height: itemH,
            text: item.text || item,
            fill: theme.light1 || '#FFFFFF',
            stroke: theme.accent1 || '#CCCCCC',
            strokeWidth: 1.5,
            textColor: theme.dark1 || '#333333',
            fontSize: Math.min(18, itemH * 0.35),
            rx: 8,
            ry: 8
        });
    });

    return {
        type: 'pyramid',
        shapes,
        connectors: [],
        bounds: { x: 0, y: 0, width, height }
    };
}
