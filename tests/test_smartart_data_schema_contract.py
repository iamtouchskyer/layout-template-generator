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
  matrixCycle: getDataSchema('matrix-cycle'),
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
    assert result['matrixTitled']['itemCount'] == 4
    assert result['matrixCycle']['schema'] == 'flat'
    assert result['matrixCycle']['itemCount'] == 4
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


def test_matrix_layout_variants_match_expected_topology():
    result = _run_node_json(
        """
import { matrixLayout } from './js/smartart/types/matrix.js';

const size = { width: 800, height: 600 };
const theme = {
  accent1: '#4472C4',
  accent2: '#ED7D31',
  accent3: '#A5A5A5',
  accent4: '#FFC000',
  accent5: '#5B9BD5',
  accent6: '#70AD47',
  parentColor: '#4472C4',
  childColors: ['#ED7D31', '#A5A5A5', '#FFC000', '#5B9BD5', '#70AD47'],
  light1: '#FFFFFF',
  dark1: '#000000',
};

const base = matrixLayout(
  { items: [{text:'C'}, {text:'Q1'}, {text:'Q2'}, {text:'Q3'}, {text:'Q4'}], size, theme },
  {}
);
const titled = matrixLayout(
  { items: [{text:'Q1'}, {text:'Q2'}, {text:'Q3'}, {text:'Q4'}], size, theme },
  { titled: true }
);
const cycle = matrixLayout(
  { items: [{text:'Q1'}, {text:'Q2'}, {text:'Q3'}, {text:'Q4'}], size, theme },
  { cycle: true }
);

console.log(JSON.stringify({
  baseShapeCount: base.shapes.length,
  baseHasCenter: base.shapes.some((s) => s.id === 'center'),
  titledShapeCount: titled.shapes.length,
  titledHasCenter: titled.shapes.some((s) => s.id === 'center'),
  cycleShapeCount: cycle.shapes.length,
  cycleHasCenter: cycle.shapes.some((s) => s.id === 'center'),
}));
        """
    )

    assert result['baseShapeCount'] == 5
    assert result['baseHasCenter'] is True
    assert result['titledShapeCount'] == 4
    assert result['titledHasCenter'] is False
    assert result['cycleShapeCount'] == 4
    assert result['cycleHasCenter'] is False
