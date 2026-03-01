"""
Grid/content slide generator.
"""

from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor

from ..themes import hex_to_rgb
from ..layout import calculate_zone_positions, render_zone_content
from ..dimensions import px_to_inches_x, px_to_inches_y
from ..utils import get_blank_layout, get_title_only_layout, remove_slide_placeholders

# Layout constants
PILL_WIDTH = Inches(0.8)
PILL_HEIGHT = Inches(0.3)
PILL_SPACING = Inches(0.15)
PILL_FONT_SIZE = Pt(10)
TITLE_FONT_SIZE = Pt(28)
SOURCE_FONT_SIZE = Pt(9)
SOURCE_HEIGHT = Inches(0.25)


def generate_grid_slide(prs, config, theme):
    """Generate grid/content slide with dynamic layout from config.

    Uses slide layout with placeholders to inherit from slide master.
    Uses pre-calculated bounds from frontend for WYSIWYG accuracy.
    """
    # Get content area config from slideMaster (with pre-calculated bounds)
    content_areas = config.get('slideMaster', {}).get('contentAreas', {})
    title_style = content_areas.get('titleStyle', 'with-tag')
    source_style = content_areas.get('sourceStyle', 'citation')
    has_title = title_style != 'none'

    # Choose layout based on whether we have title
    if has_title:
        slide = prs.slides.add_slide(get_title_only_layout(prs))
        remove_slide_placeholders(slide, keep_types={"TITLE"})
    else:
        slide = prs.slides.add_slide(get_blank_layout(prs))
        remove_slide_placeholders(slide)

    # Get pre-calculated bounds (in pixels)
    header_bounds = content_areas.get('headerBounds', {})
    body_bounds = content_areas.get('bodyBounds', {})
    footer_bounds = content_areas.get('footerBounds', {})

    # Get grid config
    grid_config = config.get('grid', {})
    layout_id = grid_config.get('layout', 'two-col-equal')
    zones = grid_config.get('zones', [])

    # Convert pre-calculated bounds from pixels to inches
    # NOTE: Frontend uses 1280x720 px, PowerPoint uses 10"x7.5"
    # See slide_master.py docstring for coordinate conversion details

    # Body bounds
    body_x = px_to_inches_x(body_bounds.get('x', 40))
    body_y = px_to_inches_y(body_bounds.get('y', 88))
    body_w = px_to_inches_x(body_bounds.get('width', 1200))
    body_h = px_to_inches_y(body_bounds.get('height', 592))
    # Header bounds
    header_x = px_to_inches_x(header_bounds.get('x', 40))
    header_y = px_to_inches_y(header_bounds.get('y', 20))
    header_w = px_to_inches_x(header_bounds.get('width', 1200))
    header_h = px_to_inches_y(header_bounds.get('height', 60))

    # Footer bounds
    footer_x = px_to_inches_x(footer_bounds.get('x', 40))
    footer_y = px_to_inches_y(footer_bounds.get('y', 680))
    footer_w = px_to_inches_x(footer_bounds.get('width', 1200))

    ZONE_GAP = px_to_inches_x(24)  # Gap between zones (24px)

    content_title = str(config.get('contentTitle') or '市场趋势分析')
    content_tag = str(config.get('contentTag') or '分析报告')
    content_source = str(config.get('contentSource') or '行业研究报告 2024')

    # Set title using placeholder (inherits position from slide master)
    if has_title:
        title_placeholder = slide.shapes.title
        if title_placeholder is not None:
            # Force slide-level placeholder bounds to match frontend header bounds.
            # Layout placeholders can diverge from master; we align directly here.
            title_placeholder.left = Inches(header_x)
            title_placeholder.top = Inches(header_y)
            title_placeholder.width = Inches(header_w)
            title_placeholder.height = Inches(header_h)
        set_title_with_style(
            slide,
            title_placeholder,
            content_title,
            content_tag,
            theme,
            title_style,
            bounds=(header_x, header_y, header_w, header_h),
        )

    # Add source citation if enabled
    has_source = source_style == 'citation'
    if has_source:
        add_source_citation_dynamic(slide, content_source, theme,
                                     x=footer_x, y=footer_y, width=footer_w)

    # Calculate zone positions based on layout (using body bounds)
    zone_positions = calculate_zone_positions(layout_id, zones, body_x, body_y, body_w, body_h, ZONE_GAP)

    # Build zone data lookup for chart/content data
    zone_data_map = {z['id']: z for z in zones}

    # Render each zone
    for zone_pos in zone_positions:
        zone_id = zone_pos['id']
        content_type = zone_pos.get('content', 'text')
        x, y, w, h = zone_pos['x'], zone_pos['y'], zone_pos['w'], zone_pos['h']

        # Get full zone data (includes chartData, textData, etc.)
        zone_data = zone_data_map.get(zone_id, {})

        render_zone_content(slide, content_type, zone_id, x, y, w, h, theme, zone_data)

    return slide


def set_title_with_style(
    slide,
    title_placeholder,
    title: str,
    tag: str,
    theme: dict,
    title_style: str,
    bounds: tuple[float, float, float, float] | None = None,
):
    """Set title with optional pill-shaped tag.

    For 'with-tag' style, adds a rounded rectangle pill before the title.
    """
    from pptx.enum.shapes import MSO_SHAPE
    from pptx.enum.text import PP_ALIGN, MSO_ANCHOR

    text_color = hex_to_rgb(theme['primary'])
    accent_color = hex_to_rgb(theme['accent'])

    if bounds is not None:
        bx, by, bw, bh = bounds
        ph_left = Inches(bx)
        ph_top = Inches(by)
        ph_width = Inches(bw)
        ph_height = Inches(bh)
    elif title_placeholder is not None:
        ph_left = title_placeholder.left
        ph_top = title_placeholder.top
        ph_width = title_placeholder.width
        ph_height = title_placeholder.height
    else:
        # Fallback to default header area
        ph_left = Inches(0.42)
        ph_top = Inches(0.2)
        ph_width = Inches(12.5)
        ph_height = Inches(0.62)

    tf = title_placeholder.text_frame if title_placeholder is not None else None
    if tf is not None:
        tf.clear()

    if title_style == 'with-tag' and tag:
        # Add pill-shaped tag as a separate shape
        pill_left = ph_left
        pill_top = ph_top + (ph_height - PILL_HEIGHT) // 2

        pill = slide.shapes.add_shape(
            MSO_SHAPE.ROUNDED_RECTANGLE,
            pill_left, pill_top, PILL_WIDTH, PILL_HEIGHT
        )
        pill.fill.solid()
        pill.fill.fore_color.rgb = accent_color
        pill.line.fill.background()

        # Add tag text in pill
        pill.text_frame.paragraphs[0].text = tag
        pill.text_frame.paragraphs[0].font.size = PILL_FONT_SIZE
        pill.text_frame.paragraphs[0].font.bold = True
        pill.text_frame.paragraphs[0].font.color.rgb = RGBColor(255, 255, 255)
        pill.text_frame.paragraphs[0].alignment = PP_ALIGN.CENTER
        pill.text_frame.vertical_anchor = MSO_ANCHOR.MIDDLE

        # Offset title to the right of the pill
        title_left = pill_left + PILL_WIDTH + PILL_SPACING
        title_width = ph_width - PILL_WIDTH - PILL_SPACING

        # Create title textbox (don't use placeholder since we need custom positioning)
        title_box = slide.shapes.add_textbox(title_left, ph_top, title_width, ph_height)
        title_box.text_frame.word_wrap = True
        p = title_box.text_frame.paragraphs[0]
        p.text = title
        p.font.size = TITLE_FONT_SIZE
        p.font.bold = True
        p.font.color.rgb = text_color
        title_box.text_frame.vertical_anchor = MSO_ANCHOR.MIDDLE

        # Clear the original placeholder (we're using custom shapes)
        if tf is not None:
            tf.paragraphs[0].text = ""
    else:
        # Use custom text box so geometry is always controlled by headerBounds.
        title_box = slide.shapes.add_textbox(ph_left, ph_top, ph_width, ph_height)
        title_box.text_frame.word_wrap = True
        title_box.text_frame.vertical_anchor = MSO_ANCHOR.MIDDLE
        p = title_box.text_frame.paragraphs[0]
        p.text = title
        p.font.size = TITLE_FONT_SIZE
        p.font.bold = True
        p.font.color.rgb = text_color
        if tf is not None:
            tf.paragraphs[0].text = ""


def add_source_citation_dynamic(slide, source: str, theme: dict, x: float, y: float, width: float):
    """Add source citation at specified position."""
    text_box = slide.shapes.add_textbox(
        Inches(x), Inches(y), Inches(width), SOURCE_HEIGHT
    )
    p = text_box.text_frame.paragraphs[0]
    p.text = f"数据来源：{source}"
    p.font.size = SOURCE_FONT_SIZE
    p.font.color.rgb = hex_to_rgb(theme.get('text_muted', '#888888'))
