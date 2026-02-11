// Placeholder rendering functions

function renderPlaceholderList() {
    const container = document.getElementById('placeholder-list');
    if (!container || !PLACEHOLDERS_CONFIG) return;

    container.innerHTML = Object.entries(PLACEHOLDERS_CONFIG).map(([phId, phConfig]) => {
        const phState = state.masterPlaceholders[phId] || { enabled: false };
        const isActive = phState.enabled;

        // Position options
        const positionOptions = Object.entries(phConfig.positions)
            .map(([posId, pos]) => `<option value="${posId}" ${phState.position === posId ? 'selected' : ''}>${pos.label}</option>`)
            .join('');

        // Size options (only for logo)
        let sizeOptionsHtml = '';
        if (phConfig.sizes) {
            const sizeOptions = Object.entries(phConfig.sizes)
                .map(([sizeId, size]) => `<option value="${sizeId}" ${phState.size === sizeId ? 'selected' : ''}>${size.label}</option>`)
                .join('');
            sizeOptionsHtml = `
                <div class="option-row">
                    <label>大小</label>
                    <select onchange="updatePlaceholderSize('${phId}', this.value)">${sizeOptions}</select>
                </div>
            `;
        }

        // Upload button (only for logo)
        let uploadHtml = '';
        if (phConfig.allowUpload) {
            const hasImage = phState.imageUrl;
            uploadHtml = `
                <div class="option-row logo-upload-row">
                    <label>图片</label>
                    <div class="logo-upload-controls">
                        <input type="file" id="logo-upload-${phId}" accept="image/*" onchange="handleLogoUpload('${phId}', this)" style="display:none">
                        <button class="upload-btn" onclick="document.getElementById('logo-upload-${phId}').click()">
                            ${hasImage ? '更换' : '上传'}
                        </button>
                        ${hasImage ? `<button class="clear-btn" onclick="clearLogoImage('${phId}')">清除</button>` : ''}
                    </div>
                </div>
            `;
        }

        return `
            <div class="placeholder-item ${isActive ? 'active' : ''}" data-placeholder="${phId}">
                <div class="placeholder-item-header" onclick="togglePlaceholder('${phId}')">
                    <input type="checkbox" ${isActive ? 'checked' : ''} onclick="event.stopPropagation(); togglePlaceholder('${phId}')">
                    <span class="item-label">${phConfig.label}</span>
                </div>
                <div class="placeholder-item-options">
                    <div class="option-row">
                        <label>位置</label>
                        <select onchange="updatePlaceholderPosition('${phId}', this.value)">${positionOptions}</select>
                    </div>
                    ${sizeOptionsHtml}
                    ${uploadHtml}
                </div>
            </div>
        `;
    }).join('');
}

function generatePlaceholderPositionStyle(posConfig) {
    const styles = [];
    if (posConfig.top !== undefined) styles.push(`top: ${posConfig.top}px`);
    if (posConfig.bottom !== undefined) styles.push(`bottom: ${posConfig.bottom}px`);
    if (posConfig.left !== undefined) styles.push(`left: ${posConfig.left}px`);
    if (posConfig.right !== undefined) styles.push(`right: ${posConfig.right}px`);
    return styles.join('; ');
}
