/**
 * SVG Renderer for SmartArt shapes
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

export function renderSVG(data, option) {
    const { shapes, connectors, bounds } = data;
    const { width, height } = option.size;

    const svg = createSVGElement('svg', {
        width: width,
        height: height,
        viewBox: `0 0 ${width} ${height}`,
        class: 'smartart-svg'
    });

    // Add arrowhead marker definition
    const defs = createSVGElement('defs');
    const marker = createSVGElement('marker', {
        id: 'arrowhead',
        markerWidth: 10,
        markerHeight: 7,
        refX: 9,
        refY: 3.5,
        orient: 'auto'
    });
    const polygon = createSVGElement('polygon', {
        points: '0 0, 10 3.5, 0 7',
        fill: '#666'
    });
    marker.appendChild(polygon);
    defs.appendChild(marker);
    svg.appendChild(defs);

    // Render connectors first (behind shapes)
    connectors.forEach(conn => {
        const el = renderConnector(conn);
        if (el) svg.appendChild(el);
    });

    // Render shapes
    shapes.forEach(shape => {
        const el = renderShape(shape);
        if (el) svg.appendChild(el);
    });

    // After DOM insertion, unify font sizes across all text boxes
    requestAnimationFrame(() => {
        unifyFontSizes(svg);
    });

    return svg;
}

/**
 * Unify font sizes across all editable text boxes
 * Find the minimum required font size and apply to all
 */
function unifyFontSizes(svg) {
    const textEls = svg.querySelectorAll('.smartart-text-editable');
    if (textEls.length === 0) return;

    const maxFontSize = 18;
    const minFontSize = 10;
    let unifiedSize = maxFontSize;

    // First pass: find minimum required font size
    textEls.forEach(textEl => {
        const wrapper = textEl.parentElement;
        if (!wrapper) return;

        let fs = maxFontSize;
        textEl.style.fontSize = fs + 'px';

        const cH = wrapper.clientHeight;
        const cW = wrapper.clientWidth;

        while (fs > minFontSize) {
            if (textEl.scrollHeight <= cH && textEl.scrollWidth <= cW) break;
            fs--;
            textEl.style.fontSize = fs + 'px';
        }

        if (fs < unifiedSize) {
            unifiedSize = fs;
        }
    });

    // Second pass: apply unified font size to all
    textEls.forEach(textEl => {
        textEl.style.fontSize = unifiedSize + 'px';
    });

    // Store unified size for export
    svg.dataset.unifiedFontSize = unifiedSize;
}

function renderShape(shape) {
    const g = createSVGElement('g', {
        id: shape.id,
        class: 'smartart-shape'
    });

    let shapeEl;
    switch (shape.type) {
        case 'rect':
        case 'roundRect':
            shapeEl = renderRect(shape);
            break;
        case 'ellipse':
            shapeEl = renderEllipse(shape);
            break;
        case 'trapezoid':
            shapeEl = renderTrapezoid(shape);
            break;
        case 'chevron':
            shapeEl = renderChevron(shape);
            break;
        case 'arrow-right':
            shapeEl = renderArrowRight(shape);
            break;
        case 'hexagon':
            shapeEl = renderHexagon(shape);
            break;
        case 'pie':
            shapeEl = renderPie(shape);
            break;
        case 'triangle':
            shapeEl = renderTriangle(shape);
            break;
        case 'trapezoidTextbox':
            shapeEl = renderTrapezoidTextbox(shape);
            break;
        default:
            shapeEl = renderRect(shape);
    }

    if (shapeEl) g.appendChild(shapeEl);

    // Add text if present
    if (shape.text) {
        const textEl = renderText(shape);
        if (textEl) g.appendChild(textEl);
    }

    return g;
}

function renderRect(shape) {
    return createSVGElement('rect', {
        x: shape.x,
        y: shape.y,
        width: shape.width,
        height: shape.height,
        fill: shape.fill || '#4472C4',
        stroke: shape.stroke || 'none',
        'stroke-width': shape.strokeWidth || 0,
        rx: shape.rx || 0,
        ry: shape.ry || 0
    });
}

function renderEllipse(shape) {
    return createSVGElement('ellipse', {
        cx: shape.cx,
        cy: shape.cy,
        rx: shape.rx,
        ry: shape.ry,
        fill: shape.fill || '#4472C4',
        stroke: shape.stroke || 'none',
        'stroke-width': shape.strokeWidth || 0
    });
}

function renderTrapezoid(shape) {
    const { x, y, width, height, topWidthRatio = 0, invertedTrapezoid = false } = shape;

    let points;
    if (invertedTrapezoid) {
        // Inverted: wide top, narrow bottom
        const bottomWidth = width * topWidthRatio;
        const bottomOffset = (width - bottomWidth) / 2;
        points = [
            `${x},${y}`,                              // top-left (full width)
            `${x + width},${y}`,                      // top-right (full width)
            `${x + bottomOffset + bottomWidth},${y + height}`,  // bottom-right
            `${x + bottomOffset},${y + height}`       // bottom-left
        ].join(' ');
    } else {
        // Normal: narrow top, wide bottom
        const topWidth = width * topWidthRatio;
        const topOffset = (width - topWidth) / 2;
        points = [
            `${x + topOffset},${y}`,
            `${x + topOffset + topWidth},${y}`,
            `${x + width},${y + height}`,
            `${x},${y + height}`
        ].join(' ');
    }

    return createSVGElement('polygon', {
        points,
        fill: shape.fill || '#4472C4',
        stroke: shape.stroke || 'none',
        'stroke-width': shape.strokeWidth || 0
    });
}

function renderChevron(shape) {
    const { x, y, width, height, pointDepth = width * 0.15, rotation = 0 } = shape;
    const pd = pointDepth;

    // Chevron shape: left indent, right point
    const points = [
        `${x + pd},${y}`,
        `${x + width - pd},${y}`,
        `${x + width},${y + height / 2}`,
        `${x + width - pd},${y + height}`,
        `${x + pd},${y + height}`,
        `${x},${y + height / 2}`
    ].join(' ');

    const polygon = createSVGElement('polygon', {
        points,
        fill: shape.fill || '#4472C4',
        stroke: shape.stroke || 'none',
        'stroke-width': shape.strokeWidth || 0
    });

    if (rotation) {
        const cx = x + width / 2;
        const cy = y + height / 2;
        polygon.setAttribute('transform', `rotate(${rotation} ${cx} ${cy})`);
    }

    return polygon;
}

function renderArrowRight(shape) {
    const { x, y, width, height } = shape;
    const arrowWidth = width * 0.3;
    const bodyHeight = height * 0.6;
    const bodyY = y + (height - bodyHeight) / 2;

    const points = [
        `${x},${bodyY}`,
        `${x + width - arrowWidth},${bodyY}`,
        `${x + width - arrowWidth},${y}`,
        `${x + width},${y + height / 2}`,
        `${x + width - arrowWidth},${y + height}`,
        `${x + width - arrowWidth},${bodyY + bodyHeight}`,
        `${x},${bodyY + bodyHeight}`
    ].join(' ');

    return createSVGElement('polygon', {
        points,
        fill: shape.fill || '#4472C4',
        stroke: shape.stroke || 'none',
        'stroke-width': shape.strokeWidth || 0
    });
}

function renderHexagon(shape) {
    const { x, y, width, height } = shape;
    const w4 = width / 4;

    const points = [
        `${x + w4},${y}`,
        `${x + width - w4},${y}`,
        `${x + width},${y + height / 2}`,
        `${x + width - w4},${y + height}`,
        `${x + w4},${y + height}`,
        `${x},${y + height / 2}`
    ].join(' ');

    return createSVGElement('polygon', {
        points,
        fill: shape.fill || '#4472C4',
        stroke: shape.stroke || 'none',
        'stroke-width': shape.strokeWidth || 0
    });
}

function renderTriangle(shape) {
    const { x, y, width, height, inverted = false } = shape;

    let points;
    if (inverted) {
        // Inverted triangle: point at bottom, wide at top
        points = [
            `${x},${y}`,                  // top-left
            `${x + width},${y}`,          // top-right
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

/**
 * Trapezoid textbox: left edge is slanted (follows pyramid), right edge is vertical
 * Used for inverted pyramid text boxes that align with the pyramid edge
 */
function renderTrapezoidTextbox(shape) {
    const { topLeftX, bottomLeftX, rightX, y, height } = shape;

    // Four corners: top-left, top-right, bottom-right, bottom-left
    const points = [
        `${topLeftX},${y}`,           // top-left (follows pyramid top-right)
        `${rightX},${y}`,             // top-right (fixed)
        `${rightX},${y + height}`,    // bottom-right (fixed)
        `${bottomLeftX},${y + height}` // bottom-left (follows pyramid bottom-right)
    ].join(' ');

    return createSVGElement('polygon', {
        points,
        fill: shape.fill || '#FFFFFF',
        stroke: shape.stroke || '#CCCCCC',
        'stroke-width': shape.strokeWidth || 1
    });
}

/**
 * Text rendering for trapezoid textbox
 * Uses the larger top width for text area (left-aligned)
 */
function renderTrapezoidTextboxText(shape) {
    const { topLeftX, rightX, y, height } = shape;
    const padding = 8;
    const width = rightX - topLeftX;

    const fo = createSVGElement('foreignObject', {
        x: topLeftX + padding,
        y: y + padding,
        width: width - padding * 2,
        height: height - padding * 2
    });

    const hAlign = shape.textAlign || 'left';
    const vAlign = shape.textVAlign || 'top';
    const justifyMap = { left: 'flex-start', center: 'center', right: 'flex-end' };
    const alignMap = { top: 'flex-start', center: 'center', bottom: 'flex-end' };

    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
        width: 100%;
        height: 100%;
        display: flex;
        align-items: ${alignMap[vAlign] || 'flex-start'};
        justify-content: ${justifyMap[hAlign] || 'flex-start'};
        overflow: hidden;
    `;

    const div = document.createElement('div');
    div.className = 'smartart-text-editable';
    div.setAttribute('contenteditable', 'true');
    div.setAttribute('data-shape-id', shape.id);
    div.style.cssText = `
        max-width: 100%;
        max-height: 100%;
        text-align: ${hAlign};
        font-family: Inter, sans-serif;
        color: ${shape.textColor || '#333333'};
        font-size: ${shape.fontSize || 14}px;
        line-height: 1.3;
        word-wrap: break-word;
        word-break: break-word;
        outline: none;
        cursor: text;
    `;
    div.textContent = shape.text;

    div.addEventListener('input', (e) => {
        const newText = e.target.textContent;
        div.dispatchEvent(new CustomEvent('smartart-text-change', {
            bubbles: true,
            detail: { shapeId: shape.id, text: newText }
        }));
    });

    div.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            div.blur();
        }
    });

    wrapper.appendChild(div);
    fo.appendChild(wrapper);
    return fo;
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
        `M ${x1} ${y1}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
        `L ${x3} ${y3}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
        'Z'
    ].join(' ');

    return createSVGElement('path', {
        d,
        fill: shape.fill || '#4472C4',
        stroke: shape.stroke || 'none',
        'stroke-width': shape.strokeWidth || 0
    });
}

function renderText(shape) {
    // For shapes with width/height, use foreignObject for auto-fit text
    if (shape.width && shape.height && shape.type !== 'ellipse' && shape.type !== 'pie') {
        return renderAutoFitText(shape);
    }

    // Special handling for trapezoidTextbox (no width property)
    if (shape.type === 'trapezoidTextbox') {
        return renderTrapezoidTextboxText(shape);
    }

    let x, y;
    // Calculate center based on shape type
    if (shape.type === 'ellipse') {
        x = shape.cx;
        y = shape.cy;
    } else if (shape.type === 'pie') {
        const midAngle = ((shape.startAngle + shape.endAngle) / 2) * Math.PI / 180;
        const midRadius = (shape.innerRadius + shape.outerRadius) / 2;
        x = shape.cx + Math.cos(midAngle) * midRadius;
        y = shape.cy + Math.sin(midAngle) * midRadius;
    } else {
        x = shape.x + shape.width / 2;
        y = shape.y + shape.height / 2;
    }

    const text = createSVGElement('text', {
        x,
        y,
        fill: shape.textColor || '#FFFFFF',
        'font-size': shape.fontSize || 14,
        'font-family': 'Inter, sans-serif',
        'text-anchor': 'middle',
        'dominant-baseline': 'central'
    });

    text.textContent = shape.text;
    return text;
}

/**
 * Render text with auto-fit using foreignObject
 * Text will wrap and shrink font if needed
 * Supports inline editing via contenteditable
 * shape.textAlign: 'center' (default), 'left', 'right'
 * shape.textVAlign: 'center' (default), 'top', 'bottom'
 */
function renderAutoFitText(shape) {
    const padding = 8;
    const fo = createSVGElement('foreignObject', {
        x: shape.x + padding,
        y: shape.y + (shape.textVAlign === 'top' ? padding : 0),
        width: shape.width - padding * 2,
        height: shape.height - (shape.textVAlign === 'top' ? padding : 0)
    });

    // Text alignment options
    const hAlign = shape.textAlign || 'center';
    const vAlign = shape.textVAlign || 'center';
    const justifyMap = { left: 'flex-start', center: 'center', right: 'flex-end' };
    const alignMap = { top: 'flex-start', center: 'center', bottom: 'flex-end' };

    // Outer container for alignment
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
        width: 100%;
        height: 100%;
        display: flex;
        align-items: ${alignMap[vAlign] || 'center'};
        justify-content: ${justifyMap[hAlign] || 'center'};
        overflow: hidden;
    `;

    // Inner editable text
    const div = document.createElement('div');
    div.className = 'smartart-text-editable';
    div.setAttribute('contenteditable', 'true');
    div.setAttribute('data-shape-id', shape.id);
    div.style.cssText = `
        max-width: 100%;
        max-height: 100%;
        text-align: ${hAlign};
        font-family: Inter, sans-serif;
        color: ${shape.textColor || '#FFFFFF'};
        font-size: ${shape.fontSize || 14}px;
        line-height: 1.3;
        word-wrap: break-word;
        word-break: break-word;
        outline: none;
        cursor: text;
    `;
    div.textContent = shape.text;

    // Handle input to update state
    div.addEventListener('input', (e) => {
        const newText = e.target.textContent;
        div.dispatchEvent(new CustomEvent('smartart-text-change', {
            bubbles: true,
            detail: { shapeId: shape.id, text: newText }
        }));
        // Re-unify all font sizes after edit
        const svg = div.closest('svg');
        if (svg) unifyFontSizes(svg);
    });

    // Prevent newlines, blur on Enter
    div.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            div.blur();
        }
    });

    wrapper.appendChild(div);
    fo.appendChild(wrapper);

    // Font sizing handled by unifyFontSizes after all shapes render
    return fo;
}


function renderConnector(conn) {
    switch (conn.type) {
        case 'line':
            return createSVGElement('line', {
                x1: conn.x1,
                y1: conn.y1,
                x2: conn.x2,
                y2: conn.y2,
                stroke: conn.stroke || '#666',
                'stroke-width': conn.strokeWidth || 2
            });
        case 'circle':
            return createSVGElement('circle', {
                cx: conn.cx,
                cy: conn.cy,
                r: conn.radius,
                fill: conn.fill || 'none',
                stroke: conn.stroke || '#666',
                'stroke-width': conn.strokeWidth || 2
            });
        case 'arc':
            return renderArc(conn);
        case 'biArrow':
            return renderBiArrow(conn);
        case 'thickCurvedArrow':
            return renderThickCurvedArrow(conn);
        case 'curvedArrow':
            return renderCurvedArrow(conn);
        case 'arrow':
            return renderArrowConnector(conn);
        default:
            return null;
    }
}

function renderArrowConnector(conn) {
    const { x, y, size = 12, rotation = 0, fill = '#666', style } = conn;

    if (style === 'textCycleSvg') {
        // Preserve original self-intersecting shape from Picture1.svg.
        const pathPoints = [
            [0.0, 0.4977],
            [0.3303, 0.1674],
            [0.1629, 0.0],
            [0.9118, 0.0883],
            [1.0, 0.8373],
            [0.8326, 0.6699],
            [0.5023, 1.0]
        ];
        const d = pathPoints
            .map(([px, py], idx) => `${idx === 0 ? 'M' : 'L'} ${x + px * size} ${y + py * size}`)
            .join(' ') + ' Z';

        const path = createSVGElement('path', {
            d,
            fill,
            'fill-rule': 'evenodd'
        });

        let adjustedRotation = rotation + 45;
        if (
            Number.isFinite(conn.fromX) &&
            Number.isFinite(conn.fromY) &&
            Number.isFinite(conn.toX) &&
            Number.isFinite(conn.toY)
        ) {
            const cx = x + size / 2;
            const cy = y + size / 2;
            const tipCandidates = [
                [0.1629, 0.0],
                [1.0, 0.8373]
            ];

            const rotatePoint = (deg, px, py) => {
                const rad = deg * Math.PI / 180;
                const vx = x + px * size - cx;
                const vy = y + py * size - cy;
                return {
                    x: cx + vx * Math.cos(rad) - vy * Math.sin(rad),
                    y: cy + vx * Math.sin(rad) + vy * Math.cos(rad)
                };
            };

            const scoreRotation = (deg) => {
                let best = Infinity;
                for (let i = 0; i < tipCandidates.length; i += 1) {
                    const [px, py] = tipCandidates[i];
                    const tip = rotatePoint(deg, px, py);
                    const dTo = Math.hypot(tip.x - conn.toX, tip.y - conn.toY);
                    const dFrom = Math.hypot(tip.x - conn.fromX, tip.y - conn.fromY);
                    best = Math.min(best, dTo - dFrom);
                }
                return best;
            };

            const directScore = scoreRotation(adjustedRotation);
            const flippedScore = scoreRotation(adjustedRotation + 180);
            if (flippedScore < directScore) {
                adjustedRotation += 180;
            }
        }

        if (adjustedRotation) {
            path.setAttribute('transform', `rotate(${adjustedRotation} ${x + size / 2} ${y + size / 2})`);
        }
        return path;
    }

    const width = size * 1.42;
    const height = size * 0.9;
    const originX = x + (size - width) / 2;
    const originY = y + (size - height) / 2;
    const midY = originY + height / 2;
    const notchX = originX + width * 0.2;
    const bodyEndX = originX + width * 0.68;
    const tipX = originX + width;
    const shoulder = height * 0.17;
    const notchDepth = height * 0.2;
    const points = [
        `${notchX},${originY}`,
        `${bodyEndX},${originY}`,
        `${bodyEndX},${midY - shoulder}`,
        `${tipX},${midY}`,
        `${bodyEndX},${midY + shoulder}`,
        `${bodyEndX},${originY + height}`,
        `${notchX},${originY + height}`,
        `${notchX},${midY + notchDepth}`,
        `${originX},${midY}`,
        `${notchX},${midY - notchDepth}`
    ].join(' ');

    const polygon = createSVGElement('polygon', {
        points,
        fill
    });

    if (rotation) {
        polygon.setAttribute('transform', `rotate(${rotation} ${x + size / 2} ${y + size / 2})`);
    }

    return polygon;
}

function renderThickCurvedArrow(conn) {
    const { cx, cy, outerR, innerR, startAngle, endAngle, fill } = conn;
    const midR = (outerR + innerR) / 2;
    const thickness = outerR - innerR;
    const headDeg = 10;
    const headExtend = thickness * 0.5;
    const bodyEnd = endAngle - headDeg;

    const toRad = (d) => d * Math.PI / 180;
    const px = (r, a) => cx + Math.cos(toRad(a)) * r;
    const py = (r, a) => cy + Math.sin(toRad(a)) * r;

    const largeArc = (bodyEnd - startAngle) > 180 ? 1 : 0;

    const d = [
        `M ${px(outerR, startAngle)} ${py(outerR, startAngle)}`,
        `A ${outerR} ${outerR} 0 ${largeArc} 1 ${px(outerR, bodyEnd)} ${py(outerR, bodyEnd)}`,
        `L ${px(outerR + headExtend, bodyEnd)} ${py(outerR + headExtend, bodyEnd)}`,
        `L ${px(midR, endAngle)} ${py(midR, endAngle)}`,
        `L ${px(innerR - headExtend, bodyEnd)} ${py(innerR - headExtend, bodyEnd)}`,
        `L ${px(innerR, bodyEnd)} ${py(innerR, bodyEnd)}`,
        `A ${innerR} ${innerR} 0 ${largeArc} 0 ${px(innerR, startAngle)} ${py(innerR, startAngle)}`,
        'Z'
    ].join(' ');

    return createSVGElement('path', { d, fill: fill || '#666' });
}

function renderBiArrow(conn) {
    const { x, y, length, rotation = 0, fill = '#666' } = conn;
    const hw = length / 2;
    const headD = hw * 0.336;
    const headH = hw * 0.336;
    const bodyH = hw * 0.202;
    // Normalized double-headed arrow centered at (x, y)
    const pts = [
        [hw, 0],
        [hw - headD, -headH],
        [hw - headD, -bodyH],
        [-(hw - headD), -bodyH],
        [-(hw - headD), -headH],
        [-hw, 0],
        [-(hw - headD), headH],
        [-(hw - headD), bodyH],
        [hw - headD, bodyH],
        [hw - headD, headH]
    ];
    const points = pts.map(([px, py]) => `${x + px},${y + py}`).join(' ');
    const polygon = createSVGElement('polygon', { points, fill });
    if (rotation) {
        polygon.setAttribute('transform', `rotate(${rotation} ${x} ${y})`);
    }
    return polygon;
}

function renderArc(conn) {
    const { cx, cy, radius, startAngle, endAngle, stroke, strokeWidth } = conn;
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const x1 = cx + Math.cos(startRad) * radius;
    const y1 = cy + Math.sin(startRad) * radius;
    const x2 = cx + Math.cos(endRad) * radius;
    const y2 = cy + Math.sin(endRad) * radius;
    const largeArc = (endAngle - startAngle) > 180 ? 1 : 0;
    const d = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
    return createSVGElement('path', {
        d,
        fill: 'none',
        stroke: stroke || '#666',
        'stroke-width': strokeWidth || 2
    });
}

function renderCurvedArrow(conn) {
    const { cx, cy, radius, startAngle, endAngle, stroke, strokeWidth } = conn;

    const startRad = ((startAngle + 15) * Math.PI) / 180;
    const endRad = ((endAngle - 15) * Math.PI) / 180;

    const x1 = cx + Math.cos(startRad) * radius;
    const y1 = cy + Math.sin(startRad) * radius;
    const x2 = cx + Math.cos(endRad) * radius;
    const y2 = cy + Math.sin(endRad) * radius;

    const d = `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`;

    const g = createSVGElement('g');

    const path = createSVGElement('path', {
        d,
        fill: 'none',
        stroke: stroke || '#666',
        'stroke-width': strokeWidth || 2,
        'marker-end': 'url(#arrowhead)'
    });

    g.appendChild(path);
    return g;
}

function createSVGElement(tag, attrs = {}) {
    const el = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            el.setAttribute(key, value);
        }
    });
    return el;
}
