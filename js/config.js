/**
 * UI-specific configuration
 * Note: Slide/shape/layout config is loaded from /config/slide-master.json
 * This file only contains UI-specific mappings and legacy configs
 */

// Page Types (UI display)
const PAGE_TYPES = {
    'cover': { label: '封面', category: 'cover' },
    'divider': { label: '目录/章节页', category: 'divider' },
    'content-grid': { label: '内容页-Grid', category: 'content' },
    'content-smartart': { label: '内容页-SmartArt', category: 'content' },
};

// Layout Types (for L3 content layouts - legacy)
const LAYOUT_TYPES = {
    'image-left': { label: 'Image Left', category: 'image', zones: ['image', 'text'] },
    'image-right': { label: 'Image Right', category: 'image', zones: ['text', 'image'] },
    'chart-left': { label: 'Chart Left', category: 'chart', zones: ['chart', 'text'] },
    'chart-right': { label: 'Chart Right', category: 'chart', zones: ['text', 'chart'] },
    'no-image': { label: 'No Image', category: 'text', zones: ['text'] },
    'big-number': { label: 'Big Number', category: 'text', zones: ['metric'] },
    'two-column-equal': { label: 'Two Column', category: 'comparison', zones: ['text', 'text'] },
};

// Card Types (for zone content)
const CARD_TYPES = [
    { id: 'chart', label: 'Chart' },
    { id: 'text', label: 'Text / Bullets' },
    { id: 'metric', label: 'Big Number' },
    { id: 'table', label: 'Table' },
    { id: 'combo', label: 'Icon Grid' },
    { id: 'image', label: 'Image' },
];

// Zone to card type mapping
const ZONE_TO_CARD_TYPE = {
    'image': 'image', 'chart': 'chart', 'text': 'text', 'metric': 'metric',
    'quote': 'text', 'list': 'text', 'summary': 'text', 'card': 'text',
};

// SmartArt metadata is generated from smartart/catalog.json.
// Fallback values are kept for safety when generated file is unavailable.
const SMARTART_DEFAULT_CATEGORIES = {
    'matrix': { label: 'Matrix', desc: '矩阵/循环结构' },
    'cycle': { label: 'Cycle', desc: '循环结构' },
    'pyramid': { label: 'Pyramid', desc: '金字塔/漏斗结构' },
    'others': { label: 'Others', desc: '其他图形' },
};

const SMARTART_DEFAULT_TYPES = {
    'matrix': { category: 'matrix', label: '标题矩阵', ooxmlId: 'matrix1' },
    'matrix-titled': { category: 'matrix', label: '基础矩阵', ooxmlId: 'matrix2' },
    'matrix-cycle': { category: 'matrix', label: '循环矩阵', ooxmlId: 'matrix3' },
    'cycle': { category: 'cycle', label: '块状循环', ooxmlId: 'cycle4' },
    'cycle1': { category: 'cycle', label: '基础循环', ooxmlId: 'cycle1' },
    'cycle2': { category: 'cycle', label: '文本循环', ooxmlId: 'cycle2' },
    'cycle3': { category: 'cycle', label: '分段循环', ooxmlId: 'cycle3' },
    'cycle5': { category: 'cycle', label: '无方向循环', ooxmlId: 'cycle5' },
    'cycle6': { category: 'cycle', label: '连续循环', ooxmlId: 'cycle6' },
    'cycle7': { category: 'cycle', label: '三段循环', ooxmlId: 'cycle7' },
    'cycle8': { category: 'cycle', label: '扇区循环', ooxmlId: 'cycle8' },
    'pyramid': { category: 'pyramid', label: '基础金字塔', ooxmlId: 'pyramid1' },
    'pyramid-list': { category: 'pyramid', label: '金字塔列表', ooxmlId: 'pyramid2' },
    'pyramid-inverted': { category: 'pyramid', label: '倒漏斗', ooxmlId: 'pyramid3' },
    'pyramid-segmented': { category: 'pyramid', label: '分段金字塔', ooxmlId: 'pyramid4' },
    'chevron': { category: 'others', label: '基础流程', ooxmlId: 'chevron1' },
    'arrow-process': { category: 'others', label: '流程箭头', ooxmlId: 'arrow2' },
    'descending-process': { category: 'others', label: '下降流程', ooxmlId: 'DescendingProcess' },
    'cycle-segmented': { category: 'others', label: '分段循环', ooxmlId: 'cycle8' },
    'hierarchy': { category: 'others', label: '组织架构', ooxmlId: 'chart3' },
    'radial': { category: 'others', label: '发散图', ooxmlId: 'radial3' },
    'list': { category: 'others', label: '基础列表', ooxmlId: 'default' },
    'list-vertical': { category: 'others', label: '垂直列表', ooxmlId: 'vList3' },
    'hexagon-alternating': { category: 'others', label: '交替六边形', ooxmlId: 'AlternatingHexagons' },
    'picture-accent': { category: 'others', label: '突出图片', ooxmlId: 'AccentedPicture' },
    'picture-captioned': { category: 'others', label: '带标题图片', ooxmlId: 'CaptionedPictures' },
};

const SMARTART_CATEGORIES = window.SMARTART_CATEGORIES || SMARTART_DEFAULT_CATEGORIES;
const SMARTART_TYPES = window.SMARTART_TYPES || SMARTART_DEFAULT_TYPES;

const SITE_UI_LANG_STORAGE_KEY = 'site_ui_lang';

const SITE_UI_TEXT = {
    zh: {
        undo: '撤销',
        redo: '重做',
        importJson: '导入 JSON',
        exportJson: '导出 JSON',
        generatePptx: '生成 PPTX',
        l1Title: '主题与母版',
        l2Title: '页面类型',
        previewTitle: '预览',
        zoom: '缩放',
        previewTab: '预览',
        jsonTab: 'JSON',
        contentTitle: '标题',
        contentTag: '标签',
        contentSource: '来源',
        pageModelTitle: '页面模型',
        pageShell: '页面壳',
        bodyRenderer: '内容渲染器',
        bodyLayout: '内容布局',
        pageTypeCompat: '页面类型 (兼容)',
        pageTypeCover: '封面',
        pageTypeDivider: '目录/章节',
        pageTypeGrid: '内容-Grid',
        pageTypeSmartart: '内容-SmartArt',
        pageTypeDescCover: '封面',
        pageTypeDescDivider: '目录页',
        pageTypeDescGrid: '卡片/图表布局',
        pageTypeDescSmartart: '关系图形',
        coverLayout: '封面布局',
        dividerLayout: '布局样式',
        dividerCount: '章节数量',
        dividerNumber: '编号样式',
        dividerTextLevel: '文字层级',
        dividerBg: '背景样式',
        dividerIndex: '当前章节',
        gridLayoutMode: '布局模式',
        gridZoneContent: '区域内容',
        pageMoveUp: '上移',
        pageMoveDown: '下移',
        pageDuplicate: '复制',
        pageDelete: '删除',
        pageAddCover: '+ 封面',
        pageAddDivider: '+ 目录',
        pageSectionPrefix: '章节',
        smartartType: '类型',
        smartartCount: '数量',
        smartartPlacement: '布局',
        smartartColors: '配色',
    },
    en: {
        undo: 'Undo',
        redo: 'Redo',
        importJson: 'Import JSON',
        exportJson: 'Export JSON',
        generatePptx: 'Generate PPTX',
        l1Title: 'Theme & Master',
        l2Title: 'Page Type',
        previewTitle: 'Preview',
        zoom: 'Zoom',
        previewTab: 'Preview',
        jsonTab: 'JSON',
        contentTitle: 'Title',
        contentTag: 'Tag',
        contentSource: 'Source',
        pageModelTitle: 'Page Model',
        pageShell: 'Page Shell',
        bodyRenderer: 'Body Renderer',
        bodyLayout: 'Body Layout',
        pageTypeCompat: 'Page Type (Legacy)',
        pageTypeCover: 'Cover',
        pageTypeDivider: 'Divider',
        pageTypeGrid: 'Content-Grid',
        pageTypeSmartart: 'Content-SmartArt',
        pageTypeDescCover: 'Cover',
        pageTypeDescDivider: 'Divider',
        pageTypeDescGrid: 'Cards/Charts Layout',
        pageTypeDescSmartart: 'SmartArt Diagram',
        coverLayout: 'Cover Layout',
        dividerLayout: 'Layout Style',
        dividerCount: 'Section Count',
        dividerNumber: 'Number Style',
        dividerTextLevel: 'Text Level',
        dividerBg: 'Background Style',
        dividerIndex: 'Current Section',
        gridLayoutMode: 'Layout Mode',
        gridZoneContent: 'Zone Content',
        pageMoveUp: 'Move up',
        pageMoveDown: 'Move down',
        pageDuplicate: 'Duplicate',
        pageDelete: 'Delete',
        pageAddCover: '+ Cover',
        pageAddDivider: '+ Divider',
        pageSectionPrefix: 'Section',
        smartartType: 'Type',
        smartartCount: 'Count',
        smartartPlacement: 'Placement',
        smartartColors: 'Colors',
    },
};

function getSiteUILang() {
    const forced = String(window.APP_UI_LANG || '').toLowerCase();
    if (forced === 'zh' || forced === 'en') return forced;

    const persisted = String(localStorage.getItem(SITE_UI_LANG_STORAGE_KEY) || '').toLowerCase();
    if (persisted === 'zh' || persisted === 'en') return persisted;

    return 'zh';
}

function setSiteUILang(lang) {
    const normalized = String(lang || '').toLowerCase() === 'en' ? 'en' : 'zh';
    window.APP_UI_LANG = normalized;
    window.SMARTART_UI_LANG = normalized;
    localStorage.setItem(SITE_UI_LANG_STORAGE_KEY, normalized);
    return normalized;
}

function getSiteUIText(key, lang = getSiteUILang()) {
    return SITE_UI_TEXT[lang]?.[key] || SITE_UI_TEXT.zh[key] || key;
}

function applySiteI18n(lang = getSiteUILang()) {
    const normalized = setSiteUILang(lang);
    const setText = (id, key) => {
        const el = document.getElementById(id);
        if (el) el.textContent = getSiteUIText(key, normalized);
    };

    setText('btn-undo', 'undo');
    setText('btn-redo', 'redo');
    setText('btn-import-json', 'importJson');
    setText('btn-export-json', 'exportJson');
    setText('btn-generate-pptx', 'generatePptx');
    setText('title-l1', 'l1Title');
    setText('title-l2', 'l2Title');
    setText('title-preview', 'previewTitle');
    setText('label-zoom', 'zoom');
    setText('tab-preview', 'previewTab');
    setText('tab-json', 'jsonTab');
    setText('label-content-title', 'contentTitle');
    setText('label-content-tag', 'contentTag');
    setText('label-content-source', 'contentSource');
    setText('title-page-model', 'pageModelTitle');
    setText('label-page-shell', 'pageShell');
    setText('label-body-renderer', 'bodyRenderer');
    setText('label-body-layout', 'bodyLayout');
    setText('title-page-type-compat', 'pageTypeCompat');
    setText('label-page-type-cover', 'pageTypeCover');
    setText('label-page-type-divider', 'pageTypeDivider');
    setText('label-page-type-grid', 'pageTypeGrid');
    setText('label-page-type-smartart', 'pageTypeSmartart');
    setText('desc-page-type-cover', 'pageTypeDescCover');
    setText('desc-page-type-divider', 'pageTypeDescDivider');
    setText('desc-page-type-grid', 'pageTypeDescGrid');
    setText('desc-page-type-smartart', 'pageTypeDescSmartart');
    setText('label-cover-layout', 'coverLayout');
    setText('label-divider-layout', 'dividerLayout');
    setText('label-divider-count', 'dividerCount');
    setText('label-divider-number', 'dividerNumber');
    setText('label-divider-text-level', 'dividerTextLevel');
    setText('label-divider-bg', 'dividerBg');
    setText('label-divider-index', 'dividerIndex');
    setText('label-grid-layout-mode', 'gridLayoutMode');
    setText('label-grid-zone-content', 'gridZoneContent');
    setText('label-smartart-type', 'smartartType');
    setText('label-smartart-count', 'smartartCount');
    setText('label-smartart-placement', 'smartartPlacement');
    setText('label-smartart-colors', 'smartartColors');

    const langSelect = document.getElementById('ui-language-select');
    if (langSelect) langSelect.value = normalized;
    document.documentElement.lang = normalized === 'zh' ? 'zh-CN' : 'en';
}

function getSmartArtUILang() {
    const forced = String(window.SMARTART_UI_LANG || '').toLowerCase();
    if (forced === 'zh' || forced === 'en') return forced;
    return getSiteUILang();
}

function getSmartArtTypeLabel(typeInfo, _lang = getSmartArtUILang()) {
    if (!typeInfo) return '';
    const en = typeInfo.labelEn || typeInfo.nameEn || typeInfo.label;
    const zh = typeInfo.labelZh || typeInfo.name || typeInfo.label;
    // SmartArt type names should always follow PPT English naming.
    return en || zh || '';
}

function getSmartArtCategoryLabel(categoryInfo, lang = getSmartArtUILang()) {
    if (!categoryInfo) return '';
    const zh = categoryInfo.labelZh || categoryInfo.label;
    const en = categoryInfo.labelEn || categoryInfo.label;
    return lang === 'zh' ? (zh || en || '') : (en || zh || '');
}

function getSmartArtPlacementLabel(placementInfo, lang = getSmartArtUILang()) {
    if (!placementInfo) return '';
    const zh = placementInfo.labelZh || placementInfo.label;
    const en = placementInfo.labelEn || placementInfo.label;
    return lang === 'zh' ? (zh || en || '') : (en || zh || '');
}

function getSmartArtPlacementDesc(placementInfo, lang = getSmartArtUILang()) {
    if (!placementInfo) return '';
    const zh = placementInfo.descZh || placementInfo.desc;
    const en = placementInfo.descEn || placementInfo.desc;
    return lang === 'zh' ? (zh || en || '') : (en || zh || '');
}

// SmartArt Placements
const SMARTART_PLACEMENTS = {
    'full': {
        label: 'Full',
        labelEn: 'Full',
        labelZh: '全屏',
        desc: 'SmartArt fills the content area',
        descEn: 'SmartArt fills the content area',
        descZh: 'SmartArt占满内容区',
    },
    'left-desc': {
        label: 'Graphic Left',
        labelEn: 'Graphic Left',
        labelZh: '左图右文',
        desc: 'SmartArt on left + description on right',
        descEn: 'SmartArt on left + description on right',
        descZh: 'SmartArt左侧 + 右侧描述',
    },
    'right-desc': {
        label: 'Graphic Right',
        labelEn: 'Graphic Right',
        labelZh: '左文右图',
        desc: 'Description on left + SmartArt on right',
        descEn: 'Description on left + SmartArt on right',
        descZh: '左侧描述 + SmartArt右侧',
    },
    'top-desc': {
        label: 'Graphic Top',
        labelEn: 'Graphic Top',
        labelZh: '上图下文',
        desc: 'SmartArt on top + description below',
        descEn: 'SmartArt on top + description below',
        descZh: 'SmartArt上方 + 下方描述',
    },
    'bottom-desc': {
        label: 'Graphic Bottom',
        labelEn: 'Graphic Bottom',
        labelZh: '上文下图',
        desc: 'Description on top + SmartArt below',
        descEn: 'Description on top + SmartArt below',
        descZh: '上方描述 + SmartArt下方',
    },
};

// Helper: lighten/darken a hex color
function adjustColor(hex, percent) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const adjust = (c) => Math.min(255, Math.max(0, Math.round(c + (255 - c) * percent / 100)));
    const darken = (c) => Math.min(255, Math.max(0, Math.round(c * (1 + percent / 100))));
    const fn = percent > 0 ? adjust : darken;
    return '#' + [fn(r), fn(g), fn(b)].map(c => c.toString(16).padStart(2, '0')).join('');
}

// Generate SmartArt color schemes dynamically from theme's accentColors
function getSmartArtColorSchemes(themeId) {
    const theme = window.THEMES?.[themeId];
    const accents = theme?.accentColors || ['#156082', '#E97132', '#196B24', '#0F9ED5', '#A02B93', '#4EA72E'];
    const [a1, a2, a3, a4, a5, a6] = accents;

    return [
        {
            group: 'primary',
            label: 'Primary Theme Colors',
            items: [
                { id: 'primary1', colors: ['#E8E8E8', '#C0C0C0', '#909090'], accents: ['#E8E8E8', '#D0D0D0', '#B8B8B8', '#A0A0A0', '#888888', '#707070'] },
                { id: 'primary2', colors: ['#A0A0A0', '#808080', '#606060'], accents: ['#A0A0A0', '#909090', '#808080', '#707070', '#606060', '#505050'] },
                { id: 'primary3', colors: [a1, adjustColor(a1, 20), adjustColor(a1, 40)], accents: [adjustColor(a1, -30), adjustColor(a1, -15), a1, adjustColor(a1, 20), adjustColor(a1, 40), adjustColor(a1, 60)] },
            ]
        },
        {
            group: 'colorful',
            label: 'Colorful',
            items: [
                { id: 'colorful1', colors: [a1, a2, a3], accents: [a1, a2, a3, a4, a5, a6] },
                { id: 'colorful2', colors: [a2, a3, a4], accents: [a2, a3, a4, a5, a6, a1] },
                { id: 'colorful3', colors: [a3, a4, a5], accents: [a3, a4, a5, a6, a1, a2] },
                { id: 'colorful4', colors: [a4, a5, a6], accents: [a4, a5, a6, a1, a2, a3] },
                { id: 'colorful5', colors: [a5, a6, a1], accents: [a5, a6, a1, a2, a3, a4] },
            ]
        },
        {
            group: 'accent1',
            label: 'Accent 1',
            items: [
                { id: 'accent1-1', colors: [a1, a1, a1], accents: [a1, a1, a1, a1, a1, a1], outline: true },
                { id: 'accent1-2', colors: [a1, adjustColor(a1, 25), adjustColor(a1, 50)], accents: [adjustColor(a1, -40), adjustColor(a1, -20), a1, adjustColor(a1, 25), adjustColor(a1, 50), adjustColor(a1, 70)] },
                { id: 'accent1-3', colors: [a1, a1, a1], accents: [a1, a1, a1, a1, a1, a1] },
                { id: 'accent1-4', colors: [adjustColor(a1, 70), adjustColor(a1, 25), adjustColor(a1, -40)], accents: [adjustColor(a1, 70), adjustColor(a1, 50), adjustColor(a1, 25), a1, adjustColor(a1, -20), adjustColor(a1, -40)] },
                { id: 'accent1-5', colors: [adjustColor(a1, 80), adjustColor(a1, 60), adjustColor(a1, 30)], accents: [adjustColor(a1, 80), adjustColor(a1, 70), adjustColor(a1, 60), adjustColor(a1, 45), adjustColor(a1, 30), a1] },
            ]
        },
        {
            group: 'accent2',
            label: 'Accent 2',
            items: [
                { id: 'accent2-1', colors: [a2, a2, a2], accents: [a2, a2, a2, a2, a2, a2], outline: true },
                { id: 'accent2-2', colors: [a2, adjustColor(a2, 25), adjustColor(a2, 50)], accents: [adjustColor(a2, -40), adjustColor(a2, -20), a2, adjustColor(a2, 25), adjustColor(a2, 50), adjustColor(a2, 70)] },
                { id: 'accent2-3', colors: [a2, a2, a2], accents: [a2, a2, a2, a2, a2, a2] },
                { id: 'accent2-4', colors: [adjustColor(a2, 70), adjustColor(a2, 25), adjustColor(a2, -40)], accents: [adjustColor(a2, 70), adjustColor(a2, 50), adjustColor(a2, 25), a2, adjustColor(a2, -20), adjustColor(a2, -40)] },
                { id: 'accent2-5', colors: [adjustColor(a2, 80), adjustColor(a2, 60), adjustColor(a2, 30)], accents: [adjustColor(a2, 80), adjustColor(a2, 70), adjustColor(a2, 60), adjustColor(a2, 45), adjustColor(a2, 30), a2] },
            ]
        },
        {
            group: 'accent3',
            label: 'Accent 3',
            items: [
                { id: 'accent3-1', colors: [a3, a3, a3], accents: [a3, a3, a3, a3, a3, a3], outline: true },
                { id: 'accent3-2', colors: [a3, adjustColor(a3, 25), adjustColor(a3, 50)], accents: [adjustColor(a3, -40), adjustColor(a3, -20), a3, adjustColor(a3, 25), adjustColor(a3, 50), adjustColor(a3, 70)] },
                { id: 'accent3-3', colors: [a3, a3, a3], accents: [a3, a3, a3, a3, a3, a3] },
                { id: 'accent3-4', colors: [adjustColor(a3, 70), adjustColor(a3, 25), adjustColor(a3, -40)], accents: [adjustColor(a3, 70), adjustColor(a3, 50), adjustColor(a3, 25), a3, adjustColor(a3, -20), adjustColor(a3, -40)] },
                { id: 'accent3-5', colors: [adjustColor(a3, 80), adjustColor(a3, 60), adjustColor(a3, 30)], accents: [adjustColor(a3, 80), adjustColor(a3, 70), adjustColor(a3, 60), adjustColor(a3, 45), adjustColor(a3, 30), a3] },
            ]
        },
        {
            group: 'accent4',
            label: 'Accent 4',
            items: [
                { id: 'accent4-1', colors: [a4, a4, a4], accents: [a4, a4, a4, a4, a4, a4], outline: true },
                { id: 'accent4-2', colors: [a4, adjustColor(a4, 25), adjustColor(a4, 50)], accents: [adjustColor(a4, -40), adjustColor(a4, -20), a4, adjustColor(a4, 25), adjustColor(a4, 50), adjustColor(a4, 70)] },
                { id: 'accent4-3', colors: [a4, a4, a4], accents: [a4, a4, a4, a4, a4, a4] },
                { id: 'accent4-4', colors: [adjustColor(a4, 70), adjustColor(a4, 25), adjustColor(a4, -40)], accents: [adjustColor(a4, 70), adjustColor(a4, 50), adjustColor(a4, 25), a4, adjustColor(a4, -20), adjustColor(a4, -40)] },
                { id: 'accent4-5', colors: [adjustColor(a4, 80), adjustColor(a4, 60), adjustColor(a4, 30)], accents: [adjustColor(a4, 80), adjustColor(a4, 70), adjustColor(a4, 60), adjustColor(a4, 45), adjustColor(a4, 30), a4] },
            ]
        },
        {
            group: 'accent5',
            label: 'Accent 5',
            items: [
                { id: 'accent5-1', colors: [a5, a5, a5], accents: [a5, a5, a5, a5, a5, a5], outline: true },
                { id: 'accent5-2', colors: [a5, adjustColor(a5, 25), adjustColor(a5, 50)], accents: [adjustColor(a5, -40), adjustColor(a5, -20), a5, adjustColor(a5, 25), adjustColor(a5, 50), adjustColor(a5, 70)] },
                { id: 'accent5-3', colors: [a5, a5, a5], accents: [a5, a5, a5, a5, a5, a5] },
                { id: 'accent5-4', colors: [adjustColor(a5, 70), adjustColor(a5, 25), adjustColor(a5, -40)], accents: [adjustColor(a5, 70), adjustColor(a5, 50), adjustColor(a5, 25), a5, adjustColor(a5, -20), adjustColor(a5, -40)] },
                { id: 'accent5-5', colors: [adjustColor(a5, 80), adjustColor(a5, 60), adjustColor(a5, 30)], accents: [adjustColor(a5, 80), adjustColor(a5, 70), adjustColor(a5, 60), adjustColor(a5, 45), adjustColor(a5, 30), a5] },
            ]
        },
        {
            group: 'accent6',
            label: 'Accent 6',
            items: [
                { id: 'accent6-1', colors: [a6, a6, a6], accents: [a6, a6, a6, a6, a6, a6], outline: true },
                { id: 'accent6-2', colors: [a6, adjustColor(a6, 25), adjustColor(a6, 50)], accents: [adjustColor(a6, -40), adjustColor(a6, -20), a6, adjustColor(a6, 25), adjustColor(a6, 50), adjustColor(a6, 70)] },
                { id: 'accent6-3', colors: [a6, a6, a6], accents: [a6, a6, a6, a6, a6, a6] },
                { id: 'accent6-4', colors: [adjustColor(a6, 70), adjustColor(a6, 25), adjustColor(a6, -40)], accents: [adjustColor(a6, 70), adjustColor(a6, 50), adjustColor(a6, 25), a6, adjustColor(a6, -20), adjustColor(a6, -40)] },
                { id: 'accent6-5', colors: [adjustColor(a6, 80), adjustColor(a6, 60), adjustColor(a6, 30)], accents: [adjustColor(a6, 80), adjustColor(a6, 70), adjustColor(a6, 60), adjustColor(a6, 45), adjustColor(a6, 30), a6] },
            ]
        },
    ];
}

// Legacy: static fallback (will be replaced by dynamic version)
const SMARTART_COLOR_SCHEMES = getSmartArtColorSchemes('soft_peach_cream');

// Divider Layouts
const DIVIDER_LAYOUTS = {
    'strips': { label: '条带式', desc: '垂直渐变条', sections: 4 },
    'cards': { label: '卡片式', desc: '网格卡片 + 列表', sections: 4 },
    'cards-highlight': { label: '高亮卡片', desc: '卡片 + 大号数字', sections: 4 },
    'arrow': { label: '箭头徽章', desc: '顶部箭头 + 图标行', sections: 4 },
    'fullbleed': { label: '全屏渐变', desc: '大号透明编号', sections: 4 },
    'left-align': { label: '左对齐', desc: '左内容 + 右编号', sections: 4 },
    'left-align-mirror': { label: '左对齐-镜像', desc: '左编号 + 右内容', sections: 4 },
    'left-align-minimal': { label: '左对齐-简约', desc: '无装饰线', sections: 4 },
};

// Cover Layouts
const COVER_LAYOUTS = {
    'cross_rectangles': {
        id: 'cross_rectangles',
        name: '交叉矩形',
        description: '三条交叉的深色矩形条，现代商务风格',
        shapes: [
            { type: 'rect', x: 0, y: 0, w: 1280, h: 720, fill: 'accent2' },
            { type: 'rect', x: -269, y: 282, w: 707, h: 169, fill: 'primary' },
            { type: 'rect', x: 169, y: 0, w: 961, h: 152, fill: 'primary' },
            { type: 'rect', x: 845, y: 285, w: 720, h: 150, fill: 'primary' },
        ],
        textAreas: {
            year: { x: 85, y: 193, w: 566, h: 90, fontSize: 48, color: 'bg', bold: true },
            title: { x: 85, y: 277, w: 593, h: 123, fontSize: 36, color: 'bg', bold: true },
            highlight: { x: 527, y: 277, w: 591, h: 123, fontSize: 36, color: 'accent4', bold: true },
            subtitle: { x: 85, y: 429, w: 632, h: 59, fontSize: 14, color: 'text' },
        },
        footer: {
            enabled: true,
            bar: { x: 38, y: 613, w: 1203, h: 65, fill: 'bg2', type: 'roundRect' },
        },
    },
    'triangle_stack': {
        id: 'triangle_stack',
        name: '三角堆叠',
        description: '右上角渐变堆叠三角形，动感科技风格',
        shapes: [
            { type: 'rect', x: 0, y: 0, w: 1280, h: 720, fill: 'accent1' },
            { type: 'triangle', x: 280, y: -280, w: 720, h: 1280, fill: 'accent2', rotation: 90 },
            { type: 'triangle', x: 494, y: -67, w: 566, h: 1007, fill: 'accent1', rotation: 90 },
            { type: 'triangle', x: 569, y: 10, w: 512, h: 910, fill: 'accent2', rotation: 90 },
            { type: 'triangle', x: 780, y: 220, w: 360, h: 640, fill: 'accent1', rotation: 90 },
            { type: 'triangle', x: 856, y: 296, w: 305, h: 542, fill: 'accent2', rotation: 90 },
            { type: 'triangle', x: 1067, y: 507, w: 154, h: 273, fill: 'accent1', rotation: 90 },
        ],
        textAreas: {
            tag: { x: 85, y: 171, w: 566, h: 116, fontSize: 18, color: 'accent4', bold: false },
            title: { x: 85, y: 275, w: 932, h: 160, fontSize: 44, color: 'bg', bold: true },
            subtitle: { x: 85, y: 448, w: 518, h: 45, fontSize: 14, color: 'bg2' },
        },
        footer: {
            enabled: true,
            bar: { x: 61, y: 617, w: 1158, h: 54, fill: 'bg2', type: 'roundRect' },
        },
    },
    'checkerboard': {
        id: 'checkerboard',
        name: '棋盘格',
        description: '交替色块棋盘格背景，沉稳专业风格',
        shapes: [
            // Row 1
            { type: 'rect', x: 80, y: 0, w: 160, h: 240, fill: 'tx2' },
            { type: 'rect', x: 240, y: 0, w: 240, h: 240, fill: 'bg2' },
            { type: 'rect', x: 480, y: 0, w: 240, h: 240, fill: 'tx2' },
            { type: 'rect', x: 720, y: 0, w: 240, h: 240, fill: 'bg2' },
            { type: 'rect', x: 960, y: 0, w: 240, h: 240, fill: 'tx2' },
            { type: 'rect', x: 1200, y: 0, w: 160, h: 240, fill: 'bg2' },
            // Row 2
            { type: 'rect', x: 80, y: 240, w: 160, h: 240, fill: 'bg2' },
            { type: 'rect', x: 240, y: 240, w: 240, h: 240, fill: 'tx2' },
            { type: 'rect', x: 480, y: 240, w: 240, h: 240, fill: 'bg2' },
            { type: 'rect', x: 720, y: 240, w: 240, h: 240, fill: 'tx2' },
            { type: 'rect', x: 960, y: 240, w: 240, h: 240, fill: 'bg2' },
            { type: 'rect', x: 1200, y: 240, w: 160, h: 240, fill: 'tx2' },
            // Row 3
            { type: 'rect', x: 80, y: 480, w: 160, h: 240, fill: 'tx2' },
            { type: 'rect', x: 240, y: 480, w: 240, h: 240, fill: 'bg2' },
            { type: 'rect', x: 480, y: 480, w: 240, h: 240, fill: 'tx2' },
            { type: 'rect', x: 720, y: 480, w: 240, h: 240, fill: 'bg2' },
            { type: 'rect', x: 960, y: 480, w: 240, h: 240, fill: 'tx2' },
            { type: 'rect', x: 1200, y: 480, w: 160, h: 240, fill: 'bg2' },
        ],
        textAreas: {
            year: { x: 357, y: 179, w: 566, h: 74, fontSize: 36, color: 'accent3', bold: true, align: 'center' },
            title: { x: 143, y: 247, w: 994, h: 123, fontSize: 40, color: 'accent1', bold: true, align: 'center' },
            subtitle: { x: 324, y: 392, w: 632, h: 59, fontSize: 14, color: 'text', align: 'center' },
        },
        brandTag: { x: 83, y: 27, w: 327, h: 52, fontSize: 14, color: 'primary' },
        footer: {
            enabled: true,
            bar: { x: 38, y: 613, w: 1203, h: 65, fill: 'accent1', type: 'roundRect' },
        },
    },
    'dual_circles': {
        id: 'dual_circles',
        name: '双圆装饰',
        description: '左上右下双圆装饰，简约优雅风格',
        shapes: [
            { type: 'ellipse', x: -273, y: -331, w: 548, h: 548, fill: 'accent1' },
            { type: 'ellipse', x: 1046, y: 446, w: 548, h: 548, fill: 'accent3' },
        ],
        textAreas: {
            year: { x: 357, y: 210, w: 566, h: 90, fontSize: 36, color: 'accent3', bold: true, align: 'center' },
            title: { x: 206, y: 291, w: 867, h: 126, fontSize: 40, color: 'accent1', bold: true, align: 'center' },
            subtitle: { x: 324, y: 438, w: 632, h: 59, fontSize: 14, color: 'text', align: 'center' },
        },
        footer: { enabled: false },
    },
};

// SmartArt Test Data - default items for each SmartArt type (bilingual).
const SMARTART_TEST_DATA_ZH = {
    cycle: [
        { text: '计划', children: [{ text: 'Plan' }] },
        { text: '执行', children: [{ text: 'Do' }] },
        { text: '检查', children: [{ text: 'Check' }] },
        { text: '改进', children: [{ text: 'Act' }] },
    ],
    cycle1: [
        { text: '分析' },
        { text: '规划' },
        { text: '执行' },
        { text: '复盘' },
        { text: '优化' },
    ],
    cycle2: [
        { text: '需求' },
        { text: '设计' },
        { text: '开发' },
        { text: '测试' },
        { text: '发布' },
    ],
    cycle3: [
        { text: '识别机会' },
        { text: '制定策略' },
        { text: '落地执行' },
        { text: '监控反馈' },
        { text: '持续迭代' },
    ],
    cycle5: [
        { text: '洞察' },
        { text: '验证' },
        { text: '共识' },
        { text: '行动' },
        { text: '改进' },
    ],
    cycle6: [
        { text: '问题' },
        { text: '方案' },
        { text: '实施' },
        { text: '评估' },
        { text: '提升' },
    ],
    cycle7: [
        { text: '输入' },
        { text: '处理' },
        { text: '输出' },
    ],
    cycle8: [
        { text: '战略层' },
        { text: '执行层' },
        { text: '反馈层' },
    ],
    pyramid: [
        { text: '愿景', children: [{ text: '长期目标' }] },
        { text: '战略', children: [{ text: '中期规划' }] },
        { text: '战术', children: [{ text: '短期行动' }] },
        { text: '执行', children: [{ text: '日常任务' }] },
    ],
    matrix: [
        { text: '愿景' },
        { text: '战略' },
        { text: '战术' },
        { text: '执行' },
        { text: '运营' },
    ],
    'matrix-titled': [
        { text: '战略' },
        { text: '战术' },
        { text: '执行' },
        { text: '运营' },
    ],
    'matrix-cycle': [
        { text: '战略' },
        { text: '战术' },
        { text: '执行' },
        { text: '运营' },
    ],
    chevron: [
        { text: '需求分析', children: [{ text: 'Requirements' }] },
        { text: '方案设计', children: [{ text: 'Design' }] },
        { text: '开发实现', children: [{ text: 'Development' }] },
        { text: '测试验收', children: [{ text: 'Testing' }] },
    ],
    hierarchy: [
        { text: 'CEO', children: [] },
        { text: 'CTO', children: [{ text: '研发部' }, { text: '质量部' }] },
        { text: 'CFO', children: [{ text: '财务部' }] },
    ],
    radial: [
        { text: '核心目标', children: [{ text: 'Core' }] },
        { text: '策略A', children: [{ text: 'Strategy A' }] },
        { text: '策略B', children: [{ text: 'Strategy B' }] },
        { text: '策略C', children: [{ text: 'Strategy C' }] },
    ],
    list: [
        { text: '要点一', children: [{ text: 'Point 1' }] },
        { text: '要点二', children: [{ text: 'Point 2' }] },
        { text: '要点三', children: [{ text: 'Point 3' }] },
        { text: '要点四', children: [{ text: 'Point 4' }] },
    ],
};

const SMARTART_TEST_DATA_EN = {
    cycle: [
        { text: 'Plan', children: [{ text: 'Plan' }] },
        { text: 'Do', children: [{ text: 'Do' }] },
        { text: 'Check', children: [{ text: 'Check' }] },
        { text: 'Act', children: [{ text: 'Act' }] },
    ],
    cycle1: [
        { text: 'Analyze' },
        { text: 'Plan' },
        { text: 'Execute' },
        { text: 'Review' },
        { text: 'Optimize' },
    ],
    cycle2: [
        { text: 'Need' },
        { text: 'Design' },
        { text: 'Build' },
        { text: 'Test' },
        { text: 'Release' },
    ],
    cycle3: [
        { text: 'Identify Opportunity' },
        { text: 'Define Strategy' },
        { text: 'Execute' },
        { text: 'Monitor Feedback' },
        { text: 'Iterate' },
    ],
    cycle5: [
        { text: 'Discover' },
        { text: 'Validate' },
        { text: 'Align' },
        { text: 'Act' },
        { text: 'Improve' },
    ],
    cycle6: [
        { text: 'Issue' },
        { text: 'Solution' },
        { text: 'Implement' },
        { text: 'Evaluate' },
        { text: 'Enhance' },
    ],
    cycle7: [
        { text: 'Input' },
        { text: 'Process' },
        { text: 'Output' },
    ],
    cycle8: [
        { text: 'Strategy Layer' },
        { text: 'Execution Layer' },
        { text: 'Feedback Layer' },
    ],
    pyramid: [
        { text: 'Vision', children: [{ text: 'Long-term Goal' }] },
        { text: 'Strategy', children: [{ text: 'Mid-term Plan' }] },
        { text: 'Tactics', children: [{ text: 'Short-term Action' }] },
        { text: 'Execution', children: [{ text: 'Daily Tasks' }] },
    ],
    matrix: [
        { text: 'Vision' },
        { text: 'Strategy' },
        { text: 'Tactics' },
        { text: 'Execution' },
        { text: 'Operations' },
    ],
    'matrix-titled': [
        { text: 'Strategy' },
        { text: 'Tactics' },
        { text: 'Execution' },
        { text: 'Operations' },
    ],
    'matrix-cycle': [
        { text: 'Strategy' },
        { text: 'Tactics' },
        { text: 'Execution' },
        { text: 'Operations' },
    ],
    chevron: [
        { text: 'Requirements', children: [{ text: 'Requirements' }] },
        { text: 'Design', children: [{ text: 'Design' }] },
        { text: 'Development', children: [{ text: 'Development' }] },
        { text: 'Testing', children: [{ text: 'Testing' }] },
    ],
    hierarchy: [
        { text: 'CEO', children: [] },
        { text: 'CTO', children: [{ text: 'Engineering' }, { text: 'QA' }] },
        { text: 'CFO', children: [{ text: 'Finance' }] },
    ],
    radial: [
        { text: 'Core Objective', children: [{ text: 'Core' }] },
        { text: 'Strategy A', children: [{ text: 'Strategy A' }] },
        { text: 'Strategy B', children: [{ text: 'Strategy B' }] },
        { text: 'Strategy C', children: [{ text: 'Strategy C' }] },
    ],
    list: [
        { text: 'Point 1', children: [{ text: 'Point 1' }] },
        { text: 'Point 2', children: [{ text: 'Point 2' }] },
        { text: 'Point 3', children: [{ text: 'Point 3' }] },
        { text: 'Point 4', children: [{ text: 'Point 4' }] },
    ],
};

function getSmartArtTestData(typeId, category = 'list', lang = 'zh') {
    const source = lang === 'zh' ? SMARTART_TEST_DATA_ZH : SMARTART_TEST_DATA_EN;
    const key = typeId || category || 'list';
    return source[key] || source[category] || source.list || [];
}

// Keep compatibility with existing code paths expecting this global constant.
const SMARTART_TEST_DATA = SMARTART_TEST_DATA_ZH;
