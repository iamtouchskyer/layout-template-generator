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

// EMU conversion constants
const EMU_PER_INCH = 914400;
const EMU_PER_POINT = 12700;
const EMU_PER_CM = 360000;
const EMU_PER_PX = 9525; // 96 DPI

export class SmartArt {
    constructor(container) {
        this.container = typeof container === 'string'
            ? document.querySelector(container)
            : container;
        this.option = null;
        this.data = null;
        this.svgElement = null;
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
            theme: this.option?.theme
        };
    }

    /**
     * Render the SmartArt
     */
    _render() {
        if (!this.container || !this.option) return;

        const typeConfig = SMARTART_TYPES[this.option.type];
        if (!typeConfig) {
            console.error(`Unknown SmartArt type: ${this.option.type}`);
            return;
        }

        // Calculate layout
        this.data = typeConfig.layout(this.option);

        // Render SVG
        this.svgElement = renderSVG(this.data, this.option);

        // Clear and append
        this.container.innerHTML = '';
        this.container.appendChild(this.svgElement);
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

// Utility functions
SmartArt.utils = {
    emuToPx: (emu) => emu / EMU_PER_PX,
    pxToEmu: (px) => Math.round(px * EMU_PER_PX),
    ptToEmu: (pt) => Math.round(pt * EMU_PER_POINT),
    emuToPt: (emu) => emu / EMU_PER_POINT
};

export default SmartArt;
