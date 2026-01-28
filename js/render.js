// Render Functions

function render() {
    const slide = document.getElementById('slide');
    const masterLayer = document.getElementById('master-layer');
    const contentLayer = document.getElementById('content-layer');

    slide.setAttribute('data-theme', state.theme);
    let pageClass = `page-type-${state.pageType}`;
    if (state.pageType === 'divider') {
        pageClass = `page-type-divider-${state.dividerLayout}`;
    } else if (state.pageType === 'content-smartart') {
        pageClass = `page-type-smartart placement-${state.smartartPlacement}`;
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
    let decorativeHtml = '';  // Background decorations (z-index: 0)
    let shapeHtml = '';       // Space-occupying shapes (z-index: 1)

    state.masterShapes.forEach(({ id: shapeId, preset: presetId }) => {
        const shapeConfig = SHAPE_PRESETS[shapeId];
        const isDecorative = shapeConfig && shapeConfig.occupiesSpace === false;

        const shapeMap = {
            // Space-occupying shapes
            'header-badge': `<div class="master-shape header-badge" data-preset="${presetId}">SECTION</div>`,
            'top-line': `<div class="master-shape top-line" data-preset="${presetId}"></div>`,
            'footer-line': `<div class="master-shape footer-line" data-preset="${presetId}"></div>`,
            'side-bar': `<div class="master-shape side-bar" data-preset="${presetId}"></div>`,
            // Decorative shapes (pure background)
            'corner': `<div class="master-shape decorative corner-shape" data-preset="${presetId}"></div>`,
            'corner-dots': `<div class="master-shape decorative corner-dots" data-preset="${presetId}"></div>`,
            'accent-circle': `<div class="master-shape decorative accent-circle" data-preset="${presetId}"></div>`,
        };

        const shapeHtmlContent = shapeMap[shapeId] || '';
        if (isDecorative) {
            decorativeHtml += shapeHtmlContent;
        } else {
            shapeHtml += shapeHtmlContent;
        }
    });

    // Placeholders
    let placeholderHtml = '';
    if (state.masterPlaceholders.includes('logo')) placeholderHtml += `<div class="master-placeholder logo">LOGO</div>`;
    if (state.masterPlaceholders.includes('page-number')) placeholderHtml += `<div class="master-placeholder page-number">3 / 12</div>`;
    if (state.masterPlaceholders.includes('date')) placeholderHtml += `<div class="master-placeholder date-field">2024-01-15</div>`;

    // Content boundary indicator for L2
    let boundaryHtml = '';
    if (state.activeLayer === 2 && (state.pageType === 'content-grid' || state.pageType === 'content-smartart')) {
        boundaryHtml = renderContentBoundary();
    }

    // Order: decorative (back) → shapes → placeholders → boundary (front)
    return decorativeHtml + shapeHtml + placeholderHtml + boundaryHtml;
}

/**
 * Calculate content area bounds based on header/footer placeholders and space-occupying shapes
 * Note: Decorative shapes (corner, corner-dots, accent-circle) do NOT affect bounds
 * Returns { top, right, bottom, left } in pixels
 */
function getContentBounds() {
    // Use the config-loader function
    return getContentBoundsFromConfig(state);
}

/**
 * Render content boundary with zone visualization
 */
function renderContentBoundary() {
    const bounds = getContentBounds();
    const slideWidth = SLIDE_CONFIG.width;
    const slideHeight = SLIDE_CONFIG.height;

    const width = slideWidth - bounds.left - bounds.right;
    const height = slideHeight - bounds.top - bounds.bottom;

    // Get current grid layout
    const gridLayout = GRID_LAYOUTS[state.gridLayout];
    if (!gridLayout) {
        return `
            <div class="content-boundary" style="top: ${bounds.top}px; left: ${bounds.left}px; width: ${width}px; height: ${height}px;">
                <div class="content-boundary-label">Content Area (${width}×${height}px)</div>
            </div>
        `;
    }

    // Render zones based on layout
    const zoneColors = {
        'A': 'rgba(56, 161, 105, 0.15)',
        'B': 'rgba(66, 153, 225, 0.15)',
        'C': 'rgba(237, 137, 54, 0.15)',
        'D': 'rgba(159, 122, 234, 0.15)'
    };

    let zonesHtml = '';
    if (gridLayout.direction === 'grid') {
        // 2x2 grid layout
        zonesHtml = `<div class="zone-grid-2x2">
            ${gridLayout.zones.map(zone => {
                const contentType = state.zoneContents[zone.id] || 'text';
                return `<div class="zone-box" style="background: ${zoneColors[zone.id]}">
                    <span class="zone-label">${zone.id}</span>
                    <span class="zone-type">${contentType}</span>
                </div>`;
            }).join('')}
        </div>`;
    } else if (gridLayout.direction === 'custom') {
        // Custom layout (like top-two-bottom)
        zonesHtml = `<div class="zone-custom-layout" data-layout="${state.gridLayout}">
            ${gridLayout.zones.map(zone => {
                const contentType = state.zoneContents[zone.id] || 'text';
                return `<div class="zone-box" style="flex: ${zone.flex}; background: ${zoneColors[zone.id]}">
                    <span class="zone-label">${zone.id}</span>
                    <span class="zone-type">${contentType}</span>
                </div>`;
            }).join('')}
        </div>`;
    } else {
        // Row or column layout
        const direction = gridLayout.direction === 'column' ? 'column' : 'row';
        zonesHtml = `<div class="zone-flex-layout" style="flex-direction: ${direction}">
            ${gridLayout.zones.map(zone => {
                const contentType = state.zoneContents[zone.id] || 'text';
                return `<div class="zone-box" style="flex: ${zone.flex}; background: ${zoneColors[zone.id]}">
                    <span class="zone-label">${zone.id}</span>
                    <span class="zone-type">${contentType}</span>
                </div>`;
            }).join('')}
        </div>`;
    }

    return `
        <div class="content-boundary" style="top: ${bounds.top}px; left: ${bounds.left}px; width: ${width}px; height: ${height}px;">
            <div class="content-boundary-label">Content Area (${width}×${height}px) · ${gridLayout.label}</div>
            ${zonesHtml}
        </div>
    `;
}

function renderContentLayer() {
    if (state.pageType === 'cover') return `<h1 class="page-title">演示文稿标题</h1><p class="page-subtitle">副标题或作者信息</p>`;
    if (state.pageType === 'divider') return renderDivider();
    if (state.pageType === 'content-smartart') return renderSmartartPage();
    if (state.pageType === 'content-grid') return renderGridContent();
    return '';
}

function renderGridContent() {
    const gridLayout = GRID_LAYOUTS[state.gridLayout];
    if (!gridLayout) return '';

    // Get content bounds based on master elements
    const bounds = getContentBounds();
    const boundsStyle = `position: absolute; top: ${bounds.top}px; left: ${bounds.left}px; right: ${bounds.right}px; bottom: ${bounds.bottom}px; display: flex; flex-direction: column;`;

    let innerHtml = '';

    // Title zone
    if (state.titleStyle === 'simple') {
        innerHtml += `<div class="title-zone"><h1>市场趋势分析</h1></div>`;
    } else if (state.titleStyle === 'with-tag') {
        innerHtml += `<div class="title-zone"><span class="title-tag">分析报告</span><h1>市场趋势分析</h1></div>`;
    }

    // Content zones based on grid layout
    const direction = gridLayout.direction === 'column' ? 'column' : 'row';
    const layoutClass = gridLayout.direction === 'grid' ? 'grid-layout-2x2' : `flex-layout-${direction}`;

    innerHtml += `<div class="grid-content ${layoutClass}">`;
    gridLayout.zones.forEach(zone => {
        const contentType = state.zoneContents[zone.id] || 'text';
        innerHtml += `<div class="grid-zone" style="flex: ${zone.flex}">
            ${renderZoneContent(contentType, zone.id)}
        </div>`;
    });
    innerHtml += `</div>`;

    // Source citation
    if (state.sourceStyle === 'citation') {
        innerHtml += `<div class="source-zone">数据来源：行业研究报告 2024</div>`;
    }

    // Wrap content in bounded container
    return `<div class="content-bounded" style="${boundsStyle}">${innerHtml}</div>`;
}

function renderZoneContent(contentType, zoneId) {
    switch (contentType) {
        case 'chart':
            return `<div class="zone-preview zone-chart-preview">
                <div class="chart-placeholder">📊 Chart ${zoneId}</div>
            </div>`;
        case 'image':
            return `<div class="zone-preview zone-image-preview">
                <div class="image-placeholder">🖼️ Image ${zoneId}</div>
            </div>`;
        case 'metric':
            return `<div class="zone-preview zone-metric-preview">
                <div class="metric-value">85%</div>
                <div class="metric-label">关键指标</div>
            </div>`;
        case 'table':
            return `<div class="zone-preview zone-table-preview">
                <div class="table-placeholder">📋 Table ${zoneId}</div>
            </div>`;
        case 'bullets':
            return `<div class="zone-preview zone-bullets-preview">
                <ul><li>要点一</li><li>要点二</li><li>要点三</li></ul>
            </div>`;
        case 'text':
        default:
            return `<div class="zone-preview zone-text-preview">
                <h3>区域 ${zoneId}</h3>
                <p>这里是文本内容区域，可以放置段落、描述或说明文字。</p>
            </div>`;
    }
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

// SmartArt Page Rendering
function renderSmartartPage() {
    const placement = state.smartartPlacement;

    const smartartContainer = `<div class="smartart-main"><div id="smartart-render-target"></div></div>`;

    const descBlock = `
        <div class="smartart-desc-block">
            <h3>说明文字区域</h3>
            <p>这里可以放置对 SmartArt 图形的描述、解释或相关数据说明。</p>
            <ul>
                <li>要点一：关键信息</li>
                <li>要点二：补充说明</li>
                <li>要点三：总结概括</li>
            </ul>
        </div>
    `;

    let html = '';
    if (placement === 'full') {
        html = `<div class="smartart-layout smartart-full">${smartartContainer}</div>`;
    } else if (placement === 'left-desc') {
        html = `<div class="smartart-layout smartart-left-desc">${smartartContainer}<div class="smartart-side">${descBlock}</div></div>`;
    } else if (placement === 'right-desc') {
        html = `<div class="smartart-layout smartart-right-desc"><div class="smartart-side">${descBlock}</div>${smartartContainer}</div>`;
    } else if (placement === 'top-desc') {
        html = `<div class="smartart-layout smartart-top-desc">${smartartContainer}<div class="smartart-side">${descBlock}</div></div>`;
    } else if (placement === 'bottom-desc') {
        html = `<div class="smartart-layout smartart-bottom-desc"><div class="smartart-side">${descBlock}</div>${smartartContainer}</div>`;
    } else {
        html = smartartContainer;
    }

    // Schedule infographic rendering after DOM update
    setTimeout(() => renderInfographic(), 0);
    return html;
}

// Sample data for different SmartArt types
const SMARTART_SAMPLE_DATA = {
    sequential: [
        { label: '第一阶段', value: 25, description: '规划与准备' },
        { label: '第二阶段', value: 50, description: '执行与开发' },
        { label: '第三阶段', value: 75, description: '测试与优化' },
        { label: '第四阶段', value: 100, description: '发布与维护' },
    ],
    funnel: [
        { label: '曝光', value: 10000, description: '广告展示' },
        { label: '点击', value: 3000, description: '用户点击' },
        { label: '注册', value: 800, description: '完成注册' },
        { label: '付费', value: 200, description: '付费转化' },
    ],
    journey: [
        { label: '需求分析', description: '明确项目目标' },
        { label: '方案设计', description: '制定实施计划' },
        { label: '开发实现', description: '编码与集成' },
        { label: '上线运营', description: '部署与监控' },
    ],
    hierarchy: [
        { label: '战略层', description: '企业愿景与目标' },
        { label: '管理层', description: '资源调配与决策' },
        { label: '执行层', description: '任务执行与反馈' },
        { label: '支撑层', description: '基础设施与工具' },
    ],
    comparison: [
        { label: '方案 A', description: '成本低，周期长' },
        { label: '方案 B', description: '成本中，周期中' },
        { label: '方案 C', description: '成本高，周期短' },
    ],
};

function renderInfographic() {
    const target = document.getElementById('smartart-render-target');
    if (!target) return;

    const typeInfo = SMARTART_TYPES[state.smartartType];
    if (!typeInfo) return;

    const dataType = typeInfo.dataType || 'comparison';
    const sampleData = SMARTART_SAMPLE_DATA[dataType] || SMARTART_SAMPLE_DATA.comparison;

    // Calculate size based on placement
    const isVertical = state.smartartPlacement === 'top-desc' || state.smartartPlacement === 'bottom-desc';
    const isFull = state.smartartPlacement === 'full';
    const width = isFull ? 1000 : (isVertical ? 1000 : 600);
    const height = isFull ? 500 : (isVertical ? 300 : 450);

    // Map theme to infographic color scheme
    const themeToScheme = {
        'soft_peach_cream': 'warm',
        'executive': 'professional',
        'forest_green': 'nature',
        'sunset_orange': 'sunset',
        'cosmic': 'cool',
        'azure': 'professional',
        'bright_red_blue': 'vibrant',
        'bright_blue_red': 'vibrant',
        'deep_red_blue': 'professional',
        'deep_green_gold': 'nature',
        'deep_blue_gold': 'professional',
        'blue_green_gold': 'ocean',
    };
    const colorScheme = themeToScheme[state.theme] || 'professional';

    try {
        target.innerHTML = '';
        new Infographic({
            container: target,
            type: state.smartartType,
            data: sampleData,
            width: width,
            height: height,
            theme: colorScheme,
        });
    } catch (e) {
        console.warn('Infographic render failed:', e.message);
        target.innerHTML = `<div class="smartart-fallback">
            <div class="smartart-icon">${SMARTART_CATEGORIES[typeInfo.category]?.icon || '📊'}</div>
            <div class="smartart-type-name">${typeInfo.label}</div>
            <div class="smartart-error">${e.message}</div>
        </div>`;
    }
}

function renderLayoutContent() {
    let html = '';
    if (state.titleStyle === 'simple') html += `<div class="title-zone"><h1>市场趋势分析</h1></div>`;
    else if (state.titleStyle === 'with-tag') html += `<div class="title-zone"><span class="title-tag">分析报告</span><h1>市场趋势分析</h1></div>`;
    html += renderLayoutStructure();
    if (state.sourceStyle === 'citation') html += `<div class="source-zone">数据来源：行业研究报告 2024</div>`;
    return html;
}
