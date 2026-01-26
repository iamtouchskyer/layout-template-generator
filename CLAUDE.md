# Layout × Theme Generator - AI Agent Instructions

## 📏 Code Quality Rules

### File Length Limits
- **HTML files**: Maximum 300 lines per file
  - Extract CSS to separate `.css` files
  - Extract large HTML sections to component files if needed
- **JavaScript files**: Maximum 300 lines per file
  - Extract related functions into separate modules
  - Use ES6 modules for better organization
- **CSS files**: Maximum 500 lines per file (can be longer than other files)
  - Split by concerns: variables.css, layout.css, components.css

### Function Length Limits
- **Maximum 50 lines per function** (excluding comments and blank lines)
- Extract sub-functions when exceeding limit
- Use descriptive names for extracted functions

### Exceptions
- Configuration files (no limit)
- Generated files (layouts-data.js, themes.js)

## 🚫 Forbidden Patterns

### File Management
- **NEVER create files with suffixes** like `-new`, `-redesign`, `-v2`
- **ALWAYS modify existing files directly** or ask before creating new files
- **Use git for version control**, not file suffixes
- If backup needed, ask user first or rely on git history

### Commit Hygiene
- **One logical change per commit**
- **Clean up temporary files before committing**
- **Never commit with --no-verify** unless explicitly requested

## 🎨 Design Principles

### Current Design System
- **Typography**: JetBrains Mono (monospace) + Inter (sans-serif)
- **Color System**: CSS Variables for Light/Dark theme
- **Layout**: 3-column grid (Config | Canvas | Properties)
- **Spacing**: Consistent 4px/8px/12px/16px system

### Theme System
- Use CSS Variables for all colors (--bg-primary, --text-primary, etc.)
- Support both Light and Dark themes
- Store user preference in localStorage

## 🔧 Development Workflow

### Before Making Changes
1. Check file line count
2. If over limit, split first, then make changes
3. Test in both Light and Dark themes

### After Making Changes
1. Verify all files under line limits
2. Test functionality works
3. Commit with clear message
4. Clean up any temporary files

## 📁 File Structure

```
layout-template-generator/
├── index.html          (276 lines - main HTML)
├── styles.css          (558 lines - all CSS)
├── src/                (ES6 modules)
│   ├── core/
│   │   ├── state.js          (32 lines)
│   │   ├── constants.js      (16 lines)
│   │   └── history.js        (87 lines)
│   ├── features/
│   │   └── shapes.js         (178 lines)
│   └── main.js               (36 lines - entry point)
├── app.js              (3030 lines - being migrated)
├── themes.js           (generated)
├── layouts-data.js     (generated)
└── convert_to_templates.py
```

## 🚀 Modularization Strategy

### Phase 1: Core Modules ✅ DONE
- ✅ src/core/state.js - Global state
- ✅ src/core/constants.js - Constants
- ✅ src/core/history.js - Undo/redo
- ✅ src/features/shapes.js - Shape presets
- ✅ src/main.js - ES6 module entry

**Result**: 349 lines extracted, app.js reduced from conceptually

### Phase 2: Next Priorities 🚧 TODO
- [ ] src/templates/master.js - Master template generation (~200 lines)
- [ ] src/ui/inspector.js - Element inspector (~250 lines)
- [ ] src/editor/transform.js - Drag/resize/rotate (~300 lines)
- [ ] src/editor/alignment.js - Alignment tools (~200 lines)

### Current Architecture
- **Hybrid**: ES6 modules + legacy code
- **Backward compatible**: Modules expose to `window` object
- **Gradual migration**: New code goes to modules, old code stays until migrated
