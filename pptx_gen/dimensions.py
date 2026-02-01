"""
Slide dimension and coordinate conversion utilities.

COORDINATE SYSTEM NOTE:
-----------------------
Frontend uses 1280 x 720 px canvas for preview.
PowerPoint uses 10" x 7.5" slide dimensions.

The conversion is NOT simply px / 96 (standard DPI).
Correct conversion:
    x_inches = x_px * (10 / 1280)  = x_px / 128
    y_inches = y_px * (7.5 / 720)  = y_px / 96

Width/height follow the same rule based on their axis.
"""

# Default dimensions (can be overridden by config)
# Frontend canvas dimensions (px)
_frontend_width_px = 1280
_frontend_height_px = 720

# PowerPoint slide dimensions (inches)
_pptx_width_in = 13.333  # 16:9 default
_pptx_height_in = 7.5


def set_slide_dimensions(frontend_width_px: int, frontend_height_px: int,
                         pptx_width_in: float, pptx_height_in: float):
    """Set slide dimensions for coordinate conversion.

    Called by setup_slide_master() when config includes slide dimensions.
    """
    global _frontend_width_px, _frontend_height_px, _pptx_width_in, _pptx_height_in
    _frontend_width_px = frontend_width_px
    _frontend_height_px = frontend_height_px
    _pptx_width_in = pptx_width_in
    _pptx_height_in = pptx_height_in


def px_to_inches_x(px: float) -> float:
    """Convert frontend X coordinate or width from pixels to inches."""
    return px * (_pptx_width_in / _frontend_width_px)


def px_to_inches_y(px: float) -> float:
    """Convert frontend Y coordinate or height from pixels to inches."""
    return px * (_pptx_height_in / _frontend_height_px)


def get_pptx_dimensions() -> tuple:
    """Get current PowerPoint dimensions in inches."""
    return (_pptx_width_in, _pptx_height_in)
