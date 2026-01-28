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

// SmartArt Categories
const SMARTART_CATEGORIES = {
    'stairs': { label: '阶梯/步骤', icon: '📶', desc: '展示递进步骤' },
    'journey': { label: '旅程/流程', icon: '🛤️', desc: '展示时间线或流程' },
    'funnel': { label: '漏斗', icon: '🔻', desc: '展示转化过程' },
    'hierarchy': { label: '层级/金字塔', icon: '🔺', desc: '展示层级结构' },
    'comparison': { label: '对比', icon: '⚖️', desc: '并列对比展示' },
    'matrix': { label: '矩阵/象限', icon: '🔲', desc: '2x2或多维分析' },
    'bullseye': { label: '靶心/目标', icon: '🎯', desc: '展示目标或核心' },
    'edge': { label: '关系/连接', icon: '🔗', desc: '展示元素间关系' },
    'iceberg': { label: '冰山模型', icon: '🧊', desc: '表面与深层对比' },
    'spectrum': { label: '光谱/范围', icon: '🌈', desc: '展示范围或程度' },
    'analysis': { label: '分析工具', icon: '🧠', desc: '鱼骨图/脑图/决策树' },
    'metrics': { label: 'KPI指标', icon: '📊', desc: '数据指标展示' },
};

// SmartArt Types
const SMARTART_TYPES = {
    'stairs-blocks': { category: 'stairs', label: '方块阶梯', dataType: 'sequential' },
    'stairs-cubes': { category: 'stairs', label: '立方体阶梯', dataType: 'sequential' },
    'journey-cards': { category: 'journey', label: '卡片旅程', dataType: 'journey' },
    'journey-rocks': { category: 'journey', label: '踏石旅程', dataType: 'journey' },
    'funnel-diagram': { category: 'funnel', label: '漏斗图', dataType: 'funnel' },
    'block-hierarchy': { category: 'hierarchy', label: '块状层级', dataType: 'hierarchy' },
    'gem-pyramid': { category: 'hierarchy', label: '宝石金字塔', dataType: 'hierarchy' },
    'bullseye-progression': { category: 'bullseye', label: '递进靶心', dataType: 'hierarchy' },
    'edge-hexagon-nodes': { category: 'edge', label: '六边形节点', dataType: 'comparison' },
    'distribution-donut': { category: 'metrics', label: '环形分布', dataType: 'sequential' },
};

// SmartArt Placements
const SMARTART_PLACEMENTS = {
    'full': { label: '全屏', desc: 'SmartArt占满内容区' },
    'left-desc': { label: '左图右文', desc: 'SmartArt左侧 + 右侧描述' },
    'right-desc': { label: '左文右图', desc: '左侧描述 + SmartArt右侧' },
    'top-desc': { label: '上图下文', desc: 'SmartArt上方 + 下方描述' },
    'bottom-desc': { label: '上文下图', desc: '上方描述 + SmartArt下方' },
};

// Divider Layouts
const DIVIDER_LAYOUTS = {
    'strips': { label: '条带式', desc: '垂直渐变条', sections: 4 },
    'cards': { label: '卡片式', desc: '网格卡片 + 列表', sections: 4 },
    'cards-highlight': { label: '高亮卡片', desc: '卡片 + 大号数字', sections: 4 },
    'arrow': { label: '箭头徽章', desc: '顶部箭头 + 图标行', sections: 4 },
    'fullbleed': { label: '全屏渐变', desc: '大号透明编号', sections: 4 },
    'left-align': { label: '左对齐', desc: '左内容 + 右编号', sections: 4 },
};
