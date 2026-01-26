# Source Modules

This directory contains ES6 modules extracted from the monolithic `app.js`.

## Migration Status

### ✅ Completed Modules (349 lines)
- `core/state.js` (32 lines) - Global state management
- `core/constants.js` (16 lines) - Constants (PAGE_SIZES, GRID_SIZE, etc.)
- `core/history.js` (87 lines) - Undo/redo functionality
- `features/shapes.js` (178 lines) - SHAPE_PRESETS definitions
- `main.js` (36 lines) - ES6 module entry point

### 🚧 Remaining in app.js (~2680 lines)
- Master template generation
- Layout injection logic
- Element selection & inspector
- Visual editing (drag/resize/rotate)
- Alignment & distribution tools
- Grid overlay
- Toolbar functions
- Export functionality
- Event binding & initialization

## Architecture

```
src/
├── core/           # Core functionality
│   ├── state.js
│   ├── constants.js
│   └── history.js
├── templates/      # Template generation (TODO)
├── ui/             # UI components (TODO)
├── editor/         # Visual editing (TODO)
├── features/       # Features
│   └── shapes.js
└── main.js         # Entry point
```

## Backward Compatibility

`main.js` exposes all exports to `window` object for backward compatibility with `app.js`.
This allows gradual migration without breaking existing functionality.

## Next Steps

1. Extract `templates/master.js` - Master template generation (~200 lines)
2. Extract `ui/inspector.js` - Element inspector (~250 lines)
3. Extract `editor/transform.js` - Drag/resize/rotate (~300 lines)
4. Extract `editor/alignment.js` - Alignment tools (~200 lines)
5. Continue until app.js is fully migrated

## Development

All new code should be written as ES6 modules in `src/`.
Import from `main.js` and expose to global scope if needed for compatibility.
