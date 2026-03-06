/**
 * SmartArt Types Registry
 * Built from generated metadata sourced from smartart/catalog.json
 */

import { pyramidLayout } from './pyramid.js';
import { matrixLayout } from './matrix.js';
import { cycleLayout } from './cycle.js';
import { chevronLayout } from './chevron.js';
import { hierarchyLayout } from './hierarchy.js';
import { radialLayout } from './radial.js';
import { listLayout } from './list.js';
import { vennLayout } from './venn.js';
import { listExtLayout } from './list-ext.js';
import { arrowLayout } from './arrow.js';
import { processLayout } from './process.js';
import { SMARTART_TYPE_DEFS } from './registry.generated.js';

// Re-export data schema utilities
export {
    SCHEMA_FLAT,
    SCHEMA_HIERARCHICAL,
    DATA_SCHEMAS,
    getDataSchema,
    isHierarchical,
    getEditorMode,
    shouldShowBullet,
    generateDefaultData,
    normalizeData,
} from './data-schema.js';

const LAYOUT_IMPLS = {
    pyramid: pyramidLayout,
    matrix: matrixLayout,
    cycle: cycleLayout,
    chevron: chevronLayout,
    hierarchy: hierarchyLayout,
    radial: radialLayout,
    list: listLayout,
    venn: vennLayout,
    listExt: listExtLayout,
    arrow: arrowLayout,
    process: processLayout,
};

function createLayout(engineDef) {
    const impl = LAYOUT_IMPLS[engineDef.layout];
    if (!impl) {
        throw new Error(`Unknown layout implementation: ${engineDef.layout}`);
    }

    const args = engineDef.layoutArgs || {};
    if (Object.keys(args).length === 0) {
        return impl;
    }
    return (opt) => impl(opt, args);
}

export const SMARTART_TYPES = SMARTART_TYPE_DEFS.reduce((acc, def) => {
    acc[def.id] = {
        id: def.ui.ooxmlId,
        name: def.engine.name,
        nameEn: def.engine.nameEn,
        category: def.engine.category,
        layout: createLayout(def.engine),
        shapeType: def.engine.shapeType,
    };
    return acc;
}, {});

// Get all types as array for UI selectors
export function getSmartArtTypes() {
    return Object.entries(SMARTART_TYPES).map(([key, config]) => ({
        key,
        ...config
    }));
}

// Get types by category
export function getTypesByCategory(category) {
    return Object.entries(SMARTART_TYPES)
        .filter(([_, config]) => config.category === category)
        .map(([key, config]) => ({ key, ...config }));
}

// Get all categories
export function getCategories() {
    const categories = new Set();
    Object.values(SMARTART_TYPES).forEach(t => categories.add(t.category));
    return Array.from(categories);
}
