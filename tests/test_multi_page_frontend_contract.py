"""Frontend contract checks for multi-page doc/ui state model."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
STATE_JS = ROOT / "js" / "state.js"
STATE_SELECTORS_JS = ROOT / "js" / "state-selectors.js"
EXPORT_JS = ROOT / "js" / "ui" / "export.js"
INDEX_HTML = ROOT / "index.html"
IMPORT_JS = ROOT / "js" / "ui" / "import.js"
CONTROLS_JS = ROOT / "js" / "ui" / "controls.js"


def _read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def test_state_uses_doc_ui_layered_model():
    source = _read(STATE_JS)
    assert "ui:" in source
    assert "doc:" in source
    assert "schemaVersion: 2" in source
    assert "pages:" in source


def test_selector_api_file_exists_and_exports_key_ops():
    source = _read(STATE_SELECTORS_JS)
    required = [
        "function getCurrentPageId()",
        "function getCurrentPage()",
        "function patchCurrentPage(partial, options = {})",
        "function setCurrentPageModel(shell, renderer, layout = null, options = {})",
        "function addPage(type, afterIndex = null)",
        "function addPageByModel(shell, renderer, layout = null, afterIndex = null, options = {})",
        "function deletePage(pageId)",
        "function duplicatePage(pageId)",
        "function movePage(fromIndex, toIndex)",
        "window.addPage = addPage",
        "window.addPageByModel = addPageByModel",
    ]
    for item in required:
        assert item in source


def test_export_uses_v2_schema_payload():
    source = _read(EXPORT_JS)
    assert "schemaVersion: 2" in source
    assert "pages" in source
    assert "buildPageDataForExport(" in source
    assert "shell:" in source
    assert "renderer:" in source
    assert "pageShell:" in source
    assert "bodyRenderer:" in source


def test_index_loads_state_selectors_after_state():
    html = _read(INDEX_HTML)
    assert 'src="js/state.js' in html
    assert 'src="js/state-selectors.js' in html
    assert html.index('src="js/state.js') < html.index('src="js/state-selectors.js')


def test_import_ui_and_module_exist():
    html = _read(INDEX_HTML)
    source = _read(IMPORT_JS)
    assert 'onclick="triggerImportConfig()"' in html
    assert 'id="config-import-input"' in html
    assert 'src="js/ui/import.js' in html
    assert "function applyImportedConfig(rawConfig)" in source
    assert "window.applyImportedConfig = applyImportedConfig" in source


def test_page_sidebar_exists_in_preview_viewport():
    html = _read(INDEX_HTML)
    assert 'id="page-list-sidebar"' in html


def test_page_model_controls_exist():
    page_types = _read(ROOT / "js" / "ui" / "page-types.js")
    assert "function updatePageModelFromControls(options = {})" in page_types
    assert "window.updatePageModelFromControls = updatePageModelFromControls" in page_types


def test_undo_redo_ui_controls_exist():
    html = _read(INDEX_HTML)
    controls = _read(CONTROLS_JS)
    assert 'id="btn-undo"' in html
    assert 'id="btn-redo"' in html
    assert "function updateHistoryButtons()" in controls
