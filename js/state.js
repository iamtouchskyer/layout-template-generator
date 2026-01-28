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
    pageType: 'content-grid',      // 'cover' | 'divider' | 'content-grid' | 'content-smartart'
    // Divider state
    dividerLayout: 'cards-highlight',
    dividerIndex: 0,
    expandedDivider: null,
    // SmartArt state
    smartartCategory: 'funnel',
    smartartType: 'funnel-diagram',
    smartartPlacement: 'left-desc',
    expandedSmartartCat: 'funnel',
    // Grid Layout (merged L3+L4)
    gridLayout: 'two-col-equal',
    zoneContents: { A: 'chart', B: 'text' },
    titleStyle: 'with-tag',
    sourceStyle: 'citation',
};
