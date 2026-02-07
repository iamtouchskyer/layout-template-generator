"""
Unit tests for master_placeholders module.
"""

import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

# Add python-pptx (enhanced fork) to path
sys.path.insert(0, '/Users/touichskyer/Code/python-pptx/src')

from pptx import Presentation
from pptx_gen.master_placeholders import add_master_placeholders


def test_footer_placeholder_none_handling():
    """Test that None placeholders are handled gracefully."""
    prs = Presentation.create(template="mitsein")
    master = prs.slide_masters[0]

    # Test with page-number enabled
    placeholders = {
        'page-number': {
            'enabled': True,
            'position': 'br',
            'positionConfig': {'bottom': 20, 'right': 40}
        }
    }

    theme = {'accent': '#FF0000', 'text_muted': '#888888'}

    # Should not crash even if placeholder is None
    add_master_placeholders(master, placeholders, theme)

    print("✅ Footer placeholder None check test passed")


def test_date_placeholder_none_handling():
    """Test that None date placeholder is handled gracefully."""
    prs = Presentation.create(template="mitsein")
    master = prs.slide_masters[0]

    # Test with date enabled
    placeholders = {
        'date': {
            'enabled': True,
            'position': 'bl',
            'positionConfig': {'bottom': 20, 'left': 40}
        }
    }

    theme = {'accent': '#FF0000', 'text_muted': '#888888'}

    # Should not crash even if placeholder is None
    add_master_placeholders(master, placeholders, theme)

    print("✅ Date placeholder None check test passed")


if __name__ == '__main__':
    test_footer_placeholder_none_handling()
    test_date_placeholder_none_handling()
    print("\n✅ All master_placeholders tests passed!")
