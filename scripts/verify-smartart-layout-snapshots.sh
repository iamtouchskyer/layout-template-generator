#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

cd "$ROOT_DIR"

npx --yes esbuild@0.25.10 js/smartart/types/registry.js \
  --bundle \
  --platform=node \
  --format=cjs \
  --outfile="$TMP_DIR/registry.cjs" >/dev/null

node scripts/verify-smartart-layout-snapshots.js \
  "$TMP_DIR/registry.cjs" \
  tests/snapshots/smartart_layout_snapshots.json \
  "$@"
