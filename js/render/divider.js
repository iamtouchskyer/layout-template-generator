// Divider page rendering functions

const SECTION_DATA = [
    { num: '1', zh: '年度工作概述', en: 'ANNUAL WORK OVERVIEW', part: '第一部分' },
    { num: '2', zh: '工作完成情况', en: 'WORK COMPLETION', part: '第二部分' },
    { num: '3', zh: '项目成果展示', en: 'PROJECT RESULTS', part: '第三部分' },
    { num: '4', zh: '工作不足与改进', en: 'IMPROVEMENTS', part: '第四部分' },
    { num: '5', zh: '未来发展规划', en: 'FUTURE PLANS', part: '第五部分' },
    { num: '6', zh: '总结与展望', en: 'SUMMARY & OUTLOOK', part: '第六部分' },
];

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI'];
const CHINESE_NUMERALS = ['一', '二', '三', '四', '五', '六'];
const CIRCLED_NUMERALS = ['①', '②', '③', '④', '⑤', '⑥'];

function renderDivider() {
    const layout = state.dividerLayout;
    const idx = state.dividerIndex;
    if (layout === 'strips') return renderStrips(idx);
    if (layout === 'cards') return renderCards(idx);
    if (layout === 'cards-highlight') return renderCardsHighlight(idx);
    if (layout === 'arrow') return renderArrow(idx);
    if (layout === 'fullbleed') return renderFullbleed(idx);
    if (layout === 'left-align') return renderLeftAlign(idx);
    if (layout === 'left-align-mirror') return renderLeftAlignMirror(idx);
    if (layout === 'left-align-minimal') return renderLeftAlignMinimal(idx);
    return '';
}

function getSectionData() {
    return SECTION_DATA.slice(0, state.dividerSectionCount);
}

function formatNumber(n, style) {
    const idx = parseInt(n) - 1;
    switch (style || state.dividerNumberStyle) {
        case 'roman': return ROMAN_NUMERALS[idx] || n;
        case 'chinese': return CHINESE_NUMERALS[idx] || n;
        case 'circled': return CIRCLED_NUMERALS[idx] || n;
        case 'arabic':
        default: return n;
    }
}

function formatNumberPadded(n, style) {
    const formatted = formatNumber(n, style);
    if ((style || state.dividerNumberStyle) === 'arabic') {
        return '0' + formatted;
    }
    return formatted;
}

function formatPart(n, style) {
    const s = style || state.dividerNumberStyle;
    const num = formatNumber(n, s);
    switch (s) {
        case 'roman': return `Part ${num}`;
        case 'chinese': return `第${num}部分`;
        case 'circled': return `Part ${num}`;
        case 'arabic':
        default: return `第${num}部分`;
    }
}

function isCompact() {
    return state.dividerTextLevel === 'compact';
}

function renderStrips(activeIdx) {
    const sections = getSectionData();
    const compact = isCompact();
    return `
        <div class="toc-strips-left">
            <div class="toc-strips-label">CONTENTS</div>
            <h1 class="toc-strips-title">目录</h1>
            ${compact ? '' : '<div class="toc-strips-brand">WORK SUMMARY</div>'}
        </div>
        <div class="toc-strips-right">
            ${sections.map((item, i) => `
                <div class="toc-strip ${activeIdx > 0 && activeIdx - 1 === i ? 'active' : ''}" style="--strip-index:${i}">
                    <div class="strip-num">${formatNumberPadded(item.num)}</div>
                    ${compact ? '' : `<div class="strip-en">${item.en}</div>`}
                    <div class="strip-zh">${item.zh}</div>
                    ${compact ? '' : '<div class="strip-line"></div><div class="strip-desc">在这里输入本章节的简要概述</div>'}
                </div>
            `).join('')}
        </div>
    `;
}

function renderCards(activeIdx) {
    const sections = getSectionData();
    const compact = isCompact();
    return `
        <div class="toc-cards-header"><h1>目录 / CONTENTS</h1></div>
        <div class="toc-cards-grid">
            ${sections.map((item, i) => `
                <div class="toc-card ${activeIdx > 0 && activeIdx - 1 === i ? 'active' : ''}">
                    <div class="toc-card-num">${formatNumberPadded(item.num)}</div>
                    <div class="toc-card-title">${item.zh}</div>
                    ${compact ? '' : `<div class="toc-card-subtitle">${item.en}</div>
                    <div class="toc-card-divider"></div>
                    <ul class="toc-card-list"><li>${formatNumber(item.num)}.1 细分内容</li><li>${formatNumber(item.num)}.2 细分内容</li></ul>`}
                </div>
            `).join('')}
        </div>
    `;
}

function renderCardsHighlight(activeIdx) {
    const sections = getSectionData();
    const compact = isCompact();
    const showIdx = activeIdx > 0 ? activeIdx - 1 : -1;
    return `
        <div class="toc-highlight-header"><h1>目录</h1></div>
        <div class="toc-highlight-grid">
            ${sections.map((item, i) => `
                <div class="toc-highlight-card ${i === showIdx ? 'active' : ''}">
                    <div class="toc-highlight-title">${item.zh}</div>
                    ${compact ? '' : `<div class="toc-highlight-en">${item.en}</div>`}
                    <div class="toc-highlight-num">${formatNumber(item.num)}</div>
                </div>
            `).join('')}
        </div>
        ${compact ? '' : '<div class="toc-highlight-footer">PRIOR YEAR 2023 WORK SUMMARY</div>'}
    `;
}

function renderArrow(activeIdx) {
    const sections = getSectionData();
    const compact = isCompact();
    const idx = Math.min(activeIdx > 0 ? activeIdx - 1 : 0, sections.length - 1);
    const item = sections[idx];
    return `
        <div class="section-arrow-badge"><span>${formatPart(item.num)}</span></div>
        <h1 class="section-arrow-title">${item.zh}</h1>
        ${compact ? '' : `<p class="section-arrow-subtitle">${item.en}</p>
        <p class="section-arrow-desc">在这里输入本章节的简要概述，请将自己的内容在这个位置，展开简要描述</p>
        <div class="section-arrow-icons">
            <span>📋</span><span>📊</span><span>📁</span><span>👥</span><span>📥</span>
        </div>`}
    `;
}

function renderFullbleed(activeIdx) {
    const sections = getSectionData();
    const compact = isCompact();
    const idx = Math.min(activeIdx > 0 ? activeIdx - 1 : 0, sections.length - 1);
    const item = sections[idx];
    return `
        <div class="section-fullbleed-bg">PART ${formatNumberPadded(item.num)}</div>
        <div class="section-fullbleed-content">
            <div class="section-fullbleed-line"><span class="dot"></span><span class="line"></span></div>
            <h1 class="section-fullbleed-title">${item.zh}</h1>
            <div class="section-fullbleed-line"><span class="line"></span><span class="dot"></span></div>
            ${compact ? '' : `<p class="section-fullbleed-subtitle">${item.en}</p>
            <p class="section-fullbleed-desc">在这里输入本章节的简要概述，请将自己的内容在这个位置，展开简要描述</p>`}
        </div>
    `;
}

function renderLeftAlign(activeIdx) {
    const sections = getSectionData();
    const compact = isCompact();
    const idx = Math.min(activeIdx > 0 ? activeIdx - 1 : 0, sections.length - 1);
    const item = sections[idx];
    return `
        <div class="section-left-topline"></div>
        <div class="section-left-logo">/ LOGO</div>
        <div class="section-left-content">
            <div class="section-left-part">${formatPart(item.num)}</div>
            <h1 class="section-left-title">${item.zh}</h1>
            ${compact ? '' : `<p class="section-left-subtitle">${item.en}</p>`}
        </div>
        <div class="section-left-num">${formatNumber(item.num)}</div>
        ${compact ? '' : '<div class="section-left-footer">2023 WORK REPORT</div>'}
    `;
}

function renderLeftAlignMirror(activeIdx) {
    const sections = getSectionData();
    const compact = isCompact();
    const idx = Math.min(activeIdx > 0 ? activeIdx - 1 : 0, sections.length - 1);
    const item = sections[idx];
    return `
        <div class="section-left-topline mirror"></div>
        <div class="section-left-num mirror">${formatNumber(item.num)}</div>
        <div class="section-left-content mirror">
            <div class="section-left-part">${formatPart(item.num)}</div>
            <h1 class="section-left-title">${item.zh}</h1>
            ${compact ? '' : `<p class="section-left-subtitle">${item.en}</p>`}
        </div>
        <div class="section-left-logo mirror">LOGO /</div>
        ${compact ? '' : '<div class="section-left-footer mirror">2023 WORK REPORT</div>'}
    `;
}

function renderLeftAlignMinimal(activeIdx) {
    const sections = getSectionData();
    const compact = isCompact();
    const idx = Math.min(activeIdx > 0 ? activeIdx - 1 : 0, sections.length - 1);
    const item = sections[idx];
    return `
        <div class="section-left-content minimal">
            <div class="section-left-part">${formatPart(item.num)}</div>
            <h1 class="section-left-title">${item.zh}</h1>
            ${compact ? '' : `<p class="section-left-subtitle">${item.en}</p>`}
        </div>
        <div class="section-left-num">${formatNumber(item.num)}</div>
    `;
}
