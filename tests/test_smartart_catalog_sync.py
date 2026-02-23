"""Consistency checks for SmartArt catalog and generated artifacts."""

import json
from pathlib import Path

from pptx_gen.smartart_map_generated import (
    GENERATED_PPTX_ENUM_AMBIGUOUS_TYPE_IDS_MAP,
    GENERATED_PPTX_ENUM_TYPE_ID_MAP,
    GENERATED_SMARTART_TYPE_MAP,
)


ROOT = Path(__file__).resolve().parents[1]
CATALOG_PATH = ROOT / 'smartart' / 'catalog.json'


def load_catalog():
    with CATALOG_PATH.open('r', encoding='utf-8') as f:
        return json.load(f)


def test_catalog_type_ids_match_generated_python_map():
    catalog = load_catalog()
    catalog_ids = {item['id'] for item in catalog['types']}
    generated_ids = set(GENERATED_SMARTART_TYPE_MAP.keys())
    assert catalog_ids == generated_ids


def test_catalog_categories_cover_all_type_categories():
    catalog = load_catalog()
    category_ids = {item['id'] for item in catalog['categories']}
    used_categories = {item['ui']['category'] for item in catalog['types']}
    assert used_categories.issubset(category_ids)


def test_catalog_has_unique_type_ids():
    catalog = load_catalog()
    ids = [item['id'] for item in catalog['types']]
    assert len(ids) == len(set(ids))


def test_ooxml_id_matches_layout_id_tail():
    catalog = load_catalog()
    for item in catalog['types']:
        ooxml_id = item['ui']['ooxmlId']
        layout_id = item['ooxml']['layoutId']
        layout_tail = layout_id.rsplit('/', 1)[-1]
        assert ooxml_id == layout_tail


def test_catalog_pptx_enum_primary_mapping_matches_generated_map():
    catalog = load_catalog()
    expected = {}
    for item in catalog['types']:
        pptx_enum = item['pptx']['smartartType']
        expected.setdefault(pptx_enum, item['id'])
    assert expected == GENERATED_PPTX_ENUM_TYPE_ID_MAP


def test_catalog_pptx_enum_ambiguous_mapping_matches_generated_map():
    catalog = load_catalog()
    grouped = {}
    for item in catalog['types']:
        grouped.setdefault(item['pptx']['smartartType'], []).append(item['id'])

    expected = {
        enum_name: type_ids
        for enum_name, type_ids in grouped.items()
        if len(type_ids) > 1
    }
    assert expected == GENERATED_PPTX_ENUM_AMBIGUOUS_TYPE_IDS_MAP
