// Shared page model/type/layout helpers used across state/ui modules.

(function registerPageModelUtils(global) {
    const FALLBACK_MODEL_BY_TYPE = {
        cover: { shell: 'cover', renderer: 'cover' },
        divider: { shell: 'divider', renderer: 'divider' },
        'content-grid': { shell: 'content', renderer: 'grid' },
        'content-smartart': { shell: 'content', renderer: 'smartart' },
    };

    function getStateInternals() {
        return global.__stateInternals || {};
    }

    function inferTypeFromModel(shell, renderer) {
        const helper = getStateInternals();
        if (typeof helper.inferTypeFromModel === 'function') {
            const inferred = helper.inferTypeFromModel(shell, renderer);
            if (inferred) return inferred;
        }

        const normalizedShell = String(shell || '').trim();
        const normalizedRenderer = String(renderer || '').trim();
        if (normalizedShell === 'cover') return 'cover';
        if (normalizedShell === 'divider') return 'divider';
        if (normalizedShell === 'content' && normalizedRenderer === 'smartart') return 'content-smartart';
        if (normalizedShell === 'content') return 'content-grid';
        return null;
    }

    function normalizePageType(type, fallbackType = 'content-grid') {
        const helper = getStateInternals();
        const fallback = String(fallbackType || 'content-grid');
        if (typeof helper.normalizePageType === 'function') {
            return helper.normalizePageType(type || fallback);
        }
        const raw = String(type || fallback).trim();
        return Object.prototype.hasOwnProperty.call(FALLBACK_MODEL_BY_TYPE, raw) ? raw : fallback;
    }

    function getPageModelFromType(type) {
        const helper = getStateInternals();
        const normalized = normalizePageType(type);
        if (typeof helper.getPageModelFromType === 'function') {
            return helper.getPageModelFromType(normalized);
        }
        const model = FALLBACK_MODEL_BY_TYPE[normalized] || FALLBACK_MODEL_BY_TYPE['content-grid'];
        return { ...model };
    }

    function resolveTypeFromModel(shell, renderer, fallbackType = 'content-grid') {
        const inferred = inferTypeFromModel(shell, renderer);
        return normalizePageType(inferred || fallbackType, fallbackType);
    }

    function resolvePageType(pageLike, fallbackType = 'content-grid') {
        const page = pageLike || {};
        const inferred = inferTypeFromModel(page.shell || page.pageShell, page.renderer || page.bodyRenderer);
        return normalizePageType(page.type || inferred || fallbackType, fallbackType);
    }

    function resolvePageModel(pageLike, fallbackType = 'content-grid') {
        const page = pageLike || {};
        const type = resolvePageType(page, fallbackType);
        const fallback = getPageModelFromType(type);
        return {
            type,
            shell: page.shell || page.pageShell || fallback.shell,
            renderer: page.renderer || page.bodyRenderer || fallback.renderer,
            layout: page.layout || page.bodyLayout,
        };
    }

    function derivePageLayout(pageType, pageData, fallbackLayout) {
        const helper = getStateInternals();
        const normalizedType = normalizePageType(pageType, 'content-grid');
        const data = (pageData && typeof pageData === 'object') ? pageData : {};
        if (typeof helper.derivePageLayout === 'function') {
            return helper.derivePageLayout(normalizedType, data, fallbackLayout);
        }
        if (normalizedType === 'cover') return data.coverLayout || fallbackLayout || 'cross_rectangles';
        if (normalizedType === 'divider') return data.dividerLayout || data.divider?.layout || fallbackLayout || 'cards-highlight';
        if (normalizedType === 'content-smartart') return data.smartartPlacement || data.smartart?.placement || fallbackLayout || 'left-desc';
        return data.gridLayout || data.grid?.layout || fallbackLayout || 'two-col-equal';
    }

    global.__pageModelUtils = {
        inferTypeFromModel,
        normalizePageType,
        getPageModelFromType,
        resolveTypeFromModel,
        resolvePageType,
        resolvePageModel,
        derivePageLayout,
    };
})(window);
