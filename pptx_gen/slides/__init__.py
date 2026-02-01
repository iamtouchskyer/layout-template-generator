"""
Slide generators for different page types.
"""

from .cover import generate_cover_slide
from .divider import generate_divider_slide
from .smartart import generate_smartart_slide
from .grid import generate_grid_slide

__all__ = [
    'generate_cover_slide',
    'generate_divider_slide',
    'generate_smartart_slide',
    'generate_grid_slide',
]
