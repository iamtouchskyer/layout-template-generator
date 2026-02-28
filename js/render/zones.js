// Zone content rendering functions

const TEXT_SAMPLES = [
    { title: '核心优势', content: '通过技术创新和精细化运营，我们在行业内建立了独特的竞争壁垒，持续为客户创造价值。' },
    { title: '市场洞察', content: '根据最新市场研究，目标用户群体呈现年轻化趋势，数字化需求显著提升，为业务增长提供新机遇。' },
    { title: '战略方向', content: '聚焦核心业务，深化技术布局，拓展国际市场，构建可持续发展的商业生态系统。' },
    { title: '执行要点', content: '明确目标分解、资源高效配置、敏捷迭代推进、数据驱动决策，确保战略落地执行。' },
];

const METRIC_SAMPLES = [
    { value: '127%', label: '营收增长率', trend: '↑' },
    { value: '4.8', label: '客户满意度', trend: '★' },
    { value: '98.5%', label: '系统可用性', trend: '●' },
    { value: '2.3M', label: '活跃用户数', trend: '↑' },
];

const BULLETS_SAMPLES = [
    ['完成核心产品迭代升级', '拓展3个新兴市场区域', '团队规模增长40%', '获得行业创新大奖'],
    ['优化用户体验流程', '提升转化率15%', '降低获客成本20%', '建立品牌合作矩阵'],
    ['技术架构全面升级', '数据安全通过认证', '响应速度提升50%', '支持百万级并发'],
    ['建立人才培养体系', '完善绩效考核机制', '提升员工满意度', '降低人员流失率'],
];

const TABLE_SAMPLES = [
    { title: '季度业绩对比', headers: ['指标', 'Q1', 'Q2', 'Q3'], rows: [['营收', '120M', '145M', '168M'], ['利润', '18M', '22M', '28M']] },
    { title: '产品数据概览', headers: ['产品', '用户数', '增长率'], rows: [['产品A', '850K', '+12%'], ['产品B', '620K', '+28%']] },
];

const IMAGE_SAMPLES = [
    { title: '产品展示', desc: '新品发布主视觉' },
    { title: '团队风采', desc: '年度合影照片' },
    { title: '场景应用', desc: '实际使用案例' },
    { title: '数据可视化', desc: '信息图表展示' },
];

function renderGridContent() {
    const gridLayout = GRID_LAYOUTS[state.gridLayout];
    if (!gridLayout) return '';

    const direction = gridLayout.direction === 'column' ? 'column' : 'row';
    let layoutClass;
    let customDataAttr = '';
    if (gridLayout.direction === 'grid') {
        const cols = gridLayout.columns || 2;
        const rows = gridLayout.rows || 2;
        layoutClass = `grid-layout-${cols}x${rows}`;
    } else if (gridLayout.direction === 'custom') {
        layoutClass = 'custom-layout';
        customDataAttr = ` data-layout="${gridLayout.customType || 'top-two-bottom'}"`;
    } else {
        layoutClass = `flex-layout-${direction}`;
    }

    let bodyHtml = `<div class="grid-content ${layoutClass}"${customDataAttr} style="flex: 1;">`;
    gridLayout.zones.forEach(zone => {
        const contentType = state.zoneContents[zone.id] || 'text';
        const flexStyle = zone.flex ? `flex: ${zone.flex}` : '';
        bodyHtml += `<div class="grid-zone" style="${flexStyle}">
            ${renderZoneContent(contentType, zone.id)}
        </div>`;
    });
    bodyHtml += `</div>`;

    return (typeof renderContentShell === 'function')
        ? renderContentShell({ bodyHtml })
        : bodyHtml;
}

function renderZoneContent(contentType, zoneId) {
    const idx = getZoneIndex(zoneId);

    switch (contentType) {
        case 'chart': {
            const sample = CHART_SAMPLES[idx % CHART_SAMPLES.length];
            return `<div class="zone-preview zone-chart-preview">
                <div class="chart-title">${sample.title}</div>
                <div class="chart-container" id="chart-${zoneId}"></div>
            </div>`;
        }
        case 'image': {
            const sample = IMAGE_SAMPLES[idx % IMAGE_SAMPLES.length];
            return `<div class="zone-preview zone-image-preview">
                <div class="image-icon">🖼️</div>
                <div class="image-title">${sample.title}</div>
                <div class="image-desc">${sample.desc}</div>
            </div>`;
        }
        case 'metric': {
            const sample = METRIC_SAMPLES[idx % METRIC_SAMPLES.length];
            return `<div class="zone-preview zone-metric-preview">
                <div class="metric-trend">${sample.trend}</div>
                <div class="metric-value">${sample.value}</div>
                <div class="metric-label">${sample.label}</div>
            </div>`;
        }
        case 'table': {
            const sample = TABLE_SAMPLES[idx % TABLE_SAMPLES.length];
            return `<div class="zone-preview zone-table-preview">
                <div class="table-title">${sample.title}</div>
                <table class="sample-table">
                    <thead><tr>${sample.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
                    <tbody>${sample.rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody>
                </table>
            </div>`;
        }
        case 'bullets': {
            const sample = BULLETS_SAMPLES[idx % BULLETS_SAMPLES.length];
            return `<div class="zone-preview zone-bullets-preview">
                <ul>${sample.map(item => `<li>${item}</li>`).join('')}</ul>
            </div>`;
        }
        case 'text':
        default: {
            const sample = TEXT_SAMPLES[idx % TEXT_SAMPLES.length];
            return `<div class="zone-preview zone-text-preview">
                <h3>${sample.title}</h3>
                <p>${sample.content}</p>
            </div>`;
        }
    }
}

function getZoneIndex(zoneId) {
    return zoneId.charCodeAt(0) - 65;
}
