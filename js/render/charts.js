// Chart rendering functions

// Sample chart configurations - portable format for both ECharts (frontend) and python-pptx (export)
const CHART_SAMPLES = [
    {
        title: '月度销售趋势',
        chartType: 'line',  // python-pptx: LINE_MARKERS
        categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
        series: [{ name: '销售额', data: [820, 932, 901, 1234, 1290, 1430] }],
        echarts: {
            grid: { top: 30, right: 20, bottom: 30, left: 40 },
            smooth: true,
            areaStyle: { opacity: 0.3 }
        }
    },
    {
        title: '市场份额分布',
        chartType: 'pie',  // python-pptx: PIE
        categories: ['产品A', '产品B', '产品C', '其他'],
        series: [{ name: '份额', data: [35, 28, 22, 15] }],
        echarts: {
            radius: ['40%', '70%'],
            label: { fontSize: 10 }
        }
    },
    {
        title: '季度对比分析',
        chartType: 'bar',  // python-pptx: COLUMN_CLUSTERED
        categories: ['Q1', 'Q2', 'Q3', 'Q4'],
        series: [
            { name: '2023', data: [120, 145, 168, 190] },
            { name: '2024', data: [150, 178, 195, 230] }
        ],
        echarts: {
            grid: { top: 30, right: 20, bottom: 30, left: 40 },
            barGap: '10%'
        }
    },
    {
        title: '用户增长曲线',
        chartType: 'area',  // python-pptx: AREA
        categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        series: [{ name: 'DAU', data: [150, 230, 224, 318, 435, 410, 520] }],
        echarts: {
            grid: { top: 30, right: 20, bottom: 30, left: 50 },
            smooth: true,
            areaStyle: { opacity: 0.5 }
        }
    },
];

// Initialize ECharts in chart zones
function initZoneCharts() {
    if (typeof echarts === 'undefined') return;

    const gridLayout = GRID_LAYOUTS[state.gridLayout];
    if (!gridLayout) return;

    gridLayout.zones.forEach(zone => {
        const contentType = state.zoneContents[zone.id] || 'text';
        if (contentType !== 'chart') return;

        const container = document.getElementById(`chart-${zone.id}`);
        if (!container) return;

        const idx = getZoneIndex(zone.id);
        const sample = CHART_SAMPLES[idx % CHART_SAMPLES.length];

        // Dispose existing chart
        const existingChart = echarts.getInstanceByDom(container);
        if (existingChart) existingChart.dispose();

        // Create new chart using portable data format
        const chart = echarts.init(container);
        const option = toEChartsOption(sample);

        // Apply theme colors
        const themeAccent = getComputedStyle(document.documentElement).getPropertyValue('--theme-accent').trim() || '#e07b56';
        if (option.series) {
            option.series.forEach((s, i) => {
                if (!s.itemStyle) s.itemStyle = {};
                s.itemStyle.color = i === 0 ? themeAccent : adjustColor(themeAccent, i * 30);
                if (s.areaStyle) s.areaStyle.color = themeAccent;
            });
        }

        chart.setOption(option);
    });
}

// Convert portable chart data to ECharts option
function toEChartsOption(chartData) {
    const { chartType, categories, series, echarts: opts = {} } = chartData;

    if (chartType === 'pie') {
        return {
            series: [{
                type: 'pie',
                radius: opts.radius || '50%',
                center: ['50%', '50%'],
                label: opts.label || { fontSize: 10 },
                data: categories.map((name, i) => ({ name, value: series[0].data[i] }))
            }]
        };
    }

    // Line, bar, area charts
    const option = {
        grid: opts.grid || { top: 30, right: 20, bottom: 30, left: 40 },
        xAxis: {
            type: 'category',
            data: categories,
            axisLine: { lineStyle: { color: '#ccc' } },
            axisLabel: { color: '#666', fontSize: 10 }
        },
        yAxis: {
            type: 'value',
            axisLine: { show: false },
            splitLine: { lineStyle: { color: '#eee' } },
            axisLabel: { color: '#666', fontSize: 10 }
        },
        series: series.map(s => {
            const seriesOpt = {
                type: chartType === 'area' ? 'line' : chartType,
                name: s.name,
                data: s.data
            };
            if (chartType === 'line' || chartType === 'area') {
                seriesOpt.smooth = opts.smooth !== false;
            }
            if (chartType === 'area') {
                seriesOpt.areaStyle = opts.areaStyle || { opacity: 0.5 };
            }
            if (chartType === 'bar' && opts.barGap) {
                seriesOpt.barGap = opts.barGap;
            }
            return seriesOpt;
        })
    };

    return option;
}

function adjustColor(hex, amount) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

function getZoneIndex(zoneId) {
    return zoneId.charCodeAt(0) - 65; // A=0, B=1, C=2, etc.
}

// Expose CHART_SAMPLES for JSON export
window.CHART_SAMPLES = CHART_SAMPLES;
