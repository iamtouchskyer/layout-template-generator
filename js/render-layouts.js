// Layout Structure Rendering

function renderLayoutStructure() {
    const id = state.layoutType;
    const cards = state.cards;

    // Image layouts
    if (id === 'image-left') return twoCol(cards[0] || {type:'image'}, cards[1] || {type:'text'});
    if (id === 'image-right') return twoCol(cards[0] || {type:'text'}, cards[1] || {type:'image'});
    if (id === 'image-top') return vertical(cards[0] || {type:'image'}, cards[1] || {type:'text'});
    if (id === 'image-bottom') return vertical(cards[0] || {type:'text'}, cards[1] || {type:'image'});

    // Chart layouts
    if (id === 'chart-left') return twoCol(cards[0] || {type:'chart'}, cards[1] || {type:'text'});
    if (id === 'chart-right') return twoCol(cards[0] || {type:'text'}, cards[1] || {type:'chart'});

    // Text layouts
    if (id === 'no-image') return `<div class="layout-single">${renderCard(cards[0] || {type:'text'}, 0)}</div>`;
    if (id === 'big-number') return `<div class="layout-centered">${renderBigNumber()}</div>`;
    if (id === 'quote') return `<div class="layout-centered">${renderQuote()}</div>`;
    if (id === 'agenda') return `<div class="layout-single">${renderAgenda()}</div>`;
    if (id === 'conclusion') return threeCol(cards.slice(0, 3));

    // Comparison layouts
    if (id === 'two-column-equal') return twoCol(cards[0] || {type:'text'}, cards[1] || {type:'text'});
    if (id === 'comparison-2') return `<div class="layout-two-col comparison">${cards.slice(0, 2).map((_, i) => `<div class="comparison-card">${renderComparisonCard(i)}</div>`).join('')}</div>`;
    if (id === 'comparison-3') return `<div class="layout-three-col comparison">${cards.slice(0, 3).map((_, i) => `<div class="comparison-card">${renderComparisonCard(i)}</div>`).join('')}</div>`;

    // Fancy layouts
    if (id === 'edge-to-edge') return `<div class="layout-edge-to-edge"><div class="edge-bg"></div><div class="edge-overlay"><h2 class="edge-title">核心亮点</h2><p class="edge-text">沉浸式全屏视觉体验</p></div></div>`;
    if (id === 'hero-banner') return `<div class="layout-hero-banner"><div class="hero-image"></div><div class="hero-content"><h2>产品展示</h2><p>高品质视觉呈现</p></div></div>`;
    if (id === 'split-screen') return `<div class="layout-split-screen"><div class="split-image"></div><div class="split-content">${renderCard(cards[1] || {type:'text'}, 1)}</div></div>`;
    if (id === 'timeline') return `<div class="layout-timeline">${renderTimeline()}</div>`;
    if (id === 'stats-dashboard') return `<div class="layout-bento-grid">${cards.slice(0, 4).map((_, i) => `<div class="bento-card">${renderCard({type:'metric'}, i)}</div>`).join('')}</div>`;
    if (id === 'icon-grid') return `<div class="layout-icon-grid">${cards.slice(0, 4).map((_, i) => `<div class="icon-cell">${renderIconCell(i)}</div>`).join('')}</div>`;

    return `<div class="layout-single">${renderCard(cards[0] || {type:'text'}, 0)}</div>`;
}

function twoCol(left, right) {
    return `<div class="layout-two-col"><div class="col-left">${renderCard(left, 0)}</div><div class="col-right">${renderCard(right, 1)}</div></div>`;
}

function vertical(top, bottom) {
    return `<div class="layout-vertical"><div class="row-top">${renderCard(top, 0)}</div><div class="row-bottom">${renderCard(bottom, 1)}</div></div>`;
}

function threeCol(cards) {
    return `<div class="layout-three-col">${cards.map((c, i) => `<div class="col">${renderCard(c, i)}</div>`).join('')}</div>`;
}

function renderBigNumber() {
    return `<div class="big-number-display"><div class="big-number-value">85%</div><div class="big-number-label">用户满意度</div><div class="big-number-trend">↑ 12% 较上季度</div></div>`;
}

function renderQuote() {
    return `<div class="quote-display"><div class="quote-mark">"</div><div class="quote-text">创新是区分领导者和跟随者的关键。</div><div class="quote-author">— 史蒂夫·乔布斯</div></div>`;
}

function renderAgenda() {
    return `<div class="agenda-list">
        <div class="agenda-item"><span class="agenda-num">01</span><span class="agenda-text">项目背景与目标</span></div>
        <div class="agenda-item"><span class="agenda-num">02</span><span class="agenda-text">市场分析与洞察</span></div>
        <div class="agenda-item"><span class="agenda-num">03</span><span class="agenda-text">解决方案与实施</span></div>
        <div class="agenda-item"><span class="agenda-num">04</span><span class="agenda-text">预期成果与展望</span></div>
    </div>`;
}

function renderComparisonCard(index) {
    const labels = ['方案 A', '方案 B', '方案 C'];
    return `<div class="comparison-header">${labels[index] || '方案'}</div><div class="comparison-body"><div class="comparison-point">• 核心特点一</div><div class="comparison-point">• 核心特点二</div><div class="comparison-point">• 核心特点三</div></div>`;
}

function renderTimeline() {
    return `<div class="timeline-container"><div class="timeline-line"></div><div class="timeline-items">
        <div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-content"><div class="timeline-date">Q1 2024</div><div class="timeline-title">项目启动</div></div></div>
        <div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-content"><div class="timeline-date">Q2 2024</div><div class="timeline-title">开发阶段</div></div></div>
        <div class="timeline-item"><div class="timeline-dot"></div><div class="timeline-content"><div class="timeline-date">Q3 2024</div><div class="timeline-title">测试上线</div></div></div>
    </div></div>`;
}

function renderIconCell(index) {
    const icons = ['⚡', '🎯', '📊', '🚀'];
    const labels = ['高效执行', '精准定位', '数据驱动', '快速迭代'];
    return `<div class="icon-cell-content"><div class="icon-symbol">${icons[index] || '✦'}</div><div class="icon-label">${labels[index] || '功能'}</div></div>`;
}
