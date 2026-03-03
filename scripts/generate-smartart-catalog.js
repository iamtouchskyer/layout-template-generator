#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const CATALOG_PATH = path.join(ROOT, 'smartart', 'catalog.json')
const UI_OUT_PATH = path.join(ROOT, 'js', 'config.smartart.generated.js')
const REGISTRY_OUT_PATH = path.join(ROOT, 'js', 'smartart', 'types', 'registry.generated.js')
const PY_OUT_PATH = path.join(ROOT, 'pptx_gen', 'smartart_map_generated.py')

function readCatalog() {
  const raw = fs.readFileSync(CATALOG_PATH, 'utf8')
  const catalog = JSON.parse(raw)

  if (!Array.isArray(catalog.categories) || !Array.isArray(catalog.types)) {
    throw new Error('catalog.json must contain categories[] and types[]')
  }

  const categoryIds = new Set()
  for (const category of catalog.categories) {
    if (!category || !category.id) {
      throw new Error('Each category requires id')
    }
    if (categoryIds.has(category.id)) {
      throw new Error(`Duplicated category id: ${category.id}`)
    }
    categoryIds.add(category.id)
  }

  const typeIds = new Set()
  for (const type of catalog.types) {
    if (!type || !type.id) {
      throw new Error('Each type requires id')
    }
    if (typeIds.has(type.id)) {
      throw new Error(`Duplicated type id: ${type.id}`)
    }
    typeIds.add(type.id)

    if (!type.ui || !type.ui.category || !type.ui.label || !type.ui.ooxmlId) {
      throw new Error(`Type ${type.id} is missing ui fields`)
    }
    if (!categoryIds.has(type.ui.category)) {
      throw new Error(`Type ${type.id} references unknown ui.category: ${type.ui.category}`)
    }
    if (!type.engine || !type.engine.layout) {
      throw new Error(`Type ${type.id} is missing engine.layout`)
    }
    if (!type.pptx || !type.pptx.smartartType) {
      throw new Error(`Type ${type.id} is missing pptx.smartartType`)
    }
  }

  return catalog
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8')
}

function toPretty(obj) {
  return JSON.stringify(obj, null, 2)
}

function generateUiConfig(catalog) {
  const categories = {}
  for (const category of catalog.categories) {
    categories[category.id] = {
      label: category.label,
      desc: category.desc,
    }
  }

  const types = {}
  for (const type of catalog.types) {
    types[type.id] = {
      category: type.ui.category,
      label: type.ui.label,
      ooxmlId: type.ui.ooxmlId,
    }
  }

  return `/**\n * AUTO-GENERATED FILE. DO NOT EDIT.\n * Source: smartart/catalog.json\n */\n\n;(function(global) {\n  const SMARTART_CATEGORIES = ${toPretty(categories)}\n\n  const SMARTART_TYPES = ${toPretty(types)}\n\n  global.SMARTART_CATEGORIES = SMARTART_CATEGORIES\n  global.SMARTART_TYPES = SMARTART_TYPES\n})(typeof window !== 'undefined' ? window : globalThis)\n`
}

function generateRegistryDefs(catalog) {
  const defs = catalog.types.map((type) => ({
    id: type.id,
    ui: type.ui,
    engine: {
      name: type.engine.name,
      nameEn: type.engine.nameEn,
      category: type.engine.category,
      layout: type.engine.layout,
      layoutArgs: type.engine.layoutArgs || {},
      shapeType: type.engine.shapeType,
    },
    ooxml: type.ooxml || {},
    pptx: type.pptx,
  }))

  return `/**\n * AUTO-GENERATED FILE. DO NOT EDIT.\n * Source: smartart/catalog.json\n */\n\nexport const SMARTART_TYPE_DEFS = ${toPretty(defs)}\n`
}

function generatePythonMap(catalog) {
  const entries = catalog.types
    .map((type) => `    '${type.id}': SMARTART_TYPE.${type.pptx.smartartType},`)
    .join('\n')

  const layoutIdToTypeId = new Map()
  for (const type of catalog.types) {
    const layoutId = type.ooxml && type.ooxml.layoutId
    if (!layoutId || layoutIdToTypeId.has(layoutId)) continue
    layoutIdToTypeId.set(layoutId, type.id)
  }
  const layoutEntries = Array.from(layoutIdToTypeId.entries())
    .map(([layoutId, typeId]) => `    '${layoutId}': '${typeId}',`)
    .join('\n')

  const enumToTypeIds = new Map()
  for (const type of catalog.types) {
    const enumName = type.pptx.smartartType
    if (!enumToTypeIds.has(enumName)) {
      enumToTypeIds.set(enumName, [])
    }
    enumToTypeIds.get(enumName).push(type.id)
  }

  const enumEntries = Array.from(enumToTypeIds.entries())
    .map(([enumName, typeIds]) => `    '${enumName}': '${typeIds[0]}',`)
    .join('\n')

  const ambiguousEnumEntries = Array.from(enumToTypeIds.entries())
    .filter(([, typeIds]) => typeIds.length > 1)
    .map(([enumName, typeIds]) => {
      const ids = typeIds.map((typeId) => `'${typeId}'`).join(', ')
      return `    '${enumName}': [${ids}],`
    })
    .join('\n')

  return `\"\"\"Auto-generated SmartArt type mappings. Do not edit manually.\"\"\"\n\nfrom pptx.enum.smartart import SMARTART_TYPE\n\nGENERATED_SMARTART_TYPE_MAP = {\n${entries}\n}\n\nGENERATED_LAYOUT_ID_TYPE_ID_MAP = {\n${layoutEntries}\n}\n\nGENERATED_PPTX_ENUM_TYPE_ID_MAP = {\n${enumEntries}\n}\n\nGENERATED_PPTX_ENUM_AMBIGUOUS_TYPE_IDS_MAP = {\n${ambiguousEnumEntries}\n}\n`
}

function main() {
  const catalog = readCatalog()
  writeFile(UI_OUT_PATH, generateUiConfig(catalog))
  writeFile(REGISTRY_OUT_PATH, generateRegistryDefs(catalog))
  writeFile(PY_OUT_PATH, generatePythonMap(catalog))
  console.log('Generated SmartArt artifacts from smartart/catalog.json')
}

main()
