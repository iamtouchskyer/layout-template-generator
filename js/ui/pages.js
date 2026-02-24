// Multi-page list UI

const PAGE_TYPE_LABELS = {
    'cover': '封面',
    'divider': '目录',
    'content-grid': '内容-Grid',
    'content-smartart': '内容-SmartArt',
};

function getPageThumbTitle(page) {
    const data = page?.data || {};
    if (page.type === 'cover') return data.coverContent?.title || '封面';
    if (page.type === 'divider') return `章节 ${data.divider?.sectionIndex || data.dividerIndex || 1}`;
    if (page.type === 'content-smartart') return data.smartartType || 'smartart';
    if (page.type === 'content-grid') return data.gridLayout || 'grid';
    return page.type || 'page';
}

function renderPageThumbnail(page) {
    const data = page?.data || {};
    if (page.type === 'cover') {
        const title = getPageThumbTitle(page);
        return `
            <div class="page-thumb page-thumb-cover">
                <div class="thumb-cover-band"></div>
                <div class="thumb-cover-title">${title}</div>
            </div>
        `;
    }

    if (page.type === 'divider') {
        const n = data.divider?.sectionIndex || data.dividerIndex || 1;
        return `
            <div class="page-thumb page-thumb-divider">
                <div class="thumb-divider-strip"></div>
                <div class="thumb-divider-num">${String(n).padStart(2, '0')}</div>
            </div>
        `;
    }

    if (page.type === 'content-smartart') {
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
    if (typeof addPage !== 'function' || typeof listPages !== 'function' || typeof getCurrentPageId !== 'function') {
        return;
    }
    const pages = listPages();
    const currentId = getCurrentPageId();
    const currentIndex = pages.findIndex(p => p.id === currentId);
    addPage(type, currentIndex >= 0 ? currentIndex : null);
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

    const itemsHtml = pages.map((page, idx) => {
        const label = PAGE_TYPE_LABELS[page.type] || page.type;
        const subtitle = getPageThumbTitle(page);
        const active = page.id === currentId ? 'active' : '';
        return `
            <div class="page-item ${active}">
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
            <button class="page-add-btn" onclick="addPageAfterCurrent('cover')">+ 封面</button>
            <button class="page-add-btn" onclick="addPageAfterCurrent('divider')">+ 目录</button>
            <button class="page-add-btn" onclick="addPageAfterCurrent('content-grid')">+ Grid</button>
            <button class="page-add-btn" onclick="addPageAfterCurrent('content-smartart')">+ SmartArt</button>
        </div>
    `;
}

window.renderPageList = renderPageList;
window.selectPageById = selectPageById;
window.addPageAfterCurrent = addPageAfterCurrent;
window.duplicatePageById = duplicatePageById;
window.deletePageById = deletePageById;
window.movePageUp = movePageUp;
window.movePageDown = movePageDown;
