/**
 * Layout HTML templates (inlined to avoid CORS issues)
 * Auto-generated from layout-selector/assets/layouts/
 */
const LAYOUT_HTML = {};

LAYOUT_HTML['modern'] = {};
LAYOUT_HTML['modern']['2-column-footer'] = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=1280, initial-scale=1.0">
    <title>{{title}}</title>
    <style>        :root {
            --bg-color: {{theme.backgroundColor}};
            --heading-color: {{theme.headingColor}};
            --body-color: {{theme.bodyColor}};
            --muted-color: {{theme.mutedColor}};
            --accent-color: {{theme.accentColor}};
            --accent-light: {{theme.accentLight}};
            --card-bg: {{theme.cardBg}};
            --card-border: {{theme.cardBorder}};
            --heading-font: {{theme.headingFontFamily}};
            --body-font: {{theme.bodyFontFamily}};
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: var(--body-font);
            background-color: var(--bg-color);
            color: var(--body-color);
            width: 1280px;
            height: 720px;
            overflow: hidden;
        }

        .slide-container {
            width: 1280px;
            height: 720px;
            position: relative;
            display: flex;
            flex-direction: column;
        }

        .header-bar {
            height: 80px;
            position: relative;
            padding: 20px 0 0 60px;
        }

        .title {
            font-family: var(--heading-font);
            font-size: 32px;
            font-weight: 600;
            color: var(--heading-color);
            line-height: 1.2;
            width: 900px;
        }

        .header-decor {
            position: absolute;
            top: 20px;
            right: 0;
        }

        .header-accent {
            background-color: var(--accent-color);
            height: 40px;
            width: 180px;
            padding: 0 24px 0 40px;
            display: flex;
            align-items: center;
            gap: 16px;
            border-radius: 20px 0 0 20px;
        }

        .category-label {
            font-size: 12px;
            font-weight: 600;
            color: rgba(255,255,255,0.9);
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }

        .page-number {
            font-size: 18px;
            font-weight: 700;
            color: white;
        }

        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 16px 60px 40px;
            gap: 16px;
        }

        .main-grid {
            flex: 1;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
            min-height: 0;
        }

        .card {
            background: var(--card-bg);
            border-radius: 16px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            border: 1px solid var(--card-border);
            padding: 16px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .card-title {
            font-size: 18px;
            font-weight: 600;
            color: var(--heading-color);
            padding-bottom: 12px;
            margin-bottom: 12px;
            border-bottom: 1px solid var(--card-border);
            line-height: 1.3;
        }

        .card-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 12px;
            overflow: hidden;
        }

        .section-label {
            font-size: 10px;
            font-weight: 700;
            color: var(--accent-color);
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 8px;
        }

        .bullet-list {
            list-style: none;
        }

        .bullet-item {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            font-size: 12px;
            color: var(--body-color);
            line-height: 1.5;
            margin-bottom: 6px;
        }

        .bullet-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: var(--accent-color);
            margin-top: 5px;
            flex-shrink: 0;
        }

        .bullet-dot.outline {
            background: transparent;
            border: 1px solid var(--accent-color);
        }

        .footer-section {
            flex-shrink: 0;
        }

        .footer-card {
            background: var(--card-bg);
            border-radius: 16px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            border: 1px solid var(--card-border);
            padding: 16px;
        }

        .footer-card-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--heading-color);
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .footer-card-title .highlight {
            color: var(--accent-color);
        }

        .footer-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px 24px;
        }

        .footer-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            font-size: 13px;
            color: var(--body-color);
            line-height: 1.4;
        }

        .footer-number {
            width: 24px;
            height: 24px;
            background: var(--accent-light);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: 700;
            color: var(--accent-color);
            flex-shrink: 0;
        }

        .footer-info {
            position: absolute;
            bottom: 20px;
            left: 60px;
            font-size: 12px;
            color: var(--muted-color);
        }
    </style>
</head>
<body>
    <div class="slide-container">
        <div class="header-bar">
            <h1 class="title" data-zone="title">{{title}}</h1>
            <div class="header-decor">
                <div class="header-accent" data-pptx-group="header-decor">
                    <span class="category-label">{{category}}</span>
                    <span class="page-number" data-zone="page-number">{{page_number}}</span>
                </div>
            </div>
        </div>

        <div class="content" data-role="content">
            <div class="main-grid">
                <div class="card" data-pptx-group="card-1">
                    <h2 class="card-title">{{heading_1}}</h2>
                    <div class="card-content">
                        <div>
                            <h3 class="section-label">{{section_label}}</h3>
                            <ul class="bullet-list">
                                <li class="bullet-item"><span class="bullet-dot"></span><span>{{bullet_1}}</span></li>
                                <li class="bullet-item"><span class="bullet-dot"></span><span>{{bullet_2}}</span></li>
                                <li class="bullet-item"><span class="bullet-dot"></span><span>{{bullet_3}}</span></li>
                            </ul>
                        </div>
                        <div>
                            <h3 class="section-label">{{section_label_2}}</h3>
                            <ul class="bullet-list">
                                <li class="bullet-item"><span class="bullet-dot outline"></span><span>{{milestone_1}}</span></li>
                                <li class="bullet-item"><span class="bullet-dot outline"></span><span>{{milestone_2}}</span></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="card" data-pptx-group="card-2">
                    <h2 class="card-title">{{heading_2}}</h2>
                    <div class="card-content">
                        <div>
                            <h3 class="section-label">{{section_label}}</h3>
                            <ul class="bullet-list">
                                <li class="bullet-item"><span class="bullet-dot"></span><span>{{bullet_4}}</span></li>
                                <li class="bullet-item"><span class="bullet-dot"></span><span>{{bullet_5}}</span></li>
                                <li class="bullet-item"><span class="bullet-dot"></span><span>{{bullet_6}}</span></li>
                            </ul>
                        </div>
                        <div>
                            <h3 class="section-label">{{section_label_3}}</h3>
                            <ul class="bullet-list">
                                <li class="bullet-item"><span class="bullet-dot outline"></span><span>{{milestone_3}}</span></li>
                                <li class="bullet-item"><span class="bullet-dot outline"></span><span>{{milestone_4}}</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div class="footer-section">
                <div class="footer-card" data-pptx-group="footer-card">
                    <h2 class="footer-card-title">
                        <span class="highlight">{{footer_highlight}}</span> {{footer_title}}
                    </h2>
                    <div class="footer-grid">
                        <div class="footer-item">
                            <span class="footer-number">01</span>
                            <span>{{footer_item_1}}</span>
                        </div>
                        <div class="footer-item">
                            <span class="footer-number">02</span>
                            <span>{{footer_item_2}}</span>
                        </div>
                        <div class="footer-item">
                            <span class="footer-number">03</span>
                            <span>{{footer_item_3}}</span>
                        </div>
                        <div class="footer-item">
                            <span class="footer-number">04</span>
                            <span>{{footer_item_4}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="footer-info">{{footer}}</div>
    </div>
</body>
</html>`;
LAYOUT_HTML['modern']['2-column'] = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=1280, initial-scale=1.0">
    <title>{{title}}</title>
    <style>        :root {
            --bg-color: {{theme.backgroundColor}};
            --heading-color: {{theme.headingColor}};
            --body-color: {{theme.bodyColor}};
            --muted-color: {{theme.mutedColor}};
            --accent-color: {{theme.accentColor}};
            --accent-light: {{theme.accentLight}};
            --card-bg: {{theme.cardBg}};
            --card-border: {{theme.cardBorder}};
            --heading-font: {{theme.headingFontFamily}};
            --body-font: {{theme.bodyFontFamily}};
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: var(--body-font);
            background-color: var(--bg-color);
            color: var(--body-color);
            width: 1280px;
            height: 720px;
            overflow: hidden;
        }

        .slide-container {
            width: 1280px;
            height: 720px;
            position: relative;
            display: flex;
            flex-direction: column;
        }

        .header-bar {
            height: 80px;
            position: relative;
            padding: 20px 0 0 60px;
        }

        .title {
            font-family: var(--heading-font);
            font-size: 32px;
            font-weight: 600;
            color: var(--heading-color);
            line-height: 1.2;
            width: 900px;
        }

        .header-decor {
            position: absolute;
            top: 20px;
            right: 0;
        }

        .header-accent {
            background-color: var(--accent-color);
            height: 40px;
            width: 180px;
            padding: 0 24px 0 40px;
            display: flex;
            align-items: center;
            gap: 16px;
            border-radius: 20px 0 0 20px;
        }

        .category-label {
            font-size: 12px;
            font-weight: 600;
            color: rgba(255,255,255,0.9);
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }

        .page-number {
            font-size: 18px;
            font-weight: 700;
            color: white;
        }

        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 16px 60px 40px;
            gap: 16px;
        }

        .main-grid {
            flex: 1;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
            min-height: 0;
        }

        .card {
            background: var(--card-bg);
            border-radius: 16px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            border: 1px solid var(--card-border);
            padding: 16px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .card-title {
            font-size: 18px;
            font-weight: 600;
            color: var(--heading-color);
            padding-bottom: 12px;
            margin-bottom: 12px;
            border-bottom: 1px solid var(--card-border);
            line-height: 1.3;
        }

        .card-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 12px;
            overflow: hidden;
        }

        .section-label {
            font-size: 10px;
            font-weight: 700;
            color: var(--accent-color);
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 8px;
        }

        .bullet-list {
            list-style: none;
        }

        .bullet-item {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            font-size: 12px;
            color: var(--body-color);
            line-height: 1.5;
            margin-bottom: 6px;
        }

        .bullet-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: var(--accent-color);
            margin-top: 5px;
            flex-shrink: 0;
        }

        .bullet-dot.outline {
            background: transparent;
            border: 1px solid var(--accent-color);
        }

        .footer-section {
            flex-shrink: 0;
        }

        .footer-card {
            background: var(--card-bg);
            border-radius: 16px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            border: 1px solid var(--card-border);
            padding: 16px;
        }

        .footer-card-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--heading-color);
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .footer-card-title .highlight {
            color: var(--accent-color);
        }

        .footer-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px 24px;
        }

        .footer-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            font-size: 13px;
            color: var(--body-color);
            line-height: 1.4;
        }

        .footer-number {
            width: 24px;
            height: 24px;
            background: var(--accent-light);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: 700;
            color: var(--accent-color);
            flex-shrink: 0;
        }

        .footer-info {
            position: absolute;
            bottom: 20px;
            left: 60px;
            font-size: 12px;
            color: var(--muted-color);
        }
    </style>
</head>
<body>
    <div class="slide-container">
        <div class="header-bar">
            <h1 class="title" data-zone="title">{{title}}</h1>
            <div class="header-decor">
                <div class="header-accent" data-pptx-group="header-decor">
                    <span class="category-label">{{category}}</span>
                    <span class="page-number" data-zone="page-number">{{page_number}}</span>
                </div>
            </div>
        </div>

        <div class="content" data-role="content">
            <div class="main-grid">
                <div class="card" data-pptx-group="card-1">
                    <h2 class="card-title">{{heading_1}}</h2>
                    <div class="card-content">
                        <div>
                            <h3 class="section-label">{{section_label}}</h3>
                            <ul class="bullet-list">
                                <li class="bullet-item"><span class="bullet-dot"></span><span>{{bullet_1}}</span></li>
                                <li class="bullet-item"><span class="bullet-dot"></span><span>{{bullet_2}}</span></li>
                                <li class="bullet-item"><span class="bullet-dot"></span><span>{{bullet_3}}</span></li>
                            </ul>
                        </div>
                        <div>
                            <h3 class="section-label">{{section_label_2}}</h3>
                            <ul class="bullet-list">
                                <li class="bullet-item"><span class="bullet-dot outline"></span><span>{{milestone_1}}</span></li>
                                <li class="bullet-item"><span class="bullet-dot outline"></span><span>{{milestone_2}}</span></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="card" data-pptx-group="card-2">
                    <h2 class="card-title">{{heading_2}}</h2>
                    <div class="card-content">
                        <div>
                            <h3 class="section-label">{{section_label}}</h3>
                            <ul class="bullet-list">
                                <li class="bullet-item"><span class="bullet-dot"></span><span>{{bullet_4}}</span></li>
                                <li class="bullet-item"><span class="bullet-dot"></span><span>{{bullet_5}}</span></li>
                                <li class="bullet-item"><span class="bullet-dot"></span><span>{{bullet_6}}</span></li>
                            </ul>
                        </div>
                        <div>
                            <h3 class="section-label">{{section_label_3}}</h3>
                            <ul class="bullet-list">
                                <li class="bullet-item"><span class="bullet-dot outline"></span><span>{{milestone_3}}</span></li>
                                <li class="bullet-item"><span class="bullet-dot outline"></span><span>{{milestone_4}}</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div class="footer-section">
                <div class="footer-card" data-pptx-group="footer-card">
                    <h2 class="footer-card-title">
                        <span class="highlight">{{footer_highlight}}</span> {{footer_title}}
                    </h2>
                    <div class="footer-grid">
                        <div class="footer-item">
                            <span class="footer-number">01</span>
                            <span>{{footer_item_1}}</span>
                        </div>
                        <div class="footer-item">
                            <span class="footer-number">02</span>
                            <span>{{footer_item_2}}</span>
                        </div>
                        <div class="footer-item">
                            <span class="footer-number">03</span>
                            <span>{{footer_item_3}}</span>
                        </div>
                        <div class="footer-item">
                            <span class="footer-number">04</span>
                            <span>{{footer_item_4}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="footer-info">{{footer}}</div>
    </div>
</body>
</html>`;
LAYOUT_HTML['modern']['3-cards'] = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=1280, initial-scale=1.0">
    <title>{{title}}</title>
    <style>        :root {
            --bg-color: {{theme.backgroundColor}};
            --heading-color: {{theme.headingColor}};
            --body-color: {{theme.bodyColor}};
            --muted-color: {{theme.mutedColor}};
            --accent-color: {{theme.accentColor}};
            --accent-light: {{theme.accentLight}};
            --card-bg: {{theme.cardBg}};
            --card-border: {{theme.cardBorder}};
            --heading-font: {{theme.headingFontFamily}};
            --body-font: {{theme.bodyFontFamily}};
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: var(--body-font);
            background-color: var(--bg-color);
            color: var(--body-color);
            width: 1280px;
            height: 720px;
            overflow: hidden;
        }

        .slide-container {
            width: 1280px;
            height: 720px;
            position: relative;
            display: flex;
            flex-direction: column;
        }

        .header-bar {
            height: 80px;
            position: relative;
            padding: 20px 0 0 60px;
        }

        .header-text {
            width: 900px;
        }

        .title {
            font-family: var(--heading-font);
            font-size: 32px;
            font-weight: 600;
            color: var(--heading-color);
            line-height: 1.2;
        }

        .subtitle {
            font-size: 14px;
            color: var(--body-color);
            margin-top: 4px;
        }

        .header-decor {
            position: absolute;
            top: 20px;
            right: 0;
        }

        .header-accent {
            background-color: var(--accent-color);
            height: 40px;
            width: 180px;
            padding: 0 24px 0 40px;
            display: flex;
            align-items: center;
            gap: 16px;
            border-radius: 20px 0 0 20px;
        }

        .category-label {
            font-size: 12px;
            font-weight: 600;
            color: rgba(255,255,255,0.9);
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }

        .page-number {
            font-size: 18px;
            font-weight: 700;
            color: white;
        }

        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 20px 60px 40px;
        }

        .main {
            flex: 1;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
        }

        .card {
            background: var(--card-bg);
            border-radius: 16px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            border: 1px solid var(--card-border);
            padding: 24px;
            display: flex;
            flex-direction: column;
        }

        .card-header {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding-bottom: 16px;
            margin-bottom: 16px;
            border-bottom: 1px solid var(--card-border);
        }

        .card-icon {
            width: 40px;
            height: 40px;
            background: var(--accent-light);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            font-size: 18px;
            color: var(--accent-color);
        }

        .card-title {
            font-size: 16px;
            font-weight: 700;
            color: var(--heading-color);
            line-height: 1.3;
        }

        .card-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .section-label {
            font-size: 10px;
            font-weight: 700;
            color: var(--accent-color);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 8px;
        }

        .bullet-list {
            list-style: none;
        }

        .bullet-item {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            font-size: 12px;
            color: var(--body-color);
            line-height: 1.5;
            margin-bottom: 6px;
        }

        .bullet-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: var(--accent-color);
            margin-top: 5px;
            flex-shrink: 0;
        }

        .footer-info {
            position: absolute;
            bottom: 20px;
            left: 60px;
            font-size: 12px;
            color: var(--muted-color);
        }
    </style>
</head>
<body>
    <div class="slide-container">
        <div class="header-bar">
            <div class="header-text">
                <h1 class="title" data-zone="title" data-layout-placeholder="title">{{title}}</h1>
                <p class="subtitle" data-layout-placeholder="subtitle">{{subtitle}}</p>
            </div>
            <div class="header-decor">
                <div class="header-accent" data-pptx-group="header-decor" data-layout-shape="header-badge" data-shape-type="rounded-rect" data-theme-fill="accentColor">
                    <span class="category-label" data-layout-placeholder="category">{{category}}</span>
                    <span class="page-number" data-zone="page-number" data-layout-placeholder="page-number">{{page_number}}</span>
                </div>
            </div>
        </div>

        <div class="content" data-role="content">
            <main class="main">
                <div class="card" data-pptx-group="card-1" data-layout-shape="card-1" data-shape-type="rounded-rect" data-theme-fill="cardBg" data-theme-border="cardBorder">
                    <div class="card-header">
                        <div class="card-icon" data-layout-shape="card-1-icon" data-shape-type="rounded-rect" data-theme-fill="accentLight">
                            <span data-layout-placeholder="card-1-icon">{{card_1_icon}}</span>
                        </div>
                        <h2 class="card-title" data-layout-placeholder="card-1-title">{{heading_1}}</h2>
                    </div>
                    <div class="card-content">
                        <div>
                            <h3 class="section-label" data-layout-placeholder="card-1-section">{{section_label}}</h3>
                            <ul class="bullet-list">
                                <li class="bullet-item">
                                    <span class="bullet-dot" data-layout-shape="card-1-dot-1" data-shape-type="ellipse" data-theme-fill="accentColor"></span>
                                    <span data-layout-placeholder="card-1-bullet-1">{{bullet_1}}</span>
                                </li>
                                <li class="bullet-item">
                                    <span class="bullet-dot" data-layout-shape="card-1-dot-2" data-shape-type="ellipse" data-theme-fill="accentColor"></span>
                                    <span data-layout-placeholder="card-1-bullet-2">{{bullet_2}}</span>
                                </li>
                                <li class="bullet-item">
                                    <span class="bullet-dot" data-layout-shape="card-1-dot-3" data-shape-type="ellipse" data-theme-fill="accentColor"></span>
                                    <span data-layout-placeholder="card-1-bullet-3">{{bullet_3}}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="card" data-pptx-group="card-2" data-layout-shape="card-2" data-shape-type="rounded-rect" data-theme-fill="cardBg" data-theme-border="cardBorder">
                    <div class="card-header">
                        <div class="card-icon" data-layout-shape="card-2-icon" data-shape-type="rounded-rect" data-theme-fill="accentLight">
                            <span data-layout-placeholder="card-2-icon">{{card_2_icon}}</span>
                        </div>
                        <h2 class="card-title" data-layout-placeholder="card-2-title">{{heading_2}}</h2>
                    </div>
                    <div class="card-content">
                        <div>
                            <h3 class="section-label" data-layout-placeholder="card-2-section">{{section_label}}</h3>
                            <ul class="bullet-list">
                                <li class="bullet-item">
                                    <span class="bullet-dot" data-layout-shape="card-2-dot-1" data-shape-type="ellipse" data-theme-fill="accentColor"></span>
                                    <span data-layout-placeholder="card-2-bullet-1">{{bullet_4}}</span>
                                </li>
                                <li class="bullet-item">
                                    <span class="bullet-dot" data-layout-shape="card-2-dot-2" data-shape-type="ellipse" data-theme-fill="accentColor"></span>
                                    <span data-layout-placeholder="card-2-bullet-2">{{bullet_5}}</span>
                                </li>
                                <li class="bullet-item">
                                    <span class="bullet-dot" data-layout-shape="card-2-dot-3" data-shape-type="ellipse" data-theme-fill="accentColor"></span>
                                    <span data-layout-placeholder="card-2-bullet-3">{{bullet_6}}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="card" data-pptx-group="card-3" data-layout-shape="card-3" data-shape-type="rounded-rect" data-theme-fill="cardBg" data-theme-border="cardBorder">
                    <div class="card-header">
                        <div class="card-icon" data-layout-shape="card-3-icon" data-shape-type="rounded-rect" data-theme-fill="accentLight">
                            <span data-layout-placeholder="card-3-icon">{{card_3_icon}}</span>
                        </div>
                        <h2 class="card-title" data-layout-placeholder="card-3-title">{{heading_3}}</h2>
                    </div>
                    <div class="card-content">
                        <div>
                            <h3 class="section-label" data-layout-placeholder="card-3-section">{{section_label}}</h3>
                            <ul class="bullet-list">
                                <li class="bullet-item">
                                    <span class="bullet-dot" data-layout-shape="card-3-dot-1" data-shape-type="ellipse" data-theme-fill="accentColor"></span>
                                    <span data-layout-placeholder="card-3-bullet-1">{{bullet_7}}</span>
                                </li>
                                <li class="bullet-item">
                                    <span class="bullet-dot" data-layout-shape="card-3-dot-2" data-shape-type="ellipse" data-theme-fill="accentColor"></span>
                                    <span data-layout-placeholder="card-3-bullet-2">{{bullet_8}}</span>
                                </li>
                                <li class="bullet-item">
                                    <span class="bullet-dot" data-layout-shape="card-3-dot-3" data-shape-type="ellipse" data-theme-fill="accentColor"></span>
                                    <span data-layout-placeholder="card-3-bullet-3">{{bullet_9}}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>

        <div class="footer-info" data-layout-placeholder="footer">{{footer}}</div>
    </div>
</body>
</html>`;
LAYOUT_HTML['modern']['4-cards'] = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=1280, initial-scale=1.0">
    <title>{{title}}</title>
    <style>        :root {
            --bg-color: {{theme.backgroundColor}};
            --heading-color: {{theme.headingColor}};
            --body-color: {{theme.bodyColor}};
            --muted-color: {{theme.mutedColor}};
            --accent-color: {{theme.accentColor}};
            --accent-light: {{theme.accentLight}};
            --card-bg: {{theme.cardBg}};
            --card-border: {{theme.cardBorder}};
            --heading-font: {{theme.headingFontFamily}};
            --body-font: {{theme.bodyFontFamily}};
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: var(--body-font);
            background-color: var(--bg-color);
            color: var(--body-color);
            width: 1280px;
            height: 720px;
            overflow: hidden;
        }

        .slide-container {
            width: 1280px;
            height: 720px;
            position: relative;
            display: flex;
            flex-direction: column;
        }

        .header-bar {
            height: 80px;
            position: relative;
            padding: 20px 0 0 60px;
        }

        .title {
            font-family: var(--heading-font);
            font-size: 32px;
            font-weight: 600;
            color: var(--heading-color);
            line-height: 1.2;
            width: 900px;
        }

        .header-decor {
            position: absolute;
            top: 20px;
            right: 0;
        }

        .header-accent {
            background-color: var(--accent-color);
            height: 40px;
            width: 180px;
            padding: 0 24px 0 40px;
            display: flex;
            align-items: center;
            gap: 16px;
            border-radius: 20px 0 0 20px;
        }

        .category-label {
            font-size: 12px;
            font-weight: 600;
            color: rgba(255,255,255,0.9);
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }

        .page-number {
            font-size: 18px;
            font-weight: 700;
            color: white;
        }

        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 20px 60px 40px;
        }

        .main {
            flex: 1;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
        }

        .card {
            background: var(--card-bg);
            border-radius: 16px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            border: 1px solid var(--card-border);
            padding: 20px;
            display: flex;
            flex-direction: column;
        }

        .card-title {
            font-size: 16px;
            font-weight: 700;
            color: var(--heading-color);
            padding-bottom: 12px;
            margin-bottom: 12px;
            border-bottom: 1px solid var(--card-border);
            line-height: 1.3;
        }

        .card-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .section-label {
            font-size: 10px;
            font-weight: 700;
            color: var(--accent-color);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 6px;
        }

        .bullet-list {
            list-style: none;
        }

        .bullet-item {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            font-size: 11px;
            color: var(--body-color);
            line-height: 1.4;
            margin-bottom: 4px;
        }

        .bullet-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: var(--accent-color);
            margin-top: 4px;
            flex-shrink: 0;
        }

        .footer-info {
            position: absolute;
            bottom: 20px;
            left: 60px;
            font-size: 12px;
            color: var(--muted-color);
        }
    </style>
</head>
<body>
    <div class="slide-container">
        <div class="header-bar">
            <h1 class="title" data-zone="title">{{title}}</h1>
            <div class="header-decor">
                <div class="header-accent" data-pptx-group="header-decor">
                    <span class="category-label">{{category}}</span>
                    <span class="page-number" data-zone="page-number">{{page_number}}</span>
                </div>
            </div>
        </div>

        <div class="content" data-role="content">
            <main class="main">
                <div class="card" data-pptx-group="card-1">
                    <h2 class="card-title">{{heading_1}}</h2>
                    <div class="card-content">
                        <div>
                            <h3 class="section-label">{{section_label}}</h3>
                            <ul class="bullet-list">
                                <li class="bullet-item"><span class="bullet-dot"></span><span>{{bullet_1}}</span></li>
                                <li class="bullet-item"><span class="bullet-dot"></span><span>{{bullet_2}}</span></li>
                                <li class="bullet-item"><span class="bullet-dot"></span><span>{{bullet_3}}</span></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="card" data-pptx-group="card-2">
                    <h2 class="card-title">{{heading_2}}</h2>
                    <div class="card-content">
                        <div>
                            <h3 class="section-label">{{section_label}}</h3>
                            <ul class="bullet-list">
                                <li class="bullet-item"><span class="bullet-dot"></span><span>{{bullet_4}}</span></li>
                                <li class="bullet-item"><span class="bullet-dot"></span><span>{{bullet_5}}</span></li>
                                <li class="bullet-item"><span class="bullet-dot"></span><span>{{bullet_6}}</span></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="card" data-pptx-group="card-3">
                    <h2 class="card-title">{{heading_3}}</h2>
                    <div class="card-content">
                        <div>
                            <h3 class="section-label">{{section_label}}</h3>
                            <ul class="bullet-list">
                                <li class="bullet-item"><span class="bullet-dot"></span><span>{{bullet_7}}</span></li>
                                <li class="bullet-item"><span class="bullet-dot"></span><span>{{bullet_8}}</span></li>
                                <li class="bullet-item"><span class="bullet-dot"></span><span>{{bullet_9}}</span></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="card" data-pptx-group="card-4">
                    <h2 class="card-title">{{heading_4}}</h2>
                    <div class="card-content">
                        <div>
                            <h3 class="section-label">{{section_label}}</h3>
                            <ul class="bullet-list">
                                <li class="bullet-item"><span class="bullet-dot"></span><span>{{bullet_10}}</span></li>
                                <li class="bullet-item"><span class="bullet-dot"></span><span>{{bullet_11}}</span></li>
                                <li class="bullet-item"><span class="bullet-dot"></span><span>{{bullet_12}}</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>

        <div class="footer-info">{{footer}}</div>
    </div>
</body>
</html>`;
LAYOUT_HTML['modern']['big-quote'] = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=1280, initial-scale=1.0">
    <title>{{title}}</title>
    <style>        :root {
            --bg-color: {{theme.backgroundColor}};
            --heading-color: {{theme.headingColor}};
            --body-color: {{theme.bodyColor}};
            --muted-color: {{theme.mutedColor}};
            --accent-color: {{theme.accentColor}};
            --accent-light: {{theme.accentLight}};
            --card-bg: {{theme.cardBg}};
            --card-border: {{theme.cardBorder}};
            --heading-font: {{theme.headingFontFamily}};
            --body-font: {{theme.bodyFontFamily}};
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: var(--body-font);
            background-color: var(--bg-color);
            color: var(--body-color);
            width: 1280px;
            height: 720px;
            overflow: hidden;
        }

        .slide-container {
            width: 1280px;
            height: 720px;
            position: relative;
            display: flex;
            flex-direction: column;
        }

        .header-bar {
            height: 60px;
            position: relative;
        }

        .header-decor {
            position: absolute;
            top: 20px;
            right: 0;
        }

        .header-accent {
            background-color: var(--accent-color);
            height: 40px;
            width: 180px;
            padding: 0 24px 0 40px;
            display: flex;
            align-items: center;
            gap: 16px;
            border-radius: 20px 0 0 20px;
        }

        .category-label {
            font-size: 12px;
            font-weight: 600;
            color: rgba(255,255,255,0.9);
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }

        .page-number {
            font-size: 18px;
            font-weight: 700;
            color: white;
        }

        .content {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 60px;
        }

        .content-inner {
            max-width: 900px;
            text-align: center;
        }

        .quote-mark {
            font-size: 120px;
            color: var(--accent-light);
            line-height: 0.5;
            margin-bottom: 20px;
        }

        .quote-text {
            font-family: var(--heading-font);
            font-size: 32px;
            font-weight: 500;
            color: var(--heading-color);
            line-height: 1.5;
            margin-bottom: 32px;
            font-style: italic;
        }

        .quote-author {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
        }

        .author-name {
            font-size: 18px;
            font-weight: 700;
            color: var(--heading-color);
        }

        .author-title {
            font-size: 14px;
            color: var(--accent-color);
        }

        .footer-info {
            position: absolute;
            bottom: 40px;
            left: 60px;
            font-size: 12px;
            color: var(--muted-color);
        }
    </style>
</head>
<body>
    <div class="slide-container">
        <div class="header-bar">
            <div class="header-decor">
                <div class="header-accent" data-pptx-group="header-decor">
                    <span class="category-label">{{category}}</span>
                    <span class="page-number" data-zone="page-number">{{page_number}}</span>
                </div>
            </div>
        </div>

        <div class="content" data-role="content">
            <div class="content-inner" data-pptx-group="quote-content">
                <div class="quote-mark">"</div>
                <p class="quote-text">{{quote_text}}</p>
                <div class="quote-author">
                    <span class="author-name">{{quote_author}}</span>
                    <span class="author-title">{{quote_role}}</span>
                </div>
            </div>
        </div>

        <div class="footer-info">{{footer}}</div>
    </div>
</body>
</html>`;
LAYOUT_HTML['modern']['bullet-list'] = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=1280, initial-scale=1.0">
    <title>{{title}}</title>
    <style>        :root {
            --bg-color: {{theme.backgroundColor}};
            --heading-color: {{theme.headingColor}};
            --body-color: {{theme.bodyColor}};
            --muted-color: {{theme.mutedColor}};
            --accent-color: {{theme.accentColor}};
            --accent-light: {{theme.accentLight}};
            --card-bg: {{theme.cardBg}};
            --card-border: {{theme.cardBorder}};
            --heading-font: {{theme.headingFontFamily}};
            --body-font: {{theme.bodyFontFamily}};
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: var(--body-font);
            background-color: var(--bg-color);
            color: var(--body-color);
            width: 1280px;
            height: 720px;
            overflow: hidden;
        }

        .slide-container {
            width: 1280px;
            height: 720px;
            position: relative;
            display: flex;
            flex-direction: column;
        }

        .header-bar {
            height: 80px;
            position: relative;
            padding: 20px 0 0 60px;
        }

        .title {
            font-family: var(--heading-font);
            font-size: 32px;
            font-weight: 600;
            color: var(--heading-color);
            line-height: 1.2;
            width: 900px;
        }

        .header-decor {
            position: absolute;
            top: 20px;
            right: 0;
        }

        .header-accent {
            background-color: var(--accent-color);
            height: 40px;
            width: 180px;
            padding: 0 24px 0 40px;
            display: flex;
            align-items: center;
            gap: 16px;
            border-radius: 20px 0 0 20px;
        }

        .category-label {
            font-size: 12px;
            font-weight: 600;
            color: rgba(255,255,255,0.9);
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }

        .page-number {
            font-size: 18px;
            font-weight: 700;
            color: white;
        }

        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 20px 60px 40px;
        }

        .main {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .bullet-item {
            display: flex;
            align-items: flex-start;
            gap: 20px;
            background: var(--card-bg);
            border-radius: 12px;
            padding: 18px 24px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            border: 1px solid var(--card-border);
        }

        .bullet-number {
            width: 36px;
            height: 36px;
            background: var(--accent-light);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: 700;
            color: var(--accent-color);
            flex-shrink: 0;
        }

        .bullet-content {
            flex: 1;
        }

        .bullet-title {
            font-size: 18px;
            font-weight: 600;
            color: var(--heading-color);
            margin-bottom: 4px;
        }

        .bullet-desc {
            font-size: 14px;
            color: var(--body-color);
            line-height: 1.5;
        }

        .footer-info {
            position: absolute;
            bottom: 20px;
            left: 60px;
            font-size: 12px;
            color: var(--muted-color);
        }
    </style>
</head>
<body>
    <div class="slide-container">
        <div class="header-bar">
            <h1 class="title" data-zone="title">{{title}}</h1>
            <div class="header-decor">
                <div class="header-accent" data-pptx-group="header-decor">
                    <span class="category-label">{{category}}</span>
                    <span class="page-number" data-zone="page-number">{{page_number}}</span>
                </div>
            </div>
        </div>

        <div class="content" data-role="content">
            <main class="main">
                <div class="bullet-item" data-pptx-group="item-1">
                    <span class="bullet-number">01</span>
                    <div class="bullet-content">
                        <h2 class="bullet-title">{{heading_1}}</h2>
                        <p class="bullet-desc">{{paragraph_1}}</p>
                    </div>
                </div>

                <div class="bullet-item" data-pptx-group="item-2">
                    <span class="bullet-number">02</span>
                    <div class="bullet-content">
                        <h2 class="bullet-title">{{heading_2}}</h2>
                        <p class="bullet-desc">{{paragraph_2}}</p>
                    </div>
                </div>

                <div class="bullet-item" data-pptx-group="item-3">
                    <span class="bullet-number">03</span>
                    <div class="bullet-content">
                        <h2 class="bullet-title">{{heading_3}}</h2>
                        <p class="bullet-desc">{{paragraph_3}}</p>
                    </div>
                </div>

                <div class="bullet-item" data-pptx-group="item-4">
                    <span class="bullet-number">04</span>
                    <div class="bullet-content">
                        <h2 class="bullet-title">{{heading_4}}</h2>
                        <p class="bullet-desc">{{paragraph_4}}</p>
                    </div>
                </div>

                <div class="bullet-item" data-pptx-group="item-5">
                    <span class="bullet-number">05</span>
                    <div class="bullet-content">
                        <h2 class="bullet-title">{{heading_5}}</h2>
                        <p class="bullet-desc">{{paragraph_5}}</p>
                    </div>
                </div>
            </main>
        </div>

        <div class="footer-info">{{footer}}</div>
    </div>
</body>
</html>`;
LAYOUT_HTML['modern']['gantt-chart'] = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=1280, initial-scale=1.0">
    <title>{{title}}</title>
    <style>        :root {
            --bg-color: {{theme.backgroundColor}};
            --heading-color: {{theme.headingColor}};
            --body-color: {{theme.bodyColor}};
            --muted-color: {{theme.mutedColor}};
            --accent-color: {{theme.accentColor}};
            --accent-light: {{theme.accentLight}};
            --card-bg: {{theme.cardBg}};
            --card-border: {{theme.cardBorder}};
            --heading-font: {{theme.headingFontFamily}};
            --body-font: {{theme.bodyFontFamily}};
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: var(--body-font);
            background-color: var(--bg-color);
            color: var(--body-color);
            width: 1280px;
            height: 720px;
            overflow: hidden;
        }

        .slide-container {
            width: 1280px;
            height: 720px;
            position: relative;
            display: flex;
            flex-direction: column;
        }

        .header-bar {
            height: 80px;
            position: relative;
            padding: 20px 0 0 60px;
        }

        .title {
            font-family: var(--heading-font);
            font-size: 32px;
            font-weight: 600;
            color: var(--heading-color);
            line-height: 1.2;
            width: 900px;
        }

        .header-decor {
            position: absolute;
            top: 20px;
            right: 0;
        }

        .header-accent {
            background-color: var(--accent-color);
            height: 40px;
            width: 180px;
            padding: 0 24px 0 40px;
            display: flex;
            align-items: center;
            gap: 16px;
            border-radius: 20px 0 0 20px;
        }

        .category-label {
            font-size: 12px;
            font-weight: 600;
            color: rgba(255,255,255,0.9);
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }

        .page-number {
            font-size: 18px;
            font-weight: 700;
            color: white;
        }

        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 20px 60px 40px;
            gap: 20px;
        }

        .stats-row {
            display: flex;
            gap: 12px;
        }

        .stat-item {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 10px;
            padding: 10px 16px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .stat-value {
            font-size: 20px;
            font-weight: 700;
            color: var(--heading-color);
        }

        .stat-label {
            font-size: 10px;
            color: var(--body-color);
            margin-top: 2px;
        }

        .stat-item.highlight {
            background-color: var(--accent-color);
            border-color: var(--accent-color);
        }

        .stat-item.highlight .stat-value,
        .stat-item.highlight .stat-label {
            color: white;
        }

        .gantt-table {
            flex: 1;
            width: 100%;
            border-collapse: collapse;
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .gantt-table thead {
            background: var(--accent-light);
        }

        .gantt-table th {
            padding: 14px 8px;
            font-size: 12px;
            font-weight: 600;
            color: var(--heading-color);
            text-align: center;
            border-bottom: 1px solid var(--card-border);
        }

        .gantt-table th:first-child {
            text-align: left;
            padding-left: 20px;
            width: 200px;
        }

        .gantt-table td {
            padding: 0;
            border-bottom: 1px solid var(--card-border);
            border-left: 1px solid var(--card-border);
            height: 56px;
            position: relative;
        }

        .gantt-table td:first-child {
            border-left: none;
            padding: 12px 20px;
        }

        .gantt-table tr:last-child td {
            border-bottom: none;
        }

        .task-name {
            font-size: 13px;
            font-weight: 600;
            color: var(--heading-color);
            margin-bottom: 2px;
        }

        .task-owner {
            font-size: 11px;
            color: var(--body-color);
        }

        .gantt-bar {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            height: 24px;
            background: linear-gradient(90deg, var(--accent-color), var(--accent-light));
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            color: white;
            font-weight: 600;
            white-space: nowrap;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        }

        .footer-info {
            position: absolute;
            bottom: 20px;
            left: 60px;
            font-size: 12px;
            color: var(--muted-color);
        }
    </style>
</head>
<body>
    <div class="slide-container">
        <div class="header-bar">
            <h1 class="title" data-zone="title">{{title}}</h1>
            <div class="header-decor">
                <div class="header-accent" data-pptx-group="header-decor">
                    <span class="category-label">{{category}}</span>
                    <span class="page-number" data-zone="page-number">{{page_number}}</span>
                </div>
            </div>
        </div>

        <div class="content" data-role="content">
            <div class="stats-row">
                <div class="stat-item" data-pptx-group="stat-1">
                    <div class="stat-value">{{stat_1_value}}</div>
                    <div class="stat-label">{{stat_1_label}}</div>
                </div>
                <div class="stat-item" data-pptx-group="stat-2">
                    <div class="stat-value">{{stat_2_value}}</div>
                    <div class="stat-label">{{stat_2_label}}</div>
                </div>
                <div class="stat-item" data-pptx-group="stat-3">
                    <div class="stat-value">{{stat_3_value}}</div>
                    <div class="stat-label">{{stat_3_label}}</div>
                </div>
                <div class="stat-item highlight" data-pptx-group="stat-4">
                    <div class="stat-value">{{stat_4_value}}</div>
                    <div class="stat-label">{{stat_4_label}}</div>
                </div>
            </div>

            <table class="gantt-table">
                <thead>
                    <tr>
                        <th>{{th_1}}</th>
                        <th>{{th_2}}</th>
                        <th>{{th_3}}</th>
                        <th>{{th_4}}</th>
                        <th>{{th_5}}</th>
                        <th>{{th_6}}</th>
                        <th>{{th_7}}</th>
                        <th>{{th_8}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr data-pptx-group="task-1">
                        <td>
                            <div class="task-name">{{task_1_name}}</div>
                            <div class="task-owner">{{task_1_owner}}</div>
                        </td>
                        <td><div class="gantt-bar" style="left: 5%; width: 90%;">{{gantt_1_status}}</div></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr data-pptx-group="task-2">
                        <td>
                            <div class="task-name">{{task_2_name}}</div>
                            <div class="task-owner">{{task_2_owner}}</div>
                        </td>
                        <td></td>
                        <td><div class="gantt-bar" style="left: 5%; width: 90%;">{{gantt_2_status}}</div></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr data-pptx-group="task-3">
                        <td>
                            <div class="task-name">{{task_3_name}}</div>
                            <div class="task-owner">{{task_3_owner}}</div>
                        </td>
                        <td></td>
                        <td></td>
                        <td><div class="gantt-bar" style="left: 5%; width: 90%;">{{gantt_3_status}}</div></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr data-pptx-group="task-4">
                        <td>
                            <div class="task-name">{{task_4_name}}</div>
                            <div class="task-owner">{{task_4_owner}}</div>
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><div class="gantt-bar" style="left: 5%; width: 90%;">{{gantt_4_status}}</div></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr data-pptx-group="task-5">
                        <td>
                            <div class="task-name">{{task_5_name}}</div>
                            <div class="task-owner">{{task_5_owner}}</div>
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><div class="gantt-bar" style="left: 5%; width: 90%;">{{gantt_5_status}}</div></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="footer-info">{{footer}}</div>
    </div>
</body>
</html>`;
LAYOUT_HTML['modern']['image-text'] = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=1280, initial-scale=1.0">
    <title>{{title}}</title>
    <style>        :root {
            --bg-color: {{theme.backgroundColor}};
            --heading-color: {{theme.headingColor}};
            --body-color: {{theme.bodyColor}};
            --muted-color: {{theme.mutedColor}};
            --accent-color: {{theme.accentColor}};
            --accent-light: {{theme.accentLight}};
            --card-bg: {{theme.cardBg}};
            --card-border: {{theme.cardBorder}};
            --heading-font: {{theme.headingFontFamily}};
            --body-font: {{theme.bodyFontFamily}};
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: var(--body-font);
            background-color: var(--bg-color);
            color: var(--body-color);
            width: 1280px;
            height: 720px;
            overflow: hidden;
        }

        .slide-container {
            width: 1280px;
            height: 720px;
            position: relative;
            display: flex;
            flex-direction: column;
        }

        .header-bar {
            height: 60px;
            position: relative;
        }

        .header-decor {
            position: absolute;
            top: 20px;
            right: 0;
        }

        .header-accent {
            background-color: var(--accent-color);
            height: 40px;
            width: 180px;
            padding: 0 24px 0 40px;
            display: flex;
            align-items: center;
            gap: 16px;
            border-radius: 20px 0 0 20px;
        }

        .category-label {
            font-size: 12px;
            font-weight: 600;
            color: rgba(255,255,255,0.9);
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }

        .page-number {
            font-size: 18px;
            font-weight: 700;
            color: white;
        }

        .content {
            flex: 1;
            display: flex;
            padding: 20px 60px 40px;
            gap: 40px;
        }

        .image-section {
            width: 50%;
            background: var(--card-bg);
            border-radius: 16px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            border: 1px solid var(--card-border);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--muted-color);
            font-size: 16px;
            overflow: hidden;
        }

        .text-section {
            width: 50%;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .title {
            font-family: var(--heading-font);
            font-size: 36px;
            font-weight: 600;
            color: var(--heading-color);
            line-height: 1.2;
            margin-bottom: 20px;
        }

        .description {
            font-size: 16px;
            color: var(--body-color);
            line-height: 1.7;
            margin-bottom: 24px;
        }

        .feature-list {
            list-style: none;
        }

        .feature-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 12px;
        }

        .feature-icon {
            width: 24px;
            height: 24px;
            background: var(--accent-light);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            color: var(--accent-color);
            font-size: 12px;
        }

        .feature-text {
            font-size: 14px;
            color: var(--body-color);
            line-height: 1.5;
        }

        .footer-info {
            position: absolute;
            bottom: 20px;
            left: 60px;
            font-size: 12px;
            color: var(--muted-color);
        }
    </style>
</head>
<body>
    <div class="slide-container">
        <div class="header-bar">
            <div class="header-decor">
                <div class="header-accent" data-pptx-group="header-decor">
                    <span class="category-label">{{category}}</span>
                    <span class="page-number" data-zone="page-number">{{page_number}}</span>
                </div>
            </div>
        </div>

        <div class="content" data-role="content">
            <div class="image-section" data-pptx-group="image">{{image_placeholder}}</div>

            <div class="text-section" data-pptx-group="text-content">
                <h1 class="title">{{title}}</h1>
                <p class="description">{{description}}</p>
                <ul class="feature-list">
                    <li class="feature-item">
                        <span class="feature-icon">✓</span>
                        <span class="feature-text">{{feature_1}}</span>
                    </li>
                    <li class="feature-item">
                        <span class="feature-icon">✓</span>
                        <span class="feature-text">{{feature_2}}</span>
                    </li>
                    <li class="feature-item">
                        <span class="feature-icon">✓</span>
                        <span class="feature-text">{{feature_3}}</span>
                    </li>
                    <li class="feature-item">
                        <span class="feature-icon">✓</span>
                        <span class="feature-text">{{feature_4}}</span>
                    </li>
                </ul>
            </div>
        </div>

        <div class="footer-info">{{footer}}</div>
    </div>
</body>
</html>`;
LAYOUT_HTML['modern']['timeline'] = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=1280, initial-scale=1.0">
    <title>{{title}}</title>
    <style>        :root {
            --bg-color: {{theme.backgroundColor}};
            --heading-color: {{theme.headingColor}};
            --body-color: {{theme.bodyColor}};
            --muted-color: {{theme.mutedColor}};
            --accent-color: {{theme.accentColor}};
            --accent-light: {{theme.accentLight}};
            --card-bg: {{theme.cardBg}};
            --card-border: {{theme.cardBorder}};
            --heading-font: {{theme.headingFontFamily}};
            --body-font: {{theme.bodyFontFamily}};
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: var(--body-font);
            background-color: var(--bg-color);
            color: var(--body-color);
            width: 1280px;
            height: 720px;
            overflow: hidden;
        }

        .slide-container {
            width: 1280px;
            height: 720px;
            position: relative;
            display: flex;
            flex-direction: column;
        }

        .header-bar {
            height: 80px;
            position: relative;
            padding: 20px 0 0 60px;
        }

        .title {
            font-family: var(--heading-font);
            font-size: 32px;
            font-weight: 600;
            color: var(--heading-color);
            line-height: 1.2;
            width: 900px;
        }

        .header-decor {
            position: absolute;
            top: 20px;
            right: 0;
        }

        .header-accent {
            background-color: var(--accent-color);
            height: 40px;
            width: 180px;
            padding: 0 24px 0 40px;
            display: flex;
            align-items: center;
            gap: 16px;
            border-radius: 20px 0 0 20px;
        }

        .category-label {
            font-size: 12px;
            font-weight: 600;
            color: rgba(255,255,255,0.9);
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }

        .page-number {
            font-size: 18px;
            font-weight: 700;
            color: white;
        }

        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 20px 60px 40px;
        }

        .timeline-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            position: relative;
        }

        .timeline-row {
            flex: 1;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
            padding: 16px 0;
        }

        .timeline-row.top { align-items: end; }
        .timeline-row.bottom { align-items: start; }

        .timeline-line {
            height: 4px;
            background-color: var(--accent-color);
            position: relative;
            margin: 8px 0;
        }

        .timeline-dots {
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            transform: translateY(-50%);
            display: flex;
            justify-content: space-around;
        }

        .timeline-dot {
            width: 16px;
            height: 16px;
            background-color: var(--accent-color);
            border: 3px solid var(--bg-color);
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .milestone {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 12px;
            padding: 16px;
            border-left: 4px solid var(--accent-color);
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .milestone-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }

        .milestone-title {
            font-size: 15px;
            font-weight: 700;
            color: var(--heading-color);
        }

        .milestone-date {
            font-size: 11px;
            font-weight: 600;
            color: var(--accent-color);
            background: var(--accent-light);
            padding: 2px 10px;
            border-radius: 20px;
        }

        .milestone-content {
            font-size: 12px;
            color: var(--body-color);
            line-height: 1.5;
        }

        .footer-info {
            position: absolute;
            bottom: 20px;
            left: 60px;
            font-size: 12px;
            color: var(--muted-color);
        }
    </style>
</head>
<body>
    <div class="slide-container">
        <div class="header-bar">
            <h1 class="title" data-zone="title">{{title}}</h1>
            <div class="header-decor">
                <div class="header-accent" data-pptx-group="header-decor">
                    <span class="category-label">{{category}}</span>
                    <span class="page-number" data-zone="page-number">{{page_number}}</span>
                </div>
            </div>
        </div>

        <div class="content" data-role="content">
            <div class="timeline-container">
                <div class="timeline-row top">
                    <div class="milestone" data-pptx-group="milestone-1">
                        <div class="milestone-header">
                            <span class="milestone-title">{{milestone_1_title}}</span>
                            <span class="milestone-date">{{milestone_1_date}}</span>
                        </div>
                        <div class="milestone-content">{{milestone_1_content}}</div>
                    </div>
                    <div class="milestone" data-pptx-group="milestone-3">
                        <div class="milestone-header">
                            <span class="milestone-title">{{milestone_3_title}}</span>
                            <span class="milestone-date">{{milestone_3_date}}</span>
                        </div>
                        <div class="milestone-content">{{milestone_3_content}}</div>
                    </div>
                    <div class="milestone" data-pptx-group="milestone-5">
                        <div class="milestone-header">
                            <span class="milestone-title">{{milestone_5_title}}</span>
                            <span class="milestone-date">{{milestone_5_date}}</span>
                        </div>
                        <div class="milestone-content">{{milestone_5_content}}</div>
                    </div>
                </div>

                <div class="timeline-line">
                    <div class="timeline-dots">
                        <div class="timeline-dot"></div>
                        <div class="timeline-dot"></div>
                        <div class="timeline-dot"></div>
                        <div class="timeline-dot"></div>
                        <div class="timeline-dot"></div>
                        <div class="timeline-dot"></div>
                    </div>
                </div>

                <div class="timeline-row bottom">
                    <div class="milestone" data-pptx-group="milestone-2">
                        <div class="milestone-header">
                            <span class="milestone-title">{{milestone_2_title}}</span>
                            <span class="milestone-date">{{milestone_2_date}}</span>
                        </div>
                        <div class="milestone-content">{{milestone_2_content}}</div>
                    </div>
                    <div class="milestone" data-pptx-group="milestone-4">
                        <div class="milestone-header">
                            <span class="milestone-title">{{milestone_4_title}}</span>
                            <span class="milestone-date">{{milestone_4_date}}</span>
                        </div>
                        <div class="milestone-content">{{milestone_4_content}}</div>
                    </div>
                    <div class="milestone" data-pptx-group="milestone-6">
                        <div class="milestone-header">
                            <span class="milestone-title">{{milestone_6_title}}</span>
                            <span class="milestone-date">{{milestone_6_date}}</span>
                        </div>
                        <div class="milestone-content">{{milestone_6_content}}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="footer-info">{{footer}}</div>
    </div>
</body>
</html>`;
LAYOUT_HTML['modern']['title-slide'] = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=1280, initial-scale=1.0">
    <title>{{title}}</title>
    <style>        :root {
            --bg-color: {{theme.backgroundColor}};
            --heading-color: {{theme.headingColor}};
            --body-color: {{theme.bodyColor}};
            --muted-color: {{theme.mutedColor}};
            --accent-color: {{theme.accentColor}};
            --accent-light: {{theme.accentLight}};
            --card-bg: {{theme.cardBg}};
            --card-border: {{theme.cardBorder}};
            --heading-font: {{theme.headingFontFamily}};
            --body-font: {{theme.bodyFontFamily}};
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: var(--body-font);
            background-color: var(--bg-color);
            color: var(--body-color);
            width: 1280px;
            height: 720px;
            overflow: hidden;
        }

        .slide-container {
            width: 1280px;
            height: 720px;
            position: relative;
            display: flex;
            flex-direction: column;
        }

        .header-bar {
            height: 60px;
            position: relative;
        }

        .header-decor {
            position: absolute;
            top: 20px;
            right: 0;
        }

        .header-accent {
            background-color: var(--accent-color);
            height: 40px;
            width: 180px;
            padding: 0 24px 0 40px;
            display: flex;
            align-items: center;
            gap: 16px;
            border-radius: 20px 0 0 20px;
        }

        .category-label {
            font-size: 12px;
            font-weight: 600;
            color: rgba(255,255,255,0.9);
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }

        .page-number {
            font-size: 18px;
            font-weight: 700;
            color: white;
        }

        .content {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 60px;
        }

        .content-inner {
            text-align: center;
            max-width: 900px;
        }

        .title {
            font-family: var(--heading-font);
            font-size: 56px;
            font-weight: 700;
            color: var(--heading-color);
            line-height: 1.2;
            margin-bottom: 24px;
        }

        .subtitle {
            font-size: 20px;
            color: var(--body-color);
            line-height: 1.6;
            max-width: 700px;
            margin: 0 auto;
        }

        .footer-info {
            position: absolute;
            bottom: 40px;
            left: 60px;
            font-size: 13px;
            color: var(--muted-color);
        }
    </style>
</head>
<body>
    <div class="slide-container">
        <div class="header-bar">
            <div class="header-decor">
                <div class="header-accent" data-pptx-group="header-decor">
                    <span class="category-label">{{category}}</span>
                    <span class="page-number" data-zone="page-number">{{page_number}}</span>
                </div>
            </div>
        </div>

        <div class="content" data-role="content">
            <div class="content-inner" data-pptx-group="content">
                <h1 class="title">{{title}}</h1>
                <p class="subtitle">{{subtitle}}</p>
            </div>
        </div>

        <div class="footer-info">{{footer}}</div>
    </div>
</body>
</html>`;

LAYOUT_HTML['classic'] = {};
LAYOUT_HTML['classic']['2-column'] = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <style>        :root {
            --bg-color: {{theme.backgroundColor}};
            --heading-color: {{theme.headingColor}};
            --body-color: {{theme.bodyColor}};
            --muted-color: {{theme.mutedColor}};
            --accent-color: {{theme.accentColor}};
            --accent-light: {{theme.accentLight}};
            --card-bg: {{theme.cardBg}};
            --card-border: {{theme.cardBorder}};
            --heading-font: {{theme.headingFontFamily}};
            --body-font: {{theme.bodyFontFamily}};
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: var(--body-font);
            background-color: var(--bg-color);
            color: var(--body-color);
            width: 1280px;
            height: 720px;
            overflow: hidden;
        }

        .slide-container {
            width: 1280px;
            height: 720px;
            display: flex;
            flex-direction: column;
        }

        .slide-header {
            height: 100px;
            padding: 0 60px;
            display: flex;
            align-items: center;
            border-bottom: 2px solid var(--accent-color);
        }

        .slide-title {
            font-family: var(--heading-font);
            font-size: 40px;
            font-weight: 700;
            color: var(--heading-color);
            min-height: 60px;
            line-height: 60px;
            width: 100%;
        }

        .slide-main {
            height: 560px;
            padding: 40px 60px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
        }

        .slide-footer {
            height: 60px;
            padding: 0 60px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-top: 1px solid var(--card-border);
            color: var(--body-color);
            opacity: 0.7;
            font-size: 14px;
        }

        .slide-footer span {
            min-height: 24px;
            line-height: 24px;
            white-space: nowrap;
        }

        .slide-footer span:first-child { min-width: 200px; }
        .slide-footer span:last-child { min-width: 100px; text-align: right; }

        .column {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 12px;
            padding: 32px;
            display: flex;
            flex-direction: column;
        }

        .column-title {
            font-family: var(--heading-font);
            font-size: 24px;
            font-weight: 700;
            color: var(--heading-color);
            margin-bottom: 20px;
            min-height: 36px;
            line-height: 36px;
            width: 100%;
        }

        .column-content {
            font-size: 18px;
            color: var(--body-color);
            line-height: 1.8;
            flex: 1;
            width: 100%;
        }
    </style>
</head>
<body>
    <div class="slide-container cover">
        <header class="slide-header">
            <h1 class="slide-title">{{title}}</h1>
        </header>

        <main class="slide-main">
            <div class="column" data-pptx-group="column-left">
                <h2 class="column-title">{{heading_1}}</h2>
                <div class="column-content">{{content_1}}</div>
            </div>
            <div class="column" data-pptx-group="column-right">
                <h2 class="column-title">{{heading_2}}</h2>
                <div class="column-content">{{content_2}}</div>
            </div>
        </main>

        <footer class="slide-footer">
            <span>{{footer}}</span>
            <span>{{page_number}}</span>
        </footer>
    </div>
</body>
</html>`;
LAYOUT_HTML['classic']['3-cards'] = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>        :root {
            --bg-color: {{theme.backgroundColor}};
            --heading-color: {{theme.headingColor}};
            --body-color: {{theme.bodyColor}};
            --muted-color: {{theme.mutedColor}};
            --accent-color: {{theme.accentColor}};
            --accent-light: {{theme.accentLight}};
            --card-bg: {{theme.cardBg}};
            --card-border: {{theme.cardBorder}};
            --heading-font: {{theme.headingFontFamily}};
            --body-font: {{theme.bodyFontFamily}};
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: var(--body-font);
            background-color: var(--bg-color);
            color: var(--body-color);
            width: 1280px;
            height: 720px;
            overflow: hidden;
        }

        .slide-container {
            width: 1280px;
            height: 720px;
            display: flex;
            flex-direction: column;
        }

        .slide-header {
            height: 100px;
            padding: 0 60px;
            display: flex;
            align-items: center;
            border-bottom: 2px solid var(--accent-color);
        }

        .slide-title {
            font-family: var(--heading-font);
            font-size: 40px;
            font-weight: 700;
            color: var(--heading-color);
            min-height: 60px;
            line-height: 60px;
            width: 100%;
        }

        .slide-main {
            height: 560px;
            padding: 40px 60px;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 32px;
        }

        .slide-footer {
            height: 60px;
            padding: 0 60px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-top: 1px solid var(--card-border);
            color: var(--body-color);
            opacity: 0.7;
            font-size: 14px;
        }

        .slide-footer span {
            min-height: 24px;
            line-height: 24px;
            white-space: nowrap;
        }

        .slide-footer span:first-child { min-width: 200px; }
        .slide-footer span:last-child { min-width: 100px; text-align: right; }

        .card {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 12px;
            padding: 32px 24px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        .card-icon {
            font-size: 48px;
            color: var(--accent-color);
            margin-bottom: 24px;
            min-height: 60px;
            line-height: 60px;
            width: 100%;
        }

        .card-title {
            font-family: var(--heading-font);
            font-size: 24px;
            font-weight: 700;
            color: var(--heading-color);
            margin-bottom: 16px;
            min-height: 36px;
            line-height: 36px;
            width: 100%;
            white-space: nowrap;
        }

        .card-description {
            font-size: 16px;
            color: var(--body-color);
            line-height: 1.5;
            width: 100%;
        }
    </style>
</head>
<body>
    <div class="slide-container cover">
        <header class="slide-header">
            <h1 class="slide-title">{{title}}</h1>
        </header>

        <main class="slide-main">
            <div class="card" data-pptx-group="card-1">
                <div class="card-icon"><i class="fas fa-rocket"></i></div>
                <h3 class="card-title">{{heading_1}}</h3>
                <p class="card-description">{{paragraph_1}}</p>
            </div>
            <div class="card" data-pptx-group="card-2">
                <div class="card-icon"><i class="fas fa-shield-alt"></i></div>
                <h3 class="card-title">{{heading_2}}</h3>
                <p class="card-description">{{paragraph_2}}</p>
            </div>
            <div class="card" data-pptx-group="card-3">
                <div class="card-icon"><i class="fas fa-headset"></i></div>
                <h3 class="card-title">{{heading_3}}</h3>
                <p class="card-description">{{paragraph_3}}</p>
            </div>
        </main>

        <footer class="slide-footer">
            <span>{{footer}}</span>
            <span>{{page_number}}</span>
        </footer>
    </div>
</body>
</html>`;
LAYOUT_HTML['classic']['4-cards'] = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>        :root {
            --bg-color: {{theme.backgroundColor}};
            --heading-color: {{theme.headingColor}};
            --body-color: {{theme.bodyColor}};
            --muted-color: {{theme.mutedColor}};
            --accent-color: {{theme.accentColor}};
            --accent-light: {{theme.accentLight}};
            --card-bg: {{theme.cardBg}};
            --card-border: {{theme.cardBorder}};
            --heading-font: {{theme.headingFontFamily}};
            --body-font: {{theme.bodyFontFamily}};
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: var(--body-font);
            background-color: var(--bg-color);
            color: var(--body-color);
            width: 1280px;
            height: 720px;
            overflow: hidden;
        }

        .slide-container {
            width: 1280px;
            height: 720px;
            display: flex;
            flex-direction: column;
        }

        .slide-header {
            height: 100px;
            padding: 0 60px;
            display: flex;
            align-items: center;
            border-bottom: 2px solid var(--accent-color);
        }

        .slide-title {
            font-family: var(--heading-font);
            font-size: 40px;
            font-weight: 700;
            color: var(--heading-color);
            min-height: 60px;
            line-height: 60px;
            width: 100%;
        }

        .slide-main {
            height: 560px;
            padding: 40px 60px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            gap: 24px;
        }

        .slide-footer {
            height: 60px;
            padding: 0 60px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-top: 1px solid var(--card-border);
            color: var(--body-color);
            opacity: 0.7;
            font-size: 14px;
        }

        .slide-footer span {
            min-height: 24px;
            line-height: 24px;
            white-space: nowrap;
        }

        .slide-footer span:first-child { min-width: 200px; }
        .slide-footer span:last-child { min-width: 100px; text-align: right; }

        .card {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 12px;
            padding: 24px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        .card-icon {
            font-size: 36px;
            color: var(--accent-color);
            margin-bottom: 16px;
            min-height: 48px;
            line-height: 48px;
            width: 100%;
        }

        .card-value {
            font-size: 32px;
            font-weight: 700;
            color: var(--heading-color);
            margin-bottom: 8px;
            min-height: 48px;
            line-height: 48px;
            width: 100%;
            white-space: nowrap;
        }

        .card-label {
            font-size: 16px;
            color: var(--body-color);
            min-height: 32px;
            line-height: 32px;
            width: 100%;
            white-space: nowrap;
        }
    </style>
</head>
<body>
    <div class="slide-container cover">
        <header class="slide-header">
            <h1 class="slide-title">{{title}}</h1>
        </header>

        <main class="slide-main">
            <div class="card" data-pptx-group="card-1">
                <div class="card-icon"><i class="fas fa-chart-line"></i></div>
                <div class="card-value">{{card_1_value}}</div>
                <div class="card-label">{{card_1_label}}</div>
            </div>
            <div class="card" data-pptx-group="card-2">
                <div class="card-icon"><i class="fas fa-bullseye"></i></div>
                <div class="card-value">{{card_2_value}}</div>
                <div class="card-label">{{card_2_label}}</div>
            </div>
            <div class="card" data-pptx-group="card-3">
                <div class="card-icon"><i class="fas fa-dollar-sign"></i></div>
                <div class="card-value">{{card_3_value}}</div>
                <div class="card-label">{{card_3_label}}</div>
            </div>
            <div class="card" data-pptx-group="card-4">
                <div class="card-icon"><i class="fas fa-users"></i></div>
                <div class="card-value">{{card_4_value}}</div>
                <div class="card-label">{{card_4_label}}</div>
            </div>
        </main>

        <footer class="slide-footer">
            <span>{{footer}}</span>
            <span>{{page_number}}</span>
        </footer>
    </div>
</body>
</html>`;
LAYOUT_HTML['classic']['big-quote'] = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>        :root {
            --bg-color: {{theme.backgroundColor}};
            --heading-color: {{theme.headingColor}};
            --body-color: {{theme.bodyColor}};
            --muted-color: {{theme.mutedColor}};
            --accent-color: {{theme.accentColor}};
            --accent-light: {{theme.accentLight}};
            --card-bg: {{theme.cardBg}};
            --card-border: {{theme.cardBorder}};
            --heading-font: {{theme.headingFontFamily}};
            --body-font: {{theme.bodyFontFamily}};
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: var(--body-font);
            background-color: var(--bg-color);
            color: var(--body-color);
            width: 1280px;
            height: 720px;
            overflow: hidden;
        }

        .slide-container {
            width: 1280px;
            height: 720px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 80px;
            text-align: center;
        }

        .quote-icon {
            font-size: 48px;
            color: var(--accent-color);
            margin-bottom: 32px;
            min-height: 60px;
            line-height: 60px;
            opacity: 0.6;
        }

        .quote-text {
            font-family: var(--heading-font);
            font-size: 36px;
            font-weight: 400;
            font-style: italic;
            color: var(--heading-color);
            line-height: 1.5;
            max-width: 1000px;
            margin-bottom: 40px;
        }

        .quote-divider {
            width: 80px;
            height: 3px;
            background-color: var(--accent-color);
            margin-bottom: 32px;
        }

        .quote-author {
            font-size: 22px;
            font-weight: 700;
            color: var(--heading-color);
            margin-bottom: 8px;
            min-height: 32px;
            line-height: 32px;
        }

        .quote-role {
            font-size: 18px;
            color: var(--body-color);
            opacity: 0.8;
            min-height: 28px;
            line-height: 28px;
        }
    </style>
</head>
<body>
    <div class="slide-container cover">
        <div class="quote-icon"><i class="fas fa-quote-left"></i></div>
        <p class="quote-text">{{quote_text}}</p>
        <div class="quote-divider"></div>
        <p class="quote-author">{{quote_author}}</p>
        <p class="quote-role">{{quote_role}}</p>
    </div>
</body>
</html>`;
LAYOUT_HTML['classic']['bullet-list'] = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>        :root {
            --bg-color: {{theme.backgroundColor}};
            --heading-color: {{theme.headingColor}};
            --body-color: {{theme.bodyColor}};
            --muted-color: {{theme.mutedColor}};
            --accent-color: {{theme.accentColor}};
            --accent-light: {{theme.accentLight}};
            --card-bg: {{theme.cardBg}};
            --card-border: {{theme.cardBorder}};
            --heading-font: {{theme.headingFontFamily}};
            --body-font: {{theme.bodyFontFamily}};
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: var(--body-font);
            background-color: var(--bg-color);
            color: var(--body-color);
            width: 1280px;
            height: 720px;
            overflow: hidden;
        }

        .slide-container {
            width: 1280px;
            height: 720px;
            display: flex;
            flex-direction: column;
        }

        .slide-header {
            height: 100px;
            padding: 0 60px;
            display: flex;
            align-items: center;
            border-bottom: 2px solid var(--accent-color);
        }

        .slide-title {
            font-family: var(--heading-font);
            font-size: 40px;
            font-weight: 700;
            color: var(--heading-color);
            min-height: 60px;
            line-height: 60px;
            width: 100%;
        }

        .slide-main {
            height: 560px;
            padding: 48px 80px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .slide-footer {
            height: 60px;
            padding: 0 60px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-top: 1px solid var(--card-border);
            color: var(--body-color);
            opacity: 0.7;
            font-size: 14px;
        }

        .slide-footer span {
            min-height: 24px;
            line-height: 24px;
            white-space: nowrap;
        }

        .slide-footer span:first-child { min-width: 200px; }
        .slide-footer span:last-child { min-width: 100px; text-align: right; }

        .bullet-list { list-style: none; }

        .bullet-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 28px;
            min-height: 48px;
        }

        .bullet-icon {
            font-size: 20px;
            color: var(--accent-color);
            margin-right: 20px;
            min-width: 28px;
            min-height: 32px;
            line-height: 32px;
        }

        .bullet-text {
            font-size: 22px;
            color: var(--body-color);
            line-height: 1.5;
            flex: 1;
        }
    </style>
</head>
<body>
    <div class="slide-container cover">
        <header class="slide-header">
            <h1 class="slide-title">{{title}}</h1>
        </header>

        <main class="slide-main">
            <ul class="bullet-list">
                <li class="bullet-item" data-pptx-group="bullet-1">
                    <span class="bullet-icon"><i class="fas fa-check-circle"></i></span>
                    <span class="bullet-text">{{bullet_1}}</span>
                </li>
                <li class="bullet-item" data-pptx-group="bullet-2">
                    <span class="bullet-icon"><i class="fas fa-check-circle"></i></span>
                    <span class="bullet-text">{{bullet_2}}</span>
                </li>
                <li class="bullet-item" data-pptx-group="bullet-3">
                    <span class="bullet-icon"><i class="fas fa-check-circle"></i></span>
                    <span class="bullet-text">{{bullet_3}}</span>
                </li>
                <li class="bullet-item" data-pptx-group="bullet-4">
                    <span class="bullet-icon"><i class="fas fa-check-circle"></i></span>
                    <span class="bullet-text">{{bullet_4}}</span>
                </li>
                <li class="bullet-item" data-pptx-group="bullet-5">
                    <span class="bullet-icon"><i class="fas fa-check-circle"></i></span>
                    <span class="bullet-text">{{bullet_5}}</span>
                </li>
            </ul>
        </main>

        <footer class="slide-footer">
            <span>{{footer}}</span>
            <span>{{page_number}}</span>
        </footer>
    </div>
</body>
</html>`;
LAYOUT_HTML['classic']['dashboard'] = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>
    <style>        :root {
            --bg-color: {{theme.backgroundColor}};
            --heading-color: {{theme.headingColor}};
            --body-color: {{theme.bodyColor}};
            --muted-color: {{theme.mutedColor}};
            --accent-color: {{theme.accentColor}};
            --accent-light: {{theme.accentLight}};
            --card-bg: {{theme.cardBg}};
            --card-border: {{theme.cardBorder}};
            --heading-font: {{theme.headingFontFamily}};
            --body-font: {{theme.bodyFontFamily}};
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: var(--body-font);
            background-color: var(--bg-color);
            color: var(--body-color);
            width: 1280px;
            height: 720px;
            overflow: hidden;
        }

        /* ========== STANDARD SLIDE STRUCTURE ========== */
        .slide-container {
            width: 1280px;
            height: 720px;
            display: flex;
            flex-direction: column;
        }

        .slide-header {
            height: 100px;
            padding: 0 60px;
            display: flex;
            align-items: center;
            border-bottom: 2px solid var(--accent-color);
        }

        .slide-title {
            font-family: var(--heading-font);
            font-size: 40px;
            font-weight: 700;
            color: var(--heading-color);
            min-height: 60px;
            line-height: 60px;
            width: 100%;
        }

        .slide-main {
            height: 560px;
            padding: 24px 60px;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .slide-footer {
            height: 60px;
            padding: 0 60px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-top: 1px solid var(--card-border);
            color: var(--body-color);
            opacity: 0.7;
            font-size: 14px;
        }

        .slide-footer span {
            min-height: 24px;
            line-height: 24px;
            white-space: nowrap;
        }

        .slide-footer span:first-child { min-width: 200px; }
        .slide-footer span:last-child { min-width: 100px; text-align: right; }

        /* ========== KPI ROW ========== */
        .kpi-row {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
        }

        .kpi-card {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 8px;
            padding: 16px 20px;
            border-left: 3px solid var(--accent-color);
        }

        .kpi-label {
            font-size: 13px;
            color: var(--accent-color);
            margin-bottom: 8px;
            min-height: 20px;
            line-height: 20px;
            width: 100%;
        }

        .kpi-value {
            font-size: 24px;
            font-weight: 700;
            color: var(--heading-color);
            margin-bottom: 12px;
            min-height: 32px;
            line-height: 32px;
            width: 100%;
            white-space: nowrap;
        }

        .kpi-progress {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .kpi-progress-label {
            font-size: 11px;
            color: var(--body-color);
            min-width: 44px;
            white-space: nowrap;
        }

        .kpi-progress-bar {
            flex: 1;
            height: 6px;
            background: var(--accent-light);
            border-radius: 3px;
            overflow: hidden;
        }

        .kpi-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--accent-color), var(--accent-light));
            border-radius: 3px;
        }

        .kpi-progress-value {
            font-size: 11px;
            font-weight: 600;
            color: var(--heading-color);
            min-width: 32px;
            text-align: right;
            white-space: nowrap;
        }

        /* ========== CHART ROW ========== */
        .chart-row {
            flex: 1;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 16px;
        }

        .chart-card {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 8px;
            padding: 16px;
            display: flex;
            flex-direction: column;
        }

        .chart-title {
            font-size: 15px;
            font-weight: 600;
            color: var(--heading-color);
            margin-bottom: 12px;
            text-align: center;
            min-height: 22px;
            line-height: 22px;
            width: 100%;
        }

        .chart-container {
            flex: 1;
            position: relative;
            min-height: 200px;
        }

        .chart-placeholder {
            width: 100%;
            height: 100%;
            background: var(--card-bg);
            border: 2px dashed var(--accent-light);
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--accent-color);
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="slide-container cover">
        <!-- STANDARD HEADER: 100px -->
        <header class="slide-header">
            <h1 class="slide-title">{{title}}</h1>
        </header>

        <!-- MAIN: 560px -->
        <main class="slide-main">
            <div class="kpi-row">
                <div class="kpi-card" data-pptx-group="kpi-1">
                    <div class="kpi-label">{{kpi_1_label}}</div>
                    <div class="kpi-value">{{kpi_1_value}}</div>
                    <div class="kpi-progress">
                        <span class="kpi-progress-label">{{kpi_progress_label}}</span>
                        <div class="kpi-progress-bar">
                            <div class="kpi-progress-fill" style="width: 95%"></div>
                        </div>
                        <span class="kpi-progress-value">{{kpi_1_progress}}</span>
                    </div>
                </div>
                <div class="kpi-card" data-pptx-group="kpi-2">
                    <div class="kpi-label">{{kpi_2_label}}</div>
                    <div class="kpi-value">{{kpi_2_value}}</div>
                    <div class="kpi-progress">
                        <span class="kpi-progress-label">{{kpi_progress_label}}</span>
                        <div class="kpi-progress-bar">
                            <div class="kpi-progress-fill" style="width: 92%"></div>
                        </div>
                        <span class="kpi-progress-value">{{kpi_2_progress}}</span>
                    </div>
                </div>
                <div class="kpi-card" data-pptx-group="kpi-3">
                    <div class="kpi-label">{{kpi_3_label}}</div>
                    <div class="kpi-value">{{kpi_3_value}}</div>
                    <div class="kpi-progress">
                        <span class="kpi-progress-label">{{kpi_progress_label}}</span>
                        <div class="kpi-progress-bar">
                            <div class="kpi-progress-fill" style="width: 89%"></div>
                        </div>
                        <span class="kpi-progress-value">{{kpi_3_progress}}</span>
                    </div>
                </div>
                <div class="kpi-card" data-pptx-group="kpi-4">
                    <div class="kpi-label">{{kpi_4_label}}</div>
                    <div class="kpi-value">{{kpi_4_value}}</div>
                    <div class="kpi-progress">
                        <span class="kpi-progress-label">{{kpi_progress_label}}</span>
                        <div class="kpi-progress-bar">
                            <div class="kpi-progress-fill" style="width: 95%"></div>
                        </div>
                        <span class="kpi-progress-value">{{kpi_4_progress}}</span>
                    </div>
                </div>
            </div>

            <div class="chart-row">
                <div class="chart-card" data-pptx-group="chart-1">
                    <div class="chart-title">{{chart_1_title}}</div>
                    <div class="chart-container">
                        <canvas id="chart1"></canvas>
                    </div>
                </div>
                <div class="chart-card" data-pptx-group="chart-2">
                    <div class="chart-title">{{chart_2_title}}</div>
                    <div class="chart-container">
                        <div class="chart-placeholder">{{chart_2_placeholder}}</div>
                    </div>
                </div>
                <div class="chart-card" data-pptx-group="chart-3">
                    <div class="chart-title">{{chart_3_title}}</div>
                    <div class="chart-container">
                        <canvas id="chart3"></canvas>
                    </div>
                </div>
            </div>
        </main>

        <!-- STANDARD FOOTER: 60px -->
        <footer class="slide-footer">
            <span>{{footer}}</span>
            <span>{{page_number}}</span>
        </footer>
    </div>

    <script>
        // Chart 1: Bar chart
        const ctx1 = document.getElementById('chart1').getContext('2d');
        new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: ['手机', '空调', '冰箱', '手环'],
                datasets: [{
                    label: '销售量(万)',
                    data: [654, 254, 456, 568],
                    backgroundColor: '#4a90e2',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { font: { size: 11 }, boxWidth: 12, color: '#b8d4f0' }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { font: { size: 10 }, color: '#b8d4f0' },
                        grid: { color: 'rgba(184, 212, 240, 0.2)' }
                    },
                    x: {
                        ticks: { font: { size: 11 }, color: '#b8d4f0' },
                        grid: { color: 'rgba(184, 212, 240, 0.2)' }
                    }
                }
            }
        });

        // Chart 3: Doughnut chart
        const ctx3 = document.getElementById('chart3').getContext('2d');
        new Chart(ctx3, {
            type: 'doughnut',
            data: {
                labels: ['18-25岁', '25-35岁', '35-40岁', '40-45岁', '45-60岁'],
                datasets: [{
                    data: [37, 23, 12, 9, 7],
                    backgroundColor: ['#4a90e2', '#6ba3f0', '#8bb8f5', '#a8c9f7', '#2d5a8a'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '50%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: { size: 10 },
                            boxWidth: 10,
                            padding: 6,
                            color: '#b8d4f0'
                        }
                    }
                }
            }
        });
    </script>
</body>
</html>`;
LAYOUT_HTML['classic']['gantt-chart'] = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <style>        :root {
            --bg-color: {{theme.backgroundColor}};
            --heading-color: {{theme.headingColor}};
            --body-color: {{theme.bodyColor}};
            --muted-color: {{theme.mutedColor}};
            --accent-color: {{theme.accentColor}};
            --accent-light: {{theme.accentLight}};
            --card-bg: {{theme.cardBg}};
            --card-border: {{theme.cardBorder}};
            --heading-font: {{theme.headingFontFamily}};
            --body-font: {{theme.bodyFontFamily}};
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: var(--body-font);
            background-color: var(--bg-color);
            color: var(--body-color);
            width: 1280px;
            height: 720px;
            overflow: hidden;
        }

        .slide-container {
            width: 1280px;
            height: 720px;
            display: flex;
            flex-direction: column;
        }

        .slide-header {
            height: 100px;
            padding: 0 60px;
            display: flex;
            align-items: center;
            border-bottom: 2px solid var(--accent-color);
        }

        .slide-title {
            font-family: var(--heading-font);
            font-size: 40px;
            font-weight: 700;
            color: var(--heading-color);
            min-height: 60px;
            line-height: 60px;
            width: 100%;
        }

        .slide-main {
            height: 560px;
            padding: 24px 60px;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .slide-footer {
            height: 60px;
            padding: 0 60px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-top: 1px solid var(--card-border);
            color: var(--body-color);
            opacity: 0.7;
            font-size: 14px;
        }

        .slide-footer span {
            min-height: 24px;
            line-height: 24px;
            white-space: nowrap;
        }

        .slide-footer span:first-child { min-width: 200px; }
        .slide-footer span:last-child { min-width: 100px; text-align: right; }

        /* Summary Stats */
        .summary-row {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 12px;
            align-items: center;
        }

        .summary-stat {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 8px;
            padding: 12px;
            text-align: center;
        }

        .summary-stat-value {
            font-size: 24px;
            font-weight: 700;
            color: var(--heading-color);
        }

        .summary-stat-label {
            font-size: 11px;
            color: var(--body-color);
            margin-top: 4px;
        }

        .summary-stat.highlight {
            background: var(--accent-color);
            border-color: var(--accent-color);
        }

        .summary-stat.highlight .summary-stat-value,
        .summary-stat.highlight .summary-stat-label {
            color: white;
        }

        /* Gantt Table */
        .gantt-table {
            flex: 1;
            width: 100%;
            border-collapse: collapse;
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 8px;
            overflow: hidden;
        }

        .gantt-table thead {
            background: var(--accent-light);
        }

        .gantt-table th {
            padding: 12px 8px;
            font-size: 12px;
            font-weight: 600;
            color: var(--heading-color);
            text-align: center;
            border-bottom: 1px solid var(--card-border);
        }

        .gantt-table th:first-child {
            text-align: left;
            padding-left: 16px;
            width: 200px;
        }

        .gantt-table td {
            padding: 0;
            border-bottom: 1px solid var(--card-border);
            border-left: 1px solid var(--card-border);
            height: 60px;
            position: relative;
        }

        .gantt-table td:first-child {
            border-left: none;
            padding: 12px 16px;
        }

        .gantt-table tr:last-child td {
            border-bottom: none;
        }

        .gantt-task-name {
            font-size: 14px;
            font-weight: 600;
            color: var(--heading-color);
            margin-bottom: 4px;
        }

        .gantt-task-owner {
            font-size: 11px;
            color: var(--body-color);
        }

        .gantt-bar {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            height: 24px;
            background: linear-gradient(90deg, var(--accent-color), var(--accent-light));
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            color: white;
            font-weight: 600;
            white-space: nowrap;
        }
    </style>
</head>
<body>
    <div class="slide-container cover">
        <header class="slide-header">
            <h1 class="slide-title">{{title}}</h1>
        </header>

        <main class="slide-main">
            <!-- Summary Row -->
            <div class="summary-row">
                <div class="summary-stat" data-pptx-group="stat-1">
                    <div class="summary-stat-value">{{stat_1_value}}</div>
                    <div class="summary-stat-label">{{stat_1_label}}</div>
                </div>
                <div class="summary-stat" data-pptx-group="stat-2">
                    <div class="summary-stat-value">{{stat_2_value}}</div>
                    <div class="summary-stat-label">{{stat_2_label}}</div>
                </div>
                <div class="summary-stat" data-pptx-group="stat-3">
                    <div class="summary-stat-value">{{stat_3_value}}</div>
                    <div class="summary-stat-label">{{stat_3_label}}</div>
                </div>
                <div class="summary-stat" data-pptx-group="stat-4">
                    <div class="summary-stat-value">{{stat_4_value}}</div>
                    <div class="summary-stat-label">{{stat_4_label}}</div>
                </div>
                <div class="summary-stat highlight" data-pptx-group="stat-5">
                    <div class="summary-stat-value">{{stat_5_value}}</div>
                    <div class="summary-stat-label">{{stat_5_label}}</div>
                </div>
            </div>

            <!-- Gantt Chart Table -->
            <table class="gantt-table">
                <thead>
                    <tr>
                        <th>{{th_1}}</th>
                        <th>{{th_2}}</th>
                        <th>{{th_3}}</th>
                        <th>{{th_4}}</th>
                        <th>{{th_5}}</th>
                        <th>{{th_6}}</th>
                        <th>{{th_7}}</th>
                        <th>{{th_8}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr data-pptx-group="task-1">
                        <td>
                            <div class="gantt-task-name">{{task_1_name}}</div>
                            <div class="gantt-task-owner">{{task_1_owner}}</div>
                        </td>
                        <td><div class="gantt-bar" style="left: 5%; width: 180%;">{{gantt_1_status}}</div></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr data-pptx-group="task-2">
                        <td>
                            <div class="gantt-task-name">{{task_2_name}}</div>
                            <div class="gantt-task-owner">{{task_2_owner}}</div>
                        </td>
                        <td></td>
                        <td><div class="gantt-bar" style="left: 5%; width: 180%;">{{gantt_2_status}}</div></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr data-pptx-group="task-3">
                        <td>
                            <div class="gantt-task-name">{{task_3_name}}</div>
                            <div class="gantt-task-owner">{{task_3_owner}}</div>
                        </td>
                        <td></td>
                        <td></td>
                        <td><div class="gantt-bar" style="left: 5%; width: 270%;">{{gantt_3_status}}</div></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr data-pptx-group="task-4">
                        <td>
                            <div class="gantt-task-name">{{task_4_name}}</div>
                            <div class="gantt-task-owner">{{task_4_owner}}</div>
                        </td>
                        <td></td>
                        <td><div class="gantt-bar" style="left: 5%; width: 180%;">{{gantt_4_status}}</div></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr data-pptx-group="task-5">
                        <td>
                            <div class="gantt-task-name">{{task_5_name}}</div>
                            <div class="gantt-task-owner">{{task_5_owner}}</div>
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><div class="gantt-bar" style="left: 5%; width: 270%;">{{gantt_5_status}}</div></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </main>

        <footer class="slide-footer">
            <span>{{footer}}</span>
            <span>{{page_number}}</span>
        </footer>
    </div>
</body>
</html>`;
LAYOUT_HTML['classic']['image-text'] = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <style>        :root {
            --bg-color: {{theme.backgroundColor}};
            --heading-color: {{theme.headingColor}};
            --body-color: {{theme.bodyColor}};
            --muted-color: {{theme.mutedColor}};
            --accent-color: {{theme.accentColor}};
            --accent-light: {{theme.accentLight}};
            --card-bg: {{theme.cardBg}};
            --card-border: {{theme.cardBorder}};
            --heading-font: {{theme.headingFontFamily}};
            --body-font: {{theme.bodyFontFamily}};
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: var(--body-font);
            background-color: var(--bg-color);
            color: var(--body-color);
            width: 1280px;
            height: 720px;
            overflow: hidden;
        }

        .slide-container {
            width: 1280px;
            height: 720px;
            display: flex;
            flex-direction: column;
        }

        .slide-header {
            height: 100px;
            padding: 0 60px;
            display: flex;
            align-items: center;
            border-bottom: 2px solid var(--accent-color);
        }

        .slide-title {
            font-family: var(--heading-font);
            font-size: 40px;
            font-weight: 700;
            color: var(--heading-color);
            min-height: 60px;
            line-height: 60px;
            width: 100%;
        }

        .slide-main {
            height: 560px;
            padding: 40px 60px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 48px;
            align-items: center;
        }

        .slide-footer {
            height: 60px;
            padding: 0 60px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-top: 1px solid var(--card-border);
            color: var(--body-color);
            opacity: 0.7;
            font-size: 14px;
        }

        .slide-footer span {
            min-height: 24px;
            line-height: 24px;
            white-space: nowrap;
        }

        .slide-footer span:first-child { min-width: 200px; }
        .slide-footer span:last-child { min-width: 100px; text-align: right; }

        .image-section {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .image-placeholder {
            width: 100%;
            height: 400px;
            background: var(--accent-light);
            border: 2px dashed var(--accent-color);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--accent-color);
            font-size: 18px;
        }

        .text-section {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .text-heading {
            font-family: var(--heading-font);
            font-size: 32px;
            font-weight: 700;
            color: var(--heading-color);
            margin-bottom: 24px;
            min-height: 48px;
            line-height: 48px;
            width: 100%;
        }

        .text-content {
            font-size: 20px;
            color: var(--body-color);
            line-height: 1.7;
            width: 100%;
        }
    </style>
</head>
<body>
    <div class="slide-container cover">
        <header class="slide-header">
            <h1 class="slide-title">{{title}}</h1>
        </header>

        <main class="slide-main">
            <div class="image-section" data-pptx-group="image-area">
                <div class="image-placeholder">{{image_placeholder}}</div>
            </div>
            <div class="text-section" data-pptx-group="text-area">
                <h2 class="text-heading">{{heading_1}}</h2>
                <p class="text-content">{{content}}</p>
            </div>
        </main>

        <footer class="slide-footer">
            <span>{{footer}}</span>
            <span>{{page_number}}</span>
        </footer>
    </div>
</body>
</html>`;
LAYOUT_HTML['classic']['product-comparison'] = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <style>        :root {
            --bg-color: {{theme.backgroundColor}};
            --heading-color: {{theme.headingColor}};
            --body-color: {{theme.bodyColor}};
            --muted-color: {{theme.mutedColor}};
            --accent-color: {{theme.accentColor}};
            --accent-light: {{theme.accentLight}};
            --card-bg: {{theme.cardBg}};
            --card-border: {{theme.cardBorder}};
            --heading-font: {{theme.headingFontFamily}};
            --body-font: {{theme.bodyFontFamily}};
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: var(--body-font);
            background-color: var(--bg-color);
            color: var(--body-color);
            width: 1280px;
            height: 720px;
            overflow: hidden;
        }

        .slide-container { width: 1280px; height: 720px; display: flex; flex-direction: column; }

        .slide-header {
            height: 100px;
            padding: 0 60px;
            display: flex;
            align-items: center;
            border-bottom: 2px solid var(--accent-color);
        }

        .slide-title {
            font-family: var(--heading-font);
            font-size: 40px;
            font-weight: 700;
            color: var(--heading-color);
            min-height: 60px;
            line-height: 60px;
            width: 100%;
        }

        .slide-main {
            height: 560px;
            padding: 24px 60px;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
        }

        .slide-footer {
            height: 60px;
            padding: 0 60px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-top: 1px solid var(--card-border);
            color: var(--body-color);
            opacity: 0.7;
            font-size: 14px;
        }

        .slide-footer span { min-height: 24px; line-height: 24px; white-space: nowrap; }
        .slide-footer span:first-child { min-width: 200px; }
        .slide-footer span:last-child { min-width: 100px; text-align: right; }

        .product-card {
            display: flex;
            flex-direction: column;
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 8px;
            overflow: hidden;
        }

        .product-header {
            background: var(--accent-color);
            color: white;
            padding: 8px 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .product-label { font-size: 13px; font-weight: 600; }

        .product-rank {
            width: 24px;
            height: 24px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 700;
        }

        .product-image {
            height: 120px;
            background: var(--accent-light);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--accent-color);
            font-size: 14px;
        }

        .product-stats { padding: 16px; flex: 1; }

        .product-main-value { text-align: center; margin-bottom: 16px; }
        .product-main-label { font-size: 12px; color: var(--body-color); margin-bottom: 4px; }
        .product-main-number { font-size: 26px; font-weight: 700; color: var(--heading-color); }

        .product-metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .metric { text-align: center; }
        .metric-label { font-size: 11px; color: var(--body-color); margin-bottom: 2px; }
        .metric-value { font-size: 15px; font-weight: 600; color: var(--heading-color); }
    </style>
</head>
<body>
    <div class="slide-container cover">
        <header class="slide-header">
            <h1 class="slide-title">{{title}}</h1>
        </header>

        <main class="slide-main">
            <div class="product-card" data-pptx-group="product-1">
                <div class="product-header">
                    <span class="product-label">{{product_1_name}}</span>
                    <span class="product-rank">1</span>
                </div>
                <div class="product-image">{{product_1_image}}</div>
                <div class="product-stats">
                    <div class="product-main-value">
                        <div class="product-main-label">{{main_metric_label}}</div>
                        <div class="product-main-number">{{product_1_value}}</div>
                    </div>
                    <div class="product-metrics">
                        <div class="metric"><div class="metric-label">{{metric_1_label}}</div><div class="metric-value">{{product_1_metric_1}}</div></div>
                        <div class="metric"><div class="metric-label">{{metric_2_label}}</div><div class="metric-value">{{product_1_metric_2}}</div></div>
                        <div class="metric"><div class="metric-label">{{metric_3_label}}</div><div class="metric-value">{{product_1_metric_3}}</div></div>
                        <div class="metric"><div class="metric-label">{{metric_4_label}}</div><div class="metric-value">{{product_1_metric_4}}</div></div>
                    </div>
                </div>
            </div>

            <div class="product-card" data-pptx-group="product-2">
                <div class="product-header">
                    <span class="product-label">{{product_2_name}}</span>
                    <span class="product-rank">2</span>
                </div>
                <div class="product-image">{{product_2_image}}</div>
                <div class="product-stats">
                    <div class="product-main-value">
                        <div class="product-main-label">{{main_metric_label}}</div>
                        <div class="product-main-number">{{product_2_value}}</div>
                    </div>
                    <div class="product-metrics">
                        <div class="metric"><div class="metric-label">{{metric_1_label}}</div><div class="metric-value">{{product_2_metric_1}}</div></div>
                        <div class="metric"><div class="metric-label">{{metric_2_label}}</div><div class="metric-value">{{product_2_metric_2}}</div></div>
                        <div class="metric"><div class="metric-label">{{metric_3_label}}</div><div class="metric-value">{{product_2_metric_3}}</div></div>
                        <div class="metric"><div class="metric-label">{{metric_4_label}}</div><div class="metric-value">{{product_2_metric_4}}</div></div>
                    </div>
                </div>
            </div>

            <div class="product-card" data-pptx-group="product-3">
                <div class="product-header">
                    <span class="product-label">{{product_3_name}}</span>
                    <span class="product-rank">3</span>
                </div>
                <div class="product-image">{{product_3_image}}</div>
                <div class="product-stats">
                    <div class="product-main-value">
                        <div class="product-main-label">{{main_metric_label}}</div>
                        <div class="product-main-number">{{product_3_value}}</div>
                    </div>
                    <div class="product-metrics">
                        <div class="metric"><div class="metric-label">{{metric_1_label}}</div><div class="metric-value">{{product_3_metric_1}}</div></div>
                        <div class="metric"><div class="metric-label">{{metric_2_label}}</div><div class="metric-value">{{product_3_metric_2}}</div></div>
                        <div class="metric"><div class="metric-label">{{metric_3_label}}</div><div class="metric-value">{{product_3_metric_3}}</div></div>
                        <div class="metric"><div class="metric-label">{{metric_4_label}}</div><div class="metric-value">{{product_3_metric_4}}</div></div>
                    </div>
                </div>
            </div>

            <div class="product-card" data-pptx-group="product-4">
                <div class="product-header">
                    <span class="product-label">{{product_4_name}}</span>
                    <span class="product-rank">4</span>
                </div>
                <div class="product-image">{{product_4_image}}</div>
                <div class="product-stats">
                    <div class="product-main-value">
                        <div class="product-main-label">{{main_metric_label}}</div>
                        <div class="product-main-number">{{product_4_value}}</div>
                    </div>
                    <div class="product-metrics">
                        <div class="metric"><div class="metric-label">{{metric_1_label}}</div><div class="metric-value">{{product_4_metric_1}}</div></div>
                        <div class="metric"><div class="metric-label">{{metric_2_label}}</div><div class="metric-value">{{product_4_metric_2}}</div></div>
                        <div class="metric"><div class="metric-label">{{metric_3_label}}</div><div class="metric-value">{{product_4_metric_3}}</div></div>
                        <div class="metric"><div class="metric-label">{{metric_4_label}}</div><div class="metric-value">{{product_4_metric_4}}</div></div>
                    </div>
                </div>
            </div>
        </main>

        <footer class="slide-footer">
            <span>{{footer}}</span>
            <span>{{page_number}}</span>
        </footer>
    </div>
</body>
</html>`;
LAYOUT_HTML['classic']['timeline'] = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <style>        :root {
            --bg-color: {{theme.backgroundColor}};
            --heading-color: {{theme.headingColor}};
            --body-color: {{theme.bodyColor}};
            --muted-color: {{theme.mutedColor}};
            --accent-color: {{theme.accentColor}};
            --accent-light: {{theme.accentLight}};
            --card-bg: {{theme.cardBg}};
            --card-border: {{theme.cardBorder}};
            --heading-font: {{theme.headingFontFamily}};
            --body-font: {{theme.bodyFontFamily}};
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: var(--body-font);
            background-color: var(--bg-color);
            color: var(--body-color);
            width: 1280px;
            height: 720px;
            overflow: hidden;
        }

        .slide-container { width: 1280px; height: 720px; display: flex; flex-direction: column; }

        .slide-header {
            height: 100px;
            padding: 0 60px;
            display: flex;
            align-items: center;
            border-bottom: 2px solid var(--accent-color);
        }

        .slide-title {
            font-family: var(--heading-font);
            font-size: 40px;
            font-weight: 700;
            color: var(--heading-color);
            min-height: 60px;
            line-height: 60px;
            width: 100%;
        }

        .slide-main { height: 560px; padding: 32px 60px; display: flex; flex-direction: column; }

        .slide-footer {
            height: 60px;
            padding: 0 60px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-top: 1px solid var(--card-border);
            color: var(--body-color);
            opacity: 0.7;
            font-size: 14px;
        }

        .slide-footer span { min-height: 24px; line-height: 24px; white-space: nowrap; }
        .slide-footer span:first-child { min-width: 200px; }
        .slide-footer span:last-child { min-width: 100px; text-align: right; }

        .timeline-container { flex: 1; display: flex; flex-direction: column; position: relative; }

        .timeline-row {
            flex: 1;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
            padding: 16px 0;
        }

        .timeline-row.top { align-items: end; }
        .timeline-row.bottom { align-items: start; }

        .timeline-line {
            height: 4px;
            background: var(--accent-color);
            position: relative;
            margin: 8px 0;
        }

        .timeline-dots {
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            transform: translateY(-50%);
            display: flex;
            justify-content: space-around;
        }

        .timeline-dot {
            width: 16px;
            height: 16px;
            background: var(--accent-color);
            border: 3px solid var(--bg-color);
            border-radius: 50%;
        }

        .milestone {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 8px;
            padding: 16px;
            border-left: 3px solid var(--accent-color);
        }

        .milestone-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }

        .milestone-title { font-size: 15px; font-weight: 700; color: var(--heading-color); }

        .milestone-date {
            font-size: 11px;
            color: var(--accent-color);
            background: var(--accent-light);
            padding: 2px 8px;
            border-radius: 4px;
        }

        .milestone-content { font-size: 12px; color: var(--body-color); line-height: 1.5; }
    </style>
</head>
<body>
    <div class="slide-container cover">
        <header class="slide-header">
            <h1 class="slide-title">{{title}}</h1>
        </header>

        <main class="slide-main">
            <div class="timeline-container">
                <div class="timeline-row top">
                    <div class="milestone" data-pptx-group="milestone-1">
                        <div class="milestone-header">
                            <span class="milestone-title">{{milestone_1_title}}</span>
                            <span class="milestone-date">{{milestone_1_date}}</span>
                        </div>
                        <div class="milestone-content">{{milestone_1_content}}</div>
                    </div>
                    <div class="milestone" data-pptx-group="milestone-3">
                        <div class="milestone-header">
                            <span class="milestone-title">{{milestone_3_title}}</span>
                            <span class="milestone-date">{{milestone_3_date}}</span>
                        </div>
                        <div class="milestone-content">{{milestone_3_content}}</div>
                    </div>
                    <div class="milestone" data-pptx-group="milestone-5">
                        <div class="milestone-header">
                            <span class="milestone-title">{{milestone_5_title}}</span>
                            <span class="milestone-date">{{milestone_5_date}}</span>
                        </div>
                        <div class="milestone-content">{{milestone_5_content}}</div>
                    </div>
                </div>

                <div class="timeline-line">
                    <div class="timeline-dots">
                        <div class="timeline-dot"></div>
                        <div class="timeline-dot"></div>
                        <div class="timeline-dot"></div>
                        <div class="timeline-dot"></div>
                        <div class="timeline-dot"></div>
                        <div class="timeline-dot"></div>
                    </div>
                </div>

                <div class="timeline-row bottom">
                    <div class="milestone" data-pptx-group="milestone-2">
                        <div class="milestone-header">
                            <span class="milestone-title">{{milestone_2_title}}</span>
                            <span class="milestone-date">{{milestone_2_date}}</span>
                        </div>
                        <div class="milestone-content">{{milestone_2_content}}</div>
                    </div>
                    <div class="milestone" data-pptx-group="milestone-4">
                        <div class="milestone-header">
                            <span class="milestone-title">{{milestone_4_title}}</span>
                            <span class="milestone-date">{{milestone_4_date}}</span>
                        </div>
                        <div class="milestone-content">{{milestone_4_content}}</div>
                    </div>
                    <div class="milestone" data-pptx-group="milestone-6">
                        <div class="milestone-header">
                            <span class="milestone-title">{{milestone_6_title}}</span>
                            <span class="milestone-date">{{milestone_6_date}}</span>
                        </div>
                        <div class="milestone-content">{{milestone_6_content}}</div>
                    </div>
                </div>
            </div>
        </main>

        <footer class="slide-footer">
            <span>{{footer}}</span>
            <span>{{page_number}}</span>
        </footer>
    </div>
</body>
</html>`;
LAYOUT_HTML['classic']['title-slide'] = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <style>        :root {
            --bg-color: {{theme.backgroundColor}};
            --heading-color: {{theme.headingColor}};
            --body-color: {{theme.bodyColor}};
            --muted-color: {{theme.mutedColor}};
            --accent-color: {{theme.accentColor}};
            --accent-light: {{theme.accentLight}};
            --card-bg: {{theme.cardBg}};
            --card-border: {{theme.cardBorder}};
            --heading-font: {{theme.headingFontFamily}};
            --body-font: {{theme.bodyFontFamily}};
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: var(--body-font);
            background-color: var(--bg-color);
            color: var(--body-color);
            width: 1280px;
            height: 720px;
            overflow: hidden;
        }

        .slide-container {
            width: 1280px;
            height: 720px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 60px;
        }

        .slide-title {
            font-family: var(--heading-font);
            font-size: 64px;
            font-weight: 700;
            color: var(--heading-color);
            margin-bottom: 24px;
            min-height: 80px;
            line-height: 80px;
            width: 100%;
        }

        .slide-subtitle {
            font-size: 28px;
            color: var(--body-color);
            min-height: 40px;
            line-height: 40px;
            width: 100%;
            opacity: 0.9;
        }

        .slide-divider {
            width: 120px;
            height: 4px;
            background-color: var(--accent-color);
            margin: 32px 0;
        }

        .slide-meta {
            font-size: 18px;
            color: var(--body-color);
            opacity: 0.7;
            margin-top: 48px;
            min-height: 28px;
            line-height: 28px;
            width: 100%;
        }
    </style>
</head>
<body>
    <div class="slide-container cover">
        <h1 class="slide-title">{{title}}</h1>
        <div class="slide-divider"></div>
        <p class="slide-subtitle">{{subtitle}}</p>
        <p class="slide-meta">{{meta}}</p>
    </div>
</body>
</html>`;

// Available layouts
const AVAILABLE_LAYOUTS = {
    modern: Object.keys(LAYOUT_HTML['modern'] || {}),
    classic: Object.keys(LAYOUT_HTML['classic'] || {}),
};
