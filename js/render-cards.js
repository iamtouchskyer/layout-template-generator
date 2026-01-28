// Card Rendering

function renderCard(card, index) {
    const headers = ['关键指标', '市场分析', '增长趋势', '业务概览'];
    const header = headers[index % headers.length];

    switch (card.type) {
        case 'chart':
            return `<div class="card card-chart"><div class="card-header">${header}</div><div class="chart-placeholder">📊 Chart</div></div>`;
        case 'text':
            return `<div class="card card-text"><div class="card-header">${header}</div><ul class="bullet-list"><li>市场规模持续增长，年复合增长率达 15%</li><li>用户活跃度显著提升，日活突破百万</li><li>产品线扩展计划已完成第一阶段</li></ul></div>`;
        case 'metric':
            return `<div class="card card-metric"><div class="metric-value">85%</div><div class="metric-label">用户满意度</div><div class="metric-trend">↑ 12% vs 上季度</div></div>`;
        case 'table':
            return `<div class="card card-table"><div class="card-header">${header}</div><table><thead><tr><th>指标</th><th>Q1</th><th>Q2</th><th>Q3</th></tr></thead><tbody><tr><td>营收</td><td>120M</td><td>145M</td><td>168M</td></tr><tr><td>用户</td><td>1.2M</td><td>1.5M</td><td>1.8M</td></tr></tbody></table></div>`;
        case 'combo':
            return `<div class="card card-combo"><div class="icon-grid"><div class="icon-item"><div class="icon"></div><span class="label">功能 A</span></div><div class="icon-item"><div class="icon"></div><span class="label">功能 B</span></div><div class="icon-item"><div class="icon"></div><span class="label">功能 C</span></div><div class="icon-item"><div class="icon"></div><span class="label">功能 D</span></div></div></div>`;
        case 'image':
            return `<div class="card card-image"><div class="image-placeholder">🖼️ Image</div></div>`;
        default:
            return `<div class="card">Unknown</div>`;
    }
}
