/**
 * Hierarchy Layout - org chart / tree structure
 * Based on OOXML chart3 layout
 */

export function hierarchyLayout(option, config = {}) {
    const { items, size, theme } = option;
    const { direction = 'TB' } = config; // TB (top-bottom), LR (left-right)
    const { width, height } = size;

    const shapes = [];
    const connectors = [];

    // Build tree structure from flat items with parent references
    const tree = buildTree(items);
    const levels = getLevels(tree);
    const maxNodesInLevel = Math.max(...levels.map(l => l.length));

    const nodeWidth = Math.min(150, (width - 40) / (maxNodesInLevel + 0.5));
    const nodeHeight = 50;
    const levelGap = (height - nodeHeight * levels.length) / (levels.length + 1);
    const nodeGap = 20;

    // Level 0 (root) uses parentColor, levels 1+ use childColors
    const childColors = theme.childColors || [theme.accent1, theme.accent2, theme.accent3, theme.accent4, theme.accent5, theme.accent6];

    // Position nodes level by level
    levels.forEach((level, levelIdx) => {
        const levelY = levelGap + levelIdx * (nodeHeight + levelGap);
        const totalWidth = level.length * nodeWidth + (level.length - 1) * nodeGap;
        const startX = (width - totalWidth) / 2;

        level.forEach((node, nodeIdx) => {
            const x = startX + nodeIdx * (nodeWidth + nodeGap);
            const y = levelY;

            node._x = x + nodeWidth / 2;
            node._y = y + nodeHeight / 2;

            // Root level uses parentColor, child levels use childColors
            const fillColor = levelIdx === 0
                ? (theme.parentColor || theme.accent1)
                : childColors[(levelIdx - 1) % childColors.length];

            shapes.push({
                id: node.id || `node-${levelIdx}-${nodeIdx}`,
                type: 'rect',
                x,
                y,
                width: nodeWidth,
                height: nodeHeight,
                text: node.text || node,
                fill: fillColor,
                stroke: theme.light1,
                strokeWidth: 2,
                textColor: theme.light1,
                fontSize: 14,
                rx: 4,
                ry: 4
            });

            // Add connector to parent
            if (node._parent && node._parent._x !== undefined) {
                connectors.push({
                    id: `conn-${node.id}`,
                    type: 'line',
                    x1: node._parent._x,
                    y1: node._parent._y + nodeHeight / 2,
                    x2: node._x,
                    y2: y,
                    stroke: theme.dark1,
                    strokeWidth: 2
                });
            }
        });
    });

    return {
        type: 'hierarchy',
        shapes,
        connectors,
        bounds: { x: 0, y: 0, width, height }
    };
}

function buildTree(items) {
    // Support two formats:
    // 1. Nested: [{text, children: [...]}]
    // 2. Flat: [{text, parentId}]

    if (!items || items.length === 0) {
        return [{ id: 'root', text: 'Root', children: [] }];
    }

    // Check if nested format
    if (items[0].children) {
        return items;
    }

    // Convert flat to nested
    const map = new Map();
    const roots = [];

    items.forEach((item, idx) => {
        const node = {
            id: item.id || `node-${idx}`,
            text: item.text || item,
            children: [],
            _parent: null
        };
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
            if (node.children && node.children.length > 0) {
                traverse(node.children, level + 1);
            }
        });
    }

    traverse(tree, 0);
    return levels;
}
