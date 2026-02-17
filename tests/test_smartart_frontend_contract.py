"""Frontend SmartArt contract checks to prevent key field regressions."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
STATE_JS = ROOT / 'js' / 'state.js'
EXPORT_JS = ROOT / 'js' / 'ui' / 'export.js'


def _read(path: Path) -> str:
    return path.read_text(encoding='utf-8')


def test_state_includes_engine_query_and_default():
    source = _read(STATE_JS)
    assert "params.get('smartartEngine')" in source
    assert "smartartEngine: initialSmartartEngine" in source


def test_export_includes_key_smartart_contract_fields():
    source = _read(EXPORT_JS)
    required_snippets = [
        "engine: state.smartartEngine || 'next'",
        "type: state.smartartType",
        "colorScheme: state.smartartColorScheme",
        "items: Array.isArray(state.smartartItems)",
    ]
    for snippet in required_snippets:
        assert snippet in source
