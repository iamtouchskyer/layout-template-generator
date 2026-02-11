// Cover page rendering functions

function renderCover() {
    const layout = COVER_LAYOUTS[state.coverLayout];
    if (!layout) return '';
    const content = state.coverContent || {};

    let html = '<div class="cover-container">';

    // Render shapes
    (layout.shapes || []).forEach(shape => {
        html += renderCoverShape(shape);
    });

    // Render text areas
    const textAreas = layout.textAreas || {};
    if (textAreas.year && content.year) {
        html += renderCoverTextArea(textAreas.year, content.year);
    }
    if (textAreas.tag && content.tag) {
        html += renderCoverTextArea(textAreas.tag, content.tag);
    }
    if (textAreas.title && content.title) {
        html += renderCoverTextArea(textAreas.title, content.title);
    }
    if (textAreas.highlight && content.highlight) {
        html += renderCoverTextArea(textAreas.highlight, content.highlight);
    }
    if (textAreas.subtitle && content.subtitle) {
        html += renderCoverTextArea(textAreas.subtitle, content.subtitle);
    }

    // Render brand tag if present
    if (layout.brandTag && content.brandTag) {
        html += renderCoverTextArea(layout.brandTag, content.brandTag);
    }

    // Render footer
    if (layout.footer && layout.footer.enabled) {
        html += renderCoverFooter(layout.footer, content.footer || {});
    }

    html += '</div>';
    return html;
}

function resolveCoverColor(colorRef) {
    if (colorRef.startsWith('#')) return colorRef;
    const colorMap = {
        'accent': 'var(--theme-accent)',
        'accent1': 'var(--theme-accent1, var(--theme-accent))',
        'accent2': 'var(--theme-accent2, var(--theme-accent))',
        'accent3': 'var(--theme-accent3, var(--theme-accent))',
        'accent4': 'var(--theme-accent4, var(--theme-accent))',
        'text': 'var(--theme-text)',
        'text_muted': 'var(--theme-text-muted)',
        'primary': 'var(--theme-primary)',
        'bg': 'var(--theme-bg)',
        'bg2': 'var(--theme-card-bg, var(--theme-bg))',
        'tx2': 'var(--theme-accent1, var(--theme-accent))',
    };
    return colorMap[colorRef] || 'var(--theme-accent)';
}

function renderCoverShape(shape) {
    const { type, x, y, w, h, fill, rotation } = shape;
    const color = resolveCoverColor(fill || 'accent');
    let style = `position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: ${h}px; background: ${color};`;
    if (rotation) style += ` transform: rotate(${rotation}deg);`;

    let shapeClass = 'cover-shape';
    if (type === 'ellipse') {
        style += ' border-radius: 50%;';
    } else if (type === 'triangle' || type === 'rtTriangle') {
        style = `position: absolute; left: ${x}px; top: ${y}px; width: 0; height: 0;`;
        style += ` border-left: ${w}px solid transparent; border-bottom: ${h}px solid ${color};`;
        if (rotation) style += ` transform: rotate(${rotation}deg); transform-origin: bottom left;`;
    }

    return `<div class="${shapeClass}" style="${style}"></div>`;
}

function renderCoverTextArea(config, text) {
    const { x, y, w, h, fontSize, color, bold, align } = config;
    const textColor = resolveCoverColor(color || 'text');
    let style = `position: absolute; left: ${x}px; top: ${y}px; width: ${w}px; height: ${h}px;`;
    style += ` font-size: ${fontSize || 16}px; color: ${textColor};`;
    if (bold) style += ' font-weight: bold;';
    if (align) style += ` text-align: ${align};`;
    return `<div class="cover-text" style="${style}">${text}</div>`;
}

function renderCoverFooter(footerConfig, footerContent) {
    const bar = footerConfig.bar || {};
    const barColor = resolveCoverColor(bar.fill || 'bg2');
    const barStyle = `position: absolute; left: ${bar.x}px; top: ${bar.y}px; width: ${bar.w}px; height: ${bar.h}px; background: ${barColor}; border-radius: ${bar.type === 'roundRect' ? '8px' : '0'};`;

    const location = footerContent.location || '芝士科技大厦';
    const date = footerContent.date || '2025.01';
    const contact = footerContent.contact || '400-123-4567';
    const logo = footerContent.logo || 'LOGO';

    return `
        <div class="cover-footer-bar" style="${barStyle}">
            <div class="cover-footer-items">
                <span class="cover-footer-item"><span class="icon">📍</span>${location}</span>
                <span class="cover-footer-item"><span class="icon">📅</span>${date}</span>
                <span class="cover-footer-item"><span class="icon">📞</span>${contact}</span>
                <span class="cover-footer-logo">${logo}</span>
            </div>
        </div>
    `;
}
