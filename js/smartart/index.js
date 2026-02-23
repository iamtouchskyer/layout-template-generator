/**
 * SmartArt Library - ECharts-like API for OOXML SmartArt rendering
 *
 * Usage:
 *   const smartart = new SmartArt(container);
 *   smartart.setOption({ type: 'pyramid', items: [...] });
 *   const ooxml = smartart.toOOXML();
 */

import { SMARTART_TYPES } from './types/registry.js';
import { renderSVG } from './renderers/svg.js';
import { toOOXML } from './exporters/ooxml.js';
import {
    SCHEMA_FLAT,
    SCHEMA_HIERARCHICAL,
    DATA_SCHEMAS,
    getDataSchema,
    isHierarchical,
    getEditorMode,
    shouldShowBullet,
    generateDefaultData,
    normalizeData,
} from './types/data-schema.js';

// EMU conversion constants
const EMU_PER_INCH = 914400;
const EMU_PER_POINT = 12700;
const EMU_PER_CM = 360000;
const EMU_PER_PX = 9525; // 96 DPI

function nowMs() {
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        return performance.now();
    }
    return Date.now();
}

export class SmartArt {
    constructor(container) {
        this.container = typeof container === 'string'
            ? document.querySelector(container)
            : container;
        this.option = null;
        this.data = null;
        this.svgElement = null;
        this.metrics = null;
    }

    /**
     * Set SmartArt configuration
     * @param {Object} option - Configuration object
     * @param {string} option.type - SmartArt type (pyramid, matrix, cycle, etc.)
     * @param {Array} option.items - Data items [{text, children}]
     * @param {Object} [option.theme] - Theme colors
     * @param {Object} [option.size] - {width, height} in pixels
     */
    setOption(option) {
        this.option = {
            type: option.type || 'pyramid',
            items: option.items || [],
            theme: option.theme || this._getDefaultTheme(),
            size: option.size || this._getContainerSize()
        };
        this._render();
        return this;
    }

    /**
     * Update data items
     */
    setData(items) {
        if (this.option) {
            this.option.items = items;
            this._render();
        }
        return this;
    }

    /**
     * Get current option
     */
    getOption() {
        return this.option;
    }

    /**
     * Export to OOXML format for python-pptx
     * @returns {Object} OOXML-compatible data
     */
    toOOXML() {
        if (!this.option) return null;
        return toOOXML(this.option, this.data);
    }

    /**
     * Export to portable JSON format
     */
    toJSON() {
        return {
            type: this.option?.type,
            items: this.option?.items,
            theme: this.option?.theme,
            metrics: this.metrics
        };
    }

    /**
     * Get the last render metrics
     */
    getMetrics() {
        return this.metrics;
    }

    /**
     * Render the SmartArt
     */
    _render() {
        if (!this.container || !this.option) return;
        const totalStart = nowMs();

        const typeConfig = SMARTART_TYPES[this.option.type];
        if (!typeConfig) {
            console.error(`Unknown SmartArt type: ${this.option.type}`);
            return;
        }

        // Calculate layout
        const layoutStart = nowMs();
        this.data = typeConfig.layout(this.option);
        const layoutMs = nowMs() - layoutStart;

        // Render SVG
        const renderStart = nowMs();
        this.svgElement = renderSVG(this.data, this.option);
        const renderMs = nowMs() - renderStart;

        // Clear and append
        this.container.innerHTML = '';
        this.container.appendChild(this.svgElement);

        this.metrics = {
            type: this.option.type,
            layoutMs: Number(layoutMs.toFixed(2)),
            renderMs: Number(renderMs.toFixed(2)),
            totalMs: Number((nowMs() - totalStart).toFixed(2)),
            shapeCount: this.data?.shapes?.length || 0,
            connectorCount: this.data?.connectors?.length || 0
        };
    }

    _getContainerSize() {
        if (!this.container) return { width: 800, height: 600 };
        const rect = this.container.getBoundingClientRect();
        return {
            width: rect.width || 800,
            height: rect.height || 600
        };
    }

    _getDefaultTheme() {
        return {
            accent1: '#4472C4',
            accent2: '#ED7D31',
            accent3: '#A5A5A5',
            accent4: '#FFC000',
            accent5: '#5B9BD5',
            accent6: '#70AD47',
            light1: '#FFFFFF',
            dark1: '#000000'
        };
    }

    /**
     * Resize the SmartArt
     */
    resize() {
        if (this.option) {
            this.option.size = this._getContainerSize();
            this._render();
        }
        return this;
    }

    /**
     * Dispose the instance
     */
    dispose() {
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.option = null;
        this.data = null;
        this.svgElement = null;
    }
}

// Static factory method
SmartArt.init = function(container) {
    return new SmartArt(container);
};

// Export types registry for extension
SmartArt.registerType = function(name, config) {
    SMARTART_TYPES[name] = config;
};

// Benchmark helper for local profiling in browser.
SmartArt.benchmark = function(container, optionFactory, runs = 20) {
    const inst = SmartArt.init(container);
    const metrics = [];

    for (let i = 0; i < runs; i++) {
        const option = (typeof optionFactory === 'function')
            ? optionFactory(i)
            : optionFactory;
        inst.setOption(option);
        const m = inst.getMetrics();
        if (m) metrics.push(m);
    }

    const summaryOf = (key) => {
        const arr = metrics.map(m => m[key]).filter(v => Number.isFinite(v));
        if (arr.length === 0) return null;
        const sum = arr.reduce((a, b) => a + b, 0);
        return {
            min: Number(Math.min(...arr).toFixed(2)),
            max: Number(Math.max(...arr).toFixed(2)),
            avg: Number((sum / arr.length).toFixed(2)),
        };
    };

    return {
        runs: metrics.length,
        layoutMs: summaryOf('layoutMs'),
        renderMs: summaryOf('renderMs'),
        totalMs: summaryOf('totalMs'),
        latest: metrics[metrics.length - 1] || null,
    };
};

// Utility functions
SmartArt.utils = {
    emuToPx: (emu) => emu / EMU_PER_PX,
    pxToEmu: (px) => Math.round(px * EMU_PER_PX),
    ptToEmu: (pt) => Math.round(pt * EMU_PER_POINT),
    emuToPt: (emu) => emu / EMU_PER_POINT
};

// Data schema utilities
SmartArt.schema = {
    FLAT: SCHEMA_FLAT,
    HIERARCHICAL: SCHEMA_HIERARCHICAL,
    definitions: DATA_SCHEMAS,
    get: getDataSchema,
    isHierarchical,
    getEditorMode,
    shouldShowBullet,
    generateDefaultData,
    normalizeData,
};

export default SmartArt;
