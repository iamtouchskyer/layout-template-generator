#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

cd "$ROOT_DIR"

OUTPUT_PATH="reports/smartart-layout-benchmark.json"
if [[ $# -gt 0 && "$1" != --* ]]; then
  OUTPUT_PATH="$1"
  shift
fi

npx --yes esbuild@0.25.10 js/smartart/types/registry.js \
  --bundle \
  --platform=node \
  --format=cjs \
  --outfile="$TMP_DIR/registry.cjs" >/dev/null

node scripts/benchmark-smartart-layout.js \
  "$TMP_DIR/registry.cjs" \
  "$OUTPUT_PATH" \
  "$@"
