// SmartArt Control and Editor Functions

function _saClone(value) {
    return JSON.parse(JSON.stringify(value));
}

function _commitSmartart(partial, options = {}) {
    if (typeof patchCurrentPage === 'function') {
        patchCurrentPage(partial, options);
        return;
    }
    Object.keys(partial || {}).forEach((key) => {
        state[key] = partial[key];
    });
    if (options.render !== false && typeof render === 'function') render();
}

function _mutateSmartart(mutator, options = {}) {
    if (typeof mutateCurrentPageData === 'function') {
        mutateCurrentPageData(mutator, options);
        return;
    }
    mutator(state);
    if (options.render !== false && typeof render === 'function') render();
}

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
    const types = Object.entries(SMARTART_TYPES).filter(([_, t]) => t.category === catId);
    _mutateSmartart((draft) => {
        draft.smartartCategory = catId;
        if (types.length === 0) return;

        const oldType = draft.smartartType;
        const nextType = types[0][0];
        const byType = _saClone(draft.smartartItemsByType || {});
        if (oldType && Array.isArray(draft.smartartItems)) {
            byType[oldType] = _saClone(draft.smartartItems);
        }
        draft.smartartType = nextType;
        draft.smartartItemsByType = byType;
        draft.smartartItems = Array.isArray(byType[nextType]) ? _saClone(byType[nextType]) : null;
    });
    renderSmartartTypeSelector();
    renderSmartartColorSelector();
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
    _mutateSmartart((draft) => {
        const oldType = draft.smartartType;
        const byType = _saClone(draft.smartartItemsByType || {});
        if (oldType && Array.isArray(draft.smartartItems)) {
            byType[oldType] = _saClone(draft.smartartItems);
        }
        draft.smartartType = typeId;
        draft.smartartCategory = SMARTART_TYPES[typeId].category;
        draft.smartartItemsByType = byType;
        draft.smartartItems = Array.isArray(byType[typeId]) ? _saClone(byType[typeId]) : null;
    });

    renderSmartartTypeSelector();
    renderSmartartColorSelector();
}

/**
 * Select SmartArt placement
 */
function selectSmartartPlacement(placementId) {
    _commitSmartart({ smartartPlacement: placementId });
    renderSmartartPlacements();
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
    syncSmartartItemsToCount(count);
    renderSmartartCountSelector();
}

function syncSmartartItemsToCount(count) {
    _mutateSmartart((draft) => {
        const typeId = draft.smartartType || 'pyramid';
        const typeInfo = SMARTART_TYPES[typeId];
        const category = typeInfo?.category || 'list';
        const testData = SMARTART_TEST_DATA[typeId] || SMARTART_TEST_DATA[category] || SMARTART_TEST_DATA['list'] || [];

        let nextItems = Array.isArray(draft.smartartItems)
            ? _saClone(draft.smartartItems)
            : _saClone(testData.slice(0, count));

        if (nextItems.length > count) {
            nextItems = nextItems.slice(0, count);
        } else if (nextItems.length < count) {
            for (let i = nextItems.length; i < count; i++) {
                const template = testData[i] || testData[testData.length - 1] || { text: `节点${i + 1}`, children: [] };
                nextItems.push(_saClone(template));
            }
        }

        const byType = _saClone(draft.smartartItemsByType || {});
        byType[typeId] = _saClone(nextItems);
        draft.smartartItemCount = count;
        draft.smartartItems = nextItems;
        draft.smartartItemsByType = byType;
    });
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
    _commitSmartart({ smartartColorScheme: schemeId });
    const dropdown = document.getElementById('color-picker-dropdown');
    if (dropdown) dropdown.classList.remove('open');
    renderSmartartColorSelector();
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
        const initItems = JSON.parse(JSON.stringify(testData.slice(0, state.smartartItemCount)));
        const byType = _saClone(state.smartartItemsByType || {});
        byType[state.smartartType] = _saClone(initItems);
        _commitSmartart({
            smartartItems: initItems,
            smartartItemsByType: byType,
        }, { recordHistory: false, render: false });
    }

    const items = state.smartartItems;

    // Determine editor schema based on type
    const schemaType = getSmartartEditorSchema(state.smartartType);
    let itemsHtml;

    if (schemaType === 'matrix') {
        // Matrix: center (items[0]) + quadrants (items[1-4])
        itemsHtml = renderMatrixEditorItems(items);
    } else {
        // Default: tree editor (items with optional children)
        itemsHtml = items.map((item, idx) => renderSmartartEditorItem(item, idx)).join('');
    }

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
 * Determine editor schema type for SmartArt
 */
function getSmartartEditorSchema(typeId) {
    try {
        const schemaApi = window.SmartArt?.schema;
        if (schemaApi && typeof schemaApi.getEditorMode === 'function') {
            return schemaApi.getEditorMode(typeId);
        }
    } catch (_) {
        // ignore schema API errors and fallback below
    }

    const matrixTypes = ['matrix', 'matrix-titled', 'matrix-cycle'];
    if (matrixTypes.includes(typeId)) return 'matrix';
    return 'tree';
}

/**
 * Render matrix editor items: center + quadrants
 */
function renderMatrixEditorItems(items) {
    const expectedCount = window.SmartArt?.schema?.get?.(state.smartartType)?.itemCount;
    const hasCenter = expectedCount === 5;
    const labels = hasCenter
        ? ['中心', '左上', '右上', '左下', '右下']
        : ['左上', '右上', '左下', '右下'];
    let html = '';

    items.forEach((item, idx) => {
        const text = typeof item === 'string' ? item : (item.text || '');
        const label = labels[idx] || `节点${idx + 1}`;
        const isCenter = hasCenter && idx === 0;

        html += `
            <div class="editor-item matrix-item ${isCenter ? 'center' : 'quadrant'}"
                 data-index="${idx}" data-level="0">
                <span class="item-label">${label}</span>
                <input type="text" class="item-text" value="${escapeHtml(text)}" data-path="${idx}" />
            </div>
        `;
    });

    return html;
}

/**
 * Render single editor item with children
 */
function renderSmartartEditorItem(item, index, level = 0) {
    const text = typeof item === 'string' ? item : (item.text || '');
    const children = (typeof item === 'object' && item.children) ? item.children : [];
    const bullet = shouldShowSmartartBullet(level) ? '•' : '';
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
                <span class="item-bullet">${shouldShowSmartartBullet(level + 1) ? '•' : ''}</span>
                <input type="text" class="item-text" value="${escapeHtml(childText)}" data-path="${index}-${childIdx}" />
            </div>
        `;
    });

    return html;
}

function shouldShowSmartartBullet(level) {
    try {
        const schemaApi = window.SmartArt?.schema;
        if (schemaApi && typeof schemaApi.shouldShowBullet === 'function') {
            return schemaApi.shouldShowBullet(state.smartartType, level);
        }
    } catch (_) {
        // ignore schema API errors and fallback below
    }
    return level > 0;
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
        _mutateSmartart((draft) => {
            const typeId = draft.smartartType || 'pyramid';
            const items = Array.isArray(draft.smartartItems) ? _saClone(draft.smartartItems) : [];
            items.push(_saClone(template));
            const byType = _saClone(draft.smartartItemsByType || {});
            byType[typeId] = _saClone(items);
            draft.smartartItems = items;
            draft.smartartItemsByType = byType;
            draft.smartartItemCount = items.length;
        }, { render: false });
        renderSmartartTextEditor();
        renderSmartArtChart();
    });

    // Remove item
    container.querySelector('.remove-item')?.addEventListener('click', () => {
        if (state.smartartItems.length > 1) {
            _mutateSmartart((draft) => {
                const typeId = draft.smartartType || 'pyramid';
                const items = Array.isArray(draft.smartartItems) ? _saClone(draft.smartartItems) : [];
                items.pop();
                const byType = _saClone(draft.smartartItemsByType || {});
                byType[typeId] = _saClone(items);
                draft.smartartItems = items;
                draft.smartartItemsByType = byType;
                draft.smartartItemCount = items.length;
            }, { render: false });
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
    _mutateSmartart((draft) => {
        const typeId = draft.smartartType || 'pyramid';
        const items = Array.isArray(draft.smartartItems) ? _saClone(draft.smartartItems) : [];
        if (parts.length === 1) {
            const item = items[parts[0]];
            if (typeof item === 'string') {
                items[parts[0]] = newText;
            } else if (item && typeof item === 'object') {
                item.text = newText;
            }
        } else if (parts.length === 2) {
            const parent = items[parts[0]];
            if (typeof parent === 'object' && parent.children && parent.children[parts[1]]) {
                const child = parent.children[parts[1]];
                if (typeof child === 'string') {
                    parent.children[parts[1]] = newText;
                } else {
                    child.text = newText;
                }
            }
        }
        const byType = _saClone(draft.smartartItemsByType || {});
        byType[typeId] = _saClone(items);
        draft.smartartItems = items;
        draft.smartartItemsByType = byType;
    }, { render: false });
}
