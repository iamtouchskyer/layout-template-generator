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
├── index.html          (276 lines - main HTML structure)
├── styles.css          (558 lines - all CSS styles)
├── app.js              (3000+ lines - needs splitting)
├── themes.js           (generated theme data)
├── layouts-data.js     (generated layout data)
└── convert_to_templates.py
```

## 🚀 Future Improvements

### Potential Refactoring
- Split app.js into modules (editor.js, inspector.js, toolbar.js, etc.)
- Consider modern build tools (Vite, Webpack)
- Consider framework migration (React, Vue) for better component organization

### Current Architecture
- Vanilla JavaScript (no framework)
- Direct DOM manipulation
- Event-driven architecture
- State management via global `state` object
