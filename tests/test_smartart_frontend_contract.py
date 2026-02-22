"""Frontend SmartArt contract checks to prevent key field regressions."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
INDEX_HTML = ROOT / 'index.html'
STATE_JS = ROOT / 'js' / 'state.js'
EXPORT_JS = ROOT / 'js' / 'ui' / 'export.js'
PAGE_TYPES_JS = ROOT / 'js' / 'ui' / 'page-types.js'
SMARTART_UI_JS = ROOT / 'js' / 'ui' / 'smartart.js'


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
