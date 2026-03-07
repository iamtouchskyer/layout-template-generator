// Main Application Entry Point

/**
 * Toggle light/dark theme
 */
function toggleAppTheme() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const next = isLight ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next === 'dark' ? '' : next);
    if (next === 'dark') document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('app-theme', next);
    const btn = document.getElementById('btn-theme-toggle');
    if (btn) btn.textContent = next === 'light' ? '\u2600' : '\u263E';

    if (state.pageType === 'content-smartart') {
        if (typeof renderSmartartColorSelector === 'function') renderSmartartColorSelector();
        if (typeof renderSmartartTypeSelector === 'function') renderSmartartTypeSelector();
    }
}

function _initAppTheme() {
    const saved = localStorage.getItem('app-theme') || 'dark';
    if (saved === 'light') document.documentElement.setAttribute('data-theme', 'light');
    const btn = document.getElementById('btn-theme-toggle');
    if (btn) btn.textContent = saved === 'light' ? '\u2600' : '\u263E';
}

/**
 * Initialize the application after config is loaded
 */
function init() {
    _initAppTheme();
    if (typeof applySiteI18n === 'function') {
        applySiteI18n();
    }
    initAspectRatioSelector();
    renderPlaceholderList();
    renderShapesList();
    renderContentAreasConfig();  // L1 content areas (title/footer config)
    setZoom(state.zoom);
    updatePageType(state.pageType, { recordHistory: false });
    if (typeof updateHistoryButtons === 'function') updateHistoryButtons();
}

/**
 * Application startup
 */
async function startApp() {
    try {
        // Load configuration from JSON
        await loadConfig();

        // Make derived configs globally available
        window.SLIDE_CONFIG = SLIDE_CONFIG;
        window.ASPECT_RATIOS = ASPECT_RATIOS;
        window.CURRENT_ASPECT_RATIO = CURRENT_ASPECT_RATIO;
        window.SHAPE_PRESETS = SHAPE_PRESETS;
        window.GRID_LAYOUTS = GRID_LAYOUTS;
        window.ZONE_CONTENT_TYPES = ZONE_CONTENT_TYPES;
        window.PLACEHOLDERS_CONFIG = PLACEHOLDERS_CONFIG;
        window.CONTENT_AREAS = CONTENT_AREAS;
        window.CONFIG = CONFIG;

        // Initialize the app
        init();
    } catch (error) {
        console.error('Failed to start app:', error);
        document.body.innerHTML = `<div style="color: red; padding: 20px;">
            Failed to load configuration: ${error.message}<br>
            Please check that the server is running and config/slide-master.json exists.
        </div>`;
    }
}

// Test Menu Functions
function _testAddAllCovers() {
    Object.keys(COVER_LAYOUTS).forEach(layout => {
        addPageByModel('cover', 'cover', layout);
    });
}

function _testAddAllDividers() {
    Object.keys(DIVIDER_LAYOUTS).forEach(layout => {
        addPageByModel('divider', 'divider', layout);
    });
}

function _testAddAllGrids() {
    Object.keys(GRID_LAYOUTS).forEach(layout => {
        addPageByModel('content', 'grid', layout);
    });
}

function _testAddAllSmartArt() {
    Object.keys(SMARTART_TYPES).forEach(typeId => {
        const page = addPageByModel('content', 'smartart', null);
        if (page) page.data.smartartType = typeId;
    });
}

// ============= AI Chat Demo =============

function toggleAIChat() {
    document.getElementById('ai-chat-widget').classList.toggle('open');
    const input = document.getElementById('ai-chat-input');
    if (input) setTimeout(() => input.focus(), 100);
}

async function sendAIChat() {
    const input = document.getElementById('ai-chat-input');
    const msg = input.value.trim();
    if (!msg) return;
    input.value = '';

    const container = document.getElementById('ai-chat-messages');
    container.insertAdjacentHTML('beforeend',
        `<div class="ai-msg ai-msg-user">${_escHtml(msg)}</div>`);
    container.insertAdjacentHTML('beforeend',
        `<div class="ai-msg ai-msg-loading" id="ai-loading">thinking...</div>`);
    container.scrollTop = container.scrollHeight;

    try {
        const resp = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg })
        });
        const data = await resp.json();
        const loading = document.getElementById('ai-loading');
        if (loading) loading.remove();

        if (data.ok && data.result) {
            _applyAIResult(data.result);
            container.insertAdjacentHTML('beforeend',
                `<div class="ai-msg ai-msg-assistant">${data.result.smartartType} (${data.result.count} items) applied!</div>`);
        } else {
            container.insertAdjacentHTML('beforeend',
                `<div class="ai-msg ai-msg-error">Parse error: ${_escHtml(data.raw || data.error)}</div>`);
        }
    } catch (e) {
        const loading = document.getElementById('ai-loading');
        if (loading) loading.remove();
        container.insertAdjacentHTML('beforeend',
            `<div class="ai-msg ai-msg-error">API error: ${_escHtml(e.message)}. Is demo_chat.py running?</div>`);
    }
    container.scrollTop = container.scrollHeight;
}

function _applyAIResult(result) {
    // 1. Switch to smartart page type if needed
    if (state.pageType !== 'content-smartart') {
        updatePageType('content-smartart', { recordHistory: false });
    }

    // 2. Select SmartArt type
    if (result.smartartType && SMARTART_TYPES[result.smartartType]) {
        selectSmartartType(result.smartartType);
    }

    // 3. Clamp count to type's supported range
    const schema = window.SmartArt?.dataSchema?.get?.(result.smartartType);
    const maxCount = schema?.itemCount || 6;
    const count = Math.min(result.count || maxCount, maxCount);

    // 4. Set count
    selectSmartartCount(count);

    // 5. Apply items data + desc (clamped to count)
    if (Array.isArray(result.items) && result.items.length > 0) {
        _mutateSmartart((draft) => {
            const items = result.items.slice(0, count).map(item => ({
                text: item.text || '',
                children: Array.isArray(item.children)
                    ? item.children.map(c => ({ text: c.text || '', children: [] }))
                    : []
            }));
            const typeId = draft.smartartType;
            const byType = _saClone(draft.smartartItemsByType || {});
            byType[typeId] = _saClone(items);
            draft.smartartItems = items;
            draft.smartartItemsByType = byType;
            if (result.desc) {
                draft.smartartDesc = {
                    title: result.desc.title || '',
                    body: result.desc.body || '',
                    bullets: Array.isArray(result.desc.bullets) ? result.desc.bullets : [],
                };
            }
        });
    }

    // 5. Apply color scheme
    if (result.colorScheme) {
        selectSmartartColorScheme(result.colorScheme);
    }

    // 6. Re-render
    if (typeof renderSmartartTextEditor === 'function') renderSmartartTextEditor();
}

function _escHtml(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
}

// Start the application
startApp();
