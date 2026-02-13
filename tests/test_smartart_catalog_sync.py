"""Consistency checks for SmartArt catalog and generated artifacts."""

import json
from pathlib import Path

from pptx_gen.smartart_map_generated import GENERATED_SMARTART_TYPE_MAP


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
