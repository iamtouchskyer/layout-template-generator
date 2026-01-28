// UI Interaction Functions

function setActiveLayer(layer) {
    state.activeLayer = layer;
    document.querySelectorAll('.layer-nav-item').forEach(el => {
        el.classList.toggle('active', parseInt(el.dataset.layer) === layer);
    });
    document.querySelectorAll('.editor-view').forEach(el => el.classList.add('hidden'));
    document.getElementById(`editor-l${layer}`).classList.remove('hidden');
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
    state.titleStyle = document.getElementById('title-style').value;
    state.sourceStyle = document.getElementById('source-style').value;
    render();
}

function updatePageType(type) {
    state.pageType = type;
    const dividerSection = document.getElementById('divider-section');
    dividerSection.style.display = type === 'divider' ? 'block' : 'none';
    if (type === 'divider') renderDividerLayouts();
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
    let l2Value = state.pageType.charAt(0).toUpperCase() + state.pageType.slice(1);
    if (state.pageType === 'divider') {
        const dividerLayout = DIVIDER_LAYOUTS[state.dividerLayout];
        const indexLabel = state.dividerIndex === 0 ? '全部' : state.dividerIndex;
        l2Value = `${dividerLayout?.label || state.dividerLayout} (${indexLabel})`;
    }
    document.getElementById('nav-l2-value').textContent = l2Value;

    const layout = LAYOUT_TYPES[state.layoutType];
    document.getElementById('nav-l3-value').textContent = layout ? layout.label : state.layoutType;
    const cardTypes = state.cards.map(c => c.type.charAt(0).toUpperCase() + c.type.slice(1));
    document.getElementById('nav-l4-value').textContent = cardTypes.join(' + ');
}

function updateJsonOutput() {
    const layout = LAYOUT_TYPES[state.layoutType];
    const config = {
        theme: state.theme,
        slideMaster: { decorativeShapes: state.masterShapes, placeholders: state.masterPlaceholders },
        pageType: state.pageType,
        ...(state.pageType === 'divider' ? {
            divider: {
                layout: state.dividerLayout,
                sectionIndex: state.dividerIndex // 0=TOC, 1-4=section page
            }
        } : {}),
        ...(state.pageType === 'content' ? {
            layout: { type: state.layoutType, category: layout?.category, titleStyle: state.titleStyle, sourceStyle: state.sourceStyle },
            zones: layout?.zones.map((zone, i) => ({ zone, cardType: state.cards[i]?.type || 'text' }))
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
