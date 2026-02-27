"""Safety regressions for zone rendering geometry."""

from __future__ import annotations

import os
import tempfile
import zipfile

from lxml import etree

from pptx_gen import generate_pptx
from pptx_gen.zone_renderer import (
    _compact_chars_per_line,
    _compact_font_sizes,
    _compact_line_budget,
    _truncate_compact_text,
)


NS = {
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "p": "http://schemas.openxmlformats.org/presentationml/2006/main",
}


def _assert_no_negative_extents(pptx_path: str) -> None:
    with zipfile.ZipFile(pptx_path) as zf:
        for name in zf.namelist():
            if not (name.startswith("ppt/slides/slide") and name.endswith(".xml")):
                continue
            root = etree.fromstring(zf.read(name))
            for ext in root.xpath(".//a:xfrm/a:ext", namespaces=NS):
                cx = int(ext.get("cx", "0"))
                cy = int(ext.get("cy", "0"))
                assert cx >= 0, f"{name} has negative cx={cx}"
                assert cy >= 0, f"{name} has negative cy={cy}"


def test_dense_row_layout_does_not_generate_negative_shape_extents():
    zones = []
    for idx in range(24):
        zone_id = chr(65 + (idx % 26))
        zones.append({"id": f"{zone_id}{idx}", "content": "text", "flex": 1})

    config = {
        "schemaVersion": 2,
        "master": {
            "theme": "forest_green",
            "masterShapes": [],
            "masterPlaceholders": {},
            "masterContentAreas": {
                "titleStyle": "with-tag",
                "sourceStyle": "none",
            },
        },
        "pages": [
            {
                "id": "dense-grid",
                "type": "content-grid",
                "data": {
                    # Unknown layout id falls back to row-layout in layout.py
                    "grid": {
                        "layout": "4x6-dense",
                        "zones": zones,
                    }
                },
            }
        ],
    }

    with tempfile.NamedTemporaryFile(suffix=".pptx", delete=False) as fp:
        output_path = fp.name

    try:
        generate_pptx(config, output_path)
        _assert_no_negative_extents(output_path)
    finally:
        os.unlink(output_path)


def test_dense_compact_cells_preserve_text_payload():
    zones = []
    for idx in range(24):
        zones.append(
            {
                "id": f"Z{idx}",
                "content": "text",
                "flex": 1,
                "textData": {
                    "title": f"标题{idx}",
                    "body": f"正文内容{idx}",
                },
            }
        )

    config = {
        "schemaVersion": 2,
        "master": {
            "theme": "forest_green",
            "masterShapes": [],
            "masterPlaceholders": {},
            "masterContentAreas": {"titleStyle": "none", "sourceStyle": "none"},
        },
        "pages": [
            {
                "id": "dense-grid",
                "type": "content-grid",
                "data": {
                    "grid": {
                        "layout": "4x6",
                        "zones": zones,
                    }
                },
            }
        ],
    }

    with tempfile.NamedTemporaryFile(suffix=".pptx", delete=False) as fp:
        output_path = fp.name

    try:
        generate_pptx(config, output_path)
        with zipfile.ZipFile(output_path) as zf:
            xml = zf.read("ppt/slides/slide1.xml").decode("utf-8")
        assert "标题0" in xml
        assert "正文内容0" in xml
    finally:
        os.unlink(output_path)


def test_compact_budget_hides_body_on_tiny_cells():
    title_lines, body_lines = _compact_line_budget(0.48, 0.36)
    assert title_lines == 1
    assert body_lines == 0


def test_compact_text_truncates_with_ellipsis():
    title_size, body_size = _compact_font_sizes(0.72, 0.78)
    title_lines, body_lines = _compact_line_budget(0.72, 0.78)

    long_title = "非常非常非常非常非常非常长的标题用于紧凑网格回归测试"
    long_body = "这是一个很长很长的正文内容，用于验证在空间不足时会被智能截断，而不是溢出到不可读状态。"

    title_cap = _compact_chars_per_line(0.72, title_size)
    body_cap = _compact_chars_per_line(0.72, body_size)

    compact_title = _truncate_compact_text(long_title, title_lines, title_cap)
    compact_body = _truncate_compact_text(long_body, body_lines, body_cap)

    assert compact_title.endswith("...")
    assert compact_body.endswith("...")
    assert len(compact_title) <= (title_lines * title_cap)
    assert len(compact_body) <= (body_lines * body_cap)
