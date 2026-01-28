// Application State

const state = {
    activeLayer: 1,
    previewTab: 'preview',
    zoom: 100,
    // L1
    theme: 'soft_peach_cream',
    masterShapes: [],
    masterPlaceholders: ['page-number'],
    // L2
    pageType: 'content',           // 'content' | 'cover' | 'divider'
    dividerLayout: 'cards-highlight', // which divider layout style
    dividerIndex: 0,               // 0=全部(TOC), 1-4=specific section
    expandedDivider: null,         // which divider group is expanded
    // L3
    titleStyle: 'with-tag',
    layoutType: 'chart-left',
    gridPattern: 'two-equal',
    sourceStyle: 'citation',
    // L4
    cards: [{ type: 'chart' }, { type: 'text' }]
};
