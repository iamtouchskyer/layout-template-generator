# Layout × Theme Generator 架构文档

> 通过"乘法设计"批量生成高质量 PPT 模板

## 核心理念：乘法组合

传统 PPT 模板设计是**加法思维**：设计师逐页制作，每页都是独立作品。

本项目采用**乘法思维**：将设计拆解为独立变量，通过组合产生指数级变化。

```
最终模板数 = L1变量组合 × L2变量组合 × 内容变量组合
```

---

## 分层架构

### L1 层：Slide Master（母版层）

定义所有页面共享的视觉基础，一次配置，全局生效。

```
L1 = Theme × Shapes × Placeholders × Content Areas
```

| 变量 | 选项数 | 说明 |
|------|--------|------|
| Theme (主题) | 12 | 配色 + 字体方案 |
| Decorative Shapes (装饰形状) | ~20 | 边栏、角标、圆点、线条等 |
| Placeholders (占位符) | 3 | Logo、页码、日期 |
| Content Areas (内容区域) | 3×3 | 标题样式 × 页脚样式 |

**示例组合**：
- 柔和桃色主题 + 左侧边栏 + 右下角圆点 + 带标签标题 + 数据来源页脚
- 深蓝金配色 + 无装饰 + Logo左上 + 页码右下 + 简洁标题

### L2 层：Page Type（页面类型）

定义单页的结构和布局，每种类型有独立的变量空间。

```
L2 = Cover | Divider | Content-Grid | Content-SmartArt
```

#### Divider（章节页）的乘法

```
Divider = Layout × SectionCount × NumberStyle × TextLevel × BgStyle
            8    ×     4       ×      4       ×     2     ×    4
          = 1,024 种组合
```

| 变量 | 选项 | 说明 |
|------|------|------|
| Layout (布局) | strips, cards, cards-highlight, arrow, fullbleed, left-align, left-align-mirror, left-align-minimal | 8种视觉风格 |
| SectionCount (章节数) | 3, 4, 5, 6 | 决定显示多少章节 |
| NumberStyle (编号样式) | arabic(1,2,3), roman(I,II,III), chinese(一,二,三), circled(①,②,③) | 4种编号风格 |
| TextLevel (文字层级) | full, compact | 完整/精简文字 |
| BgStyle (背景样式) | solid, gradient, split, light | 4种背景效果 |

#### Content-Grid（内容页）的乘法

```
Content-Grid = LayoutPattern × ZoneContents
                   15+       ×    6^n
```

| 变量 | 选项 | 说明 |
|------|------|------|
| LayoutPattern (布局模式) | single, two-col-equal, two-col-left, three-col, four-grid, six-grid, top-two-bottom, left-one-right-two... | 15+种布局 |
| ZoneContent (区域内容) | chart, text, metric, table, bullets, image | 每个区域可选6种内容类型 |

**2区域布局**：6² = 36 种内容组合
**4区域布局**：6⁴ = 1,296 种内容组合

#### Content-SmartArt（关系图页）的乘法

```
SmartArt = Type × Placement
           30+  ×    5
```

| 变量 | 选项 | 说明 |
|------|------|------|
| Type (类型) | stairs, journey, funnel, pyramid, matrix, bullseye, edge, spectrum... | 30+种关系图形 |
| Placement (位置) | full, left-desc, right-desc, top-desc, bottom-desc | 5种布局位置 |

---

## 数据流架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Browser)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│   │   state.js  │───▶│   ui.js     │───▶│  render.js  │        │
│   │ (应用状态)   │    │ (交互逻辑)   │    │ (渲染预览)   │        │
│   └─────────────┘    └──────┬──────┘    └──────┬──────┘        │
│                             │                   │                │
│                             ▼                   ▼                │
│                    ┌─────────────┐      ┌─────────────┐         │
│                    │ JSON Config │      │  ECharts    │         │
│                    │ (导出配置)   │      │  (图表渲染)  │         │
│                    └──────┬──────┘      └─────────────┘         │
│                           │                                      │
└───────────────────────────┼──────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Backend (Python)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────┐    ┌─────────────────┐                    │
│   │ pptx_generator  │───▶│   python-pptx   │                    │
│   │   (配置解析)     │    │   (PPTX生成)    │                    │
│   └─────────────────┘    └─────────────────┘                    │
│                                                                  │
│   支持: SmartArt, 动画, 过渡, 图表, 主题                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 可移植数据格式

关键设计：**同一份数据，前后端通用**

### Chart 数据格式

```javascript
// 可移植格式（存储在 JSON config 中）
{
  "title": "月度销售趋势",
  "chartType": "line",           // line | bar | pie | area
  "categories": ["1月", "2月", "3月", "4月", "5月", "6月"],
  "series": [
    { "name": "销售额", "data": [820, 932, 901, 1234, 1290, 1430] }
  ]
}
```

**前端**：`toEChartsOption()` 转换为 ECharts 配置渲染预览
**后端**：`CategoryChartData` 转换为 python-pptx 图表对象

### Zone 内容映射

| contentType | 前端渲染 | 后端渲染 |
|-------------|----------|----------|
| chart | ECharts 实例 | `add_chart()` |
| text | HTML 段落 | `add_textbox()` |
| metric | 大数字 + 标签 | 文本框组合 |
| table | HTML table | `add_table()` |
| bullets | HTML ul/li | 带项目符号的文本框 |
| image | 占位符 | `add_picture()` |

---

## 样本数据系统

每种内容类型预置多个样本，根据 Zone ID (A, B, C, D) 轮换显示，确保预览有真实感。

```javascript
// Zone A (index=0) → 样本[0]
// Zone B (index=1) → 样本[1]
// Zone C (index=2) → 样本[2]
// Zone D (index=3) → 样本[3]

const CHART_SAMPLES = [
  { title: '月度销售趋势', chartType: 'line', ... },   // Zone A
  { title: '市场份额分布', chartType: 'pie', ... },    // Zone B
  { title: '季度对比分析', chartType: 'bar', ... },    // Zone C
  { title: '用户增长曲线', chartType: 'area', ... },   // Zone D
];
```

这样即使 4 个区域都选 "chart"，也会显示 4 种不同的图表。

---

## 配置文件结构

### slide-master.json（主配置）

```json
{
  "slideSize": {
    "16:9": { "width": 1280, "height": 720 },
    "4:3": { "width": 1024, "height": 768 }
  },
  "shapes": {
    "side-bar": {
      "configType": "thickness-positions",
      "thickness": { "thin": {...}, "medium": {...} },
      "positions": { "left": {...}, "right": {...} }
    }
  },
  "placeholders": {
    "logo": { "positions": {...}, "sizes": {...} },
    "page-number": { "positions": {...} }
  },
  "contentAreas": {
    "title": { "styles": {...}, "heights": {...} },
    "footer": { "heights": {...} }
  },
  "gridLayouts": {
    "two-col-equal": { "direction": "row", "zones": [...] },
    "four-grid": { "direction": "grid", "zones": [...] }
  }
}
```

### 导出的 JSON Config（传给 python-pptx）

```json
{
  "slide": { "width": 1280, "height": 720 },
  "theme": "soft_peach_cream",
  "slideMaster": {
    "decorativeShapes": [...],
    "placeholders": {...},
    "contentAreas": {
      "titleStyle": "with-tag",
      "headerBounds": { "x": 40, "y": 20, "width": 1200, "height": 60 },
      "bodyBounds": { "x": 40, "y": 88, "width": 1200, "height": 592 }
    }
  },
  "pageType": "content-grid",
  "grid": {
    "layout": "two-col-equal",
    "zones": [
      { "id": "A", "content": "chart", "chartData": {...} },
      { "id": "B", "content": "text", "textData": {...} }
    ]
  }
}
```

---

## 扩展指南

### 添加新的 Theme

1. 在 `slide-master.json` 的 `themes` 中添加配色
2. 在 `pptx_generator.py` 的 `THEME_COLORS` 中添加映射
3. 在 `index.html` 的主题选择器中添加选项

### 添加新的装饰形状

1. 在 `slide-master.json` 的 `shapes` 中定义配置
2. 在 `js/render.js` 的 `renderThicknessPositionShape()` 中添加 HTML 渲染
3. 在 `pptx_generator.py` 的 `add_master_decorative_shape()` 中添加 PPTX 渲染

### 添加新的布局模式

1. 在 `slide-master.json` 的 `gridLayouts` 中定义 zones
2. 在 `styles/layouts.css` 中添加 CSS grid 规则
3. 在 `pptx_generator.py` 的 `calculate_zone_positions()` 中添加位置计算

### 添加新的内容类型

1. 在 `slide-master.json` 的 `zoneContentTypes` 中添加类型
2. 在 `js/render.js` 中添加样本数据和 `renderZoneContent()` case
3. 在 `pptx_generator.py` 的 `render_zone_content()` 中添加 case

---

## 设计原则

### 1. 变量独立性
每个变量应该能独立变化，不与其他变量强耦合。

✅ 好：NumberStyle 可以和任何 Layout 组合
❌ 差：某个 Layout 只支持特定的 NumberStyle

### 2. 语义一致性
同一概念在前后端使用相同的命名和结构。

```javascript
// 前端
state.dividerBgStyle = 'gradient'

// 后端
bg_style = config['divider']['bgStyle']  // 'gradient'
```

### 3. 渐进增强
优先实现最小可用版本，再逐步增加变量维度。

```
v1: Layout only
v2: Layout × NumberStyle
v3: Layout × NumberStyle × TextLevel
v4: Layout × NumberStyle × TextLevel × BgStyle
```

### 4. 预览即所得
前端预览应尽可能接近最终 PPTX 输出。

- 使用相同的像素尺寸 (1280×720 for 16:9)
- 使用相同的字体和颜色变量
- 图表使用真实数据渲染

---

## 总结

```
传统方式：100 页 PPT = 设计师画 100 页
乘法方式：100 页 PPT = 10 个变量 × 10 个选项，设计师定义规则

本项目：
- L1 (12 themes × 20 shapes × 8 placeholder组合 × 9 content area组合)
- × L2-Divider (8 × 4 × 4 × 2 × 4 = 1,024)
- × L2-Grid (15 layouts × 6^n zones)
- × L2-SmartArt (30 × 5 = 150)

= 理论上数百万种独特组合
```

这就是**乘法设计**的威力。
