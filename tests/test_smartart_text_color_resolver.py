"""Tests for SmartArt text-color resolver."""

from __future__ import annotations

import os
import tempfile
from pathlib import Path

from pptx_gen import generate_pptx
from pptx_gen.smartart_text_color_resolver import resolve_smartart_text_colors


ROOT = Path(__file__).resolve().parents[1]
SMARTART_SAMPLE = ROOT / "smartart.pptx"


def _base_config() -> dict:
    return {
        "theme": "forest_green",
        "pageType": "content-smartart",
        "slide": {"width": 1280, "height": 720, "widthInches": 13.333, "heightInches": 7.5},
        "slideMaster": {"decorativeShapes": [], "placeholders": {}, "contentAreas": {}},
        "smartart": {
            "type": "pyramid",
            "category": "pyramid",
            "placement": "full",
            "colorScheme": "colorful1",
            "items": [
                {"text": "愿景", "children": [{"text": "长期目标"}]},
                {"text": "战略", "children": [{"text": "中期规划"}]},
                {"text": "战术", "children": [{"text": "短期行动"}]},
                {"text": "执行", "children": [{"text": "日常任务"}]},
            ],
        },
    }


def test_resolver_extracts_expected_pyramid_style_labels():
    config = _base_config()

    with tempfile.NamedTemporaryFile(suffix=".pptx", delete=False) as fp:
        output_path = fp.name

    try:
        generate_pptx(config, output_path)
        entries = resolve_smartart_text_colors(output_path)
        assert entries, "Expected at least one SmartArt entry"

        first = entries[0]
        style_map = first["styleLabelColors"]

        assert "revTx" in style_map
        assert style_map["revTx"]["colorKey"] == "tx1"
        assert style_map["revTx"]["mappedColorKey"] == "dk1"

        assert "alignAcc1" in style_map
        assert style_map["alignAcc1"]["colorKey"] == "dk1"
        assert style_map["alignAcc1"]["mappedColorKey"] == "dk1"

        # Both parent/child labels resolve to a concrete RGB under current theme map.
        assert style_map["revTx"]["rgb"]
        assert style_map["alignAcc1"]["rgb"]
    finally:
        os.unlink(output_path)


def test_resolver_generalizes_on_reference_pptx():
    assert SMARTART_SAMPLE.exists(), f"Missing sample file: {SMARTART_SAMPLE}"
    entries = resolve_smartart_text_colors(SMARTART_SAMPLE)
    assert len(entries) >= 40

    mapped_keys = set()
    labels = set()
    for entry in entries:
        for label, value in entry.get("styleLabelColors", {}).items():
            labels.add(label)
            mapped = value.get("mappedColorKey")
            if mapped:
                mapped_keys.add(mapped)

    # Reference deck includes both dark/light text mapping patterns.
    assert "dk1" in mapped_keys
    assert "lt1" in mapped_keys
    assert "revTx" in labels

