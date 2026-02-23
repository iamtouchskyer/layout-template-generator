"""SmartArt layout URI mapping helpers.

Backend generation still relies on python-pptx SMARTART_TYPE, but when OOXML
layoutId is present we should resolve by URI first instead of trusting
human-readable type names.
"""

from __future__ import annotations

from pptx_gen.smartart_map_generated import (
    GENERATED_LAYOUT_ID_TYPE_ID_MAP,
    GENERATED_PPTX_ENUM_AMBIGUOUS_TYPE_IDS_MAP,
    GENERATED_PPTX_ENUM_TYPE_ID_MAP,
)


# Canonical matrix variants (for extraction/analysis semantics).
# These names are intentionally independent from python-pptx enum names.
CANONICAL_MATRIX_LAYOUT_MAP = {
    "urn:microsoft.com/office/officeart/2005/8/layout/matrix1": "matrix-titled",
    "urn:microsoft.com/office/officeart/2005/8/layout/matrix2": "matrix-grid",
    "urn:microsoft.com/office/officeart/2005/8/layout/matrix3": "matrix-basic",
    "urn:microsoft.com/office/officeart/2005/8/layout/cycle4": "matrix-cycle",
}


def resolve_type_id_from_layout_id(layout_id: str) -> str | None:
    """Resolve internal type-id from OOXML layoutId."""
    if not isinstance(layout_id, str) or not layout_id:
        return None
    return GENERATED_LAYOUT_ID_TYPE_ID_MAP.get(layout_id)


def resolve_canonical_matrix_variant(layout_id: str) -> str | None:
    """Resolve canonical matrix variant from OOXML layoutId."""
    if not isinstance(layout_id, str) or not layout_id:
        return None
    return CANONICAL_MATRIX_LAYOUT_MAP.get(layout_id)


def _normalize_pptx_enum_name(pptx_enum_name: str) -> str | None:
    """Normalize SMARTART_TYPE enum string from external payload."""
    if not isinstance(pptx_enum_name, str):
        return None

    normalized = pptx_enum_name.strip()
    if not normalized:
        return None

    # Accept both "TITLED_MATRIX" and "SMARTART_TYPE.TITLED_MATRIX".
    if normalized.startswith("SMARTART_TYPE."):
        normalized = normalized.split(".", 1)[1]

    return normalized.upper()


def resolve_type_id_from_pptx_enum(pptx_enum_name: str) -> str | None:
    """Resolve internal type-id from SMARTART_TYPE enum name."""
    normalized = _normalize_pptx_enum_name(pptx_enum_name)
    if not normalized:
        return None
    return GENERATED_PPTX_ENUM_TYPE_ID_MAP.get(normalized)


def resolve_ambiguous_type_ids_from_pptx_enum(
    pptx_enum_name: str,
) -> tuple[str, ...] | None:
    """Return all candidate type-ids when SMARTART_TYPE enum is ambiguous."""
    normalized = _normalize_pptx_enum_name(pptx_enum_name)
    if not normalized:
        return None

    candidates = GENERATED_PPTX_ENUM_AMBIGUOUS_TYPE_IDS_MAP.get(normalized)
    if not candidates:
        return None
    return tuple(candidates)
