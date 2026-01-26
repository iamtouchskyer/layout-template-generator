/**
 * Global State Management
 */

export const state = {
    currentTheme: 'soft_peach_cream',
    currentStyle: 'modern',
    pageSize: '16:9', // '4:3' | '16:9' | '21:9'
    editMode: 'master', // 'master' | 'layout'
    currentLayout: null,
    currentTab: 'preview',
    highlightElements: false,
    currentHTML: '',
    // Master elements configuration (applies to all layouts)
    masterConfig: {
        shapes: [], // Decorative shapes (header-badge, corner-accent, side-bar, etc.)
        placeholders: ['title'], // Title, Body Text, Footer (preset textboxes)
        dynamicFields: ['page-number'], // Date, Page Number (<a:fld> syntax)
    },
    // Per-layout overrides (which master elements to hide)
    layoutOverrides: {},
    // Element position/style overrides { elementId: { x, y, width, height, rotation, fontSize, fontFamily } }
    elementPositions: {},
    // Currently selected element for editing
    selectedElement: null,
    // Visual editing settings
    showGrid: false,
    snapToGrid: true,
    gridSize: 20, // pixels
    // Multi-select for alignment/distribution
    selectedElements: [],
};
