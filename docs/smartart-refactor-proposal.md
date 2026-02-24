# SmartArt 库重构方案：借鉴 X6 设计模式

> 文档版本：v1.1
> 日期：2026-02-07
> 状态：待评审

---

## 目录

1. [现状分析](#1-现状分析)
2. [X6 架构解析](#2-x6-架构解析)
3. [架构重构方案](#3-架构重构方案)
4. [核心模块设计](#4-核心模块设计)
5. [实现细节](#5-实现细节)
6. [迁移计划](#6-迁移计划)
7. [补充：落地与遗漏](#7-补充落地与遗漏)

---

## 1. 现状分析

### 1.1 当前架构

```
smartart.bundle.js (1429 行, 56KB)
├── Layout Functions (散落的布局函数)
│   ├── pyramidLayout()
│   ├── pyramidListLayout()
│   ├── pyramidSegmentedLayout()
│   ├── cycleLayout()
│   ├── matrixLayout()
│   ├── chevronLayout()
│   ├── hierarchyLayout()
│   ├── radialLayout()
│   └── listLayout()
├── Render Functions (SVG 渲染)
│   ├── renderShape()
│   ├── renderAutoFitText()
│   ├── renderTrapezoid()
│   ├── renderTriangle()
│   └── ...
├── Type Registry (硬编码映射)
│   └── getLayoutFunction() - switch/case
└── SmartArt Class (入口)
    ├── init()
    ├── setOption()
    └── dispose()
```

> 补充校正：当前项目已存在模块化源码 `js/smartart/*`，但页面运行时仍直接加载 `js/smartart.bundle.js`。  
> 即：**开发态源码**与**运行态产物**并存，且文档化的构建链路尚不完整。

### 1.2 问题清单

| 问题 | 严重度 | 位置 | 说明 |
|------|--------|------|------|
| **魔法数字** | 高 | 全局 | `0.117`, `0.667`, `0.45` 等无注释常量 |
| **类型硬编码** | 高 | getLayoutFunction | switch/case 映射，新增类型要改多处 |
| **职责混乱** | 中 | Layout 函数 | 布局计算、数据转换、样式处理混在一起 |
| **无类型定义** | 中 | 全局 | 参数结构靠猜，容易出错 |
| **重复代码** | 中 | 各 Layout | 相似的 shape 构建逻辑重复 |
| **样式硬编码** | 低 | 各 Layout | `strokeWidth: 1.5`, `rx: 6` 等散落各处 |

### 1.3 代码示例：问题展示

```javascript
// ❌ 问题代码示例 (当前实现)
function pyramidListLayout(option, config) {
    const { items, size, theme } = option;
    const { width, height } = size;

    // 问题1: 魔法数字，来源不明
    const triX = width * 0.117;      // 什么意思?
    const triW = width * 0.667;      // 从哪来的?
    const listX = width * 0.45;
    const listW = width * 0.433;
    const startYRatio = 0.10;
    const gapRatio = 0.018;

    // 问题2: 布局计算和 shape 构建混在一起
    const availableHeight = 1 - startYRatio - 0.08;
    const itemHeightRatio = (availableHeight - gapRatio * (count - 1)) / count;

    // 问题3: 样式硬编码
    shapes.push({
        fill: theme.light1 || '#FFFFFF',  // 默认值散落
        strokeWidth: 1.5,                  // 魔法数字
        rx: 6, ry: 6,                      // 魔法数字
        fontSize: Math.min(16, itemH * 0.35)  // 复杂计算内联
    });
}
```

### 1.4 额外现状（本次评审补充）

| 现状 | 位置 | 影响 |
|------|------|------|
| 运行时仍依赖 bundle 文件 | `index.html` | 源码重构后若不更新 bundle，页面效果不会变化 |
| SmartArt 类型定义分散在多处 | `js/config.js` / `js/smartart/types/registry.js` / `pptx_gen/themes.py` | 新增类型需要多点同步，容易漏改 |
| 前后端 SmartArt 契约未显式化 | `js/ui/export.js` / `pptx_gen/slides/smartart.py` | 预览和导出容易“看起来一致，实际不一致” |
| 存在已知渲染/交互缺陷 | `js/smartart/types/matrix.js` / `js/smartart/renderers/svg.js` / `js/render/smartart.js` | 重构前后难以定义“回归” |

---

## 2. X6 架构解析

### 2.1 整体架构

```
@antv/x6
├── src/
│   ├── common/          # 工具函数
│   ├── config/          # 全局配置
│   ├── constants/       # 常量定义
│   ├── geometry/        # 几何计算
│   ├── graph/           # 画布核心
│   ├── model/           # 数据模型 (Node, Edge, Cell)
│   ├── view/            # 视图渲染
│   ├── registry/        # 注册表系统 ⭐
│   ├── shape/           # 内置形状
│   ├── plugin/          # 插件系统
│   └── renderer/        # 渲染器
```

### 2.2 核心设计模式

#### 2.2.1 Registry 模式

```typescript
// X6 的 Registry 实现
export class Registry<Entity> {
  private data: Record<string, Entity> = {};

  register(name: string, entity: Entity, force = false): Entity {
    if (this.exist(name) && !force) {
      throw new Error(`${name} already registered`);
    }
    this.data[name] = entity;
    return entity;
  }

  get(name: string): Entity | null {
    return this.data[name] || null;
  }

  exist(name: string): boolean {
    return this.data[name] != null;
  }
}

// 使用方式
Graph.registerNode('custom-rect', { ... });
const node = graph.createNode({ shape: 'custom-rect' });
```

**借鉴价值：**
- 解耦类型定义和使用
- 支持运行时扩展
- 统一的注册/查找接口

#### 2.2.2 声明式 Markup

```typescript
// X6 的形状定义
Graph.registerNode('org-node', {
  width: 260,
  height: 88,
  // 声明式 SVG 结构
  markup: [
    { tagName: 'rect', selector: 'body' },
    { tagName: 'text', selector: 'label' },
    { tagName: 'image', selector: 'icon' }
  ],
  // 声明式属性
  attrs: {
    body: {
      refWidth: '100%',
      refHeight: '100%',
      fill: '#fff',
      stroke: '#000',
      rx: 10, ry: 10
    },
    label: {
      refX: 0.5,
      refY: 0.5,
      textAnchor: 'middle',
      textVerticalAnchor: 'middle'
    }
  }
});
```

**借鉴价值：**
- 分离结构定义和渲染逻辑
- 相对定位 (refX, refY, refWidth)
- 选择器系统 (selector)

#### 2.2.3 PropHooks 属性钩子

```typescript
// X6 的属性转换钩子
Base.config({
  propHooks(metadata) {
    const { label, ...others } = metadata;
    if (label) {
      // 自动转换 label 到正确路径
      ObjectExt.setByPath(others, 'attrs/text/text', label);
    }
    return others;
  }
});

// 用户可以简写
graph.addNode({ label: 'Hello' });
// 内部自动转换为
graph.addNode({ attrs: { text: { text: 'Hello' } } });
```

**借鉴价值：**
- 简化 API
- 向后兼容
- 集中处理属性转换

#### 2.2.4 MVC 分层

```
Model (数据层)
├── Cell (基类)
├── Node (节点)
└── Edge (边)

View (视图层)
├── CellView
├── NodeView
└── EdgeView

Graph (控制器)
├── 事件分发
├── 状态管理
└── 插件协调
```

---

## 3. 架构重构方案

### 3.1 目标架构

```
smartart/
├── core/
│   ├── registry.js        # 注册表系统 (借鉴 X6)
│   ├── constants.js       # 全局常量
│   └── types.js           # 类型定义 (JSDoc)
├── model/
│   ├── shape.js           # Shape 数据模型
│   ├── layout-result.js   # 布局结果模型
│   └── theme.js           # 主题模型
├── layouts/
│   ├── base.js            # 布局基类
│   ├── pyramid.js         # 金字塔布局
│   ├── cycle.js           # 循环布局
│   ├── matrix.js          # 矩阵布局
│   ├── hierarchy.js       # 层级布局
│   └── index.js           # 自动注册
├── renderers/
│   ├── svg/
│   │   ├── shapes.js      # 形状渲染器
│   │   ├── text.js        # 文本渲染器
│   │   └── index.js
│   └── canvas/            # (未来扩展)
├── config/
│   ├── pyramid.config.js  # 金字塔配置
│   ├── cycle.config.js    # 循环配置
│   └── defaults.js        # 默认配置
└── index.js               # 入口
```

### 3.2 核心改进

| 改进项 | 当前 | 目标 | 借鉴 X6 |
|--------|------|------|---------|
| 类型注册 | switch/case | Registry 模式 | ✅ |
| 配置管理 | 魔法数字 | 集中配置文件 | ✅ |
| 形状定义 | 命令式代码 | 声明式 Markup | ✅ |
| 属性系统 | 硬编码 | Attrs + PropHooks | ✅ |
| 布局算法 | 混合在函数中 | 独立 Layout 类 | ✅ |

---

## 4. 核心模块设计

### 4.1 Registry 模块

```javascript
// core/registry.js

/**
 * 通用注册表 - 借鉴 X6 Registry 模式
 */
class Registry {
  constructor(type) {
    this.type = type;
    this.data = {};
  }

  /**
   * 注册实体
   * @param {string} name - 名称
   * @param {*} entity - 实体
   * @param {boolean} force - 是否强制覆盖
   */
  register(name, entity, force = false) {
    if (this.exist(name) && !force) {
      console.warn(`[SmartArt] ${this.type} "${name}" already registered`);
      return this.data[name];
    }
    this.data[name] = entity;
    return entity;
  }

  /**
   * 获取实体
   */
  get(name) {
    const entity = this.data[name];
    if (!entity) {
      const suggestion = this.getSuggestion(name);
      throw new Error(
        `[SmartArt] ${this.type} "${name}" not found.` +
        (suggestion ? ` Did you mean "${suggestion}"?` : '')
      );
    }
    return entity;
  }

  /**
   * 检查是否存在
   */
  exist(name) {
    return this.data[name] != null;
  }

  /**
   * 获取拼写建议 (借鉴 X6)
   */
  getSuggestion(name) {
    const names = Object.keys(this.data);
    // Levenshtein 距离匹配
    return names.find(n =>
      this.levenshtein(n, name) <= 2
    );
  }

  levenshtein(a, b) {
    // 简化的编辑距离算法
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        matrix[i][j] = b[i-1] === a[j-1]
          ? matrix[i-1][j-1]
          : Math.min(matrix[i-1][j-1]+1, matrix[i][j-1]+1, matrix[i-1][j]+1);
      }
    }
    return matrix[b.length][a.length];
  }
}

// 创建各类注册表
const LayoutRegistry = new Registry('Layout');
const ShapeRegistry = new Registry('Shape');
const RendererRegistry = new Registry('Renderer');

export { Registry, LayoutRegistry, ShapeRegistry, RendererRegistry };
```

### 4.2 配置常量模块

```javascript
// config/pyramid.config.js

/**
 * 金字塔布局配置
 * 数值来源: OOXML SmartArt 规范 / PPT 导出测量
 */
export const PYRAMID_CONFIG = {
  // 基础金字塔
  basic: {
    // 形状
    shape: {
      strokeWidth: 2,
      cornerRadius: 0
    },
    // 文本
    text: {
      minFontSize: 12,
      maxFontSize: 24,
      fontSizeRatio: 0.4  // fontSize = itemHeight * ratio
    }
  },

  // 金字塔列表 (pyramid2)
  // 来源: smartart.pptx 导出测量
  list: {
    triangle: {
      x: 0.117,       // 11.7% from left
      width: 0.667    // 66.7% of total width
    },
    listBox: {
      x: 0.45,        // 45% from left
      width: 0.433    // 43.3% of total width
    },
    spacing: {
      startY: 0.10,   // 10% from top
      gap: 0.018,     // 1.8% gap between items
      bottomPadding: 0.08  // 8% bottom padding
    },
    shape: {
      strokeWidth: 1.5,
      cornerRadius: 8
    }
  },

  // 分段金字塔 (pyramid4)
  segmented: {
    shape: {
      strokeWidth: 2,
      gap: 2  // px gap between segments
    }
  },

  // 带子节点的金字塔
  withChildren: {
    pyramidWidthRatio: 0.55,  // 55% for pyramid
    textboxGap: 0.02,         // 2% gap
    textbox: {
      strokeWidth: 1.5,
      cornerRadius: 6,
      padding: 8
    },
    text: {
      parentFontSizeRatio: 0.4,
      childFontSizeRatio: 0.3,
      bulletChar: '•'
    }
  }
};

// config/cycle.config.js
export const CYCLE_CONFIG = {
  // 基础循环 (cycle4)
  basic: {
    quadrant: {
      radiusRatio: 0.35,      // 35% of min(width, height)
      innerRadiusRatio: 0     // 实心
    },
    textbox: {
      widthRatio: 0.32,
      heightRatio: 0.342,
      cornerRadius: 8,
      strokeWidth: 1.5
    },
    centerArrow: {
      radiusRatio: 0.05
    },
    // 象限角度 (从顶部顺时针)
    quadrantAngles: [
      { start: 180, end: 270 },  // top-left
      { start: 270, end: 360 },  // top-right
      { start: 0, end: 90 },     // bottom-right
      { start: 90, end: 180 }    // bottom-left
    ]
  },

  // 分段循环 (cycle8)
  segmented: {
    innerRadiusRatio: 0.3
  }
};

// config/defaults.js
export const DEFAULTS = {
  // 通用形状默认值
  shape: {
    fill: '#FFFFFF',
    stroke: '#333333',
    strokeWidth: 2
  },
  // 通用文本默认值
  text: {
    fontFamily: 'Inter, sans-serif',
    fontSize: 14,
    lineHeight: 1.3,
    color: '#333333'
  },
  // 主题默认值
  theme: {
    light1: '#FFFFFF',
    dark1: '#000000',
    accent1: '#156082'
  }
};
```

### 4.3 声明式布局定义

```javascript
// layouts/pyramid.js

import { LayoutRegistry } from '../core/registry.js';
import { PYRAMID_CONFIG } from '../config/pyramid.config.js';

/**
 * 金字塔布局定义 - 借鉴 X6 声明式风格
 */
const PyramidLayout = {
  // 元信息
  name: 'pyramid',
  category: 'pyramid',
  displayName: '基础金字塔',

  // 配置 schema
  configSchema: {
    inverted: { type: 'boolean', default: false },
    listStyle: { type: 'boolean', default: false },
    segmented: { type: 'boolean', default: false }
  },

  // 默认配置
  defaultConfig: PYRAMID_CONFIG.basic,

  // 支持的变体
  variants: {
    'pyramid1': { listStyle: false, segmented: false },
    'pyramid2': { listStyle: true },
    'pyramid3': { inverted: true },
    'pyramid4': { segmented: true }
  },

  // 布局函数
  layout(option, config = {}) {
    const { items, size, theme } = option;
    const { inverted, listStyle, segmented } = {
      ...this.configSchema,
      ...config
    };

    // 委托给具体实现
    if (listStyle) return this.layoutList(option, config);
    if (segmented) return this.layoutSegmented(option, config);
    return this.layoutBasic(option, config);
  },

  // 基础金字塔
  layoutBasic(option, config) {
    const { items, size, theme } = option;
    const { width, height } = size;
    const cfg = { ...PYRAMID_CONFIG.basic, ...config };

    const count = items.length || 1;
    const itemHeight = height / count;
    const hasChildren = items.some(item => item.children?.length > 0);

    // 使用配置常量而非魔法数字
    const pyramidWidth = hasChildren
      ? width * PYRAMID_CONFIG.withChildren.pyramidWidthRatio
      : width;

    const shapes = [];

    items.forEach((item, idx) => {
      // 形状定义 - 声明式
      shapes.push(this.createTrapezoid({
        id: `shape-${idx}`,
        index: idx,
        count,
        bounds: { x: 0, y: idx * itemHeight, width: pyramidWidth, height: itemHeight },
        text: item.text || item,
        theme,
        config: cfg
      }));

      // 子节点文本框
      if (hasChildren && item.children?.length > 0) {
        shapes.push(this.createChildTextbox({
          id: `textbox-${idx}`,
          index: idx,
          bounds: this.calcTextboxBounds(idx, itemHeight, width, pyramidWidth),
          children: item.children,
          theme,
          config: cfg
        }));
      }
    });

    return { type: 'pyramid', shapes, connectors: [], bounds: { x: 0, y: 0, width, height } };
  },

  // 形状工厂方法
  createTrapezoid({ id, index, count, bounds, text, theme, config }) {
    const topRatio = index / count;
    const bottomRatio = (index + 1) / count;

    return {
      id,
      type: 'trapezoid',
      ...bounds,
      text,
      topWidthRatio: topRatio,
      bottomWidthRatio: bottomRatio,
      // 样式从配置读取
      fill: theme.childColors?.[index % 6] || theme.accent1,
      stroke: theme.light1,
      strokeWidth: config.shape.strokeWidth,
      textColor: theme.light1,
      fontSize: Math.min(config.text.maxFontSize, bounds.height * config.text.fontSizeRatio)
    };
  },

  createChildTextbox({ id, index, bounds, children, theme, config }) {
    const cfg = PYRAMID_CONFIG.withChildren;
    const bulletText = children.map(c => `${cfg.text.bulletChar} ${c.text || c}`).join('\n');

    return {
      id,
      type: 'roundRect',
      ...bounds,
      text: bulletText,
      fill: theme.light1,
      stroke: theme.childColors?.[index % 6] || theme.accent1,
      strokeWidth: cfg.textbox.strokeWidth,
      rx: cfg.textbox.cornerRadius,
      ry: cfg.textbox.cornerRadius,
      textColor: theme.dark1,
      fontSize: Math.min(16, bounds.height * cfg.text.childFontSizeRatio),
      textAlign: 'left',
      textVAlign: 'top'
    };
  },

  calcTextboxBounds(index, itemHeight, totalWidth, pyramidWidth) {
    const cfg = PYRAMID_CONFIG.withChildren;
    const x = pyramidWidth + totalWidth * cfg.textboxGap;
    return {
      x,
      y: index * itemHeight,
      width: totalWidth - x - 10,
      height: itemHeight
    };
  }

  // ... layoutList, layoutSegmented 类似实现
};

// 注册
LayoutRegistry.register('pyramid', PyramidLayout);
LayoutRegistry.register('pyramid1', PyramidLayout);  // 别名

export default PyramidLayout;
```

### 4.4 Attrs 属性系统

```javascript
// core/attrs.js

/**
 * 属性解析系统 - 借鉴 X6 Attrs
 * 支持相对定位、主题引用、默认值
 */
const AttrsResolver = {
  /**
   * 解析属性值
   * @param {*} value - 属性值或配置对象
   * @param {Object} context - 上下文 (theme, size, etc.)
   */
  resolve(value, context) {
    if (value === null || value === undefined) {
      return value;
    }

    // 简单值直接返回
    if (typeof value !== 'object') {
      return value;
    }

    // 引用解析: { ref: 'theme.light1', default: '#FFF' }
    if (value.ref) {
      const resolved = this.getByPath(context, value.ref);
      return resolved !== undefined ? resolved : value.default;
    }

    // 相对值解析: { refWidth: 0.5 } => width * 0.5
    if (value.refWidth !== undefined) {
      return context.size.width * value.refWidth;
    }
    if (value.refHeight !== undefined) {
      return context.size.height * value.refHeight;
    }
    if (value.refX !== undefined) {
      return context.bounds.x + context.bounds.width * value.refX;
    }
    if (value.refY !== undefined) {
      return context.bounds.y + context.bounds.height * value.refY;
    }

    // 计算值: { calc: (ctx) => ctx.size.width * 0.5 }
    if (typeof value.calc === 'function') {
      return value.calc(context);
    }

    return value;
  },

  /**
   * 批量解析属性
   */
  resolveAll(attrs, context) {
    const resolved = {};
    for (const [key, value] of Object.entries(attrs)) {
      resolved[key] = this.resolve(value, context);
    }
    return resolved;
  },

  /**
   * 路径取值
   */
  getByPath(obj, path) {
    return path.split('.').reduce((o, k) => o?.[k], obj);
  }
};

export default AttrsResolver;
```

### 4.5 PropHooks 属性钩子

```javascript
// core/prop-hooks.js

/**
 * 属性钩子系统 - 借鉴 X6 PropHooks
 * 用于简化 API，自动转换用户输入
 */
const PropHooks = {
  hooks: [],

  /**
   * 注册钩子
   */
  register(hook) {
    this.hooks.push(hook);
  },

  /**
   * 应用所有钩子
   */
  apply(props) {
    return this.hooks.reduce((p, hook) => hook(p), props);
  }
};

// 内置钩子: label 简写
PropHooks.register((props) => {
  if (props.label && !props.text) {
    return { ...props, text: props.label };
  }
  return props;
});

// 内置钩子: items 字符串数组转对象
PropHooks.register((props) => {
  if (Array.isArray(props.items)) {
    return {
      ...props,
      items: props.items.map(item =>
        typeof item === 'string' ? { text: item } : item
      )
    };
  }
  return props;
});

// 内置钩子: size 简写
PropHooks.register((props) => {
  if (typeof props.size === 'number') {
    return { ...props, size: { width: props.size, height: props.size } };
  }
  return props;
});

export default PropHooks;
```

---

## 5. 实现细节

### 5.1 SVG 渲染器重构

```javascript
// renderers/svg/index.js

import { RendererRegistry } from '../../core/registry.js';
import AttrsResolver from '../../core/attrs.js';

/**
 * SVG 渲染器 - 形状到 SVG 元素的映射
 */
const SVGRenderer = {
  ns: 'http://www.w3.org/2000/svg',

  /**
   * 渲染形状列表
   */
  render(shapes, container, context) {
    const svg = this.createSVG(context.size);
    const group = this.createElement('g', { class: 'smartart-shapes' });

    shapes.forEach(shape => {
      const renderer = ShapeRenderers.get(shape.type);
      if (renderer) {
        const el = renderer.render(shape, context);
        group.appendChild(el);

        // 文本渲染
        if (shape.text) {
          const textEl = this.renderText(shape, context);
          group.appendChild(textEl);
        }
      }
    });

    svg.appendChild(group);
    container.innerHTML = '';
    container.appendChild(svg);
    return svg;
  },

  createSVG(size) {
    return this.createElement('svg', {
      width: size.width,
      height: size.height,
      viewBox: `0 0 ${size.width} ${size.height}`
    });
  },

  createElement(tag, attrs = {}) {
    const el = document.createElementNS(this.ns, tag);
    for (const [key, value] of Object.entries(attrs)) {
      if (value !== undefined && value !== null) {
        el.setAttribute(key, value);
      }
    }
    return el;
  },

  renderText(shape, context) {
    // 使用 foreignObject 实现自动换行
    const fo = this.createElement('foreignObject', {
      x: shape.x + 8,
      y: shape.y + (shape.textVAlign === 'top' ? 8 : 0),
      width: shape.width - 16,
      height: shape.height
    });

    const div = document.createElement('div');
    div.className = 'smartart-text';
    div.style.cssText = this.getTextStyle(shape);
    div.textContent = shape.text;

    // 可编辑支持
    if (context.editable !== false) {
      div.contentEditable = 'true';
      div.dataset.shapeId = shape.id;
    }

    fo.appendChild(div);
    return fo;
  },

  getTextStyle(shape) {
    const align = shape.textAlign || 'center';
    const vAlign = shape.textVAlign || 'center';
    const alignItems = { top: 'flex-start', center: 'center', bottom: 'flex-end' };
    const justifyContent = { left: 'flex-start', center: 'center', right: 'flex-end' };

    return `
      display: flex;
      align-items: ${alignItems[vAlign]};
      justify-content: ${justifyContent[align]};
      width: 100%;
      height: 100%;
      text-align: ${align};
      font-family: ${shape.fontFamily || 'Inter, sans-serif'};
      font-size: ${shape.fontSize || 14}px;
      color: ${shape.textColor || '#333'};
      line-height: 1.3;
      white-space: pre-wrap;
      overflow: hidden;
    `;
  }
};

/**
 * 形状渲染器注册表
 */
const ShapeRenderers = {
  renderers: {},

  register(type, renderer) {
    this.renderers[type] = renderer;
  },

  get(type) {
    return this.renderers[type];
  }
};

// 注册内置形状渲染器
ShapeRenderers.register('rect', {
  render(shape) {
    return SVGRenderer.createElement('rect', {
      x: shape.x, y: shape.y,
      width: shape.width, height: shape.height,
      fill: shape.fill, stroke: shape.stroke,
      'stroke-width': shape.strokeWidth,
      rx: shape.rx, ry: shape.ry
    });
  }
});

ShapeRenderers.register('roundRect', {
  render(shape) {
    return SVGRenderer.createElement('rect', {
      x: shape.x, y: shape.y,
      width: shape.width, height: shape.height,
      fill: shape.fill, stroke: shape.stroke,
      'stroke-width': shape.strokeWidth,
      rx: shape.rx || 4, ry: shape.ry || 4
    });
  }
});

ShapeRenderers.register('trapezoid', {
  render(shape) {
    const { x, y, width, height, topWidthRatio, bottomWidthRatio } = shape;
    const topWidth = width * (topWidthRatio || 0);
    const bottomWidth = width * (bottomWidthRatio || 1);
    const topOffset = (width - topWidth) / 2;
    const bottomOffset = (width - bottomWidth) / 2;

    const points = [
      `${x + topOffset},${y}`,
      `${x + topOffset + topWidth},${y}`,
      `${x + bottomOffset + bottomWidth},${y + height}`,
      `${x + bottomOffset},${y + height}`
    ].join(' ');

    return SVGRenderer.createElement('polygon', {
      points,
      fill: shape.fill, stroke: shape.stroke,
      'stroke-width': shape.strokeWidth
    });
  }
});

ShapeRenderers.register('triangle', {
  render(shape) {
    const { x, y, width, height, inverted } = shape;
    let points;
    if (inverted) {
      points = `${x},${y} ${x + width},${y} ${x + width/2},${y + height}`;
    } else {
      points = `${x + width/2},${y} ${x + width},${y + height} ${x},${y + height}`;
    }
    return SVGRenderer.createElement('polygon', {
      points,
      fill: shape.fill, stroke: shape.stroke,
      'stroke-width': shape.strokeWidth
    });
  }
});

ShapeRenderers.register('pie', {
  render(shape) {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle } = shape;
    const path = this.createArcPath(cx, cy, innerRadius, outerRadius, startAngle, endAngle);
    return SVGRenderer.createElement('path', {
      d: path,
      fill: shape.fill, stroke: shape.stroke,
      'stroke-width': shape.strokeWidth
    });
  },

  createArcPath(cx, cy, innerR, outerR, startDeg, endDeg) {
    const toRad = deg => deg * Math.PI / 180;
    const start = toRad(startDeg);
    const end = toRad(endDeg);
    const largeArc = (endDeg - startDeg) > 180 ? 1 : 0;

    const outerStart = { x: cx + outerR * Math.cos(start), y: cy + outerR * Math.sin(start) };
    const outerEnd = { x: cx + outerR * Math.cos(end), y: cy + outerR * Math.sin(end) };

    if (innerR === 0) {
      return `M ${cx} ${cy} L ${outerStart.x} ${outerStart.y} A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y} Z`;
    }

    const innerStart = { x: cx + innerR * Math.cos(start), y: cy + innerR * Math.sin(start) };
    const innerEnd = { x: cx + innerR * Math.cos(end), y: cy + innerR * Math.sin(end) };

    return `M ${innerStart.x} ${innerStart.y}
            L ${outerStart.x} ${outerStart.y}
            A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}
            L ${innerEnd.x} ${innerEnd.y}
            A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y} Z`;
  }
});

export { SVGRenderer, ShapeRenderers };
```

### 5.2 入口重构

```javascript
// index.js

import { LayoutRegistry, RendererRegistry } from './core/registry.js';
import PropHooks from './core/prop-hooks.js';
import { SVGRenderer } from './renderers/svg/index.js';

// 自动注册所有布局
import './layouts/index.js';

/**
 * SmartArt 主类 - 类似 ECharts API
 */
class SmartArt {
  constructor(container) {
    this.container = container;
    this.option = null;
    this.layoutResult = null;
  }

  /**
   * 初始化实例
   */
  static init(container) {
    return new SmartArt(container);
  }

  /**
   * 注册布局 (静态方法)
   */
  static registerLayout(name, layout) {
    return LayoutRegistry.register(name, layout);
  }

  /**
   * 注册形状渲染器
   */
  static registerShape(name, renderer) {
    return ShapeRenderers.register(name, renderer);
  }

  /**
   * 设置配置并渲染
   */
  setOption(option) {
    // 应用 PropHooks 转换
    this.option = PropHooks.apply(option);

    // 获取布局
    const layout = LayoutRegistry.get(this.option.type);
    if (!layout) {
      throw new Error(`Unknown SmartArt type: ${this.option.type}`);
    }

    // 计算布局
    this.layoutResult = layout.layout(this.option, this.option.config);

    // 渲染
    SVGRenderer.render(this.layoutResult.shapes, this.container, {
      size: this.option.size,
      theme: this.option.theme,
      editable: this.option.editable
    });

    return this;
  }

  /**
   * 获取布局结果
   */
  getLayoutResult() {
    return this.layoutResult;
  }

  /**
   * 销毁实例
   */
  dispose() {
    this.container.innerHTML = '';
    this.option = null;
    this.layoutResult = null;
  }
}

// 导出
export default SmartArt;
export { LayoutRegistry, ShapeRenderers, PropHooks };
```

---

## 6. 迁移计划

### 6.1 阶段划分

```
Phase 1: 基础设施 (3天)
├── [x] 创建目录结构
├── [ ] 实现 Registry 模块
├── [ ] 实现配置常量模块
└── [ ] 实现 PropHooks

Phase 2: 核心重构 (5天)
├── [ ] 重构 pyramid 布局 (作为模板)
├── [ ] 重构 SVG 渲染器
├── [ ] 实现 Attrs 系统
└── [ ] 单元测试

Phase 3: 布局迁移 (5天)
├── [ ] 迁移 cycle 布局
├── [ ] 迁移 matrix 布局
├── [ ] 迁移 hierarchy 布局
├── [ ] 迁移其他布局
└── [ ] 集成测试

Phase 4: 收尾 (2天)
├── [ ] 文档更新
├── [ ] Bundle 构建
├── [ ] 回归测试
└── [ ] 发布

总计: ~15 工作日
```

### 6.2 风险评估

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|----------|
| 渲染差异 | 中 | 高 | 逐个布局对比测试 |
| 性能下降 | 低 | 中 | Benchmark 对比 |
| API 不兼容 | 中 | 高 | PropHooks 保持向后兼容 |
| 类型映射漂移（多处配置） | 高 | 高 | 建立单一事实源 + 自动生成 |
| 重构后未进入运行时 | 中 | 高 | 明确 bundle 构建/发布步骤，CI 检查产物变更 |
| 预览与最终 PPT 不一致 | 中 | 高 | 建立前后端契约表 + 端到端回归用例 |

### 6.3 验收标准

- [ ] 所有现有 SmartArt 类型正常渲染
- [ ] 无魔法数字，所有常量有注释说明来源
- [ ] 新增布局类型只改“一处事实源”，其余映射自动生成
- [ ] 单元测试覆盖率 > 80%
- [ ] Bundle 体积增长 < 20%
- [ ] 文档中明确“源码 -> bundle -> 页面生效”链路
- [ ] 前后端契约字段有测试覆盖（类型、颜色、层级结构）
- [ ] 至少 10 个代表性类型完成视觉基线对比（与 `assets/smartart-refs`）

---

## 7. 补充：落地与遗漏

### 7.1 前后端契约矩阵（必须固化）

| 字段 | 前端来源 | 后端消费 | 现状问题 | 重构后要求 |
|------|----------|----------|----------|------------|
| `smartart.type` | UI 选择器 | `SMARTART_TYPE_MAP` | 多处映射可能不一致 | 单一事实源生成两端映射 |
| `smartart.colorScheme` | UI 配色选择器 | `SMARTART_COLOR_SCHEME_MAP` | 语义一致但缺契约文档 | 统一枚举定义 + 校验 |
| `smartart.items` | 编辑器 + SVG inline edit | `SmartArtData` 节点数据 | 编辑回写可能破坏结构 | 保障 `{text, children}` 结构稳定 |
| `smartart.ooxml` | `SmartArt.toOOXML()` | 当前后端基本未使用细节 | 看起来导出了，实际未消费 | 明确是否消费；若不消费则删除/降级 |

**决策建议：**
- 路线 A（推荐，短期）: 以 `type + colorScheme + items` 作为唯一后端契约，`ooxml` 仅用于调试。
- 路线 B（中期）: 后端逐步消费 `ooxml` 细节，实现预览与导出高度一致。

### 7.2 单一事实源（Single Source of Truth）

当前类型信息至少存在三处：UI 类型列表、前端布局注册、后端类型映射。  
建议新增一份元数据源，例如：

```text
smartart/catalog.json   # 唯一事实源
├── id
├── ui.category / ui.label / ui.thumbnail
├── layout.impl
├── ooxml.layoutId
└── pptx.smartartType
```

由脚本自动生成：
- `js/config.smartart.generated.js`（UI 用）
- `js/smartart/types/registry.generated.js`（前端布局注册）
- `pptx_gen/smartart_map_generated.py`（后端映射）

这样可以把“新增类型的修改点”从 3 处收敛到 1 处。

#### 7.2.1 `catalog.json` 草案（可直接落地）

```json
{
  "version": "1.0.0",
  "categories": [
    { "id": "matrix", "label": "Matrix", "desc": "矩阵/循环结构" },
    { "id": "pyramid", "label": "Pyramid", "desc": "金字塔/漏斗结构" },
    { "id": "others", "label": "Others", "desc": "其他图形" }
  ],
  "types": [
    {
      "id": "pyramid",
      "ui": { "category": "pyramid", "label": "基础金字塔", "thumbnail": "pyramid1" },
      "layout": { "impl": "pyramid", "variant": "basic" },
      "ooxml": { "layoutId": "urn:microsoft.com/office/officeart/2005/8/layout/pyramid1" },
      "pptx": { "smartartType": "BASIC_PYRAMID" }
    },
    {
      "id": "pyramid-list",
      "ui": { "category": "pyramid", "label": "金字塔列表", "thumbnail": "pyramid2" },
      "layout": { "impl": "pyramid", "variant": "list" },
      "ooxml": { "layoutId": "urn:microsoft.com/office/officeart/2005/8/layout/pyramid2" },
      "pptx": { "smartartType": "PYRAMID_LIST" }
    },
    {
      "id": "cycle",
      "ui": { "category": "matrix", "label": "基础循环", "thumbnail": "cycle4" },
      "layout": { "impl": "cycle", "variant": "basic" },
      "ooxml": { "layoutId": "urn:microsoft.com/office/officeart/2005/8/layout/cycle4" },
      "pptx": { "smartartType": "BLOCK_CYCLE" }
    },
    {
      "id": "hierarchy",
      "ui": { "category": "others", "label": "组织架构", "thumbnail": "chart3" },
      "layout": { "impl": "hierarchy", "variant": "basic" },
      "ooxml": { "layoutId": "urn:microsoft.com/office/officeart/2005/8/layout/chart3" },
      "pptx": { "smartartType": "HIERARCHY" }
    }
  ]
}
```

> 说明：分类展示顺序由 `categories` 数组顺序决定，不再单独维护 `order` 字段。

#### 7.2.2 生成物契约（脚本产出应满足）

1. `js/config.smartart.generated.js`
   - 导出 `SMARTART_CATEGORIES` 与 `SMARTART_TYPES`（仅 UI 展示字段）
2. `js/smartart/types/registry.generated.js`
   - 导出 `SMARTART_TYPES`（含 `layout` 绑定与元数据）
3. `pptx_gen/smartart_map_generated.py`
   - 导出 `SMARTART_TYPE_MAP`（字符串映射到 `SMARTART_TYPE.*`）

#### 7.2.3 引入步骤（最小改造）

1. [x] 新增 `smartart/catalog.json`（当前已覆盖 19 个类型）。
2. [x] 新增生成脚本 `scripts/generate-smartart-catalog.js`。
3. [x] 将 `js/config.js` 与 `pptx_gen/themes.py` 中 SmartArt 映射改为引用生成产物。
4. [x] CI 增加检查：`catalog.json` 变更后，生成产物必须同步变更。

### 7.3 构建与发布链路（补齐最后一公里）

当前运行时直接加载 `js/smartart.bundle.js`，因此重构后必须定义产物更新规则：

1. 源码改动目录：`js/smartart/**`
2. 产物文件：`js/smartart.bundle.js`
3. 页面入口：`index.html` 的 `<script src="js/smartart.bundle.js?...">`
4. 发布前检查：
   - [x] bundle 已更新（`scripts/build-smartart.sh` + CI 校验）
   - [x] 浏览器 smoke 已自动化（Playwright，覆盖 SmartArt 页面、引擎切换、`/generate` 请求契约）
   - [x] 导出 PPT 回归通过（`tests/test_smartart.py`）

如果短期不引入完整打包器，也需要至少补一份明确的 bundling 脚本和 README。

当前落地脚本：

```json
{
  "scripts": {
    "smartart:build": "scripts/build-smartart.sh",
    "smartart:pipeline": "scripts/smartart-pipeline.sh"
  }
}
```

```bash
# scripts/build-smartart.sh (当前实现)
#!/usr/bin/env bash
set -euo pipefail
npx --yes esbuild@0.25.10 js/smartart/bundle-entry.js \
  --bundle --format=iife --global-name=SmartArt \
  --minify --outfile=js/smartart.bundle.js
```

> 说明：已从 `cat` 拼接升级为 `esbuild`，保证依赖顺序与可重复产物。

### 7.4 单引擎持续迭代策略

当前策略已调整为单引擎持续迭代（不保留 `legacy/next` 分轨开关）：

- 统一维护一套 SmartArt 运行时实现，降低状态分叉和认知成本。
- 通过 `catalog + pipeline + snapshot + smoke` 控制迭代风险。
- 回滚依赖 Git commit/版本发布策略，而非运行时引擎切换。

### 7.5 已知缺陷纳入回归基线

重构前先记录并建用例，避免“旧 bug 被隐藏，误判重构成功”：

- `matrix-cycle` 连接器类型与渲染器支持不一致（`arrow` 未被渲染）。
- 文本编辑回写按 shapeId 尾号索引，可能把对象节点覆盖成字符串，导致 `children` 丢失。
- 部分 layoutId/preset 映射存在语义错位风险（需逐项核对 ooxmlId 与类型名）。

当前状态：
- [x] 已修复 `matrix-cycle` 的 `arrow` 连接器渲染。
- [x] 已修复文本回写导致 `children` 丢失问题。
- [ ] `layoutId/preset` 语义核对仍需逐项完成。

### 7.6 测试策略增强（不仅是覆盖率）

除单测覆盖率外，增加三类质量门禁：

1. 几何快照测试  
输入固定 `items + size + theme`，断言 `layoutResult` 的关键字段（位置、尺寸、连接关系）。
   - [x] 已落地：`scripts/verify-smartart-layout-snapshots.sh` + `tests/snapshots/smartart_layout_snapshots.json`（19 类型）

2. 视觉回归测试  
对齐 `assets/smartart-refs`，产出截图后做像素或结构比对（可允许阈值）。

当前仓库状态：
- `assets/smartart-refs` 目录已存在（当前约 37 个参考文件，含 png/svg）。
- 仍需在 Phase 0 明确“哪些类型/变体算基线覆盖完成”。

3. 端到端导出回归  
前端生成配置 -> 后端生成 PPTX -> 验证 SmartArt 类型、颜色方案、节点数与层级。
   - [x] 已纳入 pipeline：`tests/test_smartart.py`

### 7.7 性能预算与观测指标

建议把性能验收从“体积”扩展到“交互体验”：

| 指标 | 目标值（初版） | 场景 |
|------|----------------|------|
| 首次渲染耗时 | < 50ms | 6 节点基础类型 |
| 复杂类型渲染耗时 | < 120ms | 20+ 节点层级图 |
| 文本编辑回流耗时 | < 16ms | 单次输入更新 |
| Bundle 增长 | < 20% | 相比现网版本 |

来源说明：
- `16ms` 来自 60fps 单帧预算（交互不卡顿基线）。
- `50ms / 120ms` 为当前工程目标值（估算），用于约束重构方向。
- 已具备观测能力：`SmartArt.getMetrics()` 与 `SmartArt.benchmark(...)`。
- 已提供可重复布局基线脚本：`npm run smartart:benchmark`（输出 `reports/smartart-layout-benchmark.json`）。
- Phase 0/1 仍需补一次固定场景基线测量，测完后把“估算值”替换为“实测阈值”。

### 7.8 统一文字颜色解析算法（已实现）

为避免“预览与导出颜色解释不一致”，文字颜色采用统一解析链路：

1. 从 `layout*.xml` 找文本容器对应 `styleLbl`（如 `revTx`、`alignAcc1`）。
2. 按优先级取颜色键：`colors*.xml/txFillClrLst` 优先，缺失时回退 `quickStyle*.xml/fontRef`。
3. 通过 `clrMap` 把 `tx1/bg1/...` 映射到 `dk1/lt1/...`。
4. 通过 `theme1.xml/clrScheme` 解析最终 RGB。

公式：

```text
finalTextColor = theme[ clrMap[ colorKeyFrom(styleLbl) ] ]
```

当前落地：

- 解析实现：`pptx_gen/smartart_text_color_resolver.py`
- 命令行分析脚本：`scripts/analyze-smartart-text-colors.py`
- 回归测试：`tests/test_smartart_text_color_resolver.py`

示例命令：

```bash
python3 scripts/analyze-smartart-text-colors.py /path/to/generated.pptx
```

### 7.9 迁移阶段调整（建议）

在原有 4 阶段基础上增加一个前置阶段：

```text
Phase 0: 对齐与基线 (2天)
├── 梳理前后端契约矩阵
├── 固化单一事实源方案
├── 建立已知缺陷回归用例
└── 明确 bundle 构建脚本
```

这样 Phase 1-4 的开发和验收更可控，减少返工。

---

## 附录

### A. 参考资料

- [X6 GitHub](https://github.com/antvis/X6)
- [X6 官方文档](https://x6.antv.antgroup.com/)
- [OOXML SmartArt 规范](https://docs.microsoft.com/en-us/openspecs/office_standards/)

### B. 术语表

| 术语 | 说明 |
|------|------|
| Registry | 注册表，用于动态注册和查找实体 |
| Markup | 声明式的 SVG 结构定义 |
| Attrs | 属性系统，支持相对定位和主题引用 |
| PropHooks | 属性钩子，用于转换用户输入 |
| Layout | 布局算法，计算形状位置和大小 |
| Shape | 形状数据模型，包含位置、样式、文本 |
