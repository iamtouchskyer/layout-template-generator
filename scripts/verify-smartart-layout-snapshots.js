#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

function usage() {
  console.error('Usage: node scripts/verify-smartart-layout-snapshots.js <registry.cjs> <snapshot.json> [--update] [--svg <dir>]')
}

function normalize(value) {
  if (typeof value === 'number') {
    return Number(value.toFixed(2))
  }
  if (Array.isArray(value)) {
    return value.map((item) => normalize(item)).filter((item) => item !== undefined)
  }
  if (value && typeof value === 'object') {
    const out = {}
    for (const key of Object.keys(value).sort()) {
      const normalized = normalize(value[key])
      if (normalized !== undefined) {
        out[key] = normalized
      }
    }
    return out
  }
  if (value === undefined) {
    return undefined
  }
  return value
}

function buildOption(typeId) {
  const defaultItems = [
    { text: 'Item A' },
    { text: 'Item B', children: [{ text: 'B1' }] },
    { text: 'Item C', children: [{ text: 'C1' }, { text: 'C2' }] },
    { text: 'Item D' },
    { text: 'Item E' },
    { text: 'Item F' },
  ]

  const hierarchyItems = [
    { id: 'root', text: 'Root' },
    { id: 'ops', text: 'Ops', parentId: 'root' },
    { id: 'eng', text: 'Eng', parentId: 'root' },
    { id: 'qa', text: 'QA', parentId: 'eng' },
    { id: 'dev', text: 'Dev', parentId: 'eng' },
  ]

  const typeSpecific = {
    hierarchy: hierarchyItems,
    radial: [{ text: 'Center' }, { text: 'North' }, { text: 'East' }, { text: 'South' }, { text: 'West' }],
    matrix: [{ text: 'Center' }, { text: 'Q1' }, { text: 'Q2' }, { text: 'Q3' }, { text: 'Q4' }],
    'matrix-titled': [{ text: 'Title' }, { text: 'Q1' }, { text: 'Q2' }, { text: 'Q3' }, { text: 'Q4' }],
    'matrix-cycle': [{ text: 'Q1' }, { text: 'Q2' }, { text: 'Q3' }, { text: 'Q4' }],
  }

  return {
    type: typeId,
    items: typeSpecific[typeId] || defaultItems,
    size: { width: 960, height: 540 },
    theme: {
      parentColor: '#4472C4',
      childColors: ['#ED7D31', '#A5A5A5', '#FFC000', '#5B9BD5', '#70AD47', '#264478'],
      light1: '#FFFFFF',
      dark1: '#1F1F1F',
      accent1: '#4472C4',
      accent2: '#ED7D31',
      accent3: '#A5A5A5',
      accent4: '#FFC000',
      accent5: '#5B9BD5',
      accent6: '#70AD47',
    },
  }
}

function firstDiff(expected, actual, pathLabel = '$') {
  if (typeof expected !== typeof actual) {
    return `${pathLabel}: type mismatch (${typeof expected} !== ${typeof actual})`
  }
  if (Array.isArray(expected)) {
    if (expected.length !== actual.length) {
      return `${pathLabel}: array length mismatch (${expected.length} !== ${actual.length})`
    }
    for (let i = 0; i < expected.length; i += 1) {
      const diff = firstDiff(expected[i], actual[i], `${pathLabel}[${i}]`)
      if (diff) return diff
    }
    return null
  }
  if (expected && typeof expected === 'object') {
    const expectedKeys = Object.keys(expected)
    const actualKeys = Object.keys(actual)
    if (expectedKeys.length !== actualKeys.length) {
      return `${pathLabel}: key count mismatch (${expectedKeys.length} !== ${actualKeys.length})`
    }
    for (const key of expectedKeys) {
      if (!(key in actual)) {
        return `${pathLabel}: missing key '${key}'`
      }
      const diff = firstDiff(expected[key], actual[key], `${pathLabel}.${key}`)
      if (diff) return diff
    }
    return null
  }
  if (expected !== actual) {
    return `${pathLabel}: value mismatch (${JSON.stringify(expected)} !== ${JSON.stringify(actual)})`
  }
  return null
}

// --------------- SVG thumbnail generation ---------------

function attr(k, v) {
  if (v === undefined || v === null) return ''
  return ` ${k}="${v}"`
}

function shapeToSvg(s) {
  const fill = s.fill || '#4472C4'
  const stroke = s.stroke || 'none'
  const sw = s.strokeWidth || 0
  const base = `${attr('fill', fill)}${attr('stroke', stroke)}${attr('stroke-width', sw)}`

  switch (s.type) {
    case 'rect':
    case 'roundRect':
      return `<rect${attr('x', s.x)}${attr('y', s.y)}${attr('width', s.width)}${attr('height', s.height)}${attr('rx', s.rx || 0)}${attr('ry', s.ry || 0)}${base}${attr('opacity', s.opacity)}/>\n`

    case 'ellipse':
      return `<ellipse${attr('cx', s.cx)}${attr('cy', s.cy)}${attr('rx', s.rx)}${attr('ry', s.ry)}${base}${attr('opacity', s.opacity)}/>\n`

    case 'trapezoid': {
      const { x, y, width, height, topWidthRatio = 0, invertedTrapezoid = false } = s
      let pts
      if (invertedTrapezoid) {
        const bw = width * topWidthRatio
        const bo = (width - bw) / 2
        pts = `${x},${y} ${x + width},${y} ${x + bo + bw},${y + height} ${x + bo},${y + height}`
      } else {
        const tw = width * topWidthRatio
        const to = (width - tw) / 2
        pts = `${x + to},${y} ${x + to + tw},${y} ${x + width},${y + height} ${x},${y + height}`
      }
      return `<polygon${attr('points', pts)}${base}/>\n`
    }

    case 'chevron': {
      const { x, y, width, height, pointDepth = width * 0.15, rotation = 0 } = s
      const pd = pointDepth
      const pts = `${x + pd},${y} ${x + width - pd},${y} ${x + width},${y + height / 2} ${x + width - pd},${y + height} ${x + pd},${y + height} ${x},${y + height / 2}`
      const tf = rotation ? ` transform="rotate(${rotation} ${x + width / 2} ${y + height / 2})"` : ''
      return `<polygon${attr('points', pts)}${base}${tf}/>\n`
    }

    case 'arrow-right': {
      const { x, y, width, height } = s
      const aw = width * 0.3, bh = height * 0.6, by = y + (height - bh) / 2
      const pts = `${x},${by} ${x + width - aw},${by} ${x + width - aw},${y} ${x + width},${y + height / 2} ${x + width - aw},${y + height} ${x + width - aw},${by + bh} ${x},${by + bh}`
      return `<polygon${attr('points', pts)}${base}/>\n`
    }

    case 'homePlate': {
      const { x, y, width, height } = s
      const notch = width * 0.08
      const pts = `${x + notch},${y} ${x + width},${y} ${x + width},${y + height} ${x + notch},${y + height} ${x},${y + height / 2}`
      return `<polygon${attr('points', pts)}${base}${attr('opacity', s.opacity)}/>\n`
    }

    case 'diamond': {
      const { x, y, width, height } = s
      const pts = `${x + width / 2},${y} ${x + width},${y + height / 2} ${x + width / 2},${y + height} ${x},${y + height / 2}`
      return `<polygon${attr('points', pts)}${base}${attr('opacity', s.opacity)}/>\n`
    }

    case 'quadArrow': {
      const { x, y, width, height } = s
      const cx = x + width / 2, cy = y + height / 2
      const head = Math.min(width, height) * 0.18
      const armW = width * 0.15, armH = height * 0.15
      const pts = [
        [cx, y], [cx + head * 0.45, y + head], [cx + armW, y + head],
        [cx + armW, cy - armH], [x + width - head, cy - armH], [x + width, cy],
        [x + width - head, cy + armH], [cx + armW, cy + armH], [cx + armW, y + height - head],
        [cx + head * 0.45, y + height - head], [cx, y + height], [cx - head * 0.45, y + height - head],
        [cx - armW, y + height - head], [cx - armW, cy + armH], [x + head, cy + armH],
        [x, cy], [x + head, cy - armH], [cx - armW, cy - armH], [cx - armW, y + head],
        [cx - head * 0.45, y + head]
      ].map(([px, py]) => `${px},${py}`).join(' ')
      return `<polygon${attr('points', pts)}${base}${attr('opacity', s.opacity)}/>\n`
    }

    case 'hexagon': {
      const { x, y, width, height } = s
      const w4 = width / 4
      const pts = `${x + w4},${y} ${x + width - w4},${y} ${x + width},${y + height / 2} ${x + width - w4},${y + height} ${x + w4},${y + height} ${x},${y + height / 2}`
      return `<polygon${attr('points', pts)}${base}/>\n`
    }

    case 'triangle':
    case 'flowChartExtract': {
      const { x, y, width, height } = s
      const inverted = s.type === 'flowChartExtract' ? true : !!s.inverted
      const pts = inverted
        ? `${x},${y} ${x + width},${y} ${x + width / 2},${y + height}`
        : `${x + width / 2},${y} ${x + width},${y + height} ${x},${y + height}`
      return `<polygon${attr('points', pts)}${base}/>\n`
    }

    case 'upArrow': {
      const { x, y, width, height, direction = 'up' } = s
      const bodyW = width * 0.5, headH = height * 0.4, bodyX = x + (width - bodyW) / 2
      let pts
      if (direction === 'down') {
        pts = `${bodyX},${y} ${bodyX + bodyW},${y} ${bodyX + bodyW},${y + height - headH} ${x + width},${y + height - headH} ${x + width / 2},${y + height} ${x},${y + height - headH} ${bodyX},${y + height - headH}`
      } else {
        pts = `${x + width / 2},${y} ${x + width},${y + headH} ${bodyX + bodyW},${y + headH} ${bodyX + bodyW},${y + height} ${bodyX},${y + height} ${bodyX},${y + headH} ${x},${y + headH}`
      }
      return `<polygon${attr('points', pts)}${base}/>\n`
    }

    case 'round2SameRect': {
      const { x, y, width, height } = s
      const r = Math.min(width, height) * 0.15
      const d = `M ${x + r} ${y} L ${x + width - r} ${y} A ${r} ${r} 0 0 1 ${x + width} ${y + r} L ${x + width} ${y + height} L ${x} ${y + height} L ${x} ${y + r} A ${r} ${r} 0 0 1 ${x + r} ${y} Z`
      return `<path${attr('d', d)}${base}/>\n`
    }

    case 'trapezoidTextbox': {
      const { topLeftX, bottomLeftX, rightX, y, height } = s
      const pts = `${topLeftX},${y} ${rightX},${y} ${rightX},${y + height} ${bottomLeftX},${y + height}`
      return `<polygon${attr('points', pts)}${base}/>\n`
    }

    case 'pie': {
      const { cx, cy, innerRadius, outerRadius, startAngle, endAngle } = s
      const toRad = (d) => d * Math.PI / 180
      const x1 = cx + Math.cos(toRad(startAngle)) * outerRadius
      const y1 = cy + Math.sin(toRad(startAngle)) * outerRadius
      const x2 = cx + Math.cos(toRad(endAngle)) * outerRadius
      const y2 = cy + Math.sin(toRad(endAngle)) * outerRadius
      const x3 = cx + Math.cos(toRad(endAngle)) * innerRadius
      const y3 = cy + Math.sin(toRad(endAngle)) * innerRadius
      const x4 = cx + Math.cos(toRad(startAngle)) * innerRadius
      const y4 = cy + Math.sin(toRad(startAngle)) * innerRadius
      const la = endAngle - startAngle > 180 ? 1 : 0
      const d = `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${la} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${la} 0 ${x4} ${y4} Z`
      return `<path${attr('d', d)}${base}/>\n`
    }

    case 'chord': {
      const { cx, cy, rx, startAngle = 0, endAngle = 270 } = s
      const ry = s.ry || rx
      if (endAngle - startAngle >= 360) {
        return `<ellipse${attr('cx', cx)}${attr('cy', cy)}${attr('rx', rx)}${attr('ry', ry)}${base}/>\n`
      }
      const toRad = (d) => d * Math.PI / 180
      const x1 = cx + Math.cos(toRad(startAngle)) * rx
      const y1 = cy + Math.sin(toRad(startAngle)) * ry
      const x2 = cx + Math.cos(toRad(endAngle)) * rx
      const y2 = cy + Math.sin(toRad(endAngle)) * ry
      const la = (endAngle - startAngle) > 180 ? 1 : 0
      const d = `M ${x1} ${y1} A ${rx} ${ry} 0 ${la} 1 ${x2} ${y2} Z`
      return `<path${attr('d', d)}${base}/>\n`
    }

    case 'line': {
      return `<line${attr('x1', s.x1)}${attr('y1', s.y1)}${attr('x2', s.x2)}${attr('y2', s.y2)}${attr('stroke', s.stroke || '#666')}${attr('stroke-width', s.strokeWidth || 2)}/>\n`
    }

    case 'arrow': {
      const { x, y, size = 12, rotation = 0, fill: f = '#666', style } = s
      if (style === 'textCycleSvg') {
        const pp = [[0, .4977], [.3303, .1674], [.1629, 0], [.9118, .0883], [1, .8373], [.8326, .6699], [.5023, 1]]
        const d = pp.map(([px, py], i) => `${i === 0 ? 'M' : 'L'} ${x + px * size} ${y + py * size}`).join(' ') + ' Z'
        const adjRot = rotation + 45
        return `<path${attr('d', d)}${attr('fill', f)} fill-rule="evenodd" transform="rotate(${adjRot} ${x + size / 2} ${y + size / 2})"/>\n`
      }
      const w = size * 1.42, h = size * 0.9
      const ox = x + (size - w) / 2, oy = y + (size - h) / 2
      const my = oy + h / 2, nx = ox + w * 0.2, bex = ox + w * 0.68, tx = ox + w
      const sh = h * 0.17, nd = h * 0.2
      const pts = `${nx},${oy} ${bex},${oy} ${bex},${my - sh} ${tx},${my} ${bex},${my + sh} ${bex},${oy + h} ${nx},${oy + h} ${nx},${my + nd} ${ox},${my} ${nx},${my - nd}`
      const tf = rotation ? ` transform="rotate(${rotation} ${x + size / 2} ${y + size / 2})"` : ''
      return `<polygon${attr('points', pts)}${attr('fill', f)}${tf}/>\n`
    }

    default:
      // Fallback: render as rect
      return `<rect${attr('x', s.x)}${attr('y', s.y)}${attr('width', s.width)}${attr('height', s.height)}${base}/>\n`
  }
}

function connectorToSvg(c) {
  switch (c.type) {
    case 'line':
      return `<line${attr('x1', c.x1)}${attr('y1', c.y1)}${attr('x2', c.x2)}${attr('y2', c.y2)}${attr('stroke', c.stroke || '#666')}${attr('stroke-width', c.strokeWidth || 2)}/>\n`

    case 'circle':
      return `<circle${attr('cx', c.cx)}${attr('cy', c.cy)}${attr('r', c.radius)}${attr('fill', c.fill || 'none')}${attr('stroke', c.stroke || '#666')}${attr('stroke-width', c.strokeWidth || 2)}/>\n`

    case 'arc': {
      const { cx, cy, radius, startAngle, endAngle } = c
      const toRad = (d) => d * Math.PI / 180
      const x1 = cx + Math.cos(toRad(startAngle)) * radius
      const y1 = cy + Math.sin(toRad(startAngle)) * radius
      const x2 = cx + Math.cos(toRad(endAngle)) * radius
      const y2 = cy + Math.sin(toRad(endAngle)) * radius
      const la = (endAngle - startAngle) > 180 ? 1 : 0
      const d = `M ${x1} ${y1} A ${radius} ${radius} 0 ${la} 1 ${x2} ${y2}`
      return `<path${attr('d', d)} fill="none"${attr('stroke', c.stroke || '#666')}${attr('stroke-width', c.strokeWidth || 2)}/>\n`
    }

    case 'blockArc': {
      const { cx, cy, outerR, innerR, startAngle, endAngle, fill } = c
      const toRad = (d) => d * Math.PI / 180
      const px = (r, a) => cx + Math.cos(toRad(a)) * r
      const py = (r, a) => cy + Math.sin(toRad(a)) * r
      const la = (endAngle - startAngle) > 180 ? 1 : 0
      const d = `M ${px(outerR, startAngle)} ${py(outerR, startAngle)} A ${outerR} ${outerR} 0 ${la} 1 ${px(outerR, endAngle)} ${py(outerR, endAngle)} L ${px(innerR, endAngle)} ${py(innerR, endAngle)} A ${innerR} ${innerR} 0 ${la} 0 ${px(innerR, startAngle)} ${py(innerR, startAngle)} Z`
      return `<path${attr('d', d)}${attr('fill', fill || '#666')}/>\n`
    }

    case 'thickCurvedArrow': {
      const { cx, cy, outerR, innerR, startAngle, endAngle, fill } = c
      const midR = (outerR + innerR) / 2, thickness = outerR - innerR
      const headDeg = 10, headExtend = thickness * 0.5, bodyEnd = endAngle - headDeg
      const toRad = (d) => d * Math.PI / 180
      const px = (r, a) => cx + Math.cos(toRad(a)) * r
      const py = (r, a) => cy + Math.sin(toRad(a)) * r
      const la = (bodyEnd - startAngle) > 180 ? 1 : 0
      const d = `M ${px(outerR, startAngle)} ${py(outerR, startAngle)} A ${outerR} ${outerR} 0 ${la} 1 ${px(outerR, bodyEnd)} ${py(outerR, bodyEnd)} L ${px(outerR + headExtend, bodyEnd)} ${py(outerR + headExtend, bodyEnd)} L ${px(midR, endAngle)} ${py(midR, endAngle)} L ${px(innerR - headExtend, bodyEnd)} ${py(innerR - headExtend, bodyEnd)} L ${px(innerR, bodyEnd)} ${py(innerR, bodyEnd)} A ${innerR} ${innerR} 0 ${la} 0 ${px(innerR, startAngle)} ${py(innerR, startAngle)} Z`
      return `<path${attr('d', d)}${attr('fill', fill || '#666')}/>\n`
    }

    case 'biArrow': {
      const { x, y, length, rotation = 0, fill = '#666' } = c
      const hw = length / 2, headD = hw * 0.336, headH = hw * 0.336, bodyH = hw * 0.202
      const pts = [[hw, 0], [hw - headD, -headH], [hw - headD, -bodyH], [-(hw - headD), -bodyH], [-(hw - headD), -headH], [-hw, 0], [-(hw - headD), headH], [-(hw - headD), bodyH], [hw - headD, bodyH], [hw - headD, headH]]
        .map(([px, py]) => `${x + px},${y + py}`).join(' ')
      const tf = rotation ? ` transform="rotate(${rotation} ${x} ${y})"` : ''
      return `<polygon${attr('points', pts)}${attr('fill', fill)}${tf}/>\n`
    }

    case 'curvedArrow': {
      const { cx, cy, radius, startAngle, endAngle } = c
      const toRad = (d) => d * Math.PI / 180
      const x1 = cx + Math.cos(toRad(startAngle + 15)) * radius
      const y1 = cy + Math.sin(toRad(startAngle + 15)) * radius
      const x2 = cx + Math.cos(toRad(endAngle - 15)) * radius
      const y2 = cy + Math.sin(toRad(endAngle - 15)) * radius
      const d = `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`
      return `<path${attr('d', d)} fill="none"${attr('stroke', c.stroke || '#666')}${attr('stroke-width', c.strokeWidth || 2)}/>\n`
    }

    case 'arrow': {
      const { x, y, size = 12, rotation = 0, fill = '#666', style } = c
      if (style === 'textCycleSvg') {
        const pp = [[0, .4977], [.3303, .1674], [.1629, 0], [.9118, .0883], [1, .8373], [.8326, .6699], [.5023, 1]]
        const d = pp.map(([px, py], i) => `${i === 0 ? 'M' : 'L'} ${x + px * size} ${y + py * size}`).join(' ') + ' Z'
        const adjRot = rotation + 45
        return `<path${attr('d', d)}${attr('fill', fill)} fill-rule="evenodd" transform="rotate(${adjRot} ${x + size / 2} ${y + size / 2})"/>\n`
      }
      const w = size * 1.42, h = size * 0.9
      const ox = x + (size - w) / 2, oy = y + (size - h) / 2
      const my = oy + h / 2, nx = ox + w * 0.2, bex = ox + w * 0.68, tx = ox + w
      const sh = h * 0.17, nd = h * 0.2
      const pts = `${nx},${oy} ${bex},${oy} ${bex},${my - sh} ${tx},${my} ${bex},${my + sh} ${bex},${oy + h} ${nx},${oy + h} ${nx},${my + nd} ${ox},${my} ${nx},${my - nd}`
      const tf = rotation ? ` transform="rotate(${rotation} ${x + size / 2} ${y + size / 2})"` : ''
      return `<polygon${attr('points', pts)}${attr('fill', fill)}${tf}/>\n`
    }

    default:
      return ''
  }
}

function layoutToSvg(result) {
  const shapes = result.shapes || []
  const connectors = result.connectors || []
  const b = result.bounds || {}
  const w = b.width || 960, h = b.height || 540
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">\n`
  for (const c of connectors) svg += connectorToSvg(c)
  for (const s of shapes) svg += shapeToSvg(s)
  svg += '</svg>\n'
  return svg
}

function main() {
  const args = process.argv.slice(2)
  if (args.length < 2) {
    usage()
    process.exit(2)
  }

  const registryPath = path.resolve(args[0])
  const snapshotPath = path.resolve(args[1])
  const shouldUpdate = args.includes('--update')
  const svgIdx = args.indexOf('--svg')
  const svgDir = svgIdx !== -1 ? path.resolve(args[svgIdx + 1]) : null

  const mod = require(registryPath)
  const types = mod && mod.SMARTART_TYPES
  if (!types || typeof types !== 'object') {
    throw new Error(`SMARTART_TYPES not found in ${registryPath}`)
  }

  const snapshot = {}
  const results = {}
  const typeIds = Object.keys(types).sort()
  for (const typeId of typeIds) {
    const def = types[typeId]
    if (!def || typeof def.layout !== 'function') {
      throw new Error(`Type ${typeId} missing layout function`)
    }
    const result = def.layout(buildOption(typeId))
    results[typeId] = result
    snapshot[typeId] = normalize({
      type: result.type,
      bounds: result.bounds || {},
      shapes: result.shapes || [],
      connectors: result.connectors || [],
    })
  }

  // Generate SVG thumbnails if --svg <dir> is provided
  if (svgDir) {
    fs.mkdirSync(svgDir, { recursive: true })
    let count = 0
    for (const typeId of typeIds) {
      const def = types[typeId]
      const ooxmlId = def.id || typeId
      const svg = layoutToSvg(results[typeId])
      fs.writeFileSync(path.join(svgDir, `${ooxmlId}.svg`), svg, 'utf8')
      count++
    }
    console.log(`Generated ${count} SVG thumbnails in ${svgDir}`)
  }

  if (shouldUpdate || !fs.existsSync(snapshotPath)) {
    fs.mkdirSync(path.dirname(snapshotPath), { recursive: true })
    fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2) + '\n', 'utf8')
    console.log(`Updated snapshot baseline: ${snapshotPath}`)
    return
  }

  const expected = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'))
  const diff = firstDiff(expected, snapshot)
  if (diff) {
    console.error('SmartArt layout snapshots mismatch.')
    console.error(diff)
    console.error('Run with --update to refresh baseline if the change is intentional.')
    process.exit(1)
  }

  console.log(`SmartArt layout snapshots match baseline (${typeIds.length} types).`)
}

main()
