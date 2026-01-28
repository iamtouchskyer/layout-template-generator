// Render Functions

function render() {
    const slide = document.getElementById('slide');
    const masterLayer = document.getElementById('master-layer');
    const contentLayer = document.getElementById('content-layer');

    slide.setAttribute('data-theme', state.theme);
    let pageClass = `page-type-${state.pageType}`;
    if (state.pageType === 'divider') {
        pageClass = `page-type-divider-${state.dividerLayout}`;
    }
    slide.className = `slide-container ${pageClass}`;
    masterLayer.innerHTML = renderMasterLayer();
    contentLayer.innerHTML = renderContentLayer();
    updateNavValues();
    if (state.previewTab === 'json') updateJsonOutput();
}

function renderShapesList() {
    const container = document.getElementById('shapes-list');
    container.innerHTML = Object.entries(SHAPE_PRESETS).map(([shapeId, shape]) => {
        const isActive = state.masterShapes.some(s => s.id === shapeId);
        const currentPreset = state.masterShapes.find(s => s.id === shapeId)?.preset || shape.presets[0].id;
        return `
            <div class="shape-item ${isActive ? 'active' : ''}" data-shape="${shapeId}">
                <div class="shape-item-header" onclick="toggleShape('${shapeId}')">
                    <input type="checkbox" ${isActive ? 'checked' : ''} onclick="event.stopPropagation(); toggleShape('${shapeId}')">
                    <span class="item-label">${shape.label}</span>
                </div>
                <div class="shape-item-options">
                    <div class="option-row">
                        <label>Variant</label>
                        <select onchange="updateShapePreset('${shapeId}', this.value)">
                            ${shape.presets.map(p => `<option value="${p.id}" ${currentPreset === p.id ? 'selected' : ''}>${p.name}</option>`).join('')}
                        </select>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderLayoutTypes() {
    const container = document.getElementById('layout-type-selector');
    const categories = {
        'image': { label: 'Image Layouts', items: [] },
        'chart': { label: 'Chart Layouts', items: [] },
        'text': { label: 'Text Layouts', items: [] },
        'comparison': { label: 'Comparison', items: [] },
        'fancy': { label: 'Fancy Layouts', items: [] },
    };
    Object.entries(LAYOUT_TYPES).forEach(([id, layout]) => {
        if (categories[layout.category]) categories[layout.category].items.push({ id, ...layout });
    });
    container.innerHTML = Object.entries(categories).map(([catId, cat]) => {
        if (cat.items.length === 0) return '';
        return `
            <div class="layout-category" data-category="${catId}">
                <div class="layout-category-title">${cat.label}</div>
                <div class="layout-category-items">
                    ${cat.items.map(item => `
                        <div class="layout-type-item ${state.layoutType === item.id ? 'active' : ''}"
                             data-layout="${item.id}" onclick="selectLayoutType('${item.id}')">
                            <div class="layout-preview ${getLayoutPreviewClass(item)}">${renderLayoutPreviewZones(item)}</div>
                            <div class="layout-label">${item.label}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
}

function getLayoutPreviewClass(layout) {
    const id = layout.id;
    if (['image-left', 'image-right', 'chart-left', 'chart-right', 'two-column-equal', 'split-screen'].includes(id)) return 'horizontal';
    if (['image-top', 'image-bottom', 'hero-banner'].includes(id)) return 'vertical';
    if (['stats-dashboard', 'icon-grid'].includes(id)) return 'grid-4';
    if (['comparison-2', 'comparison-3', 'conclusion'].includes(id)) return 'grid-3';
    return 'center-single';
}

function renderLayoutPreviewZones(layout) {
    const { zones, id } = layout;
    if (id === 'edge-to-edge') return `<div class="zone zone-image" style="flex:1;position:relative;"><div style="position:absolute;bottom:0;left:0;right:0;height:40%;background:linear-gradient(transparent,rgba(0,0,0,0.5))"></div></div>`;
    if (id === 'timeline') return `<div class="zone zone-text" style="flex:1;display:flex;align-items:center;justify-content:center;"><div style="width:80%;height:3px;background:var(--accent-l3);position:relative;"><div style="position:absolute;top:-4px;left:10%;width:10px;height:10px;border-radius:50%;background:var(--accent-l3);"></div><div style="position:absolute;top:-4px;left:45%;width:10px;height:10px;border-radius:50%;background:var(--accent-l3);"></div><div style="position:absolute;top:-4px;left:80%;width:10px;height:10px;border-radius:50%;background:var(--accent-l3);"></div></div></div>`;
    return zones.map(zone => {
        let zoneClass = 'zone-text';
        if (['image', 'background', 'hero'].includes(zone)) zoneClass = 'zone-image';
        else if (zone === 'chart') zoneClass = 'zone-chart';
        else if (zone === 'metric') zoneClass = 'zone-metric';
        else if (zone === 'quote') zoneClass = 'zone-quote';
        else if (['card', 'icon', 'summary'].includes(zone)) zoneClass = 'zone-card';
        return `<div class="zone ${zoneClass}"></div>`;
    }).join('');
}

function renderMasterLayer() {
    let html = '';
    state.masterShapes.forEach(({ id: shapeId, preset: presetId }) => {
        const shapeMap = {
            'header-badge': `<div class="master-shape header-badge" data-preset="${presetId}">SECTION</div>`,
            'corner-tl': `<div class="master-shape corner-triangle" data-preset="${presetId}"></div>`,
            'corner-dots': `<div class="master-shape corner-dots" data-preset="${presetId}"></div>`,
            'accent-circle': `<div class="master-shape accent-circle" data-preset="${presetId}"></div>`,
            'top-line': `<div class="master-shape top-line" data-preset="${presetId}"></div>`,
            'side-bar': `<div class="master-shape side-bar" data-preset="${presetId}"></div>`,
            'footer-line': `<div class="master-shape footer-line" data-preset="${presetId}"></div>`,
        };
        html += shapeMap[shapeId] || '';
    });
    if (state.masterPlaceholders.includes('logo')) html += `<div class="master-placeholder logo">LOGO</div>`;
    if (state.masterPlaceholders.includes('page-number')) html += `<div class="master-placeholder page-number">3 / 12</div>`;
    if (state.masterPlaceholders.includes('date')) html += `<div class="master-placeholder date-field">2024-01-15</div>`;
    return html;
}

function renderContentLayer() {
    if (state.pageType === 'cover') return `<h1 class="page-title">演示文稿标题</h1><p class="page-subtitle">副标题或作者信息</p>`;
    if (state.pageType === 'divider') return renderDivider();
    return renderLayoutContent();
}

function renderDivider() {
    const layout = state.dividerLayout;
    const idx = state.dividerIndex; // 0=全部, 1-4=specific section
    if (layout === 'strips') return renderStrips(idx);
    if (layout === 'cards') return renderCards(idx);
    if (layout === 'cards-highlight') return renderCardsHighlight(idx);
    if (layout === 'arrow') return renderArrow(idx);
    if (layout === 'fullbleed') return renderFullbleed(idx);
    if (layout === 'left-align') return renderLeftAlign(idx);
    return '';
}

const SECTION_DATA = [
    { num: '1', zh: '年度工作概述', en: 'ANNUAL WORK OVERVIEW', part: '第一部分' },
    { num: '2', zh: '工作完成情况', en: 'WORK COMPLETION', part: '第二部分' },
    { num: '3', zh: '项目成果展示', en: 'PROJECT RESULTS', part: '第三部分' },
    { num: '4', zh: '工作不足与改进', en: 'IMPROVEMENTS', part: '第四部分' },
];

function renderStrips(activeIdx) {
    // activeIdx: 0=show all, 1-4=highlight specific
    return `
        <div class="toc-strips-left">
            <div class="toc-strips-label">CONTENTS</div>
            <h1 class="toc-strips-title">目录</h1>
            <div class="toc-strips-brand">WORK SUMMARY</div>
        </div>
        <div class="toc-strips-right">
            ${SECTION_DATA.map((item, i) => `
                <div class="toc-strip ${activeIdx > 0 && activeIdx - 1 === i ? 'active' : ''}" style="--strip-index:${i}">
                    <div class="strip-num">0${item.num}</div>
                    <div class="strip-en">${item.en}</div>
                    <div class="strip-zh">${item.zh}</div>
                    <div class="strip-line"></div>
                    <div class="strip-desc">在这里输入本章节的简要概述</div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderCards(activeIdx) {
    return `
        <div class="toc-cards-header"><h1>目录 / CONTENTS</h1></div>
        <div class="toc-cards-grid">
            ${SECTION_DATA.map((item, i) => `
                <div class="toc-card ${activeIdx > 0 && activeIdx - 1 === i ? 'active' : ''}">
                    <div class="toc-card-num">0${item.num}</div>
                    <div class="toc-card-title">${item.zh}</div>
                    <div class="toc-card-subtitle">${item.en}</div>
                    <div class="toc-card-divider"></div>
                    <ul class="toc-card-list"><li>${item.num}.1 细分内容</li><li>${item.num}.2 细分内容</li></ul>
                </div>
            `).join('')}
        </div>
    `;
}

function renderCardsHighlight(activeIdx) {
    const showIdx = activeIdx > 0 ? activeIdx - 1 : 0;
    return `
        <div class="toc-highlight-header"><h1>目录</h1></div>
        <div class="toc-highlight-grid">
            ${SECTION_DATA.map((item, i) => `
                <div class="toc-highlight-card ${i === showIdx ? 'active' : ''}">
                    <div class="toc-highlight-title">${item.zh}</div>
                    <div class="toc-highlight-en">${item.en}</div>
                    <div class="toc-highlight-num">${item.num}</div>
                </div>
            `).join('')}
        </div>
        <div class="toc-highlight-footer">PRIOR YEAR 2023 WORK SUMMARY</div>
    `;
}

function renderArrow(activeIdx) {
    const idx = activeIdx > 0 ? activeIdx - 1 : 0;
    const item = SECTION_DATA[idx];
    return `
        <div class="section-arrow-badge"><span>${item.part}</span></div>
        <h1 class="section-arrow-title">${item.zh}</h1>
        <p class="section-arrow-subtitle">${item.en}</p>
        <p class="section-arrow-desc">在这里输入本章节的简要概述，请将自己的内容在这个位置，展开简要描述</p>
        <div class="section-arrow-icons">
            <span>📋</span><span>📊</span><span>📁</span><span>👥</span><span>📥</span>
        </div>
    `;
}

function renderFullbleed(activeIdx) {
    const idx = activeIdx > 0 ? activeIdx - 1 : 0;
    const item = SECTION_DATA[idx];
    return `
        <div class="section-fullbleed-bg">PART 0${item.num}</div>
        <div class="section-fullbleed-content">
            <div class="section-fullbleed-line"><span class="dot"></span><span class="line"></span></div>
            <h1 class="section-fullbleed-title">${item.zh}</h1>
            <div class="section-fullbleed-line"><span class="line"></span><span class="dot"></span></div>
            <p class="section-fullbleed-subtitle">${item.en}</p>
            <p class="section-fullbleed-desc">在这里输入本章节的简要概述，请将自己的内容在这个位置，展开简要描述</p>
        </div>
    `;
}

function renderLeftAlign(activeIdx) {
    const idx = activeIdx > 0 ? activeIdx - 1 : 0;
    const item = SECTION_DATA[idx];
    return `
        <div class="section-left-topline"></div>
        <div class="section-left-logo">/ LOGO</div>
        <div class="section-left-content">
            <div class="section-left-part">${item.part}</div>
            <h1 class="section-left-title">${item.zh}</h1>
            <p class="section-left-subtitle">${item.en}</p>
        </div>
        <div class="section-left-num">${item.num}</div>
        <div class="section-left-footer">2023 WORK REPORT</div>
    `;
}

function renderLayoutContent() {
    let html = '';
    if (state.titleStyle === 'simple') html += `<div class="title-zone"><h1>市场趋势分析</h1></div>`;
    else if (state.titleStyle === 'with-tag') html += `<div class="title-zone"><span class="title-tag">分析报告</span><h1>市场趋势分析</h1></div>`;
    html += renderLayoutStructure();
    if (state.sourceStyle === 'citation') html += `<div class="source-zone">数据来源：行业研究报告 2024</div>`;
    return html;
}
