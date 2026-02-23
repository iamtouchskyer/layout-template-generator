"""Contract checks for browser-side SmartArt data schema metadata."""

import json
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def _run_node_json(script: str):
    proc = subprocess.run(
        ['node', '--input-type=module', '-e', script],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    return json.loads(proc.stdout)


def test_schema_covers_all_registered_types_and_expected_topologies():
    result = _run_node_json(
        """
import {
  DATA_SCHEMAS,
  getDataSchema,
  getEditorMode,
  shouldShowBullet,
} from './js/smartart/types/data-schema.js';
import { SMARTART_TYPE_DEFS } from './js/smartart/types/registry.generated.js';

const registeredIds = SMARTART_TYPE_DEFS.map((d) => d.id);
const missing = registeredIds.filter((id) => !(id in DATA_SCHEMAS));

console.log(JSON.stringify({
  missing,
  matrix: getDataSchema('matrix'),
  matrixTitled: getDataSchema('matrix-titled'),
  radial: getDataSchema('radial'),
  matrixEditorMode: getEditorMode('matrix'),
  listBulletL0: shouldShowBullet('list', 0),
  pyramidBulletL0: shouldShowBullet('pyramid', 0),
}));
        """
    )

    assert result['missing'] == []
    assert result['matrix']['schema'] == 'flat'
    assert result['matrix']['itemCount'] == 5
    assert result['matrixTitled']['schema'] == 'flat'
    assert result['matrixTitled']['itemCount'] == 5
    assert result['radial']['schema'] == 'flat'
    assert result['radial']['itemCount'] == 5
    assert result['matrixEditorMode'] == 'matrix'
    assert result['listBulletL0'] is True
    assert result['pyramidBulletL0'] is False


def test_normalize_data_preserves_metadata_and_nested_children():
    result = _run_node_json(
        """
import { normalizeData } from './js/smartart/types/data-schema.js';

const normalized = normalizeData([
  {
    id: 'parent-1',
    parentId: null,
    text: 'Parent',
    description: 'desc',
    children: [
      { id: 'child-1', text: 'Child', tag: 'A' },
      'Child 2'
    ]
  }
]);

console.log(JSON.stringify(normalized[0]));
        """
    )

    assert result['id'] == 'parent-1'
    assert 'description' in result
    assert result['description'] == 'desc'
    assert isinstance(result['children'], list)
    assert result['children'][0]['id'] == 'child-1'
    assert result['children'][0]['tag'] == 'A'
    assert result['children'][0]['text'] == 'Child'
    assert result['children'][1]['text'] == 'Child 2'
