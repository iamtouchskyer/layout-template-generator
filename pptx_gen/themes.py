"""
Theme colors and SmartArt mappings for PPTX generation.
"""

from pptx.dml.color import RGBColor
from pptx.enum.smartart import SMARTART_TYPE, SMARTART_COLORS

from .smartart_map_generated import GENERATED_SMARTART_TYPE_MAP


def hex_to_rgb(hex_color: str) -> RGBColor:
    """Convert hex color to RGBColor."""
    hex_color = hex_color.lstrip('#')
    return RGBColor(int(hex_color[0:2], 16), int(hex_color[2:4], 16), int(hex_color[4:6], 16))


# Theme color mappings
# Each theme has: primary, accent, bg, text, text_muted, card_bg, card_border
# accentColors: 6-color palette for SmartArt colorful schemes
THEME_COLORS = {
    'soft_peach_cream': {
        'primary': '#3D3D3D', 'accent': '#F5A89A', 'bg': '#FFFAF5',
        'text': '#3D3D3D', 'text_muted': '#888888', 'card_bg': '#FFF5F0', 'card_border': '#F5D5C8',
        'accentColors': ['#E4B6B6', '#F4CDD0', '#FAE4E6', '#D4A5A5', '#C99393', '#B88585'],
    },
    'pinkblack': {
        'primary': '#FF92AE', 'accent': '#FF92AE', 'bg': '#232323',
        'text': '#FF92AE', 'text_muted': '#C8C8C8', 'card_bg': '#3C3C3C', 'card_border': '#646464',
        'accentColors': ['#FF92AE', '#FFB8CA', '#FFD4E0', '#E67A96', '#CC6282', '#B34A6E'],
    },
    'executive': {
        'primary': '#FFFFFF', 'accent': '#64B5F6', 'bg': '#1A2942',
        'text': '#FFFFFF', 'text_muted': '#8899AA', 'card_bg': '#243B55', 'card_border': '#3D5A80',
        'accentColors': ['#4DA7FF', '#E0F2FE', '#CBD5E1', '#334155', '#1F364F', '#7AC5FF'],
    },
    'forest_green': {
        'primary': '#1A3D2B', 'accent': '#2D5A3D', 'bg': '#F5F7F5',
        'text': '#1A3D2B', 'text_muted': '#6B8068', 'card_bg': '#E8F0E8', 'card_border': '#C8D8C8',
        'accentColors': ['#295740', '#e1bb46', '#547d5d', '#b4a174', '#b1d3c1', '#d38d31'],
    },
    'sunset_orange': {
        'primary': '#2D2D2D', 'accent': '#E85D3B', 'bg': '#FFF9F5',
        'text': '#2D2D2D', 'text_muted': '#888888', 'card_bg': '#FFF0E8', 'card_border': '#F5D0C0',
        # Note: Accent colors may need design refinement for optimal visual harmony
        'accentColors': ['#E85D3B', '#F5A89A', '#FFD4C4', '#C44A2D', '#FF7F5C', '#A63820'],
    },
    'cosmic': {
        'primary': '#F2F2F3', 'accent': '#9B59B6', 'bg': '#050505',
        'text': '#F2F2F3', 'text_muted': '#888888', 'card_bg': '#1A1A1A', 'card_border': '#333333',
        'accentColors': ['#F2F2F3', '#E5E0DF', '#BFBFBF', '#423C44', '#312D32', '#8A8A8A'],
    },
    'azure': {
        'primary': '#002FA7', 'accent': '#002FA7', 'bg': '#F8FAFC',
        'text': '#1A1A2E', 'text_muted': '#6B7280', 'card_bg': '#EEF2FF', 'card_border': '#C7D2FE',
        'accentColors': ['#3949EE', '#0E5188', '#5D90E1', '#B6CEED', '#D9E1EB', '#39393C'],
    },
    'clear_sky_wheat': {
        'primary': '#4A7A9E', 'accent': '#A5D0F2', 'bg': '#FBF8E7',
        'text': '#4A7A9E', 'text_muted': '#6B9BC0', 'card_bg': '#FFFFFF', 'card_border': '#DFF1FB',
        'accentColors': ['#A5D0F2', '#DFF1FB', '#FBF8E7', '#8BC0E8', '#C5E0F5', '#7AB0D8'],
    },
    'cloud_ink_shadow': {
        'primary': '#1F2022', 'accent': '#53616A', 'bg': '#F0F5F9',
        'text': '#1F2022', 'text_muted': '#53616A', 'card_bg': '#FFFFFF', 'card_border': '#C9D6DE',
        'accentColors': ['#53616A', '#C9D6DE', '#1F2022', '#3D4A52', '#A0B0BC', '#2A2D2F'],
    },
    'cloud_letter': {
        'primary': '#53616A', 'accent': '#AFC0D4', 'bg': '#FDFCF8',
        'text': '#53616A', 'text_muted': '#7B8B9A', 'card_bg': '#FFFFFF', 'card_border': '#BBCCDC',
        'accentColors': ['#AFC0D4', '#BBCCDC', '#DADEDD', '#9AB0C4', '#A5B8CC', '#8CA0B4'],
    },
    'moss_green': {
        'primary': '#284B45', 'accent': '#508C70', 'bg': '#F0F4EC',
        'text': '#284B45', 'text_muted': '#508C70', 'card_bg': '#FFFFFF', 'card_border': '#79B4A0',
        'accentColors': ['#508C70', '#79B4A0', '#C8D6B3', '#284B45', '#5FA088', '#9BC4A8'],
    },
    'rose_wine': {
        'primary': '#270708', 'accent': '#74151D', 'bg': '#FDF8F8',
        'text': '#270708', 'text_muted': '#9E5252', 'card_bg': '#FFFFFF', 'card_border': '#9E5252',
        'accentColors': ['#74151D', '#9E5252', '#E6D3CF', '#8B3A3A', '#A64D4D', '#C27777'],
    },
    'sakura_muffin': {
        'primary': '#825B5C', 'accent': '#FED4D5', 'bg': '#FDF8E4',
        'text': '#825B5C', 'text_muted': '#9E7B7B', 'card_bg': '#FFFFFF', 'card_border': '#FFF9C5',
        'accentColors': ['#FED4D5', '#FFF9C5', '#825B5C', '#E8B8B9', '#F0E0A0', '#6B4A4B'],
    },
    'white_tea_joy': {
        'primary': '#4A5A48', 'accent': '#7C8D7A', 'bg': '#E9EEE8',
        'text': '#4A5A48', 'text_muted': '#7C8D7A', 'card_bg': '#FFFFFF', 'card_border': '#AEC6B6',
        'accentColors': ['#7C8D7A', '#AEC6B6', '#C4D7C1', '#6A7B68', '#9BB5A5', '#8CA58E'],
    },
    # 高端汇报 - Premium Report Themes (dark background)
    'bright_red_blue': {
        'primary': '#101010', 'accent': '#E4380E', 'bg': '#F2F5F6',
        'text': '#101010', 'text_muted': '#6F6F6F', 'card_bg': '#FFFFFF', 'card_border': '#E8E8E8',
        'accentColors': ['#E4380E', '#B32A0A', '#FE8732', '#F16128', '#6390FE', '#6F6F6F'],
    },
    'bright_blue_red': {
        'primary': '#101010', 'accent': '#0354D7', 'bg': '#F2F5F6',
        'text': '#101010', 'text_muted': '#6F6F6F', 'card_bg': '#FFFFFF', 'card_border': '#E8E8E8',
        'accentColors': ['#0354D7', '#0037A2', '#6592FE', '#346DF5', '#F7685C', '#6F6F6F'],
    },
    'deep_red_blue': {
        'primary': '#101010', 'accent': '#731817', 'bg': '#F2F5F6',
        'text': '#101010', 'text_muted': '#6F6F6F', 'card_bg': '#FFFFFF', 'card_border': '#E8E8E8',
        'accentColors': ['#731817', '#AA352C', '#DB6436', '#EF7E4D', '#6292C6', '#6F6F6F'],
    },
    'deep_green_gold': {
        'primary': '#101010', 'accent': '#204023', 'bg': '#F2F5F6',
        'text': '#101010', 'text_muted': '#6F6F6F', 'card_bg': '#FFFFFF', 'card_border': '#E8E8E8',
        'accentColors': ['#204023', '#316637', '#4D8A56', '#57A264', '#DDAC6F', '#6F6F6F'],
    },
    'deep_blue_gold': {
        'primary': '#101010', 'accent': '#132D86', 'bg': '#F2F5F6',
        'text': '#101010', 'text_muted': '#6F6F6F', 'card_bg': '#FFFFFF', 'card_border': '#E8E8E8',
        'accentColors': ['#132D86', '#274DA6', '#4C81B7', '#669AD0', '#DFAA6F', '#6F6F6F'],
    },
    'blue_green_gold': {
        'primary': '#101010', 'accent': '#122C86', 'bg': '#F2F5F6',
        'text': '#101010', 'text_muted': '#6F6F6F', 'card_bg': '#FFFFFF', 'card_border': '#E8E8E8',
        'accentColors': ['#122C86', '#274DA7', '#538C5B', '#4E81B6', '#DFAA70', '#6F6F6F'],
    },
}

# SmartArt type mappings - New OOXML-based types
SMARTART_TYPE_MAP = {
    **GENERATED_SMARTART_TYPE_MAP,
    # Legacy types (for backwards compatibility)
    'stairs-blocks': SMARTART_TYPE.STEP_DOWN_PROCESS,
    'stairs-cubes': SMARTART_TYPE.BASIC_PROCESS,
    'stairs-focused': SMARTART_TYPE.BASIC_CHEVRON_PROCESS,
    'journey-cards': SMARTART_TYPE.BASIC_PROCESS,
    'journey-rocks': SMARTART_TYPE.ALTERNATING_FLOW,
    'funnel-diagram': SMARTART_TYPE.FUNNEL,
    'block-hierarchy': SMARTART_TYPE.HIERARCHY,
    'gem-pyramid': SMARTART_TYPE.BASIC_PYRAMID,
    'pyramid-isometric': SMARTART_TYPE.BASIC_PYRAMID,
    'pyramid-alternate-labels': SMARTART_TYPE.SEGMENTED_PYRAMID,
    'pyramid-cubes-with-arrow': SMARTART_TYPE.PYRAMID_LIST,
    'comparison-house-foundation': SMARTART_TYPE.BALANCE,
    'comparison-overlapping-cards': SMARTART_TYPE.BASIC_VENN,
    'comparison-podium-trophies': SMARTART_TYPE.BASIC_BLOCK_LIST,
    'matrix-grid-2x2': SMARTART_TYPE.BASIC_MATRIX,
    'matrix-grid-2x2-cards': SMARTART_TYPE.TITLED_MATRIX,
    'matrix-curved-quadrant': SMARTART_TYPE.BASIC_MATRIX,
    'priority-matrix': SMARTART_TYPE.TITLED_MATRIX,
    'bullseye-progression': SMARTART_TYPE.BASIC_TARGET,
    'bullseye-with-support': SMARTART_TYPE.NESTED_TARGET,
    'bullseye-single-arrow': SMARTART_TYPE.BASIC_TARGET,
    'bullseye-multi-arrows': SMARTART_TYPE.TARGET_LIST,
    'edge-analysis': SMARTART_TYPE.BASIC_RADIAL,
    'edge-circular-petals': SMARTART_TYPE.BASIC_RADIAL,
    'edge-hexagon-nodes': SMARTART_TYPE.BASIC_RADIAL,
    'edge-rectangular-boxes': SMARTART_TYPE.BASIC_BLOCK_LIST,
    'iceberg-depth': SMARTART_TYPE.INVERTED_PYRAMID,
    'iceberg-simple-mountain': SMARTART_TYPE.BASIC_PYRAMID,
    'iceberg-complex-layers': SMARTART_TYPE.SEGMENTED_PYRAMID,
    'range-spectrum': SMARTART_TYPE.BASIC_PROCESS,
    'spectrum-vertical': SMARTART_TYPE.VERTICAL_BULLET_LIST,
    'spectrum-horizontal': SMARTART_TYPE.HORIZONTAL_BULLET_LIST,
    'brain-mapping': SMARTART_TYPE.RADIAL,
    'decision-branching': SMARTART_TYPE.HIERARCHY,
    'fishbone-diagram': SMARTART_TYPE.HIERARCHY,
    'metrics-grid': SMARTART_TYPE.BASIC_BLOCK_LIST,
    'distribution-donut': SMARTART_TYPE.BASIC_CYCLE,
}

# SmartArt color scheme - maps UI colorScheme to python-pptx enum
SMARTART_COLOR_SCHEME_MAP = {
    # Primary (grayscale)
    'primary1': SMARTART_COLORS.ACCENT_1,
    'primary2': SMARTART_COLORS.ACCENT_1,
    'primary3': SMARTART_COLORS.ACCENT_1,
    # Colorful (multi-accent)
    'colorful1': SMARTART_COLORS.COLORFUL_ACCENT_COLORS,
    'colorful2': SMARTART_COLORS.COLORFUL_ACCENT_2_TO_3,
    'colorful3': SMARTART_COLORS.COLORFUL_ACCENT_3_TO_4,
    'colorful4': SMARTART_COLORS.COLORFUL_ACCENT_4_TO_5,
    'colorful5': SMARTART_COLORS.COLORFUL_ACCENT_5_TO_6,
    # Accent 1 variants
    'accent1-1': SMARTART_COLORS.ACCENT_1,
    'accent1-2': SMARTART_COLORS.ACCENT_1,
    'accent1-3': SMARTART_COLORS.ACCENT_1,
    'accent1-4': SMARTART_COLORS.ACCENT_1,
    'accent1-5': SMARTART_COLORS.ACCENT_1,
    # Accent 2 variants
    'accent2-1': SMARTART_COLORS.ACCENT_2,
    'accent2-2': SMARTART_COLORS.ACCENT_2,
    'accent2-3': SMARTART_COLORS.ACCENT_2,
    'accent2-4': SMARTART_COLORS.ACCENT_2,
    'accent2-5': SMARTART_COLORS.ACCENT_2,
    # Accent 3 variants
    'accent3-1': SMARTART_COLORS.ACCENT_3,
    'accent3-2': SMARTART_COLORS.ACCENT_3,
    'accent3-3': SMARTART_COLORS.ACCENT_3,
    'accent3-4': SMARTART_COLORS.ACCENT_3,
    'accent3-5': SMARTART_COLORS.ACCENT_3,
}

# Sample data for SmartArt
SAMPLE_DATA = {
    'sequential': [
        {'label': '第一阶段', 'description': '规划与准备'},
        {'label': '第二阶段', 'description': '执行与开发'},
        {'label': '第三阶段', 'description': '测试与优化'},
        {'label': '第四阶段', 'description': '发布与维护'},
    ],
    'funnel': [
        {'label': '曝光', 'value': 10000},
        {'label': '点击', 'value': 3000},
        {'label': '注册', 'value': 800},
        {'label': '付费', 'value': 200},
    ],
    'journey': [
        {'label': '需求分析', 'description': '明确项目目标'},
        {'label': '方案设计', 'description': '制定实施计划'},
        {'label': '开发实现', 'description': '编码与集成'},
        {'label': '上线运营', 'description': '部署与监控'},
    ],
    'hierarchy': [
        {'label': '战略层', 'description': '企业愿景与目标'},
        {'label': '管理层', 'description': '资源调配与决策'},
        {'label': '执行层', 'description': '任务执行与反馈'},
        {'label': '支撑层', 'description': '基础设施与工具'},
    ],
    'comparison': [
        {'label': '方案 A', 'description': '成本低，周期长'},
        {'label': '方案 B', 'description': '成本中，周期中'},
        {'label': '方案 C', 'description': '成本高，周期短'},
    ],
}


def get_theme(theme_id: str) -> dict:
    """Get theme colors by ID, with fallback to default."""
    return THEME_COLORS.get(theme_id, THEME_COLORS['soft_peach_cream'])
