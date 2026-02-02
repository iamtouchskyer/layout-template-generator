// Application State

const state = {
    activeLayer: 1,
    previewTab: 'preview',
    zoom: 100,
    // L1 - Slide Master
    theme: 'forest_green',
    // masterShapes: two formats supported:
    // Old preset-based: { id, preset } (for header-badge, header-line, footer-line)
    // New thickness-positions: { id, thickness, positions: [] } (for side-bar, corner, corner-dots, etc.)
    masterShapes: [],
    // masterPlaceholders: { id: { enabled, position, size?, imageUrl? } }
    masterPlaceholders: {
        logo: { enabled: false, position: 'tl', size: 'medium', imageUrl: null },
        'page-number': { enabled: true, position: 'br' },
        date: { enabled: false, position: 'bl' }
    },
    // masterContentAreas: title and footer config (part of slide master)
    masterContentAreas: {
        titleStyle: 'with-tag',      // 'none' | 'simple' | 'with-tag'
        headerHeight: 'compact',     // 'compact' | 'normal' | 'spacious'
        sourceStyle: 'citation',     // 'none' | 'citation'
        footerHeight: 'compact',     // 'compact' | 'normal' | 'spacious'
    },
    // L2 - Page Type
    pageType: 'content-grid',      // 'cover' | 'divider' | 'content-grid' | 'content-smartart'
    // Cover state
    coverLayout: 'cross_rectangles',  // 'cross_rectangles' | 'triangle_stack' | 'checkerboard' | 'dual_circles'
    coverContent: {
        year: '2025',
        title: '年度汇报',
        highlight: 'XXXX项目',
        subtitle: '本次演示将围绕项目展开，旨在向您展示年度的重点工作',
        tag: '工作汇报',
        brandTag: '人力资源工作总结汇报',
        footer: {
            location: '芝士科技大厦',
            date: '2025.01',
            contact: '400-123-4567',
            logo: 'LOGO'
        }
    },
    // Divider state
    dividerLayout: 'cards-highlight',
    dividerSectionCount: 4,
    dividerNumberStyle: 'arabic',  // 'arabic' | 'roman' | 'chinese' | 'circled'
    dividerTextLevel: 'full',      // 'full' | 'compact'
    dividerBgStyle: 'solid',       // 'solid' | 'gradient' | 'split' | 'light'
    dividerIndex: 0,
    expandedDivider: null,
    // SmartArt state
    smartartCategory: 'pyramid',
    smartartType: 'pyramid',
    smartartPlacement: 'left-desc',
    smartartItemCount: 4,
    smartartColorScheme: 'colorful1',  // see SMARTART_COLOR_SCHEMES in config.js
    smartartItems: null,  // null = use sample data, array = custom content
    expandedSmartartCat: 'pyramid',
    // Grid Layout
    gridLayout: 'two-col-equal',
    zoneContents: { A: 'chart', B: 'text' },
};
