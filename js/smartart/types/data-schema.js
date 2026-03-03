/**
 * SmartArt Data Schema Metadata
 *
 * Defines the data structure for each SmartArt type:
 * - schema: 'flat' (N siblings) | 'hierarchical' (N parents with children)
 * - itemCount: default number of top-level items
 * - childCount: default children per item (for hierarchical)
 * - labels: { item, child } - display labels for editor
 * - editorMode: optional editor hint ('tree' | 'matrix')
 * - bulletRules: defines when to show bullet points
 *
 * All types use unified data model:
 * [{ text: 'Parent', children: [{ text: 'Child' }] }]
 */

// Schema types
export const SCHEMA_FLAT = 'flat';
export const SCHEMA_HIERARCHICAL = 'hierarchical';

/**
 * Bullet display rules
 *
 * RULE: Level 0 = no bullet (title/label role)
 *       Level 1+ = bullet (content/description role)
 *
 * bulletFromLevel: the depth level where bullets start appearing
 *   - 0: all levels have bullets (rare, for plain lists)
 *   - 1: level 0 no bullet, level 1+ has bullet (most common)
 *   - 2: level 0,1 no bullet, level 2+ has bullet (deep hierarchies)
 */
export const BULLET_RULES = {
    NONE: { bulletFromLevel: Infinity },    // Never show bullets
    FROM_LEVEL_0: { bulletFromLevel: 0 },   // All items have bullets
    FROM_LEVEL_1: { bulletFromLevel: 1 },   // Children have bullets
    FROM_LEVEL_2: { bulletFromLevel: 2 },   // Grandchildren have bullets
};

/**
 * Data schema definitions for each SmartArt type
 *
 * bulletFromLevel values:
 *   - 1: most common - level 0 is title (no bullet), level 1+ is content (bullet)
 *   - 0: all items are equal, all have bullets
 *   - Infinity: never show bullets (shape-only layouts)
 */
export const DATA_SCHEMAS = {
    // ========== Matrix Types ==========
    'matrix': {
        schema: SCHEMA_FLAT,
        itemCount: 5,  // center + 4 quadrants
        bulletFromLevel: Infinity,  // quadrants are shapes, no bullets
        editorMode: 'matrix',
        labels: { item: '节点' },
        description: '1 center with 4 quadrants'
    },
    'matrix-titled': {
        schema: SCHEMA_FLAT,
        itemCount: 4,  // 4 flat quadrants
        bulletFromLevel: Infinity,  // quadrants are shapes
        editorMode: 'matrix',
        labels: { item: '象限' },
        description: '4 flat quadrants'
    },
    'matrix-cycle': {
        schema: SCHEMA_FLAT,
        itemCount: 4,
        bulletFromLevel: Infinity,
        editorMode: 'matrix',
        labels: { item: '象限' },
        description: '4 quadrants with cycle arrows'
    },

    // ========== Cycle Types ==========
    'cycle': {
        schema: SCHEMA_HIERARCHICAL,
        itemCount: 4,
        childCount: 1,
        bulletFromLevel: 1,  // level 0 = title (no bullet), level 1 = desc (bullet)
        labels: { item: '标题', child: '描述' },
        description: 'BLOCK_CYCLE: 4 items each with description'
    },
    'cycle1': {
        schema: SCHEMA_FLAT,
        itemCount: 5,
        bulletFromLevel: Infinity,
        labels: { item: '节点' },
        description: 'BASIC_CYCLE: 5 cycle nodes'
    },
    'cycle2': {
        schema: SCHEMA_FLAT,
        itemCount: 5,
        bulletFromLevel: Infinity,
        labels: { item: '节点' },
        description: 'TEXT_CYCLE: 5 text circles'
    },
    'cycle3': {
        schema: SCHEMA_FLAT,
        itemCount: 5,
        bulletFromLevel: Infinity,
        labels: { item: '节点' },
        description: 'SEGMENTED_CYCLE: ring flow + outer labels'
    },
    'cycle5': {
        schema: SCHEMA_FLAT,
        itemCount: 5,
        bulletFromLevel: Infinity,
        labels: { item: '节点' },
        description: 'NON_DIRECTIONAL_CYCLE: 5 linked nodes'
    },
    'cycle6': {
        schema: SCHEMA_FLAT,
        itemCount: 5,
        bulletFromLevel: Infinity,
        labels: { item: '节点' },
        description: 'CONTINUOUS_CYCLE: 5 continuous nodes'
    },
    'cycle7': {
        schema: SCHEMA_FLAT,
        itemCount: 3,
        bulletFromLevel: Infinity,
        labels: { item: '节点' },
        description: '3-node cycle with bidirectional arrows'
    },
    'cycle8': {
        schema: SCHEMA_FLAT,
        itemCount: 3,
        bulletFromLevel: Infinity,
        labels: { item: '分段' },
        description: '3 sector cycle'
    },
    'cycle-segmented': {
        schema: SCHEMA_FLAT,
        itemCount: 3,
        bulletFromLevel: Infinity,  // pie segments are shapes
        labels: { item: '分段' },
        description: 'Pie segments, no children'
    },

    // ========== Pyramid Types ==========
    'pyramid': {
        schema: SCHEMA_FLAT,
        itemCount: 5,
        bulletFromLevel: Infinity,  // trapezoids are shapes
        labels: { item: '层级' },
        description: 'Stacked trapezoids from top to bottom'
    },
    'pyramid-list': {
        schema: SCHEMA_HIERARCHICAL,
        itemCount: 5,
        childCount: 1,
        bulletFromLevel: 1,  // level 0 = layer title, level 1+ = bullets
        labels: { item: '层级', child: '说明' },
        description: 'Pyramid with side textboxes'
    },
    'pyramid-inverted': {
        schema: SCHEMA_FLAT,
        itemCount: 5,
        bulletFromLevel: Infinity,
        labels: { item: '层级' },
        description: 'Inverted pyramid (funnel)'
    },
    'pyramid-segmented': {
        schema: SCHEMA_FLAT,
        itemCount: 5,
        bulletFromLevel: Infinity,
        labels: { item: '层级' },
        description: 'Triangular segments'
    },

    // ========== Process Types ==========
    'chevron': {
        schema: SCHEMA_FLAT,
        itemCount: 3,
        bulletFromLevel: Infinity,  // chevrons are shapes
        labels: { item: '步骤' },
        description: 'Horizontal chevron flow'
    },
    'arrow-process': {
        schema: SCHEMA_FLAT,
        itemCount: 3,
        bulletFromLevel: Infinity,
        labels: { item: '步骤' },
        description: 'Arrow-style process flow'
    },
    'descending-process': {
        schema: SCHEMA_FLAT,
        itemCount: 5,
        bulletFromLevel: Infinity,
        labels: { item: '步骤' },
        description: 'Descending process steps'
    },

    // ========== Relationship Types ==========
    'radial': {
        schema: SCHEMA_FLAT,
        itemCount: 5,  // center + 4 satellites
        bulletFromLevel: Infinity,  // center + satellites are shapes
        labels: { item: '节点' },
        description: '1 center with 4 satellite items'
    },

    // ========== Hierarchy Types ==========
    'hierarchy': {
        schema: SCHEMA_HIERARCHICAL,
        itemCount: 1,
        childCount: 3,
        maxDepth: 3,
        bulletFromLevel: 2,  // level 0,1 = org boxes, level 2+ = bullets
        labels: { item: '根节点', child: '子节点' },
        description: 'Org chart / tree hierarchy'
    },

    // ========== List Types ==========
    'list': {
        schema: SCHEMA_FLAT,
        itemCount: 5,
        bulletFromLevel: 0,  // all items are bullet points
        labels: { item: '项目' },
        description: 'Basic block list'
    },
    'list-vertical': {
        schema: SCHEMA_FLAT,
        itemCount: 3,
        bulletFromLevel: 0,
        labels: { item: '项目' },
        description: 'Vertical block list'
    },
    'hexagon-alternating': {
        schema: SCHEMA_FLAT,
        itemCount: 4,
        bulletFromLevel: Infinity,
        labels: { item: '节点' },
        description: 'Alternating hexagon nodes'
    },
    'picture-accent': {
        schema: SCHEMA_FLAT,
        itemCount: 4,
        bulletFromLevel: Infinity,
        labels: { item: '图片' },
        description: 'Accented picture layout'
    },
    'picture-captioned': {
        schema: SCHEMA_FLAT,
        itemCount: 3,
        bulletFromLevel: Infinity,
        labels: { item: '标题' },
        description: 'Pictures with title/description fields'
    },
};

/**
 * Get schema for a type, with fallback defaults
 */
export function getDataSchema(typeId) {
    return DATA_SCHEMAS[typeId] || {
        schema: SCHEMA_FLAT,
        itemCount: 3,
        bulletFromLevel: 1,
        labels: { item: '项目' },
        description: 'Unknown type - using flat default'
    };
}

/**
 * Check if an item at given depth should show a bullet
 * @param {string} typeId - SmartArt type ID
 * @param {number} depth - 0 for top-level, 1 for children, 2 for grandchildren...
 * @returns {boolean}
 */
export function shouldShowBullet(typeId, depth) {
    const schema = getDataSchema(typeId);
    return depth >= (schema.bulletFromLevel ?? 1);
}

/**
 * Check if a type uses hierarchical data
 */
export function isHierarchical(typeId) {
    const schema = getDataSchema(typeId);
    return schema.schema === SCHEMA_HIERARCHICAL;
}

/**
 * Get editor mode for a type.
 * - 'matrix': center + quadrant fixed slots
 * - 'tree': generic nested list editor
 */
export function getEditorMode(typeId) {
    const schema = getDataSchema(typeId);
    return schema.editorMode || 'tree';
}

/**
 * Generate default data for a SmartArt type
 */
export function generateDefaultData(typeId) {
    const schema = getDataSchema(typeId);
    const items = [];

    for (let i = 0; i < schema.itemCount; i++) {
        const item = {
            text: `${schema.labels.item} ${i + 1}`,
            children: []
        };

        if (schema.schema === SCHEMA_HIERARCHICAL && schema.childCount) {
            for (let j = 0; j < schema.childCount; j++) {
                item.children.push({
                    text: `${schema.labels.child} ${j + 1}`
                });
            }
        }

        items.push(item);
    }

    return items;
}

/**
 * Normalize data to unified format
 * Accepts: string[], {text}[], {text, children}[]
 * Returns: {text, children}[]
 */
export function normalizeData(data) {
    if (!Array.isArray(data)) return [];

    function normalizeNode(node) {
        if (typeof node === 'string') {
            return { text: node, children: [] };
        }
        if (!node || typeof node !== 'object') {
            return { text: '', children: [] };
        }
        const normalizedChildren = Array.isArray(node.children)
            ? node.children.map(normalizeNode)
            : [];
        return {
            ...node,
            text: node.text == null ? '' : String(node.text),
            children: normalizedChildren
        };
    }

    return data.map(normalizeNode);
}
