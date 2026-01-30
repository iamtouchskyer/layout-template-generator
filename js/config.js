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

// SmartArt Categories - Based on OOXML SmartArt layout types
const SMARTART_CATEGORIES = {
    'pyramid': { label: '金字塔', icon: '🔺', desc: '层级/金字塔结构' },
    'process': { label: '流程', icon: '➡️', desc: '流程/步骤展示' },
    'cycle': { label: '循环', icon: '🔄', desc: '循环关系' },
    'matrix': { label: '矩阵', icon: '🔲', desc: '2x2或多维矩阵' },
    'hierarchy': { label: '层级', icon: '🏢', desc: '组织架构/树状' },
    'relationship': { label: '关系', icon: '🔗', desc: '发散/关系图' },
    'list': { label: '列表', icon: '📋', desc: '块状列表' },
    'picture': { label: '图片', icon: '🖼️', desc: '图片类布局' },
};

// SmartArt Types - OOXML Compatible (18 types from extracted smartart.pptx)
const SMARTART_TYPES = {
    // Pyramid types
    'pyramid': { category: 'pyramid', label: '基础金字塔', ooxmlId: 'pyramid1' },
    'pyramid-list': { category: 'pyramid', label: '金字塔列表', ooxmlId: 'pyramid2' },
    'pyramid-inverted': { category: 'pyramid', label: '倒漏斗', ooxmlId: 'pyramid3' },
    // Matrix types
    'matrix': { category: 'matrix', label: '基础矩阵', ooxmlId: 'matrix1' },
    'matrix-titled': { category: 'matrix', label: '标题矩阵', ooxmlId: 'matrix2' },
    'matrix-cycle': { category: 'matrix', label: '循环矩阵', ooxmlId: 'matrix3' },
    // Cycle types
    'cycle': { category: 'cycle', label: '基础循环', ooxmlId: 'cycle4' },
    'cycle-segmented': { category: 'cycle', label: '分段循环', ooxmlId: 'cycle8' },
    // Process types
    'chevron': { category: 'process', label: '基础流程', ooxmlId: 'chevron1' },
    'arrow-process': { category: 'process', label: '流程箭头', ooxmlId: 'arrow2' },
    'descending-process': { category: 'process', label: '下降流程', ooxmlId: 'DescendingProcess' },
    // Hierarchy types
    'hierarchy': { category: 'hierarchy', label: '组织架构', ooxmlId: 'chart3' },
    // Radial/Relationship types
    'radial': { category: 'relationship', label: '发散图', ooxmlId: 'radial3' },
    // List types
    'list': { category: 'list', label: '基础列表', ooxmlId: 'default' },
    'list-vertical': { category: 'list', label: '垂直列表', ooxmlId: 'vList3' },
    'hexagon-alternating': { category: 'list', label: '交替六边形', ooxmlId: 'AlternatingHexagons' },
    // Picture types
    'picture-accent': { category: 'picture', label: '突出图片', ooxmlId: 'AccentedPicture' },
    'picture-captioned': { category: 'picture', label: '带标题图片', ooxmlId: 'CaptionedPictures' },
};

// SmartArt Placements
const SMARTART_PLACEMENTS = {
    'full': { label: '全屏', desc: 'SmartArt占满内容区' },
    'left-desc': { label: '左图右文', desc: 'SmartArt左侧 + 右侧描述' },
    'right-desc': { label: '左文右图', desc: '左侧描述 + SmartArt右侧' },
    'top-desc': { label: '上图下文', desc: 'SmartArt上方 + 下方描述' },
    'bottom-desc': { label: '上文下图', desc: '上方描述 + SmartArt下方' },
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
