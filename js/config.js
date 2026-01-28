// Configuration Constants

const GRID_PATTERNS = [
    { id: 'single', label: '1 Col', cols: '1fr', cells: 1 },
    { id: 'two-equal', label: '1:1', cols: '1fr 1fr', cells: 2 },
    { id: 'two-left', label: '2:1', cols: '2fr 1fr', cells: 2 },
    { id: 'two-right', label: '1:2', cols: '1fr 2fr', cells: 2 },
    { id: 'three-equal', label: '1:1:1', cols: '1fr 1fr 1fr', cells: 3 },
    { id: 'four-grid', label: '2×2', cols: '1fr 1fr', cells: 4, rows: 2 },
];

const LAYOUT_TYPES = {
    'image-left': { label: 'Image Left', category: 'image', desc: 'Two columns: image left, text right', zones: ['image', 'text'] },
    'image-right': { label: 'Image Right', category: 'image', desc: 'Two columns: text left, image right', zones: ['text', 'image'] },
    'image-top': { label: 'Image Top', category: 'image', desc: 'Image top, text below', zones: ['image', 'text'] },
    'image-bottom': { label: 'Image Bottom', category: 'image', desc: 'Text top, image below', zones: ['text', 'image'] },
    'chart-left': { label: 'Chart Left', category: 'chart', desc: 'Two columns: chart left, text right', zones: ['chart', 'text'] },
    'chart-right': { label: 'Chart Right', category: 'chart', desc: 'Two columns: text left, chart right', zones: ['text', 'chart'] },
    'no-image': { label: 'No Image', category: 'text', desc: 'Text-only with optimized spacing', zones: ['text'] },
    'big-number': { label: 'Big Number', category: 'text', desc: 'Large statistic with key info', zones: ['metric'] },
    'quote': { label: 'Quote', category: 'text', desc: 'Quoted text with author attribution', zones: ['quote'] },
    'agenda': { label: 'Agenda', category: 'text', desc: 'Numbered/bulleted list', zones: ['list'] },
    'conclusion': { label: 'Conclusion', category: 'text', desc: 'Multi-column summary', zones: ['summary', 'summary', 'summary'] },
    'two-column-equal': { label: 'Two Column', category: 'comparison', desc: 'Two equal columns with equal content', zones: ['text', 'text'] },
    'comparison-2': { label: 'Compare 2', category: 'comparison', desc: '2-item comparison', zones: ['card', 'card'] },
    'comparison-3': { label: 'Compare 3', category: 'comparison', desc: '3-item comparison', zones: ['card', 'card', 'card'] },
    'edge-to-edge': { label: 'Edge to Edge', category: 'fancy', desc: 'Full-bleed image with overlaid text', zones: ['background', 'overlay'] },
    'hero-banner': { label: 'Hero Banner', category: 'fancy', desc: 'Large hero image with text at bottom', zones: ['hero', 'text'] },
    'split-screen': { label: 'Split Screen', category: 'fancy', desc: '50/50 vertical split', zones: ['image', 'content'] },
    'timeline': { label: 'Timeline', category: 'fancy', desc: 'Timeline with connected nodes', zones: ['timeline'] },
    'stats-dashboard': { label: 'Stats Dashboard', category: 'fancy', desc: 'Bento-grid style metrics', zones: ['metric', 'metric', 'metric', 'metric'] },
    'icon-grid': { label: 'Icon Grid', category: 'fancy', desc: 'Grid of icon+text combinations', zones: ['icon', 'icon', 'icon', 'icon'] },
};

const CARD_TYPES = [
    { id: 'chart', label: 'Chart' },
    { id: 'text', label: 'Text / Bullets' },
    { id: 'metric', label: 'Big Number' },
    { id: 'table', label: 'Table' },
    { id: 'combo', label: 'Icon Grid' },
    { id: 'image', label: 'Image' },
];

const SHAPE_PRESETS = {
    'header-badge': {
        label: 'Header Badge',
        presets: [
            { id: 'pill-right', name: 'Pill Right', position: 'top-right' },
            { id: 'pill-left', name: 'Pill Left', position: 'top-left' },
            { id: 'tag-right', name: 'Tag Right', position: 'top-right' },
            { id: 'banner', name: 'Banner', position: 'top-right' },
        ]
    },
    'top-line': {
        label: 'Top Line',
        presets: [
            { id: 'full', name: 'Full Width', position: 'top' },
            { id: 'center', name: 'Center', position: 'top' },
            { id: 'left-half', name: 'Left Half', position: 'top' },
            { id: 'accent', name: 'Accent', position: 'top' },
        ]
    },
    'side-bar': {
        label: 'Side Bar',
        presets: [
            { id: 'thin-left', name: 'Thin Left', position: 'left' },
            { id: 'wide-left', name: 'Wide Left', position: 'left' },
            { id: 'thin-right', name: 'Thin Right', position: 'right' },
        ]
    },
    'corner-tl': {
        label: 'Corner',
        presets: [
            { id: 'tl-small', name: 'Top-Left Small', position: 'top-left' },
            { id: 'tl-large', name: 'Top-Left Large', position: 'top-left' },
            { id: 'tr-small', name: 'Top-Right Small', position: 'top-right' },
            { id: 'br-small', name: 'Bottom-Right Small', position: 'bottom-right' },
        ]
    },
    'corner-dots': {
        label: 'Corner Dots',
        presets: [
            { id: 'tr', name: 'Top Right', position: 'top-right' },
            { id: 'tl', name: 'Top Left', position: 'top-left' },
            { id: 'br', name: 'Bottom Right', position: 'bottom-right' },
            { id: 'bl', name: 'Bottom Left', position: 'bottom-left' },
        ]
    },
    'accent-circle': {
        label: 'Accent Circle',
        presets: [
            { id: 'br-large', name: 'Bottom-Right Large', position: 'bottom-right' },
            { id: 'br-small', name: 'Bottom-Right Small', position: 'bottom-right' },
            { id: 'tl-large', name: 'Top-Left Large', position: 'top-left' },
        ]
    },
    'footer-line': {
        label: 'Footer Line',
        presets: [
            { id: 'full', name: 'Full Width', position: 'bottom' },
            { id: 'center', name: 'Center', position: 'bottom' },
        ]
    },
};

const ZONE_TO_CARD_TYPE = {
    'image': 'image', 'chart': 'chart', 'text': 'text', 'metric': 'metric',
    'quote': 'text', 'list': 'text', 'summary': 'text', 'card': 'text',
    'icon': 'combo', 'background': 'image', 'overlay': 'text',
    'hero': 'image', 'content': 'text', 'timeline': 'text',
};

// Page Types
const PAGE_TYPES = {
    'cover': { label: '封面', category: 'cover' },
    'divider': { label: '目录/章节页', category: 'divider' },
    'content': { label: '内容页', category: 'content' },
};

// Divider Layouts (TOC/Section pages)
const DIVIDER_LAYOUTS = {
    'strips': { label: '条带式', desc: '垂直渐变条', sections: 4 },
    'cards': { label: '卡片式', desc: '网格卡片 + 列表', sections: 4 },
    'cards-highlight': { label: '高亮卡片', desc: '卡片 + 大号数字', sections: 4 },
    'arrow': { label: '箭头徽章', desc: '顶部箭头 + 图标行', sections: 4 },
    'fullbleed': { label: '全屏渐变', desc: '大号透明编号', sections: 4 },
    'left-align': { label: '左对齐', desc: '左内容 + 右编号', sections: 4 },
};
