/**
 * SmartArt Types Registry
 * Each type defines: layout algorithm, shape generator, OOXML mapper
 */

import { pyramidLayout } from './pyramid.js';
import { matrixLayout } from './matrix.js';
import { cycleLayout } from './cycle.js';
import { chevronLayout } from './chevron.js';
import { hierarchyLayout } from './hierarchy.js';
import { radialLayout } from './radial.js';
import { listLayout } from './list.js';

export const SMARTART_TYPES = {
    // Pyramid types
    'pyramid': {
        id: 'pyramid1',
        name: '基础金字塔',
        nameEn: 'Basic Pyramid',
        category: 'pyramid',
        layout: pyramidLayout,
        shapeType: 'trapezoid'
    },
    'pyramid-list': {
        id: 'pyramid2',
        name: '金字塔列表',
        nameEn: 'Pyramid List',
        category: 'pyramid',
        layout: (opt) => pyramidLayout(opt, { listStyle: true }),
        shapeType: 'triangle'
    },
    'pyramid-inverted': {
        id: 'pyramid3',
        name: '倒漏斗',
        nameEn: 'Inverted Funnel',
        category: 'pyramid',
        layout: (opt) => pyramidLayout(opt, { inverted: true }),
        shapeType: 'trapezoid'
    },

    // Matrix types
    'matrix': {
        id: 'matrix1',
        name: '基础矩阵',
        nameEn: 'Basic Matrix',
        category: 'matrix',
        layout: matrixLayout,
        shapeType: 'rect'
    },
    'matrix-titled': {
        id: 'matrix2',
        name: '标题矩阵',
        nameEn: 'Titled Matrix',
        category: 'matrix',
        layout: (opt) => matrixLayout(opt, { titled: true }),
        shapeType: 'rect'
    },
    'matrix-cycle': {
        id: 'matrix3',
        name: '循环矩阵',
        nameEn: 'Cycle Matrix',
        category: 'matrix',
        layout: (opt) => matrixLayout(opt, { cycle: true }),
        shapeType: 'rect'
    },

    // Cycle types
    'cycle': {
        id: 'cycle4',
        name: '基础循环',
        nameEn: 'Basic Cycle',
        category: 'cycle',
        layout: cycleLayout,
        shapeType: 'chevron'
    },
    'cycle-segmented': {
        id: 'cycle8',
        name: '分段循环',
        nameEn: 'Segmented Cycle',
        category: 'cycle',
        layout: (opt) => cycleLayout(opt, { segmented: true }),
        shapeType: 'pie'
    },

    // Process types
    'chevron': {
        id: 'chevron1',
        name: '基础流程',
        nameEn: 'Basic Chevron Process',
        category: 'process',
        layout: chevronLayout,
        shapeType: 'chevron'
    },
    'arrow-process': {
        id: 'arrow2',
        name: '流程箭头',
        nameEn: 'Process Arrows',
        category: 'process',
        layout: (opt) => chevronLayout(opt, { style: 'arrow' }),
        shapeType: 'arrow'
    },
    'descending-process': {
        id: 'DescendingProcess',
        name: '下降流程',
        nameEn: 'Descending Process',
        category: 'process',
        layout: (opt) => chevronLayout(opt, { style: 'descending' }),
        shapeType: 'rect'
    },

    // Hierarchy types
    'hierarchy': {
        id: 'chart3',
        name: '组织架构',
        nameEn: 'Hierarchy',
        category: 'hierarchy',
        layout: hierarchyLayout,
        shapeType: 'rect'
    },

    // Radial types
    'radial': {
        id: 'radial3',
        name: '发散图',
        nameEn: 'Basic Radial',
        category: 'relationship',
        layout: radialLayout,
        shapeType: 'ellipse'
    },

    // List types
    'list': {
        id: 'default',
        name: '基础列表',
        nameEn: 'Basic Block List',
        category: 'list',
        layout: listLayout,
        shapeType: 'rect'
    },
    'list-vertical': {
        id: 'vList3',
        name: '垂直列表',
        nameEn: 'Vertical Block List',
        category: 'list',
        layout: (opt) => listLayout(opt, { direction: 'vertical' }),
        shapeType: 'rect'
    },

    // Picture types
    'picture-accent': {
        id: 'AccentedPicture',
        name: '突出图片',
        nameEn: 'Accented Picture',
        category: 'picture',
        layout: (opt) => listLayout(opt, { style: 'picture' }),
        shapeType: 'rect'
    },
    'picture-captioned': {
        id: 'CaptionedPictures',
        name: '带标题图片',
        nameEn: 'Captioned Pictures',
        category: 'picture',
        layout: (opt) => listLayout(opt, { style: 'captioned' }),
        shapeType: 'rect'
    },

    // Hexagon types
    'hexagon-alternating': {
        id: 'AlternatingHexagons',
        name: '交替六边形',
        nameEn: 'Alternating Hexagons',
        category: 'list',
        layout: (opt) => listLayout(opt, { style: 'hexagon' }),
        shapeType: 'hexagon'
    }
};

// Get all types as array for UI selectors
export function getSmartArtTypes() {
    return Object.entries(SMARTART_TYPES).map(([key, config]) => ({
        key,
        ...config
    }));
}

// Get types by category
export function getTypesByCategory(category) {
    return Object.entries(SMARTART_TYPES)
        .filter(([_, config]) => config.category === category)
        .map(([key, config]) => ({ key, ...config }));
}

// Get all categories
export function getCategories() {
    const categories = new Set();
    Object.values(SMARTART_TYPES).forEach(t => categories.add(t.category));
    return Array.from(categories);
}
