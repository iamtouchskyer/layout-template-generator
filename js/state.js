// Application State

const state = {
    activeLayer: 1,
    previewTab: 'preview',
    zoom: 100,
    // L1 - Slide Master
    theme: 'soft_peach_cream',
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
    // Divider state
    dividerLayout: 'cards-highlight',
    dividerSectionCount: 4,
    dividerNumberStyle: 'arabic',  // 'arabic' | 'roman' | 'chinese' | 'circled'
    dividerTextLevel: 'full',      // 'full' | 'compact'
    dividerBgStyle: 'solid',       // 'solid' | 'gradient' | 'split' | 'light'
    dividerIndex: 0,
    expandedDivider: null,
    // SmartArt state
    smartartCategory: 'funnel',
    smartartType: 'funnel-diagram',
    smartartPlacement: 'left-desc',
    expandedSmartartCat: 'funnel',
    // Grid Layout
    gridLayout: 'two-col-equal',
    zoneContents: { A: 'chart', B: 'text' },
};
