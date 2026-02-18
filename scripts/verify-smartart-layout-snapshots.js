#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

function usage() {
  console.error('Usage: node scripts/verify-smartart-layout-snapshots.js <registry.cjs> <snapshot.json> [--update]')
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

function main() {
  const args = process.argv.slice(2)
  if (args.length < 2) {
    usage()
    process.exit(2)
  }

  const registryPath = path.resolve(args[0])
  const snapshotPath = path.resolve(args[1])
  const shouldUpdate = args.includes('--update')

  const mod = require(registryPath)
  const types = mod && mod.SMARTART_TYPES
  if (!types || typeof types !== 'object') {
    throw new Error(`SMARTART_TYPES not found in ${registryPath}`)
  }

  const snapshot = {}
  const typeIds = Object.keys(types).sort()
  for (const typeId of typeIds) {
    const def = types[typeId]
    if (!def || typeof def.layout !== 'function') {
      throw new Error(`Type ${typeId} missing layout function`)
    }
    const result = def.layout(buildOption(typeId))
    snapshot[typeId] = normalize({
      type: result.type,
      bounds: result.bounds || {},
      shapes: result.shapes || [],
      connectors: result.connectors || [],
    })
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
