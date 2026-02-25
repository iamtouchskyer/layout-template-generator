// Grid Layout Control Functions

/**
 * Render grid operation bar (layout patterns + zone assignments)
 */
function renderGridOperationBar() {
    renderLayoutPatterns();
    renderZoneAssignments();
}

/**
 * Render L1 content areas config (title/footer settings - part of slide master)
 */
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

/**
 * Update content area configuration
 */
function updateContentArea(key, value) {
    patchMaster({ masterContentAreas: { [key]: value } });
}

/**
 * Render grid layout pattern selector
 */
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

/**
 * Render zone content type assignments
 */
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

/**
 * Select grid layout pattern
 */
function selectGridLayout(layoutId) {
    const layout = GRID_LAYOUTS[layoutId];
    if (!layout) return;
    const newZoneContents = {};
    layout.zones.forEach((zone, i) => {
        newZoneContents[zone.id] = state.zoneContents[zone.id] || (i === 0 ? 'chart' : 'text');
    });
    patchCurrentPage({
        gridLayout: layoutId,
        zoneContents: newZoneContents,
    });
    renderGridOperationBar();
}

/**
 * Update zone content type
 */
function updateZoneContent(zoneId, contentType) {
    patchCurrentPage({
        zoneContents: {
            ...(state.zoneContents || {}),
            [zoneId]: contentType,
        },
    });
}
