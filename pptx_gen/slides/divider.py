"""
Divider/section slide generator.
"""

from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN

from ..themes import hex_to_rgb
from ..utils import get_blank_layout


def generate_divider_slide(prs, config, theme):
    """Generate divider/section slide."""
    slide = prs.slides.add_slide(get_blank_layout(prs))

    divider_config = config.get('divider', {})
    section_index = divider_config.get('sectionIndex', 1)
    layout_type = divider_config.get('layout', 'left-align')

    sections = [
        {'num': '01', 'zh': '年度工作概述', 'en': 'Annual Overview', 'part': '第一部分'},
        {'num': '02', 'zh': '工作完成情况', 'en': 'Work Progress', 'part': '第二部分'},
        {'num': '03', 'zh': '项目成果展示', 'en': 'Project Results', 'part': '第三部分'},
        {'num': '04', 'zh': '工作不足与改进', 'en': 'Improvements', 'part': '第四部分'},
    ]

    idx = section_index - 1 if section_index > 0 else 0
    section = sections[idx % len(sections)]
    accent_color = hex_to_rgb(theme['accent'])

    # Set background based on layout type
    if layout_type in ['left-align', 'fullbleed']:
        slide.background.fill.solid()
        slide.background.fill.fore_color.rgb = accent_color
        text_color = RGBColor(255, 255, 255)
        strip_color = RGBColor(255, 255, 255)
    else:
        text_color = hex_to_rgb(theme['primary'])
        strip_color = accent_color

    # Left strip
    strip = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE,
        Inches(0), Inches(0), Inches(0.1), Inches(7.5)
    )
    strip.fill.solid()
    strip.fill.fore_color.rgb = strip_color
    strip.line.fill.background()

    # Part label
    part_box = slide.shapes.add_textbox(Inches(0.5), Inches(2), Inches(3), Inches(0.8))
    p = part_box.text_frame.paragraphs[0]
    p.text = section['part']
    p.font.size = Pt(48)
    p.font.bold = True
    p.font.color.rgb = text_color

    # Title
    title_box = slide.shapes.add_textbox(Inches(0.5), Inches(3), Inches(7), Inches(1.2))
    p = title_box.text_frame.paragraphs[0]
    p.text = section['zh']
    p.font.size = Pt(56)
    p.font.bold = True
    p.font.color.rgb = text_color

    # English subtitle
    en_box = slide.shapes.add_textbox(Inches(0.5), Inches(4.3), Inches(5), Inches(0.5))
    p = en_box.text_frame.paragraphs[0]
    p.text = section['en']
    p.font.size = Pt(14)
    p.font.color.rgb = text_color

    # Large number
    num_box = slide.shapes.add_textbox(Inches(6), Inches(1.5), Inches(3.5), Inches(5))
    num_box.text_frame.paragraphs[0].alignment = PP_ALIGN.RIGHT
    p = num_box.text_frame.paragraphs[0]
    p.text = section['num']
    p.font.size = Pt(280)
    p.font.color.rgb = text_color if layout_type in ['left-align', 'fullbleed'] else accent_color

    return slide
