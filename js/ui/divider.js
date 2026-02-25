// Divider Page Control Functions

// Constants for divider styles
const NUMBER_STYLES = [
    { id: 'arabic', label: '1,2,3' },
    { id: 'roman', label: 'I,II,III' },
    { id: 'chinese', label: '一,二,三' },
    { id: 'circled', label: '①②③' },
];

const TEXT_LEVELS = [
    { id: 'full', label: '完整' },
    { id: 'compact', label: '简洁' },
];

const BG_STYLES = [
    { id: 'solid', label: '纯色' },
    { id: 'gradient', label: '渐变' },
    { id: 'split', label: '分屏' },
    { id: 'light', label: '浅色' },
];

/**
 * Render divider layout style selector
 */
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

/**
 * Render section count selector
 */
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

/**
 * Render number style selector
 */
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

/**
 * Select number style
 */
function selectDividerNumberStyle(style) {
    patchCurrentPage({ dividerNumberStyle: style });
    renderDividerNumberSelector();
}

/**
 * Render text level selector
 */
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

/**
 * Select text level
 */
function selectDividerTextLevel(level) {
    patchCurrentPage({ dividerTextLevel: level });
    renderDividerTextSelector();
}

/**
 * Render background style selector
 */
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

/**
 * Select background style
 */
function selectDividerBgStyle(style) {
    patchCurrentPage({ dividerBgStyle: style });
    renderDividerBgSelector();
}

/**
 * Render divider index selector
 */
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

/**
 * Select divider layout
 */
function selectDividerLayout(layoutId) {
    patchCurrentPage({ dividerLayout: layoutId });
    renderDividerStyleSelector();
}

/**
 * Select section count
 */
function selectDividerCount(count) {
    const nextIndex = state.dividerIndex > count ? 0 : state.dividerIndex;
    patchCurrentPage({
        dividerSectionCount: count,
        dividerIndex: nextIndex,
    });
    renderDividerCountSelector();
    renderDividerIndexSelector();
}

/**
 * Select highlighted section index
 */
function selectDividerIndex(index) {
    patchCurrentPage({ dividerIndex: index });
    renderDividerIndexSelector();
}
