#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

function usage() {
  console.error(
    'Usage: node scripts/benchmark-smartart-layout.js <registry.cjs> <output.json> [--runs N]'
  )
}

function parseRuns(args, fallback = 200) {
  const idx = args.indexOf('--runs')
  if (idx === -1) return fallback
  const raw = args[idx + 1]
  const parsed = Number.parseInt(raw, 10)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`Invalid --runs value: ${raw}`)
  }
  return parsed
}

function percentile(values, p) {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1))
  return sorted[idx]
}

function stats(values) {
  if (values.length === 0) {
    return { minMs: 0, maxMs: 0, avgMs: 0, p95Ms: 0 }
  }
  const sum = values.reduce((acc, value) => acc + value, 0)
  return {
    minMs: Number(Math.min(...values).toFixed(4)),
    maxMs: Number(Math.max(...values).toFixed(4)),
    avgMs: Number((sum / values.length).toFixed(4)),
    p95Ms: Number(percentile(values, 95).toFixed(4)),
  }
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

function nowMs() {
  const [sec, ns] = process.hrtime()
  return sec * 1000 + ns / 1e6
}

function main() {
  const args = process.argv.slice(2)
  if (args.length < 2) {
    usage()
    process.exit(2)
  }

  const registryPath = path.resolve(args[0])
  const outputPath = path.resolve(args[1])
  const runs = parseRuns(args.slice(2))
  const mod = require(registryPath)
  const types = mod && mod.SMARTART_TYPES
  if (!types || typeof types !== 'object') {
    throw new Error(`SMARTART_TYPES not found in ${registryPath}`)
  }

  const report = {
    generatedAt: new Date().toISOString(),
    node: process.version,
    platform: process.platform,
    runsPerType: runs,
    types: {},
  }

  const allAvg = []
  for (const typeId of Object.keys(types).sort()) {
    const def = types[typeId]
    if (!def || typeof def.layout !== 'function') {
      throw new Error(`Type ${typeId} missing layout function`)
    }

    const durations = []
    for (let i = 0; i < runs; i += 1) {
      const option = buildOption(typeId)
      const start = nowMs()
      const result = def.layout(option)
      const duration = nowMs() - start
      durations.push(duration)
      if (!result || !Array.isArray(result.shapes) || !Array.isArray(result.connectors)) {
        throw new Error(`Type ${typeId} returned invalid layout result`)
      }
    }

    const typeStats = stats(durations)
    report.types[typeId] = {
      ...typeStats,
      shapeCount: types[typeId].layout(buildOption(typeId)).shapes.length,
    }
    allAvg.push(typeStats.avgMs)
  }

  report.summary = {
    typeCount: Object.keys(report.types).length,
    overallAvgMs: Number((allAvg.reduce((acc, v) => acc + v, 0) / allAvg.length).toFixed(4)),
    slowestByAvg: Object.entries(report.types)
      .sort((a, b) => b[1].avgMs - a[1].avgMs)
      .slice(0, 5)
      .map(([typeId, item]) => ({ typeId, avgMs: item.avgMs, p95Ms: item.p95Ms })),
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2) + '\n', 'utf8')
  console.log(`Wrote benchmark report: ${outputPath}`)
  for (const item of report.summary.slowestByAvg) {
    console.log(`- ${item.typeId}: avg=${item.avgMs}ms p95=${item.p95Ms}ms`)
  }
}

main()
