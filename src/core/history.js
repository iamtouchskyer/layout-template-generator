/**
 * Undo/Redo History Management
 */

import { state } from './state.js';

// Will be injected from main.js
let updateMainPreview = null;

export function setUpdateMainPreview(fn) {
    updateMainPreview = fn;
}

export const history = {
    undoStack: [],
    redoStack: [],
    maxSize: 50,
};

export function saveState() {
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

export function undo() {
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

export function redo() {
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

export function updateUndoRedoButtons() {
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
