/**
 * Main Entry Point - ES6 Modules
 * Imports modularized code and exposes to global scope for backward compatibility
 */

// Import core modules
import { state } from './core/state.js';
import { PAGE_SIZES, GRID_SIZE, SNAP_THRESHOLD, HANDLE_SIZE, ROTATION_HANDLE_OFFSET } from './core/constants.js';
import { history, saveState, undo, redo, updateUndoRedoButtons, setUpdateMainPreview } from './core/history.js';
import { SHAPE_PRESETS } from './features/shapes.js';

// Expose to global scope for backward compatibility with app.js
window.state = state;
window.PAGE_SIZES = PAGE_SIZES;
window.GRID_SIZE = GRID_SIZE;
window.SNAP_THRESHOLD = SNAP_THRESHOLD;
window.HANDLE_SIZE = HANDLE_SIZE;
window.ROTATION_HANDLE_OFFSET = ROTATION_HANDLE_OFFSET;
window.SHAPE_PRESETS = SHAPE_PRESETS;
window.history = history;
window.saveState = saveState;
window.undo = undo;
window.redo = redo;
window.updateUndoRedoButtons = updateUndoRedoButtons;

console.log('[main.js] ES6 modules loaded, backward compatibility enabled');

// Inject updateMainPreview reference once app.js is loaded
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.updateMainPreview) {
            setUpdateMainPreview(window.updateMainPreview);
            console.log('[main.js] updateMainPreview injected into history module');
        }
    }, 100);
});
