// SmartArt Control and Editor Functions

/**
 * Render SmartArt type selector with category tabs
 */
function renderSmartartTypeSelector() {
    const container = document.getElementById('smartart-type-selector');
    const currentType = SMARTART_TYPES[state.smartartType];
    const currentCat = currentType?.category || 'matrix';

    // Get types for current category
    const currentCatTypes = Object.entries(SMARTART_TYPES).filter(([_, t]) => t.category === currentCat);

    container.innerHTML = `
        <div class="smartart-cat-row">
            ${Object.entries(SMARTART_CATEGORIES).map(([catId, cat]) => {
                const types = Object.entries(SMARTART_TYPES).filter(([_, t]) => t.category === catId);
                if (types.length === 0) return '';
                return `
                    <button class="smartart-cat-btn ${currentCat === catId ? 'active' : ''}"
                            onclick="selectSmartartCategory('${catId}')" title="${cat.desc}">
                        <span class="cat-label">${cat.label}</span>
                    </button>
                `;
            }).join('')}
        </div>
        <div class="smartart-thumbnail-grid">
            ${currentCatTypes.map(([typeId, typeInfo]) => `
                <div class="smartart-thumbnail ${state.smartartType === typeId ? 'active' : ''}"
                     onclick="selectSmartartType('${typeId}')" title="${typeInfo.label}">
                    <img src="assets/smartart-refs/${typeInfo.ooxmlId}.png"
                         alt="${typeInfo.label}"
                         onerror="this.parentElement.innerHTML='<div class=\\'thumb-fallback\\'>${typeInfo.label}</div>'">
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Select SmartArt category
 */
function selectSmartartCategory(catId) {
    state.smartartCategory = catId;
    // Auto-select first type in this category
    const types = Object.entries(SMARTART_TYPES).filter(([_, t]) => t.category === catId);
    if (types.length > 0) {
        state.smartartType = types[0][0];
    }
    renderSmartartTypeSelector();
    renderSmartartColorSelector();
    render();
}

/**
 * Render SmartArt placements
 */
function renderSmartartPlacements() {
    const container = document.getElementById('smartart-placements');
    container.innerHTML = `<div class="placement-btns">
        ${Object.entries(SMARTART_PLACEMENTS).map(([id, p]) => `
            <button class="placement-btn ${state.smartartPlacement === id ? 'active' : ''}"
                    onclick="selectSmartartPlacement('${id}')" title="${p.desc}">${p.label}</button>
        `).join('')}
    </div>`;
}

/**
 * Select SmartArt type
 */
function selectSmartartType(typeId) {
    const oldType = state.smartartType;

    // Save current items to old type (if exists)
    if (oldType && state.smartartItems) {
        state.smartartItemsByType[oldType] = state.smartartItems;
    }

    // Switch to new type
    state.smartartType = typeId;
    state.smartartCategory = SMARTART_TYPES[typeId].category;

    // Load items for new type (or null to initialize from test data)
    state.smartartItems = state.smartartItemsByType[typeId] || null;

    renderSmartartTypeSelector();
    renderSmartartColorSelector();
    render();
}

/**
 * Select SmartArt placement
 */
function selectSmartartPlacement(placementId) {
    state.smartartPlacement = placementId;
    renderSmartartPlacements();
    render();
}

/**
 * Render SmartArt engine selector (legacy/next)
 */
function renderSmartartEngineSelector() {
    const container = document.getElementById('smartart-engine-selector');
    if (!container) return;

    const engines = [
        { id: 'next', label: 'Next' },
        { id: 'legacy', label: 'Legacy' },
    ];

    container.innerHTML = `<div class="placement-btns">
        ${engines.map(engine => `
            <button class="placement-btn ${state.smartartEngine === engine.id ? 'active' : ''}"
                    onclick="selectSmartartEngine('${engine.id}')"
                    title="${engine.id === 'next' ? '新引擎' : '回退引擎'}">
                ${engine.label}
            </button>
        `).join('')}
    </div>`;
}

/**
 * Select SmartArt engine and sync query param for reproducibility
 */
function selectSmartartEngine(engineId) {
    state.smartartEngine = engineId === 'legacy' ? 'legacy' : 'next';
    syncSmartartEngineQuery(state.smartartEngine);
    renderSmartartEngineSelector();
    render();
}

function syncSmartartEngineQuery(engineId) {
    try {
        const url = new URL(window.location.href);
        if (engineId === 'legacy') {
            url.searchParams.set('smartartEngine', 'legacy');
        } else {
            url.searchParams.delete('smartartEngine');
        }
        window.history.replaceState({}, '', url.toString());
    } catch (_) {
        // ignore query sync errors in unsupported environments
    }
}

/**
 * Render item count selector
 */
function renderSmartartCountSelector() {
    const container = document.getElementById('smartart-count-selector');
    if (!container) return;

    const counts = [3, 4, 5, 6];
    container.innerHTML = `<div class="count-btns">
        ${counts.map(count => `
            <button class="count-btn ${state.smartartItemCount === count ? 'active' : ''}"
                    onclick="selectSmartartCount(${count})" title="${count}个元素">
                <span class="count-num">${count}</span>
            </button>
        `).join('')}
    </div>`;
}

/**
 * Select item count
 */
function selectSmartartCount(count) {
    state.smartartItemCount = count;
    syncSmartartItemsToCount(count);
    renderSmartartCountSelector();
    render();
}

function syncSmartartItemsToCount(count) {
    const typeInfo = SMARTART_TYPES[state.smartartType];
    const category = typeInfo?.category || 'list';
    const testData = SMARTART_TEST_DATA[state.smartartType] || SMARTART_TEST_DATA[category] || SMARTART_TEST_DATA['list'] || [];

    if (!Array.isArray(state.smartartItems)) {
        state.smartartItems = JSON.parse(JSON.stringify(testData.slice(0, count)));
        state.smartartItemsByType[state.smartartType] = state.smartartItems;
        return;
    }

    if (state.smartartItems.length > count) {
        state.smartartItems = state.smartartItems.slice(0, count);
    } else if (state.smartartItems.length < count) {
        for (let i = state.smartartItems.length; i < count; i++) {
            const template = testData[i] || testData[testData.length - 1] || { text: `节点${i + 1}`, children: [] };
            state.smartartItems.push(JSON.parse(JSON.stringify(template)));
        }
    }

    state.smartartItemsByType[state.smartartType] = state.smartartItems;
}

/**
 * Generate mini SVG thumbnail for color scheme picker
 */
function generateColorSchemeThumbnail(smartartType, colors, outline = false) {
    const w = 44, h = 28;
    const c = colors || ['#888', '#AAA', '#CCC', '#DDD'];
    const stroke = outline ? `stroke="#999" stroke-width="1"` : '';
    const fill = (i) => outline ? '#FFF' : (c[i % c.length] || '#888');

    // Map smartartType to thumbnail shape
    switch (smartartType) {
        case 'matrix':
        case 'matrix-titled':
        case 'matrix-cycle':
            return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
                <rect x="1" y="1" width="20" height="12" rx="2" fill="${fill(0)}" ${stroke}/>
                <rect x="23" y="1" width="20" height="12" rx="2" fill="${fill(1)}" ${stroke}/>
                <rect x="1" y="15" width="20" height="12" rx="2" fill="${fill(2)}" ${stroke}/>
                <rect x="23" y="15" width="20" height="12" rx="2" fill="${fill(3)}" ${stroke}/>
                <rect x="15" y="9" width="14" height="10" rx="2" fill="#FFF" stroke="${c[0] || '#888'}" stroke-width="1"/>
            </svg>`;

        case 'cycle':
        case 'cycle-segmented': {
            const cx = w/2, cy = h/2, r = 11;
            return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
                <path d="M${cx},${cy} L${cx},${cy-r} A${r},${r} 0 0,1 ${cx+r},${cy} Z" fill="${fill(0)}" ${stroke}/>
                <path d="M${cx},${cy} L${cx+r},${cy} A${r},${r} 0 0,1 ${cx},${cy+r} Z" fill="${fill(1)}" ${stroke}/>
                <path d="M${cx},${cy} L${cx},${cy+r} A${r},${r} 0 0,1 ${cx-r},${cy} Z" fill="${fill(2)}" ${stroke}/>
                <path d="M${cx},${cy} L${cx-r},${cy} A${r},${r} 0 0,1 ${cx},${cy-r} Z" fill="${fill(3)}" ${stroke}/>
            </svg>`;
        }

        case 'chevron':
        case 'arrow-process':
        case 'descending-process':
            return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
                <polygon points="1,4 10,4 14,14 10,24 1,24 5,14" fill="${fill(0)}" ${stroke}/>
                <polygon points="15,4 24,4 28,14 24,24 15,24 19,14" fill="${fill(1)}" ${stroke}/>
                <polygon points="29,4 38,4 42,14 38,24 29,24 33,14" fill="${fill(2)}" ${stroke}/>
            </svg>`;

        case 'hierarchy':
            return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
                <rect x="15" y="1" width="14" height="8" rx="1" fill="${fill(0)}" ${stroke}/>
                <rect x="1" y="19" width="12" height="8" rx="1" fill="${fill(1)}" ${stroke}/>
                <rect x="16" y="19" width="12" height="8" rx="1" fill="${fill(2)}" ${stroke}/>
                <rect x="31" y="19" width="12" height="8" rx="1" fill="${fill(3)}" ${stroke}/>
                <line x1="22" y1="9" x2="22" y2="14" stroke="#999" stroke-width="1"/>
                <line x1="7" y1="14" x2="37" y2="14" stroke="#999" stroke-width="1"/>
                <line x1="7" y1="14" x2="7" y2="19" stroke="#999" stroke-width="1"/>
                <line x1="22" y1="14" x2="22" y2="19" stroke="#999" stroke-width="1"/>
                <line x1="37" y1="14" x2="37" y2="19" stroke="#999" stroke-width="1"/>
            </svg>`;

        case 'radial':
            return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
                <circle cx="22" cy="14" r="6" fill="${fill(0)}" ${stroke}/>
                <circle cx="8" cy="8" r="5" fill="${fill(1)}" ${stroke}/>
                <circle cx="36" cy="8" r="5" fill="${fill(2)}" ${stroke}/>
                <circle cx="8" cy="20" r="5" fill="${fill(3)}" ${stroke}/>
                <circle cx="36" cy="20" r="5" fill="${fill(4)}" ${stroke}/>
            </svg>`;

        case 'list':
        case 'list-vertical':
        case 'picture-accent':
        case 'picture-captioned':
        case 'hexagon-alternating':
            return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
                <rect x="1" y="1" width="42" height="8" rx="1" fill="${fill(0)}" ${stroke}/>
                <rect x="1" y="10" width="42" height="8" rx="1" fill="${fill(1)}" ${stroke}/>
                <rect x="1" y="19" width="42" height="8" rx="1" fill="${fill(2)}" ${stroke}/>
            </svg>`;

        case 'pyramid':
        case 'pyramid-inverted':
        case 'pyramid-segmented':
            return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
                <rect x="14" y="1" width="16" height="8" rx="1" fill="${fill(0)}" ${stroke}/>
                <rect x="8" y="10" width="28" height="8" rx="1" fill="${fill(1)}" ${stroke}/>
                <rect x="1" y="19" width="42" height="8" rx="1" fill="${fill(2)}" ${stroke}/>
            </svg>`;

        case 'pyramid-list':
            return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
                <polygon points="4,27 18,27 11,2" fill="${fill(0)}" ${stroke}/>
                <rect x="20" y="2" width="22" height="7" rx="1" fill="#FFF" stroke="${c[0] || '#888'}" stroke-width="1"/>
                <rect x="20" y="11" width="22" height="7" rx="1" fill="#FFF" stroke="${c[0] || '#888'}" stroke-width="1"/>
                <rect x="20" y="20" width="22" height="7" rx="1" fill="#FFF" stroke="${c[0] || '#888'}" stroke-width="1"/>
            </svg>`;

        default:
            return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
                <rect x="1" y="1" width="42" height="8" rx="1" fill="${fill(0)}" ${stroke}/>
                <rect x="1" y="10" width="42" height="8" rx="1" fill="${fill(1)}" ${stroke}/>
                <rect x="1" y="19" width="42" height="8" rx="1" fill="${fill(2)}" ${stroke}/>
            </svg>`;
    }
}

/**
 * Render color scheme selector
 */
function renderSmartartColorSelector() {
    const container = document.getElementById('smartart-colors');
    if (!container) return;

    const colorSchemes = getSmartArtColorSchemes(state.theme);

    // Find current colors
    let currentColors = ['#E97132', '#196B24', '#0F9ED5'];
    for (const group of colorSchemes) {
        const found = group.items.find(i => i.id === state.smartartColorScheme);
        if (found) { currentColors = found.colors; break; }
    }

    const smartartType = state.smartartType || 'pyramid';

    container.innerHTML = `
        <div class="color-picker-trigger" onclick="toggleColorPicker(event)">
            <div class="color-trigger-preview">
                ${generateColorSchemeThumbnail(smartartType, currentColors)}
            </div>
            <span class="color-trigger-arrow">▼</span>
        </div>
        <div class="color-picker-dropdown" id="color-picker-dropdown">
            ${colorSchemes.map(group => `
                <div class="color-picker-group">
                    <div class="color-picker-label">${group.label}</div>
                    <div class="color-picker-row">
                        ${group.items.map(item => `
                            <button class="color-picker-btn ${state.smartartColorScheme === item.id ? 'active' : ''}"
                                    onclick="selectSmartartColorScheme('${item.id}')"
                                    title="${group.label}">
                                <div class="color-picker-preview ${item.outline ? 'outline' : ''}">
                                    ${generateColorSchemeThumbnail(smartartType, item.accents, item.outline)}
                                </div>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Toggle color picker dropdown
 */
function toggleColorPicker(event) {
    event.stopPropagation();
    const dropdown = document.getElementById('color-picker-dropdown');
    dropdown.classList.toggle('open');

    if (dropdown.classList.contains('open')) {
        document.addEventListener('click', closeColorPickerOnOutsideClick);
    }
}

/**
 * Close color picker on outside click
 */
function closeColorPickerOnOutsideClick(event) {
    const dropdown = document.getElementById('color-picker-dropdown');
    const trigger = document.querySelector('.color-picker-trigger');
    if (dropdown && !dropdown.contains(event.target) && !trigger.contains(event.target)) {
        dropdown.classList.remove('open');
        document.removeEventListener('click', closeColorPickerOnOutsideClick);
    }
}

/**
 * Select color scheme
 */
function selectSmartartColorScheme(schemeId) {
    state.smartartColorScheme = schemeId;
    const dropdown = document.getElementById('color-picker-dropdown');
    if (dropdown) dropdown.classList.remove('open');
    renderSmartartColorSelector();
    render();
}

// ============= SmartArt Text Editor =============

/**
 * Render PPT-style text editor for SmartArt
 */
function renderSmartartTextEditor() {
    const container = document.getElementById('smartart-text-editor');
    if (!container) return;

    if (state.pageType !== 'content-smartart') {
        container.classList.remove('visible');
        return;
    }
    container.classList.add('visible');

    const typeInfo = SMARTART_TYPES[state.smartartType];
    const category = typeInfo?.category || 'list';

    // Initialize items from test data if needed
    if (!state.smartartItems || !Array.isArray(state.smartartItems)) {
        const testData = SMARTART_TEST_DATA[state.smartartType] || SMARTART_TEST_DATA[category] || SMARTART_TEST_DATA['list'];
        state.smartartItems = JSON.parse(JSON.stringify(testData.slice(0, state.smartartItemCount)));
        state.smartartItemsByType[state.smartartType] = state.smartartItems;
    }

    const items = state.smartartItems;
    const itemsHtml = items.map((item, idx) => renderSmartartEditorItem(item, idx)).join('');

    container.innerHTML = `
        <div class="smartart-editor-header">
            <span class="editor-title">在此处键入文字</span>
            <div class="editor-toolbar">
                <button class="editor-btn add-item" title="添加节点">+</button>
                <button class="editor-btn remove-item" title="删除节点">−</button>
            </div>
        </div>
        <div class="smartart-editor-list">${itemsHtml}</div>
    `;

    bindSmartartEditorEvents(container);
}

/**
 * Render single editor item with children
 */
function renderSmartartEditorItem(item, index, level = 0) {
    const text = typeof item === 'string' ? item : (item.text || '');
    const children = (typeof item === 'object' && item.children) ? item.children : [];
    const bullet = level === 0 ? '' : '•';
    const indent = level * 16;

    let html = `
        <div class="editor-item level-${level}" data-index="${index}" data-level="${level}" style="padding-left: ${indent}px">
            <span class="item-bullet">${bullet}</span>
            <input type="text" class="item-text" value="${escapeHtml(text)}" data-path="${index}" />
        </div>
    `;

    children.forEach((child, childIdx) => {
        const childText = typeof child === 'string' ? child : (child.text || '');
        html += `
            <div class="editor-item level-1" data-index="${index}-${childIdx}" data-level="1" style="padding-left: ${indent + 16}px">
                <span class="item-bullet">•</span>
                <input type="text" class="item-text" value="${escapeHtml(childText)}" data-path="${index}-${childIdx}" />
            </div>
        `;
    });

    return html;
}

/**
 * Escape HTML for safe display
 */
function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Bind editor events
 */
function bindSmartartEditorEvents(container) {
    // Text input change
    container.addEventListener('input', (e) => {
        if (!e.target.classList.contains('item-text')) return;
        const path = e.target.dataset.path;
        const newText = e.target.value;
        updateSmartartItemText(path, newText);
        renderSmartArtChart();
    });

    // Add item
    container.querySelector('.add-item')?.addEventListener('click', () => {
        const testData = SMARTART_TEST_DATA[state.smartartType] || SMARTART_TEST_DATA['list'];
        const template = testData[0] || { text: '新节点', children: [] };
        state.smartartItems.push(JSON.parse(JSON.stringify(template)));
        state.smartartItemCount = state.smartartItems.length;
        renderSmartartTextEditor();
        renderSmartArtChart();
    });

    // Remove item
    container.querySelector('.remove-item')?.addEventListener('click', () => {
        if (state.smartartItems.length > 1) {
            state.smartartItems.pop();
            state.smartartItemCount = state.smartartItems.length;
            renderSmartartTextEditor();
            renderSmartArtChart();
        }
    });
}

/**
 * Update item text by path
 */
function updateSmartartItemText(path, newText) {
    const parts = path.split('-').map(Number);
    if (parts.length === 1) {
        // Parent node
        const item = state.smartartItems[parts[0]];
        if (typeof item === 'string') {
            state.smartartItems[parts[0]] = newText;
        } else {
            item.text = newText;
        }
    } else if (parts.length === 2) {
        // Child node
        const parent = state.smartartItems[parts[0]];
        if (typeof parent === 'object' && parent.children && parent.children[parts[1]]) {
            const child = parent.children[parts[1]];
            if (typeof child === 'string') {
                parent.children[parts[1]] = newText;
            } else {
                child.text = newText;
            }
        }
    }
}
