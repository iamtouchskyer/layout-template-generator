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


def _normalize_placeholder_type_name(value):
    text = str(value or "").strip().upper()
    if " " in text:
        text = text.split(" ", 1)[0]
    return text


def _is_content_placeholder_type(value):
    name = _normalize_placeholder_type_name(value)
    return name in {
        "TITLE",
        "CENTER_TITLE",
        "VERTICAL_TITLE",
        "SUBTITLE",
        "BODY",
        "VERTICAL_BODY",
        "OBJECT",
        "CHART",
        "PICTURE",
        "TABLE",
        "MEDIA_CLIP",
        "ORG_CHART",
        "SMART_ART",
    }


def _find_layout_by_name(prs, expected_names):
    """Find layout by case-insensitive name match."""
    name_set = {name.lower() for name in expected_names}
    for layout in prs.slide_layouts:
        if layout.name and layout.name.strip().lower() in name_set:
            return layout
    return None


def _placeholder_type_name(shape):
    try:
        t = shape.placeholder_format.type
        name = getattr(t, "name", None)
        if isinstance(name, str) and name:
            return name.upper()
        txt = str(t)
        return txt.split(" ", 1)[0].upper()
    except Exception:
        return "UNKNOWN"


def remove_slide_placeholders(slide, keep_types=None):
    """Remove layout placeholders from a slide.

    Args:
        slide: python-pptx Slide
        keep_types: iterable of placeholder type names to keep, e.g. {'TITLE'}
    """
    keep = {str(x).upper() for x in (keep_types or set())}
    for shape in list(slide.shapes):
        if not getattr(shape, "is_placeholder", False):
            continue
        pht = _placeholder_type_name(shape)
        if pht in keep:
            continue
        element = shape._element
        parent = element.getparent()
        if parent is not None:
            parent.remove(element)


def get_blank_layout(prs):
    """Get blank slide layout safely.

    Prefers a layout explicitly named 'Blank'. Falls back to a layout
    without content placeholders, then to the sparsest layout.
    """
    layouts = prs.slide_layouts
    named = _find_layout_by_name(prs, {"blank"})
    if named is not None:
        return named

    best = None
    best_score = None
    for layout in layouts:
        types = _layout_placeholder_types(layout)
        has_content_ph = any(_is_content_placeholder_type(t) for t in types)
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
    that includes TITLE but no BODY/OBJECT/CHART/PICTURE placeholders.
    """
    layouts = prs.slide_layouts

    named = _find_layout_by_name(prs, {"title only"})
    if named is not None:
        return named

    candidate = None
    for layout in layouts:
        types = _layout_placeholder_types(layout)
        normalized = {_normalize_placeholder_type_name(t) for t in types}
        has_title = "TITLE" in normalized or "CENTER_TITLE" in normalized or "VERTICAL_TITLE" in normalized
        has_body_like = any(
            t in {"BODY", "VERTICAL_BODY", "OBJECT", "CHART", "PICTURE", "TABLE", "MEDIA_CLIP", "ORG_CHART", "SMART_ART"}
            for t in normalized
        )
        if has_title and not has_body_like:
            candidate = layout
            break
    if candidate is not None:
        return candidate

    return get_blank_layout(prs)
