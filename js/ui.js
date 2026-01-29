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
    render();
}

// Aspect ratio functions
function initAspectRatioSelector() {
    const select = document.getElementById('aspect-ratio-select');
    if (!select || !ASPECT_RATIOS) return;

    select.innerHTML = Object.entries(ASPECT_RATIOS).map(([id, ar]) =>
        `<option value="${id}" ${id === CURRENT_ASPECT_RATIO ? 'selected' : ''}>${ar.label}</option>`
    ).join('');
}

function updateAspectRatio(aspectRatio) {
    updateSlideConfigForAspectRatio(aspectRatio);
    // Update global reference
    window.SLIDE_CONFIG = SLIDE_CONFIG;
    window.CURRENT_ASPECT_RATIO = aspectRatio;
    // Re-render with new dimensions
    render();
}

// Placeholder functions
function togglePlaceholder(phId) {
    if (!state.masterPlaceholders[phId]) {
        const phConfig = PLACEHOLDERS_CONFIG[phId];
        state.masterPlaceholders[phId] = {
            enabled: true,
            position: phConfig.defaultPosition,
            size: phConfig.defaultSize || null,
            imageUrl: null
        };
    } else {
        state.masterPlaceholders[phId].enabled = !state.masterPlaceholders[phId].enabled;
    }
    renderPlaceholderList();
    render();
}

function updatePlaceholderPosition(phId, position) {
    if (state.masterPlaceholders[phId]) {
        state.masterPlaceholders[phId].position = position;
        render();
    }
}

function updatePlaceholderSize(phId, size) {
    if (state.masterPlaceholders[phId]) {
        state.masterPlaceholders[phId].size = size;
        render();
    }
}

function handleLogoUpload(phId, input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        if (state.masterPlaceholders[phId]) {
            state.masterPlaceholders[phId].imageUrl = e.target.result;
            renderPlaceholderList();
            render();
        }
    };
    reader.readAsDataURL(file);
}

function clearLogoImage(phId) {
    if (state.masterPlaceholders[phId]) {
        state.masterPlaceholders[phId].imageUrl = null;
        renderPlaceholderList();
        render();
    }
}

function updatePageType(type) {
    state.pageType = type;

    // Show/hide divider operation bar
    const dividerBar = document.getElementById('divider-operation-bar');
    if (type === 'divider') {
        dividerBar.classList.add('visible');
        renderDividerStyleSelector();
        renderDividerCountSelector();
        renderDividerNumberSelector();
        renderDividerTextSelector();
        renderDividerBgSelector();
        renderDividerIndexSelector();
    } else {
        dividerBar.classList.remove('visible');
    }

    // Show/hide grid operation bar
    const gridBar = document.getElementById('grid-operation-bar');
    if (type === 'content-grid') {
        gridBar.classList.add('visible');
        renderGridOperationBar();
    } else {
        gridBar.classList.remove('visible');
    }

    // Show/hide smartart operation bar
    const smartartBar = document.getElementById('smartart-operation-bar');
    if (type === 'content-smartart') {
        smartartBar.classList.add('visible');
        renderSmartartTypeSelector();
        renderSmartartPlacements();
    } else {
        smartartBar.classList.remove('visible');
    }

    render();
}

// Grid Operation Bar Functions
function renderGridOperationBar() {
    renderLayoutPatterns();
    renderZoneAssignments();
}

// L1 Content Areas Config (title/footer settings - part of slide master)
function renderContentAreasConfig() {
    const container = document.getElementById('content-areas-config');
    if (!container) return;

    const ca = state.masterContentAreas;
    container.innerHTML = `
        <div class="content-area-row">
            <select onchange="updateContentArea('titleStyle', this.value)">
                ${Object.entries(CONTENT_AREAS.titleStyles).map(([id, opt]) =>
                    `<option value="${id}" ${ca.titleStyle === id ? 'selected' : ''}>${opt.label}</option>`
                ).join('')}
            </select>
            <label>标题样式</label>
        </div>
        <div class="content-area-row">
            <select onchange="updateContentArea('headerHeight', this.value)">
                ${Object.entries(CONTENT_AREAS.header.heights).map(([id, opt]) =>
                    `<option value="${id}" ${ca.headerHeight === id ? 'selected' : ''}>${opt.label}</option>`
                ).join('')}
            </select>
            <label>标题高度</label>
        </div>
        <div class="content-area-row">
            <select onchange="updateContentArea('sourceStyle', this.value)">
                ${Object.entries(CONTENT_AREAS.sourceStyles).map(([id, opt]) =>
                    `<option value="${id}" ${ca.sourceStyle === id ? 'selected' : ''}>${opt.label}</option>`
                ).join('')}
            </select>
            <label>数据来源</label>
        </div>
        <div class="content-area-row">
            <select onchange="updateContentArea('footerHeight', this.value)">
                ${Object.entries(CONTENT_AREAS.footer.heights).map(([id, opt]) =>
                    `<option value="${id}" ${ca.footerHeight === id ? 'selected' : ''}>${opt.label}</option>`
                ).join('')}
            </select>
            <label>页脚高度</label>
        </div>
    `;
}

function updateContentArea(key, value) {
    state.masterContentAreas[key] = value;
    render();
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


function renderDividerStyleSelector() {
    const container = document.getElementById('divider-style-selector');
    container.innerHTML = `
        <div class="divider-style-row">
            ${Object.entries(DIVIDER_LAYOUTS).map(([id, layout]) => `
                <button class="divider-style-btn ${state.dividerLayout === id ? 'active' : ''}"
                        onclick="selectDividerLayout('${id}')" title="${layout.desc}">
                    ${layout.label}
                </button>
            `).join('')}
        </div>
    `;
}

function renderDividerCountSelector() {
    const container = document.getElementById('divider-count-selector');
    container.innerHTML = `
        <div class="divider-count-row">
            ${[3,4,5,6].map(n => `
                <button class="divider-count-btn ${state.dividerSectionCount === n ? 'active' : ''}"
                        onclick="selectDividerCount(${n})">${n}</button>
            `).join('')}
        </div>
    `;
}

const NUMBER_STYLES = [
    { id: 'arabic', label: '1,2,3' },
    { id: 'roman', label: 'I,II,III' },
    { id: 'chinese', label: '一,二,三' },
    { id: 'circled', label: '①②③' },
];

function renderDividerNumberSelector() {
    const container = document.getElementById('divider-number-selector');
    container.innerHTML = `
        <div class="divider-number-row">
            ${NUMBER_STYLES.map(s => `
                <button class="divider-number-btn ${state.dividerNumberStyle === s.id ? 'active' : ''}"
                        onclick="selectDividerNumberStyle('${s.id}')">${s.label}</button>
            `).join('')}
        </div>
    `;
}

function selectDividerNumberStyle(style) {
    state.dividerNumberStyle = style;
    renderDividerNumberSelector();
    render();
}

const TEXT_LEVELS = [
    { id: 'full', label: '完整' },
    { id: 'compact', label: '简洁' },
];

function renderDividerTextSelector() {
    const container = document.getElementById('divider-text-selector');
    container.innerHTML = `
        <div class="divider-text-row">
            ${TEXT_LEVELS.map(t => `
                <button class="divider-text-btn ${state.dividerTextLevel === t.id ? 'active' : ''}"
                        onclick="selectDividerTextLevel('${t.id}')">${t.label}</button>
            `).join('')}
        </div>
    `;
}

function selectDividerTextLevel(level) {
    state.dividerTextLevel = level;
    renderDividerTextSelector();
    render();
}

const BG_STYLES = [
    { id: 'solid', label: '纯色' },
    { id: 'gradient', label: '渐变' },
    { id: 'split', label: '分屏' },
    { id: 'light', label: '浅色' },
];

function renderDividerBgSelector() {
    const container = document.getElementById('divider-bg-selector');
    container.innerHTML = `
        <div class="divider-bg-row">
            ${BG_STYLES.map(s => `
                <button class="divider-bg-btn ${state.dividerBgStyle === s.id ? 'active' : ''}"
                        onclick="selectDividerBgStyle('${s.id}')">${s.label}</button>
            `).join('')}
        </div>
    `;
}

function selectDividerBgStyle(style) {
    state.dividerBgStyle = style;
    renderDividerBgSelector();
    render();
}

function renderDividerIndexSelector() {
    const container = document.getElementById('divider-index-selector');
    const count = state.dividerSectionCount;
    container.innerHTML = `
        <div class="divider-index-row">
            <button class="divider-index-btn ${state.dividerIndex === 0 ? 'active' : ''}"
                    onclick="selectDividerIndex(0)">全部</button>
            ${Array.from({length: count}, (_, i) => i + 1).map(i => `
                <button class="divider-index-btn ${state.dividerIndex === i ? 'active' : ''}"
                        onclick="selectDividerIndex(${i})">${i}</button>
            `).join('')}
        </div>
    `;
}

function selectDividerLayout(layoutId) {
    state.dividerLayout = layoutId;
    renderDividerStyleSelector();
    render();
}

function selectDividerCount(count) {
    state.dividerSectionCount = count;
    // 如果当前索引超出范围，重置为0
    if (state.dividerIndex > count) {
        state.dividerIndex = 0;
    }
    renderDividerCountSelector();
    renderDividerIndexSelector();
    render();
}

function selectDividerIndex(index) {
    state.dividerIndex = index;
    renderDividerIndexSelector();
    render();
}

// SmartArt UI Functions
function renderSmartartTypeSelector() {
    const container = document.getElementById('smartart-type-selector');
    // Render category buttons with type dropdown
    const currentType = SMARTART_TYPES[state.smartartType];
    const currentCat = currentType?.category || 'funnel';

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
                        <span class="cat-icon">${cat.icon}</span>
                        <span class="cat-label">${cat.label}</span>
                    </button>
                `;
            }).join('')}
        </div>
        <div class="smartart-subtype-row">
            ${currentCatTypes.map(([typeId, typeInfo]) => `
                <button class="smartart-subtype-btn ${state.smartartType === typeId ? 'active' : ''}"
                        onclick="selectSmartartType('${typeId}')">${typeInfo.label}</button>
            `).join('')}
        </div>
    `;
}

function selectSmartartCategory(catId) {
    state.smartartCategory = catId;
    // Auto-select first type in this category
    const types = Object.entries(SMARTART_TYPES).filter(([_, t]) => t.category === catId);
    if (types.length > 0) {
        state.smartartType = types[0][0];
    }
    renderSmartartTypeSelector();
    render();
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

function selectSmartartType(typeId) {
    state.smartartType = typeId;
    state.smartartCategory = SMARTART_TYPES[typeId].category;
    renderSmartartTypeSelector();
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
        const shapeConfig = SHAPE_PRESETS[shapeId];
        if (shapeConfig.configType === 'thickness-positions') {
            // New thickness-positions config
            state.masterShapes.push({
                id: shapeId,
                thickness: shapeConfig.defaultThickness,
                positions: [...shapeConfig.defaultPositions]
            });
        } else {
            // Legacy preset-based config
            const defaultPreset = shapeConfig.presets[0].id;
            state.masterShapes.push({ id: shapeId, preset: defaultPreset });
        }
    }
    renderShapesList();
    render();
}

function updateShapePreset(shapeId, presetId) {
    const shape = state.masterShapes.find(s => s.id === shapeId);
    if (shape) { shape.preset = presetId; render(); }
}

function updateShapeThickness(shapeId, thickness) {
    const shape = state.masterShapes.find(s => s.id === shapeId);
    if (shape) { shape.thickness = thickness; render(); }
}

function updateShapePosition(shapeId, positionId, isChecked) {
    const shape = state.masterShapes.find(s => s.id === shapeId);
    if (!shape) return;

    if (!shape.positions) shape.positions = [];

    if (isChecked) {
        if (!shape.positions.includes(positionId)) {
            shape.positions.push(positionId);
        }
    } else {
        const idx = shape.positions.indexOf(positionId);
        if (idx >= 0) shape.positions.splice(idx, 1);
    }
    render();
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
    // Serialize shapes with full config info for python-pptx
    const serializedShapes = state.masterShapes.map(shapeState => {
        const shapeConfig = SHAPE_PRESETS[shapeState.id];
        if (shapeConfig.configType === 'thickness-positions') {
            const thickness = shapeState.thickness || shapeConfig.defaultThickness;
            const positions = shapeState.positions || shapeConfig.defaultPositions || [];
            const thicknessConfig = shapeConfig.thickness[thickness];
            return {
                id: shapeState.id,
                configType: 'thickness-positions',
                thickness: thickness,
                positions: positions,
                // Include computed values for python-pptx
                thicknessConfig: thicknessConfig,
                occupiesSpace: shapeConfig.occupiesSpace,
                style: shapeConfig.style || {},
            };
        } else {
            return {
                id: shapeState.id,
                configType: 'presets',
                preset: shapeState.preset,
                occupiesSpace: shapeConfig.occupiesSpace,
            };
        }
    });
    // Serialize placeholders with full config info for python-pptx
    const serializedPlaceholders = {};
    Object.entries(state.masterPlaceholders).forEach(([phId, phState]) => {
        if (!phState.enabled) return;
        const phConfig = PLACEHOLDERS_CONFIG[phId];
        if (!phConfig) return;

        const posConfig = phConfig.positions[phState.position];
        const sizeConfig = phConfig.sizes?.[phState.size];

        serializedPlaceholders[phId] = {
            enabled: true,
            position: phState.position,
            positionConfig: posConfig?.position,
            size: phState.size,
            sizeConfig: sizeConfig,
            imageUrl: phState.imageUrl || null,
        };
    });

    // Calculate bounds for WYSIWYG output
    const hasTitle = state.masterContentAreas.titleStyle !== 'none';
    const headerBounds = getHeaderBoundsFromConfig(state);
    const bodyBounds = getBodyBoundsFromConfig(state, hasTitle);
    const contentBounds = getContentBoundsFromConfig(state);

    // Content areas with calculated bounds (in pixels)
    const contentAreasWithBounds = {
        ...state.masterContentAreas,
        // Calculated bounds for title/header area
        headerBounds: {
            x: headerBounds.left,
            y: headerBounds.top,
            width: SLIDE_CONFIG.width - headerBounds.left - headerBounds.right,
            height: headerBounds.height,
        },
        // Calculated bounds for body area
        bodyBounds: {
            x: bodyBounds.left,
            y: bodyBounds.top,
            width: SLIDE_CONFIG.width - bodyBounds.left - bodyBounds.right,
            height: SLIDE_CONFIG.height - bodyBounds.top - bodyBounds.bottom,
        },
        // Calculated bounds for footer area
        footerBounds: {
            x: contentBounds.left,
            y: SLIDE_CONFIG.height - contentBounds.bottom,
            width: SLIDE_CONFIG.width - contentBounds.left - contentBounds.right,
            height: CONTENT_AREAS.footer.getHeight(state.masterContentAreas.footerHeight || 'compact'),
        },
    };

    const config = {
        slide: {
            width: SLIDE_CONFIG.width,
            height: SLIDE_CONFIG.height,
            widthInches: SLIDE_CONFIG.widthInches,
            heightInches: SLIDE_CONFIG.heightInches,
        },
        theme: state.theme,
        slideMaster: {
            decorativeShapes: serializedShapes,
            placeholders: serializedPlaceholders,
            contentAreas: contentAreasWithBounds,
        },
        pageType: state.pageType,
        ...(state.pageType === 'divider' ? {
            divider: { layout: state.dividerLayout, sectionCount: state.dividerSectionCount, numberStyle: state.dividerNumberStyle, textLevel: state.dividerTextLevel, bgStyle: state.dividerBgStyle, sectionIndex: state.dividerIndex }
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
                zones: gridLayout?.zones.map(zone => ({
                    id: zone.id,
                    flex: zone.flex,
                    content: state.zoneContents[zone.id] || 'text'
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
