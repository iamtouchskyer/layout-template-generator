"""
Zone content rendering for PPTX generation.
"""

from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN

from .themes import hex_to_rgb


def render_zone_content(slide, content_type: str, zone_id: str, x: float, y: float,
                        w: float, h: float, theme: dict, zone_data: dict = None):
    """Render content in a zone based on content type.

    Args:
        slide: PowerPoint slide object
        content_type: Type of content (chart, image, metric, table, bullets, text)
        zone_id: Zone identifier (A, B, C, D, etc.)
        x, y: Zone position in inches
        w, h: Zone dimensions in inches
        theme: Theme colors dict
        zone_data: Full zone data including chartData, textData, etc.
    """
    zone_data = zone_data or {}
    accent_color = hex_to_rgb(theme['accent'])
    text_color = hex_to_rgb(theme['text'])
    # Card background should be white for content cards
    card_bg = hex_to_rgb('#FFFFFF')
    card_border = hex_to_rgb(theme.get('card_border', '#E8E8E8'))
    muted_color = hex_to_rgb(theme.get('text_muted', '#888888'))

    # Add card background
    card = slide.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE,
        Inches(x), Inches(y), Inches(w), Inches(h)
    )
    card.fill.solid()
    card.fill.fore_color.rgb = card_bg
    card.line.color.rgb = card_border

    # Content padding
    padding = 0.15
    content_x = x + padding
    content_y = y + padding
    content_w = w - 2 * padding
    content_h = h - 2 * padding

    if content_type == 'chart':
        chart_data = zone_data.get('chartData', {})
        _render_chart_zone(slide, zone_id, content_x, content_y, content_w, content_h, text_color, theme, chart_data)
    elif content_type == 'image':
        _render_image_zone(slide, zone_id, content_x, content_y, content_w, content_h, x, y, w, h, text_color, card_border)
    elif content_type == 'metric':
        _render_metric_zone(slide, zone_id, content_x, content_y, content_w, content_h, accent_color, muted_color)
    elif content_type == 'table':
        _render_table_zone(slide, zone_id, content_x, content_y, content_w, content_h, x, y, w, h, text_color, card_border)
    elif content_type == 'bullets':
        _render_bullets_zone(slide, zone_id, content_x, content_y, content_w, content_h, y, h, text_color, accent_color)
    else:
        _render_text_zone(slide, zone_id, content_x, content_y, content_w, content_h, text_color, zone_data)


def _render_chart_zone(slide, zone_id, content_x, content_y, content_w, content_h, text_color, theme, chart_data):
    """Render real chart using python-pptx chart API."""
    from pptx.chart.data import CategoryChartData
    from pptx.enum.chart import XL_CHART_TYPE

    # Chart title
    title = chart_data.get('title', f'图表 {zone_id}')
    header = slide.shapes.add_textbox(Inches(content_x), Inches(content_y), Inches(content_w), Inches(0.35))
    p = header.text_frame.paragraphs[0]
    p.text = title
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = text_color

    # Chart area position (below title)
    chart_x = content_x
    chart_y = content_y + 0.4
    chart_w = content_w
    chart_h = content_h - 0.5

    # If no chart data, show placeholder
    if not chart_data.get('categories') or not chart_data.get('series'):
        _render_chart_placeholder(slide, chart_x, chart_y, chart_w, chart_h)
        return

    # Build chart data
    categories = chart_data.get('categories', [])
    series_list = chart_data.get('series', [])
    chart_type_str = chart_data.get('chartType', 'line')

    # Map chart type string to XL_CHART_TYPE
    chart_type_map = {
        'line': XL_CHART_TYPE.LINE,
        'bar': XL_CHART_TYPE.COLUMN_CLUSTERED,
        'column': XL_CHART_TYPE.COLUMN_CLUSTERED,
        'pie': XL_CHART_TYPE.PIE,
        'area': XL_CHART_TYPE.AREA,
        'doughnut': XL_CHART_TYPE.DOUGHNUT,
    }
    xl_chart_type = chart_type_map.get(chart_type_str, XL_CHART_TYPE.LINE)

    # Create chart data
    cd = CategoryChartData()
    cd.categories = categories

    for series in series_list:
        series_name = series.get('name', 'Series')
        series_values = series.get('data', [])
        cd.add_series(series_name, series_values)

    # Add chart to slide
    chart_shape = slide.shapes.add_chart(
        xl_chart_type, Inches(chart_x), Inches(chart_y),
        Inches(chart_w), Inches(chart_h), cd
    )

    # Style the chart
    chart = chart_shape.chart
    chart.has_legend = False

    # Set line color to accent color for line charts
    if chart_type_str == 'line' and chart.series:
        accent_color = hex_to_rgb(theme['accent'])
        for series in chart.series:
            series.format.line.color.rgb = accent_color
            series.format.line.width = Pt(2)


def _render_chart_placeholder(slide, x, y, w, h):
    """Render chart placeholder when no data available."""
    area = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE,
        Inches(x), Inches(y), Inches(w), Inches(h)
    )
    area.fill.solid()
    area.fill.fore_color.rgb = hex_to_rgb('#F5F5F5')
    area.line.color.rgb = hex_to_rgb('#E0E0E0')

    icon = slide.shapes.add_textbox(
        Inches(x + w/2 - 0.3), Inches(y + h/2 - 0.2), Inches(0.6), Inches(0.4)
    )
    icon.text_frame.paragraphs[0].text = "📊"
    icon.text_frame.paragraphs[0].font.size = Pt(24)
    icon.text_frame.paragraphs[0].alignment = PP_ALIGN.CENTER


def _render_image_zone(slide, zone_id, content_x, content_y, content_w, content_h, x, y, w, h, text_color, card_border):
    """Render image placeholder zone."""
    header = slide.shapes.add_textbox(Inches(content_x), Inches(content_y), Inches(content_w), Inches(0.35))
    p = header.text_frame.paragraphs[0]
    p.text = f"图片 {zone_id}"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = text_color

    img_area = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE,
        Inches(content_x + 0.2), Inches(content_y + 0.5),
        Inches(content_w - 0.4), Inches(content_h - 0.7)
    )
    img_area.fill.solid()
    img_area.fill.fore_color.rgb = hex_to_rgb('#E8E8E8')
    img_area.line.color.rgb = card_border

    icon = slide.shapes.add_textbox(
        Inches(x + w/2 - 0.3), Inches(y + h/2 - 0.2), Inches(0.6), Inches(0.4)
    )
    icon.text_frame.paragraphs[0].text = "🖼️"
    icon.text_frame.paragraphs[0].font.size = Pt(24)
    icon.text_frame.paragraphs[0].alignment = PP_ALIGN.CENTER


def _render_metric_zone(slide, zone_id, content_x, content_y, content_w, content_h, accent_color, muted_color):
    """Render metric display zone."""
    metric_box = slide.shapes.add_textbox(
        Inches(content_x), Inches(content_y + content_h * 0.2),
        Inches(content_w), Inches(content_h * 0.4)
    )
    metric_box.text_frame.paragraphs[0].alignment = PP_ALIGN.CENTER
    p = metric_box.text_frame.paragraphs[0]
    p.text = "85%"
    p.font.size = Pt(48)
    p.font.bold = True
    p.font.color.rgb = accent_color

    label_box = slide.shapes.add_textbox(
        Inches(content_x), Inches(content_y + content_h * 0.6),
        Inches(content_w), Inches(0.4)
    )
    label_box.text_frame.paragraphs[0].alignment = PP_ALIGN.CENTER
    p = label_box.text_frame.paragraphs[0]
    p.text = f"关键指标 {zone_id}"
    p.font.size = Pt(14)
    p.font.color.rgb = muted_color


def _render_table_zone(slide, zone_id, content_x, content_y, content_w, content_h, x, y, w, h, text_color, card_border):
    """Render table placeholder zone."""
    header = slide.shapes.add_textbox(Inches(content_x), Inches(content_y), Inches(content_w), Inches(0.35))
    p = header.text_frame.paragraphs[0]
    p.text = f"表格 {zone_id}"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = text_color

    table_area = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE,
        Inches(content_x + 0.1), Inches(content_y + 0.5),
        Inches(content_w - 0.2), Inches(content_h - 0.7)
    )
    table_area.fill.solid()
    table_area.fill.fore_color.rgb = hex_to_rgb('#FAFAFA')
    table_area.line.color.rgb = card_border

    icon = slide.shapes.add_textbox(
        Inches(x + w/2 - 0.3), Inches(y + h/2 - 0.2), Inches(0.6), Inches(0.4)
    )
    icon.text_frame.paragraphs[0].text = "📋"
    icon.text_frame.paragraphs[0].font.size = Pt(24)
    icon.text_frame.paragraphs[0].alignment = PP_ALIGN.CENTER


def _render_bullets_zone(slide, zone_id, content_x, content_y, content_w, content_h, y, h, text_color, accent_color):
    """Render bullet list zone."""
    header = slide.shapes.add_textbox(Inches(content_x), Inches(content_y), Inches(content_w), Inches(0.35))
    p = header.text_frame.paragraphs[0]
    p.text = f"要点 {zone_id}"
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = text_color

    bullets = ["要点一：关键信息", "要点二：重要说明", "要点三：总结概括"]
    for i, bullet_text in enumerate(bullets):
        if content_y + 0.55 + i * 0.45 > y + h - 0.3:
            break

        dot = slide.shapes.add_shape(
            MSO_SHAPE.OVAL,
            Inches(content_x + 0.05), Inches(content_y + 0.55 + i * 0.45),
            Inches(0.08), Inches(0.08)
        )
        dot.fill.solid()
        dot.fill.fore_color.rgb = accent_color
        dot.line.fill.background()

        text = slide.shapes.add_textbox(
            Inches(content_x + 0.2), Inches(content_y + 0.45 + i * 0.45),
            Inches(content_w - 0.3), Inches(0.4)
        )
        text.text_frame.word_wrap = True
        p = text.text_frame.paragraphs[0]
        p.text = bullet_text
        p.font.size = Pt(11)
        p.font.color.rgb = text_color


def _render_text_zone(slide, zone_id, content_x, content_y, content_w, content_h, text_color, zone_data=None):
    """Render text content zone."""
    zone_data = zone_data or {}
    text_data = zone_data.get('textData', {})

    # Use provided title or default
    title = text_data.get('title', f"区域 {zone_id}")
    body_text = text_data.get('body', "这里是文本内容区域，可以放置段落、描述或说明文字。")

    header = slide.shapes.add_textbox(Inches(content_x), Inches(content_y), Inches(content_w), Inches(0.35))
    p = header.text_frame.paragraphs[0]
    p.text = title
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = text_color

    body = slide.shapes.add_textbox(
        Inches(content_x), Inches(content_y + 0.45),
        Inches(content_w), Inches(content_h - 0.6)
    )
    body.text_frame.word_wrap = True
    p = body.text_frame.paragraphs[0]
    p.text = body_text
    p.font.size = Pt(11)
    p.font.color.rgb = text_color
