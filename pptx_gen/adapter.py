"""Input adapter for multi-page presentation configs.

This module normalizes both legacy v1 (single-page flat payload) and
schemaVersion=2 (multi-page payload) into a common internal structure.
"""

from __future__ import annotations

from copy import deepcopy


DEFAULT_THEME = "soft_peach_cream"
DEFAULT_PAGE_TYPE = "content-grid"


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
      "pages": [{"id": "...", "type": "...", "data": {...}}, ...]
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
    page_type = str(page.get("type") or DEFAULT_PAGE_TYPE)
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
        legacy["smartart"] = _extract_smartart_payload(data)
    else:
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

    page_type = config.get("pageType", DEFAULT_PAGE_TYPE)
    data = _extract_page_data_v1(config, page_type)

    return {
        "schemaVersion": 2,
        "slide": deepcopy(config.get("slide", {})),
        "master": master,
        "pages": [
            {
                "id": "legacy-page-1",
                "type": page_type,
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
        page_id = str(page.get("id") or f"page-{idx + 1}")
        page_type = str(page.get("type") or DEFAULT_PAGE_TYPE)
        data = page.get("data", {}) if isinstance(page.get("data"), dict) else {}
        normalized_pages.append(
            {
                "id": page_id,
                "type": page_type,
                "data": deepcopy(data),
            }
        )

    if len(normalized_pages) == 0:
        normalized_pages.append(
            {
                "id": "page-1",
                "type": DEFAULT_PAGE_TYPE,
                "data": _extract_page_data_v1(config, DEFAULT_PAGE_TYPE),
            }
        )

    return {
        "schemaVersion": 2,
        "slide": deepcopy(config.get("slide", {})),
        "master": master,
        "pages": normalized_pages,
    }


def _extract_page_data_v1(config: dict, page_type: str) -> dict:
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
            return {"smartart": deepcopy(smartart)}
        return {
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
        return {"grid": deepcopy(grid)}
    return {"grid": {"layout": "two-col-equal", "zones": []}}


def _extract_divider_payload(data: dict) -> dict:
    divider = data.get("divider")
    if isinstance(divider, dict):
        return deepcopy(divider)
    return {
        "layout": data.get("dividerLayout", "cards-highlight"),
        "sectionCount": data.get("dividerSectionCount", 4),
        "numberStyle": data.get("dividerNumberStyle", "arabic"),
        "textLevel": data.get("dividerTextLevel", "full"),
        "bgStyle": data.get("dividerBgStyle", "solid"),
        "sectionIndex": data.get("dividerIndex", 0),
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

