/**
 * Layout × Theme Generator
 * PowerPoint-style Slide Master & Layout Editor
 */

// ============================================================================
// STATE
// ============================================================================
// Page size dimensions (width x height in pixels at 96 DPI)
const PAGE_SIZES = {
    '4:3': { width: 960, height: 720, label: '4:3' },
    '16:9': { width: 1280, height: 720, label: '16:9' },
    '21:9': { width: 1680, height: 720, label: '21:9' },
};

const state = {
    currentTheme: 'soft_peach_cream',
    currentStyle: 'modern',
    pageSize: '16:9', // '4:3' | '16:9' | '21:9'
    editMode: 'master', // 'master' | 'layout'
    currentLayout: null,
    currentTab: 'preview',
    highlightElements: false,
    currentHTML: '',
    // Master elements configuration (applies to all layouts)
    masterConfig: {
        shapes: [], // Decorative shapes (header-badge, corner-accent, side-bar, etc.)
        placeholders: ['title'], // Title, Body Text, Footer (preset textboxes)
        dynamicFields: ['page-number'], // Date, Page Number (<a:fld> syntax)
    },
    // Per-layout overrides (which master elements to hide)
    layoutOverrides: {},
    // Element position/style overrides { elementId: { x, y, width, height, rotation, fontSize, fontFamily } }
    elementPositions: {},
    // Currently selected element for editing
    selectedElement: null,
    // Visual editing settings
    showGrid: false,
    snapToGrid: true,
    gridSize: 20, // pixels
    // Multi-select for alignment/distribution
    selectedElements: [],
};

// ============================================================================
// VISUAL EDITING CONSTANTS
// ============================================================================
const GRID_SIZE = 20;
const SNAP_THRESHOLD = 10;
const HANDLE_SIZE = 8;
const ROTATION_HANDLE_OFFSET = 25;

// ============================================================================
// SHAPE PRESETS - Style variations for each shape type
// ============================================================================
const SHAPE_PRESETS = {
    // Header Badge variants
    'header-badge': {
        title: 'Header Badge',
        presets: [
            { name: 'Pill Right', style: { borderRadius: '20px 0 0 20px', width: '120px', height: '40px', right: '0', left: 'auto' } },
            { name: 'Pill Left', style: { borderRadius: '0 20px 20px 0', width: '120px', height: '40px', left: '0', right: 'auto' } },
            { name: 'Tag Right', style: { borderRadius: '4px 0 0 4px', width: '100px', height: '32px', right: '0', left: 'auto' } },
            { name: 'Banner', style: { borderRadius: '0', width: '200px', height: '36px', right: '0', left: 'auto' } },
            { name: 'Circle', style: { borderRadius: '50%', width: '60px', height: '60px', right: '20px', left: 'auto' } },
            { name: 'Diamond', style: { borderRadius: '0', width: '50px', height: '50px', transform: 'rotate(45deg)', right: '30px', left: 'auto' } },
        ]
    },
    // Top Line variants
    'top-line': {
        title: 'Top Line',
        presets: [
            { name: 'Center', style: { left: '60px', right: '60px', width: 'auto', height: '3px' } },
            { name: 'Full', style: { left: '0', right: '0', width: 'auto', height: '3px' } },
            { name: 'Left Half', style: { left: '0', right: 'auto', width: '50%', height: '3px' } },
            { name: 'Thick', style: { left: '60px', right: '60px', width: 'auto', height: '6px' } },
            { name: 'Accent', style: { left: '60px', right: 'auto', width: '120px', height: '4px', borderRadius: '2px' } },
        ]
    },
    // Top Bar variants
    'top-bar': {
        title: 'Top Bar',
        presets: [
            { name: 'Thin', style: { height: '8px' } },
            { name: 'Medium', style: { height: '12px' } },
            { name: 'Thick', style: { height: '20px' } },
            { name: 'Bold', style: { height: '40px' } },
        ]
    },
    // Side Bar variants
    'side-bar': {
        title: 'Side Bar',
        presets: [
            { name: 'Thin', style: { width: '4px' } },
            { name: 'Medium', style: { width: '8px' } },
            { name: 'Wide', style: { width: '16px' } },
            { name: 'Accent', style: { width: '6px', top: '20%', height: '60%', borderRadius: '0 3px 3px 0' } },
        ]
    },
    // Left Stripe variants
    'left-stripe': {
        title: 'Left Stripe',
        presets: [
            { name: 'Narrow', style: { width: '30px' } },
            { name: 'Medium', style: { width: '40px' } },
            { name: 'Wide', style: { width: '60px' } },
            { name: 'Panel', style: { width: '100px' } },
        ]
    },
    // Bottom Strip variants
    'bottom-strip': {
        title: 'Bottom Strip',
        presets: [
            { name: 'Thin', style: { height: '4px' } },
            { name: 'Medium', style: { height: '6px' } },
            { name: 'Thick', style: { height: '10px' } },
            { name: 'Bold', style: { height: '20px' } },
        ]
    },
    // Corner variants
    'corner-accent': {
        title: 'Corner TL',
        presets: [
            { name: 'Small', style: { borderLeftWidth: '50px', borderBottomWidth: '50px' } },
            { name: 'Medium', style: { borderLeftWidth: '80px', borderBottomWidth: '80px' } },
            { name: 'Large', style: { borderLeftWidth: '120px', borderBottomWidth: '120px' } },
            { name: 'Huge', style: { borderLeftWidth: '200px', borderBottomWidth: '200px' } },
        ]
    },
    'corner-tr': {
        title: 'Corner TR',
        presets: [
            { name: 'Small', style: { borderRightWidth: '50px', borderBottomWidth: '50px' } },
            { name: 'Medium', style: { borderRightWidth: '80px', borderBottomWidth: '80px' } },
            { name: 'Large', style: { borderRightWidth: '120px', borderBottomWidth: '120px' } },
        ]
    },
    'corner-bl': {
        title: 'Corner BL',
        presets: [
            { name: 'Small', style: { borderLeftWidth: '50px', borderTopWidth: '50px' } },
            { name: 'Medium', style: { borderLeftWidth: '80px', borderTopWidth: '80px' } },
            { name: 'Large', style: { borderLeftWidth: '120px', borderTopWidth: '120px' } },
        ]
    },
    'corner-br': {
        title: 'Corner BR',
        presets: [
            { name: 'Small', style: { borderRightWidth: '50px', borderTopWidth: '50px' } },
            { name: 'Medium', style: { borderRightWidth: '80px', borderTopWidth: '80px' } },
            { name: 'Large', style: { borderRightWidth: '120px', borderTopWidth: '120px' } },
        ]
    },
    'corner-dots': {
        title: 'Corner Dots',
        presets: [
            { name: 'Small', style: { width: '40px', height: '40px', backgroundSize: '8px 8px' } },
            { name: 'Medium', style: { width: '60px', height: '60px', backgroundSize: '10px 10px' } },
            { name: 'Large', style: { width: '100px', height: '100px', backgroundSize: '12px 12px' } },
            { name: 'Dense', style: { width: '80px', height: '80px', backgroundSize: '6px 6px' } },
        ]
    },
    // Title underline variants
    'title-underline': {
        title: 'Title Underline',
        presets: [
            { name: 'Short', style: { width: '60px', height: '3px' } },
            { name: 'Medium', style: { width: '80px', height: '4px' } },
            { name: 'Long', style: { width: '150px', height: '3px' } },
            { name: 'Thick', style: { width: '100px', height: '6px' } },
            { name: 'Pill', style: { width: '80px', height: '8px', borderRadius: '4px' } },
        ]
    },
    // Accent Circle variants
    'accent-circle': {
        title: 'Accent Circle',
        presets: [
            { name: 'Small', style: { width: '120px', height: '120px', right: '-40px' } },
            { name: 'Medium', style: { width: '200px', height: '200px', right: '-60px' } },
            { name: 'Large', style: { width: '300px', height: '300px', right: '-100px' } },
            { name: 'Huge', style: { width: '400px', height: '400px', right: '-150px' } },
            { name: 'Half', style: { width: '300px', height: '300px', right: '-150px' } },
        ]
    },
    // Logo Area variants
    'logo-area': {
        title: 'Logo Area',
        presets: [
            { name: 'Small', style: { width: '60px', height: '30px' } },
            { name: 'Medium', style: { width: '80px', height: '40px' } },
            { name: 'Large', style: { width: '120px', height: '60px' } },
            { name: 'Square', style: { width: '50px', height: '50px' } },
            { name: 'Wide', style: { width: '150px', height: '40px' } },
        ]
    },
    // Watermark variants
    'watermark': {
        title: 'Watermark',
        presets: [
            { name: 'Small', style: { fontSize: '80px' } },
            { name: 'Medium', style: { fontSize: '120px' } },
            { name: 'Large', style: { fontSize: '180px' } },
            { name: 'Subtle', style: { fontSize: '120px', opacity: '0.08' } },
            { name: 'Bold', style: { fontSize: '120px', opacity: '0.25' } },
        ]
    },
    // Section Divider variants
    'section-divider': {
        title: 'Section Divider',
        presets: [
            { name: 'Full', style: { left: '5%', right: '5%' } },
            { name: 'Center', style: { left: '20%', right: '20%' } },
            { name: 'Short', style: { left: '35%', right: '35%' } },
            { name: 'Thick', style: { left: '10%', right: '10%', height: '2px' } },
        ]
    },
    // BG Pattern variants
    'bg-pattern': {
        title: 'BG Pattern',
        presets: [
            { name: 'Fine', style: { backgroundSize: '15px 15px', opacity: '0.2' } },
            { name: 'Medium', style: { backgroundSize: '20px 20px', opacity: '0.3' } },
            { name: 'Coarse', style: { backgroundSize: '30px 30px', opacity: '0.25' } },
            { name: 'Dense', style: { backgroundSize: '10px 10px', opacity: '0.15' } },
        ]
    },
};

// ============================================================================
// UNDO/REDO HISTORY
// ============================================================================
const history = {
    undoStack: [],
    redoStack: [],
    maxSize: 50,
};

function saveState() {
    // Deep clone the current element positions
    const snapshot = JSON.parse(JSON.stringify(state.elementPositions));

    // Don't save if same as last state
    if (history.undoStack.length > 0) {
        const lastState = history.undoStack[history.undoStack.length - 1];
        if (JSON.stringify(lastState) === JSON.stringify(snapshot)) {
            return;
        }
    }

    history.undoStack.push(snapshot);

    // Clear redo stack on new action
    history.redoStack = [];

    // Limit history size
    if (history.undoStack.length > history.maxSize) {
        history.undoStack.shift();
    }

    updateUndoRedoButtons();
}

function undo() {
    if (history.undoStack.length === 0) return;

    // Save current state to redo stack
    const currentState = JSON.parse(JSON.stringify(state.elementPositions));
    history.redoStack.push(currentState);

    // Restore previous state
    const previousState = history.undoStack.pop();
    state.elementPositions = previousState;

    updateUndoRedoButtons();
    updateMainPreview();
}

function redo() {
    if (history.redoStack.length === 0) return;

    // Save current state to undo stack
    const currentState = JSON.parse(JSON.stringify(state.elementPositions));
    history.undoStack.push(currentState);

    // Restore next state
    const nextState = history.redoStack.pop();
    state.elementPositions = nextState;

    updateUndoRedoButtons();
    updateMainPreview();
}

function updateUndoRedoButtons() {
    const undoBtn = document.getElementById('undo-btn');
    const redoBtn = document.getElementById('redo-btn');

    if (undoBtn) {
        undoBtn.disabled = history.undoStack.length === 0;
        undoBtn.classList.toggle('opacity-50', history.undoStack.length === 0);
    }
    if (redoBtn) {
        redoBtn.disabled = history.redoStack.length === 0;
        redoBtn.classList.toggle('opacity-50', history.redoStack.length === 0);
    }
}

let editor = null;

// ============================================================================
// MASTER TEMPLATE
// ============================================================================
// This is the base template that shows only master elements
// Master template is now generated dynamically based on page size
function getMasterTemplate() {
    const size = PAGE_SIZES[state.pageSize];
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        :root {
            --bg-color: {{theme.backgroundColor}};
            --heading-color: {{theme.headingColor}};
            --body-color: {{theme.bodyColor}};
            --muted-color: {{theme.mutedColor}};
            --accent-color: {{theme.accentColor}};
            --accent-light: {{theme.accentLight}};
            --card-bg: {{theme.cardBg}};
            --card-border: {{theme.cardBorder}};
            --heading-font: {{theme.headingFontFamily}};
            --body-font: {{theme.bodyFontFamily}};
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: var(--body-font);
            background-color: var(--bg-color);
            color: var(--body-color);
            width: ${size.width}px;
            height: ${size.height}px;
            overflow: hidden;
            position: relative;
        }
        .master-container {
            width: ${size.width}px;
            height: ${size.height}px;
            position: relative;
        }

        /* ============================================
           DECORATIVE SHAPES (z-order: lowest)
           ============================================ */

        /* ========== TOP AREA ========== */

        /* Header Badge - top-right accent pill */
        .shape-header-badge {
            position: absolute;
            top: 24px;
            right: 0;
            background: var(--accent-color);
            height: 40px;
            width: 120px;
            border-radius: 20px 0 0 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 14px;
            font-weight: 600;
        }

        /* Top Line - thin accent line at top */
        .shape-top-line {
            position: absolute;
            top: 0;
            left: 60px;
            right: 60px;
            height: 3px;
            background: var(--accent-color);
        }

        /* Top Bar - thick bar at top */
        .shape-top-bar {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 12px;
            background: var(--accent-color);
        }

        /* Top Gradient - fade down from top */
        .shape-top-gradient {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 120px;
            background: linear-gradient(180deg, var(--accent-light) 0%, transparent 100%);
            opacity: 0.5;
        }

        /* ========== LEFT AREA ========== */

        /* Side Bar - left vertical accent */
        .shape-side-bar {
            position: absolute;
            top: 0;
            left: 0;
            width: 8px;
            height: 100%;
            background: var(--accent-color);
        }

        /* Left Stripe - wide left bar */
        .shape-left-stripe {
            position: absolute;
            top: 0;
            left: 0;
            width: 40px;
            height: 100%;
            background: var(--accent-color);
        }

        /* Left Gradient - fade right from left */
        .shape-left-gradient {
            position: absolute;
            top: 0;
            left: 0;
            width: 200px;
            height: 100%;
            background: linear-gradient(90deg, var(--accent-light) 0%, transparent 100%);
            opacity: 0.4;
        }

        /* ========== RIGHT AREA ========== */

        /* Right Bar - thin right bar */
        .shape-right-bar {
            position: absolute;
            top: 0;
            right: 0;
            width: 8px;
            height: 100%;
            background: var(--accent-color);
        }

        /* Right Stripe - wide right bar */
        .shape-right-stripe {
            position: absolute;
            top: 0;
            right: 0;
            width: 40px;
            height: 100%;
            background: var(--accent-color);
        }

        /* Accent Circle - decorative circle */
        .shape-accent-circle {
            position: absolute;
            top: 50%;
            right: -60px;
            width: 200px;
            height: 200px;
            border-radius: 50%;
            background: var(--accent-light);
            opacity: 0.3;
            transform: translateY(-50%);
        }

        /* ========== BOTTOM AREA ========== */

        /* Bottom Strip - gradient accent at bottom */
        .shape-bottom-strip {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 6px;
            background: linear-gradient(90deg, var(--accent-color), var(--accent-light));
        }

        /* Bottom Bar - thick solid bar */
        .shape-bottom-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 16px;
            background: var(--accent-color);
        }

        /* Footer Line - thin line above footer */
        .shape-footer-line {
            position: absolute;
            bottom: 50px;
            left: 60px;
            right: 60px;
            height: 1px;
            background: var(--card-border);
        }

        /* ========== CORNERS ========== */

        /* Corner Accent - top-left triangle */
        .shape-corner-accent {
            position: absolute;
            top: 0;
            left: 0;
            width: 0;
            height: 0;
            border-left: 80px solid var(--accent-color);
            border-bottom: 80px solid transparent;
        }

        /* Corner TR - top-right triangle */
        .shape-corner-tr {
            position: absolute;
            top: 0;
            right: 0;
            width: 0;
            height: 0;
            border-right: 80px solid var(--accent-color);
            border-bottom: 80px solid transparent;
        }

        /* Corner BL - bottom-left triangle */
        .shape-corner-bl {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 0;
            border-left: 80px solid var(--accent-color);
            border-top: 80px solid transparent;
        }

        /* Corner BR - bottom-right triangle */
        .shape-corner-br {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 0;
            height: 0;
            border-right: 80px solid var(--accent-color);
            border-top: 80px solid transparent;
        }

        /* Corner Dots - decorative dot pattern */
        .shape-corner-dots {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background-image: radial-gradient(var(--accent-color) 2px, transparent 2px);
            background-size: 10px 10px;
            opacity: 0.5;
        }

        /* ========== CONTENT AREA ========== */

        /* Title Underline - decorative line under title area */
        .shape-title-underline {
            position: absolute;
            top: 88px;
            left: 60px;
            width: 80px;
            height: 4px;
            background: var(--accent-color);
            border-radius: 2px;
        }

        /* Section Divider - center horizontal line */
        .shape-section-divider {
            position: absolute;
            top: 50%;
            left: 10%;
            right: 10%;
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--card-border), transparent);
        }

        /* Watermark - large background text */
        .shape-watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-30deg);
            font-size: 120px;
            font-weight: 800;
            color: var(--card-border);
            opacity: 0.15;
            white-space: nowrap;
            pointer-events: none;
        }

        /* Logo Area - placeholder for company logo */
        .shape-logo-area {
            position: absolute;
            bottom: 20px;
            right: 20px;
            width: 80px;
            height: 40px;
            border: 1px dashed var(--card-border);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            color: var(--muted-color);
        }

        /* BG Pattern - subtle dot grid background */
        .shape-bg-pattern {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: radial-gradient(var(--card-border) 1px, transparent 1px);
            background-size: 20px 20px;
            opacity: 0.3;
            pointer-events: none;
        }

        /* ============================================
           PLACEHOLDERS (preset textboxes)
           ============================================ */

        .title-placeholder {
            position: absolute;
            top: 40px;
            left: 60px;
            width: ${size.width - 200}px;
            font-family: var(--heading-font);
            font-size: 36px;
            font-weight: 600;
            color: var(--heading-color);
        }

        .body-placeholder {
            position: absolute;
            top: 120px;
            left: 60px;
            right: 60px;
            bottom: 80px;
            font-family: var(--body-font);
            font-size: 18px;
            color: var(--body-color);
            border: 2px dashed var(--card-border);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .footer-placeholder {
            position: absolute;
            bottom: 24px;
            left: 60px;
            font-size: 12px;
            color: var(--muted-color);
        }

        /* ============================================
           DYNAMIC FIELDS (<a:fld> syntax)
           ============================================ */

        .date-field {
            position: absolute;
            bottom: 24px;
            left: ${size.width / 2 - 50}px;
            width: 100px;
            text-align: center;
            font-size: 12px;
            color: var(--muted-color);
        }

        .page-number-field {
            position: absolute;
            bottom: 24px;
            right: 60px;
            font-size: 12px;
            color: var(--muted-color);
        }
    </style>
</head>
<body>
    <div class="master-container">
        <!-- Decorative Shapes (lowest z-order) -->
        <!-- Background patterns (lowest) -->
        <div class="shape-bg-pattern" data-master-shape="bg-pattern"></div>

        <!-- Gradients -->
        <div class="shape-top-gradient" data-master-shape="top-gradient"></div>
        <div class="shape-left-gradient" data-master-shape="left-gradient"></div>

        <!-- Bars and stripes -->
        <div class="shape-top-bar" data-master-shape="top-bar"></div>
        <div class="shape-top-line" data-master-shape="top-line"></div>
        <div class="shape-side-bar" data-master-shape="side-bar"></div>
        <div class="shape-left-stripe" data-master-shape="left-stripe"></div>
        <div class="shape-right-bar" data-master-shape="right-bar"></div>
        <div class="shape-right-stripe" data-master-shape="right-stripe"></div>
        <div class="shape-bottom-bar" data-master-shape="bottom-bar"></div>
        <div class="shape-bottom-strip" data-master-shape="bottom-strip"></div>
        <div class="shape-footer-line" data-master-shape="footer-line"></div>

        <!-- Corners -->
        <div class="shape-corner-accent" data-master-shape="corner-accent"></div>
        <div class="shape-corner-tr" data-master-shape="corner-tr"></div>
        <div class="shape-corner-bl" data-master-shape="corner-bl"></div>
        <div class="shape-corner-br" data-master-shape="corner-br"></div>
        <div class="shape-corner-dots" data-master-shape="corner-dots"></div>

        <!-- Decorative -->
        <div class="shape-accent-circle" data-master-shape="accent-circle"></div>
        <div class="shape-section-divider" data-master-shape="section-divider"></div>
        <div class="shape-watermark" data-master-shape="watermark">DRAFT</div>
        <div class="shape-title-underline" data-master-shape="title-underline"></div>
        <div class="shape-header-badge" data-master-shape="header-badge">BADGE</div>
        <div class="shape-logo-area" data-master-shape="logo-area">LOGO</div>

        <!-- Placeholders (preset textboxes) -->
        <div class="title-placeholder" data-master-placeholder="title">Click to add title</div>
        <div class="body-placeholder" data-master-placeholder="body">Click to add text</div>
        <div class="footer-placeholder" data-master-placeholder="footer">Footer text</div>

        <!-- Dynamic Fields (<a:fld> syntax) -->
        <div class="date-field" data-master-dynamic="date" data-field-type="datetime">2026/2/2</div>
        <div class="page-number-field" data-master-dynamic="page-number" data-field-type="slidenum">‹#›</div>
    </div>
</body>
</html>`;
}

// ============================================================================
// INITIALIZATION
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    initThemeSelector();
    initLayoutList();
    initEditor();
    bindEvents();
    updatePageSizeUI();
    updatePreviewSize();
    // Start with master view
    selectMaster();
});

function initThemeSelector() {
    const select = document.getElementById('theme-select');
    select.innerHTML = Object.entries(THEMES)
        .map(([id, theme]) => `<option value="${id}">${theme.name}</option>`)
        .join('');
    select.value = state.currentTheme;
}

function initLayoutList() {
    updateLayoutList();
}

function updateLayoutList() {
    const container = document.getElementById('layout-list');
    const layouts = AVAILABLE_LAYOUTS[state.currentStyle] || [];

    container.innerHTML = layouts.map(id => `
        <div class="layout-item px-3 py-2 rounded text-sm cursor-pointer hover:bg-gray-700 transition-colors" data-layout="${id}">
            ${formatLayoutName(id)}
        </div>
    `).join('');

    // Update master thumbnail
    updateMasterThumbnail();
}

function formatLayoutName(id) {
    return id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function initEditor() {
    editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
        mode: 'htmlmixed',
        theme: 'dracula',
        lineNumbers: true,
        lineWrapping: true,
        tabSize: 2,
    });
}

// ============================================================================
// EVENT BINDING
// ============================================================================
function bindEvents() {
    // Theme selector
    document.getElementById('theme-select').addEventListener('change', (e) => {
        state.currentTheme = e.target.value;
        updateMasterThumbnail();
        updateMainPreview();
    });

    // Style selector
    document.getElementById('style-select').addEventListener('change', (e) => {
        state.currentStyle = e.target.value;
        updateLayoutList();
        if (state.editMode === 'layout') {
            state.currentLayout = null;
            selectMaster();
        }
    });

    // Master thumbnail click
    document.getElementById('master-thumbnail').addEventListener('click', () => {
        selectMaster();
    });

    // Layout list click
    document.getElementById('layout-list').addEventListener('click', (e) => {
        const item = e.target.closest('.layout-item');
        if (item && item.dataset.layout) {
            selectLayout(item.dataset.layout);
        }
    });

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            state.currentTab = btn.dataset.tab;
            updateTabUI();
        });
    });

    // Highlight toggle
    document.getElementById('highlight-elements').addEventListener('change', (e) => {
        state.highlightElements = e.target.checked;
        updateMainPreview();
    });

    // Master element checkboxes
    document.querySelectorAll('[data-master]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateMasterConfig();
            updateMasterThumbnail();
            updateMainPreview();
            // Refresh layout override panel if editing a layout
            if (state.editMode === 'layout' && state.currentLayout) {
                updateLayoutOverridePanel(state.currentLayout);
            }
        });
    });

    // Export config
    document.getElementById('btn-export-config').addEventListener('click', exportConfig);

    // Page size buttons
    document.querySelectorAll('.page-size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            state.pageSize = btn.dataset.ratio;
            updatePageSizeUI();
            updatePreviewSize();
            updateMasterThumbnail();
            updateMainPreview();
        });
    });
}

// ============================================================================
// SELECTION
// ============================================================================
function selectMaster() {
    state.editMode = 'master';
    state.currentLayout = null;

    // Update selection UI
    document.getElementById('master-thumbnail').classList.add('active');
    document.querySelectorAll('.layout-item').forEach(item => {
        item.classList.remove('bg-blue-600');
        item.classList.add('hover:bg-gray-700');
    });

    // Update info
    document.getElementById('current-info').textContent = 'Slide Master';
    document.getElementById('edit-mode-badge').textContent = 'Editing Master';
    document.getElementById('edit-mode-badge').className = 'px-2 py-0.5 rounded text-xs bg-yellow-600';

    // Hide layout override panel
    document.getElementById('layout-override-panel').classList.add('hidden');

    updateMainPreview();
}

function selectLayout(layoutId) {
    state.editMode = 'layout';
    state.currentLayout = layoutId;

    // Update selection UI
    document.getElementById('master-thumbnail').classList.remove('active');
    document.querySelectorAll('.layout-item').forEach(item => {
        item.classList.toggle('bg-blue-600', item.dataset.layout === layoutId);
        item.classList.toggle('hover:bg-gray-700', item.dataset.layout !== layoutId);
    });

    // Update info
    document.getElementById('current-info').textContent = formatLayoutName(layoutId);
    document.getElementById('edit-mode-badge').textContent = 'Editing Layout';
    document.getElementById('edit-mode-badge').className = 'px-2 py-0.5 rounded text-xs bg-blue-600';

    // Show layout override panel
    updateLayoutOverridePanel(layoutId);

    updateMainPreview();
}

// ============================================================================
// LAYOUT OVERRIDE
// ============================================================================
function updateLayoutOverridePanel(layoutId) {
    const panel = document.getElementById('layout-override-panel');
    const list = document.getElementById('layout-override-list');

    // Initialize override for this layout if not exists
    if (!state.layoutOverrides[layoutId]) {
        state.layoutOverrides[layoutId] = {
            hideShapes: [],
            hidePlaceholders: [],
            hideDynamicFields: [],
        };
    }

    const overrides = state.layoutOverrides[layoutId];

    // Build list of enabled master elements with checkboxes to hide them
    let html = '';

    // Shapes
    if (state.masterConfig.shapes?.length > 0) {
        html += '<p class="text-xs text-gray-500 mb-1">Shapes</p>';
        state.masterConfig.shapes.forEach(id => {
            const isHidden = overrides.hideShapes?.includes(id);
            html += `
                <label class="flex items-center gap-2 text-sm py-1 hover:bg-gray-700 rounded px-2 cursor-pointer">
                    <input type="checkbox" data-override="${id}" data-override-type="shape" ${isHidden ? 'checked' : ''} class="rounded">
                    <span class="text-gray-300 ${isHidden ? 'line-through opacity-50' : ''}">Hide ${formatElementName(id)}</span>
                </label>
            `;
        });
    }

    // Placeholders
    if (state.masterConfig.placeholders?.length > 0) {
        html += '<p class="text-xs text-gray-500 mb-1 mt-2">Placeholders</p>';
        state.masterConfig.placeholders.forEach(id => {
            const isHidden = overrides.hidePlaceholders?.includes(id);
            html += `
                <label class="flex items-center gap-2 text-sm py-1 hover:bg-gray-700 rounded px-2 cursor-pointer">
                    <input type="checkbox" data-override="${id}" data-override-type="placeholder" ${isHidden ? 'checked' : ''} class="rounded">
                    <span class="text-gray-300 ${isHidden ? 'line-through opacity-50' : ''}">Hide ${formatElementName(id)}</span>
                </label>
            `;
        });
    }

    // Dynamic Fields
    if (state.masterConfig.dynamicFields?.length > 0) {
        html += '<p class="text-xs text-gray-500 mb-1 mt-2">Dynamic Fields</p>';
        state.masterConfig.dynamicFields.forEach(id => {
            const isHidden = overrides.hideDynamicFields?.includes(id);
            html += `
                <label class="flex items-center gap-2 text-sm py-1 hover:bg-gray-700 rounded px-2 cursor-pointer">
                    <input type="checkbox" data-override="${id}" data-override-type="dynamic" ${isHidden ? 'checked' : ''} class="rounded">
                    <span class="text-gray-300 ${isHidden ? 'line-through opacity-50' : ''}">Hide ${formatElementName(id)}</span>
                </label>
            `;
        });
    }

    if (html === '') {
        html = '<p class="text-xs text-gray-500">No master elements enabled</p>';
    }

    list.innerHTML = html;
    panel.classList.remove('hidden');

    // Bind override checkbox events
    list.querySelectorAll('[data-override]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateLayoutOverride(layoutId, checkbox);
        });
    });
}

function formatElementName(id) {
    return id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function updateLayoutOverride(layoutId, checkbox) {
    const id = checkbox.dataset.override;
    const type = checkbox.dataset.overrideType;
    const overrides = state.layoutOverrides[layoutId];

    let targetArray;
    if (type === 'shape') {
        targetArray = overrides.hideShapes = overrides.hideShapes || [];
    } else if (type === 'placeholder') {
        targetArray = overrides.hidePlaceholders = overrides.hidePlaceholders || [];
    } else {
        targetArray = overrides.hideDynamicFields = overrides.hideDynamicFields || [];
    }

    if (checkbox.checked) {
        if (!targetArray.includes(id)) {
            targetArray.push(id);
        }
    } else {
        const index = targetArray.indexOf(id);
        if (index > -1) {
            targetArray.splice(index, 1);
        }
    }

    // Update checkbox label style
    const label = checkbox.closest('label').querySelector('span');
    label.classList.toggle('line-through', checkbox.checked);
    label.classList.toggle('opacity-50', checkbox.checked);

    updateMainPreview();
}

// ============================================================================
// MASTER CONFIG
// ============================================================================
function updateMasterConfig() {
    state.masterConfig = { shapes: [], placeholders: [], dynamicFields: [] };

    document.querySelectorAll('[data-master]').forEach(checkbox => {
        const id = checkbox.dataset.master;
        const type = checkbox.dataset.type;
        if (checkbox.checked) {
            if (type === 'shape') {
                state.masterConfig.shapes.push(id);
            } else if (type === 'dynamic') {
                state.masterConfig.dynamicFields.push(id);
            } else {
                state.masterConfig.placeholders.push(id);
            }
        }
    });
}

// ============================================================================
// PREVIEW & THUMBNAILS
// ============================================================================
function updateMasterThumbnail() {
    const masterHtml = buildMasterHTML();
    const masterFrame = document.getElementById('master-thumb-frame');
    if (masterFrame) masterFrame.srcdoc = masterHtml;
}

function updateMainPreview() {
    let html;
    if (state.editMode === 'master') {
        html = buildMasterHTML();
    } else {
        html = buildLayoutHTML(state.currentLayout);
    }

    if (state.highlightElements) {
        html = applyHighlightStyles(html);
    }

    state.currentHTML = html;

    const iframe = document.getElementById('preview-frame');
    iframe.srcdoc = html;
    iframe.onload = () => setupPreviewInteraction();

    if (state.currentTab === 'code') {
        editor.setValue(html);
    }
}

function buildMasterHTML() {
    let html = getMasterTemplate();
    html = applyThemeToHTML(html);
    html = applyMasterVisibility(html);
    return html;
}

function updatePageSizeUI() {
    document.querySelectorAll('.page-size-btn').forEach(btn => {
        const isActive = btn.dataset.ratio === state.pageSize;
        btn.classList.toggle('bg-blue-600', isActive);
        btn.classList.toggle('bg-gray-700', !isActive);
        btn.classList.toggle('hover:bg-gray-600', !isActive);
    });
}

function updatePreviewSize() {
    const size = PAGE_SIZES[state.pageSize];
    const previewFrame = document.getElementById('preview-frame');
    const previewContainer = previewFrame.parentElement;
    const masterFrame = document.getElementById('master-thumb-frame');
    const masterContainer = masterFrame.parentElement;

    // Update main preview
    previewFrame.style.width = size.width + 'px';
    previewFrame.style.height = size.height + 'px';
    previewContainer.style.width = size.width + 'px';
    previewContainer.style.height = size.height + 'px';

    // Update master thumbnail (scale to fit 256px width)
    const thumbScale = 256 / size.width;
    const thumbHeight = size.height * thumbScale;
    masterFrame.style.width = size.width + 'px';
    masterFrame.style.height = size.height + 'px';
    masterFrame.style.transform = `scale(${thumbScale})`;
    masterContainer.style.width = '256px';
    masterContainer.style.height = thumbHeight + 'px';
}

function buildLayoutHTML(layoutId) {
    let html = LAYOUT_HTML[state.currentStyle]?.[layoutId];
    if (!html) return buildMasterHTML();

    html = applyThemeToHTML(html);
    html = injectMasterElements(html, layoutId);
    return html;
}

// Generate master elements HTML snippet (without full page wrapper)
function getMasterElementsHTML() {
    const size = PAGE_SIZES[state.pageSize];
    return `
        <!-- Master Shapes (z-order: lowest) -->
        <!-- Background patterns -->
        <div class="shape-bg-pattern" data-master-shape="bg-pattern"></div>

        <!-- Gradients -->
        <div class="shape-top-gradient" data-master-shape="top-gradient"></div>
        <div class="shape-left-gradient" data-master-shape="left-gradient"></div>

        <!-- Bars and stripes -->
        <div class="shape-top-bar" data-master-shape="top-bar"></div>
        <div class="shape-top-line" data-master-shape="top-line"></div>
        <div class="shape-side-bar" data-master-shape="side-bar"></div>
        <div class="shape-left-stripe" data-master-shape="left-stripe"></div>
        <div class="shape-right-bar" data-master-shape="right-bar"></div>
        <div class="shape-right-stripe" data-master-shape="right-stripe"></div>
        <div class="shape-bottom-bar" data-master-shape="bottom-bar"></div>
        <div class="shape-bottom-strip" data-master-shape="bottom-strip"></div>
        <div class="shape-footer-line" data-master-shape="footer-line"></div>

        <!-- Corners -->
        <div class="shape-corner-accent" data-master-shape="corner-accent"></div>
        <div class="shape-corner-tr" data-master-shape="corner-tr"></div>
        <div class="shape-corner-bl" data-master-shape="corner-bl"></div>
        <div class="shape-corner-br" data-master-shape="corner-br"></div>
        <div class="shape-corner-dots" data-master-shape="corner-dots"></div>

        <!-- Decorative -->
        <div class="shape-accent-circle" data-master-shape="accent-circle"></div>
        <div class="shape-section-divider" data-master-shape="section-divider"></div>
        <div class="shape-watermark" data-master-shape="watermark">DRAFT</div>
        <div class="shape-title-underline" data-master-shape="title-underline"></div>
        <div class="shape-header-badge" data-master-shape="header-badge">BADGE</div>
        <div class="shape-logo-area" data-master-shape="logo-area">LOGO</div>

        <!-- Master Placeholders -->
        <div class="master-title-placeholder" data-master-placeholder="title">Click to add title</div>
        <div class="master-body-placeholder" data-master-placeholder="body">Click to add text</div>
        <div class="master-footer-placeholder" data-master-placeholder="footer">Footer text</div>

        <!-- Master Dynamic Fields -->
        <div class="master-date-field" data-master-dynamic="date" data-field-type="datetime">2026/2/2</div>
        <div class="master-page-number-field" data-master-dynamic="page-number" data-field-type="slidenum">‹#›</div>
    `;
}

// Generate master CSS to inject into layouts
function getMasterCSS() {
    const size = PAGE_SIZES[state.pageSize];
    return `
        /* ============================================
           MASTER ELEMENTS (injected from Slide Master)
           ============================================ */

        /* ========== TOP AREA ========== */
        .shape-header-badge {
            position: absolute;
            top: 24px;
            right: 0;
            background: var(--accent-color);
            height: 40px;
            width: 120px;
            border-radius: 20px 0 0 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 14px;
            font-weight: 600;
            z-index: 1;
        }
        .shape-top-line {
            position: absolute;
            top: 0;
            left: 60px;
            right: 60px;
            height: 3px;
            background: var(--accent-color);
            z-index: 1;
        }
        .shape-top-bar {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 12px;
            background: var(--accent-color);
            z-index: 1;
        }
        .shape-top-gradient {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 120px;
            background: linear-gradient(180deg, var(--accent-light) 0%, transparent 100%);
            opacity: 0.5;
            z-index: 0;
        }

        /* ========== LEFT AREA ========== */
        .shape-side-bar {
            position: absolute;
            top: 0;
            left: 0;
            width: 8px;
            height: 100%;
            background: var(--accent-color);
            z-index: 1;
        }
        .shape-left-stripe {
            position: absolute;
            top: 0;
            left: 0;
            width: 40px;
            height: 100%;
            background: var(--accent-color);
            z-index: 1;
        }
        .shape-left-gradient {
            position: absolute;
            top: 0;
            left: 0;
            width: 200px;
            height: 100%;
            background: linear-gradient(90deg, var(--accent-light) 0%, transparent 100%);
            opacity: 0.4;
            z-index: 0;
        }

        /* ========== RIGHT AREA ========== */
        .shape-right-bar {
            position: absolute;
            top: 0;
            right: 0;
            width: 8px;
            height: 100%;
            background: var(--accent-color);
            z-index: 1;
        }
        .shape-right-stripe {
            position: absolute;
            top: 0;
            right: 0;
            width: 40px;
            height: 100%;
            background: var(--accent-color);
            z-index: 1;
        }
        .shape-accent-circle {
            position: absolute;
            top: 50%;
            right: -60px;
            width: 200px;
            height: 200px;
            border-radius: 50%;
            background: var(--accent-light);
            opacity: 0.3;
            transform: translateY(-50%);
            z-index: 1;
        }

        /* ========== BOTTOM AREA ========== */
        .shape-bottom-strip {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 6px;
            background: linear-gradient(90deg, var(--accent-color), var(--accent-light));
            z-index: 1;
        }
        .shape-bottom-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 16px;
            background: var(--accent-color);
            z-index: 1;
        }
        .shape-footer-line {
            position: absolute;
            bottom: 50px;
            left: 60px;
            right: 60px;
            height: 1px;
            background: var(--card-border);
            z-index: 1;
        }

        /* ========== CORNERS ========== */
        .shape-corner-accent {
            position: absolute;
            top: 0;
            left: 0;
            width: 0;
            height: 0;
            border-left: 80px solid var(--accent-color);
            border-bottom: 80px solid transparent;
            z-index: 1;
        }
        .shape-corner-tr {
            position: absolute;
            top: 0;
            right: 0;
            width: 0;
            height: 0;
            border-right: 80px solid var(--accent-color);
            border-bottom: 80px solid transparent;
            z-index: 1;
        }
        .shape-corner-bl {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 0;
            border-left: 80px solid var(--accent-color);
            border-top: 80px solid transparent;
            z-index: 1;
        }
        .shape-corner-br {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 0;
            height: 0;
            border-right: 80px solid var(--accent-color);
            border-top: 80px solid transparent;
            z-index: 1;
        }
        .shape-corner-dots {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background-image: radial-gradient(var(--accent-color) 2px, transparent 2px);
            background-size: 10px 10px;
            opacity: 0.5;
            z-index: 1;
        }

        /* ========== CONTENT AREA ========== */
        .shape-title-underline {
            position: absolute;
            top: 88px;
            left: 60px;
            width: 80px;
            height: 4px;
            background: var(--accent-color);
            border-radius: 2px;
            z-index: 1;
        }
        .shape-section-divider {
            position: absolute;
            top: 50%;
            left: 10%;
            right: 10%;
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--card-border), transparent);
            z-index: 1;
        }
        .shape-watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-30deg);
            font-size: 120px;
            font-weight: 800;
            color: var(--card-border);
            opacity: 0.15;
            white-space: nowrap;
            pointer-events: none;
            z-index: 0;
        }
        .shape-logo-area {
            position: absolute;
            bottom: 20px;
            right: 20px;
            width: 80px;
            height: 40px;
            border: 1px dashed var(--card-border);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            color: var(--muted-color);
            z-index: 1;
        }
        .shape-bg-pattern {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: radial-gradient(var(--card-border) 1px, transparent 1px);
            background-size: 20px 20px;
            opacity: 0.3;
            pointer-events: none;
            z-index: 0;
        }

        /* Master Placeholders */
        .master-title-placeholder {
            position: absolute;
            top: 40px;
            left: 60px;
            width: ${size.width - 200}px;
            font-family: var(--heading-font);
            font-size: 36px;
            font-weight: 600;
            color: var(--heading-color);
            z-index: 2;
        }
        .master-body-placeholder {
            position: absolute;
            top: 120px;
            left: 60px;
            right: 60px;
            bottom: 80px;
            font-family: var(--body-font);
            font-size: 18px;
            color: var(--body-color);
            border: 2px dashed var(--card-border);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2;
        }
        .master-footer-placeholder {
            position: absolute;
            bottom: 24px;
            left: 60px;
            font-size: 12px;
            color: var(--muted-color);
            z-index: 2;
        }

        /* Master Dynamic Fields */
        .master-date-field {
            position: absolute;
            bottom: 24px;
            left: ${size.width / 2 - 50}px;
            width: 100px;
            text-align: center;
            font-size: 12px;
            color: var(--muted-color);
            z-index: 2;
        }
        .master-page-number-field {
            position: absolute;
            bottom: 24px;
            right: 60px;
            font-size: 12px;
            color: var(--muted-color);
            z-index: 2;
        }
    `;
}

// Inject master elements into layout HTML
function injectMasterElements(html, layoutId) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Inject master CSS into <head>
    const styleEl = doc.createElement('style');
    let extraCSS = `
        /* Ensure layout content is above master elements */
        body > *:not(.master-layer) {
            position: relative;
            z-index: 10;
        }
    `;

    // Hide layout's built-in header-decor when master provides header-badge
    if (state.masterConfig.shapes?.includes('header-badge')) {
        extraCSS += `
        .header-decor {
            display: none !important;
        }
        `;
    }

    styleEl.textContent = getMasterCSS() + extraCSS;
    doc.head.appendChild(styleEl);

    // Create master layer container
    const masterLayer = doc.createElement('div');
    masterLayer.className = 'master-layer';
    masterLayer.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0;';
    masterLayer.innerHTML = getMasterElementsHTML();

    // Enable pointer events on actual elements
    masterLayer.querySelectorAll('[data-master-shape], [data-master-placeholder], [data-master-dynamic]').forEach(el => {
        el.style.pointerEvents = 'auto';
    });

    // Insert at the beginning of body (lowest z-order)
    const body = doc.body;
    const firstChild = body.firstChild;
    if (firstChild) {
        body.insertBefore(masterLayer, firstChild);
    } else {
        body.appendChild(masterLayer);
    }

    // Apply visibility based on master config and layout overrides
    applyMasterVisibilityToDoc(doc, layoutId);

    // Apply saved positions
    doc.querySelectorAll('[data-master-shape]').forEach(el => {
        applyElementPosition(el, el.dataset.masterShape);
    });
    doc.querySelectorAll('[data-master-placeholder]').forEach(el => {
        applyElementPosition(el, el.dataset.masterPlaceholder);
    });
    doc.querySelectorAll('[data-master-dynamic]').forEach(el => {
        applyElementPosition(el, el.dataset.masterDynamic);
    });

    return '<!DOCTYPE html>' + doc.documentElement.outerHTML;
}

// Apply visibility to document (for layouts)
function applyMasterVisibilityToDoc(doc, layoutId) {
    const overrides = state.layoutOverrides[layoutId] || {};

    // Hide master shapes not in config or overridden for this layout
    doc.querySelectorAll('[data-master-shape]').forEach(el => {
        const id = el.dataset.masterShape;
        const inMaster = state.masterConfig.shapes?.includes(id);
        const hiddenInLayout = overrides.hideShapes?.includes(id);
        if (!inMaster || hiddenInLayout) {
            el.style.display = 'none';
        }
    });

    // Hide master placeholders not in config or overridden
    doc.querySelectorAll('[data-master-placeholder]').forEach(el => {
        const id = el.dataset.masterPlaceholder;
        const inMaster = state.masterConfig.placeholders?.includes(id);
        const hiddenInLayout = overrides.hidePlaceholders?.includes(id);
        if (!inMaster || hiddenInLayout) {
            el.style.display = 'none';
        }
    });

    // Hide master dynamic fields not in config or overridden
    doc.querySelectorAll('[data-master-dynamic]').forEach(el => {
        const id = el.dataset.masterDynamic;
        const inMaster = state.masterConfig.dynamicFields?.includes(id);
        const hiddenInLayout = overrides.hideDynamicFields?.includes(id);
        if (!inMaster || hiddenInLayout) {
            el.style.display = 'none';
        }
    });
}

function applyThemeToHTML(html) {
    const theme = THEMES[state.currentTheme];

    const replacements = {
        '{{theme.backgroundColor}}': theme.backgroundColor,
        '{{theme.headingColor}}': theme.headingColor,
        '{{theme.bodyColor}}': theme.bodyColor,
        '{{theme.accentColor}}': theme.primaryColor,
        '{{theme.accentLight}}': theme.shapeShadowColor || theme.shapeColor,
        '{{theme.cardBg}}': theme.shapeColor,
        '{{theme.cardBorder}}': theme.shapeBorderColor,
        '{{theme.mutedColor}}': theme.shapeFontColor || theme.bodyColor,
        '{{theme.headingFontFamily}}': theme.headingFontFamily,
        '{{theme.bodyFontFamily}}': theme.bodyFontFamily,
    };

    for (const [key, value] of Object.entries(replacements)) {
        html = html.replaceAll(key, value);
    }

    // Replace content placeholders
    html = html.replace(/\{\{([^}]+)\}\}/g, (match, key) => getSampleContent(key.trim()));

    return html;
}

function getSampleContent(key) {
    const samples = {
        'title': 'Sample Title',
        'subtitle': 'Subtitle text',
        'category': 'CATEGORY',
        'page_number': '01',
        'footer': 'Footer text',
        'heading_1': 'First Card',
        'heading_2': 'Second Card',
        'heading_3': 'Third Card',
        'card_1_icon': '📊',
        'card_2_icon': '💡',
        'card_3_icon': '🎯',
        'section_label': 'Key Points',
        'bullet_1': 'First point',
        'bullet_2': 'Second point',
        'bullet_3': 'Third point',
    };
    return samples[key] || `[${key}]`;
}

function applyMasterVisibility(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Hide master shapes not in config
    doc.querySelectorAll('[data-master-shape]').forEach(el => {
        const id = el.dataset.masterShape;
        if (!state.masterConfig.shapes || !state.masterConfig.shapes.includes(id)) {
            el.style.display = 'none';
        }
        applyElementPosition(el, id);
    });

    // Hide master placeholders not in config
    doc.querySelectorAll('[data-master-placeholder]').forEach(el => {
        const id = el.dataset.masterPlaceholder;
        if (!state.masterConfig.placeholders.includes(id)) {
            el.style.display = 'none';
        }
        applyElementPosition(el, id);
    });

    // Hide master dynamic fields not in config
    doc.querySelectorAll('[data-master-dynamic]').forEach(el => {
        const id = el.dataset.masterDynamic;
        if (!state.masterConfig.dynamicFields.includes(id)) {
            el.style.display = 'none';
        }
        applyElementPosition(el, id);
    });

    return '<!DOCTYPE html>' + doc.documentElement.outerHTML;
}

function applyElementPosition(el, id) {
    const pos = state.elementPositions[id];
    if (!pos) return;

    // Apply preset style first (if saved)
    if (pos.presetStyle) {
        for (const [prop, value] of Object.entries(pos.presetStyle)) {
            el.style[prop] = value;
        }
    }

    // Clear conflicting positioning when applying saved position
    if (pos.x !== undefined) {
        el.style.left = pos.x + 'px';
        el.style.right = 'auto';
    }
    if (pos.y !== undefined) {
        el.style.top = pos.y + 'px';
        el.style.bottom = 'auto';
    }
    if (pos.width !== undefined) el.style.width = pos.width + 'px';
    if (pos.height !== undefined) el.style.height = pos.height + 'px';

    // Apply rotation
    if (pos.rotation !== undefined) {
        el.style.transform = `rotate(${pos.rotation}deg)`;
        el.style.transformOrigin = 'center center';
    }

    // Apply font properties
    if (pos.fontFamily) el.style.fontFamily = pos.fontFamily;
    if (pos.fontSize !== undefined) el.style.fontSize = pos.fontSize + 'px';
    if (pos.fontColor) el.style.color = pos.fontColor;
    if (pos.bold) el.style.fontWeight = 'bold';
    if (pos.italic) el.style.fontStyle = 'italic';
    if (pos.underline) el.style.textDecoration = 'underline';

    // Apply shape style properties
    if (pos.fillColor) el.style.backgroundColor = pos.fillColor;
    if (pos.borderColor) el.style.borderColor = pos.borderColor;
}

function applyHighlightStyles(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const style = doc.createElement('style');
    style.textContent = `
        [data-master-shape] { outline: 2px dashed #F59E0B !important; outline-offset: -2px; }
        [data-master-placeholder] { outline: 2px dashed #8B5CF6 !important; outline-offset: -2px; }
        [data-master-dynamic] { outline: 2px dashed #EC4899 !important; outline-offset: -2px; }
        [data-layout-shape] { outline: 2px solid #10B981 !important; outline-offset: -2px; }
        [data-layout-placeholder] { outline: 2px solid #3B82F6 !important; outline-offset: -2px; }
    `;
    doc.head.appendChild(style);

    return '<!DOCTYPE html>' + doc.documentElement.outerHTML;
}

// ============================================================================
// UI UPDATES
// ============================================================================
function updateTabUI() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === state.currentTab);
    });

    document.getElementById('preview-area').classList.toggle('hidden', state.currentTab !== 'preview');
    document.getElementById('code-area').classList.toggle('hidden', state.currentTab !== 'code');

    if (state.currentTab === 'code' && state.currentHTML) {
        editor.setValue(state.currentHTML);
        editor.refresh();
    }
}

// ============================================================================
// PREVIEW INTERACTION
// ============================================================================
function setupPreviewInteraction() {
    const iframe = document.getElementById('preview-frame');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return;

    const selectors = '[data-master-shape], [data-master-placeholder], [data-master-dynamic], [data-layout-shape], [data-layout-placeholder]';
    iframeDoc.querySelectorAll(selectors).forEach(el => {
        el.style.cursor = 'move';
        el.style.userSelect = 'none';

        // Click to select
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            selectElement(el, iframe);
        });

        // Drag to move
        setupDragForElement(el, iframe, iframeDoc);
    });

    // Click on background to deselect
    iframeDoc.body.addEventListener('click', () => {
        deselectElement(iframeDoc);
    });
}

function selectElement(el, iframe) {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return;

    // Remove previous selection
    iframeDoc.querySelectorAll('.selected-element').forEach(e => {
        e.classList.remove('selected-element');
    });
    removeSelectionOverlay(iframeDoc);

    // Add selection class
    el.classList.add('selected-element');

    // Create selection overlay with resize handles
    createSelectionOverlay(el, iframe);

    state.selectedElement = getElementId(el);
    updateInspector(el, iframe);

    // Sync toolbar with selected element
    updateToolbarFromElement(el, iframe);
}

function deselectElement(iframeDoc) {
    removeSelectionOverlay(iframeDoc);
    iframeDoc.querySelectorAll('.selected-element').forEach(e => {
        e.classList.remove('selected-element');
        e.style.outline = '';
    });
    state.selectedElement = null;
    document.getElementById('inspector-content').innerHTML =
        '<p class="text-sm text-gray-500">Click an element to inspect</p>';

    // Hide shape presets panel
    hideShapePresets();
}

function getElementId(el) {
    return el.dataset.masterShape || el.dataset.masterPlaceholder ||
           el.dataset.masterDynamic || el.dataset.layoutShape ||
           el.dataset.layoutPlaceholder;
}

function setupDragForElement(el, iframe, iframeDoc) {
    let isDragging = false;
    let startX, startY;
    let startLeft, startTop;
    let hasMoved = false;

    el.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return; // Only left click
        e.preventDefault();
        e.stopPropagation();

        // Reset hasMoved for this drag operation
        hasMoved = false;

        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;

        // Get element's bounding rect and its offset parent's rect
        const elRect = el.getBoundingClientRect();
        const offsetParent = el.offsetParent || iframeDoc.body;
        const parentRect = offsetParent.getBoundingClientRect();

        // Calculate position relative to offset parent (not viewport)
        startLeft = elRect.left - parentRect.left;
        startTop = elRect.top - parentRect.top;

        selectElement(el, iframe);

        // Convert to left/top positioning without changing visual position
        el.style.position = 'absolute';
        el.style.left = startLeft + 'px';
        el.style.top = startTop + 'px';
        el.style.right = 'auto';
        el.style.bottom = 'auto';
        el.style.zIndex = '1000';
    });

    iframeDoc.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();

        // Save state on first move (not on mousedown)
        if (!hasMoved) {
            saveState();
            hasMoved = true;
        }

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        el.style.left = (startLeft + dx) + 'px';
        el.style.top = (startTop + dy) + 'px';

        // Update inspector in real-time
        updateInspectorPosition(el);
    });

    iframeDoc.addEventListener('mouseup', (e) => {
        if (!isDragging) return;
        isDragging = false;

        el.style.zIndex = '';

        // Save position
        const id = getElementId(el);
        const rect = el.getBoundingClientRect();
        state.elementPositions[id] = {
            x: parseFloat(el.style.left),
            y: parseFloat(el.style.top),
            width: rect.width,
            height: rect.height,
        };

        updateInspector(el, iframe);
    });
}

function updateInspectorPosition(el) {
    const posX = document.getElementById('inspector-pos-x');
    const posY = document.getElementById('inspector-pos-y');
    if (posX && posY) {
        // During drag, el.style.left/top are always set, so just use those
        posX.value = Math.round(parseFloat(el.style.left) || 0);
        posY.value = Math.round(parseFloat(el.style.top) || 0);
    }
}

function updateInspector(el, iframe) {
    const container = document.getElementById('inspector-content');

    if (!el) {
        container.innerHTML = '<p class="text-sm text-gray-500">Click an element to inspect</p>';
        return;
    }

    const rect = el.getBoundingClientRect();
    const isMaster = el.dataset.masterShape || el.dataset.masterPlaceholder || el.dataset.masterDynamic;
    const isShape = el.dataset.masterShape || el.dataset.layoutShape;
    const isDynamic = el.dataset.masterDynamic;
    const id = el.dataset.masterShape || el.dataset.masterPlaceholder || el.dataset.masterDynamic ||
               el.dataset.layoutShape || el.dataset.layoutPlaceholder;

    const type = isMaster ? 'Master' : 'Layout';
    let category = 'Placeholder';
    if (isShape) category = 'Shape';
    else if (isDynamic) category = 'Dynamic Field';

    const themeFill = el.dataset.themeFill;
    const fieldType = el.dataset.fieldType;

    let attrName = 'placeholder';
    if (isShape) attrName = 'shape';
    else if (isDynamic) attrName = 'dynamic';

    // Get computed style
    const iframeWin = iframe.contentWindow;
    const computed = iframeWin.getComputedStyle(el);

    // Get current position (from inline style if set, otherwise calculate from rect)
    let posX, posY;
    if (el.style.left) {
        posX = Math.round(parseFloat(el.style.left));
        posY = Math.round(parseFloat(el.style.top));
    } else {
        // Calculate position relative to offset parent
        const offsetParent = el.offsetParent || iframeWin.document.body;
        const parentRect = offsetParent.getBoundingClientRect();
        posX = Math.round(rect.left - parentRect.left);
        posY = Math.round(rect.top - parentRect.top);
    }
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);

    // Get rotation
    const transform = el.style.transform || '';
    const rotMatch = transform.match(/rotate\(([^)]+)deg\)/);
    const rotation = rotMatch ? Math.round(parseFloat(rotMatch[1])) : 0;

    // Get font properties (for text elements)
    const fontSize = parseInt(computed.fontSize) || 14;
    const fontFamily = computed.fontFamily.split(',')[0].replace(/['"]/g, '').trim();
    const isTextElement = !isShape; // Placeholders and dynamic fields have text

    container.innerHTML = `
        <div class="space-y-3">
            <div>
                <h3 class="text-white font-medium">${id}</h3>
                <p class="text-xs text-gray-400">${type} ${category}</p>
            </div>

            <!-- Position Controls -->
            <div class="space-y-2">
                <p class="text-xs text-gray-500">Position (px)</p>
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="text-xs text-gray-500">X</label>
                        <input type="number" id="inspector-pos-x" value="${posX}"
                            class="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                            data-element-id="${id}" data-prop="x">
                    </div>
                    <div>
                        <label class="text-xs text-gray-500">Y</label>
                        <input type="number" id="inspector-pos-y" value="${posY}"
                            class="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                            data-element-id="${id}" data-prop="y">
                    </div>
                </div>
            </div>

            <!-- Size Controls -->
            <div class="space-y-2">
                <p class="text-xs text-gray-500">Size (px)</p>
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="text-xs text-gray-500">W</label>
                        <input type="number" id="inspector-width" value="${width}"
                            class="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                            data-element-id="${id}" data-prop="width">
                    </div>
                    <div>
                        <label class="text-xs text-gray-500">H</label>
                        <input type="number" id="inspector-height" value="${height}"
                            class="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                            data-element-id="${id}" data-prop="height">
                    </div>
                </div>
            </div>

            <!-- Rotation Control -->
            <div class="space-y-2">
                <p class="text-xs text-gray-500">Rotation (°)</p>
                <div class="flex gap-2 items-center">
                    <input type="range" id="inspector-rotation" value="${rotation}" min="-180" max="180"
                        class="flex-1 h-1 bg-gray-600 rounded appearance-none cursor-pointer"
                        data-element-id="${id}" data-prop="rotation">
                    <input type="number" id="inspector-rotation-num" value="${rotation}"
                        class="w-16 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white text-center"
                        data-element-id="${id}" data-prop="rotation">
                </div>
            </div>

            ${isTextElement ? `
            <!-- Font Controls -->
            <div class="space-y-2">
                <p class="text-xs text-gray-500">Font</p>
                <select id="inspector-font-family"
                    class="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                    data-element-id="${id}" data-prop="fontFamily">
                    <option value="Inter" ${fontFamily === 'Inter' ? 'selected' : ''}>Inter</option>
                    <option value="Open Sans" ${fontFamily === 'Open Sans' ? 'selected' : ''}>Open Sans</option>
                    <option value="Roboto" ${fontFamily === 'Roboto' ? 'selected' : ''}>Roboto</option>
                    <option value="Lato" ${fontFamily === 'Lato' ? 'selected' : ''}>Lato</option>
                    <option value="Montserrat" ${fontFamily === 'Montserrat' ? 'selected' : ''}>Montserrat</option>
                    <option value="Playfair Display" ${fontFamily === 'Playfair Display' ? 'selected' : ''}>Playfair Display</option>
                    <option value="Oswald" ${fontFamily === 'Oswald' ? 'selected' : ''}>Oswald</option>
                    <option value="Merriweather" ${fontFamily === 'Merriweather' ? 'selected' : ''}>Merriweather</option>
                </select>
                <div class="flex gap-2">
                    <div class="flex-1">
                        <label class="text-xs text-gray-500">Size</label>
                        <input type="number" id="inspector-font-size" value="${fontSize}" min="8" max="200"
                            class="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                            data-element-id="${id}" data-prop="fontSize">
                    </div>
                </div>
            </div>
            ` : ''}

            ${themeFill ? `
            <div class="flex justify-between items-center text-xs">
                <span class="text-gray-400">Theme Fill</span>
                <span class="flex items-center gap-2">
                    <span class="text-white">${themeFill}</span>
                    <span class="w-3 h-3 rounded" style="background: ${THEMES[state.currentTheme].primaryColor}"></span>
                </span>
            </div>
            ` : ''}

            ${fieldType ? `
            <div class="flex justify-between items-center text-xs">
                <span class="text-gray-400">Field Type</span>
                <span class="text-pink-400">&lt;a:fld type="${fieldType}"&gt;</span>
            </div>
            ` : ''}

            <!-- Reset Button -->
            <button id="inspector-reset-btn"
                class="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs py-1.5 rounded">
                Reset Position
            </button>

            <div class="pt-2 border-t border-gray-700">
                <p class="text-xs text-gray-500 mb-1">Tip: Use arrow keys to move (Shift+Arrow = 10px)</p>
                <code class="text-xs text-green-400 block bg-gray-900 p-2 rounded break-all">
                    data-${isMaster ? 'master' : 'layout'}-${attrName}="${id}"
                </code>
            </div>
        </div>
    `;

    // Bind input events
    bindInspectorInputs(el, iframe);
}

function bindInspectorInputs(el, iframe) {
    // Number inputs (position, size)
    const inputs = document.querySelectorAll('#inspector-content input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('change', () => {
            applyInputToElement(input, el, iframe);
        });
    });

    // Rotation slider
    const rotSlider = document.getElementById('inspector-rotation');
    const rotNum = document.getElementById('inspector-rotation-num');
    if (rotSlider && rotNum) {
        rotSlider.addEventListener('input', () => {
            rotNum.value = rotSlider.value;
            applyRotation(el, parseFloat(rotSlider.value), iframe);
        });
        rotNum.addEventListener('change', () => {
            rotSlider.value = rotNum.value;
            applyRotation(el, parseFloat(rotNum.value), iframe);
        });
    }

    // Font family select
    const fontSelect = document.getElementById('inspector-font-family');
    if (fontSelect) {
        fontSelect.addEventListener('change', () => {
            applyFontFamily(el, fontSelect.value, iframe);
        });
    }

    // Font size
    const fontSizeInput = document.getElementById('inspector-font-size');
    if (fontSizeInput) {
        fontSizeInput.addEventListener('change', () => {
            applyFontSize(el, parseFloat(fontSizeInput.value), iframe);
        });
    }

    // Reset button
    const resetBtn = document.getElementById('inspector-reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            const id = getElementId(el);
            delete state.elementPositions[id];
            updateMainPreview();
        });
    }

    // Keyboard support in iframe
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (iframeDoc && !iframeDoc._keyboardBound) {
        iframeDoc._keyboardBound = true;
        iframeDoc.addEventListener('keydown', (e) => {
            if (!state.selectedElement) return;

            const selected = iframeDoc.querySelector('.selected-element');
            if (!selected) return;

            const step = e.shiftKey ? 10 : 1;
            let handled = false;

            switch (e.key) {
                case 'ArrowLeft':
                    saveState();
                    moveElement(selected, -step, 0, iframe.contentWindow);
                    createSelectionOverlay(selected, iframe);
                    handled = true;
                    break;
                case 'ArrowRight':
                    saveState();
                    moveElement(selected, step, 0, iframe.contentWindow);
                    createSelectionOverlay(selected, iframe);
                    handled = true;
                    break;
                case 'ArrowUp':
                    saveState();
                    moveElement(selected, 0, -step, iframe.contentWindow);
                    createSelectionOverlay(selected, iframe);
                    handled = true;
                    break;
                case 'ArrowDown':
                    saveState();
                    moveElement(selected, 0, step, iframe.contentWindow);
                    createSelectionOverlay(selected, iframe);
                    handled = true;
                    break;
            }

            if (handled) {
                e.preventDefault();
                updateInspector(selected, iframe);
            }
        });
    }
}

function applyRotation(el, rotation, iframe) {
    el.style.transform = `rotate(${rotation}deg)`;
    el.style.transformOrigin = 'center center';

    // Save to state
    const id = getElementId(el);
    if (!state.elementPositions[id]) state.elementPositions[id] = {};
    state.elementPositions[id].rotation = rotation;

    // Update overlay
    createSelectionOverlay(el, iframe);
}

function applyFontFamily(el, fontFamily, iframe) {
    el.style.fontFamily = fontFamily;

    // Save to state
    const id = getElementId(el);
    if (!state.elementPositions[id]) state.elementPositions[id] = {};
    state.elementPositions[id].fontFamily = fontFamily;
}

function applyFontSize(el, fontSize, iframe) {
    el.style.fontSize = fontSize + 'px';

    // Save to state
    const id = getElementId(el);
    if (!state.elementPositions[id]) state.elementPositions[id] = {};
    state.elementPositions[id].fontSize = fontSize;

    // Update overlay to match new size
    createSelectionOverlay(el, iframe);
}

function applyInputToElement(input, el, iframe) {
    const prop = input.dataset.prop;
    const value = parseFloat(input.value);
    const id = input.dataset.elementId;

    // Update element style, clearing conflicting positioning
    if (prop === 'x') {
        el.style.left = value + 'px';
        el.style.right = 'auto';
    } else if (prop === 'y') {
        el.style.top = value + 'px';
        el.style.bottom = 'auto';
    } else if (prop === 'width') {
        el.style.width = value + 'px';
    } else if (prop === 'height') {
        el.style.height = value + 'px';
    }

    // Save to state
    if (!state.elementPositions[id]) {
        state.elementPositions[id] = {};
    }
    state.elementPositions[id][prop] = value;

    // Update overlay
    if (iframe) {
        createSelectionOverlay(el, iframe);
    }
}

function moveElement(el, dx, dy, iframeWin) {
    const id = getElementId(el);

    // If first move, convert to left/top positioning
    if (!el.style.left || el.style.left === 'auto') {
        const elRect = el.getBoundingClientRect();
        const iframeDoc = iframeWin.document;
        const offsetParent = el.offsetParent || iframeDoc.body;
        const parentRect = offsetParent.getBoundingClientRect();

        const currentLeft = elRect.left - parentRect.left;
        const currentTop = elRect.top - parentRect.top;

        el.style.left = currentLeft + 'px';
        el.style.top = currentTop + 'px';
        el.style.right = 'auto';
        el.style.bottom = 'auto';
    }

    const newX = parseFloat(el.style.left) + dx;
    const newY = parseFloat(el.style.top) + dy;

    el.style.left = newX + 'px';
    el.style.top = newY + 'px';

    // Save to state
    if (!state.elementPositions[id]) {
        state.elementPositions[id] = {};
    }
    state.elementPositions[id].x = newX;
    state.elementPositions[id].y = newY;
}

// ============================================================================
// EXPORT
// ============================================================================
function exportConfig() {
    const size = PAGE_SIZES[state.pageSize];
    const config = {
        exportedAt: new Date().toISOString(),
        pageSize: {
            ratio: state.pageSize,
            width: size.width,
            height: size.height,
        },
        style: state.currentStyle,
        theme: state.currentTheme,
        masterConfig: state.masterConfig,
        elementPositions: state.elementPositions,
        layoutOverrides: state.layoutOverrides,
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'layout-master-config.json';
    a.click();
    URL.revokeObjectURL(url);
}

// ============================================================================
// VISUAL EDITING - RESIZE HANDLES & ROTATION
// ============================================================================

function createSelectionOverlay(el, iframe) {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return;

    // Remove existing overlay
    removeSelectionOverlay(iframeDoc);

    const elRect = el.getBoundingClientRect();
    const rotation = state.elementPositions[getElementId(el)]?.rotation || 0;

    // Get element's position relative to its offset parent
    const offsetParent = el.offsetParent || iframeDoc.body;
    const parentRect = offsetParent.getBoundingClientRect();
    const left = elRect.left - parentRect.left;
    const top = elRect.top - parentRect.top;

    // Create overlay container
    const overlay = iframeDoc.createElement('div');
    overlay.id = 'selection-overlay';
    overlay.style.cssText = `
        position: absolute;
        left: ${left}px;
        top: ${top}px;
        width: ${elRect.width}px;
        height: ${elRect.height}px;
        pointer-events: none;
        z-index: 9999;
        transform: rotate(${rotation}deg);
        transform-origin: center center;
    `;

    // Selection border
    const border = iframeDoc.createElement('div');
    border.style.cssText = `
        position: absolute;
        inset: 0;
        border: 2px solid #3B82F6;
        pointer-events: none;
    `;
    overlay.appendChild(border);

    // Create 8 resize handles
    const handles = [
        { pos: 'nw', cursor: 'nw-resize', x: 0, y: 0 },
        { pos: 'n', cursor: 'n-resize', x: 50, y: 0 },
        { pos: 'ne', cursor: 'ne-resize', x: 100, y: 0 },
        { pos: 'e', cursor: 'e-resize', x: 100, y: 50 },
        { pos: 'se', cursor: 'se-resize', x: 100, y: 100 },
        { pos: 's', cursor: 's-resize', x: 50, y: 100 },
        { pos: 'sw', cursor: 'sw-resize', x: 0, y: 100 },
        { pos: 'w', cursor: 'w-resize', x: 0, y: 50 },
    ];

    handles.forEach(h => {
        const handle = iframeDoc.createElement('div');
        handle.className = 'resize-handle';
        handle.dataset.handle = h.pos;
        handle.style.cssText = `
            position: absolute;
            width: ${HANDLE_SIZE}px;
            height: ${HANDLE_SIZE}px;
            background: white;
            border: 2px solid #3B82F6;
            cursor: ${h.cursor};
            pointer-events: auto;
            left: calc(${h.x}% - ${HANDLE_SIZE/2}px);
            top: calc(${h.y}% - ${HANDLE_SIZE/2}px);
        `;
        overlay.appendChild(handle);
        setupResizeHandle(handle, el, h.pos, iframe);
    });

    // Rotation handle
    const rotHandle = iframeDoc.createElement('div');
    rotHandle.className = 'rotation-handle';
    rotHandle.style.cssText = `
        position: absolute;
        width: 12px;
        height: 12px;
        background: #10B981;
        border: 2px solid white;
        border-radius: 50%;
        cursor: grab;
        pointer-events: auto;
        left: calc(50% - 6px);
        top: -${ROTATION_HANDLE_OFFSET}px;
    `;
    overlay.appendChild(rotHandle);
    setupRotationHandle(rotHandle, el, iframe);

    // Rotation line
    const rotLine = iframeDoc.createElement('div');
    rotLine.style.cssText = `
        position: absolute;
        width: 1px;
        height: ${ROTATION_HANDLE_OFFSET - 6}px;
        background: #10B981;
        left: 50%;
        top: -${ROTATION_HANDLE_OFFSET - 6}px;
    `;
    overlay.appendChild(rotLine);

    iframeDoc.body.appendChild(overlay);
}

function removeSelectionOverlay(iframeDoc) {
    const existing = iframeDoc.getElementById('selection-overlay');
    if (existing) existing.remove();
}

function setupResizeHandle(handle, el, position, iframe) {
    const iframeDoc = iframe.contentDocument;
    let startX, startY, startWidth, startHeight, startLeft, startTop;

    handle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Save state for undo
        saveState();

        const rect = el.getBoundingClientRect();
        startX = e.clientX;
        startY = e.clientY;
        startWidth = rect.width;
        startHeight = rect.height;
        startLeft = parseFloat(el.style.left) || rect.left;
        startTop = parseFloat(el.style.top) || rect.top;

        const onMouseMove = (e) => {
            let dx = e.clientX - startX;
            let dy = e.clientY - startY;

            // Snap to grid
            if (state.snapToGrid) {
                dx = Math.round(dx / GRID_SIZE) * GRID_SIZE;
                dy = Math.round(dy / GRID_SIZE) * GRID_SIZE;
            }

            let newWidth = startWidth;
            let newHeight = startHeight;
            let newLeft = startLeft;
            let newTop = startTop;

            // Calculate new dimensions based on handle position
            if (position.includes('e')) {
                newWidth = Math.max(20, startWidth + dx);
            }
            if (position.includes('w')) {
                newWidth = Math.max(20, startWidth - dx);
                newLeft = startLeft + dx;
            }
            if (position.includes('s')) {
                newHeight = Math.max(20, startHeight + dy);
            }
            if (position.includes('n')) {
                newHeight = Math.max(20, startHeight - dy);
                newTop = startTop + dy;
            }

            // Apply to element
            el.style.width = newWidth + 'px';
            el.style.height = newHeight + 'px';
            el.style.left = newLeft + 'px';
            el.style.top = newTop + 'px';
            el.style.right = 'auto';
            el.style.bottom = 'auto';

            // Update overlay
            const overlay = iframeDoc.getElementById('selection-overlay');
            if (overlay) {
                overlay.style.width = newWidth + 'px';
                overlay.style.height = newHeight + 'px';
                overlay.style.left = newLeft + 'px';
                overlay.style.top = newTop + 'px';
            }

            updateInspectorPosition(el);
        };

        const onMouseUp = () => {
            iframeDoc.removeEventListener('mousemove', onMouseMove);
            iframeDoc.removeEventListener('mouseup', onMouseUp);

            // Save to state
            const id = getElementId(el);
            const rect = el.getBoundingClientRect();
            if (!state.elementPositions[id]) state.elementPositions[id] = {};
            state.elementPositions[id].x = parseFloat(el.style.left);
            state.elementPositions[id].y = parseFloat(el.style.top);
            state.elementPositions[id].width = rect.width;
            state.elementPositions[id].height = rect.height;

            updateInspector(el, iframe);
        };

        iframeDoc.addEventListener('mousemove', onMouseMove);
        iframeDoc.addEventListener('mouseup', onMouseUp);
    });
}

function setupRotationHandle(handle, el, iframe) {
    const iframeDoc = iframe.contentDocument;
    let centerX, centerY;

    handle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Save state for undo
        saveState();

        handle.style.cursor = 'grabbing';

        const rect = el.getBoundingClientRect();
        centerX = rect.left + rect.width / 2;
        centerY = rect.top + rect.height / 2;

        const onMouseMove = (e) => {
            const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
            let rotation = (angle * 180 / Math.PI) + 90;

            // Snap to 15 degree increments if holding shift
            if (e.shiftKey) {
                rotation = Math.round(rotation / 15) * 15;
            }

            // Apply rotation
            el.style.transform = `rotate(${rotation}deg)`;
            el.style.transformOrigin = 'center center';

            // Update overlay
            const overlay = iframeDoc.getElementById('selection-overlay');
            if (overlay) {
                overlay.style.transform = `rotate(${rotation}deg)`;
            }
        };

        const onMouseUp = () => {
            handle.style.cursor = 'grab';
            iframeDoc.removeEventListener('mousemove', onMouseMove);
            iframeDoc.removeEventListener('mouseup', onMouseUp);

            // Save rotation to state
            const id = getElementId(el);
            const transform = el.style.transform;
            const match = transform.match(/rotate\(([^)]+)deg\)/);
            if (match) {
                if (!state.elementPositions[id]) state.elementPositions[id] = {};
                state.elementPositions[id].rotation = parseFloat(match[1]);
            }

            updateInspector(el, iframe);
        };

        iframeDoc.addEventListener('mousemove', onMouseMove);
        iframeDoc.addEventListener('mouseup', onMouseUp);
    });
}

// ============================================================================
// VISUAL EDITING - GRID OVERLAY
// ============================================================================

function toggleGrid(show) {
    state.showGrid = show;
    const iframe = document.getElementById('preview-frame');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return;

    let grid = iframeDoc.getElementById('grid-overlay');

    if (show) {
        if (!grid) {
            grid = iframeDoc.createElement('div');
            grid.id = 'grid-overlay';
            const size = PAGE_SIZES[state.pageSize];
            grid.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: ${size.width}px;
                height: ${size.height}px;
                pointer-events: none;
                z-index: 9998;
                background-image:
                    linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
                background-size: ${GRID_SIZE}px ${GRID_SIZE}px;
            `;
            iframeDoc.body.appendChild(grid);
        }
    } else {
        if (grid) grid.remove();
    }
}

// ============================================================================
// VISUAL EDITING - ALIGNMENT & DISTRIBUTION
// ============================================================================

function alignElements(alignment) {
    const iframe = document.getElementById('preview-frame');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return;

    const selected = iframeDoc.querySelector('.selected-element');
    if (!selected) return;

    const size = PAGE_SIZES[state.pageSize];
    const rect = selected.getBoundingClientRect();

    let newX = parseFloat(selected.style.left) || rect.left;
    let newY = parseFloat(selected.style.top) || rect.top;

    switch (alignment) {
        case 'left':
            newX = 0;
            break;
        case 'center-h':
            newX = (size.width - rect.width) / 2;
            break;
        case 'right':
            newX = size.width - rect.width;
            break;
        case 'top':
            newY = 0;
            break;
        case 'center-v':
            newY = (size.height - rect.height) / 2;
            break;
        case 'bottom':
            newY = size.height - rect.height;
            break;
    }

    // Apply position
    selected.style.left = newX + 'px';
    selected.style.top = newY + 'px';
    selected.style.right = 'auto';
    selected.style.bottom = 'auto';

    // Save to state
    const id = getElementId(selected);
    if (!state.elementPositions[id]) state.elementPositions[id] = {};
    state.elementPositions[id].x = newX;
    state.elementPositions[id].y = newY;

    // Update overlay
    createSelectionOverlay(selected, iframe);
    updateInspector(selected, iframe);
}

function distributeElements(direction) {
    // For multi-select distribution (simplified - just centers single element)
    const iframe = document.getElementById('preview-frame');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return;

    const selected = iframeDoc.querySelector('.selected-element');
    if (!selected) return;

    const size = PAGE_SIZES[state.pageSize];
    const rect = selected.getBoundingClientRect();

    if (direction === 'horizontal') {
        alignElements('center-h');
    } else {
        alignElements('center-v');
    }
}

// ============================================================================
// VISUAL EDITING - EVENT BINDING
// ============================================================================

function bindVisualEditingEvents() {
    // Undo/Redo buttons
    document.getElementById('undo-btn')?.addEventListener('click', undo);
    document.getElementById('redo-btn')?.addEventListener('click', redo);

    // Keyboard shortcuts for undo/redo
    document.addEventListener('keydown', (e) => {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const modifier = isMac ? e.metaKey : e.ctrlKey;

        if (modifier && e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            undo();
        } else if (modifier && e.key === 'z' && e.shiftKey) {
            e.preventDefault();
            redo();
        } else if (modifier && e.key === 'y') {
            e.preventDefault();
            redo();
        }
    });

    // Grid toggle
    document.getElementById('show-grid')?.addEventListener('change', (e) => {
        toggleGrid(e.target.checked);
    });

    // Snap toggle
    document.getElementById('snap-to-grid')?.addEventListener('change', (e) => {
        state.snapToGrid = e.target.checked;
    });

    // Alignment buttons
    document.querySelectorAll('[data-align]').forEach(btn => {
        btn.addEventListener('click', () => {
            saveState();
            alignElements(btn.dataset.align);
        });
    });

    // Distribution buttons
    document.querySelectorAll('[data-distribute]').forEach(btn => {
        btn.addEventListener('click', () => {
            saveState();
            distributeElements(btn.dataset.distribute);
        });
    });

    // Shape style presets
    document.querySelectorAll('.style-preset').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.style-preset').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyShapeStyle(btn.dataset.style);
        });
    });

    // Fill color
    document.getElementById('fill-color')?.addEventListener('input', (e) => {
        applyFillColor(e.target.value);
    });

    // Border color
    document.getElementById('border-color')?.addEventListener('input', (e) => {
        applyBorderColor(e.target.value);
    });

    // Font toolbar controls
    document.getElementById('toolbar-font')?.addEventListener('change', (e) => {
        applyToolbarFont(e.target.value);
    });

    document.getElementById('toolbar-font-size')?.addEventListener('change', (e) => {
        applyToolbarFontSize(parseFloat(e.target.value));
    });

    document.getElementById('font-color')?.addEventListener('input', (e) => {
        applyFontColor(e.target.value);
    });

    // Font format buttons (bold, italic, underline)
    document.querySelectorAll('.font-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            applyFontFormat(btn.dataset.format, btn.classList.contains('active'));
        });
    });

    // Initialize undo/redo button states
    updateUndoRedoButtons();
}

// ============================================================================
// TOOLBAR STYLE FUNCTIONS
// ============================================================================

function applyShapeStyle(style) {
    const iframe = document.getElementById('preview-frame');
    const iframeDoc = iframe?.contentDocument;
    const selected = iframeDoc?.querySelector('.selected-element');
    if (!selected) return;

    saveState();

    const fillColor = document.getElementById('fill-color')?.value || '#3B82F6';
    const borderColor = document.getElementById('border-color')?.value || '#1D4ED8';

    switch (style) {
        case 'solid':
            selected.style.background = fillColor;
            selected.style.border = 'none';
            break;
        case 'outline':
            selected.style.background = 'transparent';
            selected.style.border = `2px solid ${borderColor}`;
            break;
        case 'subtle':
            selected.style.background = fillColor + '33'; // 20% opacity
            selected.style.border = `1px solid ${fillColor}80`;
            break;
        case 'gradient':
            selected.style.background = `linear-gradient(135deg, ${fillColor}, ${borderColor})`;
            selected.style.border = 'none';
            break;
    }

    saveElementStyle(selected, { shapeStyle: style });
}

function applyFillColor(color) {
    const iframe = document.getElementById('preview-frame');
    const iframeDoc = iframe?.contentDocument;
    const selected = iframeDoc?.querySelector('.selected-element');
    if (!selected) return;

    saveState();
    selected.style.backgroundColor = color;
    saveElementStyle(selected, { fillColor: color });
}

function applyBorderColor(color) {
    const iframe = document.getElementById('preview-frame');
    const iframeDoc = iframe?.contentDocument;
    const selected = iframeDoc?.querySelector('.selected-element');
    if (!selected) return;

    saveState();
    selected.style.borderColor = color;
    saveElementStyle(selected, { borderColor: color });
}

function applyToolbarFont(fontFamily) {
    const iframe = document.getElementById('preview-frame');
    const iframeDoc = iframe?.contentDocument;
    const selected = iframeDoc?.querySelector('.selected-element');
    if (!selected) return;

    saveState();
    selected.style.fontFamily = fontFamily;
    saveElementStyle(selected, { fontFamily: fontFamily });
    createSelectionOverlay(selected, iframe);
}

function applyToolbarFontSize(size) {
    const iframe = document.getElementById('preview-frame');
    const iframeDoc = iframe?.contentDocument;
    const selected = iframeDoc?.querySelector('.selected-element');
    if (!selected) return;

    saveState();
    selected.style.fontSize = size + 'px';
    saveElementStyle(selected, { fontSize: size });
    createSelectionOverlay(selected, iframe);
}

function applyFontColor(color) {
    const iframe = document.getElementById('preview-frame');
    const iframeDoc = iframe?.contentDocument;
    const selected = iframeDoc?.querySelector('.selected-element');
    if (!selected) return;

    saveState();
    selected.style.color = color;
    saveElementStyle(selected, { fontColor: color });
}

function applyFontFormat(format, active) {
    const iframe = document.getElementById('preview-frame');
    const iframeDoc = iframe?.contentDocument;
    const selected = iframeDoc?.querySelector('.selected-element');
    if (!selected) return;

    saveState();

    switch (format) {
        case 'bold':
            selected.style.fontWeight = active ? 'bold' : 'normal';
            break;
        case 'italic':
            selected.style.fontStyle = active ? 'italic' : 'normal';
            break;
        case 'underline':
            selected.style.textDecoration = active ? 'underline' : 'none';
            break;
    }

    saveElementStyle(selected, { [format]: active });
}

function saveElementStyle(el, styles) {
    const id = getElementId(el);
    if (!state.elementPositions[id]) state.elementPositions[id] = {};
    Object.assign(state.elementPositions[id], styles);
}

function updateToolbarFromElement(el, iframe) {
    if (!el) return;

    const iframeWin = iframe.contentWindow;
    const computed = iframeWin.getComputedStyle(el);

    // Update font toolbar
    const fontFamily = computed.fontFamily.split(',')[0].replace(/['"]/g, '').trim();
    const fontSize = parseInt(computed.fontSize);

    const toolbarFont = document.getElementById('toolbar-font');
    const toolbarFontSize = document.getElementById('toolbar-font-size');
    if (toolbarFont) toolbarFont.value = fontFamily;
    if (toolbarFontSize) toolbarFontSize.value = fontSize;

    // Update font format buttons
    document.querySelector('[data-format="bold"]')?.classList.toggle('active',
        computed.fontWeight === 'bold' || parseInt(computed.fontWeight) >= 700);
    document.querySelector('[data-format="italic"]')?.classList.toggle('active',
        computed.fontStyle === 'italic');
    document.querySelector('[data-format="underline"]')?.classList.toggle('active',
        computed.textDecoration.includes('underline'));

    // Update color pickers
    const fontColor = document.getElementById('font-color');
    if (fontColor) fontColor.value = rgbToHex(computed.color);

    const fillColor = document.getElementById('fill-color');
    if (fillColor && computed.backgroundColor !== 'transparent' && computed.backgroundColor !== 'rgba(0, 0, 0, 0)') {
        fillColor.value = rgbToHex(computed.backgroundColor);
    }

    // Show shape presets if it's a shape element
    showShapePresets(el, iframe);
}

// ============================================================================
// SHAPE PRESETS UI
// ============================================================================

function showShapePresets(el, iframe) {
    const presetsGroup = document.getElementById('shape-presets-group');
    const presetsTitle = document.getElementById('shape-presets-title');
    const presetsContainer = document.getElementById('shape-presets-container');

    if (!presetsGroup || !presetsTitle || !presetsContainer) return;

    // Check if it's a shape element
    const shapeId = el.dataset.masterShape;
    if (!shapeId || !SHAPE_PRESETS[shapeId]) {
        presetsGroup.classList.add('hidden');
        return;
    }

    const presetConfig = SHAPE_PRESETS[shapeId];
    presetsTitle.textContent = presetConfig.title;

    // Generate preset buttons
    presetsContainer.innerHTML = presetConfig.presets.map((preset, idx) => `
        <button class="shape-preset-btn px-2 py-1 text-xs rounded bg-gray-700 hover:bg-gray-600 text-gray-300"
                data-shape-preset="${idx}" title="${preset.name}">
            ${preset.name}
        </button>
    `).join('');

    // Bind click events
    presetsContainer.querySelectorAll('.shape-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const presetIdx = parseInt(btn.dataset.shapePreset);
            applyShapePreset(el, shapeId, presetIdx, iframe);
        });
    });

    presetsGroup.classList.remove('hidden');
}

function hideShapePresets() {
    const presetsGroup = document.getElementById('shape-presets-group');
    if (presetsGroup) {
        presetsGroup.classList.add('hidden');
    }
}

function applyShapePreset(el, shapeId, presetIdx, iframe) {
    const presetConfig = SHAPE_PRESETS[shapeId];
    if (!presetConfig || !presetConfig.presets[presetIdx]) return;

    saveState();

    const preset = presetConfig.presets[presetIdx];
    const style = preset.style;

    // Apply each style property
    for (const [prop, value] of Object.entries(style)) {
        // Convert camelCase to kebab-case for CSS properties
        el.style[prop] = value;
    }

    // Save to state
    const id = getElementId(el);
    if (!state.elementPositions[id]) state.elementPositions[id] = {};
    state.elementPositions[id].presetStyle = style;

    // Update overlay
    createSelectionOverlay(el, iframe);
    updateInspector(el, iframe);
}

function rgbToHex(rgb) {
    if (rgb.startsWith('#')) return rgb;
    const match = rgb.match(/\d+/g);
    if (!match || match.length < 3) return '#000000';
    return '#' + match.slice(0, 3).map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
}

// Call this in DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Existing init...
    setTimeout(() => {
        bindVisualEditingEvents();
    }, 100);
});
