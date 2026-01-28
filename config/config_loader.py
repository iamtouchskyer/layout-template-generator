"""
Config Loader for Python
Loads the same slide-master.json used by JavaScript preview.
This ensures JS preview and Python pptx generator use identical configuration.
"""

import json
from pathlib import Path
from dataclasses import dataclass
from typing import Dict, List, Optional, Any


# EMU (English Metric Units) conversion
EMU_PER_INCH = 914400
EMU_PER_PT = 12700
EMU_PER_PX = 9525  # Approximate: 96 DPI


@dataclass
class SlideConfig:
    """Slide dimensions and margins."""
    width_px: int
    height_px: int
    width_emu: int
    height_emu: int
    base_margin: Dict[str, int]  # top, right, bottom, left in px

    @classmethod
    def from_dict(cls, data: dict) -> 'SlideConfig':
        return cls(
            width_px=data['width']['px'],
            height_px=data['height']['px'],
            width_emu=data['width']['emu'],
            height_emu=data['height']['emu'],
            base_margin={
                'top': data['baseMargin']['top']['px'],
                'right': data['baseMargin']['right']['px'],
                'bottom': data['baseMargin']['bottom']['px'],
                'left': data['baseMargin']['left']['px'],
            }
        )


@dataclass
class ShapePreset:
    """Configuration for a shape preset."""
    name: str
    position: Dict[str, Any]
    size: Dict[str, Any]
    style: Optional[Dict[str, Any]]
    bounds: Dict[str, int]


@dataclass
class ShapeConfig:
    """Configuration for a shape type."""
    label: str
    occupies_space: bool
    presets: Dict[str, ShapePreset]
    default_content: Optional[str] = None


class SlideMasterConfig:
    """Main configuration class - loads and provides access to slide-master.json."""

    def __init__(self, config_path: Optional[Path] = None):
        if config_path is None:
            config_path = Path(__file__).parent / 'slide-master.json'

        with open(config_path, 'r', encoding='utf-8') as f:
            self._raw = json.load(f)

        self.slide = SlideConfig.from_dict(self._raw['slide'])
        self.placeholders = self._raw['placeholders']
        self.shapes = self._parse_shapes(self._raw['shapes'])
        self.grid_layouts = self._raw['gridLayouts']
        self.zone_content_types = self._raw['zoneContentTypes']

    def _parse_shapes(self, shapes_data: dict) -> Dict[str, ShapeConfig]:
        """Parse shapes configuration into dataclasses."""
        result = {}
        for shape_id, shape_data in shapes_data.items():
            presets = {}
            for preset_id, preset_data in shape_data['presets'].items():
                presets[preset_id] = ShapePreset(
                    name=preset_data['name'],
                    position=preset_data.get('position', {}),
                    size=preset_data.get('size', {}),
                    style=preset_data.get('style'),
                    bounds=preset_data.get('bounds', {}),
                )
            result[shape_id] = ShapeConfig(
                label=shape_data['label'],
                occupies_space=shape_data['occupiesSpace'],
                presets=presets,
                default_content=shape_data.get('defaultContent'),
            )
        return result

    def get_content_bounds(
        self,
        placeholders: List[str],
        shapes: List[Dict[str, str]]
    ) -> Dict[str, int]:
        """
        Calculate content bounds based on enabled placeholders and shapes.

        Args:
            placeholders: List of enabled placeholder IDs (e.g., ['logo', 'page-number'])
            shapes: List of shape dicts with 'id' and 'preset' keys

        Returns:
            Dict with top, right, bottom, left values in pixels
        """
        bounds = dict(self.slide.base_margin)

        def apply_bounds(bounds_obj: dict):
            if not bounds_obj:
                return
            for key in ['top', 'right', 'bottom', 'left']:
                if key in bounds_obj:
                    bounds[key] = max(bounds[key], bounds_obj[key])

        # Apply placeholder bounds
        for placeholder_id in placeholders:
            if placeholder_id in self.placeholders:
                apply_bounds(self.placeholders[placeholder_id].get('bounds', {}))

        # Apply shape bounds (only for shapes that occupy space)
        for shape in shapes:
            shape_id = shape['id']
            preset_id = shape['preset']

            if shape_id not in self.shapes:
                continue

            shape_config = self.shapes[shape_id]
            if not shape_config.occupies_space:
                continue

            if preset_id in shape_config.presets:
                apply_bounds(shape_config.presets[preset_id].bounds)

        return bounds

    def px_to_emu(self, px: int) -> int:
        """Convert pixels to EMU."""
        return int(px * EMU_PER_PX)

    def get_bounds_emu(
        self,
        placeholders: List[str],
        shapes: List[Dict[str, str]]
    ) -> Dict[str, int]:
        """Get content bounds in EMU units for python-pptx."""
        bounds_px = self.get_content_bounds(placeholders, shapes)
        return {k: self.px_to_emu(v) for k, v in bounds_px.items()}


# Singleton instance
_config: Optional[SlideMasterConfig] = None


def get_config() -> SlideMasterConfig:
    """Get the singleton config instance."""
    global _config
    if _config is None:
        _config = SlideMasterConfig()
    return _config


# Example usage
if __name__ == '__main__':
    config = get_config()

    print(f"Slide size: {config.slide.width_px}x{config.slide.height_px}px")
    print(f"Slide size (EMU): {config.slide.width_emu}x{config.slide.height_emu}")
    print(f"Base margin: {config.slide.base_margin}")

    # Example: calculate bounds with logo and header badge
    bounds = config.get_content_bounds(
        placeholders=['logo', 'page-number'],
        shapes=[{'id': 'header-badge', 'preset': 'pill-right'}]
    )
    print(f"Content bounds: {bounds}")

    # Get bounds in EMU for python-pptx
    bounds_emu = config.get_bounds_emu(
        placeholders=['logo'],
        shapes=[]
    )
    print(f"Content bounds (EMU): {bounds_emu}")
