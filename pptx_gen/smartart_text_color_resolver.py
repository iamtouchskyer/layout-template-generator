"""Resolve SmartArt text color from OOXML parts.

Algorithm (OOXML):
1) layout.xml picks text style labels (styleLbl) for text containers.
2) colors.xml/quickStyle.xml provides color keys for each styleLbl.
3) slide master color map (clrMap) remaps tx1/bg1/... -> dk1/lt1/...
4) theme color scheme resolves final RGB values.
"""

from __future__ import annotations

import posixpath
import re
import zipfile
from pathlib import Path
from typing import Any
import xml.etree.ElementTree as ET


NS = {
    "p": "http://schemas.openxmlformats.org/presentationml/2006/main",
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "dgm": "http://schemas.openxmlformats.org/drawingml/2006/diagram",
    "pr": "http://schemas.openxmlformats.org/package/2006/relationships",
}

R_NS = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"
_HEX_RE = re.compile(r"^[0-9a-fA-F]{6}$")


def resolve_smartart_text_colors(pptx_path: str | Path) -> list[dict[str, Any]]:
    """Return text-color resolution results for each SmartArt in a PPTX file.

    Output entry example:
    {
      "slide": "ppt/slides/slide1.xml",
      "layoutId": "urn:.../layout/pyramid1",
      "quickStyleId": "urn:.../quickstyle/simple1",
      "colorStyleId": "urn:.../colors/colorful1",
      "styleLabelColors": {
        "revTx": {
          "source": "colors:txFill",
          "colorKey": "tx1",
          "mappedColorKey": "dk1",
          "rgb": "1A3D2B",
        }
      }
    }
    """

    pptx_path = Path(pptx_path)
    with zipfile.ZipFile(pptx_path) as zf:
        slide_parts = _slide_parts(zf)
        results: list[dict[str, Any]] = []

        for slide_part in slide_parts:
            slide_root = _read_xml(zf, slide_part)
            rels_part = _rels_part_for(slide_part)
            rels_map = _rels_map(zf, rels_part)
            rels_types = _rels_type_map(zf, rels_part)

            layout_part = _resolve_related_part(slide_part, _find_rel_target_by_type(rels_types, "slideLayout"))
            if not layout_part:
                continue

            master_part = _master_part_for_layout(zf, layout_part)
            theme_part = _theme_part_for_master(zf, master_part) if master_part else None
            theme_scheme = _theme_scheme(zf, theme_part) if theme_part else {}
            clr_map = _resolve_clr_map(zf, slide_root, layout_part, master_part)

            for rel_ids in slide_root.findall(".//dgm:relIds", NS):
                lo_part = _resolve_related_part(slide_part, rels_map.get(rel_ids.attrib.get(R_NS + "lo", "")))
                qs_part = _resolve_related_part(slide_part, rels_map.get(rel_ids.attrib.get(R_NS + "qs", "")))
                cs_part = _resolve_related_part(slide_part, rels_map.get(rel_ids.attrib.get(R_NS + "cs", "")))
                dm_part = _resolve_related_part(slide_part, rels_map.get(rel_ids.attrib.get(R_NS + "dm", "")))

                if not (lo_part and qs_part and cs_part):
                    continue

                layout_root = _read_xml(zf, lo_part)
                color_root = _read_xml(zf, cs_part)
                quick_root = _read_xml(zf, qs_part)

                labels = _text_style_labels(layout_root)
                colors_defs = _colors_style_label_map(color_root)
                quick_defs = _quickstyle_label_map(quick_root)

                style_label_colors: dict[str, dict[str, str]] = {}
                for label in labels:
                    resolved = _resolve_label_color(label, colors_defs, quick_defs, clr_map, theme_scheme)
                    if resolved:
                        style_label_colors[label] = resolved

                results.append(
                    {
                        "slide": slide_part,
                        "dataPart": dm_part,
                        "layoutPart": lo_part,
                        "quickStylePart": qs_part,
                        "colorStylePart": cs_part,
                        "layoutId": layout_root.attrib.get("uniqueId"),
                        "quickStyleId": quick_root.attrib.get("uniqueId"),
                        "colorStyleId": color_root.attrib.get("uniqueId"),
                        "styleLabelColors": style_label_colors,
                    }
                )

        return results


def summarize_smartart_text_colors(
    entries: list[dict[str, Any]],
) -> dict[tuple[str, str, str, str], int]:
    """Summarize color patterns across SmartArt entries.

    Returns counter-like dict keyed by:
      (styleLbl, source, colorKey, mappedColorKey)
    """
    summary: dict[tuple[str, str, str, str], int] = {}
    for entry in entries:
        style_map = entry.get("styleLabelColors", {})
        if not isinstance(style_map, dict):
            continue
        for style_lbl, resolved in style_map.items():
            source = str(resolved.get("source", ""))
            color_key = str(resolved.get("colorKey", ""))
            mapped = str(resolved.get("mappedColorKey", ""))
            k = (style_lbl, source, color_key, mapped)
            summary[k] = summary.get(k, 0) + 1
    return summary


def _read_xml(zf: zipfile.ZipFile, part_name: str) -> ET.Element:
    return ET.fromstring(zf.read(part_name))


def _slide_parts(zf: zipfile.ZipFile) -> list[str]:
    parts = [name for name in zf.namelist() if name.startswith("ppt/slides/slide") and name.endswith(".xml")]

    def key(name: str) -> tuple[int, str]:
        m = re.search(r"slide(\d+)\.xml$", name)
        return (int(m.group(1)), name) if m else (10**9, name)

    return sorted(parts, key=key)


def _rels_part_for(part_name: str) -> str:
    dirname, basename = posixpath.split(part_name)
    return posixpath.join(dirname, "_rels", f"{basename}.rels")


def _rels_map(zf: zipfile.ZipFile, rels_part: str) -> dict[str, str]:
    root = _read_xml(zf, rels_part)
    out: dict[str, str] = {}
    for rel in root.findall("pr:Relationship", NS):
        rel_id = rel.attrib.get("Id")
        target = rel.attrib.get("Target")
        if rel_id and target:
            out[rel_id] = target
    return out


def _rels_type_map(zf: zipfile.ZipFile, rels_part: str) -> dict[str, tuple[str, str]]:
    root = _read_xml(zf, rels_part)
    out: dict[str, tuple[str, str]] = {}
    for rel in root.findall("pr:Relationship", NS):
        rel_id = rel.attrib.get("Id")
        rel_type = rel.attrib.get("Type")
        target = rel.attrib.get("Target")
        if rel_id and rel_type and target:
            out[rel_id] = (rel_type, target)
    return out


def _find_rel_target_by_type(rels_types: dict[str, tuple[str, str]], rel_type_tail: str) -> str | None:
    suffix = f"/{rel_type_tail}"
    for _rel_id, (rel_type, target) in rels_types.items():
        if rel_type.endswith(suffix):
            return target
    return None


def _resolve_related_part(source_part: str, target: str | None) -> str | None:
    if not target:
        return None
    source_dir = posixpath.dirname(source_part)
    return posixpath.normpath(posixpath.join(source_dir, target))


def _master_part_for_layout(zf: zipfile.ZipFile, layout_part: str) -> str | None:
    rels_part = _rels_part_for(layout_part)
    if rels_part not in zf.namelist():
        return None
    type_map = _rels_type_map(zf, rels_part)
    target = _find_rel_target_by_type(type_map, "slideMaster")
    return _resolve_related_part(layout_part, target)


def _theme_part_for_master(zf: zipfile.ZipFile, master_part: str | None) -> str | None:
    if not master_part:
        return None
    rels_part = _rels_part_for(master_part)
    if rels_part not in zf.namelist():
        return None
    type_map = _rels_type_map(zf, rels_part)
    target = _find_rel_target_by_type(type_map, "theme")
    return _resolve_related_part(master_part, target)


def _theme_scheme(zf: zipfile.ZipFile, theme_part: str | None) -> dict[str, str]:
    if not theme_part:
        return {}
    root = _read_xml(zf, theme_part)
    color_scheme = root.find(".//a:themeElements/a:clrScheme", NS)
    if color_scheme is None:
        return {}

    out: dict[str, str] = {}
    for child in list(color_scheme):
        name = child.tag.rsplit("}", 1)[-1]
        srgb = child.find("a:srgbClr", NS)
        sysc = child.find("a:sysClr", NS)
        if srgb is not None and srgb.attrib.get("val"):
            out[name] = srgb.attrib["val"].upper()
        elif sysc is not None and sysc.attrib.get("lastClr"):
            out[name] = sysc.attrib["lastClr"].upper()
    return out


def _resolve_clr_map(
    zf: zipfile.ZipFile,
    slide_root: ET.Element,
    layout_part: str | None,
    master_part: str | None,
) -> dict[str, str]:
    # 1) master clrMap
    master_map: dict[str, str] = {}
    if master_part and master_part in zf.namelist():
        master_root = _read_xml(zf, master_part)
        master_clr = master_root.find("p:clrMap", NS)
        if master_clr is not None:
            master_map = {k: v for k, v in master_clr.attrib.items()}

    # 2) layout override
    layout_map = _override_clr_map(zf, layout_part)
    if layout_map:
        return layout_map

    # 3) slide override
    slide_ovr = slide_root.find("p:clrMapOvr", NS)
    if slide_ovr is not None:
        override = slide_ovr.find("a:overrideClrMapping", NS)
        if override is not None and override.attrib:
            return {k: v for k, v in override.attrib.items()}
        # masterClrMapping explicitly means "use master map"
        if slide_ovr.find("a:masterClrMapping", NS) is not None:
            return master_map

    return master_map


def _override_clr_map(zf: zipfile.ZipFile, layout_part: str | None) -> dict[str, str]:
    if not layout_part or layout_part not in zf.namelist():
        return {}
    layout_root = _read_xml(zf, layout_part)
    clr_map_ovr = layout_root.find("p:clrMapOvr", NS)
    if clr_map_ovr is None:
        return {}
    override = clr_map_ovr.find("a:overrideClrMapping", NS)
    if override is not None and override.attrib:
        return {k: v for k, v in override.attrib.items()}
    return {}


def _text_style_labels(layout_root: ET.Element) -> list[str]:
    labels: set[str] = set()
    # Prefer text layout nodes (`alg type="tx"`).
    for node in layout_root.findall(".//dgm:layoutNode[@styleLbl]", NS):
        style_lbl = node.attrib.get("styleLbl")
        if not style_lbl:
            continue
        alg = node.find("dgm:alg", NS)
        if alg is not None and alg.attrib.get("type") == "tx":
            labels.add(style_lbl)

    if labels:
        return sorted(labels)

    # Fallback for uncommon layouts: include every referenced styleLbl.
    for node in layout_root.findall(".//*[@styleLbl]", NS):
        style_lbl = node.attrib.get("styleLbl")
        if style_lbl:
            labels.add(style_lbl)
    return sorted(labels)


def _colors_style_label_map(color_root: ET.Element) -> dict[str, dict[str, str]]:
    out: dict[str, dict[str, str]] = {}
    for style_lbl in color_root.findall(".//dgm:styleLbl", NS):
        name = style_lbl.attrib.get("name")
        if not name:
            continue
        tx_fill = style_lbl.find(".//dgm:txFillClrLst", NS)
        if tx_fill is None:
            continue
        color_key = _extract_color_key(tx_fill)
        if color_key:
            out[name] = {"source": "txFill", "colorKey": color_key}
    return out


def _quickstyle_label_map(quick_root: ET.Element) -> dict[str, dict[str, str]]:
    out: dict[str, dict[str, str]] = {}
    for style_lbl in quick_root.findall(".//dgm:styleLbl", NS):
        name = style_lbl.attrib.get("name")
        if not name:
            continue
        font_ref = style_lbl.find(".//a:fontRef", NS)
        if font_ref is None:
            continue
        color_key = _extract_color_key(font_ref)
        if not color_key:
            continue
        idx = font_ref.attrib.get("idx", "")
        source = f"fontRef:{idx}" if idx else "fontRef"
        out[name] = {"source": source, "colorKey": color_key}
    return out


def _extract_color_key(node: ET.Element) -> str | None:
    scheme = node.find(".//a:schemeClr", NS)
    if scheme is not None and scheme.attrib.get("val"):
        return scheme.attrib["val"]

    srgb = node.find(".//a:srgbClr", NS)
    if srgb is not None and srgb.attrib.get("val"):
        return srgb.attrib["val"].upper()

    sysc = node.find(".//a:sysClr", NS)
    if sysc is not None and sysc.attrib.get("lastClr"):
        return sysc.attrib["lastClr"].upper()

    return None


def _resolve_label_color(
    label: str,
    colors_defs: dict[str, dict[str, str]],
    quick_defs: dict[str, dict[str, str]],
    clr_map: dict[str, str],
    theme_scheme: dict[str, str],
) -> dict[str, str] | None:
    # Priority: colors.xml txFill > quickStyle.xml fontRef.
    chosen = colors_defs.get(label) or quick_defs.get(label)
    if not chosen:
        return None

    source = chosen["source"]
    color_key = chosen["colorKey"]
    mapped = clr_map.get(color_key, color_key)

    rgb = theme_scheme.get(mapped)
    if rgb is None and _HEX_RE.match(mapped):
        rgb = mapped.upper()

    return {
        "source": f"colors:{source}" if chosen is colors_defs.get(label) else f"quickStyle:{source}",
        "colorKey": color_key,
        "mappedColorKey": mapped,
        "rgb": rgb or "",
    }

