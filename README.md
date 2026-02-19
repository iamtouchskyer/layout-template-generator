# Layout × Theme Generator

PowerPoint-style Slide Master & Layout Editor for PPTX generation.

## Features

- **Slide Master View**: Configure master elements that apply to all layouts
- **23+ Decorative Shapes**: Organized by position (top, left, right, bottom, corners, content)
- **Shape Presets**: Style variations for each shape type
- **Visual Editing**:
  - Drag to move elements
  - 8 resize handles
  - Rotation support
  - Snap to grid
  - Alignment tools (left/center/right, top/middle/bottom)
  - Distribute horizontal/vertical
- **PowerPoint-style Ribbon Toolbar**:
  - Shape styles (solid, outline, subtle, gradient)
  - Font controls (family, size, bold/italic/underline, color)
  - Fill/border color pickers
  - Undo/Redo (Ctrl+Z / Ctrl+Shift+Z)
- **Multiple Page Sizes**: 4:3, 16:9, 21:9
- **Theme Support**: 8+ preset themes with custom colors
- **Master → Layout Inheritance**: Per-layout visibility overrides
- **Export Config**: JSON export for backend integration

## Files

- `index.html` - Main UI with ribbon toolbar
- `app.js` - Core logic (23+ shapes, visual editing, undo/redo)
- `layouts-data.js` - Layout HTML templates (modern, minimal, clean styles)
- `themes.js` - Theme definitions (colors, fonts)
- `convert_to_templates.py` - Python script for HTML → template conversion

## Usage

Open `index.html` in a browser to start editing.

## SmartArt Workflow

SmartArt metadata now uses a single source of truth: `smartart/catalog.json`.

Common commands:

- `npm run smartart:generate` - regenerate SmartArt generated artifacts
- `npm run smartart:build` - rebuild `js/smartart.bundle.js`
- `npm run smartart:verify` - assert generated artifacts are in sync
- `npm run smartart:pipeline` - run full local pipeline (generate, build, verify, tests)
- `npm run smartart:benchmark` - run layout benchmark and write `reports/smartart-layout-benchmark.json`

Browser-side benchmark helper:

```javascript
// Run in browser console (after opening index.html)
SmartArt.benchmark(
  document.getElementById('smartart-render-target'),
  {
    type: 'pyramid',
    items: ['A', 'B', 'C', 'D', 'E', 'F'],
    size: { width: 1000, height: 500 },
  },
  50
)
```

## OOXML Hierarchy

Theme → Slide Master → Slide Layout → Slide

Master elements (shapes, placeholders, dynamic fields) automatically apply to layouts with per-layout visibility control.
