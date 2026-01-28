// UI Interaction Functions

function setActiveLayer(layer) {
    state.activeLayer = layer;
    document.querySelectorAll('.layer-nav-item').forEach(el => {
        el.classList.toggle('active', parseInt(el.dataset.layer) === layer);
    });
    document.querySelectorAll('.editor-view').forEach(el => el.classList.add('hidden'));
    document.getElementById(`editor-l${layer}`).classList.remove('hidden');
    render(); // Re-render to show/hide content boundary for L2
}

function setPreviewTab(tab) {
    state.previewTab = tab;
    document.querySelectorAll('.preview-tab').forEach(el => {
        el.classList.toggle('active', el.textContent.toLowerCase() === tab);
    });
    document.getElementById('preview-viewport').style.display = tab === 'preview' ? 'flex' : 'none';
    document.getElementById('code-view').classList.toggle('active', tab === 'json');
    if (tab === 'json') updateJsonOutput();
}

function setZoom(value) {
    state.zoom = parseInt(value);
    document.getElementById('zoom-value').textContent = value + '%';
    document.querySelector('.slide-wrapper').style.setProperty('--zoom', value / 100);
}

function updateState() {
    state.theme = document.getElementById('theme-select').value;
    state.masterPlaceholders = [];
    document.querySelectorAll('[id^="ph-"]:checked').forEach(el => {
        state.masterPlaceholders.push(el.id.replace('ph-', ''));
    });
    render();
}

function updatePageType(type) {
    state.pageType = type;
    document.getElementById('divider-section').style.display = type === 'divider' ? 'block' : 'none';
    document.getElementById('smartart-section').style.display = type === 'content-smartart' ? 'block' : 'none';

    // Show/hide grid operation bar
    const gridBar = document.getElementById('grid-operation-bar');
    if (type === 'content-grid') {
        gridBar.classList.add('visible');
        renderGridOperationBar();
    } else {
        gridBar.classList.remove('visible');
    }

    if (type === 'divider') renderDividerLayouts();
    if (type === 'content-smartart') {
        renderSmartartCategories();
        renderSmartartPlacements();
    }
    render();
}

// Grid Operation Bar Functions
function renderGridOperationBar() {
    renderLayoutPatterns();
    renderZoneAssignments();
}

function renderLayoutPatterns() {
    const container = document.getElementById('layout-patterns');
    container.innerHTML = Object.entries(GRID_LAYOUTS).map(([id, layout]) => {
        const isActive = state.gridLayout === id;
        return `
            <button class="layout-pattern-btn ${isActive ? 'active' : ''}"
                    onclick="selectGridLayout('${id}')" title="${layout.label}">
                <div class="pattern-preview ${layout.direction === 'column' ? 'vertical' : ''}">
                    ${layout.zones.map(z => `<div class="pattern-zone" style="flex:${z.flex}"></div>`).join('')}
                </div>
                <span class="pattern-label">${layout.label}</span>
            </button>
        `;
    }).join('');
}

function renderZoneAssignments() {
    const container = document.getElementById('zone-assignments');
    const layout = GRID_LAYOUTS[state.gridLayout];
    if (!layout) return;

    container.innerHTML = layout.zones.map(zone => {
        const currentType = state.zoneContents[zone.id] || 'text';
        return `
            <div class="zone-assignment">
                <span class="zone-badge">${zone.id}</span>
                <select onchange="updateZoneContent('${zone.id}', this.value)">
                    ${ZONE_CONTENT_TYPES.map(t => `<option value="${t.id}" ${currentType === t.id ? 'selected' : ''}>${t.label}</option>`).join('')}
                </select>
            </div>
        `;
    }).join('');
}

function selectGridLayout(layoutId) {
    state.gridLayout = layoutId;
    // Initialize zone contents for new layout
    const layout = GRID_LAYOUTS[layoutId];
    const newZoneContents = {};
    layout.zones.forEach((zone, i) => {
        newZoneContents[zone.id] = state.zoneContents[zone.id] || (i === 0 ? 'chart' : 'text');
    });
    state.zoneContents = newZoneContents;
    renderGridOperationBar();
    render();
}

function updateZoneContent(zoneId, contentType) {
    state.zoneContents[zoneId] = contentType;
    render();
}

function updateGridOptions() {
    state.titleStyle = document.getElementById('title-style').value;
    state.sourceStyle = document.getElementById('source-style').value;
    render();
}

function renderDividerLayouts() {
    const container = document.getElementById('divider-layouts');
    container.innerHTML = Object.entries(DIVIDER_LAYOUTS).map(([id, layout]) => {
        const isActive = state.dividerLayout === id;
        const isExpanded = state.expandedDivider === id;
        return `
            <div class="divider-layout-group ${isActive ? 'active' : ''} ${isExpanded ? 'expanded' : ''}" data-layout="${id}">
                <div class="divider-layout-header" onclick="toggleDividerExpand('${id}')">
                    <div class="divider-layout-info">
                        <span class="divider-layout-label">${layout.label}</span>
                        <span class="divider-layout-desc">${layout.desc}</span>
                    </div>
                    <span class="expand-icon">${isExpanded ? '▼' : '▶'}</span>
                </div>
                <div class="divider-layout-variants" style="display:${isExpanded ? 'flex' : 'none'}">
                    <button class="variant-btn ${isActive && state.dividerIndex === 0 ? 'active' : ''}"
                            onclick="selectDividerVariant('${id}', 0)">全部</button>
                    ${[1,2,3,4].map(i => `
                        <button class="variant-btn ${isActive && state.dividerIndex === i ? 'active' : ''}"
                                onclick="selectDividerVariant('${id}', ${i})">${i}</button>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
}

function toggleDividerExpand(layoutId) {
    state.expandedDivider = state.expandedDivider === layoutId ? null : layoutId;
    renderDividerLayouts();
}

function selectDividerVariant(layoutId, index) {
    state.dividerLayout = layoutId;
    state.dividerIndex = index;
    renderDividerLayouts();
    render();
}

// SmartArt UI Functions
function renderSmartartCategories() {
    const container = document.getElementById('smartart-categories');
    container.innerHTML = Object.entries(SMARTART_CATEGORIES).map(([catId, cat]) => {
        const isExpanded = state.expandedSmartartCat === catId;
        const types = Object.entries(SMARTART_TYPES).filter(([_, t]) => t.category === catId);
        const hasActiveType = types.some(([id, _]) => state.smartartType === id);
        return `
            <div class="smartart-cat-group ${hasActiveType ? 'active' : ''} ${isExpanded ? 'expanded' : ''}" data-cat="${catId}">
                <div class="smartart-cat-header" onclick="toggleSmartartCat('${catId}')">
                    <span class="smartart-cat-icon">${cat.icon}</span>
                    <div class="smartart-cat-info">
                        <span class="smartart-cat-label">${cat.label}</span>
                        <span class="smartart-cat-desc">${cat.desc}</span>
                    </div>
                    <span class="expand-icon">${isExpanded ? '▼' : '▶'}</span>
                </div>
                <div class="smartart-type-list" style="display:${isExpanded ? 'flex' : 'none'}">
                    ${types.map(([typeId, typeInfo]) => `
                        <button class="smartart-type-btn ${state.smartartType === typeId ? 'active' : ''}"
                                onclick="selectSmartartType('${typeId}')">${typeInfo.label}</button>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
}

function renderSmartartPlacements() {
    const container = document.getElementById('smartart-placements');
    container.innerHTML = `<div class="placement-btns">
        ${Object.entries(SMARTART_PLACEMENTS).map(([id, p]) => `
            <button class="placement-btn ${state.smartartPlacement === id ? 'active' : ''}"
                    onclick="selectSmartartPlacement('${id}')" title="${p.desc}">${p.label}</button>
        `).join('')}
    </div>`;
}

function toggleSmartartCat(catId) {
    state.expandedSmartartCat = state.expandedSmartartCat === catId ? null : catId;
    renderSmartartCategories();
}

function selectSmartartType(typeId) {
    state.smartartType = typeId;
    state.smartartCategory = SMARTART_TYPES[typeId].category;
    renderSmartartCategories();
    render();
}

function selectSmartartPlacement(placementId) {
    state.smartartPlacement = placementId;
    renderSmartartPlacements();
    render();
}

function toggleShape(shapeId) {
    const existingIndex = state.masterShapes.findIndex(s => s.id === shapeId);
    if (existingIndex >= 0) {
        state.masterShapes.splice(existingIndex, 1);
    } else {
        const defaultPreset = SHAPE_PRESETS[shapeId].presets[0].id;
        state.masterShapes.push({ id: shapeId, preset: defaultPreset });
    }
    renderShapesList();
    render();
}

function updateShapePreset(shapeId, presetId) {
    const shape = state.masterShapes.find(s => s.id === shapeId);
    if (shape) { shape.preset = presetId; render(); }
}

function selectLayoutType(layoutId) {
    state.layoutType = layoutId;
    updateCardSlots();
    renderLayoutTypes();
    render();
}

function updateCardType(index, type) {
    state.cards[index].type = type;
    render();
}

function updateCardSlots() {
    const layout = LAYOUT_TYPES[state.layoutType];
    const zones = layout ? layout.zones : ['text'];
    const newCards = zones.map((zone, i) => {
        if (state.cards[i]) return state.cards[i];
        return { type: ZONE_TO_CARD_TYPE[zone] || 'text' };
    });
    state.cards = newCards;

    const container = document.getElementById('card-slots');
    container.innerHTML = state.cards.map((card, i) => {
        const zoneName = zones[i] || 'content';
        return `
            <div class="card-slot">
                <span class="slot-index">${i + 1}</span>
                <div style="flex:1;">
                    <div style="font-size:10px;color:var(--text-secondary);margin-bottom:4px;">${zoneName}</div>
                    <select onchange="updateCardType(${i}, this.value)">
                        ${CARD_TYPES.map(t => `<option value="${t.id}" ${card.type === t.id ? 'selected' : ''}>${t.label}</option>`).join('')}
                    </select>
                </div>
            </div>
        `;
    }).join('');
}

function updateNavValues() {
    const shapeCount = state.masterShapes.length;
    const themeName = document.getElementById('theme-select').selectedOptions[0].text;
    document.getElementById('nav-l1-value').textContent = `${themeName.split(' ')[0]} + ${shapeCount} shapes`;

    // L2 value
    let l2Value = state.pageType;
    if (state.pageType === 'divider') {
        const dividerLayout = DIVIDER_LAYOUTS[state.dividerLayout];
        const indexLabel = state.dividerIndex === 0 ? '全部' : state.dividerIndex;
        l2Value = `${dividerLayout?.label || state.dividerLayout} (${indexLabel})`;
    } else if (state.pageType === 'content-smartart') {
        const smartartType = SMARTART_TYPES[state.smartartType];
        const placement = SMARTART_PLACEMENTS[state.smartartPlacement];
        l2Value = `${smartartType?.label || state.smartartType} · ${placement?.label || ''}`;
    } else if (state.pageType === 'content-grid') {
        const gridLayout = GRID_LAYOUTS[state.gridLayout];
        const zoneTypes = Object.values(state.zoneContents).join('+');
        l2Value = `${gridLayout?.label || state.gridLayout} (${zoneTypes})`;
    } else if (state.pageType === 'cover') {
        l2Value = '封面';
    }
    document.getElementById('nav-l2-value').textContent = l2Value;
}

function updateJsonOutput() {
    const gridLayout = GRID_LAYOUTS[state.gridLayout];
    const config = {
        theme: state.theme,
        slideMaster: { decorativeShapes: state.masterShapes, placeholders: state.masterPlaceholders },
        pageType: state.pageType,
        ...(state.pageType === 'divider' ? {
            divider: { layout: state.dividerLayout, sectionIndex: state.dividerIndex }
        } : {}),
        ...(state.pageType === 'content-smartart' ? {
            smartart: {
                type: state.smartartType,
                category: state.smartartCategory,
                placement: state.smartartPlacement,
                dataType: SMARTART_TYPES[state.smartartType]?.dataType
            }
        } : {}),
        ...(state.pageType === 'content-grid' ? {
            grid: {
                layout: state.gridLayout,
                titleStyle: state.titleStyle,
                sourceStyle: state.sourceStyle,
                zones: gridLayout?.zones.map(zone => ({
                    id: zone.id,
                    flex: zone.flex,
                    content: state.zoneContents[zone.id] || 'text',
                    gridCells: gridLayout.gridCells[zone.id]
                }))
            }
        } : {})
    };
    document.getElementById('json-output').textContent = JSON.stringify(config, null, 2);
}

function exportConfig() {
    updateJsonOutput();
    const json = document.getElementById('json-output').textContent;
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'slide-config.json'; a.click();
    URL.revokeObjectURL(url);
}

async function generatePPTX() {
    updateJsonOutput();
    const config = JSON.parse(document.getElementById('json-output').textContent);

    const btn = document.querySelector('.btn-primary');
    const originalText = btn.textContent;
    btn.textContent = 'Generating...';
    btn.disabled = true;

    try {
        const response = await fetch('/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config)
        });
        const result = await response.json();

        if (result.success) {
            // Download the generated file
            const link = document.createElement('a');
            link.href = '/' + result.file;
            link.download = result.file;
            link.click();
        } else {
            alert('Generation failed: ' + result.error);
        }
    } catch (e) {
        alert('Request failed: ' + e.message);
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}
