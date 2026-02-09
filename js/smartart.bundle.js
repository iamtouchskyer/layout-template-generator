/**
 * SmartArt Library - Browser Bundle
 * ECharts-like API for OOXML SmartArt rendering
 *
 * Usage:
 *   const chart = SmartArt.init(container);
 *   chart.setOption({ type: 'pyramid', items: ['A', 'B', 'C'] });
 */

(function(global) {
    'use strict';

    // EMU conversion constants
    const EMU_PER_PX = 9525;
    const EMU_PER_POINT = 12700;
    const SVG_NS = 'http://www.w3.org/2000/svg';

    // ==================== Layout Functions ====================

    function pyramidLayout(option, config = {}) {
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
        const itemHeight = height / count;

        const shapes = items.map((item, idx) => {
            // Normal pyramid: point at top (idx=0 narrow, idx=count-1 wide)
            // Inverted pyramid: point at bottom (idx=0 wide, idx=count-1 narrow)
            let topRatio, bottomRatio;

            if (inverted) {
                // Inverted: wide at top, narrow at bottom
                topRatio = (count - idx) / count;
                bottomRatio = (count - idx - 1) / count;
            } else {
                // Normal: narrow at top, wide at bottom
                topRatio = idx / count;
                bottomRatio = (idx + 1) / count;
            }

            const shapeWidth = width;
            const x = 0;
            const y = idx * itemHeight;

            return {
                id: `shape-${idx}`,
                type: 'trapezoid',
                x, y,
                width: shapeWidth,
                height: itemHeight,
                text: item.text || item,
                fill: getAccentColor(theme, idx),
                stroke: theme.light1,
                strokeWidth: 2,
                topWidthRatio: topRatio,
                bottomWidthRatio: bottomRatio,
                textColor: theme.light1,
                fontSize: Math.min(24, itemHeight * 0.4)
            };
        });

        return { type: 'pyramid', shapes, connectors: [], bounds: { x: 0, y: 0, width, height } };
    }

    // Pyramid List Layout - based on OOXML pyramid2 from smartart.pptx
    // Triangle: x=11.7%, w=66.7%, h=100%; List: x=45%, w=43.3%
    function pyramidListLayout(option, config) {
        const { items, size, theme } = option;
        const { width, height } = size;
        const count = items.length || 1;
        const shapes = [];

        // Triangle position from PPT
        const triX = width * 0.117;
        const triW = width * 0.667;

        // List items position from PPT
        const listX = width * 0.45;
        const listW = width * 0.433;

        // Dynamic height calculation
        const startYRatio = 0.10;
        const gapRatio = 0.018;
        const availableHeight = 1 - startYRatio - 0.08;
        const itemHeightRatio = (availableHeight - gapRatio * (count - 1)) / count;
        const stepRatio = itemHeightRatio + gapRatio;

        // Triangle background - uses parentColor
        shapes.push({
            id: 'pyramid-bg',
            type: 'triangle',
            x: triX, y: 0,
            width: triW,
            height: height,
            fill: theme.parentColor || theme.accent1 || '#156082',
            stroke: 'none',
            strokeWidth: 0,
            text: '',
            textColor: 'transparent'
        });

        // List items - use parentColor for border accent
        items.forEach((item, idx) => {
            const y = height * (startYRatio + idx * stepRatio);
            const itemH = height * itemHeightRatio;
            shapes.push({
                id: `list-${idx}`,
                type: 'roundRect',
                x: listX, y,
                width: listW,
                height: itemH,
                text: item.text || item,
                fill: theme.light1 || '#FFFFFF',
                stroke: theme.parentColor || theme.accent1 || '#CCCCCC',
                strokeWidth: 1.5,
                textColor: theme.dark1 || '#333333',
                fontSize: Math.min(18, itemH * 0.35),
                rx: 8, ry: 8
            });
        });

        return { type: 'pyramid', shapes, connectors: [], bounds: { x: 0, y: 0, width, height } };
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
     *
     * Example with 4 items (2 rows):
     *        /\
     *       /  \        <- Row 0: 1 upward triangle
     *      /----\
     *     /\    /\
     *    /  \  /  \     <- Row 1: up + down + up (interlocking)
     *   /----\/----\
     */
    function pyramidSegmentedLayout(option, config) {
        const { items, size, theme } = option;
        const { width, height } = size;
        const shapes = [];
        const count = items.length || 5;

        // Rows needed: n² capacity per n rows
        let rows = Math.ceil(Math.sqrt(count));
        if (rows < 1) rows = 1;

        // Interlocking grid unit: halfBase is the x-offset between adjacent triangles
        // Triangle width spans 2 halfBases, creating overlap for interlocking
        const halfBase = width / (2 * rows);
        const triW = halfBase * 2;
        const triH = height / rows;

        let itemIdx = 0;

        for (let row = 0; row < rows && itemIdx < count; row++) {
            const trisInRow = 2 * row + 1;  // 1, 3, 5, 7...
            // Each row starts one halfBase further left to create pyramid shape
            const rowStartX = (rows - row - 1) * halfBase;
            const y = row * triH;

            for (let col = 0; col < trisInRow && itemIdx < count; col++) {
                const x = rowStartX + col * halfBase;
                const item = items[itemIdx];
                const isInverted = col % 2 === 1;  // Odd columns point down

                shapes.push({
                    id: `seg-${itemIdx}`,
                    type: 'triangle',
                    x, y,
                    width: triW,
                    height: triH,
                    inverted: isInverted,
                    text: item.text || item,
                    fill: getAccentColor(theme, itemIdx),
                    stroke: theme.light1 || '#FFFFFF',
                    strokeWidth: 2,
                    textColor: theme.light1 || '#FFFFFF',
                    fontSize: Math.min(16, Math.min(triW, triH) * 0.25)
                });
                itemIdx++;
            }
        }

        return { type: 'pyramid', shapes, connectors: [], bounds: { x: 0, y: 0, width, height } };
    }

    /**
     * Basic Matrix (matrix1) - 2x2 cells with center node overlay
     * Data: items[0] = center parent, items[1-4] = quadrant children
     */
    function matrixLayout(option, config = {}) {
        const { items, size, theme } = option;
        const { titled = false, cycle = false } = config;
        const { width, height } = size;

        if (titled) return matrixTitledLayout(option);
        if (cycle) return matrixCycleLayout(option);

        const shapes = [];
        const gap = 4;
        const cellW = (width - gap) / 2;
        const cellH = (height - gap) / 2;

        // 4 quadrant cells (items[1-4]) - use childColors from scheme
        const childColors = theme.childColors || [theme.accent2, theme.accent3, theme.accent4, theme.accent5, theme.accent6];
        for (let i = 0; i < 4; i++) {
            const row = Math.floor(i / 2);
            const col = i % 2;
            const item = items[i + 1]; // items[1-4] are quadrants
            shapes.push({
                id: `cell-${i}`,
                type: 'roundRect',
                x: col * (cellW + gap),
                y: row * (cellH + gap),
                width: cellW, height: cellH,
                text: item?.text || item || '',
                fill: childColors[i % childColors.length],
                stroke: theme.light1,
                strokeWidth: 2,
                textColor: theme.light1,
                fontSize: Math.min(24, cellH * 0.2),
                rx: 16,
                ry: 16
            });
        }

        // Center node (items[0]) - tinted version of first child color (top-left quadrant)
        const centerW = width * 0.28;
        const centerH = height * 0.22;
        const centerFill = tintColor(childColors[0], 0.6); // 60% lighter
        shapes.push({
            id: 'center',
            type: 'roundRect',
            x: (width - centerW) / 2,
            y: (height - centerH) / 2,
            width: centerW, height: centerH,
            fill: centerFill,
            stroke: theme.light1,
            strokeWidth: 2,
            text: items[0]?.text || items[0] || '',
            textColor: theme.dark1,
            fontSize: Math.min(20, centerH * 0.35),
            rx: 8, ry: 8
        });

        return { type: 'matrix', shapes, connectors: [], bounds: { x: 0, y: 0, width, height } };
    }

    function matrixTitledLayout(option) {
        const { items, size, theme } = option;
        const { width, height } = size;
        const shapes = [];
        const titleHeight = height * 0.15;
        const gap = 8;

        // Title bar uses parentColor from scheme
        shapes.push({
            id: 'title',
            type: 'rect',
            x: 0, y: 0,
            width, height: titleHeight - gap,
            text: items[0]?.text || items[0] || 'Title',
            fill: theme.parentColor || theme.accent1,
            stroke: 'none',
            textColor: theme.light1,
            fontSize: 18
        });

        const cellW = (width - gap) / 2;
        const cellH = (height - titleHeight - gap) / 2;

        // Use childColors from scheme for grid cells
        const childColors = theme.childColors || [theme.accent2, theme.accent3, theme.accent4, theme.accent5, theme.accent6];
        for (let i = 0; i < 4; i++) {
            const row = Math.floor(i / 2);
            const col = i % 2;
            const item = items[i + 1];
            shapes.push({
                id: `cell-${i}`,
                type: 'rect',
                x: col * (cellW + gap),
                y: titleHeight + row * (cellH + gap),
                width: cellW, height: cellH,
                text: item?.text || item || '',
                fill: childColors[i % childColors.length],
                stroke: 'none',
                textColor: theme.light1,
                fontSize: Math.min(18, cellH * 0.15)
            });
        }

        return { type: 'matrix', shapes, connectors: [], bounds: { x: 0, y: 0, width, height } };
    }

    function matrixCycleLayout(option) {
        const { items, size, theme } = option;
        const { width, height } = size;
        const shapes = [];
        const gap = 12;
        const cellW = (width - gap) / 2;
        const cellH = (height - gap) / 2;

        // Use childColors from scheme for cycle cells
        const childColors = theme.childColors || [theme.accent2, theme.accent3, theme.accent4, theme.accent5, theme.accent6];
        for (let i = 0; i < 4; i++) {
            const row = Math.floor(i / 2);
            const col = i % 2;
            const item = items[i];
            shapes.push({
                id: `cell-${i}`,
                type: 'rect',
                x: col * (cellW + gap),
                y: row * (cellH + gap),
                width: cellW, height: cellH,
                text: item?.text || item || '',
                fill: childColors[i % childColors.length],
                stroke: 'none',
                textColor: theme.light1,
                fontSize: Math.min(18, cellH * 0.15),
                rx: 4, ry: 4
            });
        }

        const connectors = [];
        const centerX = width / 2, centerY = height / 2;
        const arrowSize = Math.min(cellW, cellH) * 0.12;
        const r = gap * 1.5;

        // Cycle arrows use parentColor
        [45, 135, 225, 315].forEach((angle, idx) => {
            const rad = (angle * Math.PI) / 180;
            connectors.push({
                id: `arrow-${idx}`,
                type: 'arrow',
                x: centerX + Math.cos(rad) * r - arrowSize / 2,
                y: centerY + Math.sin(rad) * r - arrowSize / 2,
                rotation: angle + 90,
                size: arrowSize,
                fill: theme.parentColor || theme.accent1
            });
        });

        return { type: 'matrix', shapes, connectors, bounds: { x: 0, y: 0, width, height } };
    }

    function cycleLayout(option, config = {}) {
        const { items, size, theme } = option;
        const { segmented = false } = config;
        const { width, height } = size;
        const count = items.length || 4;
        const cx = width / 2, cy = height / 2;

        const shapes = [];
        const connectors = [];

        if (segmented) {
            // Segmented cycle: pie slices
            const radius = Math.min(width, height) * 0.35;
            const anglePerItem = 360 / count;
            const innerRadius = radius * 0.3;

            items.forEach((item, idx) => {
                shapes.push({
                    id: `segment-${idx}`,
                    type: 'pie',
                    cx, cy,
                    innerRadius, outerRadius: radius,
                    startAngle: idx * anglePerItem - 90,
                    endAngle: idx * anglePerItem - 90 + anglePerItem,
                    text: item.text || item,
                    fill: getAccentColor(theme, idx),
                    stroke: theme.light1,
                    strokeWidth: 2,
                    textColor: theme.dark1,
                    fontSize: 14
                });
            });
        } else {
            // Basic cycle (cycle4) - OOXML constraints from layout4.xml
            const quadrantSize = Math.min(width, height) * 0.433;
            const boxW = width * 0.32;
            const boxH = height * 0.18;
            const gap = Math.min(width, height) * 0.01;

            const childColors = theme.childColors || [theme.accent1, theme.accent2, theme.accent3, theme.accent4, theme.accent5, theme.accent6];

            // Calculate quadrant center position (at 45° bisector, ~60% of radius for visual centroid)
            function getQuadrantCenter(quadrantIndex) {
                const bisectorAngles = [225, 315, 45, 135]; // top-left, top-right, bottom-right, bottom-left
                const angle = bisectorAngles[quadrantIndex] * Math.PI / 180;
                const centerDist = quadrantSize * 0.55; // visual center of pie slice
                return {
                    x: cx + Math.cos(angle) * centerDist,
                    y: cy + Math.sin(angle) * centerDist
                };
            }

            // Position boxes so inner corners are at quadrant centers
            const cornerPositions = [
                // top-left: inner corner is bottom-right of box
                { x: getQuadrantCenter(0).x - boxW, y: getQuadrantCenter(0).y - boxH },
                // top-right: inner corner is bottom-left of box
                { x: getQuadrantCenter(1).x, y: getQuadrantCenter(1).y - boxH },
                // bottom-right: inner corner is top-left of box
                { x: getQuadrantCenter(2).x, y: getQuadrantCenter(2).y },
                // bottom-left: inner corner is top-right of box
                { x: getQuadrantCenter(3).x - boxW, y: getQuadrantCenter(3).y }
            ];

            // Quadrant angles: top-left, top-right, bottom-right, bottom-left
            const quadrantAngles = [
                { start: 180, end: 270 },
                { start: 270, end: 360 },
                { start: 0, end: 90 },
                { start: 90, end: 180 }
            ];

            // First pass: draw corner boxes (lower z-order)
            for (let i = 0; i < 4; i++) {
                const item = items[i % items.length] || { text: `Item ${i + 1}` };
                const quadrantColor = childColors[i % childColors.length];
                const pos = cornerPositions[i];

                const childItem = item.children?.[0] || { text: item.text || item };
                shapes.push({
                    id: `corner-${i}`,
                    type: 'roundRect',
                    x: pos.x, y: pos.y,
                    width: boxW, height: boxH,
                    text: '• ' + (childItem.text || childItem),
                    fill: theme.light1 || '#FFFFFF',
                    stroke: quadrantColor,
                    strokeWidth: 1.5,
                    textColor: theme.dark1 || '#333333',
                    fontSize: 14,
                    rx: 8, ry: 8
                });
            }

            // Second pass: draw quadrants (higher z-order, overlay corner boxes)
            for (let i = 0; i < 4; i++) {
                const item = items[i % items.length] || { text: `Item ${i + 1}` };
                const angles = quadrantAngles[i];
                const quadrantColor = childColors[i % childColors.length];

                shapes.push({
                    id: `quadrant-${i}`,
                    type: 'pie',
                    cx, cy,
                    innerRadius: 0,
                    outerRadius: quadrantSize,
                    startAngle: angles.start,
                    endAngle: angles.end,
                    fill: quadrantColor,
                    stroke: theme.light1 || '#FFFFFF',
                    strokeWidth: gap * 2,
                    text: item.text || item,
                    textColor: theme.light1 || '#FFFFFF',
                    fontSize: 16
                });
            }

            // Center cycle arrows (OOXML: w=0.115, h=0.1)
            const arrowR = Math.min(width, height) * 0.05;
            connectors.push({
                type: 'curvedArrow',
                cx, cy, radius: arrowR,
                startAngle: -30, endAngle: 150,
                stroke: theme.light1 || '#FFFFFF'
            });
            connectors.push({
                type: 'curvedArrow',
                cx, cy, radius: arrowR,
                startAngle: 150, endAngle: 330,
                stroke: theme.light1 || '#FFFFFF'
            });
        }

        return { type: 'cycle', shapes, connectors, bounds: { x: 0, y: 0, width, height } };
    }

    function chevronLayout(option, config = {}) {
        const { items, size, theme } = option;
        const { style = 'chevron' } = config;
        const { width, height } = size;
        const count = items.length || 3;
        const shapes = [];

        if (style === 'descending') {
            const stepWidth = width / count, stepHeight = height / count;
            items.forEach((item, idx) => {
                shapes.push({
                    id: `step-${idx}`,
                    type: 'rect',
                    x: idx * stepWidth,
                    y: idx * stepHeight,
                    width: width - idx * stepWidth,
                    height: stepHeight,
                    text: item.text || item,
                    fill: getAccentColor(theme, idx),
                    stroke: theme.light1,
                    strokeWidth: 2,
                    textColor: theme.light1,
                    fontSize: Math.min(18, stepHeight * 0.4),
                    rx: 4, ry: 4
                });
            });
        } else {
            const overlap = style === 'chevron' ? width * 0.03 : 0;
            const itemWidth = (width + overlap * (count - 1)) / count;
            const itemHeight = height * 0.6;
            const y = (height - itemHeight) / 2;

            items.forEach((item, idx) => {
                shapes.push({
                    id: `item-${idx}`,
                    type: style === 'arrow' ? 'arrow-right' : 'chevron',
                    x: idx * (itemWidth - overlap),
                    y, width: itemWidth, height: itemHeight,
                    text: item.text || item,
                    fill: getAccentColor(theme, idx),
                    stroke: theme.light1,
                    strokeWidth: 2,
                    textColor: theme.light1,
                    fontSize: Math.min(18, itemHeight * 0.25),
                    pointDepth: itemWidth * 0.15
                });
            });
        }

        return { type: 'chevron', shapes, connectors: [], bounds: { x: 0, y: 0, width, height } };
    }

    function hierarchyLayout(option, config = {}) {
        const { items, size, theme } = option;
        const { width, height } = size;
        const shapes = [], connectors = [];

        const tree = buildTree(items);
        const levels = getLevels(tree);
        const maxNodesInLevel = Math.max(...levels.map(l => l.length));

        const nodeWidth = Math.min(150, (width - 40) / (maxNodesInLevel + 0.5));
        const nodeHeight = 50;
        const levelGap = (height - nodeHeight * levels.length) / (levels.length + 1);
        const nodeGap = 20;

        // Level 0 (root) uses parentColor, levels 1+ use childColors
        const childColors = theme.childColors || [theme.accent1, theme.accent2, theme.accent3, theme.accent4, theme.accent5, theme.accent6];

        levels.forEach((level, levelIdx) => {
            const levelY = levelGap + levelIdx * (nodeHeight + levelGap);
            const totalWidth = level.length * nodeWidth + (level.length - 1) * nodeGap;
            const startX = (width - totalWidth) / 2;

            level.forEach((node, nodeIdx) => {
                const x = startX + nodeIdx * (nodeWidth + nodeGap);
                node._x = x + nodeWidth / 2;
                node._y = levelY + nodeHeight / 2;

                // Root level uses parentColor, child levels use childColors
                const fillColor = levelIdx === 0
                    ? (theme.parentColor || theme.accent1)
                    : childColors[(levelIdx - 1) % childColors.length];

                shapes.push({
                    id: node.id || `node-${levelIdx}-${nodeIdx}`,
                    type: 'rect',
                    x, y: levelY,
                    width: nodeWidth, height: nodeHeight,
                    text: node.text || node,
                    fill: fillColor,
                    stroke: theme.light1,
                    strokeWidth: 2,
                    textColor: theme.light1,
                    fontSize: 14,
                    rx: 4, ry: 4
                });

                if (node._parent && node._parent._x !== undefined) {
                    connectors.push({
                        id: `conn-${node.id}`,
                        type: 'line',
                        x1: node._parent._x,
                        y1: node._parent._y + nodeHeight / 2,
                        x2: node._x,
                        y2: levelY,
                        stroke: theme.dark1,
                        strokeWidth: 2
                    });
                }
            });
        });

        return { type: 'hierarchy', shapes, connectors, bounds: { x: 0, y: 0, width, height } };
    }

    function radialLayout(option, config = {}) {
        const { items, size, theme } = option;
        const { width, height } = size;
        const shapes = [], connectors = [];
        const centerX = width / 2, centerY = height / 2;
        const radius = Math.min(width, height) * 0.35;

        const centerItem = items[0] || { text: 'Center' };
        const centerSize = radius * 0.6;

        // Center uses parentColor
        shapes.push({
            id: 'center',
            type: 'ellipse',
            cx: centerX, cy: centerY,
            rx: centerSize / 2, ry: centerSize / 2,
            text: centerItem.text || centerItem,
            fill: theme.parentColor || theme.accent1,
            stroke: theme.light1,
            strokeWidth: 2,
            textColor: theme.light1,
            fontSize: 16
        });

        const satellites = items.slice(1);
        const count = satellites.length || 4;
        const satelliteSize = radius * 0.4;
        const childColors = theme.childColors || [theme.accent1, theme.accent2, theme.accent3, theme.accent4, theme.accent5, theme.accent6];

        satellites.forEach((item, idx) => {
            const angle = (idx * 360 / count) - 90;
            const rad = (angle * Math.PI) / 180;
            const x = centerX + Math.cos(rad) * radius;
            const y = centerY + Math.sin(rad) * radius;

            // Satellites use childColors
            shapes.push({
                id: `satellite-${idx}`,
                type: 'rect',
                x: x - satelliteSize / 2,
                y: y - satelliteSize / 2,
                width: satelliteSize,
                height: satelliteSize * 0.6,
                text: item.text || item,
                fill: childColors[idx % childColors.length],
                stroke: theme.light1,
                strokeWidth: 2,
                textColor: theme.light1,
                fontSize: 12,
                rx: 4, ry: 4
            });

            // Connectors use parentColor
            connectors.push({
                id: `conn-${idx}`,
                type: 'line',
                x1: centerX + Math.cos(rad) * (centerSize / 2),
                y1: centerY + Math.sin(rad) * (centerSize / 2),
                x2: x - Math.cos(rad) * (satelliteSize / 2),
                y2: y - Math.sin(rad) * (satelliteSize * 0.3),
                stroke: theme.parentColor || theme.accent1,
                strokeWidth: 2
            });
        });

        return { type: 'radial', shapes, connectors, bounds: { x: 0, y: 0, width, height } };
    }

    function listLayout(option, config = {}) {
        const { items, size, theme } = option;
        const { direction = 'horizontal', style = 'block' } = config;
        const { width, height } = size;
        const count = items.length || 3;
        const shapes = [];
        const gap = Math.min(width, height) * 0.02;

        // Handle special styles
        if (style === 'hexagon') return hexagonLayout(option, config);
        if (style === 'picture') return pictureLayout(option, config);
        if (style === 'captioned') return captionedPicturesLayout(option, config);

        if (direction === 'vertical') {
            const itemHeight = (height - gap * (count + 1)) / count;
            const itemWidth = width - gap * 2;
            items.forEach((item, idx) => {
                shapes.push({
                    id: `item-${idx}`,
                    type: 'rect',
                    x: gap, y: gap + idx * (itemHeight + gap),
                    width: itemWidth, height: itemHeight,
                    text: item.text || item,
                    fill: getAccentColor(theme, idx),
                    stroke: theme.light1,
                    strokeWidth: 2,
                    textColor: theme.light1,
                    fontSize: Math.min(18, itemHeight * 0.3),
                    rx: 4, ry: 4
                });
            });
        } else {
            const itemWidth = (width - gap * (count + 1)) / count;
            const itemHeight = height - gap * 2;
            items.forEach((item, idx) => {
                shapes.push({
                    id: `item-${idx}`,
                    type: 'rect',
                    x: gap + idx * (itemWidth + gap), y: gap,
                    width: itemWidth, height: itemHeight,
                    text: item.text || item,
                    fill: getAccentColor(theme, idx),
                    stroke: theme.light1,
                    strokeWidth: 2,
                    textColor: theme.light1,
                    fontSize: Math.min(18, itemWidth * 0.12),
                    rx: 4, ry: 4
                });
            });
        }

        return { type: 'list', shapes, connectors: [], bounds: { x: 0, y: 0, width, height } };
    }

    // AlternatingHexagons Layout - Honeycomb pattern
    function hexagonLayout(option, config) {
        const { items, size, theme } = option;
        const { width, height } = size;
        const shapes = [];
        const count = Math.min(items.length, 6) || 4;

        // Hexagon dimensions
        const hexW = width * 0.28;
        const hexH = hexW * 0.866;
        const overlapX = hexW * 0.25;
        const overlapY = hexH * 0.25;

        // Honeycomb positions
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

        for (let i = 0; i < count; i++) {
            const item = items[i] || { text: `Item ${i + 1}` };
            const pos = positions[i];
            shapes.push({
                id: `hex-${i}`,
                type: 'hexagon',
                x: pos.x, y: pos.y,
                width: hexW, height: hexH,
                text: item.text || item,
                fill: getAccentColor(theme, i),
                stroke: theme.light1 || '#FFFFFF',
                strokeWidth: 2,
                textColor: theme.light1 || '#FFFFFF',
                fontSize: 14
            });
        }

        return { type: 'list', shapes, connectors: [], bounds: { x: 0, y: 0, width, height } };
    }

    // Picture Layout
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
            shapes.push({
                id: `pic-${idx}`,
                type: 'ellipse',
                cx: x + itemWidth / 2,
                cy: gap + picHeight / 2,
                rx: Math.min(itemWidth, picHeight) / 2 - gap,
                ry: Math.min(itemWidth, picHeight) / 2 - gap,
                text: '',
                fill: getAccentColor(theme, idx),
                stroke: theme.light1,
                strokeWidth: 2,
                isPlaceholder: true
            });
            shapes.push({
                id: `text-${idx}`,
                type: 'rect',
                x, y: gap + picHeight,
                width: itemWidth, height: textHeight,
                text: item.text || item,
                fill: 'transparent',
                stroke: 'none',
                textColor: theme.dark1,
                fontSize: 14
            });
        });
        return { type: 'list', shapes, connectors: [], bounds: { x: 0, y: 0, width, height } };
    }

    // Captioned Pictures Layout
    function captionedPicturesLayout(option, config) {
        const { items, size, theme } = option;
        const { width, height } = size;
        const count = items.length || 3;
        const shapes = [];
        const gap = width * 0.03;
        const itemWidth = (width - gap * (count + 1)) / count;
        const picHeight = height * 0.55;
        const captionHeight = height * 0.12;

        items.forEach((item, idx) => {
            const x = gap + idx * (itemWidth + gap);
            shapes.push({
                id: `pic-${idx}`,
                type: 'rect',
                x, y: gap,
                width: itemWidth, height: picHeight,
                text: '',
                fill: getAccentColor(theme, idx),
                stroke: theme.light1,
                strokeWidth: 2,
                rx: 4, ry: 4,
                isPlaceholder: true
            });
            shapes.push({
                id: `caption-${idx}`,
                type: 'rect',
                x, y: gap + picHeight + gap / 2,
                width: itemWidth, height: captionHeight,
                text: item.text || item,
                fill: 'transparent',
                stroke: 'none',
                textColor: theme.dark1,
                fontSize: 16,
                fontWeight: 'bold'
            });
        });
        return { type: 'list', shapes, connectors: [], bounds: { x: 0, y: 0, width, height } };
    }

    // ==================== Helper Functions ====================

    // Get color for indexed items (lists, pyramids, etc.) - uses childColors from scheme
    function getAccentColor(theme, idx) {
        const colors = theme.childColors || [theme.accent1, theme.accent2, theme.accent3, theme.accent4, theme.accent5, theme.accent6];
        return colors[idx % colors.length];
    }

    // Lighten a hex color by mixing with white
    function tintColor(hex, amount) {
        if (!hex || hex === 'transparent') return hex;
        const c = hex.replace('#', '');
        const r = parseInt(c.substring(0, 2), 16);
        const g = parseInt(c.substring(2, 4), 16);
        const b = parseInt(c.substring(4, 6), 16);
        const tr = Math.round(r + (255 - r) * amount);
        const tg = Math.round(g + (255 - g) * amount);
        const tb = Math.round(b + (255 - b) * amount);
        return `#${tr.toString(16).padStart(2, '0')}${tg.toString(16).padStart(2, '0')}${tb.toString(16).padStart(2, '0')}`;
    }

    function buildTree(items) {
        if (!items || items.length === 0) {
            return [{ id: 'root', text: 'Root', children: [] }];
        }
        if (items[0].children) return items;

        const map = new Map();
        const roots = [];
        items.forEach((item, idx) => {
            const node = { id: item.id || `node-${idx}`, text: item.text || item, children: [], _parent: null };
            map.set(node.id, node);
        });
        items.forEach((item, idx) => {
            const node = map.get(item.id || `node-${idx}`);
            if (item.parentId && map.has(item.parentId)) {
                const parent = map.get(item.parentId);
                parent.children.push(node);
                node._parent = parent;
            } else {
                roots.push(node);
            }
        });
        return roots.length > 0 ? roots : [{ id: 'root', text: 'Root', children: [] }];
    }

    function getLevels(tree) {
        const levels = [];
        function traverse(nodes, level) {
            if (!nodes || nodes.length === 0) return;
            if (!levels[level]) levels[level] = [];
            nodes.forEach(node => {
                levels[level].push(node);
                if (node.children?.length > 0) traverse(node.children, level + 1);
            });
        }
        traverse(tree, 0);
        return levels;
    }

    // ==================== Types Registry ====================

    const SMARTART_TYPES = {
        'pyramid': { name: '基础金字塔', layout: pyramidLayout },
        'pyramid-list': { name: '金字塔列表', layout: (opt) => pyramidLayout(opt, { listStyle: true }) },
        'pyramid-inverted': { name: '倒漏斗', layout: (opt) => pyramidLayout(opt, { inverted: true }) },
        'pyramid-segmented': { name: '分段金字塔', layout: (opt) => pyramidLayout(opt, { segmented: true }) },
        'matrix': { name: '基础矩阵', layout: matrixLayout },
        'matrix-titled': { name: '标题矩阵', layout: (opt) => matrixLayout(opt, { titled: true }) },
        'matrix-cycle': { name: '循环矩阵', layout: (opt) => matrixLayout(opt, { cycle: true }) },
        'cycle': { name: '基础循环', layout: cycleLayout },
        'cycle-segmented': { name: '分段循环', layout: (opt) => cycleLayout(opt, { segmented: true }) },
        'chevron': { name: '基础流程', layout: chevronLayout },
        'arrow-process': { name: '流程箭头', layout: (opt) => chevronLayout(opt, { style: 'arrow' }) },
        'descending-process': { name: '下降流程', layout: (opt) => chevronLayout(opt, { style: 'descending' }) },
        'hierarchy': { name: '组织架构', layout: hierarchyLayout },
        'radial': { name: '发散图', layout: radialLayout },
        'list': { name: '基础列表', layout: listLayout },
        'list-vertical': { name: '垂直列表', layout: (opt) => listLayout(opt, { direction: 'vertical' }) },
        'hexagon-alternating': { name: '交替六边形', layout: (opt) => listLayout(opt, { style: 'hexagon' }) },
        'picture-accent': { name: '突出图片', layout: (opt) => listLayout(opt, { style: 'picture' }) },
        'picture-captioned': { name: '带标题图片', layout: (opt) => listLayout(opt, { style: 'captioned' }) }
    };

    // ==================== SVG Renderer ====================

    function renderSVG(data, option) {
        const { shapes, connectors } = data;
        const { width, height } = option.size;

        const svg = createSVGElement('svg', { width, height, viewBox: `0 0 ${width} ${height}`, class: 'smartart-svg' });

        // Add arrowhead marker definition
        const defs = createSVGElement('defs');
        const marker = createSVGElement('marker', {
            id: 'arrowhead', markerWidth: 10, markerHeight: 7,
            refX: 9, refY: 3.5, orient: 'auto'
        });
        const polygon = createSVGElement('polygon', {
            points: '0 0, 10 3.5, 0 7', fill: '#666'
        });
        marker.appendChild(polygon);
        defs.appendChild(marker);
        svg.appendChild(defs);

        connectors.forEach(conn => {
            const el = renderConnector(conn);
            if (el) svg.appendChild(el);
        });

        shapes.forEach(shape => {
            const el = renderShape(shape);
            if (el) svg.appendChild(el);
        });

        // Unify font sizes after DOM insertion
        requestAnimationFrame(() => unifyFontSizes(svg));

        return svg;
    }

    function unifyFontSizes(svg) {
        const textEls = svg.querySelectorAll('.smartart-text-editable');
        if (textEls.length === 0) return;

        const maxFs = 18, minFs = 10;
        let unified = maxFs;

        // Find minimum required font size
        textEls.forEach(el => {
            const wrap = el.parentElement;
            if (!wrap) return;
            let fs = maxFs;
            el.style.fontSize = fs + 'px';
            while (fs > minFs && (el.scrollHeight > wrap.clientHeight || el.scrollWidth > wrap.clientWidth)) {
                fs--;
                el.style.fontSize = fs + 'px';
            }
            if (fs < unified) unified = fs;
        });

        // Apply unified size to all
        textEls.forEach(el => el.style.fontSize = unified + 'px');
        svg.dataset.unifiedFontSize = unified;
    }

    function renderShape(shape) {
        const g = createSVGElement('g', { id: shape.id, class: 'smartart-shape' });
        let shapeEl;

        switch (shape.type) {
            case 'rect': case 'roundRect': shapeEl = renderRect(shape); break;
            case 'ellipse': shapeEl = renderEllipse(shape); break;
            case 'trapezoid': shapeEl = renderTrapezoid(shape); break;
            case 'chevron': shapeEl = renderChevron(shape); break;
            case 'arrow-right': shapeEl = renderArrowRight(shape); break;
            case 'pie': shapeEl = renderPie(shape); break;
            case 'hexagon': shapeEl = renderHexagon(shape); break;
            case 'triangle': shapeEl = renderTriangle(shape); break;
            case 'line': shapeEl = renderLine(shape); break;
            case 'text': break; // text-only shape, no geometry
            default: shapeEl = renderRect(shape);
        }

        if (shapeEl) g.appendChild(shapeEl);
        if (shape.text || shape.type === 'text') {
            const textEl = renderText(shape);
            if (textEl) g.appendChild(textEl);
        }
        return g;
    }

    function renderRect(shape) {
        return createSVGElement('rect', {
            x: shape.x, y: shape.y, width: shape.width, height: shape.height,
            fill: shape.fill || '#4472C4', stroke: shape.stroke || 'none',
            'stroke-width': shape.strokeWidth || 0, rx: shape.rx || 0, ry: shape.ry || 0
        });
    }

    function renderEllipse(shape) {
        return createSVGElement('ellipse', {
            cx: shape.cx, cy: shape.cy, rx: shape.rx, ry: shape.ry,
            fill: shape.fill || '#4472C4', stroke: shape.stroke || 'none', 'stroke-width': shape.strokeWidth || 0
        });
    }

    function renderTrapezoid(shape) {
        const { x, y, width, height, topWidthRatio = 1, bottomWidthRatio = 1 } = shape;
        const topWidth = width * topWidthRatio;
        const bottomWidth = width * bottomWidthRatio;
        const topOffset = (width - topWidth) / 2;
        const bottomOffset = (width - bottomWidth) / 2;
        const points = [
            `${x + topOffset},${y}`, `${x + topOffset + topWidth},${y}`,
            `${x + bottomOffset + bottomWidth},${y + height}`, `${x + bottomOffset},${y + height}`
        ].join(' ');
        return createSVGElement('polygon', {
            points, fill: shape.fill || '#4472C4', stroke: shape.stroke || 'none', 'stroke-width': shape.strokeWidth || 0
        });
    }

    function renderChevron(shape) {
        const { x, y, width, height, pointDepth = width * 0.15, rotation = 0 } = shape;
        const pd = pointDepth;
        const points = [
            `${x + pd},${y}`, `${x + width - pd},${y}`, `${x + width},${y + height / 2}`,
            `${x + width - pd},${y + height}`, `${x + pd},${y + height}`, `${x},${y + height / 2}`
        ].join(' ');
        const polygon = createSVGElement('polygon', {
            points, fill: shape.fill || '#4472C4', stroke: shape.stroke || 'none', 'stroke-width': shape.strokeWidth || 0
        });
        if (rotation) {
            polygon.setAttribute('transform', `rotate(${rotation} ${x + width / 2} ${y + height / 2})`);
        }
        return polygon;
    }

    function renderArrowRight(shape) {
        const { x, y, width, height } = shape;
        const arrowWidth = width * 0.3;
        const bodyHeight = height * 0.6;
        const bodyY = y + (height - bodyHeight) / 2;
        const points = [
            `${x},${bodyY}`, `${x + width - arrowWidth},${bodyY}`, `${x + width - arrowWidth},${y}`,
            `${x + width},${y + height / 2}`, `${x + width - arrowWidth},${y + height}`,
            `${x + width - arrowWidth},${bodyY + bodyHeight}`, `${x},${bodyY + bodyHeight}`
        ].join(' ');
        return createSVGElement('polygon', {
            points, fill: shape.fill || '#4472C4', stroke: shape.stroke || 'none', 'stroke-width': shape.strokeWidth || 0
        });
    }

    function renderPie(shape) {
        const { cx, cy, innerRadius, outerRadius, startAngle, endAngle } = shape;
        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;
        const x1 = cx + Math.cos(startRad) * outerRadius;
        const y1 = cy + Math.sin(startRad) * outerRadius;
        const x2 = cx + Math.cos(endRad) * outerRadius;
        const y2 = cy + Math.sin(endRad) * outerRadius;
        const x3 = cx + Math.cos(endRad) * innerRadius;
        const y3 = cy + Math.sin(endRad) * innerRadius;
        const x4 = cx + Math.cos(startRad) * innerRadius;
        const y4 = cy + Math.sin(startRad) * innerRadius;
        const largeArc = endAngle - startAngle > 180 ? 1 : 0;
        const d = [
            `M ${x1} ${y1}`, `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
            `L ${x3} ${y3}`, `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`, 'Z'
        ].join(' ');
        return createSVGElement('path', {
            d, fill: shape.fill || '#4472C4', stroke: shape.stroke || 'none', 'stroke-width': shape.strokeWidth || 0
        });
    }

    function renderText(shape) {
        // Use foreignObject for auto-fit text on shapes with dimensions
        if (shape.width && shape.height && shape.type !== 'ellipse' && shape.type !== 'pie' && shape.type !== 'text') {
            return renderAutoFitText(shape);
        }

        let x, y;
        if (shape.type === 'text') {
            // Text-only shape with direct x, y coordinates
            x = shape.x; y = shape.y;
        } else if (shape.type === 'ellipse') { x = shape.cx; y = shape.cy; }
        else if (shape.type === 'pie') {
            const midAngle = ((shape.startAngle + shape.endAngle) / 2) * Math.PI / 180;
            const midRadius = (shape.innerRadius + shape.outerRadius) / 2;
            x = shape.cx + Math.cos(midAngle) * midRadius;
            y = shape.cy + Math.sin(midAngle) * midRadius;
        } else { x = shape.x + shape.width / 2; y = shape.y + shape.height / 2; }

        const text = createSVGElement('text', {
            x, y, fill: shape.textColor || '#FFFFFF', 'font-size': shape.fontSize || 14,
            'font-family': 'Inter, sans-serif',
            'text-anchor': shape.textAnchor || 'middle',
            'dominant-baseline': shape.dominantBaseline || 'central'
        });
        text.textContent = shape.text;
        return text;
    }

    function renderLine(shape) {
        return createSVGElement('line', {
            x1: shape.x1, y1: shape.y1, x2: shape.x2, y2: shape.y2,
            stroke: shape.stroke || '#FFFFFF', 'stroke-width': shape.strokeWidth || 1
        });
    }

    function renderAutoFitText(shape) {
        const padding = 8;
        const fo = createSVGElement('foreignObject', {
            x: shape.x + padding, y: shape.y,
            width: shape.width - padding * 2, height: shape.height
        });
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;overflow:hidden;';
        const div = document.createElement('div');
        div.className = 'smartart-text-editable';
        div.setAttribute('contenteditable', 'true');
        div.setAttribute('data-shape-id', shape.id);
        div.style.cssText = `max-width:100%;max-height:100%;text-align:center;font-family:Inter,sans-serif;
            color:${shape.textColor||'#FFF'};font-size:${shape.fontSize||14}px;line-height:1.3;
            word-wrap:break-word;word-break:break-word;outline:none;cursor:text;`;
        div.textContent = shape.text;
        div.addEventListener('input', (e) => {
            div.dispatchEvent(new CustomEvent('smartart-text-change', {
                bubbles: true, detail: { shapeId: shape.id, text: e.target.textContent }
            }));
            const svg = div.closest('svg');
            if (svg) unifyFontSizes(svg);
        });
        div.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); div.blur(); } });
        wrapper.appendChild(div);
        fo.appendChild(wrapper);
        // Font sizing handled by unifyFontSizes after all shapes render
        return fo;
    }

    function renderHexagon(shape) {
        const { x, y, width, height } = shape;
        const cx = x + width / 2;
        const cy = y + height / 2;
        const points = [];
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 2;
            points.push(`${cx + (width / 2) * Math.cos(angle)},${cy + (height / 2) * Math.sin(angle)}`);
        }
        return createSVGElement('polygon', {
            points: points.join(' '),
            fill: shape.fill || '#4472C4',
            stroke: shape.stroke || 'none',
            'stroke-width': shape.strokeWidth || 0
        });
    }

    function renderTriangle(shape) {
        const { x, y, width, height, inverted } = shape;
        let points;
        if (inverted) {
            // Inverted triangle: point at bottom, wide at top
            points = [
                `${x},${y}`,                  // top left
                `${x + width},${y}`,          // top right
                `${x + width / 2},${y + height}` // apex (bottom center)
            ].join(' ');
        } else {
            // Normal triangle: point at top, wide at bottom
            points = [
                `${x + width / 2},${y}`,      // apex (top center)
                `${x + width},${y + height}`, // bottom right
                `${x},${y + height}`          // bottom left
            ].join(' ');
        }
        return createSVGElement('polygon', {
            points,
            fill: shape.fill || '#4472C4',
            stroke: shape.stroke || 'none',
            'stroke-width': shape.strokeWidth || 0
        });
    }

    function renderConnector(conn) {
        if (conn.type === 'line') {
            return createSVGElement('line', {
                x1: conn.x1, y1: conn.y1, x2: conn.x2, y2: conn.y2,
                stroke: conn.stroke || '#666', 'stroke-width': conn.strokeWidth || 2
            });
        }
        if (conn.type === 'curvedArrow') {
            return renderCurvedArrow(conn);
        }
        return null;
    }

    function renderCurvedArrow(conn) {
        const { cx, cy, radius, startAngle, endAngle, stroke } = conn;
        const startRad = ((startAngle + 15) * Math.PI) / 180;
        const endRad = ((endAngle - 15) * Math.PI) / 180;
        const x1 = cx + Math.cos(startRad) * radius;
        const y1 = cy + Math.sin(startRad) * radius;
        const x2 = cx + Math.cos(endRad) * radius;
        const y2 = cy + Math.sin(endRad) * radius;
        const d = `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`;

        const g = createSVGElement('g');
        const path = createSVGElement('path', {
            d, fill: 'none',
            stroke: stroke || '#666',
            'stroke-width': 2,
            'marker-end': 'url(#arrowhead)'
        });
        g.appendChild(path);
        return g;
    }

    function createSVGElement(tag, attrs = {}) {
        const el = document.createElementNS(SVG_NS, tag);
        Object.entries(attrs).forEach(([key, value]) => {
            if (value !== undefined && value !== null) el.setAttribute(key, value);
        });
        return el;
    }

    // ==================== OOXML Exporter ====================

    function toOOXML(option, data) {
        const { type, items, theme } = option;
        const { shapes, connectors } = data;

        return {
            smartArtType: type,
            items: items.map((item, idx) => ({
                id: `item-${idx}`,
                text: typeof item === 'string' ? item : item.text,
                children: item.children || []
            })),
            shapes: shapes.map(shape => ({
                id: shape.id,
                prst: shape.type === 'trapezoid' ? 'trapezoid' : shape.type === 'ellipse' ? 'ellipse' : 'rect',
                off: { x: Math.round((shape.x || 0) * EMU_PER_PX), y: Math.round((shape.y || 0) * EMU_PER_PX) },
                ext: { cx: Math.round((shape.width || 100) * EMU_PER_PX), cy: Math.round((shape.height || 100) * EMU_PER_PX) },
                text: shape.text || '',
                fill: shape.fill
            })),
            theme: {
                parentColor: theme.parentColor || theme.accent1,
                childColors: theme.childColors || [theme.accent2, theme.accent3, theme.accent4, theme.accent5, theme.accent6]
            }
        };
    }

    // ==================== SmartArt Class ====================

    class SmartArt {
        constructor(container) {
            this.container = typeof container === 'string' ? document.querySelector(container) : container;
            this.option = null;
            this.data = null;
        }

        setOption(option) {
            this.option = {
                type: option.type || 'pyramid',
                items: option.items || [],
                theme: option.theme || this._getDefaultTheme(),
                size: option.size || this._getContainerSize()
            };
            this._render();
            return this;
        }

        setData(items) {
            if (this.option) { this.option.items = items; this._render(); }
            return this;
        }

        getOption() { return this.option; }

        toOOXML() {
            if (!this.option) return null;
            return toOOXML(this.option, this.data);
        }

        toJSON() {
            return { type: this.option?.type, items: this.option?.items, theme: this.option?.theme };
        }

        _render() {
            if (!this.container || !this.option) return;
            const typeConfig = SMARTART_TYPES[this.option.type];
            if (!typeConfig) { console.error(`Unknown SmartArt type: ${this.option.type}`); return; }
            this.data = typeConfig.layout(this.option);
            const svg = renderSVG(this.data, this.option);
            this.container.innerHTML = '';
            this.container.appendChild(svg);
        }

        _getContainerSize() {
            if (!this.container) return { width: 800, height: 600 };
            const rect = this.container.getBoundingClientRect();
            return { width: rect.width || 800, height: rect.height || 600 };
        }

        _getDefaultTheme() {
            return {
                accent1: '#4472C4', accent2: '#ED7D31', accent3: '#A5A5A5',
                accent4: '#FFC000', accent5: '#5B9BD5', accent6: '#70AD47',
                light1: '#FFFFFF', dark1: '#000000'
            };
        }

        resize() {
            if (this.option) { this.option.size = this._getContainerSize(); this._render(); }
            return this;
        }

        dispose() {
            if (this.container) this.container.innerHTML = '';
            this.option = null; this.data = null;
        }
    }

    SmartArt.init = function(container) { return new SmartArt(container); };
    SmartArt.getTypes = function() { return Object.keys(SMARTART_TYPES).map(key => ({ key, name: SMARTART_TYPES[key].name })); };
    SmartArt.registerType = function(name, config) { SMARTART_TYPES[name] = config; };

    // Export
    global.SmartArt = SmartArt;

})(typeof window !== 'undefined' ? window : this);
