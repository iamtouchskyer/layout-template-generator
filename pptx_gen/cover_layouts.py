"""
Cover page layout configurations extracted from cover.pptx.

Each layout defines:
- id: Layout identifier
- name: Human-readable name
- shapes: List of decorative shapes with position, size, type, and fill
- text_areas: Text positioning for title, subtitle, year, etc.
- footer: Optional footer bar configuration
"""

# Cover Layout Definitions
COVER_LAYOUTS = {
    'cross_rectangles': {
        'id': 'cross_rectangles',
        'name': '交叉矩形',
        'description': '三条交叉的深色矩形条，现代商务风格',
        'shapes': [
            # Background - full slide, uses accent2
            {'type': 'rect', 'x': 0, 'y': 0, 'w': 1280, 'h': 720, 'fill': 'accent2'},
            # Left diagonal bar
            {'type': 'rect', 'x': -269, 'y': 282, 'w': 707, 'h': 169, 'fill': 'primary', 'rotation': 0},
            # Top horizontal bar
            {'type': 'rect', 'x': 169, 'y': 0, 'w': 961, 'h': 152, 'fill': 'primary'},
            # Right diagonal bar
            {'type': 'rect', 'x': 845, 'y': 285, 'w': 720, 'h': 150, 'fill': 'primary'},
        ],
        'text_areas': {
            'year': {'x': 85, 'y': 193, 'w': 566, 'h': 90, 'font_size': 48, 'color': 'bg', 'bold': True},
            'title': {'x': 85, 'y': 277, 'w': 593, 'h': 123, 'font_size': 36, 'color': 'bg', 'bold': True},
            'highlight': {'x': 527, 'y': 277, 'w': 591, 'h': 123, 'font_size': 36, 'color': 'accent4', 'bold': True},
            'subtitle': {'x': 85, 'y': 429, 'w': 632, 'h': 59, 'font_size': 14, 'color': 'text'},
        },
        'footer': {
            'enabled': True,
            'bar': {'x': 38, 'y': 613, 'w': 1203, 'h': 65, 'fill': 'bg2', 'type': 'roundRect'},
            'items': [
                {'type': 'icon', 'icon': 'location', 'x': 94, 'y': 633, 'color': 'accent2'},
                {'type': 'text', 'x': 122, 'y': 631, 'text': '芝士科技大厦', 'color': 'primary'},
                {'type': 'icon', 'icon': 'calendar', 'x': 455, 'y': 634, 'color': 'accent2'},
                {'type': 'text', 'x': 487, 'y': 631, 'text': '2025.01', 'color': 'primary'},
                {'type': 'icon', 'icon': 'chat', 'x': 739, 'y': 635, 'color': 'accent2'},
                {'type': 'text', 'x': 771, 'y': 631, 'text': '400-123-4567', 'color': 'primary'},
                {'type': 'text', 'x': 1104, 'y': 631, 'text': 'LOGO', 'color': 'text_muted'},
            ],
        },
    },

    'triangle_stack': {
        'id': 'triangle_stack',
        'name': '三角堆叠',
        'description': '右上角渐变堆叠三角形，动感科技风格',
        'shapes': [
            # Background - full slide, uses accent1
            {'type': 'rect', 'x': 0, 'y': 0, 'w': 1280, 'h': 720, 'fill': 'accent1'},
            # Stacked triangles (right-to-left layering, alternating accent1/accent2)
            {'type': 'rtTriangle', 'x': 280, 'y': -280, 'w': 720, 'h': 1280, 'fill': 'accent2', 'rotation': 90},
            {'type': 'rtTriangle', 'x': 494, 'y': -67, 'w': 566, 'h': 1007, 'fill': 'accent1', 'rotation': 90},
            {'type': 'rtTriangle', 'x': 569, 'y': 10, 'w': 512, 'h': 910, 'fill': 'accent2', 'rotation': 90},
            {'type': 'rtTriangle', 'x': 780, 'y': 220, 'w': 360, 'h': 640, 'fill': 'accent1', 'rotation': 90},
            {'type': 'rtTriangle', 'x': 856, 'y': 296, 'w': 305, 'h': 542, 'fill': 'accent2', 'rotation': 90},
            {'type': 'rtTriangle', 'x': 1067, 'y': 507, 'w': 154, 'h': 273, 'fill': 'accent1', 'rotation': 90},
        ],
        'text_areas': {
            'tag': {'x': 85, 'y': 171, 'w': 566, 'h': 116, 'font_size': 18, 'color': 'accent4', 'bold': False},
            'title': {'x': 85, 'y': 275, 'w': 932, 'h': 160, 'font_size': 44, 'color': 'bg', 'bold': True},
            'subtitle': {'x': 85, 'y': 448, 'w': 518, 'h': 45, 'font_size': 14, 'color': 'bg2'},
        },
        'footer': {
            'enabled': True,
            'bar': {'x': 61, 'y': 617, 'w': 1158, 'h': 54, 'fill': 'bg2', 'type': 'roundRect'},
            'items': [
                {'type': 'icon', 'icon': 'location', 'x': 108, 'y': 632, 'color': 'accent2'},
                {'type': 'text', 'x': 136, 'y': 630, 'text': '芝士科技大厦', 'color': 'primary'},
                {'type': 'icon', 'icon': 'calendar', 'x': 418, 'y': 632, 'color': 'accent2'},
                {'type': 'text', 'x': 450, 'y': 630, 'text': '2025.01', 'color': 'primary'},
                {'type': 'icon', 'icon': 'chat', 'x': 630, 'y': 634, 'color': 'accent2'},
                {'type': 'text', 'x': 658, 'y': 630, 'text': '400-123-4567', 'color': 'primary'},
                {'type': 'text', 'x': 1080, 'y': 630, 'text': 'LOGO', 'color': 'text_muted'},
            ],
        },
    },

    'checkerboard': {
        'id': 'checkerboard',
        'name': '棋盘格',
        'description': '交替色块棋盘格背景，沉稳专业风格',
        'shapes': [
            # Checkerboard pattern - 6 columns x 3 rows, alternating tx2/bg2
            # Row 1
            {'type': 'rect', 'x': 80, 'y': 0, 'w': 160, 'h': 240, 'fill': 'tx2'},
            {'type': 'rect', 'x': 240, 'y': 0, 'w': 240, 'h': 240, 'fill': 'bg2'},
            {'type': 'rect', 'x': 480, 'y': 0, 'w': 240, 'h': 240, 'fill': 'tx2'},
            {'type': 'rect', 'x': 720, 'y': 0, 'w': 240, 'h': 240, 'fill': 'bg2'},
            {'type': 'rect', 'x': 960, 'y': 0, 'w': 240, 'h': 240, 'fill': 'tx2'},
            {'type': 'rect', 'x': 1200, 'y': 0, 'w': 160, 'h': 240, 'fill': 'bg2'},
            # Row 2
            {'type': 'rect', 'x': 80, 'y': 240, 'w': 160, 'h': 240, 'fill': 'bg2'},
            {'type': 'rect', 'x': 240, 'y': 240, 'w': 240, 'h': 240, 'fill': 'tx2'},
            {'type': 'rect', 'x': 480, 'y': 240, 'w': 240, 'h': 240, 'fill': 'bg2'},
            {'type': 'rect', 'x': 720, 'y': 240, 'w': 240, 'h': 240, 'fill': 'tx2'},
            {'type': 'rect', 'x': 960, 'y': 240, 'w': 240, 'h': 240, 'fill': 'bg2'},
            {'type': 'rect', 'x': 1200, 'y': 240, 'w': 160, 'h': 240, 'fill': 'tx2'},
            # Row 3
            {'type': 'rect', 'x': 80, 'y': 480, 'w': 160, 'h': 240, 'fill': 'tx2'},
            {'type': 'rect', 'x': 240, 'y': 480, 'w': 240, 'h': 240, 'fill': 'bg2'},
            {'type': 'rect', 'x': 480, 'y': 480, 'w': 240, 'h': 240, 'fill': 'tx2'},
            {'type': 'rect', 'x': 720, 'y': 480, 'w': 240, 'h': 240, 'fill': 'bg2'},
            {'type': 'rect', 'x': 960, 'y': 480, 'w': 240, 'h': 240, 'fill': 'tx2'},
            {'type': 'rect', 'x': 1200, 'y': 480, 'w': 160, 'h': 240, 'fill': 'bg2'},
        ],
        'text_areas': {
            'year': {'x': 357, 'y': 179, 'w': 566, 'h': 74, 'font_size': 36, 'color': 'accent3', 'bold': True},
            'title': {'x': 143, 'y': 247, 'w': 994, 'h': 123, 'font_size': 40, 'color': 'accent1', 'bold': True},
            'subtitle': {'x': 324, 'y': 392, 'w': 632, 'h': 59, 'font_size': 14, 'color': 'text'},
        },
        'footer': {
            'enabled': True,
            'bar': {'x': 38, 'y': 613, 'w': 1203, 'h': 65, 'fill': 'accent1', 'type': 'roundRect'},
            'items': [
                {'type': 'icon', 'icon': 'location', 'x': 94, 'y': 633, 'color': 'bg2'},
                {'type': 'text', 'x': 122, 'y': 631, 'text': '芝士科技大厦', 'color': 'bg'},
                {'type': 'icon', 'icon': 'calendar', 'x': 517, 'y': 634, 'color': 'bg2'},
                {'type': 'text', 'x': 550, 'y': 631, 'text': '2025.01', 'color': 'bg'},
                {'type': 'icon', 'icon': 'chat', 'x': 773, 'y': 635, 'color': 'bg2'},
                {'type': 'text', 'x': 801, 'y': 631, 'text': '400-123-4567', 'color': 'bg'},
                {'type': 'text', 'x': 1104, 'y': 631, 'text': 'LOGO', 'color': 'bg'},
            ],
        },
        'brand_tag': {'x': 83, 'y': 27, 'w': 327, 'h': 52, 'text': '人力资源工作总结汇报', 'color': 'primary'},
    },

    'dual_circles': {
        'id': 'dual_circles',
        'name': '双圆装饰',
        'description': '左上右下双圆装饰，简约优雅风格',
        'shapes': [
            # Top-left circle (partially off-screen)
            {'type': 'ellipse', 'x': -273, 'y': -331, 'w': 548, 'h': 548, 'fill': 'accent1'},
            # Bottom-right circle (partially off-screen)
            {'type': 'ellipse', 'x': 1046, 'y': 446, 'w': 548, 'h': 548, 'fill': 'accent3'},
        ],
        'text_areas': {
            'year': {'x': 357, 'y': 210, 'w': 566, 'h': 90, 'font_size': 36, 'color': 'accent3', 'bold': True},
            'title': {'x': 206, 'y': 291, 'w': 867, 'h': 126, 'font_size': 40, 'color': 'accent1', 'bold': True},
            'subtitle': {'x': 324, 'y': 438, 'w': 632, 'h': 59, 'font_size': 14, 'color': 'text'},
        },
        'footer': {
            'enabled': False,
        },
    },
}


def get_cover_layout(layout_id: str) -> dict:
    """Get cover layout by ID, with fallback to cross_rectangles."""
    return COVER_LAYOUTS.get(layout_id, COVER_LAYOUTS['cross_rectangles'])


def get_all_cover_layouts() -> list:
    """Get list of all available cover layouts."""
    return [
        {'id': k, 'name': v['name'], 'description': v.get('description', '')}
        for k, v in COVER_LAYOUTS.items()
    ]
