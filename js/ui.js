// UI Interaction Functions

function toggleSection(section) {
    const content = document.getElementById(`content-${section}`);
    const toggle = document.getElementById(`toggle-${section}`);
    const isCollapsed = content.classList.toggle('collapsed');
    toggle.textContent = isCollapsed ? '▶' : '▼';
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
    // Re-render SmartArt color picker when theme changes (colors depend on theme)
    if (state.pageType === 'content-smartart') {
        renderSmartartColorSelector();
    }
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

    // Show/hide cover operation bar
    const coverBar = document.getElementById('cover-operation-bar');
    if (type === 'cover') {
        coverBar.classList.add('visible');
        renderCoverLayoutSelector();
    } else {
        coverBar.classList.remove('visible');
    }

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
        renderSmartartCountSelector();
        renderSmartartPlacements();
        renderSmartartColorSelector();
    } else {
        smartartBar.classList.remove('visible');
    }

    render();
}

// Cover Layout Selector Functions
function renderCoverLayoutSelector() {
    const container = document.getElementById('cover-layout-selector');
    if (!container) return;

    container.innerHTML = `
        <div class="cover-layout-row">
            ${Object.entries(COVER_LAYOUTS).map(([id, layout]) => `
                <button class="cover-layout-btn ${state.coverLayout === id ? 'active' : ''}"
                        onclick="selectCoverLayout('${id}')" title="${layout.description}">
                    ${layout.name}
                </button>
            `).join('')}
        </div>
    `;
}

function selectCoverLayout(layoutId) {
    state.coverLayout = layoutId;
    renderCoverLayoutSelector();
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

function selectSmartartCategory(catId) {
    state.smartartCategory = catId;
    // Auto-select first type in this category
    const types = Object.entries(SMARTART_TYPES).filter(([_, t]) => t.category === catId);
    if (types.length > 0) {
        state.smartartType = types[0][0];
    }
    renderSmartartTypeSelector();
    renderSmartartColorSelector();  // Refresh color picker thumbnails for new type
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
    renderSmartartColorSelector();  // Refresh color picker thumbnails for new type
    render();
}

function selectSmartartPlacement(placementId) {
    state.smartartPlacement = placementId;
    renderSmartartPlacements();
    render();
}

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

function selectSmartartCount(count) {
    state.smartartItemCount = count;
    renderSmartartCountSelector();
    render();
}

/**
 * Generate mini SVG thumbnail for color scheme picker based on SmartArt type
 */
function generateColorSchemeThumbnail(smartartType, colors, outline = false) {
    const w = 44, h = 28;
    const c = colors || ['#888', '#AAA', '#CCC', '#DDD'];
    const stroke = outline ? `stroke="#999" stroke-width="1"` : '';
    const fill = (i) => outline ? '#FFF' : (c[i % c.length] || '#888');

    // Map smartartType to thumbnail shape
    switch (smartartType) {
        // Matrix types - 2x2 grid with center
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

        // Cycle types - circular
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

        // Process types - chevrons
        case 'chevron':
        case 'arrow-process':
        case 'descending-process':
            return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
                <polygon points="1,4 10,4 14,14 10,24 1,24 5,14" fill="${fill(0)}" ${stroke}/>
                <polygon points="15,4 24,4 28,14 24,24 15,24 19,14" fill="${fill(1)}" ${stroke}/>
                <polygon points="29,4 38,4 42,14 38,24 29,24 33,14" fill="${fill(2)}" ${stroke}/>
            </svg>`;

        // Hierarchy - tree
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

        // Radial - circles
        case 'radial':
            return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
                <circle cx="22" cy="14" r="6" fill="${fill(0)}" ${stroke}/>
                <circle cx="8" cy="8" r="5" fill="${fill(1)}" ${stroke}/>
                <circle cx="36" cy="8" r="5" fill="${fill(2)}" ${stroke}/>
                <circle cx="8" cy="20" r="5" fill="${fill(3)}" ${stroke}/>
                <circle cx="36" cy="20" r="5" fill="${fill(4)}" ${stroke}/>
            </svg>`;

        // List types - horizontal bars
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

        // Pyramid types - stacked trapezoids
        case 'pyramid':
        case 'pyramid-inverted':
        case 'pyramid-segmented':
            return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
                <rect x="14" y="1" width="16" height="8" rx="1" fill="${fill(0)}" ${stroke}/>
                <rect x="8" y="10" width="28" height="8" rx="1" fill="${fill(1)}" ${stroke}/>
                <rect x="1" y="19" width="42" height="8" rx="1" fill="${fill(2)}" ${stroke}/>
            </svg>`;

        // Pyramid list - triangle with side boxes
        case 'pyramid-list':
            return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
                <polygon points="4,27 18,27 11,2" fill="${fill(0)}" ${stroke}/>
                <rect x="20" y="2" width="22" height="7" rx="1" fill="#FFF" stroke="${c[0] || '#888'}" stroke-width="1"/>
                <rect x="20" y="11" width="22" height="7" rx="1" fill="#FFF" stroke="${c[0] || '#888'}" stroke-width="1"/>
                <rect x="20" y="20" width="22" height="7" rx="1" fill="#FFF" stroke="${c[0] || '#888'}" stroke-width="1"/>
            </svg>`;

        default:
            // Fallback - horizontal bars
            return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
                <rect x="1" y="1" width="42" height="8" rx="1" fill="${fill(0)}" ${stroke}/>
                <rect x="1" y="10" width="42" height="8" rx="1" fill="${fill(1)}" ${stroke}/>
                <rect x="1" y="19" width="42" height="8" rx="1" fill="${fill(2)}" ${stroke}/>
            </svg>`;
    }
}

function renderSmartartColorSelector() {
    const container = document.getElementById('smartart-colors');
    if (!container) return;

    // Get dynamic color schemes based on current theme
    const colorSchemes = getSmartArtColorSchemes(state.theme);

    // Find current color scheme colors for preview
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

function toggleColorPicker(event) {
    event.stopPropagation();
    const dropdown = document.getElementById('color-picker-dropdown');
    dropdown.classList.toggle('open');

    // Close on outside click
    if (dropdown.classList.contains('open')) {
        document.addEventListener('click', closeColorPickerOnOutsideClick);
    }
}

function closeColorPickerOnOutsideClick(event) {
    const dropdown = document.getElementById('color-picker-dropdown');
    const trigger = document.querySelector('.color-picker-trigger');
    if (dropdown && !dropdown.contains(event.target) && !trigger.contains(event.target)) {
        dropdown.classList.remove('open');
        document.removeEventListener('click', closeColorPickerOnOutsideClick);
    }
}

function selectSmartartColorScheme(schemeId) {
    state.smartartColorScheme = schemeId;
    // Close dropdown
    const dropdown = document.getElementById('color-picker-dropdown');
    if (dropdown) dropdown.classList.remove('open');
    renderSmartartColorSelector();
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
        const coverLayout = COVER_LAYOUTS[state.coverLayout];
        l2Value = `封面 · ${coverLayout?.name || state.coverLayout}`;
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
            // Preset-based config (header-badge, header-line, footer-line)
            const presetConfig = shapeConfig.presets?.[shapeState.preset] || {};
            return {
                id: shapeState.id,
                configType: 'presets',
                preset: shapeState.preset,
                occupiesSpace: shapeConfig.occupiesSpace,
                // Include position/size config from preset for python-pptx
                positionConfig: {
                    ...presetConfig.position,
                    ...presetConfig.size,
                    text: shapeConfig.defaultContent || 'SECTION',
                },
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
        ...(state.pageType === 'cover' ? {
            coverLayout: state.coverLayout,
            coverContent: state.coverContent
        } : {}),
        ...(state.pageType === 'divider' ? {
            divider: { layout: state.dividerLayout, sectionCount: state.dividerSectionCount, numberStyle: state.dividerNumberStyle, textLevel: state.dividerTextLevel, bgStyle: state.dividerBgStyle, sectionIndex: state.dividerIndex }
        } : {}),
        ...(state.pageType === 'content-smartart' ? {
            smartart: {
                type: state.smartartType,
                category: state.smartartCategory,
                placement: state.smartartPlacement,
                colorScheme: state.smartartColorScheme,
                ooxmlId: SMARTART_TYPES[state.smartartType]?.ooxmlId,
                // Include OOXML data for python-pptx generation
                ...(typeof getSmartArtOOXML === 'function' ? { ooxml: getSmartArtOOXML() } : {})
            }
        } : {}),
        ...(state.pageType === 'content-grid' ? {
            grid: {
                layout: state.gridLayout,
                zones: gridLayout?.zones.map((zone, idx) => {
                    const contentType = state.zoneContents[zone.id] || 'text';
                    const zoneData = {
                        id: zone.id,
                        flex: zone.flex,
                        content: contentType
                    };
                    // Include chart data for chart zones (portable format for python-pptx)
                    if (contentType === 'chart' && typeof CHART_SAMPLES !== 'undefined') {
                        const zoneIdx = zone.id.charCodeAt(0) - 65; // A=0, B=1, etc.
                        const chartSample = CHART_SAMPLES[zoneIdx % CHART_SAMPLES.length];
                        zoneData.chartData = {
                            title: chartSample.title,
                            chartType: chartSample.chartType,
                            categories: chartSample.categories,
                            series: chartSample.series
                        };
                    }
                    // Include text data for text zones
                    if (contentType === 'text' && typeof TEXT_SAMPLES !== 'undefined') {
                        const zoneIdx = zone.id.charCodeAt(0) - 65; // A=0, B=1, etc.
                        const textSample = TEXT_SAMPLES[zoneIdx % TEXT_SAMPLES.length];
                        zoneData.textData = {
                            title: textSample.title,
                            body: textSample.content
                        };
                    }
                    return zoneData;
                })
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
