"""SmartArt reference asset coverage checks."""

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CATALOG_PATH = ROOT / 'smartart' / 'catalog.json'
REFS_DIR = ROOT / 'assets' / 'smartart-refs'


def test_each_catalog_type_has_reference_asset():
    catalog = json.loads(CATALOG_PATH.read_text(encoding='utf-8'))

    missing = []
    for item in catalog['types']:
        ooxml_id = item['ui']['ooxmlId']
        png = REFS_DIR / f'{ooxml_id}.png'
        svg = REFS_DIR / f'{ooxml_id}.svg'
        if not png.exists() and not svg.exists():
            missing.append(ooxml_id)

    assert not missing, f'Missing SmartArt reference assets: {missing}'
