"""Input adapter for multi-page presentation configs.

This module normalizes both legacy v1 (single-page flat payload) and
schemaVersion=2 (multi-page payload) into a common internal structure.
"""

from __future__ import annotations

from copy import deepcopy


DEFAULT_THEME = "soft_peach_cream"
DEFAULT_PAGE_TYPE = "content-grid"
TYPE_TO_MODEL = {
    "cover": {"shell": "cover", "renderer": "cover"},
    "divider": {"shell": "divider", "renderer": "divider"},
    "content-grid": {"shell": "content", "renderer": "grid"},
    "content-smartart": {"shell": "content", "renderer": "smartart"},
}
DEFAULT_CONTENT_TITLE = "市场趋势分析"
DEFAULT_CONTENT_TAG = "分析报告"
DEFAULT_CONTENT_SOURCE = "行业研究报告 2024"


def _normalize_page_type(value: str | None) -> str:
    page_type = str(value or "").strip()
    return page_type if page_type in TYPE_TO_MODEL else DEFAULT_PAGE_TYPE


def _resolve_page_type(page: dict, fallback: str = DEFAULT_PAGE_TYPE) -> str:
    if not isinstance(page, dict):
        return _normalize_page_type(fallback)

    raw_type = page.get("type")
    if raw_type in TYPE_TO_MODEL:
        return str(raw_type)

    shell = str(page.get("shell") or page.get("pageShell") or "").strip()
    renderer = str(page.get("renderer") or page.get("bodyRenderer") or "").strip()

    if shell == "cover":
        return "cover"
    if shell == "divider":
        return "divider"
    if shell == "content" and renderer == "smartart":
        return "content-smartart"
    if shell == "content":
        return "content-grid"

    return _normalize_page_type(fallback)


def _page_model_for_type(page_type: str) -> dict:
    normalized = _normalize_page_type(page_type)
    model = TYPE_TO_MODEL.get(normalized, TYPE_TO_MODEL[DEFAULT_PAGE_TYPE])
    return deepcopy(model)


def _derive_page_layout(page_type: str, data: dict, raw_layout: str | None = None) -> str:
    fallback_layout = raw_layout.strip() if isinstance(raw_layout, str) and raw_layout.strip() else None

    payload = data if isinstance(data, dict) else {}
    normalized_type = _normalize_page_type(page_type)

    if normalized_type == "cover":
        return str(payload.get("coverLayout") or fallback_layout or "cross_rectangles")
    if normalized_type == "divider":
        divider = payload.get("divider", {}) if isinstance(payload.get("divider"), dict) else {}
        return str(payload.get("dividerLayout") or divider.get("layout") or fallback_layout or "cards-highlight")
    if normalized_type == "content-smartart":
        smartart = payload.get("smartart", {}) if isinstance(payload.get("smartart"), dict) else {}
        return str(payload.get("smartartPlacement") or smartart.get("placement") or fallback_layout or "left-desc")

    grid = payload.get("grid", {}) if isinstance(payload.get("grid"), dict) else {}
    return str(payload.get("gridLayout") or grid.get("layout") or fallback_layout or "two-col-equal")


def _normalize_page_record(page: dict, index: int = 0, fallback_type: str = DEFAULT_PAGE_TYPE) -> dict:
    page = page if isinstance(page, dict) else {}
    page_id = str(page.get("id") or f"page-{index + 1}")
    page_type = _resolve_page_type(page, fallback_type)
    data = page.get("data", {}) if isinstance(page.get("data"), dict) else {}
    model = _page_model_for_type(page_type)
    layout = _derive_page_layout(
        page_type,
        data,
        page.get("layout") or page.get("bodyLayout"),
    )

    return {
        "id": page_id,
        "type": page_type,
        "shell": model["shell"],
        "renderer": model["renderer"],
        "layout": layout,
        # Explicit aliases for the page-shell model contract.
        "pageShell": model["shell"],
        "bodyRenderer": model["renderer"],
        "bodyLayout": layout,
        "data": deepcopy(data),
    }


def normalize_input(config: dict) -> dict:
    """Normalize input payload to schema v2 document shape.

    Output shape:
    {
      "schemaVersion": 2,
      "slide": {...},
      "master": {
        "theme": "...",
        "masterShapes": [...],
        "masterPlaceholders": {...},
        "masterContentAreas": {...},
      },
      "pages": [{
        "id": "...",
        "type": "...",
        "shell": "...",
        "renderer": "...",
        "layout": "...",
        "data": {...}
      }, ...]
    }
    """
    if not isinstance(config, dict):
        config = {}

    version = config.get("schemaVersion", 1)
    if version == 2 and isinstance(config.get("pages"), list):
        return _normalize_v2(config)
    return _normalize_v1(config)


def to_legacy_config_for_page(doc: dict, page: dict) -> dict:
    """Convert normalized v2 doc + page into existing single-page config shape."""
    master = doc.get("master", {})
    page_type = _resolve_page_type(page, DEFAULT_PAGE_TYPE)
    data = page.get("data", {}) if isinstance(page.get("data"), dict) else {}

    legacy = {
        "theme": master.get("theme", DEFAULT_THEME),
        "slide": deepcopy(doc.get("slide", {})),
        "slideMaster": {
            "decorativeShapes": deepcopy(master.get("masterShapes", [])),
            "placeholders": deepcopy(master.get("masterPlaceholders", {})),
            "contentAreas": deepcopy(master.get("masterContentAreas", {})),
        },
        "pageType": page_type,
    }

    if page_type == "cover":
        legacy["coverLayout"] = data.get("coverLayout", "cross_rectangles")
        legacy["coverContent"] = deepcopy(data.get("coverContent", {}))
    elif page_type == "divider":
        legacy["divider"] = _extract_divider_payload(data)
    elif page_type == "content-smartart":
        legacy.update(_extract_content_shell_payload(data))
        legacy["smartart"] = _extract_smartart_payload(data)
    else:
        legacy.update(_extract_content_shell_payload(data))
        legacy["grid"] = _extract_grid_payload(data)

    return legacy


def _normalize_v1(config: dict) -> dict:
    slide_master = config.get("slideMaster", {}) if isinstance(config.get("slideMaster"), dict) else {}

    master = {
        "theme": config.get("theme", DEFAULT_THEME),
        "masterShapes": deepcopy(slide_master.get("decorativeShapes", [])),
        "masterPlaceholders": deepcopy(slide_master.get("placeholders", {})),
        "masterContentAreas": deepcopy(slide_master.get("contentAreas", {})),
    }

    page_type = _normalize_page_type(config.get("pageType", DEFAULT_PAGE_TYPE))
    data = _extract_page_data_v1(config, page_type)
    model = _page_model_for_type(page_type)
    layout = _derive_page_layout(page_type, data, config.get("layout"))

    return {
        "schemaVersion": 2,
        "slide": deepcopy(config.get("slide", {})),
        "master": master,
        "pages": [
            {
                "id": "legacy-page-1",
                "type": page_type,
                "shell": model["shell"],
                "renderer": model["renderer"],
                "layout": layout,
                "pageShell": model["shell"],
                "bodyRenderer": model["renderer"],
                "bodyLayout": layout,
                "data": data,
            }
        ],
    }


def _normalize_v2(config: dict) -> dict:
    master_in = config.get("master", {}) if isinstance(config.get("master"), dict) else {}
    slide_master_fallback = config.get("slideMaster", {}) if isinstance(config.get("slideMaster"), dict) else {}

    master = {
        "theme": master_in.get("theme", config.get("theme", DEFAULT_THEME)),
        "masterShapes": deepcopy(
            master_in.get(
                "masterShapes",
                slide_master_fallback.get("decorativeShapes", []),
            )
        ),
        "masterPlaceholders": deepcopy(
            master_in.get(
                "masterPlaceholders",
                slide_master_fallback.get("placeholders", {}),
            )
        ),
        "masterContentAreas": deepcopy(
            master_in.get(
                "masterContentAreas",
                slide_master_fallback.get("contentAreas", {}),
            )
        ),
    }

    normalized_pages = []
    pages = config.get("pages", [])
    for idx, page in enumerate(pages):
        if not isinstance(page, dict):
            continue
        normalized_pages.append(_normalize_page_record(page, idx, DEFAULT_PAGE_TYPE))

    if len(normalized_pages) == 0:
        fallback_data = _extract_page_data_v1(config, DEFAULT_PAGE_TYPE)
        fallback_model = _page_model_for_type(DEFAULT_PAGE_TYPE)
        fallback_layout = _derive_page_layout(DEFAULT_PAGE_TYPE, fallback_data, config.get("layout"))
        normalized_pages.append(
            {
                "id": "page-1",
                "type": DEFAULT_PAGE_TYPE,
                "shell": fallback_model["shell"],
                "renderer": fallback_model["renderer"],
                "layout": fallback_layout,
                "pageShell": fallback_model["shell"],
                "bodyRenderer": fallback_model["renderer"],
                "bodyLayout": fallback_layout,
                "data": fallback_data,
            }
        )

    return {
        "schemaVersion": 2,
        "slide": deepcopy(config.get("slide", {})),
        "master": master,
        "pages": normalized_pages,
    }


def _extract_page_data_v1(config: dict, page_type: str) -> dict:
    page_type = _normalize_page_type(page_type)
    if page_type == "cover":
        return {
            "coverLayout": config.get("coverLayout", "cross_rectangles"),
            "coverContent": deepcopy(config.get("coverContent", {})),
        }
    if page_type == "divider":
        divider = config.get("divider")
        if isinstance(divider, dict):
            return {"divider": deepcopy(divider)}
        return {
            "divider": {
                "layout": config.get("dividerLayout", "cards-highlight"),
                "sectionCount": config.get("dividerSectionCount", 4),
                "numberStyle": config.get("dividerNumberStyle", "arabic"),
                "textLevel": config.get("dividerTextLevel", "full"),
                "bgStyle": config.get("dividerBgStyle", "solid"),
                "sectionIndex": config.get("dividerIndex", 0),
            }
        }
    if page_type == "content-smartart":
        smartart = config.get("smartart")
        if isinstance(smartart, dict):
            return {
                "smartart": deepcopy(smartart),
                **_extract_content_shell_payload(config),
            }
        return {
            **_extract_content_shell_payload(config),
            "smartart": {
                "type": config.get("smartartType", "pyramid"),
                "category": config.get("smartartCategory", "pyramid"),
                "placement": config.get("smartartPlacement", "left-desc"),
                "colorScheme": config.get("smartartColorScheme", "colorful1"),
                "items": deepcopy(config.get("smartartItems", [])),
            }
        }

    grid = config.get("grid")
    if isinstance(grid, dict):
        return {
            "grid": deepcopy(grid),
            **_extract_content_shell_payload(config),
        }
    return {
        "grid": {"layout": "two-col-equal", "zones": []},
        **_extract_content_shell_payload(config),
    }


def _extract_content_shell_payload(data: dict) -> dict:
    payload = data if isinstance(data, dict) else {}
    return {
        "contentTitle": payload.get("contentTitle", DEFAULT_CONTENT_TITLE),
        "contentTag": payload.get("contentTag", DEFAULT_CONTENT_TAG),
        "contentSource": payload.get("contentSource", DEFAULT_CONTENT_SOURCE),
    }


def _extract_divider_payload(data: dict) -> dict:
    base = deepcopy(data.get("divider", {})) if isinstance(data.get("divider"), dict) else {}
    return {
        **base,
        # Flat fields represent current editor state; keep them authoritative.
        "layout": data.get("dividerLayout", base.get("layout", "cards-highlight")),
        "sectionCount": data.get("dividerSectionCount", base.get("sectionCount", 4)),
        "numberStyle": data.get("dividerNumberStyle", base.get("numberStyle", "arabic")),
        "textLevel": data.get("dividerTextLevel", base.get("textLevel", "full")),
        "bgStyle": data.get("dividerBgStyle", base.get("bgStyle", "solid")),
        "sectionIndex": data.get("dividerIndex", base.get("sectionIndex", 0)),
    }


def _extract_grid_payload(data: dict) -> dict:
    grid = data.get("grid")
    if isinstance(grid, dict):
        return deepcopy(grid)
    return {
        "layout": data.get("gridLayout", "two-col-equal"),
        "zones": deepcopy(data.get("zones", [])),
    }


def _extract_smartart_payload(data: dict) -> dict:
    smartart = data.get("smartart")
    if isinstance(smartart, dict):
        out = deepcopy(smartart)
        if not isinstance(out.get("items"), list):
            derived = _derive_smartart_items(data)
            if isinstance(derived, list):
                out["items"] = derived
        return out

    out = {
        "type": data.get("smartartType", "pyramid"),
        "category": data.get("smartartCategory", "pyramid"),
        "placement": data.get("smartartPlacement", "left-desc"),
        "colorScheme": data.get("smartartColorScheme", "colorful1"),
    }
    items = _derive_smartart_items(data)
    out["items"] = items if isinstance(items, list) else []
    if "ooxml" in data and isinstance(data.get("ooxml"), dict):
        out["ooxml"] = deepcopy(data["ooxml"])
    return out


def _derive_smartart_items(data: dict) -> list:
    if isinstance(data.get("smartartItems"), list):
        return deepcopy(data["smartartItems"])

    by_type = data.get("smartartItemsByType")
    smartart_type = data.get("smartartType", "pyramid")
    if isinstance(by_type, dict) and isinstance(by_type.get(smartart_type), list):
        return deepcopy(by_type[smartart_type])
    return []
