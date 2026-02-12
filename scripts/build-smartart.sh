#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

npx --yes esbuild@0.25.10 js/smartart/bundle-entry.js \
  --bundle \
  --format=iife \
  --platform=browser \
  --target=es2018 \
  --minify \
  --outfile=js/smartart.bundle.js

echo "Built js/smartart.bundle.js"
