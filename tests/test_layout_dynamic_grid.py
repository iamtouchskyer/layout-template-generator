"""Tests for dynamic grid layout parsing (e.g. 4x6)."""

from __future__ import annotations

from pptx_gen.layout import calculate_zone_positions


def test_dynamic_grid_layout_4x6_places_zones_in_rows_and_columns():
    zones = [{"id": f"Z{i}", "content": "text", "flex": 1} for i in range(24)]

    positions = calculate_zone_positions(
        layout_id="4x6-dense",
        zones=zones,
        body_x=0.5,
        body_y=1.0,
        body_w=9.0,
        body_h=5.4,
        gap=0.08,
    )

    assert len(positions) == 24
    # First row has 4 items at same y; 5th item starts next row.
    assert positions[0]["y"] == positions[1]["y"] == positions[2]["y"] == positions[3]["y"]
    assert positions[4]["y"] > positions[0]["y"]
    # First column should repeat every 4 items.
    assert positions[0]["x"] == positions[4]["x"] == positions[8]["x"]


def test_dynamic_grid_layout_supports_star_separator():
    zones = [{"id": f"A{i}", "content": "text", "flex": 1} for i in range(6)]
    positions = calculate_zone_positions(
        layout_id="3*2",
        zones=zones,
        body_x=0,
        body_y=0,
        body_w=6,
        body_h=4,
        gap=0.1,
    )
    assert len(positions) == 6
    assert positions[0]["y"] == positions[1]["y"] == positions[2]["y"]
    assert positions[3]["y"] > positions[0]["y"]
