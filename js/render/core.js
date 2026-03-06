// Core render functions

function render() {
    const slide = document.getElementById('slide');
    const masterLayer = document.getElementById('master-layer');
    const contentLayer = document.getElementById('content-layer');

    slide.setAttribute('data-theme', state.theme);
    let pageClass = `page-type-${state.pageType}`;
    if (state.pageType === 'divider') {
        pageClass = `page-type-divider-${state.dividerLayout} bg-${state.dividerBgStyle}`;
    } else if (state.pageType === 'content-smartart') {
        pageClass = `page-type-smartart placement-${state.smartartPlacement}`;
    }
    slide.className = `slide-container ${pageClass}`;

    contentLayer.style.visibility = 'hidden';
    masterLayer.innerHTML = renderMasterLayer();
    contentLayer.innerHTML = renderContentLayer();

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            contentLayer.style.visibility = '';
        });
    });

    updateNavValues();
    if (typeof refreshPageModelControls === 'function') refreshPageModelControls();
    if (typeof renderPageList === 'function') renderPageList();
    if (state.previewTab === 'json') updateJsonOutput();

    if (state.pageType === 'content-grid') {
        setTimeout(() => initZoneCharts(), 0);
    }
    if (state.pageType === 'content-smartart') {
        if (typeof renderSmartartTypeSelector === 'function') renderSmartartTypeSelector();
        if (typeof renderSmartartCountSelector === 'function') renderSmartartCountSelector();
        if (typeof renderSmartartPlacements === 'function') renderSmartartPlacements();
        if (typeof renderSmartartColorSelector === 'function') renderSmartartColorSelector();
    }

    renderSmartartTextEditor();
    if (typeof updateHistoryButtons === 'function') updateHistoryButtons();
}

function renderContentLayer() {
    if (state.pageType === 'cover') return renderCover();
    if (state.pageType === 'divider') return renderDivider();
    if (state.pageType === 'content-smartart') return renderSmartartPage();
    if (state.pageType === 'content-grid') return renderGridContent();
    return '';
}

function resolveContentShellText() {
    const page = (typeof getCurrentPage === 'function') ? getCurrentPage() : null;
    const data = page?.data || {};
    const title = String(data.contentTitle || state.contentTitle || '市场趋势分析').trim() || '市场趋势分析';
    const tag = String(data.contentTag || state.contentTag || '分析报告').trim() || '分析报告';
    const source = String(data.contentSource || state.contentSource || '行业研究报告 2024').trim() || '行业研究报告 2024';
    return { title, tag, source };
}

function renderContentShell(options = {}) {
    const shellOptions = options || {};
    const titleStyle = state.masterContentAreas.titleStyle || 'with-tag';
    const sourceStyle = state.masterContentAreas.sourceStyle || 'citation';
    const hasTitle = shellOptions.hasTitle !== undefined ? shellOptions.hasTitle : titleStyle !== 'none';
    const hasSourceCitation = shellOptions.hasSourceCitation !== undefined
        ? shellOptions.hasSourceCitation
        : sourceStyle === 'citation';

    let html = '';

    if (hasTitle) {
        const headerBounds = getHeaderBoundsFromConfig(state);
        const headerStyle = `position: absolute; top: ${headerBounds.top}px; left: ${headerBounds.left}px; right: ${headerBounds.right}px; height: ${headerBounds.height}px; display: flex; flex-direction: column; justify-content: flex-end;`;
        const shellText = resolveContentShellText();

        if (titleStyle === 'simple') {
            html += `<div class="header-area" style="${headerStyle}"><div class="title-zone"><h1>${shellText.title}</h1></div></div>`;
        } else if (titleStyle === 'with-tag') {
            html += `<div class="header-area" style="${headerStyle}"><div class="title-zone"><span class="title-tag">${shellText.tag}</span><h1>${shellText.title}</h1></div></div>`;
        }
    }

    const bodyBounds = getBodyBoundsFromConfig(state, hasTitle);
    const bodyStyle = `position: absolute; top: ${bodyBounds.top}px; left: ${bodyBounds.left}px; right: ${bodyBounds.right}px; bottom: ${bodyBounds.bottom}px; display: flex; flex-direction: column; overflow: hidden;`;
    html += `<div class="body-area" style="${bodyStyle}">${shellOptions.bodyHtml || ''}</div>`;

    if (hasSourceCitation) {
        const contentBounds = getContentBoundsFromConfig(state);
        const footerHeight = CONTENT_AREAS.footer.getHeight(state.masterContentAreas.footerHeight || 'compact');
        const footerBottom = 10;
        const footerAreaStyle = `position: absolute; left: ${contentBounds.left}px; right: ${contentBounds.right}px; bottom: ${footerBottom}px; height: ${footerHeight}px;`;
        const shellText = resolveContentShellText();
        const sourceText = shellOptions.sourceText || `数据来源：${shellText.source}`;
        html += `<div class="footer-area" style="${footerAreaStyle}"><div class="source-zone">${sourceText}</div></div>`;
    }

    return html;
}

function renderLayoutContent() {
    let html = '';
    if (state.masterContentAreas.titleStyle === 'simple') html += `<div class="title-zone"><h1>市场趋势分析</h1></div>`;
    else if (state.masterContentAreas.titleStyle === 'with-tag') html += `<div class="title-zone"><span class="title-tag">分析报告</span><h1>市场趋势分析</h1></div>`;
    html += renderLayoutStructure();
    if (state.masterContentAreas.sourceStyle === 'citation') html += `<div class="source-zone">数据来源：行业研究报告 2024</div>`;
    return html;
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

window.renderContentShell = renderContentShell;
window.resolveContentShellText = resolveContentShellText;
