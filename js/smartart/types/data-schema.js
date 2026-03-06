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
    'chart3': {
        schema: SCHEMA_FLAT,
        itemCount: 3,
        bulletFromLevel: Infinity,
        labels: { item: '分段' },
        description: 'Basic pie - 3 full segments'
    },
    'cycle-segmented': {
        schema: SCHEMA_FLAT,
        itemCount: 3,
        bulletFromLevel: Infinity,  // pie segments are shapes
        labels: { item: '分段' },
        description: 'Pie segments, no children'
    },

    // ========== Radial Variant Types ==========
    'radial1': {
        schema: SCHEMA_FLAT,
        itemCount: 5,
        bulletFromLevel: Infinity,
        labels: { item: '节点' },
        description: 'Radial cycle - center + satellite ellipses with lines'
    },
    'radial3': {
        schema: SCHEMA_FLAT,
        itemCount: 5,
        bulletFromLevel: Infinity,
        labels: { item: '节点' },
        description: 'Basic venn - overlapping ellipses in a ring'
    },
    'radial5': {
        schema: SCHEMA_FLAT,
        itemCount: 5,
        bulletFromLevel: Infinity,
        labels: { item: '节点' },
        description: 'Diverging radial - center + satellites with arrows'
    },
    'radial6': {
        schema: SCHEMA_FLAT,
        itemCount: 5,
        bulletFromLevel: Infinity,
        labels: { item: '节点' },
        description: 'Radial list - center + satellites with block arcs'
    },
    'radial-cluster': {
        schema: SCHEMA_FLAT,
        itemCount: 4,
        bulletFromLevel: Infinity,
        labels: { item: '节点' },
        description: 'Radial cluster - center + satellite roundRects'
    },
    'circle-arrow-process': {
        schema: SCHEMA_FLAT,
        itemCount: 3,
        bulletFromLevel: Infinity,
        labels: { item: '步骤' },
        description: 'Circle arrow process - rects with circular arrows'
    },

    // ========== Venn Types ==========
    'venn2': {
        schema: SCHEMA_FLAT,
        itemCount: 4,
        bulletFromLevel: Infinity,
        labels: { item: '节点' },
        description: 'Linear Venn - overlapping ellipses in a row'
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

    // ========== Extended List Types ==========
    'default': {
        schema: SCHEMA_FLAT,
        itemCount: 5,
        bulletFromLevel: Infinity,
        labels: { item: '项目' },
        description: 'Default vertical block list'
    },
    'lined-list': {
        schema: SCHEMA_FLAT,
        itemCount: 3,
        bulletFromLevel: Infinity,
        labels: { item: '项目' },
        description: 'Lined list with sidebar and separators'
    },
    'v-list2': {
        schema: SCHEMA_HIERARCHICAL,
        itemCount: 2,
        childCount: 1,
        bulletFromLevel: 1,
        labels: { item: '标题', child: '内容' },
        description: 'Vertical accent list - accent + content pairs'
    },
    'v-list5': {
        schema: SCHEMA_HIERARCHICAL,
        itemCount: 3,
        childCount: 1,
        bulletFromLevel: 1,
        labels: { item: '标题', child: '内容' },
        description: 'Vertical bullet list variant'
    },
    'v-list6': {
        schema: SCHEMA_FLAT,
        itemCount: 4,
        bulletFromLevel: Infinity,
        labels: { item: '项目' },
        description: 'Vertical circle list variant'
    },
    'vertical-accent-list': {
        schema: SCHEMA_HIERARCHICAL,
        itemCount: 3,
        childCount: 1,
        bulletFromLevel: 1,
        labels: { item: '标题', child: '内容' },
        description: 'Vertical accent list (2008)'
    },
    'vertical-curved-list': {
        schema: SCHEMA_FLAT,
        itemCount: 4,
        bulletFromLevel: Infinity,
        labels: { item: '项目' },
        description: 'Vertical curved list'
    },
    'h-list1': {
        schema: SCHEMA_HIERARCHICAL,
        itemCount: 3,
        childCount: 1,
        bulletFromLevel: 1,
        labels: { item: '标题', child: '说明' },
        description: 'Horizontal bullet list - title + desc columns'
    },
    'h-list2': {
        schema: SCHEMA_HIERARCHICAL,
        itemCount: 3,
        childCount: 2,
        bulletFromLevel: 1,
        labels: { item: '标题', child: '子项' },
        description: 'Table list - title + 2 sub-items per column'
    },
    'h-list3': {
        schema: SCHEMA_HIERARCHICAL,
        itemCount: 3,
        childCount: 2,
        bulletFromLevel: 1,
        labels: { item: '标题', child: '子项' },
        description: 'Horizontal list variant 3'
    },
    'h-list6': {
        schema: SCHEMA_HIERARCHICAL,
        itemCount: 3,
        childCount: 1,
        bulletFromLevel: 1,
        labels: { item: '标题', child: '说明' },
        description: 'Horizontal list variant 6'
    },
    'h-list7': {
        schema: SCHEMA_HIERARCHICAL,
        itemCount: 2,
        childCount: 1,
        bulletFromLevel: 1,
        labels: { item: '标题', child: '说明' },
        description: 'Horizontal list variant 7'
    },
    'square-accent-list': {
        schema: SCHEMA_HIERARCHICAL,
        itemCount: 4,
        childCount: 3,
        bulletFromLevel: 1,
        labels: { item: '标题', child: '子项' },
        description: 'Column list with top accents and square child bullets'
    },
    'picture-strips': {
        schema: SCHEMA_FLAT,
        itemCount: 3,
        bulletFromLevel: Infinity,
        labels: { item: '图片' },
        description: 'Horizontal picture strips with text'
    },
    'alternating-picture-blocks': {
        schema: SCHEMA_FLAT,
        itemCount: 3,
        bulletFromLevel: Infinity,
        labels: { item: '图片' },
        description: 'Alternating left/right picture blocks'
    },

    'p-list1': {
        schema: SCHEMA_FLAT,
        itemCount: 4,
        bulletFromLevel: Infinity,
        labels: { item: '图片' },
        description: 'Picture list - roundRect placeholder + text'
    },
    'chevron2': {
        schema: SCHEMA_FLAT,
        itemCount: 3,
        bulletFromLevel: Infinity,
        labels: { item: '步骤' },
        description: 'Chevron list - accent block + chevron pairs'
    },
    'arrow1': {
        schema: SCHEMA_FLAT,
        itemCount: 2,
        bulletFromLevel: Infinity,
        labels: { item: '箭头' },
        description: 'Two opposing up arrows'
    },
    'arrow4': {
        schema: SCHEMA_FLAT,
        itemCount: 4,
        bulletFromLevel: Infinity,
        labels: { item: '项目' },
        description: 'Balance - up/down arrows with labels'
    },
    'h-list9': {
        schema: SCHEMA_HIERARCHICAL,
        itemCount: 2,
        childCount: 1,
        bulletFromLevel: 1,
        labels: { item: '标题', child: '内容' },
        description: '2-item list with ellipse tab + 2 stacked rects'
    },
    'b-list2': {
        schema: SCHEMA_HIERARCHICAL,
        itemCount: 3,
        childCount: 1,
        bulletFromLevel: 1,
        labels: { item: '标题', child: '说明' },
        description: 'Bending picture list with accent blocks'
    },
    'p-list2': {
        schema: SCHEMA_FLAT,
        itemCount: 5,
        bulletFromLevel: Infinity,
        labels: { item: '图片' },
        description: 'Banner + horizontal columns with pic and text'
    },
    'picture-accent-list': {
        schema: SCHEMA_FLAT,
        itemCount: 4,
        bulletFromLevel: Infinity,
        labels: { item: '图片' },
        description: 'Picture accent list'
    },
    'block-descending-list': {
        schema: SCHEMA_FLAT,
        itemCount: 5,
        bulletFromLevel: Infinity,
        labels: { item: '步骤' },
        description: 'Block descending list'
    },
    'l-process2': {
        schema: SCHEMA_HIERARCHICAL,
        itemCount: 5,
        childCount: 1,
        bulletFromLevel: 1,
        labels: { item: '步骤', child: '说明' },
        description: 'L-shaped process with paired roundRects'
    },
    'h-process7': {
        schema: SCHEMA_HIERARCHICAL,
        itemCount: 5,
        childCount: 1,
        bulletFromLevel: 1,
        labels: { item: '步骤', child: '说明' },
        description: 'Sub-step process with descriptions + triangle arrows'
    },
    'increasing-circle-process': {
        schema: SCHEMA_HIERARCHICAL,
        itemCount: 5,
        childCount: 1,
        bulletFromLevel: 1,
        labels: { item: '步骤', child: '说明' },
        description: 'Increasing circle process with labels'
    },
    'pie-process': {
        schema: SCHEMA_HIERARCHICAL,
        itemCount: 5,
        childCount: 1,
        bulletFromLevel: 1,
        labels: { item: '步骤', child: '说明' },
        description: 'Pie process with progress indicators'
    },
    'process4': {
        schema: SCHEMA_FLAT,
        itemCount: 5,
        bulletFromLevel: Infinity,
        labels: { item: '步骤' },
        description: 'Step down process'
    },
    'target3': {
        schema: SCHEMA_FLAT,
        itemCount: 5,
        bulletFromLevel: Infinity,
        labels: { item: '目标' },
        description: 'Nested target'
    },
    'hierarchy3': {
        schema: SCHEMA_HIERARCHICAL,
        itemCount: 1,
        childCount: 3,
        maxDepth: 3,
        bulletFromLevel: 2,
        labels: { item: '根节点', child: '子节点' },
        description: 'Horizontal hierarchy'
    },
    'hierarchy4': {
        schema: SCHEMA_HIERARCHICAL,
        itemCount: 1,
        childCount: 3,
        maxDepth: 3,
        bulletFromLevel: 2,
        labels: { item: '根节点', child: '子节点' },
        description: 'Horizontal multi-level hierarchy'
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
