"""
Unit tests for SmartArt generation.

Tests that SmartArt color schemes work correctly with theme colors.
"""

import sys
import os
import tempfile

# Add python-pptx fork to path
sys.path.insert(0, '/Users/touichskyer/Code/python-pptx/src')

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from pptx import Presentation
from pptx.enum.smartart import SMARTART_TYPE, SMARTART_COLORS

from pptx_gen import generate_pptx
from pptx_gen.themes import THEME_COLORS, get_theme


class TestSmartArtColorSchemes:
    """Test SmartArt color scheme mappings."""

    def test_smartart_colors_enum_exists(self):
        """SMARTART_COLORS enum should have colorful schemes."""
        assert hasattr(SMARTART_COLORS, 'COLORFUL_ACCENT_COLORS')
        assert hasattr(SMARTART_COLORS, 'COLORFUL_ACCENT_2_TO_3')
        assert hasattr(SMARTART_COLORS, 'ACCENT_1')
        assert hasattr(SMARTART_COLORS, 'ACCENT_2')

    def test_smartart_type_enum_exists(self):
        """SMARTART_TYPE enum should have pyramid, matrix, etc."""
        assert hasattr(SMARTART_TYPE, 'BASIC_PYRAMID')
        assert hasattr(SMARTART_TYPE, 'BASIC_MATRIX')
        assert hasattr(SMARTART_TYPE, 'BASIC_CYCLE')
        assert hasattr(SMARTART_TYPE, 'BASIC_PROCESS')


class TestSmartArtGeneration:
    """Test SmartArt generation with different themes."""

    def test_generate_smartart_slide(self):
        """Generate PPTX with SmartArt slide."""
        config = {
            'theme': 'soft_peach_cream',
            'pageType': 'content-smartart',
            'slide': {'width': 1280, 'height': 720, 'widthInches': 13.333, 'heightInches': 7.5},
            'slideMaster': {'decorativeShapes': [], 'placeholders': {}, 'contentAreas': {}},
            'smartart': {
                'type': 'pyramid',
                'category': 'pyramid',
                'placement': 'full',
                'colorScheme': 'colorful1',
            },
        }

        with tempfile.NamedTemporaryFile(suffix='.pptx', delete=False) as f:
            output_path = f.name

        try:
            generate_pptx(config, output_path)

            # Verify file was created
            assert os.path.exists(output_path)
            assert os.path.getsize(output_path) > 0

            # Can open the file
            prs = Presentation.open(output_path)
            assert len(prs.slides) == 1
        finally:
            os.unlink(output_path)

    def test_smartart_with_premium_theme(self):
        """Generate SmartArt with premium report theme."""
        config = {
            'theme': 'deep_blue_gold',
            'pageType': 'content-smartart',
            'slide': {'width': 1280, 'height': 720, 'widthInches': 13.333, 'heightInches': 7.5},
            'slideMaster': {'decorativeShapes': [], 'placeholders': {}, 'contentAreas': {}},
            'smartart': {
                'type': 'chevron',
                'category': 'process',
                'placement': 'full',
                'colorScheme': 'colorful1',
            },
        }

        with tempfile.NamedTemporaryFile(suffix='.pptx', delete=False) as f:
            output_path = f.name

        try:
            generate_pptx(config, output_path)

            prs = Presentation.open(output_path)
            color_scheme = prs.slide_masters[0].theme.color_scheme

            # Verify theme colors are set
            theme = get_theme('deep_blue_gold')
            expected_accent1 = theme['accentColors'][0].lstrip('#').upper()
            assert str(color_scheme.accent1) == expected_accent1
        finally:
            os.unlink(output_path)


class TestSmartArtAPI:
    """Test python-pptx SmartArt API directly."""

    def test_add_smartart_to_slide(self):
        """Can add SmartArt to a slide."""
        from pptx.util import Inches
        from pptx.smartart import SmartArtData

        prs = Presentation.create()
        slide = prs.slides.add_slide(prs.slide_layouts[6])  # Blank layout

        data = SmartArtData()
        data.add_node('Item 1')
        data.add_node('Item 2')
        data.add_node('Item 3')

        smartart = slide.shapes.add_smartart(
            smartart_type=SMARTART_TYPE.BASIC_PYRAMID,
            x=Inches(1),
            y=Inches(1),
            cx=Inches(8),
            cy=Inches(5),
            smartart_data=data,
            color_scheme=SMARTART_COLORS.COLORFUL_ACCENT_COLORS,
        )

        assert smartart is not None

    def test_smartart_color_scheme_options(self):
        """SmartArt should support different color schemes."""
        from pptx.util import Inches
        from pptx.smartart import SmartArtData

        prs = Presentation.create()
        slide = prs.slides.add_slide(prs.slide_layouts[6])

        # Test different color schemes
        schemes = [
            SMARTART_COLORS.COLORFUL_ACCENT_COLORS,
            SMARTART_COLORS.COLORFUL_ACCENT_2_TO_3,
            SMARTART_COLORS.ACCENT_1,
            SMARTART_COLORS.ACCENT_2,
        ]

        for i, scheme in enumerate(schemes):
            data = SmartArtData()
            data.add_node('A')
            data.add_node('B')

            smartart = slide.shapes.add_smartart(
                smartart_type=SMARTART_TYPE.BASIC_PROCESS,
                x=Inches(i * 2),
                y=Inches(1),
                cx=Inches(1.5),
                cy=Inches(1),
                smartart_data=data,
                color_scheme=scheme,
            )
            assert smartart is not None


class TestThemeAccentColorsInSmartArt:
    """Test that theme accent colors are used by SmartArt."""

    def test_custom_accent_colors_applied(self):
        """Custom accent colors should be reflected in the theme."""
        theme = {
            'dk1': '#000000',
            'lt1': '#FFFFFF',
            'accent1': '#FF0000',  # Red
            'accent2': '#00FF00',  # Green
            'accent3': '#0000FF',  # Blue
            'accent4': '#FFFF00',  # Yellow
            'accent5': '#FF00FF',  # Magenta
            'accent6': '#00FFFF',  # Cyan
            'major_font': 'Arial',
            'minor_font': 'Arial',
        }

        prs = Presentation.create(theme=theme)
        color_scheme = prs.slide_masters[0].theme.color_scheme

        # Verify all accent colors
        assert str(color_scheme.accent1) == 'FF0000'
        assert str(color_scheme.accent2) == '00FF00'
        assert str(color_scheme.accent3) == '0000FF'
        assert str(color_scheme.accent4) == 'FFFF00'
        assert str(color_scheme.accent5) == 'FF00FF'
        assert str(color_scheme.accent6) == '00FFFF'


class TestSmartArtLayouts:
    """Test specific SmartArt layout types."""

    def test_cycle_layout(self):
        """Generate PPTX with basic cycle (cycle4) SmartArt."""
        config = {
            'theme': 'soft_peach_cream',
            'pageType': 'content-smartart',
            'slide': {'width': 1280, 'height': 720, 'widthInches': 13.333, 'heightInches': 7.5},
            'slideMaster': {'decorativeShapes': [], 'placeholders': {}, 'contentAreas': {}},
            'smartart': {
                'type': 'cycle',
                'category': 'cycle',
                'placement': 'full',
                'colorScheme': 'colorful1',
                'items': ['战略愿景', '日常任务', '经营目标', '执行计划'],
            },
        }

        with tempfile.NamedTemporaryFile(suffix='.pptx', delete=False) as f:
            output_path = f.name

        try:
            generate_pptx(config, output_path)
            assert os.path.exists(output_path)
            assert os.path.getsize(output_path) > 0

            prs = Presentation.open(output_path)
            assert len(prs.slides) == 1
        finally:
            os.unlink(output_path)

    def test_hexagon_alternating_layout(self):
        """Generate PPTX with alternating hexagons SmartArt."""
        config = {
            'theme': 'deep_blue_gold',
            'pageType': 'content-smartart',
            'slide': {'width': 1280, 'height': 720, 'widthInches': 13.333, 'heightInches': 7.5},
            'slideMaster': {'decorativeShapes': [], 'placeholders': {}, 'contentAreas': {}},
            'smartart': {
                'type': 'hexagon-alternating',
                'category': 'list',
                'placement': 'full',
                'colorScheme': 'colorful1',
                'items': ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'],
            },
        }

        with tempfile.NamedTemporaryFile(suffix='.pptx', delete=False) as f:
            output_path = f.name

        try:
            generate_pptx(config, output_path)
            assert os.path.exists(output_path)
            assert os.path.getsize(output_path) > 0

            prs = Presentation.open(output_path)
            assert len(prs.slides) == 1
        finally:
            os.unlink(output_path)

    def test_pyramid_list_layout(self):
        """Generate PPTX with pyramid list (pyramid2) SmartArt."""
        config = {
            'theme': 'soft_peach_cream',
            'pageType': 'content-smartart',
            'slide': {'width': 1280, 'height': 720, 'widthInches': 13.333, 'heightInches': 7.5},
            'slideMaster': {'decorativeShapes': [], 'placeholders': {}, 'contentAreas': {}},
            'smartart': {
                'type': 'pyramid-list',
                'category': 'pyramid',
                'placement': 'full',
                'colorScheme': 'colorful1',
                'items': ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'],
            },
        }

        with tempfile.NamedTemporaryFile(suffix='.pptx', delete=False) as f:
            output_path = f.name

        try:
            generate_pptx(config, output_path)
            assert os.path.exists(output_path)
            assert os.path.getsize(output_path) > 0

            prs = Presentation.open(output_path)
            assert len(prs.slides) == 1
        finally:
            os.unlink(output_path)


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
