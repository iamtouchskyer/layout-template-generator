"""
Utility functions for PPTX generation.
"""


def get_blank_layout(prs):
    """Get blank slide layout safely.

    Tries common indices for blank layouts, falls back to last layout.
    """
    layouts = prs.slide_layouts

    # Common blank layout indices: 6 (Office), 5 (some templates)
    for idx in [6, 5, len(layouts) - 1]:
        if idx < len(layouts):
            return layouts[idx]

    # Last resort: first layout
    return layouts[0]


def get_title_only_layout(prs):
    """Get title-only slide layout safely.

    Tries common indices for title-only layouts, falls back to blank.
    """
    layouts = prs.slide_layouts

    # Common title-only layout indices: 5 (Office), 1 (some templates)
    for idx in [5, 1]:
        if idx < len(layouts):
            return layouts[idx]

    return get_blank_layout(prs)
