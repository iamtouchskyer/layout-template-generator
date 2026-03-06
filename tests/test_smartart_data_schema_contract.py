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
    assert result['titledShapeCount'] == 5
    assert result['titledHasCenter'] is False
    assert result['cycleShapeCount'] == 5
    assert result['cycleHasCenter'] is False


def test_cycle_layout_respects_explicit_item_count_for_dynamic_variants():
    result = _run_node_json(
        """
import { cycleLayout } from './js/smartart/types/cycle.js';

const size = { width: 800, height: 600 };
const theme = {
  accent1: '#4472C4',
  accent2: '#ED7D31',
  accent3: '#A5A5A5',
  accent4: '#FFC000',
  accent5: '#5B9BD5',
  accent6: '#70AD47',
  light1: '#FFFFFF',
  dark1: '#000000',
};
const items4 = [{text:'A'}, {text:'B'}, {text:'C'}, {text:'D'}];
const input = { items: items4, size, theme };

const cycle1 = cycleLayout(input, { variant: 'cycle1' });
const cycle2 = cycleLayout(input, { variant: 'cycle2' });
const cycle3 = cycleLayout(input, { variant: 'cycle3' });
const cycle5 = cycleLayout(input, { variant: 'cycle5' });
const cycle6 = cycleLayout(input, { variant: 'cycle6' });

console.log(JSON.stringify({
  cycle1Shapes: cycle1.shapes.length,
  cycle2Shapes: cycle2.shapes.length,
  cycle3NodeShapes: cycle3.shapes.filter((s) => /^node-/.test(s.id)).length,
  cycle3ConnectorCount: cycle3.connectors.length,
  cycle5Shapes: cycle5.shapes.length,
  cycle6NodeShapes: cycle6.shapes.filter((s) => /^node-/.test(s.id)).length,
  cycle6RingConnector: cycle6.connectors.filter((c) => c.type === 'circle').length,
}));
        """
    )

    assert result['cycle1Shapes'] == 4
    assert result['cycle2Shapes'] == 4
    assert result['cycle3NodeShapes'] == 4
    assert result['cycle3ConnectorCount'] == 4
    assert result['cycle5Shapes'] == 4
    assert result['cycle6NodeShapes'] == 4
    assert result['cycle6RingConnector'] == 1


def test_cycle_layout_count_falls_back_to_schema_and_variant_constraints():
    result = _run_node_json(
        """
import { cycleLayout } from './js/smartart/types/cycle.js';

const size = { width: 800, height: 600 };
const theme = {
  accent1: '#4472C4',
  accent2: '#ED7D31',
  accent3: '#A5A5A5',
  accent4: '#FFC000',
  accent5: '#5B9BD5',
  accent6: '#70AD47',
  light1: '#FFFFFF',
  dark1: '#000000',
};

const noItems = { items: [], size, theme };
const twoItems = { items: [{text:'A'}, {text:'B'}], size, theme };
const fourItems = { items: [{text:'A'}, {text:'B'}, {text:'C'}, {text:'D'}], size, theme };

const cycle1Default = cycleLayout(noItems, { variant: 'cycle1' });
const cycle7Bounded = cycleLayout(fourItems, { variant: 'cycle7' });
const cycle8Min = cycleLayout(twoItems, { variant: 'cycle8' });

console.log(JSON.stringify({
  cycle1DefaultShapes: cycle1Default.shapes.length,
  cycle7BoundedShapes: cycle7Bounded.shapes.length,
  cycle8MinShapes: cycle8Min.shapes.length,
}));
        """
    )

    assert result['cycle1DefaultShapes'] == 5
    assert result['cycle7BoundedShapes'] == 4
    assert result['cycle8MinShapes'] == 3


def test_chart3_and_radial_variants_produce_expected_topology():
    result = _run_node_json(
        """
import { cycleLayout } from './js/smartart/types/cycle.js';
import { radialLayout } from './js/smartart/types/radial.js';

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
const items3 = [{text:'A'}, {text:'B'}, {text:'C'}];
const items5 = [{text:'C'}, {text:'N'}, {text:'E'}, {text:'S'}, {text:'W'}];
const input3 = { items: items3, size, theme };
const input5 = { items: items5, size, theme };

const chart3 = cycleLayout(input3, { variant: 'chart3' });
const radial1 = radialLayout(input5, { variant: 'radial1' });
const radial3 = radialLayout(input5, { variant: 'radial3' });
const radial5 = radialLayout(input5, { variant: 'radial5' });
const radial6 = radialLayout(input5, { variant: 'radial6' });
const cluster = radialLayout(input5, { variant: 'radialCluster' });
const circleProc = radialLayout(input3, { variant: 'circleArrowProcess' });

console.log(JSON.stringify({
  chart3Shapes: chart3.shapes.length,
  chart3Connectors: chart3.connectors.length,
  chart3ShapeType: chart3.shapes[0].type,
  chart3InnerRadius: chart3.shapes[0].innerRadius,
  radial1Shapes: radial1.shapes.length,
  radial1HasCenter: radial1.shapes.some((s) => s.id === 'center'),
  radial1SatType: radial1.shapes[1].type,
  radial1Connectors: radial1.connectors.length,
  radial3Shapes: radial3.shapes.length,
  radial3HasCenter: radial3.shapes.some((s) => s.id === 'center'),
  radial3HasOpacity: radial3.shapes[0].opacity < 1,
  radial5Shapes: radial5.shapes.length,
  radial5ConnType: radial5.connectors[0].type,
  radial6Shapes: radial6.shapes.length,
  radial6ConnType: radial6.connectors[0].type,
  clusterShapes: cluster.shapes.length,
  clusterCenterType: cluster.shapes[0].type,
  circleProcShapes: circleProc.shapes.length,
  circleProcConnectors: circleProc.connectors.length,
}));
        """
    )

    # chart3: N pie segments, no connectors, innerRadius=0
    assert result['chart3Shapes'] == 3
    assert result['chart3Connectors'] == 0
    assert result['chart3ShapeType'] == 'pie'
    assert result['chart3InnerRadius'] == 0

    # radial1: center + 4 satellite ellipses + 4 line connectors
    assert result['radial1Shapes'] == 5
    assert result['radial1HasCenter'] is True
    assert result['radial1SatType'] == 'ellipse'
    assert result['radial1Connectors'] == 4

    # radial3: 5 overlapping ellipses (no center), with opacity
    assert result['radial3Shapes'] == 5
    assert result['radial3HasCenter'] is False
    assert result['radial3HasOpacity'] is True

    # radial5: center + 4 satellites + 4 arrow connectors
    assert result['radial5Shapes'] == 5
    assert result['radial5ConnType'] == 'arrow'

    # radial6: center + 4 satellites + 4 blockArc connectors
    assert result['radial6Shapes'] == 5
    assert result['radial6ConnType'] == 'blockArc'

    # radialCluster: center + satellites, roundRect shapes
    assert result['clusterShapes'] == 5
    assert result['clusterCenterType'] == 'roundRect'

    # circleArrowProcess: N nodes + N connectors (mix of thickCurvedArrow/blockArc)
    assert result['circleProcShapes'] == 3
    assert result['circleProcConnectors'] == 3


def test_venn2_layout_produces_expected_topology():
    result = _run_node_json(
        """
import { vennLayout } from './js/smartart/types/venn.js';

const size = { width: 800, height: 600 };
const theme = {
  accent1: '#4472C4',
  accent2: '#ED7D31',
  accent3: '#A5A5A5',
  accent4: '#FFC000',
  accent5: '#5B9BD5',
  accent6: '#70AD47',
  light1: '#FFFFFF',
  dark1: '#000000',
};
const items4 = [{text:'A'}, {text:'B'}, {text:'C'}, {text:'D'}];
const input4 = { items: items4, size, theme };

const venn2 = vennLayout(input4, { variant: 'venn2' });

console.log(JSON.stringify({
  venn2Shapes: venn2.shapes.length,
  venn2ShapeType: venn2.shapes[0].type,
  venn2HasOpacity: venn2.shapes[0].opacity < 1,
  venn2Connectors: venn2.connectors.length,
  venn2Horizontal: venn2.shapes[1].cx > venn2.shapes[0].cx,
}));
        """
    )

    assert result['venn2Shapes'] == 4
    assert result['venn2ShapeType'] == 'ellipse'
    assert result['venn2HasOpacity'] is True
    assert result['venn2Connectors'] == 0
    assert result['venn2Horizontal'] is True


def test_list_ext_variants_produce_expected_topology():
    result = _run_node_json(
        """
import { listExtLayout } from './js/smartart/types/list-ext.js';

const size = { width: 800, height: 600 };
const theme = {
  accent1: '#4472C4',
  accent2: '#ED7D31',
  accent3: '#A5A5A5',
  accent4: '#FFC000',
  accent5: '#5B9BD5',
  accent6: '#70AD47',
  light1: '#FFFFFF',
  dark1: '#000000',
};
const items5 = [{text:'A'}, {text:'B'}, {text:'C'}, {text:'D'}, {text:'E'}];
const items3 = [{text:'A'}, {text:'B'}, {text:'C'}];
const items3h = [{text:'T1', children:[{text:'D1'}]}, {text:'T2', children:[{text:'D2'}]}, {text:'T3', children:[{text:'D3'}]}];
const items2h = [{text:'T1', children:[{text:'C1'}]}, {text:'T2', children:[{text:'C2'}]}];

const def = listExtLayout({ items: items5, size, theme }, { variant: 'default' });
const lined = listExtLayout({ items: items3, size, theme }, { variant: 'LinedList' });
const vl2 = listExtLayout({ items: items2h, size, theme }, { variant: 'vList2' });
const hl1 = listExtLayout({ items: items3h, size, theme }, { variant: 'hList1' });

console.log(JSON.stringify({
  defShapes: def.shapes.length,
  defType: def.shapes[0].type,
  linedShapes: lined.shapes.length,
  linedConns: lined.connectors.length,
  linedHasSidebar: lined.shapes.some(s => s.id === 'sidebar'),
  linedHasTopLine: lined.shapes.some(s => s.id === 'line-top'),
  vl2Shapes: vl2.shapes.length,
  vl2Types: [vl2.shapes[0].type, vl2.shapes[1].type],
  hl1Shapes: hl1.shapes.length,
  hl1Types: [hl1.shapes[0].type, hl1.shapes[1].type],
}));
        """
    )

    # default: 5 rect shapes, no connectors
    assert result['defShapes'] == 5
    assert result['defType'] == 'rect'

    # LinedList: 1 top-line + 1 sidebar + 3×(text + sep-line) = 8 shapes, 0 connectors
    assert result['linedShapes'] == 8
    assert result['linedConns'] == 0
    assert result['linedHasSidebar'] is True
    assert result['linedHasTopLine'] is True

    # vList2: 2 pairs = 4 shapes (roundRect accent + rect content)
    assert result['vl2Shapes'] == 4
    assert result['vl2Types'] == ['roundRect', 'rect']

    # hList1: 3 columns × 2 = 6 shapes (rect title + rect desc)
    assert result['hl1Shapes'] == 6
    assert result['hl1Types'] == ['rect', 'rect']


def test_list_ext_advanced_variants_topology():
    result = _run_node_json(
        """
import { listExtLayout } from './js/smartart/types/list-ext.js';

const size = { width: 800, height: 600 };
const theme = {
  accent1: '#4472C4',
  accent2: '#ED7D31',
  accent3: '#A5A5A5',
  accent4: '#FFC000',
  accent5: '#5B9BD5',
  accent6: '#70AD47',
  light1: '#FFFFFF',
  dark1: '#000000',
};
const items3h = [{text:'T1', children:[{text:'C1'},{text:'C2'}]}, {text:'T2', children:[{text:'C3'},{text:'C4'}]}, {text:'T3', children:[{text:'C5'},{text:'C6'}]}];
const items3 = [{text:'A'}, {text:'B'}, {text:'C'}];
const items3h1 = [{text:'T1', children:[{text:'D1'}]}, {text:'T2', children:[{text:'D2'}]}, {text:'T3', children:[{text:'D3'}]}];
const items2h3 = [{text:'T1', children:[{text:'C1'},{text:'C2'},{text:'C3'}]}, {text:'T2', children:[{text:'C4'},{text:'C5'},{text:'C6'}]}];
const items2h1 = [{text:'T1', children:[{text:'D1'}]}, {text:'T2', children:[{text:'D2'}]}];

const hl2 = listExtLayout({ items: items3h, size, theme }, { variant: 'hList2' });
const sal = listExtLayout({ items: items2h3, size, theme }, { variant: 'SquareAccentList' });
const ps = listExtLayout({ items: items3, size, theme }, { variant: 'PictureStrips' });
const apb = listExtLayout({ items: items3, size, theme }, { variant: 'AlternatingPictureBlocks' });
const pl1 = listExtLayout({ items: items3, size, theme }, { variant: 'pList1' });
const hl9 = listExtLayout({ items: items2h1, size, theme }, { variant: 'hList9' });
const bl2 = listExtLayout({ items: items3h1, size, theme }, { variant: 'bList2' });
const pl2 = listExtLayout({ items: items3, size, theme }, { variant: 'pList2' });

console.log(JSON.stringify({
  hl2Shapes: hl2.shapes.length,
  hl2Types: [hl2.shapes[0].type, hl2.shapes[1].type],
  salShapes: sal.shapes.length,
  salTypes: [sal.shapes[0].type, sal.shapes[1].type],
  psShapes: ps.shapes.length,
  apbShapes: apb.shapes.length,
  pl1Shapes: pl1.shapes.length,
  pl1Types: [pl1.shapes[0].type, pl1.shapes[1].type],
  hl9Shapes: hl9.shapes.length,
  hl9Types: [hl9.shapes[0].type, hl9.shapes[1].type, hl9.shapes[2].type],
  bl2Shapes: bl2.shapes.length,
  bl2Types: [bl2.shapes[0].type, bl2.shapes[1].type, bl2.shapes[2].type],
  pl2Shapes: pl2.shapes.length,
  pl2Types: [pl2.shapes[0].type, pl2.shapes[1].type, pl2.shapes[2].type],
  pl2HasBanner: pl2.shapes.some(s => s.id === 'banner'),
}));
        """
    )

    # hList2: 3 columns × 3 (title + 2 subs) = 9 shapes
    assert result['hl2Shapes'] == 9
    assert result['hl2Types'] == ['rect', 'rect']

    # SquareAccentList: 2 items × (title + bar + accent-sq + 3×(sq+text)) = 2×9 = 18 shapes
    assert result['salShapes'] == 18
    assert result['salTypes'] == ['rect', 'rect']

    # PictureStrips: 3 items × 2 (pic + text) = 6 shapes
    assert result['psShapes'] == 6

    # AlternatingPictureBlocks: 3 items × 2 = 6 shapes
    assert result['apbShapes'] == 6

    # pList1: 3 items × 2 (roundRect + rect) = 6 shapes
    assert result['pl1Shapes'] == 6
    assert result['pl1Types'] == ['roundRect', 'rect']

    # hList9: 2 items × 3 (ellipse + upper rect + lower rect) = 6 shapes
    assert result['hl9Shapes'] == 6
    assert result['hl9Types'] == ['ellipse', 'rect', 'rect']

    # bList2: 3 items × 3 (round2SameRect + rect + ellipse) = 9 shapes
    assert result['bl2Shapes'] == 9
    assert result['bl2Types'] == ['round2SameRect', 'rect', 'ellipse']

    # pList2: 1 banner + 3 items × 2 (roundRect pic + round2SameRect text) = 7 shapes
    assert result['pl2Shapes'] == 7
    assert result['pl2Types'] == ['roundRect', 'roundRect', 'round2SameRect']
    assert result['pl2HasBanner'] is True


def test_chevron2_and_arrow_variants_topology():
    result = _run_node_json(
        """
import { chevronLayout } from './js/smartart/types/chevron.js';
import { arrowLayout } from './js/smartart/types/arrow.js';

const size = { width: 800, height: 600 };
const theme = {
  accent1: '#4472C4',
  accent2: '#ED7D31',
  accent3: '#A5A5A5',
  accent4: '#FFC000',
  accent5: '#5B9BD5',
  accent6: '#70AD47',
  childColors: ['#ED7D31', '#A5A5A5', '#FFC000', '#5B9BD5', '#70AD47'],
  light1: '#FFFFFF',
  dark1: '#000000',
};
const items3 = [{text:'A'}, {text:'B'}, {text:'C'}];
const items4 = [{text:'A'}, {text:'B'}, {text:'C'}, {text:'D'}];

const ch2 = chevronLayout({ items: items3, size, theme }, { style: 'chevron2' });
const ar1 = arrowLayout({ items: [{text:'A'},{text:'B'}], size, theme }, { variant: 'arrow1' });
const ar4 = arrowLayout({ items: items4, size, theme }, { variant: 'arrow4' });

console.log(JSON.stringify({
  ch2Shapes: ch2.shapes.length,
  ch2Types: [ch2.shapes[0].type, ch2.shapes[1].type],
  ar1Shapes: ar1.shapes.length,
  ar1Type: ar1.shapes[0].type,
  ar4Shapes: ar4.shapes.length,
  ar4Types: ar4.shapes.map(s => s.type),
}));
        """
    )

    # chevron2: 3 items × 2 (round2SameRect + chevron) = 6 shapes
    assert result['ch2Shapes'] == 6
    assert result['ch2Types'] == ['round2SameRect', 'chevron']

    # arrow1: 2 upArrow shapes
    assert result['ar1Shapes'] == 2
    assert result['ar1Type'] == 'upArrow'

    # arrow4: rect + upArrow(up) + upArrow(down) + rect = 4 shapes
    assert result['ar4Shapes'] == 4
    assert result['ar4Types'] == ['rect', 'upArrow', 'upArrow', 'rect']


def test_process_variants_topology():
    result = _run_node_json(
        """
import { processLayout } from './js/smartart/types/process.js';

const size = { width: 800, height: 600 };
const theme = {
  accent1: '#4472C4',
  accent2: '#ED7D31',
  accent3: '#A5A5A5',
  accent4: '#FFC000',
  accent5: '#5B9BD5',
  accent6: '#70AD47',
  light1: '#FFFFFF',
  dark1: '#000000',
};
const items5h = [{text:'T1',children:[{text:'D1'}]},{text:'T2',children:[{text:'D2'}]},{text:'T3',children:[{text:'D3'}]},{text:'T4',children:[{text:'D4'}]},{text:'T5',children:[{text:'D5'}]}];
const items3h = [{text:'T1',children:[{text:'D1'}]},{text:'T2',children:[{text:'D2'}]},{text:'T3',children:[{text:'D3'}]}];

const lp2 = processLayout({ items: items5h, size, theme }, { variant: 'lProcess2' });
const hp7 = processLayout({ items: items3h, size, theme }, { variant: 'hProcess7' });
const icp = processLayout({ items: items3h, size, theme }, { variant: 'IncreasingCircleProcess' });
const pp = processLayout({ items: items3h, size, theme }, { variant: 'PieProcess' });

console.log(JSON.stringify({
  lp2Shapes: lp2.shapes.length,
  lp2Types: [lp2.shapes[0].type, lp2.shapes[1].type],
  hp7Shapes: hp7.shapes.length,
  hp7HasFlowChartExtract: hp7.shapes.some(s => s.type === 'flowChartExtract'),
  hp7ArrowCount: hp7.shapes.filter(s => s.type === 'flowChartExtract').length,
  hp7Overlapping: hp7.shapes[1].y > hp7.shapes[0].y && hp7.shapes[1].y < hp7.shapes[0].y + hp7.shapes[0].height,
  icpShapes: icp.shapes.length,
  icpTypes: [icp.shapes[0].type, icp.shapes[1].type, icp.shapes[2].type, icp.shapes[3].type],
  icpHasChord: icp.shapes.some(s => s.type === 'chord'),
  ppShapes: pp.shapes.length,
  ppHasPie: pp.shapes.some(s => s.type === 'pie'),
  ppHasChord: pp.shapes.some(s => s.type === 'chord'),
  ppPieCount: pp.shapes.filter(s => s.type === 'pie').length,
  ppChordCount: pp.shapes.filter(s => s.type === 'chord').length,
}));
        """
    )

    # lProcess2: 5 items × 2 (main + sub roundRect) = 10 shapes
    assert result['lp2Shapes'] == 10
    assert result['lp2Types'] == ['roundRect', 'roundRect']

    # hProcess7: 3 items × 2 (roundRect + rect overlapping) + 2 flowChartExtract arrows = 8 shapes
    assert result['hp7Shapes'] == 8
    assert result['hp7HasFlowChartExtract'] is True
    assert result['hp7ArrowCount'] == 2
    assert result['hp7Overlapping'] is True

    # IncreasingCircleProcess: 3 items × 4 (ellipse + chord + title + desc) = 12 shapes
    assert result['icpShapes'] == 12
    assert result['icpTypes'] == ['ellipse', 'chord', 'rect', 'rect']
    assert result['icpHasChord'] is True

    # PieProcess: 3 items × 4 (chord bg + pie fill + title + desc) = 12 shapes
    assert result['ppShapes'] == 12
    assert result['ppHasPie'] is True
    assert result['ppHasChord'] is True
    assert result['ppPieCount'] == 3
    assert result['ppChordCount'] == 3
