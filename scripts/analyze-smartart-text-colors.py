#!/usr/bin/env python3
"""Analyze SmartArt text-color mapping from a PPTX file."""

from __future__ import annotations

import argparse
from collections import Counter
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from pptx_gen.smartart_text_color_resolver import resolve_smartart_text_colors


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Resolve SmartArt text colors via styleLbl -> clrMap -> theme."
    )
    parser.add_argument("pptx", type=Path, help="Path to .pptx file")
    parser.add_argument(
        "--top",
        type=int,
        default=20,
        help="Number of aggregated patterns to print (default: 20)",
    )
    args = parser.parse_args()

    entries = resolve_smartart_text_colors(args.pptx)
    print(f"SmartArt entries: {len(entries)}")

    counter: Counter[tuple[str, str, str, str, str]] = Counter()
    for entry in entries:
        for label, resolved in entry.get("styleLabelColors", {}).items():
            counter[
                (
                    label,
                    str(resolved.get("source", "")),
                    str(resolved.get("colorKey", "")),
                    str(resolved.get("mappedColorKey", "")),
                    str(resolved.get("rgb", "")),
                )
            ] += 1

    for i, (k, n) in enumerate(counter.most_common(args.top), start=1):
        label, source, key, mapped, rgb = k
        print(f"{i:>2}. {n:>2}x {label:<16} {source:<20} {key:<8} -> {mapped:<8} rgb={rgb}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
