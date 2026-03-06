/**
 * OOXML Exporter for SmartArt
 * Generates data compatible with python-pptx SmartArt generation
 */

import { SMARTART_TYPE_DEFS } from '../types/registry.generated.js';

const EMU_PER_PX = 9525;
const TYPE_LAYOUT_ID_MAP = SMARTART_TYPE_DEFS.reduce((acc, typeDef) => {
    const layoutId = typeDef?.ooxml?.layoutId;
    if (layoutId) acc[typeDef.id] = layoutId;
    return acc;
}, {});

/**
 * Convert SmartArt data to OOXML-compatible format
 * @param {Object} option - SmartArt option
 * @param {Object} data - Calculated layout data
 * @returns {Object} OOXML data for python-pptx
 */
export function toOOXML(option, data) {
    const { type, items, theme } = option;
    const { shapes, connectors } = data;

    return {
        // SmartArt type identifier
        smartArtType: type,
        layoutId: getLayoutId(type),

        // Raw items for data.xml generation
        items: items.map((item, idx) => ({
            id: `item-${idx}`,
            text: typeof item === 'string' ? item : item.text,
            children: item.children || []
        })),

        // Pre-calculated shapes for drawing.xml
        shapes: shapes.map(shape => toOOXMLShape(shape)),

        // Connectors
        connectors: connectors.map(conn => toOOXMLConnector(conn)),

        // Theme colors
        theme: {
            accent1: theme.accent1,
            accent2: theme.accent2,
            accent3: theme.accent3,
            accent4: theme.accent4,
            accent5: theme.accent5,
            accent6: theme.accent6
        }
    };
}

function toOOXMLShape(shape) {
    const base = {
        id: shape.id,
        prst: getPresetShape(shape.type),
        off: {
            x: pxToEmu(shape.x || 0),
            y: pxToEmu(shape.y || 0)
        },
        ext: {
            cx: pxToEmu(shape.width || shape.rx * 2 || 100),
            cy: pxToEmu(shape.height || shape.ry * 2 || 100)
        },
        text: shape.text || '',
        fill: shape.fill,
        stroke: shape.stroke,
        strokeWidth: ptToEmu(shape.strokeWidth || 1.5)
    };

    // Add shape-specific properties
    if (shape.type === 'trapezoid' && shape.ooxml) {
        base.avLst = [{ name: 'adj', fmla: `val ${shape.ooxml.adj || 75000}` }];
    }

    if (shape.type === 'ellipse') {
        base.off.x = pxToEmu(shape.cx - (shape.rx || 50));
        base.off.y = pxToEmu(shape.cy - (shape.ry || 50));
    }

    if (shape.rx && shape.type === 'rect') {
        base.avLst = [
            { name: 'adj1', fmla: `val ${Math.round(shape.rx * 100000 / shape.width)}` }
        ];
        base.prst = 'roundRect';
    }

    return base;
}

function toOOXMLConnector(conn) {
    if (conn.type === 'line') {
        return {
            type: 'cxnSp',
            x1: pxToEmu(conn.x1),
            y1: pxToEmu(conn.y1),
            x2: pxToEmu(conn.x2),
            y2: pxToEmu(conn.y2),
            stroke: conn.stroke,
            strokeWidth: ptToEmu(conn.strokeWidth || 1.5)
        };
    }
    return null;
}

function getLayoutId(type) {
    return TYPE_LAYOUT_ID_MAP[type] || TYPE_LAYOUT_ID_MAP['list'] || 'urn:microsoft.com/office/officeart/2005/8/layout/list1';
}

function getPresetShape(type) {
    const shapeMap = {
        'rect': 'rect',
        'ellipse': 'ellipse',
        'trapezoid': 'trapezoid',
        'chevron': 'chevron',
        'arrow-right': 'rightArrow',
        'homePlate': 'homePlate',
        'diamond': 'diamond',
        'quadArrow': 'quadArrow',
        'hexagon': 'hexagon',
        'pie': 'pie'
    };
    return shapeMap[type] || 'rect';
}

function pxToEmu(px) {
    return Math.round(px * EMU_PER_PX);
}

function ptToEmu(pt) {
    return Math.round(pt * 12700);
}

/**
 * Generate SmartArt data.xml content
 * @param {Object} ooxmlData - Data from toOOXML()
 * @returns {string} XML string
 */
export function generateDataXML(ooxmlData) {
    const { items, layoutId } = ooxmlData;

    let xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<dgm:dataModel xmlns:dgm="http://schemas.openxmlformats.org/drawingml/2006/diagram"
               xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
  <dgm:ptLst>
    <dgm:pt modelId="{00000000-0000-0000-0000-000000000000}" type="doc">
      <dgm:prSet loTypeId="${layoutId}"/>
      <dgm:spPr/>
    </dgm:pt>`;

    items.forEach((item, idx) => {
        const modelId = generateModelId(idx);
        xml += `
    <dgm:pt modelId="${modelId}">
      <dgm:prSet/>
      <dgm:spPr/>
      <dgm:t>
        <a:bodyPr/>
        <a:lstStyle/>
        <a:p>
          <a:r>
            <a:rPr lang="en-US"/>
            <a:t>${escapeXml(item.text)}</a:t>
          </a:r>
        </a:p>
      </dgm:t>
    </dgm:pt>`;
    });

    xml += `
  </dgm:ptLst>
  <dgm:cxnLst>`;

    items.forEach((item, idx) => {
        const srcId = '{00000000-0000-0000-0000-000000000000}';
        const destId = generateModelId(idx);
        xml += `
    <dgm:cxn modelId="${generateModelId(100 + idx)}"
             srcId="${srcId}"
             destId="${destId}"
             srcOrd="${idx}"
             destOrd="0"/>`;
    });

    xml += `
  </dgm:cxnLst>
  <dgm:bg/>
  <dgm:whole/>
</dgm:dataModel>`;

    return xml;
}

function generateModelId(index) {
    const hex = index.toString(16).padStart(8, '0');
    return `{${hex}-0000-0000-0000-000000000000}`;
}

function escapeXml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}
