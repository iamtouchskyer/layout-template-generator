"""Frontend SmartArt contract checks to prevent key field regressions."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INDEX_HTML = ROOT / 'index.html'
STATE_JS = ROOT / 'js' / 'state.js'
EXPORT_JS = ROOT / 'js' / 'ui' / 'export.js'
PAGE_TYPES_JS = ROOT / 'js' / 'ui' / 'page-types.js'
SMARTART_UI_JS = ROOT / 'js' / 'ui' / 'smartart.js'
CYCLE_LAYOUT_JS = ROOT / 'js' / 'smartart' / 'types' / 'cycle.js'
CONFIG_JS = ROOT / 'js' / 'config.js'


def _read(path: Path) -> str:
    return path.read_text(encoding='utf-8')


def test_state_does_not_include_engine_toggle():
    source = _read(STATE_JS)
    assert 'smartartEngine' not in source


def test_export_includes_key_smartart_contract_fields():
    source = _read(EXPORT_JS)
    required_snippets = [
        "type: state.smartartType",
        "colorScheme: state.smartartColorScheme",
        "items: Array.isArray(state.smartartItems)",
    ]
    for snippet in required_snippets:
        assert snippet in source
    assert 'engine:' not in source


def test_engine_selector_is_removed_from_ui():
    index_source = _read(INDEX_HTML)
    page_type_source = _read(PAGE_TYPES_JS)
    smartart_ui_source = _read(SMARTART_UI_JS)

    assert 'id="smartart-engine-selector"' not in index_source
    assert 'renderSmartartEngineSelector();' not in page_type_source
    assert 'function renderSmartartEngineSelector()' not in smartart_ui_source
    assert 'function selectSmartartEngine(engineId)' not in smartart_ui_source


def test_cycle3_cycle6_visual_semantics_are_not_swapped():
    source = _read(CYCLE_LAYOUT_JS)
    cycle3_block = source.split('function layoutCycle3(option) {', 1)[1].split('function layoutCycle4(option) {', 1)[0]
    cycle6_block = source.split('function layoutCycle6(option) {', 1)[1].split('function layoutCycle7(option) {', 1)[0]

    # cycle3 (Block Cycle) uses arc segments between nodes (no arrowheads).
    assert "type: 'arc'" in cycle3_block
    # cycle6 (Segmented Cycle) uses a continuous circle ring connector.
    assert "type: 'circle'" in cycle6_block


def test_export_uses_aligned_ooxml_for_current_smartart_type():
    source = _read(EXPORT_JS)
    assert 'function isSmartartOOXMLAligned(ooxml, smartartType)' in source
    assert 'isSmartartOOXMLAligned(liveOOXML, smartartType)' in source
    assert 'isSmartartOOXMLAligned(sourceData.smartart?.ooxml, smartartType)' in source


def test_smartart_defaults_are_i18n_and_default_to_chinese():
    source = _read(CONFIG_JS)
    assert 'const SMARTART_TEST_DATA_ZH = {' in source
    assert 'const SMARTART_TEST_DATA_EN = {' in source
    assert "const SMARTART_TEST_DATA = SMARTART_TEST_DATA_ZH;" in source
    assert "function getSmartArtTestData(typeId, category = 'list', lang = 'zh')" in source


def test_site_i18n_switch_and_smartart_type_label_contracts():
    source = _read(CONFIG_JS)
    assert "function getSiteUILang()" in source
    assert "function setSiteUILang(lang)" in source
    assert "function applySiteI18n(lang = getSiteUILang())" in source
    # Type names should stay English regardless UI language.
    assert "return en || zh || '';" in source
