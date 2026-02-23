"""Tests for SmartArt layout-id based mapping."""

from __future__ import annotations

import posixpath
import zipfile
from pathlib import Path
import xml.etree.ElementTree as ET

from pptx_gen.smartart_layout_mapper import (
    resolve_ambiguous_type_ids_from_pptx_enum,
    resolve_canonical_matrix_variant,
    resolve_type_id_from_layout_id,
    resolve_type_id_from_pptx_enum,
)
from pptx_gen.slides.smartart import _resolve_smartart_type_id


ROOT = Path(__file__).resolve().parents[1]
SMARTART_SAMPLE = ROOT / "smartart.pptx"

NS = {
    "p": "http://schemas.openxmlformats.org/presentationml/2006/main",
    "dgm": "http://schemas.openxmlformats.org/drawingml/2006/diagram",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "pr": "http://schemas.openxmlformats.org/package/2006/relationships",
}


def _rels_map(zf: zipfile.ZipFile, rels_path: str) -> dict[str, str]:
    rels = {}
    root = ET.fromstring(zf.read(rels_path))
    for rel in root.findall("pr:Relationship", NS):
        rels[rel.attrib["Id"]] = rel.attrib["Target"]
    return rels


def _first_smartart_layout_id(zf: zipfile.ZipFile, slide_idx: int) -> str | None:
    slide_path = f"ppt/slides/slide{slide_idx}.xml"
    rels_path = f"ppt/slides/_rels/slide{slide_idx}.xml.rels"
    sroot = ET.fromstring(zf.read(slide_path))
    rels = _rels_map(zf, rels_path)

    for gf in sroot.findall(".//p:graphicFrame", NS):
        rel_ids = gf.find(".//dgm:relIds", NS)
        if rel_ids is None:
            continue
        lo_rid = rel_ids.attrib.get(f"{{{NS['r']}}}lo")
        if not lo_rid:
            continue
        lo_target = rels.get(lo_rid)
        if not lo_target:
            continue
        lo_path = posixpath.normpath(posixpath.join("ppt/slides", lo_target))
        lroot = ET.fromstring(zf.read(lo_path))
        return lroot.attrib.get("uniqueId")

    return None


def test_layout_id_map_resolves_known_matrix_and_cycle_ids():
    assert (
        resolve_type_id_from_layout_id(
            "urn:microsoft.com/office/officeart/2005/8/layout/matrix1"
        )
        == "matrix"
    )
    assert (
        resolve_type_id_from_layout_id(
            "urn:microsoft.com/office/officeart/2005/8/layout/matrix2"
        )
        == "matrix-titled"
    )
    assert (
        resolve_type_id_from_layout_id(
            "urn:microsoft.com/office/officeart/2005/8/layout/matrix3"
        )
        == "matrix-cycle"
    )
    assert (
        resolve_type_id_from_layout_id(
            "urn:microsoft.com/office/officeart/2005/8/layout/cycle4"
        )
        == "cycle"
    )


def test_resolve_type_prefers_layout_id_over_type_field():
    cfg = {
        "type": "pyramid",
        "ooxml": {"layoutId": "urn:microsoft.com/office/officeart/2005/8/layout/matrix1"},
    }
    assert _resolve_smartart_type_id(cfg) == "matrix"


def test_resolve_type_supports_smartart_type_id_field():
    cfg = {
        "typeId": "matrix-cycle",
        "type": "pyramid",
    }
    assert _resolve_smartart_type_id(cfg) == "matrix-cycle"


def test_resolve_type_supports_pptx_enum_name_type_field(caplog):
    cfg = {"type": "SMARTART_TYPE.BLOCK_CYCLE"}
    assert _resolve_smartart_type_id(cfg) == "cycle"
    assert "Ambiguous SMARTART_TYPE" not in caplog.text


def test_resolve_type_logs_warning_when_pptx_enum_is_ambiguous(caplog):
    cfg = {"type": "TITLED_MATRIX"}
    assert _resolve_smartart_type_id(cfg) == "matrix-titled"
    assert "Ambiguous SMARTART_TYPE" in caplog.text
    assert "matrix-cycle" in caplog.text


def test_canonical_matrix_variant_mapping_matches_verified_truth_table():
    assert (
        resolve_canonical_matrix_variant(
            "urn:microsoft.com/office/officeart/2005/8/layout/matrix1"
        )
        == "matrix-titled"
    )
    assert (
        resolve_canonical_matrix_variant(
            "urn:microsoft.com/office/officeart/2005/8/layout/matrix2"
        )
        == "matrix-grid"
    )
    assert (
        resolve_canonical_matrix_variant(
            "urn:microsoft.com/office/officeart/2005/8/layout/matrix3"
        )
        == "matrix-basic"
    )
    assert (
        resolve_canonical_matrix_variant(
            "urn:microsoft.com/office/officeart/2005/8/layout/cycle4"
        )
        == "matrix-cycle"
    )


def test_sample_ppt_first_four_slides_match_canonical_matrix_variants():
    assert SMARTART_SAMPLE.exists(), f"Missing sample file: {SMARTART_SAMPLE}"

    expected = ["matrix-titled", "matrix-basic", "matrix-grid", "matrix-cycle"]
    actual: list[str | None] = []

    with zipfile.ZipFile(SMARTART_SAMPLE) as zf:
        for slide_idx in [1, 2, 3, 4]:
            layout_id = _first_smartart_layout_id(zf, slide_idx)
            actual.append(resolve_canonical_matrix_variant(layout_id or ""))

    assert actual == expected


def test_pptx_enum_reverse_mapping_matches_catalog_behavior():
    assert resolve_type_id_from_pptx_enum("TITLED_MATRIX") == "matrix-titled"
    assert resolve_type_id_from_pptx_enum("SMARTART_TYPE.BLOCK_CYCLE") == "cycle"
    assert resolve_type_id_from_pptx_enum("NOT_EXISTS") is None
    assert resolve_ambiguous_type_ids_from_pptx_enum("TITLED_MATRIX") == (
        "matrix-titled",
        "matrix-cycle",
    )
