"""
Layout calculation for PPTX generation.
"""

# Re-export render_zone_content for backward compatibility
from .zone_renderer import render_zone_content


def calculate_zone_positions(layout_id: str, zones: list, body_x: float, body_y: float,
                              body_w: float, body_h: float, gap: float) -> list:
    """Calculate position and size for each zone based on layout configuration.

    Args:
        layout_id: Layout identifier (e.g., 'two-col-equal', 'top-two-bottom')
        zones: List of zone configs with id, flex, content
        body_x, body_y: Body area top-left position in inches
        body_w, body_h: Body area dimensions in inches
        gap: Gap between zones in inches

    Returns:
        List of dicts: [{id, content, x, y, w, h}, ...]
    """
    if not zones:
        return []

    zone_contents = {z['id']: z.get('content', 'text') for z in zones}
    positions = []
    num_zones = len(zones)
    total_flex = sum(z.get('flex', 1) for z in zones)

    # Dispatch to appropriate layout calculator
    if layout_id in ['single']:
        positions = _calc_single(zones, zone_contents, body_x, body_y, body_w, body_h)
    elif layout_id.startswith('two-col') or layout_id in ['three-col', 'four-col']:
        positions = _calc_row_layout(zones, zone_contents, body_x, body_y, body_w, body_h, gap, total_flex)
    elif layout_id in ['two-row-equal']:
        positions = _calc_column_layout(zones, zone_contents, body_x, body_y, body_w, body_h, gap, total_flex)
    elif layout_id in ['four-grid']:
        positions = _calc_2x2_grid(zones, zone_contents, body_x, body_y, body_w, body_h, gap)
    elif layout_id in ['six-grid']:
        positions = _calc_3x2_grid(zones, zone_contents, body_x, body_y, body_w, body_h, gap)
    elif layout_id == 'top-two-bottom':
        positions = _calc_top_two_bottom(zones, zone_contents, body_x, body_y, body_w, body_h, gap)
    elif layout_id == 'top-one-bottom-two':
        positions = _calc_top_one_bottom_two(zones, zone_contents, body_x, body_y, body_w, body_h, gap)
    elif layout_id == 'top-two-bottom-three':
        positions = _calc_top_two_bottom_three(zones, zone_contents, body_x, body_y, body_w, body_h, gap)
    elif layout_id == 'top-three-bottom-two':
        positions = _calc_top_three_bottom_two(zones, zone_contents, body_x, body_y, body_w, body_h, gap)
    elif layout_id == 'left-one-right-two':
        positions = _calc_left_one_right_two(zones, zone_contents, body_x, body_y, body_w, body_h, gap)
    elif layout_id == 'left-two-right-one':
        positions = _calc_left_two_right_one(zones, zone_contents, body_x, body_y, body_w, body_h, gap)
    else:
        # Fallback: treat as row layout
        positions = _calc_row_layout(zones, zone_contents, body_x, body_y, body_w, body_h, gap, total_flex)

    return positions


def _calc_single(zones, zone_contents, body_x, body_y, body_w, body_h):
    """Single zone - full area."""
    return [{
        'id': zones[0]['id'],
        'content': zone_contents.get(zones[0]['id'], 'text'),
        'x': body_x, 'y': body_y, 'w': body_w, 'h': body_h
    }]


def _calc_row_layout(zones, zone_contents, body_x, body_y, body_w, body_h, gap, total_flex):
    """Row direction (horizontal) layout."""
    positions = []
    num_zones = len(zones)
    total_gap = gap * (num_zones - 1)
    available_width = body_w - total_gap

    current_x = body_x
    for z in zones:
        flex = z.get('flex', 1)
        zone_w = (flex / total_flex) * available_width
        positions.append({
            'id': z['id'],
            'content': zone_contents.get(z['id'], 'text'),
            'x': current_x, 'y': body_y, 'w': zone_w, 'h': body_h
        })
        current_x += zone_w + gap
    return positions


def _calc_column_layout(zones, zone_contents, body_x, body_y, body_w, body_h, gap, total_flex):
    """Column direction (vertical) layout."""
    positions = []
    num_zones = len(zones)
    total_gap = gap * (num_zones - 1)
    available_height = body_h - total_gap

    current_y = body_y
    for z in zones:
        flex = z.get('flex', 1)
        zone_h = (flex / total_flex) * available_height
        positions.append({
            'id': z['id'],
            'content': zone_contents.get(z['id'], 'text'),
            'x': body_x, 'y': current_y, 'w': body_w, 'h': zone_h
        })
        current_y += zone_h + gap
    return positions


def _calc_2x2_grid(zones, zone_contents, body_x, body_y, body_w, body_h, gap):
    """2x2 grid layout."""
    col_w = (body_w - gap) / 2
    row_h = (body_h - gap) / 2
    grid_positions = [
        (body_x, body_y),
        (body_x + col_w + gap, body_y),
        (body_x, body_y + row_h + gap),
        (body_x + col_w + gap, body_y + row_h + gap)
    ]
    positions = []
    for i, z in enumerate(zones[:4]):
        gx, gy = grid_positions[i] if i < len(grid_positions) else (body_x, body_y)
        positions.append({
            'id': z['id'],
            'content': zone_contents.get(z['id'], 'text'),
            'x': gx, 'y': gy, 'w': col_w, 'h': row_h
        })
    return positions


def _calc_3x2_grid(zones, zone_contents, body_x, body_y, body_w, body_h, gap):
    """3x2 grid layout."""
    col_w = (body_w - 2 * gap) / 3
    row_h = (body_h - gap) / 2
    positions = []
    for i, z in enumerate(zones[:6]):
        col = i % 3
        row = i // 3
        positions.append({
            'id': z['id'],
            'content': zone_contents.get(z['id'], 'text'),
            'x': body_x + col * (col_w + gap),
            'y': body_y + row * (row_h + gap),
            'w': col_w, 'h': row_h
        })
    return positions


def _calc_top_two_bottom(zones, zone_contents, body_x, body_y, body_w, body_h, gap):
    """Top row: 2 zones, Bottom row: 1 zone."""
    row_h = (body_h - gap) / 2
    col_w = (body_w - gap) / 2
    return [
        {'id': zones[0]['id'], 'content': zone_contents.get(zones[0]['id'], 'text'),
         'x': body_x, 'y': body_y, 'w': col_w, 'h': row_h},
        {'id': zones[1]['id'], 'content': zone_contents.get(zones[1]['id'], 'text'),
         'x': body_x + col_w + gap, 'y': body_y, 'w': col_w, 'h': row_h},
        {'id': zones[2]['id'], 'content': zone_contents.get(zones[2]['id'], 'text'),
         'x': body_x, 'y': body_y + row_h + gap, 'w': body_w, 'h': row_h},
    ]


def _calc_top_one_bottom_two(zones, zone_contents, body_x, body_y, body_w, body_h, gap):
    """Top row: 1 zone, Bottom row: 2 zones."""
    row_h = (body_h - gap) / 2
    col_w = (body_w - gap) / 2
    return [
        {'id': zones[0]['id'], 'content': zone_contents.get(zones[0]['id'], 'text'),
         'x': body_x, 'y': body_y, 'w': body_w, 'h': row_h},
        {'id': zones[1]['id'], 'content': zone_contents.get(zones[1]['id'], 'text'),
         'x': body_x, 'y': body_y + row_h + gap, 'w': col_w, 'h': row_h},
        {'id': zones[2]['id'], 'content': zone_contents.get(zones[2]['id'], 'text'),
         'x': body_x + col_w + gap, 'y': body_y + row_h + gap, 'w': col_w, 'h': row_h},
    ]


def _calc_top_two_bottom_three(zones, zone_contents, body_x, body_y, body_w, body_h, gap):
    """Top row: 2 zones, Bottom row: 3 zones."""
    row_h = (body_h - gap) / 2
    top_col_w = (body_w - gap) / 2
    bot_col_w = (body_w - 2 * gap) / 3
    return [
        {'id': zones[0]['id'], 'content': zone_contents.get(zones[0]['id'], 'text'),
         'x': body_x, 'y': body_y, 'w': top_col_w, 'h': row_h},
        {'id': zones[1]['id'], 'content': zone_contents.get(zones[1]['id'], 'text'),
         'x': body_x + top_col_w + gap, 'y': body_y, 'w': top_col_w, 'h': row_h},
        {'id': zones[2]['id'], 'content': zone_contents.get(zones[2]['id'], 'text'),
         'x': body_x, 'y': body_y + row_h + gap, 'w': bot_col_w, 'h': row_h},
        {'id': zones[3]['id'], 'content': zone_contents.get(zones[3]['id'], 'text'),
         'x': body_x + bot_col_w + gap, 'y': body_y + row_h + gap, 'w': bot_col_w, 'h': row_h},
        {'id': zones[4]['id'], 'content': zone_contents.get(zones[4]['id'], 'text'),
         'x': body_x + 2 * (bot_col_w + gap), 'y': body_y + row_h + gap, 'w': bot_col_w, 'h': row_h},
    ]


def _calc_top_three_bottom_two(zones, zone_contents, body_x, body_y, body_w, body_h, gap):
    """Top row: 3 zones, Bottom row: 2 zones."""
    row_h = (body_h - gap) / 2
    top_col_w = (body_w - 2 * gap) / 3
    bot_col_w = (body_w - gap) / 2
    return [
        {'id': zones[0]['id'], 'content': zone_contents.get(zones[0]['id'], 'text'),
         'x': body_x, 'y': body_y, 'w': top_col_w, 'h': row_h},
        {'id': zones[1]['id'], 'content': zone_contents.get(zones[1]['id'], 'text'),
         'x': body_x + top_col_w + gap, 'y': body_y, 'w': top_col_w, 'h': row_h},
        {'id': zones[2]['id'], 'content': zone_contents.get(zones[2]['id'], 'text'),
         'x': body_x + 2 * (top_col_w + gap), 'y': body_y, 'w': top_col_w, 'h': row_h},
        {'id': zones[3]['id'], 'content': zone_contents.get(zones[3]['id'], 'text'),
         'x': body_x, 'y': body_y + row_h + gap, 'w': bot_col_w, 'h': row_h},
        {'id': zones[4]['id'], 'content': zone_contents.get(zones[4]['id'], 'text'),
         'x': body_x + bot_col_w + gap, 'y': body_y + row_h + gap, 'w': bot_col_w, 'h': row_h},
    ]


def _calc_left_one_right_two(zones, zone_contents, body_x, body_y, body_w, body_h, gap):
    """Left: 1 zone, Right: 2 stacked zones."""
    col_w = (body_w - gap) / 2
    right_row_h = (body_h - gap) / 2
    return [
        {'id': zones[0]['id'], 'content': zone_contents.get(zones[0]['id'], 'text'),
         'x': body_x, 'y': body_y, 'w': col_w, 'h': body_h},
        {'id': zones[1]['id'], 'content': zone_contents.get(zones[1]['id'], 'text'),
         'x': body_x + col_w + gap, 'y': body_y, 'w': col_w, 'h': right_row_h},
        {'id': zones[2]['id'], 'content': zone_contents.get(zones[2]['id'], 'text'),
         'x': body_x + col_w + gap, 'y': body_y + right_row_h + gap, 'w': col_w, 'h': right_row_h},
    ]


def _calc_left_two_right_one(zones, zone_contents, body_x, body_y, body_w, body_h, gap):
    """Left: 2 stacked zones, Right: 1 zone."""
    col_w = (body_w - gap) / 2
    left_row_h = (body_h - gap) / 2
    return [
        {'id': zones[0]['id'], 'content': zone_contents.get(zones[0]['id'], 'text'),
         'x': body_x, 'y': body_y, 'w': col_w, 'h': left_row_h},
        {'id': zones[1]['id'], 'content': zone_contents.get(zones[1]['id'], 'text'),
         'x': body_x, 'y': body_y + left_row_h + gap, 'w': col_w, 'h': left_row_h},
        {'id': zones[2]['id'], 'content': zone_contents.get(zones[2]['id'], 'text'),
         'x': body_x + col_w + gap, 'y': body_y, 'w': col_w, 'h': body_h},
    ]
