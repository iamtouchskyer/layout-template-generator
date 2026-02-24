"""Tests for multi-page payload support and v1 backward compatibility."""

from __future__ import annotations

import os
import tempfile

from pptx import Presentation

from pptx_gen import generate_pptx
from pptx_gen.adapter import normalize_input


def test_slide_count_equals_pages_count_for_v2():
    config = {
        "schemaVersion": 2,
        "master": {
            "theme": "azure",
            "masterShapes": [],
            "masterPlaceholders": {},
            "masterContentAreas": {},
        },
        "pages": [
            {"id": "p1", "type": "cover", "data": {"coverLayout": "cross_rectangles"}},
            {"id": "p2", "type": "divider", "data": {"divider": {"layout": "cards-highlight"}}},
            {"id": "p3", "type": "content-grid", "data": {"grid": {"layout": "single", "zones": []}}},
        ],
    }

    with tempfile.NamedTemporaryFile(suffix=".pptx", delete=False) as fp:
        output_path = fp.name

    try:
        generate_pptx(config, output_path)
        prs = Presentation.open(output_path)
        assert len(prs.slides) == 3
    finally:
        os.unlink(output_path)


def test_v1_backward_compat_still_generates_single_page():
    config = {
        "theme": "azure",
        "pageType": "cover",
        "slideMaster": {"decorativeShapes": [], "placeholders": {}, "contentAreas": {}},
        "coverLayout": "triangle_stack",
    }

    with tempfile.NamedTemporaryFile(suffix=".pptx", delete=False) as fp:
        output_path = fp.name

    try:
        generate_pptx(config, output_path)
        prs = Presentation.open(output_path)
        assert len(prs.slides) == 1
    finally:
        os.unlink(output_path)


def test_normalize_v1_to_v2_uses_slide_master_fields():
    v1 = {
        "theme": "forest_green",
        "pageType": "content-smartart",
        "slideMaster": {
            "decorativeShapes": [{"id": "side-bar"}],
            "placeholders": {"logo": {"enabled": True}},
            "contentAreas": {"titleStyle": "with-tag"},
        },
        "smartart": {"type": "pyramid", "items": [{"text": "A"}]},
    }

    v2 = normalize_input(v1)
    assert v2["schemaVersion"] == 2
    assert v2["master"]["theme"] == "forest_green"
    assert v2["master"]["masterShapes"] == [{"id": "side-bar"}]
    assert v2["master"]["masterPlaceholders"] == {"logo": {"enabled": True}}
    assert v2["master"]["masterContentAreas"] == {"titleStyle": "with-tag"}
    assert len(v2["pages"]) == 1
    assert v2["pages"][0]["type"] == "content-smartart"

