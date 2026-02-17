"""
SmartArt content slide generator.
"""

import logging

from pptx.util import Inches, Pt
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.smartart import SMARTART_TYPE, SMARTART_COLORS
from pptx.smartart import SmartArtData

from ..themes import hex_to_rgb, SMARTART_TYPE_MAP, SMARTART_COLOR_SCHEME_MAP
from ..utils import get_blank_layout


def generate_smartart_slide(prs, config, theme):
    """Generate SmartArt content slide."""
    slide = prs.slides.add_slide(get_blank_layout(prs))

    smartart_config = config.get('smartart', {})
    smartart_engine = smartart_config.get('engine', 'next')
    if smartart_engine not in ('legacy', 'next'):
        logging.warning("Unknown SmartArt engine '%s', fallback to 'next'", smartart_engine)
        smartart_engine = 'next'
    smartart_type_id = smartart_config.get('type', 'pyramid')
    placement = smartart_config.get('placement', 'full')
    color_scheme_id = smartart_config.get('colorScheme', 'colorful2')

    # Frontend runtime currently provides one implementation for both engines.
    # Keep this field in contract for gradual engine migration.
    _ = smartart_engine

    items = _extract_smartart_items(smartart_config)

    # Title
    _add_title_with_tag(slide, "流程分析", "SmartArt", theme, 'with-tag')
    _add_source_citation(slide, "内部分析报告", theme)

    # SmartArt area
    content_top = Inches(1.4)
    content_height = Inches(5.5)
    text_color = hex_to_rgb(theme['text'])

    if placement == 'full':
        x, y, cx, cy = Inches(0.4), content_top, Inches(9.2), content_height
    elif placement == 'left-desc':
        x, y, cx, cy = Inches(0.4), content_top, Inches(5.5), content_height
        _add_description_card(slide, content_top, content_height, theme, text_color)
    else:
        x, y, cx, cy = Inches(0.4), content_top, Inches(9.2), content_height

    # Add SmartArt with selected color scheme
    pptx_type = SMARTART_TYPE_MAP.get(smartart_type_id, SMARTART_TYPE.BASIC_PYRAMID)
    color_scheme = SMARTART_COLOR_SCHEME_MAP.get(color_scheme_id, SMARTART_COLORS.COLORFUL_ACCENT_COLORS)
    smartart_data = _create_smartart_data(smartart_type_id, items)

    try:
        slide.shapes.add_smartart(pptx_type, x, y, cx, cy, smartart_data, color_scheme=color_scheme)
    except (KeyError, ValueError, AttributeError, TypeError) as e:
        logging.warning(f"SmartArt creation failed for type '{smartart_type_id}': {e}")
        _add_fallback_placeholder(slide, x, y, cx, cy, theme)

    return slide


def _add_title_with_tag(slide, title: str, tag: str, theme: dict, title_style: str):
    """Add title with optional tag badge."""
    from pptx.dml.color import RGBColor
    from pptx.enum.text import PP_ALIGN

    accent_color = hex_to_rgb(theme['accent'])
    text_color = hex_to_rgb(theme['primary'])

    if title_style == 'with-tag' and tag:
        tag_shape = slide.shapes.add_shape(
            MSO_SHAPE.ROUNDED_RECTANGLE,
            Inches(0.4), Inches(0.3), Inches(0.8), Inches(0.35)
        )
        tag_shape.fill.solid()
        tag_shape.fill.fore_color.rgb = accent_color
        tag_shape.line.fill.background()

        tag_tf = tag_shape.text_frame
        tag_tf.paragraphs[0].alignment = PP_ALIGN.CENTER
        tag_p = tag_tf.paragraphs[0]
        tag_p.text = tag
        tag_p.font.size = Pt(10)
        tag_p.font.bold = True
        tag_p.font.color.rgb = RGBColor(255, 255, 255)
        tag_tf.margin_top = Pt(4)
        tag_tf.margin_bottom = Pt(4)

        title_y = Inches(0.75)
    else:
        title_y = Inches(0.4)

    title_box = slide.shapes.add_textbox(
        Inches(0.4), title_y, Inches(7), Inches(0.7)
    )
    p = title_box.text_frame.paragraphs[0]
    p.text = title
    p.font.size = Pt(32)
    p.font.bold = True
    p.font.color.rgb = text_color


def _add_source_citation(slide, source: str, theme: dict):
    """Add source citation at bottom."""
    text_box = slide.shapes.add_textbox(
        Inches(0.4), Inches(7.1), Inches(5), Inches(0.3)
    )
    p = text_box.text_frame.paragraphs[0]
    p.text = f"数据来源：{source}"
    p.font.size = Pt(9)
    p.font.color.rgb = hex_to_rgb(theme.get('text_muted', '#888888'))


def _add_description_card(slide, content_top, content_height, theme, text_color):
    """Add description card for left-desc placement."""
    desc_card = slide.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE,
        Inches(6.1), content_top, Inches(3.5), content_height
    )
    desc_card.fill.solid()
    desc_card.fill.fore_color.rgb = hex_to_rgb(theme.get('card_bg', '#FFFFFF'))
    desc_card.line.color.rgb = hex_to_rgb(theme.get('card_border', '#E0E0E0'))

    header = slide.shapes.add_textbox(Inches(6.3), content_top + Inches(0.2), Inches(3.1), Inches(0.4))
    p = header.text_frame.paragraphs[0]
    p.text = "说明文字区域"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = text_color

    desc = slide.shapes.add_textbox(Inches(6.3), content_top + Inches(0.7), Inches(3.1), Inches(4))
    desc.text_frame.word_wrap = True
    p = desc.text_frame.paragraphs[0]
    p.text = "这里可以放置对 SmartArt 图形的描述、解释或相关数据说明。"
    p.font.size = Pt(11)
    p.font.color.rgb = text_color


def _add_fallback_placeholder(slide, x, y, cx, cy, theme):
    """Add fallback placeholder when SmartArt fails."""
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, cx, cy)
    card.fill.solid()
    card.fill.fore_color.rgb = hex_to_rgb(theme.get('card_bg', '#FFFFFF'))
    card.line.color.rgb = hex_to_rgb(theme.get('card_border', '#E0E0E0'))


def _create_smartart_data(smartart_type_id: str, items: list) -> SmartArtData:
    """Create SmartArtData from items list."""
    data = SmartArtData()

    if not items:
        items = ['项目 1', '项目 2', '项目 3', '项目 4']

    pptx_type = SMARTART_TYPE_MAP.get(smartart_type_id)
    is_hierarchy = pptx_type in [SMARTART_TYPE.HIERARCHY, SMARTART_TYPE.ORGANIZATION_CHART]
    is_radial = pptx_type in [SMARTART_TYPE.BASIC_RADIAL, SMARTART_TYPE.RADIAL]

    if (is_hierarchy or is_radial) and _has_nested_children(items):
        for item in items:
            root = data.add_node(_item_text(item))
            if isinstance(item, dict):
                _add_child_nodes(root, item.get('children', []))
    elif is_hierarchy and len(items) > 1:
        root = data.add_node(_item_text(items[0]))
        for item in items[1:]:
            root.add_child(_item_text(item))
    elif is_radial and len(items) > 1:
        center = data.add_node(_item_text(items[0]))
        for item in items[1:]:
            center.add_child(_item_text(item))
    else:
        for item in items:
            data.add_node(_item_text(item))

    return data


def _extract_smartart_items(smartart_config: dict) -> list:
    """Extract SmartArt items from config with explicit items first, OOXML fallback."""
    items = smartart_config.get('items')
    if not isinstance(items, list) or len(items) == 0:
        ooxml_data = smartart_config.get('ooxml', {})
        if isinstance(ooxml_data, dict):
            items = ooxml_data.get('items', [])
        else:
            items = []
    return items if isinstance(items, list) else []


def _item_text(item) -> str:
    """Return display text from SmartArt item."""
    if isinstance(item, dict):
        return str(item.get('text', str(item)))
    return str(item)


def _has_nested_children(items: list) -> bool:
    """Check whether items include explicit nested children."""
    for item in items:
        if isinstance(item, dict):
            children = item.get('children', [])
            if isinstance(children, list) and len(children) > 0:
                return True
    return False


def _add_child_nodes(parent_node, children: list) -> None:
    """Recursively add child nodes from nested items."""
    if not isinstance(children, list):
        return
    for child in children:
        node = parent_node.add_child(_item_text(child))
        if isinstance(child, dict):
            _add_child_nodes(node, child.get('children', []))
