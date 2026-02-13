#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

node scripts/generate-smartart-catalog.js >/dev/null

git diff --exit-code -- \
  js/config.smartart.generated.js \
  js/smartart/types/registry.generated.js \
  pptx_gen/smartart_map_generated.py

echo "SmartArt catalog artifacts are in sync."
