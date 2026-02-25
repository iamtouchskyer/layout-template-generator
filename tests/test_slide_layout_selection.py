"""Regression tests for slide layout selection in PPTX export."""

from __future__ import annotations

import os
import tempfile

from pptx import Presentation

from pptx_gen import generate_pptx


CONTENT_PLACEHOLDER_TYPES = {
    "TITLE (1)",
    "OBJECT (7)",
    "CHART (8)",
    "PICTURE (18)",
}


def _placeholder_types(slide) -> set[str]:
    result = set()
    for shape in slide.shapes:
        if not getattr(shape, "is_placeholder", False):
            continue
        try:
            result.add(str(shape.placeholder_format.type))
        except Exception:
            result.add("UNKNOWN")
    return result


def test_cover_and_smartart_slides_do_not_include_content_placeholders():
    config = {
        "schemaVersion": 2,
        "master": {
            "theme": "forest_green",
            "masterShapes": [],
            "masterPlaceholders": {},
            "masterContentAreas": {},
        },
        "pages": [
            {
                "id": "p-cover",
                "type": "cover",
                "data": {
                    "coverLayout": "cross_rectangles",
                    "coverContent": {"title": "年度汇报"},
                },
            },
            {
                "id": "p-smartart",
                "type": "content-smartart",
                "data": {
                    "smartartType": "pyramid",
                    "smartartPlacement": "left-desc",
                    "smartartColorScheme": "colorful1",
                    "smartartItemsByType": {
                        "pyramid": [
                            {"text": "愿景", "children": [{"text": "长期目标"}]},
                            {"text": "战略", "children": [{"text": "中期规划"}]},
                            {"text": "战术", "children": [{"text": "短期行动"}]},
                            {"text": "执行", "children": [{"text": "日常任务"}]},
                        ]
                    },
                },
            },
        ],
    }

    with tempfile.NamedTemporaryFile(suffix=".pptx", delete=False) as fp:
        output_path = fp.name

    try:
        generate_pptx(config, output_path)
        prs = Presentation.open(output_path)
        cover_ph = _placeholder_types(prs.slides[0])
        smartart_ph = _placeholder_types(prs.slides[1])
        assert cover_ph.isdisjoint(CONTENT_PLACEHOLDER_TYPES)
        assert smartart_ph.isdisjoint(CONTENT_PLACEHOLDER_TYPES)
    finally:
        os.unlink(output_path)


def test_grid_slide_uses_title_without_object_or_chart_placeholders():
    config = {
        "schemaVersion": 2,
        "master": {
            "theme": "forest_green",
            "masterShapes": [],
            "masterPlaceholders": {},
            "masterContentAreas": {
                "titleStyle": "with-tag",
                "sourceStyle": "citation",
            },
        },
        "pages": [
            {
                "id": "p-grid",
                "type": "content-grid",
                "data": {
                    "grid": {
                        "layout": "two-col-equal",
                        "zones": [
                            {"id": "A", "content": "text", "flex": 1},
                            {"id": "B", "content": "text", "flex": 1},
                        ],
                    }
                },
            }
        ],
    }

    with tempfile.NamedTemporaryFile(suffix=".pptx", delete=False) as fp:
        output_path = fp.name

    try:
        generate_pptx(config, output_path)
        prs = Presentation.open(output_path)
        ph_types = _placeholder_types(prs.slides[0])
        assert "TITLE (1)" in ph_types
        assert "OBJECT (7)" not in ph_types
        assert "CHART (8)" not in ph_types
        assert "PICTURE (18)" not in ph_types
    finally:
        os.unlink(output_path)

