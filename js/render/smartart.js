// SmartArt rendering functions

const SMARTART_SAMPLE_DATA = {
    pyramid: ['战略愿景', '经营目标', '执行计划', '日常任务', '基础支撑', '资源保障'],
    matrix: ['战略矩阵', '高影响/低成本', '高影响/高成本', '低影响/低成本', '低影响/高成本'],
    cycle: ['计划', '执行', '检查', '改进', '总结', '优化'],
    process: ['需求分析', '方案设计', '开发实现', '测试验收', '上线运营', '迭代优化'],
    hierarchy: [
        { id: 'ceo', text: 'CEO' },
        { id: 'cto', text: 'CTO', parentId: 'ceo' },
        { id: 'cfo', text: 'CFO', parentId: 'ceo' },
        { id: 'dev', text: '研发部', parentId: 'cto' },
        { id: 'qa', text: '质量部', parentId: 'cto' },
        { id: 'fin', text: '财务部', parentId: 'cfo' },
    ],
    relationship: ['核心目标', '策略A', '策略B', '策略C', '策略D', '策略E'],
    list: ['要点一', '要点二', '要点三', '要点四', '要点五', '要点六'],
    picture: ['产品经理', '技术架构师', '项目经理', '设计师', 'QA工程师', '运维工程师'],
};

let smartArtInstance = null;

function _smartartRenderLang() {
    if (typeof getSmartArtUILang === 'function') return getSmartArtUILang();
    return 'en';
}

function _smartartRenderText(key) {
    const zh = {
        descTitle: '说明文字区域',
        descBody: '这里可以放置对 SmartArt 图形的描述、解释或相关数据说明。',
        bullet1: '要点一：关键信息',
        bullet2: '要点二：补充说明',
        bullet3: '要点三：总结概括',
    };
    const en = {
        descTitle: 'Description',
        descBody: 'Use this area for SmartArt notes, context, or supporting details.',
        bullet1: 'Point 1: Key message',
        bullet2: 'Point 2: Supporting detail',
        bullet3: 'Point 3: Summary',
    };
    const dict = _smartartRenderLang() === 'zh' ? zh : en;
    return dict[key] || key;
}

function _smartartRenderDefaultItems(typeId, category) {
    if (typeof getSmartArtTestData === 'function') {
        return getSmartArtTestData(typeId, category);
    }
    return SMARTART_TEST_DATA[typeId] || SMARTART_TEST_DATA[category] || SMARTART_TEST_DATA.list || [];
}

function renderSmartartPage() {
    const placement = state.smartartPlacement;
    const typeInfo = SMARTART_TYPES[state.smartartType];
    const ooxmlId = typeInfo?.ooxmlId || state.smartartType;

    const smartartContainer = `<div class="smartart-main"><div id="smartart-render-target"></div></div>`;

    const descBlock = `
        <div class="smartart-desc-block">
            <h3>${_smartartRenderText('descTitle')}</h3>
            <p>${_smartartRenderText('descBody')}</p>
            <ul>
                <li>${_smartartRenderText('bullet1')}</li>
                <li>${_smartartRenderText('bullet2')}</li>
                <li>${_smartartRenderText('bullet3')}</li>
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

    requestAnimationFrame(() => {
        renderSmartArtChart();
        renderSmartartTextEditor();
    });
    if (typeof renderContentShell === 'function') {
        return renderContentShell({ bodyHtml: html });
    }
    return html;
}

function renderSmartArtChart() {
    const target = document.getElementById('smartart-render-target');
    const smartartApi = window.SmartArt;
    if (!target || !smartartApi) return;

    const typeInfo = SMARTART_TYPES[state.smartartType];
    if (!typeInfo) return;
    const typeLabel = (typeof getSmartArtTypeLabel === 'function')
        ? getSmartArtTypeLabel(typeInfo)
        : (typeInfo.label || state.smartartType);

    const category = typeInfo.category;
    const count = state.smartartItemCount || 4;

    if (!state.smartartItems || !Array.isArray(state.smartartItems)) {
        const testData = _smartartRenderDefaultItems(state.smartartType, category);
        const initItems = JSON.parse(JSON.stringify(testData.slice(0, count)));
        if (typeof patchCurrentPage === 'function') {
            patchCurrentPage({
                smartartItems: initItems,
                smartartItemsByType: {
                    ...(state.smartartItemsByType || {}),
                    [state.smartartType]: JSON.parse(JSON.stringify(initItems)),
                },
            }, { recordHistory: false, render: false });
        } else {
            state.smartartItems = initItems;
            state.smartartItemsByType[state.smartartType] = state.smartartItems;
        }
    }

    const items = state.smartartItems.map(item => {
        if (typeof item === 'string') return item;
        if (typeof item === 'object' && item.text !== undefined) {
            return item;
        }
        return item;
    });

    const targetRect = target.getBoundingClientRect();
    const width = Math.max(320, Math.round(targetRect.width || target.clientWidth || 1000));
    const height = Math.max(220, Math.round(targetRect.height || target.clientHeight || 450));

    const themeColors = getSmartArtColorsFromScheme(state.smartartColorScheme);

    try {
        if (smartArtInstance) {
            smartArtInstance.dispose();
        }

        smartArtInstance = smartartApi.init(target);
        smartArtInstance.setOption({
            type: state.smartartType,
            items: items,
            size: { width, height },
            theme: themeColors
        });

        target.removeEventListener('smartart-text-change', handleSmartartTextChange);
        target.addEventListener('smartart-text-change', handleSmartartTextChange);
    } catch (e) {
        console.warn('SmartArt render failed:', e.message);
        target.innerHTML = `<div class="smartart-fallback">
            <div class="smartart-icon">${SMARTART_CATEGORIES[typeInfo.category]?.icon || '📊'}</div>
            <div class="smartart-type-name">${typeLabel}</div>
        </div>`;
    }
}

function handleSmartartTextChange(e) {
    const { shapeId, text } = e.detail;
    const match = shapeId.match(/^([a-zA-Z-]+)-(\d+)$/);
    if (!match || !state.smartartItems) return;

    const shapeKind = match[1];
    const idx = parseInt(match[2], 10);
    if (idx < 0 || idx >= state.smartartItems.length) return;
    if (typeof mutateCurrentPageData === 'function') {
        mutateCurrentPageData((draft) => {
            const typeId = draft.smartartType || state.smartartType || 'pyramid';
            const items = Array.isArray(draft.smartartItems)
                ? JSON.parse(JSON.stringify(draft.smartartItems))
                : [];
            const current = items[idx];
            const currentObj = (typeof current === 'object' && current !== null)
                ? current
                : { text: String(current || '') };

            if (shapeKind === 'textbox') {
                const lines = String(text || '')
                    .split('\n')
                    .map(line => line.replace(/^\s*[•·]\s*/, '').trim())
                    .filter(Boolean);
                currentObj.children = lines.map(line => ({ text: line }));
                items[idx] = currentObj;
            } else {
                currentObj.text = text;
                items[idx] = currentObj;
                if (typeof current === 'string') {
                    items[idx] = text;
                }
            }

            const byType = JSON.parse(JSON.stringify(draft.smartartItemsByType || {}));
            byType[typeId] = JSON.parse(JSON.stringify(items));
            draft.smartartItems = items;
            draft.smartartItemsByType = byType;
        }, { render: false });
        return;
    }

    const current = state.smartartItems[idx];
    const currentObj = (typeof current === 'object' && current !== null) ? current : { text: String(current || '') };
    if (shapeKind === 'textbox') {
        const lines = String(text || '')
            .split('\n')
            .map(line => line.replace(/^\s*[•·]\s*/, '').trim())
            .filter(Boolean);
        currentObj.children = lines.map(line => ({ text: line }));
        state.smartartItems[idx] = currentObj;
        return;
    }
    currentObj.text = text;
    state.smartartItems[idx] = currentObj;
    if (typeof current === 'string') {
        state.smartartItems[idx] = text;
    }
}

function getSmartArtColorsFromScheme(schemeId) {
    const colorSchemes = getSmartArtColorSchemes(state.theme);

    let accents = null;
    for (const group of colorSchemes) {
        const item = group.items.find(i => i.id === schemeId);
        if (item && item.accents) {
            accents = item.accents;
            break;
        }
    }

    if (!accents) {
        const theme = window.THEMES?.[state.theme];
        accents = theme?.accentColors || ['#156082', '#E97132', '#196B24', '#0F9ED5', '#A02B93', '#4EA72E'];
    }

    return {
        parentColor: accents[0],
        childColors: accents.slice(1),
        light1: '#FFFFFF',
        dark1: '#000000',
        accent1: accents[0],
        accent2: accents[1],
        accent3: accents[2],
        accent4: accents[3],
        accent5: accents[4],
        accent6: accents[5]
    };
}

function getSmartArtThemeColors(themeName) {
    const themeMap = {
        'soft_peach_cream': { accent1: '#E8998D', accent2: '#F2C4B6', accent3: '#A8DADC', accent4: '#457B9D', accent5: '#1D3557', accent6: '#F4A261' },
        'executive': { accent1: '#2C3E50', accent2: '#34495E', accent3: '#7F8C8D', accent4: '#95A5A6', accent5: '#BDC3C7', accent6: '#ECF0F1' },
        'forest_green': { accent1: '#2D5016', accent2: '#4A7C23', accent3: '#6B8E23', accent4: '#8FBC8F', accent5: '#556B2F', accent6: '#9ACD32' },
        'sunset_orange': { accent1: '#E74C3C', accent2: '#F39C12', accent3: '#E67E22', accent4: '#D35400', accent5: '#C0392B', accent6: '#F1C40F' },
        'cosmic': { accent1: '#6C5CE7', accent2: '#A29BFE', accent3: '#74B9FF', accent4: '#0984E3', accent5: '#00CEC9', accent6: '#81ECEC' },
        'azure': { accent1: '#4472C4', accent2: '#5B9BD5', accent3: '#70AD47', accent4: '#FFC000', accent5: '#ED7D31', accent6: '#A5A5A5' },
    };
    const colors = themeMap[themeName] || themeMap['azure'];
    return { ...colors, light1: '#FFFFFF', dark1: '#000000' };
}

window.getSmartArtOOXML = function() {
    if (smartArtInstance) {
        return smartArtInstance.toOOXML();
    }
    return null;
};
