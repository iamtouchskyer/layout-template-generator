#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "[1/4] Generate catalog artifacts"
node scripts/generate-smartart-catalog.js

echo "[2/4] Build smartart bundle"
scripts/build-smartart.sh

echo "[3/4] Verify generated artifacts are committed"
scripts/verify-smartart-catalog-sync.sh

echo "[4/4] Run SmartArt tests"
pytest tests/test_smartart_refs.py tests/test_smartart_catalog_sync.py tests/test_smartart_frontend_contract.py tests/test_smartart_layout_snapshots.py tests/test_smartart.py -q

echo "SmartArt pipeline passed."
