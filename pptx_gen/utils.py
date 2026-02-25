"""
Utility functions for PPTX generation.
"""


def _layout_placeholder_types(layout):
    """Return placeholder type names for a layout."""
    types = []
    for ph in layout.placeholders:
        try:
            t = ph.placeholder_format.type
            types.append(getattr(t, "name", str(t)))
        except Exception:
            types.append("UNKNOWN")
    return types


def _find_layout_by_name(prs, expected_names):
    """Find layout by case-insensitive name match."""
    name_set = {name.lower() for name in expected_names}
    for layout in prs.slide_layouts:
        if layout.name and layout.name.strip().lower() in name_set:
            return layout
    return None


def get_blank_layout(prs):
    """Get blank slide layout safely.

    Prefers a layout explicitly named 'Blank'. Falls back to a layout
    without TITLE/OBJECT/CHART placeholders, then to the sparsest layout.
    """
    layouts = prs.slide_layouts
    named = _find_layout_by_name(prs, {"blank"})
    if named is not None:
        return named

    best = None
    best_score = None
    for layout in layouts:
        types = _layout_placeholder_types(layout)
        has_content_ph = any(t in {"TITLE", "OBJECT", "CHART", "PICTURE"} for t in types)
        if has_content_ph:
            continue
        score = len(types)
        if best is None or score < best_score:
            best = layout
            best_score = score
    if best is not None:
        return best

    # Final fallback: fewest placeholders.
    return min(layouts, key=lambda l: len(list(l.placeholders)))


def get_title_only_layout(prs):
    """Get title-only slide layout safely.

    Prefers a layout explicitly named 'Title Only'. Falls back to a layout
    that includes TITLE but no OBJECT/CHART/PICTURE placeholders.
    """
    layouts = prs.slide_layouts

    named = _find_layout_by_name(prs, {"title only"})
    if named is not None:
        return named

    candidate = None
    for layout in layouts:
        types = _layout_placeholder_types(layout)
        has_title = "TITLE" in types
        has_content = any(t in {"OBJECT", "CHART", "PICTURE"} for t in types)
        if has_title and not has_content:
            candidate = layout
            break
    if candidate is not None:
        return candidate

    return get_blank_layout(prs)
