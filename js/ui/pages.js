// Multi-page list UI

const PAGE_TYPE_LABELS = {
    'cover': '封面',
    'divider': '目录',
    'content-grid': '内容-Grid',
    'content-smartart': '内容-SmartArt',
};

function _pageModelUtils() {
    return window.__pageModelUtils || {};
}

function resolvePageType(page) {
    const utils = _pageModelUtils();
    if (typeof utils.resolvePageType === 'function') {
        return utils.resolvePageType(page, 'content-grid');
    }
    if (page?.type) return page.type;
    if ((page?.shell || page?.pageShell) === 'cover') return 'cover';
    if ((page?.shell || page?.pageShell) === 'divider') return 'divider';
    if ((page?.shell || page?.pageShell) === 'content' && (page?.renderer || page?.bodyRenderer) === 'smartart') {
        return 'content-smartart';
    }
    return 'content-grid';
}

function resolvePageModel(page) {
    const utils = _pageModelUtils();
    if (typeof utils.resolvePageModel === 'function') {
        return utils.resolvePageModel(page, 'content-grid');
    }
    const type = resolvePageType(page);
    if (type === 'cover') return { type, shell: 'cover', renderer: 'cover', layout: page?.layout || page?.bodyLayout };
    if (type === 'divider') return { type, shell: 'divider', renderer: 'divider', layout: page?.layout || page?.bodyLayout };
    if (type === 'content-smartart') return { type, shell: 'content', renderer: 'smartart', layout: page?.layout || page?.bodyLayout };
    return { type, shell: 'content', renderer: 'grid', layout: page?.layout || page?.bodyLayout };
}

function getPageThumbTitle(page) {
    const data = page?.data || {};
    const model = resolvePageModel(page);
    if (model.type === 'cover') return data.coverContent?.title || model.layout || 'cover';
    if (model.type === 'divider') return model.layout || `章节 ${data.divider?.sectionIndex || data.dividerIndex || 1}`;
    if (model.type === 'content-smartart') return model.layout || data.smartartType || 'smartart';
    if (model.type === 'content-grid') return model.layout || data.gridLayout || 'grid';
    return `${model.shell}/${model.renderer}`;
}

function renderPageThumbnail(page) {
    const model = resolvePageModel(page);
    const data = page?.data || {};
    if (model.type === 'cover') {
        const title = getPageThumbTitle(page);
        return `
            <div class="page-thumb page-thumb-cover">
                <div class="thumb-cover-band"></div>
                <div class="thumb-cover-title">${title}</div>
            </div>
        `;
    }

    if (model.type === 'divider') {
        const n = data.divider?.sectionIndex || data.dividerIndex || 1;
        return `
            <div class="page-thumb page-thumb-divider">
                <div class="thumb-divider-strip"></div>
                <div class="thumb-divider-num">${String(n).padStart(2, '0')}</div>
            </div>
        `;
    }

    if (model.type === 'content-smartart') {
        return `
            <div class="page-thumb page-thumb-smartart">
                <div class="thumb-sa-row">
                    <span class="thumb-sa-shape"></span>
                    <span class="thumb-sa-shape"></span>
                </div>
                <div class="thumb-sa-row">
                    <span class="thumb-sa-shape"></span>
                    <span class="thumb-sa-shape"></span>
                </div>
            </div>
        `;
    }

    // content-grid / fallback
    return `
        <div class="page-thumb page-thumb-grid">
            <div class="thumb-grid-col"></div>
            <div class="thumb-grid-col"></div>
        </div>
    `;
}

function syncPageTypeRadio() {
    const currentType = state.pageType;
    document.querySelectorAll('input[name="page-type"]').forEach(input => {
        input.checked = input.value === currentType;
    });
}

function refreshCurrentPageTypeUI() {
    if (typeof updatePageType === 'function') {
        updatePageType(state.pageType, { recordHistory: false });
        return;
    }
    syncPageTypeRadio();
}

function selectPageById(pageId) {
    if (typeof setCurrentPage === 'function') {
        setCurrentPage(pageId);
        refreshCurrentPageTypeUI();
    }
}

function addPageAfterCurrent(type) {
    const model = resolvePageModel({ type });
    addPageAfterCurrentByModel(model.shell, model.renderer, null);
}

function addPageAfterCurrentByModel(shell, renderer, layout = null) {
    if (typeof listPages !== 'function' || typeof getCurrentPageId !== 'function') {
        return;
    }
    const pages = listPages();
    const currentId = getCurrentPageId();
    const currentIndex = pages.findIndex(p => p.id === currentId);
    if (typeof addPageByModel === 'function') {
        addPageByModel(shell, renderer, layout, currentIndex >= 0 ? currentIndex : null);
    } else if (typeof addPage === 'function') {
        const type = resolvePageType({ shell, renderer });
        addPage(type, currentIndex >= 0 ? currentIndex : null);
    }
    refreshCurrentPageTypeUI();
}

function duplicatePageById(pageId) {
    if (typeof duplicatePage !== 'function') return;
    duplicatePage(pageId);
    refreshCurrentPageTypeUI();
}

function deletePageById(pageId) {
    if (typeof deletePage !== 'function') return;
    deletePage(pageId);
    refreshCurrentPageTypeUI();
}

function movePageUp(pageId) {
    if (typeof listPages !== 'function' || typeof movePage !== 'function') return;
    const pages = listPages();
    const index = pages.findIndex(p => p.id === pageId);
    if (index <= 0) return;
    movePage(index, index - 1);
}

function movePageDown(pageId) {
    if (typeof listPages !== 'function' || typeof movePage !== 'function') return;
    const pages = listPages();
    const index = pages.findIndex(p => p.id === pageId);
    if (index < 0 || index >= pages.length - 1) return;
    movePage(index, index + 1);
}

function renderPageList() {
    const container = document.getElementById('page-list-sidebar');
    if (!container || typeof listPages !== 'function') return;

    const pages = listPages();
    const currentId = (typeof getCurrentPageId === 'function') ? getCurrentPageId() : state.ui?.currentPageId;
    const currentItems = container.querySelector('.page-list-items');
    const previousScrollTop = currentItems ? currentItems.scrollTop : 0;
    const structureKey = pages.map((page) => {
        const model = resolvePageModel(page);
        const subtitle = getPageThumbTitle(page);
        return [
            page?.id || '',
            model.type || '',
            model.shell || '',
            model.renderer || '',
            model.layout || '',
            subtitle || '',
        ].join('::');
    }).join('||');

    if (structureKey === renderPageList._structureKey && pages.length === renderPageList._count) {
        if (currentId !== renderPageList._activeId) {
            container.querySelectorAll('.page-item').forEach((node) => {
                node.classList.toggle('active', node.dataset.pageId === currentId);
            });
            renderPageList._activeId = currentId;
        }
        return;
    }

    const itemsHtml = pages.map((page, idx) => {
        const model = resolvePageModel(page);
        const label = `${model.shell}/${model.renderer}`;
        const subtitle = getPageThumbTitle(page);
        const active = page.id === currentId ? 'active' : '';
        return `
            <div class="page-item ${active}" data-page-id="${page.id}">
                <div class="page-item-main" onclick="selectPageById('${page.id}')">
                    <span class="page-item-index">${idx + 1}</span>
                    <div class="page-item-body">
                        ${renderPageThumbnail(page)}
                        <div class="page-item-meta">
                            <span class="page-item-type">${label}</span>
                            <span class="page-item-subtitle">${subtitle}</span>
                        </div>
                    </div>
                </div>
                <div class="page-item-actions">
                    <button class="page-action-btn" onclick="movePageUp('${page.id}')" title="上移">↑</button>
                    <button class="page-action-btn" onclick="movePageDown('${page.id}')" title="下移">↓</button>
                    <button class="page-action-btn" onclick="duplicatePageById('${page.id}')" title="复制">复制</button>
                    <button class="page-action-btn" onclick="deletePageById('${page.id}')" title="删除">删</button>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <div class="page-list-header">Pages (${pages.length})</div>
        <div class="page-list-items">${itemsHtml}</div>
        <div class="page-list-footer">
            <button class="page-add-btn" onclick="addPageAfterCurrentByModel('cover','cover')">+ 封面</button>
            <button class="page-add-btn" onclick="addPageAfterCurrentByModel('divider','divider')">+ 目录</button>
            <button class="page-add-btn" onclick="addPageAfterCurrentByModel('content','grid')">+ Grid</button>
            <button class="page-add-btn" onclick="addPageAfterCurrentByModel('content','smartart')">+ SmartArt</button>
        </div>
    `;

    const nextItems = container.querySelector('.page-list-items');
    if (nextItems && previousScrollTop > 0) {
        nextItems.scrollTop = previousScrollTop;
    }
    renderPageList._structureKey = structureKey;
    renderPageList._activeId = currentId;
    renderPageList._count = pages.length;
}

window.renderPageList = renderPageList;
window.selectPageById = selectPageById;
window.addPageAfterCurrent = addPageAfterCurrent;
window.addPageAfterCurrentByModel = addPageAfterCurrentByModel;
window.duplicatePageById = duplicatePageById;
window.deletePageById = deletePageById;
window.movePageUp = movePageUp;
window.movePageDown = movePageDown;
