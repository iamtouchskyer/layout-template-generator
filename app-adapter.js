/**
 * Adapter for new HTML structure
 * Overrides updateInspector to work with element-inspector-section
 */

// Override updateInspector to use new HTML structure
const originalUpdateInspector = window.updateInspector;

window.updateInspector = function(el, iframe) {
    if (!el) {
        // Hide element inspector when no element selected
        const inspectorSection = document.getElementById('element-inspector-section');
        if (inspectorSection) {
            inspectorSection.classList.add('hidden');
        }
        return;
    }

    // Show element inspector
    const inspectorSection = document.getElementById('element-inspector-section');
    const inspectorContent = document.getElementById('element-inspector-content');

    if (!inspectorSection || !inspectorContent) {
        console.warn('Element inspector sections not found');
        return;
    }

    inspectorSection.classList.remove('hidden');

    // Get element info
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

    // Get computed style
    const iframeWin = iframe.contentWindow;
    const computed = iframeWin.getComputedStyle(el);

    // Get current position
    let posX, posY;
    if (el.style.left) {
        posX = Math.round(parseFloat(el.style.left));
        posY = Math.round(parseFloat(el.style.top));
    } else {
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

    // Get font properties
    const fontSize = parseInt(computed.fontSize) || 14;
    const fontFamily = computed.fontFamily.split(',')[0].replace(/['"]/g, '').trim();
    const isTextElement = !isShape;

    // Build inspector HTML
    inspectorContent.innerHTML = `
        <div style="margin-bottom: 16px;">
            <div style="font-weight: 600; margin-bottom: 4px;">${id}</div>
            <div style="font-size: 12px; color: var(--text-secondary);">${type} ${category}</div>
        </div>

        <div style="margin-bottom: 16px;">
            <div style="font-size: 12px; font-weight: 500; margin-bottom: 8px; color: var(--text-secondary);">Position (px)</div>
            <div class="property-row">
                <div class="property-field">
                    <label>X</label>
                    <input type="number" id="inspector-pos-x" value="${posX}" data-element-id="${id}" data-prop="x">
                </div>
                <div class="property-field">
                    <label>Y</label>
                    <input type="number" id="inspector-pos-y" value="${posY}" data-element-id="${id}" data-prop="y">
                </div>
            </div>
        </div>

        <div style="margin-bottom: 16px;">
            <div style="font-size: 12px; font-weight: 500; margin-bottom: 8px; color: var(--text-secondary);">Size (px)</div>
            <div class="property-row">
                <div class="property-field">
                    <label>W</label>
                    <input type="number" id="inspector-width" value="${width}" data-element-id="${id}" data-prop="width">
                </div>
                <div class="property-field">
                    <label>H</label>
                    <input type="number" id="inspector-height" value="${height}" data-element-id="${id}" data-prop="height">
                </div>
            </div>
        </div>

        <div style="margin-bottom: 16px;">
            <div style="font-size: 12px; font-weight: 500; margin-bottom: 8px; color: var(--text-secondary);">Rotation (°)</div>
            <div style="display: flex; gap: 8px; align-items: center;">
                <input type="range" id="inspector-rotation" value="${rotation}" min="-180" max="180"
                    style="flex: 1;"
                    data-element-id="${id}" data-prop="rotation">
                <input type="number" id="inspector-rotation-num" value="${rotation}"
                    style="width: 60px;"
                    data-element-id="${id}" data-prop="rotation">
            </div>
        </div>

        ${isTextElement ? `
        <div style="margin-bottom: 16px;">
            <div style="font-size: 12px; font-weight: 500; margin-bottom: 8px; color: var(--text-secondary);">Font</div>
            <select id="inspector-font-family" style="width: 100%; margin-bottom: 8px;"
                data-element-id="${id}" data-prop="fontFamily">
                <option value="Inter" ${fontFamily === 'Inter' ? 'selected' : ''}>Inter</option>
                <option value="Open Sans" ${fontFamily === 'Open Sans' ? 'selected' : ''}>Open Sans</option>
                <option value="Roboto" ${fontFamily === 'Roboto' ? 'selected' : ''}>Roboto</option>
                <option value="Lato" ${fontFamily === 'Lato' ? 'selected' : ''}>Lato</option>
                <option value="Montserrat" ${fontFamily === 'Montserrat' ? 'selected' : ''}>Montserrat</option>
                <option value="Playfair Display" ${fontFamily === 'Playfair Display' ? 'selected' : ''}>Playfair Display</option>
            </select>
            <div class="property-field">
                <label>Size</label>
                <input type="number" id="inspector-font-size" value="${fontSize}" min="8" max="200"
                    data-element-id="${id}" data-prop="fontSize">
            </div>
        </div>
        ` : ''}

        <button id="inspector-reset-btn"
            style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--border-primary); background: var(--bg-secondary); color: var(--text-primary); cursor: pointer; font-size: 13px; font-weight: 500;">
            Reset Position
        </button>

        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border-primary);">
            <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 8px;">Tip: Use arrow keys to move (Shift+Arrow = 10px)</div>
            <code style="font-size: 11px; color: var(--text-tertiary); display: block; background: var(--bg-tertiary); padding: 8px; border-radius: 4px; word-break: break-all;">
                data-${isMaster ? 'master' : 'layout'}-${isShape ? 'shape' : isDynamic ? 'dynamic' : 'placeholder'}="${id}"
            </code>
        </div>
    `;

    // Bind events (reuse from original function)
    if (window.bindInspectorInputs) {
        window.bindInspectorInputs(el, iframe);
    }
};

// Override deselectElement to hide inspector
const originalDeselectElement = window.deselectElement;

window.deselectElement = function(iframeDoc) {
    if (originalDeselectElement) {
        originalDeselectElement(iframeDoc);
    }

    // Hide element inspector
    const inspectorSection = document.getElementById('element-inspector-section');
    if (inspectorSection) {
        inspectorSection.classList.add('hidden');
    }
};

console.log('[Adapter] Loaded for new HTML structure');
