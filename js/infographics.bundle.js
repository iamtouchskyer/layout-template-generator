/**
 * Infographics Bundle - Auto-generated
 * Contains all infographics library code for browser use
 * DO NOT EDIT - Run bundle.py to regenerate
 */

(function(global) {
'use strict';

// ========== colorUtils.js ==========
/**
 * Color Utilities for Infographics
 * Common color conversion and contrast calculation functions
 */

const ColorUtils = {
  /**
   * Convert hex color to HSL
   * @param {string} hex - Hex color code (e.g., "#ff0000" or "ff0000")
   * @returns {object} HSL object with h (0-360), s (0-100), l (0-100)
   */
  hexToHSL(hex) {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  },

  /**
   * Convert HSL color to hex
   * @param {number} h - Hue (0-360)
   * @param {number} s - Saturation (0-100)
   * @param {number} l - Lightness (0-100)
   * @returns {string} Hex color code (e.g., "#ff0000")
   */
  hslToHex(h, s, l) {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r = 0,
      g = 0,
      b = 0;
    if (h >= 0 && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (h >= 60 && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (h >= 180 && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (h >= 240 && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (h >= 300 && h < 360) {
      r = c;
      g = 0;
      b = x;
    }

    const toHex = (n) => {
      const hex = Math.round((n + m) * 255).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  },

  /**
   * Calculate contrasting text color based on background color
   * @param {string} bgColor - Background color in hex format
   * @param {boolean} isSecondary - If true, returns a more subtle contrast (for secondary text)
   * @returns {string} Contrasting text color in hex format
   */
  getContrastingColor(bgColor, isSecondary = false) {
    const hsl = this.hexToHSL(bgColor);
    let targetLightness, targetSaturation;

    if (hsl.l > 75) {
      // Very light background → darker text
      if (isSecondary) {
        targetLightness = Math.max(40, hsl.l - 35);
        targetSaturation =
          hsl.s > 50 ? Math.max(20, hsl.s - 50) : Math.max(15, hsl.s - 20);
      } else {
        targetLightness = Math.max(25, hsl.l - 50);
        targetSaturation =
          hsl.s > 50 ? Math.max(35, hsl.s - 40) : Math.max(25, hsl.s - 20);
      }
    } else if (hsl.l < 35) {
      // Very dark background → lighter text
      if (isSecondary) {
        targetLightness = Math.min(75, hsl.l + 45);
        targetSaturation =
          hsl.s > 50 ? Math.max(20, hsl.s - 50) : Math.max(15, hsl.s - 20);
      } else {
        targetLightness = Math.min(95, hsl.l + 65);
        targetSaturation =
          hsl.s > 50 ? Math.max(30, hsl.s - 40) : Math.max(20, hsl.s - 20);
      }
    } else {
      // Medium lightness → white/near-white
      targetLightness = isSecondary ? 85 : 95;
      targetSaturation = isSecondary ? 5 : 0;
    }

    return this.hslToHex(hsl.h, targetSaturation, targetLightness);
  },
};

// Export for CommonJS (Node.js)

// Export for browser (window global)
if (typeof window !== "undefined") {
  window.ColorUtils = ColorUtils;
}


// ========== themes.js ==========
/**
 * Professional Color Themes for Infographics
 * 基于专业商务演示的配色方案
 */

class InfographicThemes {
  constructor() {
    // 默认主题
    this.currentTheme = "professional";
  }

  /**
   * 专业商务主题（紫色系）
   */
  getProfessionalTheme() {
    return {
      name: "professional",
      // 主色调
      primary: {
        main: "#7862d1", // 主紫色
        light: "#e7e1ff", // 浅紫
        lighter: "#f5e0ff", // 更浅紫
        dark: "#4f3d58", // 深紫
        variants: [
          "#ba5de5",
          "#d272ff",
          "#e2a3ff",
          "#c261ee",
          "#b159da",
          "#9c4fc1",
        ],
      },

      // 辅助色
      secondary: {
        blue: "#4f92ff",
        blueLight: "#dce9ff",
        blueDark: "#4e88e7",
      },

      // 强调色
      accent: {
        green: "#3cc583",
        greenLight: "#c8ffe5",
        yellow: "#fff8b6",
        yellowDark: "#e0cb15",
        orange: "#de8431",
        orangeLight: "#ffe4cb",
      },

      // 中性色层级
      neutral: {
        white: "#ffffff",
        gray50: "#fafafa",
        gray100: "#ebebeb",
        gray300: "#d0d0d0",
        gray400: "#808080",
        gray600: "#666666",
        gray800: "#484848",
        gray900: "#262626",
        black: "#000000",
      },

      // 文字颜色
      text: {
        primary: "#484848",
        secondary: "#666666",
        disabled: "#b0b0b0",
        inverse: "#ffffff",
      },

      // 图表配色
      colors: [
        "#e7e1ff", // 浅紫
        "#dce9ff", // 浅蓝
        "#c8ffe5", // 浅绿
        "#ffe4cb", // 浅橙
        "#fff8b6", // 浅黄
        "#f5e0ff", // 浅粉紫
      ],
    };
  }

  /**
   * Napkin 主题（柔和温暖）
   */
  getNapkinTheme() {
    return {
      name: "napkin",
      primary: {
        main: "#8b7355",
        light: "#f5e6d3",
        lighter: "#faf4eb",
        dark: "#5c4a3a",
      },

      secondary: {
        blue: "#6b8cae",
        blueLight: "#e3edf7",
        green: "#7ba05b",
        greenLight: "#e5f2dc",
      },

      accent: {
        red: "#c85450",
        orange: "#d08c60",
        yellow: "#e6c766",
        purple: "#9b7aa8",
      },

      neutral: {
        white: "#fdfcf8",
        gray100: "#f5f2eb",
        gray300: "#e8e2d5",
        gray400: "#c4b5a0",
        gray600: "#8b7961",
        gray800: "#5c4a3a",
        black: "#2c2416",
      },

      text: {
        primary: "#5c4a3a",
        secondary: "#8b7961",
        disabled: "#c4b5a0",
        inverse: "#fdfcf8",
      },
      colors: [
        "#f5e6d3",
        "#e3edf7",
        "#e5f2dc",
        "#ffd7d5",
        "#ffe4d1",
        "#fff8d6",
        "#f3e5f7",
        "#e8f0f8",
      ],
    };
  }

  /**
   * 科技主题（蓝色系）
   */
  getTechTheme() {
    return {
      name: "tech",
      primary: {
        main: "#2563eb",
        light: "#dbeafe",
        lighter: "#eff6ff",
        dark: "#1e40af",
      },

      secondary: {
        cyan: "#06b6d4",
        cyanLight: "#cffafe",
        purple: "#8b5cf6",
        purpleLight: "#ede9fe",
      },

      accent: {
        green: "#10b981",
        orange: "#f97316",
        pink: "#ec4899",
        yellow: "#eab308",
      },

      neutral: {
        white: "#ffffff",
        gray100: "#f3f4f6",
        gray300: "#d1d5db",
        gray400: "#9ca3af",
        gray600: "#4b5563",
        gray800: "#1f2937",
        black: "#111827",
      },

      text: {
        primary: "#1f2937",
        secondary: "#4b5563",
        disabled: "#9ca3af",
        inverse: "#ffffff",
      },
      colors: [
        "#dbeafe",
        "#cffafe",
        "#ede9fe",
        "#d1fae5",
        "#fed7aa",
        "#fce7f3",
        "#fef3c7",
        "#e0e7ff",
      ],
    };
  }

  /**
   * 活力主题（彩虹色）
   */

  /**
   * Professional Vivid 主题（深色强对比）
   */
  getProfessionalVividTheme() {
    return {
      name: "professional_vivid",
      primary: {
        main: "#7862d1",
        light: "#e7e1ff",
        lighter: "#f5e0ff",
        dark: "#4f3d58",
      },

      secondary: {
        blue: "#4f92ff",
        blueLight: "#dce9ff",
      },

      accent: {
        green: "#3cc583",
        orange: "#de8431",
        yellow: "#e0cb15",
      },

      neutral: {
        white: "#ffffff",
        gray100: "#ebebeb",
        gray600: "#666666",
        gray800: "#484848",
        black: "#000000",
      },

      text: {
        primary: "#484848",
        secondary: "#666666",
        disabled: "#b0b0b0",
        inverse: "#ffffff",
      },

      // 深色强对比配色
      colors: [
        "#7862d1", // 紫
        "#4f92ff", // 蓝
        "#3cc583", // 绿
        "#de8431", // 橙
        "#e0cb15", // 黄
        "#ba5de5", // 粉紫
        "#4e88e7", // 深蓝
        "#9c4fc1", // 深紫
      ],
    };
  }

  /**
   * Napkin Vivid 主题（深色版）
   */
  getNapkinVividTheme() {
    return {
      name: "napkin_vivid",
      primary: {
        main: "#8b7355",
        light: "#f5e6d3",
        dark: "#5c4a3a",
      },

      secondary: {
        blue: "#6b8cae",
        green: "#7ba05b",
      },

      accent: {
        red: "#c85450",
        orange: "#d08c60",
        yellow: "#e6c766",
        purple: "#9b7aa8",
      },

      neutral: {
        white: "#fdfcf8",
        gray800: "#5c4a3a",
        black: "#2c2416",
      },

      text: {
        primary: "#5c4a3a",
        secondary: "#8b7961",
        disabled: "#c4b5a0",
        inverse: "#fdfcf8",
      },

      // 深色饱和配色
      colors: [
        "#8b7355",
        "#6b8cae",
        "#7ba05b",
        "#c85450",
        "#d08c60",
        "#e6c766",
        "#9b7aa8",
        "#a0b4c4",
      ],
    };
  }

  /**
   * Tech Vivid 主题（深色版）
   */
  getTechVividTheme() {
    return {
      name: "tech_vivid",
      primary: {
        main: "#2563eb",
        light: "#dbeafe",
        dark: "#1e40af",
      },

      secondary: {
        cyan: "#06b6d4",
        purple: "#8b5cf6",
      },

      accent: {
        green: "#10b981",
        orange: "#f97316",
        pink: "#ec4899",
        yellow: "#eab308",
      },

      neutral: {
        white: "#ffffff",
        gray800: "#1f2937",
        black: "#111827",
      },

      text: {
        primary: "#1f2937",
        secondary: "#4b5563",
        disabled: "#9ca3af",
        inverse: "#ffffff",
      },

      // 深色科技配色
      colors: [
        "#2563eb",
        "#06b6d4",
        "#8b5cf6",
        "#10b981",
        "#f97316",
        "#ec4899",
        "#eab308",
        "#6366f1",
      ],
    };
  }

  getVibrantTheme() {
    return {
      name: "vibrant",
      primary: {
        main: "#ff4d4f",
        light: "#ff9999",
        lighter: "#ffcccc",
        dark: "#cc0000",
      },

      secondary: {
        orange: "#fa8c16",
        yellow: "#fadb14",
        green: "#52c41a",
        blue: "#1677ff",
      },

      accent: {
        red: "#ff4d4f",
        orange: "#fa8c16",
        yellow: "#fadb14",
        green: "#52c41a",
      },

      neutral: {
        white: "#ffffff",
        gray100: "#f7f7f7",
        gray300: "#d9d9d9",
        gray400: "#999999",
        gray600: "#666666",
        gray800: "#262626",
        black: "#000000",
      },

      text: {
        primary: "#262626",
        secondary: "#666666",
        disabled: "#999999",
        inverse: "#ffffff",
      },
      colors: ["#ffcccc", "#fed7aa", "#fef3c7", "#d1fae5", "#dbeafe"],
    };
  }

  /**
   * 温暖主题（暖色调）
   */
  getWarmTheme() {
    return {
      name: "warm",
      primary: {
        main: "#fa541c",
        light: "#ffa940",
        lighter: "#ffd666",
        dark: "#d4380d",
      },

      secondary: {
        orange: "#fa8c16",
        yellow: "#faad14",
        gold: "#ffc53d",
      },

      accent: {
        orange: "#fa541c",
        yellow: "#faad14",
        gold: "#ffc53d",
        amber: "#ffd666",
      },

      neutral: {
        white: "#ffffff",
        gray100: "#f7f7f7",
        gray300: "#d9d9d9",
        gray400: "#999999",
        gray600: "#666666",
        gray800: "#262626",
        black: "#000000",
      },

      text: {
        primary: "#262626",
        secondary: "#666666",
        disabled: "#999999",
        inverse: "#ffffff",
      },
      colors: ["#ffebe0", "#fff1e6", "#fff7e6", "#fff1b8", "#fffbe6"],
    };
  }

  /**
   * 冷色主题（冷色调）
   */
  getCoolTheme() {
    return {
      name: "cool",
      primary: {
        main: "#722ed1",
        light: "#b37feb",
        lighter: "#d3adf7",
        dark: "#531dab",
      },

      secondary: {
        purple: "#2f54eb",
        blue: "#1677ff",
        cyan: "#13c2c2",
      },

      accent: {
        purple: "#722ed1",
        blue: "#2f54eb",
        cyan: "#13c2c2",
        teal: "#36cfc9",
      },

      neutral: {
        white: "#ffffff",
        gray100: "#f7f7f7",
        gray300: "#d9d9d9",
        gray400: "#999999",
        gray600: "#666666",
        gray800: "#262626",
        black: "#000000",
      },

      text: {
        primary: "#262626",
        secondary: "#666666",
        disabled: "#999999",
        inverse: "#ffffff",
      },
      colors: ["#f1e8ff", "#e6edff", "#e6f4ff", "#e6fffb", "#e8fffa"],
    };
  }

  /**
   * 自然主题（绿色系）
   */
  getNatureTheme() {
    return {
      name: "nature",
      primary: {
        main: "#52c41a",
        light: "#95de64",
        lighter: "#b7eb8f",
        dark: "#389e0d",
      },

      secondary: {
        green: "#73d13d",
        lime: "#a0d911",
        yellow: "#bae637",
      },

      accent: {
        green: "#52c41a",
        lime: "#a0d911",
        mint: "#73d13d",
        olive: "#bae637",
      },

      neutral: {
        white: "#ffffff",
        gray100: "#f7f7f7",
        gray300: "#d9d9d9",
        gray400: "#999999",
        gray600: "#666666",
        gray800: "#262626",
        black: "#000000",
      },

      text: {
        primary: "#262626",
        secondary: "#666666",
        disabled: "#999999",
        inverse: "#ffffff",
      },
      colors: ["#e8f5e0", "#f0f9e8", "#f6ffed", "#fcffe6", "#fffae6"],
    };
  }

  /**
   * 日落主题（粉橙色）
   */
  getSunsetTheme() {
    return {
      name: "sunset",
      primary: {
        main: "#eb2f96",
        light: "#ff85c0",
        lighter: "#ffd6e7",
        dark: "#c41d7f",
      },

      secondary: {
        pink: "#f759ab",
        coral: "#fa541c",
        peach: "#ffa940",
      },

      accent: {
        magenta: "#eb2f96",
        pink: "#f759ab",
        coral: "#ff85c0",
        peach: "#ffa940",
      },

      neutral: {
        white: "#ffffff",
        gray100: "#f7f7f7",
        gray300: "#d9d9d9",
        gray400: "#999999",
        gray600: "#666666",
        gray800: "#262626",
        black: "#000000",
      },

      text: {
        primary: "#262626",
        secondary: "#666666",
        disabled: "#999999",
        inverse: "#ffffff",
      },
      colors: ["#ffe1f0", "#fff0f6", "#ffe4e6", "#ffebe0", "#fff7e6"],
    };
  }

  /**
   * Ocean主题（蓝→青渐变）
   */
  getOceanTheme() {
    return {
      name: "ocean",
      primary: {
        main: "#0958d9",
        light: "#1677ff",
        lighter: "#87e8de",
        dark: "#003d6b",
      },

      secondary: {
        blue: "#1677ff",
        cyan: "#13c2c2",
        lightCyan: "#36cfc9",
      },

      accent: {
        darkBlue: "#0958d9",
        blue: "#1677ff",
        cyan: "#13c2c2",
        aqua: "#36cfc9",
        lightAqua: "#87e8de",
      },

      neutral: {
        white: "#ffffff",
        gray100: "#f7f7f7",
        gray300: "#d9d9d9",
        gray400: "#999999",
        gray600: "#666666",
        gray800: "#262626",
        black: "#000000",
      },

      text: {
        primary: "#262626",
        secondary: "#666666",
        disabled: "#999999",
        inverse: "#ffffff",
      },
      colors: ["#e6f4ff", "#bae0ff", "#91caff", "#b5f5ec", "#d6f7f0"],
    };
  }

  /**
   * PPT Azure主题（深蓝→淡蓝渐变）
   */
  getPPTAzureTheme() {
    return {
      name: "ppt_azure",
      primary: {
        main: "#3949EE",
        light: "#5D90E1",
        lighter: "#E8EFF7",
        dark: "#2a3a6e",
      },

      secondary: {
        blue: "#5D90E1",
        lightBlue: "#B6CEED",
        paleBlue: "#D9E1EB",
      },

      accent: {
        darkBlue: "#3949EE",
        mediumBlue: "#5D90E1",
        softBlue: "#B6CEED",
        paleBlue: "#D9E1EB",
        lightestBlue: "#E8EFF7",
      },

      neutral: {
        white: "#FFFFFF",
        gray100: "#E8EFF7",
        gray300: "#D9E1EB",
        gray400: "#999999",
        gray600: "#666666",
        gray800: "#39393C",
        black: "#000000",
      },

      text: {
        primary: "#39393C",
        secondary: "#666666",
        disabled: "#999999",
        inverse: "#ffffff",
      },
      colors: ["#E8EFF7", "#D9E1EB", "#B6CEED", "#a3c5f0", "#87b3eb"],
    };
  }

  /**
   * PPT Ocean主题（演示蓝色系）
   */
  getPPTOceanTheme() {
    return {
      name: "ppt_ocean",
      primary: {
        main: "#0078D7",
        light: "#4DA3E5",
        lighter: "#E0EBF5",
        dark: "#003d6b",
      },

      secondary: {
        blue: "#4DA3E5",
        lightBlue: "#87BFEC",
        paleBlue: "#BBD2E9",
      },

      accent: {
        darkBlue: "#0078D7",
        blue: "#4DA3E5",
        softBlue: "#87BFEC",
        paleBlue: "#BBD2E9",
        lightestBlue: "#E0EBF5",
      },

      neutral: {
        white: "#F7F9FB",
        gray100: "#E0EBF5",
        gray300: "#BBD2E9",
        gray400: "#A3C1E0",
        gray600: "#666666",
        gray800: "#2B2B2B",
        black: "#000000",
      },

      text: {
        primary: "#2B2B2B",
        secondary: "#666666",
        disabled: "#A3C1E0",
        inverse: "#ffffff",
      },
      colors: ["#E0EBF5", "#BBD2E9", "#87BFEC", "#6aaeea", "#4DA3E5"],
    };
  }

  /**
   * PPT Copilot主题（紫红色系）
   */
  getPPTCopilotTheme() {
    return {
      name: "ppt_copilot",
      primary: {
        main: "#411B38",
        light: "#6B2F59",
        lighter: "#D98FB8",
        dark: "#2a0d1f",
      },

      secondary: {
        purple: "#6B2F59",
        magenta: "#954379",
        pink: "#BF5799",
      },

      accent: {
        darkPurple: "#411B38",
        purple: "#6B2F59",
        magenta: "#954379",
        pink: "#BF5799",
        lightPink: "#D98FB8",
      },

      neutral: {
        white: "#FFF6F0",
        gray100: "#f5e6e0",
        gray300: "#E5CCD8",
        gray400: "#999999",
        gray600: "#666666",
        gray800: "#411B38",
        black: "#000000",
      },

      text: {
        primary: "#411B38",
        secondary: "#6B2F59",
        disabled: "#999999",
        inverse: "#ffffff",
      },
      colors: ["#f5e0ec", "#ead4e2", "#dfc7d9", "#d4bad0", "#D98FB8"],
    };
  }

  /**
   * PPT Forest主题（绿色系）
   */
  getPPTForestTheme() {
    return {
      name: "ppt_forest",
      primary: {
        main: "#006747",
        light: "#1E8A6B",
        lighter: "#B8E5D7",
        dark: "#003d2e",
      },

      secondary: {
        green: "#1E8A6B",
        teal: "#3DAC8F",
        aqua: "#7CC9B3",
      },

      accent: {
        darkGreen: "#006747",
        green: "#1E8A6B",
        teal: "#3DAC8F",
        aqua: "#7CC9B3",
        lightAqua: "#B8E5D7",
      },

      neutral: {
        white: "#E5F9F2",
        gray100: "#d4f4e8",
        gray300: "#A8D5C5",
        gray400: "#85b8a5",
        gray600: "#4B4A4A",
        gray800: "#2B2B2B",
        black: "#000000",
      },

      text: {
        primary: "#4B4A4A",
        secondary: "#666666",
        disabled: "#999999",
        inverse: "#ffffff",
      },
      colors: ["#d4f4e8", "#B8E5D7", "#9ed9c5", "#85ccb3", "#6bbfa1"],
    };
  }

  /**
   * PPT Earth主题（大地色系）
   */
  getPPTEarthTheme() {
    return {
      name: "ppt_earth",
      primary: {
        main: "#835E54",
        light: "#A07A70",
        lighter: "#EDE0D9",
        dark: "#2d1f17",
      },

      secondary: {
        brown: "#A07A70",
        tan: "#BFA5A5",
        beige: "#D9C3BD",
      },

      accent: {
        darkBrown: "#835E54",
        brown: "#A07A70",
        tan: "#BFA5A5",
        beige: "#D9C3BD",
        lightBeige: "#EDE0D9",
      },

      neutral: {
        white: "#FFFCFA",
        gray100: "#f5f0ed",
        gray300: "#E8DBD6",
        gray400: "#c4b5a8",
        gray600: "#666666",
        gray800: "#443728",
        black: "#000000",
      },

      text: {
        primary: "#443728",
        secondary: "#666666",
        disabled: "#999999",
        inverse: "#ffffff",
      },
      colors: ["#f5ede8", "#EDE0D9", "#e0d2ca", "#d4c4bc", "#c8b6ad"],
    };
  }

  /**
   * 获取当前主题
   */
  getCurrentTheme() {
    switch (this.currentTheme) {
      case "napkin":
        return this.getNapkinTheme();
      case "tech":
        return this.getTechTheme();
      case "vibrant":
        return this.getVibrantTheme();
      case "warm":
        return this.getWarmTheme();
      case "cool":
        return this.getCoolTheme();
      case "nature":
        return this.getNatureTheme();
      case "sunset":
        return this.getSunsetTheme();
      case "professional":
      default:
        return this.getProfessionalTheme();
    }
  }

  /**
   * 设置主题
   */
  setTheme(themeName) {
    const validThemes = [
      "professional",
      "napkin",
      "tech",
      "professional_vivid",
      "napkin_vivid",
      "tech_vivid",
      "vibrant",
      "warm",
      "cool",
      "nature",
      "sunset",
      "ocean",
      "ppt_azure",
      "ppt_ocean",
      "ppt_copilot",
      "ppt_forest",
      "ppt_earth",
    ];
    if (validThemes.includes(themeName)) {
      this.currentTheme = themeName;
      return this.getCurrentTheme();
    }
    console.warn(`Invalid theme: ${themeName}. Using default theme.`);
    return this.getCurrentTheme();
  }

  /**
   * 获取所有主题列表
   */
  getAllThemes() {
    return {
      professional: this.getProfessionalTheme(),
      napkin: this.getNapkinTheme(),
      tech: this.getTechTheme(),
      professional_vivid: this.getProfessionalVividTheme(),
      napkin_vivid: this.getNapkinVividTheme(),
      tech_vivid: this.getTechVividTheme(),
      vibrant: this.getVibrantTheme(),
      warm: this.getWarmTheme(),
      cool: this.getCoolTheme(),
      nature: this.getNatureTheme(),
      sunset: this.getSunsetTheme(),
      ocean: this.getOceanTheme(),
      ppt_azure: this.getPPTAzureTheme(),
      ppt_ocean: this.getPPTOceanTheme(),
      ppt_copilot: this.getPPTCopilotTheme(),
      ppt_forest: this.getPPTForestTheme(),
      ppt_earth: this.getPPTEarthTheme(),
    };
  }

  /**
   * 生成动画样式
   */
  getAnimationStyles() {
    return {
      // 虚线动画
      dashedAnimation: `
        @keyframes dash-move {
          from { stroke-dashoffset: 30; }
          to { stroke-dashoffset: 0; }
        }

        .animated-dash {
          stroke-dasharray: 4, 6;
          animation: dash-move 1s linear infinite;
        }
      `,

      // 脉冲动画
      pulseAnimation: `
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `,

      // 渐入动画
      fadeInAnimation: `
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `,

      // 缩放动画
      scaleAnimation: `
        @keyframes scale-up {
          from { transform: scale(0.95); opacity: 0.8; }
          to { transform: scale(1); opacity: 1; }
        }

        .scale-up {
          animation: scale-up 0.3s ease-out;
        }
      `,
    };
  }

  /**
   * 生成渐变色
   */
  generateGradient(color1, color2, angle = 45) {
    return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
  }

  /**
   * 生成阴影效果
   */
  generateShadow(theme = null) {
    const currentTheme = theme || this.getCurrentTheme();
    return {
      small: `0 2px 4px ${currentTheme.neutral.gray400}20`,
      medium: `0 4px 6px ${currentTheme.neutral.gray600}25`,
      large: `0 10px 15px ${currentTheme.neutral.gray800}30`,
      colored: `0 8px 16px ${currentTheme.primary.main}40`,
    };
  }
}

// 全局暴露
if (typeof window !== "undefined") {
  window.InfographicThemes = InfographicThemes;
}

// 导出（支持模块系统）


// ========== styleContext.js ==========
/**
 * Infographic Style Context
 * Provides Chart.js-like defaults and helpers for fonts & color themes.
 */

(function createStyleContextModule(global) {
  const DEFAULT_PALETTE = [
    "#5d6aee",
    "#7B4397",
    "#70a7ff",
    "#4ECDC4",
    "#95E1D3",
    "#B6CEED",
    "#8E44AD",
    "#16A085",
  ];

  const DEFAULTS = {
    theme: "professional",
    palette: DEFAULT_PALETTE,
    textColor: "#484848",
    font: {
      family:
        "'Shantell Sans', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      size: 16,
      weight: 600,
      lineHeight: 1.3,
    },
  };

  function resolveTheme(themeName) {
    if (typeof InfographicThemes === "undefined") {
      return null;
    }

    const themes = new InfographicThemes();
    if (themeName) {
      return themes.setTheme(themeName);
    }
    return themes.getCurrentTheme();
  }

  function createGetTextColor(text, textSecondary) {
    return (fill, options = {}) => {
      if (fill && typeof ColorUtils !== "undefined") {
        return ColorUtils.getContrastingColor(fill, !!options.secondary);
      }
      return options.secondary ? textSecondary : text;
    };
  }

  function createStyleContext(options = {}) {
    const resolvedTheme = resolveTheme(options.themeName);

    const paletteSource =
      (options.colors && options.colors.length && options.colors) ||
      (resolvedTheme && resolvedTheme.colors) ||
      DEFAULTS.palette;

    const font = {
      ...DEFAULTS.font,
      ...(options.font || {}),
    };

    const textPrimary =
      options.textColor ||
      (resolvedTheme && resolvedTheme.text && resolvedTheme.text.primary) ||
      DEFAULTS.textColor;

    const textSecondary =
      (resolvedTheme && resolvedTheme.text && resolvedTheme.text.secondary) ||
      "#666666";

    return {
      name:
        (resolvedTheme && resolvedTheme.name) ||
        options.themeName ||
        DEFAULTS.theme,
      palette: paletteSource,
      neutrals: (resolvedTheme && resolvedTheme.neutral) || {},
      font,
      text: {
        primary: textPrimary,
        secondary: textSecondary,
      },
      getTextColor: createGetTextColor(textPrimary, textSecondary),
    };
  }

  const api = {
    defaults: DEFAULTS,
    createStyleContext,
  };

})(typeof window !== "undefined" ? window : globalThis);


// ========== charts/BlockHierarchy.js ==========
/**
 * Block Hierarchy Chart - Vanilla JavaScript
 * Tree structure showing organizational or goal hierarchy
 *
 * Features:
 * - 1 root node at top
 * - Multiple branch nodes at bottom
 * - Connection lines between nodes
 */

class BlockHierarchy {
  constructor(config) {
    this.data = config.data || [];
    this.colors = config.colors || ["#7862d1", "#4f92ff", "#3cc583", "#de8431"];
    this.width = config.width || 600;
    this.height = config.height || 400;
    this.textColor = config.textColor || "#484848";
    this.branchCount = config.branchCount || 3;
    this.onItemClick = config.onItemClick;
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
  }

  /**
   * Draw a block/card node
   */
  drawNode(x, y, item, index, isRoot = false) {
    const nodeWidth = this.width * 0.22;
    const nodeHeight = this.height * 0.12;
    const color = item.color || this.colors[index % this.colors.length];
    const cornerRadius = nodeWidth * 0.08;

    let svg = `<g>`;

    // Node rectangle
    svg += `
      <rect
        x="${x - nodeWidth / 2}"
        y="${y - nodeHeight / 2}"
        width="${nodeWidth}"
        height="${nodeHeight}"
        rx="${cornerRadius}"
        ry="${cornerRadius}"
        fill="${color}"
        stroke="${this.textColor}"
        stroke-width="${Math.max(2, this.width * 0.004)}"
        opacity="${isRoot ? "1" : "0.9"}"/>
    `;

    // Node header highlight (for root)
    if (isRoot) {
      svg += `
        <rect
          x="${x - nodeWidth / 2}"
          y="${y - nodeHeight / 2}"
          width="${nodeWidth}"
          height="${nodeHeight * 0.35}"
          rx="${cornerRadius}"
          ry="${cornerRadius}"
          fill="#ffffff"
          opacity="0.15"/>
      `;
    }

    // Label
    const label =
      item.label && item.label.length > 12 && this.width < 500
        ? item.label.slice(0, 10) + "..."
        : item.label;

    svg += `
      <text
        x="${x}"
        y="${y + this.width * 0.006}"
        text-anchor="middle"
        fill="${this.textColor}"
        font-size="${Math.max(10, this.width * 0.022)}"
        font-weight="${isRoot ? "700" : "600"}">
        ${this.escapeHtml(label)}
      </text>
    `;

    // Description (if provided)
    if (item.description && this.width > 300) {
      const description =
        item.description.length > 15
          ? item.description.slice(0, 13) + "..."
          : item.description;

      svg += `
        <text
          x="${x}"
          y="${y + this.width * 0.024}"
          text-anchor="middle"
          fill="${this.textColor}"
          font-size="${Math.max(8, this.width * 0.016)}"
          opacity="0.85">
          ${this.escapeHtml(description)}
        </text>
      `;
    }

    svg += `</g>`;
    return svg;
  }

  /**
   * Draw connection line from parent to child
   */
  drawConnection(x1, y1, x2, y2) {
    const nodeHeight = this.height * 0.12;
    // Vertical then horizontal connection
    const midY = y1 + (y2 - y1) * 0.5;

    return `
      <path
        d="M ${x1} ${y1 + nodeHeight / 2}
           L ${x1} ${midY}
           L ${x2} ${midY}
           L ${x2} ${y2 - nodeHeight / 2}"
        stroke="${this.textColor}33"
        stroke-width="${Math.max(2, this.width * 0.003)}"
        fill="none"
        stroke-linecap="round"/>
    `;
  }

  /**
   * Generate the chart
   */
  generateChart() {
    const maxBranches = this.width < 768 ? 2 : Math.min(this.branchCount, 4);

    // Layout structure: 1 root + N branches
    const rootNode = this.data[0];
    const branches = this.data.slice(1, 1 + maxBranches);

    const nodeHeight = this.height * 0.12;
    const levelSpacing = this.height * 0.25;
    const centerX = this.width * 0.5;

    // Root position (top center)
    const rootY = this.height * 0.18;

    // Branch positions (bottom row, evenly spaced)
    const branchY = rootY + levelSpacing;
    const branchSpacing = (this.width * 0.85) / (maxBranches + 1);
    const branchStartX = this.width * 0.075 + branchSpacing;

    let svg = "";

    // Connection lines
    branches.forEach((_, index) => {
      const branchX = branchStartX + index * branchSpacing;
      svg += this.drawConnection(centerX, rootY, branchX, branchY);
    });

    // Root node
    if (rootNode) {
      svg += this.drawNode(centerX, rootY, rootNode, 0, true);
    }

    // Branch nodes
    branches.forEach((branch, index) => {
      const branchX = branchStartX + index * branchSpacing;
      svg += this.drawNode(branchX, branchY, branch, index + 1, false);
    });

    return svg;
  }

  /**
   * Generate full SVG
   */
  generate() {
    const content = this.generateChart();

    return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Block Hierarchy Chart">
  <title>Block Hierarchy Chart</title>
  <desc>Tree structure showing organizational hierarchy</desc>
  ${content}
</svg>`.trim();
  }
}

// Export
if (typeof window !== "undefined") {
  window.BlockHierarchy = BlockHierarchy;
}


// ========== charts/BrainMapping.js ==========
/**
 * Brain Mapping Chart - Vanilla JavaScript
 * Central hub with radial nodes showing relationships
 *
 * Usage:
 * const chart = new BrainMapping({
 *   data: [
 *     {label: 'Code Understanding', description: 'Doubled with integration'},
 *     {label: 'Figma Design', description: 'Seamlessly converted'}
 *   ],
 *   colors: ['#c8ffe5', '#e9ffb9', '#d1f4ff'],
 *   width: 600,
 *   height: 400
 * });
 * const svg = chart.generate();
 */

class BrainMapping {
  constructor(config) {
    this.data = config.data || [];
    this.colors = config.colors || [
      "#c8ffe5",
      "#e9ffb9",
      "#d1f4ff",
      "#ffd7ef",
      "#fff8b6",
      "#ffd9d8",
    ];
    this.width = config.width || 600;
    this.height = config.height || 400;
    this.textColor = config.textColor || "#484848"; // Theme text color for labels outside shapes
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
  }

  /**
   * Generate chart
   */
  generateChart() {
    // Responsive dimensions
    const maxItems = this.width < 768 ? 3 : 6;
    const numItems = Math.min(this.data.length, maxItems);

    // Center point
    const centerX = this.width * 0.5;
    const centerY = this.height * 0.5;

    // Central hub radius
    const hubRadius = Math.min(this.width, this.height) * 0.08;

    // Node circle radius
    const nodeRadius = Math.min(this.width, this.height) * 0.12;

    // Distance from center to nodes
    const orbitRadius = Math.min(this.width, this.height) * 0.35;

    // Get node position
    const getNodePosition = (index) => {
      // Start from top (-90 degrees) and go clockwise
      const angle = (index / numItems) * 2 * Math.PI - Math.PI / 2;
      const x = centerX + orbitRadius * Math.cos(angle);
      const y = centerY + orbitRadius * Math.sin(angle);
      return { x, y, angle };
    };

    let svg = "";

    // Connection lines from center to nodes
    this.data.slice(0, maxItems).forEach((_, index) => {
      const { x, y } = getNodePosition(index);
      svg += `
        <line x1="${centerX}" y1="${centerY}" x2="${x}" y2="${y}"
              stroke="${this.textColor}" stroke-width="${Math.max(2, this.width * 0.004)}"
              stroke-dasharray="4,4" opacity="0.5"/>
      `;
    });

    // Central hub
    svg += `
      <circle cx="${centerX}" cy="${centerY}" r="${hubRadius}"
              fill="#ebebeb" stroke="#ffffff" stroke-width="${Math.max(2, this.width * 0.004)}"/>

      <circle cx="${centerX - hubRadius * 0.3}" cy="${centerY - hubRadius * 0.3}" r="${hubRadius * 0.4}"
              fill="#ffffff" opacity="0.4"/>
    `;

    // Nodes
    this.data.slice(0, maxItems).forEach((item, index) => {
      const { x, y, angle } = getNodePosition(index);
      const color = item.color || this.colors[index % this.colors.length];

      // Determine label position based on angle
      const labelDistance = nodeRadius + this.height * 0.08;
      const labelX = x + labelDistance * Math.cos(angle);
      const labelY = y + labelDistance * Math.sin(angle);

      // Text anchor based on position
      const textAnchor =
        labelX < centerX - 10
          ? "end"
          : labelX > centerX + 10
            ? "start"
            : "middle";

      const numberFontSize = Math.max(14, this.width * 0.028);
      const labelFontSize = Math.max(10, this.width * 0.022);
      const descFontSize = Math.max(8, this.width * 0.016);

      // Node circle
      svg += `
        <circle cx="${x}" cy="${y}" r="${nodeRadius}"
                fill="${color}" stroke="#ffffff" stroke-width="${Math.max(2, this.width * 0.004)}"/>

        <circle cx="${x - nodeRadius * 0.3}" cy="${y - nodeRadius * 0.3}" r="${nodeRadius * 0.35}"
                fill="#ffffff" opacity="0.4"/>

        <circle cx="${x}" cy="${y}" r="${nodeRadius * 0.4}"
                fill="#ffffff" opacity="0.9"/>

        <text x="${x}" y="${y + numberFontSize * 0.35}" text-anchor="middle"
              fill="${this.resolveTextColor ? this.resolveTextColor("#ffffff") : ColorUtils.getContrastingColor("#ffffff", false)}" font-size="${numberFontSize}" font-weight="700">
          ${index + 1}
        </text>

        <text x="${labelX}" y="${labelY + labelFontSize * 0.35}" text-anchor="${textAnchor}"
              fill="${this.textColor}" font-size="${labelFontSize}" font-weight="600">
          ${this.escapeHtml(item.label.length > 20 && this.width < 400 ? item.label.slice(0, 18) + "..." : item.label)}
        </text>
      `;

      // Description (if provided)
      if (item.description && this.width > 250) {
        svg += `
          <text x="${labelX}" y="${labelY + this.height * 0.04 + descFontSize * 0.35}" text-anchor="${textAnchor}"
                fill="${this.textColor}" font-size="${descFontSize}" opacity="0.8">
            ${this.escapeHtml(item.description.length > 25 ? item.description.slice(0, 25) + "..." : item.description)}
          </text>
        `;
      }
    });

    return svg;
  }

  /**
   * Generate full SVG
   */
  generate() {
    const content = this.generateChart();

    return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Brain Mapping Chart">
  <title>Brain Mapping Chart</title>
  <desc>A hub-and-spoke diagram showing central concept with radial connections</desc>
  ${content}
</svg>`.trim();
  }
}

// Export
if (typeof window !== "undefined") {
  window.BrainMapping = BrainMapping;
}


// ========== charts/BullseyeMultiArrows.js ==========
/**
 * Bullseye with Multiple Arrows Chart - Vanilla JavaScript
 * Based on chart_bullseye_multi_arrows.html (原 chart_09)
 *
 * Features:
 * - 4 organic-shaped ring layers
 * - 5 hand-drawn style arrows pointing to different layers
 * - Original dimensions: 960×948
 */

class BullseyeMultiArrows {
  constructor(config) {
    this.data = config.data || [];
    this.colors = config.colors || ["#7862d1", "#4f92ff", "#3cc583", "#de8431"];
    this.width = config.width || 960;
    this.height = config.height || 948;
    this.textColor = config.textColor || "#484848";
    this.onItemClick = config.onItemClick;
  }

  /**
   * Ring layer paths (organic compound paths)
   */
  getRingPaths() {
    return [
      // Layer 1 (outermost)
      `M 70.492631 246.0096C 86.442931 280.0374 116.739031 307.0589 155.880631 317.5469C 226.298131 336.4152 298.678631 294.6263 317.546931 224.2088C 336.415231 153.7913 294.626331 81.4108 224.208831 62.5425C 153.791331 43.6741 81.410831 85.463 62.542531 155.8806C 61.474131 159.8678 60.600231 163.8613 59.915031 167.851C 44.041631 165.7617 28.168231 163.6727 12.294731 161.5839C 13.269431 155.5436 14.560231 149.4952 16.178031 143.4573C 17.621531 138.0703 19.294531 132.8062 21.183931 127.6727C 28.575131 130.7345 35.966431 133.7961 43.357731 136.8576C 46.419231 138.1257 49.929031 136.6719 51.197131 133.6105C 52.465231 130.549 51.011431 127.0392 47.949931 125.7711L 25.701431 116.5542C 61.106331 37.1188 149.959631 -7.0458 236.632131 16.178C 332.656031 41.9075 389.640931 140.6082 363.911331 236.6321C 338.181831 332.656 239.481131 389.6409 143.457331 363.9113C 89.330231 349.408 47.607431 311.719 26.111231 264.393L 70.492631 246.0096ZM 65.896331 234.9248C 63.453331 228.1853 61.551131 221.2288 60.227731 214.1209C 57.439831 214.4878 54.651931 214.8548 51.864031 215.2217L 49.071231 215.5893C 36.906531 217.1903 24.741931 218.7914 12.577331 220.3924C 14.514631 231.6788 17.520431 242.6975 21.513831 253.3086L 65.896331 234.9248ZM 10.945131 208.5066C 26.821331 206.4173 42.697331 204.3279 58.573131 202.2382C 57.886231 194.8414 57.822631 187.3249 58.422631 179.7582L 10.778731 173.4881C 9.674731 185.2872 9.757431 197.0072 10.945131 208.5066Z`,

      // Layer 2
      `M 66.8998 179.5987C 77.2754 200.3311 96.1369 216.6982 120.292 223.1705C 165.1031 235.1776 211.1634 208.5847 223.1705 163.7736C 235.1776 118.9624 208.5847 72.9021 163.7736 60.895C 118.9624 48.8879 72.9021 75.4808 60.895 120.292C 58.4109 129.5629 57.5789 138.8872 58.2187 147.9524C 42.3332 150.0441 26.4473 152.1353 10.5612 154.2263C 9.8742 146.8295 9.8107 139.313 10.4107 131.7463L 34.2492 134.8835C 37.4974 135.2594 40.4575 132.9598 40.8858 129.7062C 41.3183 126.4209 39.0057 123.4069 35.7203 122.9744C 27.7812 121.9292 19.8422 120.8841 11.903 119.8391C 12.5883 115.8494 13.4622 111.8559 14.5306 107.8686C 33.3989 37.4511 105.7793 -4.3378 176.1969 14.5306C 246.6144 33.3989 288.4033 105.7793 269.535 176.1969C 250.6667 246.6144 178.2862 288.4033 107.8686 269.535C 68.7271 259.047 38.4309 232.0255 22.4807 197.9977L 66.8998 179.5987ZM 62.3059 168.5129C 61.3592 165.6712 60.5622 162.7731 59.9218 159.8302C 44.0198 161.9231 28.1178 164.016 12.2158 166.109C 13.5392 173.2169 15.4414 180.1734 17.8844 186.9129L 62.3059 168.5129Z`,

      // Layer 3
      `M 63.497692 113.108769C 68.157292 120.563369 75.541992 126.339369 84.703392 128.794169C 103.908092 133.940069 123.648292 122.543069 128.794192 103.338269C 133.940092 84.133569 122.543092 64.393369 103.338292 59.247469C 84.133592 54.101569 64.393392 65.498569 59.247492 84.703369C 57.675792 90.568969 57.647292 96.484569 58.913192 102.019069L 14.293992 120.500969C 13.347292 117.659269 12.550292 114.761169 11.909892 111.818169C 19.878092 110.769469 27.846392 109.720669 35.814592 108.671869C 39.099992 108.239369 41.412692 105.225469 40.980092 101.940069C 40.547592 98.654669 37.533692 96.341969 34.248292 96.774569C 26.234592 97.829969 18.220692 98.885269 10.206792 99.940469C 9.566992 90.875269 10.398892 81.550869 12.883092 72.279969C 24.890192 27.468869 70.950492 0.875969 115.761592 12.883069C 160.572792 24.890169 187.165692 70.950469 175.158592 115.761669C 163.151492 160.572769 117.091192 187.165669 72.279992 175.158569C 48.124992 168.686269 29.263492 152.319169 18.887892 131.586769L 63.497692 113.108769Z`,

      // Layer 4 (innermost)
      `M 10.901315 54.0072L 40.472115 41.7586L 44.456215 40.2089C 45.441115 39.9438 46.506915 39.9267 47.562915 40.2096C 50.763715 41.0673 52.663215 44.3573 51.805615 47.5581C 51.320015 49.3704 50.054715 50.7654 48.467315 51.4791L 45.064315 52.8451L 15.485815 65.0969C 20.145415 72.5515 27.530015 78.3275 36.691415 80.7823C 55.896215 85.9282 75.636415 74.5312 80.782315 55.3264C 85.928215 36.1216 74.531215 16.3815 55.326415 11.2356C 36.121615 6.0897 16.381515 17.4867 11.235615 36.6914C 9.663915 42.5571 9.635415 48.4727 10.901315 54.0072Z`,
    ];
  }

  /**
   * Ring transforms
   */
  getRingTransforms() {
    return [
      { x: 493.90997314453125, y: 296.0509948730469 },
      { x: 541.9200439453125, y: 344.06201171875 },
      { x: 589.93603515625, y: 392.07403564453125 },
      { x: 637.947021484375, y: 440.08599853515625 },
    ];
  }

  /**
   * Arrow paths (5 arrows)
   */
  getArrowPaths() {
    return [
      // Arrow pointing to top-right
      `M 328.942784 135.172769L 30.521484 259.717069C 30.521484 259.717069 32.473384 261.816169 33.741484 264.877669C 35.009584 267.939169 35.113684 270.803669 35.113684 270.803669L 333.534984 146.259369L 336.937984 144.893369C 338.525384 144.179669 339.790684 142.784569 340.276284 140.972369C 341.133884 137.771569 339.234384 134.481569 336.033584 133.623869C 334.977584 133.340969 333.911784 133.358069 332.926884 133.623169L 328.942784 135.172769Z`,

      // Arrow pointing down
      `M 33.747344 15.926C 32.479244 18.9874 30.527344 21.0866 30.527344 21.0866C 82.949244 42.8004 135.368844 64.5203 187.790744 86.2337C 190.852244 87.5018 194.362044 86.048 195.630144 82.9865C 196.898244 79.9251 195.444444 76.4153 192.382944 75.1472C 139.967644 53.4333 87.540644 31.7135 35.119544 10C 35.119544 10 35.015444 12.8645 33.747344 15.926Z`,

      // Arrow pointing right (horizontal)
      `M 226.6949 132.274375C 229.9431 132.650275 232.9032 130.350675 233.3315 127.097075C 233.764 123.811775 231.4514 120.797775 228.166 120.365275C 155.9669 110.860075 83.7657 101.364575 11.5663 91.859375C 11.5663 91.859375 12.2071 94.653175 11.7746 97.938575C 11.3421 101.223875 10 103.756675 10 103.756675L 226.6949 132.274375Z`,

      // Arrow pointing diagonally
      `M 276.273853 154.0744C 279.559153 153.6418 281.871853 150.6279 281.439353 147.3425C 281.006753 144.0572 277.992853 141.7445 274.707453 142.177C 186.479053 153.7968 98.235953 165.4023 10.001953 177.0185C 10.001953 177.0185 11.344053 179.5513 11.776553 182.8367C 12.209053 186.122 11.568253 188.9159 11.568253 188.9159C 99.803053 177.2995 188.038853 165.6879 276.273853 154.0744Z`,

      // Fifth arrow (placeholder - same as first for now)
      `M 328.942784 135.172769L 30.521484 259.717069C 30.521484 259.717069 32.473384 261.816169 33.741484 264.877669C 35.009584 267.939169 35.113684 270.803669 35.113684 270.803669L 333.534984 146.259369L 336.937984 144.893369C 338.525384 144.179669 339.790684 142.784569 340.276284 140.972369C 341.133884 137.771569 339.234384 134.481569 336.033584 133.623869C 334.977584 133.340969 333.911784 133.358069 332.926884 133.623169L 328.942784 135.172769Z`,
    ];
  }

  /**
   * Arrow transforms
   */
  getArrowTransforms() {
    return [
      { x: 349.47698974609375, y: 346.6719970703125 },
      { x: 278.698974609375, y: 290.13299560546875 },
      { x: 255.15402221679688, y: 389.6289978027344 },
      { x: 278.416015625, y: 584.8089599609375 },
      { x: 255.15597534179688, y: 491.9730224609375 },
    ];
  }

  /**
   * Label positions for each ring
   */
  getLabelPositions() {
    return [
      { x: 190, y: 190 }, // Layer 1
      { x: 140, y: 140 }, // Layer 2
      { x: 90, y: 90 }, // Layer 3
      { x: 45, y: 45 }, // Layer 4
    ];
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
  }

  /**
   * Generate the chart
   */
  generateChart() {
    const ORIGINAL_WIDTH = 960;
    const ORIGINAL_HEIGHT = 948;
    const maxItems = 4;
    const numItems = Math.min(this.data.length, maxItems);

    const scaleX = this.width / ORIGINAL_WIDTH;
    const scaleY = this.height / ORIGINAL_HEIGHT;

    const ringPaths = this.getRingPaths();
    const ringTransforms = this.getRingTransforms();
    const labelPositions = this.getLabelPositions();
    const arrowPaths = this.getArrowPaths();
    const arrowTransforms = this.getArrowTransforms();

    let svg = "";

    // Bullseye rings
    this.data.slice(0, numItems).forEach((item, index) => {
      const color = item.color || this.colors[index % this.colors.length];
      const transform = ringTransforms[index];
      const path = ringPaths[index];
      const labelPos = labelPositions[index];

      const tx = transform.x * scaleX;
      const ty = transform.y * scaleY;

      svg += `
        <g transform="translate(${tx}, ${ty}) scale(${scaleX}, ${scaleY})">
          <!-- Ring shape -->
          <path
            d="${path}"
            fill="${color}"
            stroke="${this.textColor}"
            stroke-width="2"
            stroke-linejoin="round"
            stroke-linecap="round"
            opacity="0.9"/>

          <!-- Label -->
          <text
            x="${labelPos.x}"
            y="${labelPos.y}"
            text-anchor="middle"
            dominant-baseline="middle"
            fill="${this.textColor}"
            font-size="${Math.max(12, 16 / scaleX)}"
            font-weight="600">
            ${this.escapeHtml(item.label)}
          </text>
        </g>
      `;
    });

    // Multiple arrows pointing to different layers
    const numArrows = Math.min(numItems, arrowPaths.length);
    for (let i = 0; i < numArrows; i++) {
      const arrowPath = arrowPaths[i];
      const transform = arrowTransforms[i];
      const tx = transform.x * scaleX;
      const ty = transform.y * scaleY;

      svg += `
        <g transform="translate(${tx}, ${ty}) scale(${scaleX}, ${scaleY})">
          <path
            d="${arrowPath}"
            fill="#e0e0e0"
            stroke="${this.textColor}33"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            opacity="0.7"/>
        </g>
      `;
    }

    // Center dot
    const centerX = this.width * 0.5;
    const centerY = this.height * 0.5;
    const radius = Math.max(4, this.width * 0.008);

    svg += `
      <circle
        cx="${centerX}"
        cy="${centerY}"
        r="${radius}"
        fill="${this.textColor}"
        opacity="0.6"/>
    `;

    return svg;
  }

  /**
   * Generate full SVG
   */
  generate() {
    const content = this.generateChart();

    return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bullseye Multi Arrows Chart">
  <title>Bullseye Multi Arrows Chart</title>
  <desc>Target rings with multiple arrows</desc>
  ${content}
</svg>`.trim();
  }
}

// Export
if (typeof window !== "undefined") {
  window.BullseyeMultiArrows = BullseyeMultiArrows;
}


// ========== charts/BullseyeProgression.js ==========
/**
 * Bullseye Progression Chart - PowerPoint SmartArt BASIC_TARGET Style
 * Concentric circles with labels on the right side
 * Matches PowerPoint SmartArt rendering
 */

class BullseyeProgression {
  constructor(config) {
    this.data = config.data || [];
    this.colors = config.colors || [
      "#C0504D", // Red (outermost)
      "#9BBB59", // Green
      "#8064A2", // Purple
      "#4BACC6", // Cyan (innermost)
    ];
    this.width = config.width || 600;
    this.height = config.height || 400;
    this.textColor = config.textColor || "#000000";
    this.showCenter =
      config.showCenter !== undefined ? config.showCenter : true;
    this.onItemClick = config.onItemClick;
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
  }

  /**
   * Generate the chart - PowerPoint BASIC_TARGET style
   */
  generateChart() {
    const numItems = Math.min(this.data.length, 5);
    if (numItems === 0) return "";

    // Layout: circles on left, labels on right
    const circleAreaWidth = this.width * 0.55;
    const labelAreaStart = this.width * 0.6;
    const centerX = circleAreaWidth / 2;
    const centerY = this.height / 2;
    const maxRadius = Math.min(circleAreaWidth, this.height) * 0.45;
    const radiusStep = maxRadius / numItems;

    // Label area dimensions
    const labelTop = this.height * 0.1;
    const labelHeight = this.height * 0.8;
    const labelSpacing = labelHeight / (numItems + 1);

    let svg = "";

    // Render circles from outside to inside (so inner circles appear on top)
    for (let i = numItems - 1; i >= 0; i--) {
      const item = this.data[i];
      const radius = maxRadius - i * radiusStep;
      const color = item.color || this.colors[i % this.colors.length];

      // Concentric circle with white stroke (PowerPoint style)
      svg += `
        <circle cx="${centerX}" cy="${centerY}"
                r="${radius}"
                fill="${color}"
                stroke="#FFFFFF"
                stroke-width="2"/>
      `;
    }

    // Render labels on the right side with horizontal connector lines
    for (let i = 0; i < numItems; i++) {
      const item = this.data[i];
      const radius = maxRadius - i * radiusStep;
      const color = item.color || this.colors[i % this.colors.length];

      // Label Y position (evenly distributed vertically)
      const labelY = labelTop + (i + 1) * labelSpacing;

      // Connector line start point (on the circle edge, horizontal)
      const lineStartX = centerX + radius;
      const lineStartY = centerY;

      // Intermediate point for angled connector
      const lineEndX = labelAreaStart - 10;

      // Connector line (angled from circle to label)
      // Line color matches the circle color but lighter
      const lineColor = this.adjustColorOpacity(color, 0.4);

      svg += `
        <path d="M ${lineStartX} ${lineStartY}
                 L ${labelAreaStart - 30} ${lineStartY}
                 L ${labelAreaStart - 30} ${labelY}
                 L ${lineEndX} ${labelY}"
              stroke="${lineColor}"
              stroke-width="2"
              fill="none"/>
      `;

      // Small circle marker at label position
      svg += `
        <circle cx="${lineEndX + 5}" cy="${labelY}"
                r="4"
                fill="${color}"/>
      `;

      // Label text
      const fontSize = Math.max(12, this.width * 0.025);
      svg += `
        <text x="${labelAreaStart}" y="${labelY}"
              text-anchor="start"
              dominant-baseline="middle"
              fill="${this.textColor}"
              font-size="${fontSize}"
              font-weight="600"
              font-family="Arial, sans-serif">
          ${this.escapeHtml(item.label)}
        </text>
      `;

      // Description/value (if provided) - indented below label
      if (item.description || item.value !== undefined) {
        const descText = item.description ||
          (typeof item.value === "number" && item.value <= 100
            ? `${item.value}%`
            : String(item.value));

        svg += `
          <text x="${labelAreaStart + 15}" y="${labelY + fontSize * 1.2}"
                text-anchor="start"
                dominant-baseline="middle"
                fill="${this.textColor}"
                fill-opacity="0.7"
                font-size="${fontSize * 0.85}"
                font-family="Arial, sans-serif">
            • ${this.escapeHtml(descText)}
          </text>
        `;
      }
    }

    return svg;
  }

  /**
   * Adjust color opacity by creating a lighter version
   */
  adjustColorOpacity(hexColor, opacity) {
    // Simple approach: return the color with opacity
    // For SVG, we can use stroke-opacity or create rgba
    return hexColor;
  }

  /**
   * Generate full SVG
   */
  generate() {
    const content = this.generateChart();

    return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bullseye Progression Chart">
  <title>Bullseye Progression Chart</title>
  <desc>Target-focused concentric circles with labels (PowerPoint BASIC_TARGET style)</desc>
  <rect x="0" y="0" width="${this.width}" height="${this.height}" fill="#FFFFFF"/>
  ${content}
</svg>`.trim();
  }
}

// Export
if (typeof window !== "undefined") {
  window.BullseyeProgression = BullseyeProgression;
}


// ========== charts/BullseyeSingleArrow.js ==========
/**
 * Bullseye with Single Arrow Chart - Vanilla JavaScript
 * Based on chart_bullseye_single_arrow.html (原 chart_04)
 *
 * Features:
 * - 4 organic-shaped ring layers with gaps
 * - Single hand-drawn style arrow
 * - Original dimensions: 828×912
 */

class BullseyeSingleArrow {
  constructor(config) {
    this.data = config.data || [];
    this.colors = config.colors || ["#7862d1", "#4f92ff", "#3cc583", "#de8431"];
    this.width = config.width || 828;
    this.height = config.height || 912;
    this.textColor = config.textColor || "#484848";
    this.arrowTargetLayer =
      config.arrowTargetLayer !== undefined ? config.arrowTargetLayer : 0;
    this.onItemClick = config.onItemClick;
  }

  /**
   * Ring layer paths (organic arcs with gaps for arrow entry)
   */
  getRingPaths() {
    return [
      // Layer 1 (outermost) - TWO parts
      {
        arc: `M 106 250.27977C 106 276.78977 84.51 298.27977 58 298.27977C 31.49 298.27977 10 276.78977 10 250.27977C 10 223.76977 31.49 202.27977 58 202.27977C 67.86 202.27977 77.03 205.24977 84.65 210.34977L 65.49 227.47977C 63.13 226.69977 60.62 226.27977 58 226.27977C 44.75 226.27977 34 237.02977 34 250.27977C 34 263.52977 44.75 274.27977 58 274.27977C 71.25 274.27977 82 263.52977 82 250.27977C 82 248.59977 81.83 246.94977 81.49 245.36977L 100.65 228.22977C 104.07 234.82977 106 242.32977 106 250.27977Z`,
        blob: `M 311.940078 70.924985L 311.410078 71.454985C 310.150078 72.714985 308.820078 73.864985 307.430078 74.894985C 293.330078 85.404985 273.290078 84.254985 260.500078 71.454985C 246.440078 57.404985 246.440078 34.604985 260.500078 20.544985C 274.550078 6.484985 297.350078 6.484985 311.410078 20.544985C 325.290078 34.424985 325.470078 56.834985 311.940078 70.924985Z`,
      },
      // Layer 2 - TWO parts
      {
        arc: `M 163.97 71.789785L 145.82 88.019785C 151.02 96.899785 154 107.239785 154 118.279785C 154 151.419785 127.14 178.279785 94 178.279785C 60.86 178.279785 34 151.419785 34 118.279785C 34 85.139785 60.86 58.279785 94 58.279785C 107.43 58.279785 119.82 62.689785 129.82 70.139785L 147.97 53.909785C 133.37 41.649785 114.55 34.279785 94 34.279785C 47.61 34.279785 10 71.889785 10 118.279785C 10 164.669785 47.61 202.279785 94 202.279785C 140.39 202.279785 178 164.669785 178 118.279785C 178 101.089785 172.84 85.099785 163.97 71.789785Z`,
        blob: `M 404.118525 80.5513C 403.858525 80.6413 403.598525 80.7113 403.338525 80.7813C 401.638525 81.2413 399.928525 81.5613 398.238525 81.7713C 380.758525 83.8513 363.938525 72.8313 359.248525 55.3213C 354.558525 37.7913 363.638525 19.8113 379.878525 12.9013C 381.428525 12.2413 383.038525 11.6813 384.708525 11.2313C 384.998525 11.1513 385.288525 11.0813 385.578525 11.0113C 404.498525 6.4413 423.728525 17.7713 428.798525 36.6913C 433.868525 55.6313 422.858525 75.0913 404.118525 80.5513Z`,
      },
      // Layer 3 - TWO parts
      {
        arc: `M 226.99 59.34L 208.99 75.44C 219.72 90.93 226 109.73 226 130C 226 183.02 183.02 226 130 226C 76.98 226 34 183.02 34 130C 34 76.98 76.98 34 130 34C 154.11 34 176.14 42.88 192.99 57.56L 210.99 41.46C 189.65 21.92 161.22 10 130 10C 63.73 10 10 63.73 10 130C 10 196.27 63.73 250 130 250C 196.27 250 250 196.27 250 130C 250 103.58 241.46 79.16 226.99 59.34Z`,
        blob: `M 464.7832 211.050415C 459.7032 230.000415 440.4332 241.340415 421.4832 236.710415C 421.2232 236.650415 420.9532 236.580415 420.6932 236.510415C 418.9432 236.040415 417.2532 235.450415 415.6432 234.750415C 399.5432 227.770415 390.5632 209.870415 395.2332 192.420415C 399.9132 174.940415 416.6731 163.930415 434.1231 165.960415C 435.8531 166.160415 437.5932 166.490415 439.3232 166.960415C 439.5832 167.030415 439.8332 167.100415 440.0932 167.180415C 458.8332 172.640415 469.8532 192.110415 464.7832 211.050415Z`,
      },
      // Layer 4 (innermost) - TWO parts
      {
        arc: `M 289.93 71.240031L 271.98 87.300031C 288.32 109.280031 298 136.510031 298 166.000031C 298 238.900031 238.9 298.000031 166 298.000031C 93.1 298.000031 34 238.890031 34 166.000031C 34 93.110031 93.1 34.000031 166 34.000031C 200.77 34.000031 232.4 47.450031 255.98 69.420031L 273.93 53.360031C 245.91 26.500031 207.88 10.000031 166 10.000031C 79.84 10.000031 10 79.830031 10 166.000031C 10 252.170031 79.84 322.000031 166 322.000031C 252.16 322.000031 322 252.160031 322 166.000031C 322 130.360031 310.05 97.510031 289.93 71.240031Z`,
        blob: `M 419.455 395.173746C 405.395 409.233746 382.595 409.233746 368.545 395.173746C 354.485 381.113746 354.485 358.313746 368.545 344.263746C 381.325 331.473746 401.345 330.323746 415.435 340.793746C 416.835 341.833746 418.185 342.993746 419.455 344.263746C 419.645 344.453746 419.825 344.633746 420.005 344.823746C 433.515 358.913746 433.325 381.303746 419.455 395.173746Z`,
      },
    ];
  }

  /**
   * Ring transforms
   */
  getRingTransforms() {
    return [
      { x: 164, y: 248 },
      { x: 128, y: 380 },
      { x: 92, y: 368.2799987792969 },
      { x: 56, y: 332.27996826171875 },
    ];
  }

  /**
   * Arrow path
   */
  getArrowPath() {
    return {
      main: `M 224.9 49.319985L 207.01 65.319985L 183.21 59.439985L 177.03 64.959985L 200.83 70.839985L 182.95 86.839985L 159.15 80.959985L 33.7947 192.827685C 33.9295 193.547785 34 194.290585 34 195.049785C 34 201.677185 28.6274 207.049785 22 207.049785C 15.3726 207.049785 10 201.677185 10 195.049785C 10 188.422385 15.3726 183.049785 22 183.049785C 23.3911 183.049785 24.7269 183.286485 25.9693 183.721785L 151.01 72.139985L 147.77 47.519985L 165.66 31.519985L 168.9 56.139985L 175.08 50.609985L 171.83 25.999985L 189.72 9.999985L 193.89 41.659985L 224.9 49.319985Z`,
      arcs: `M 273.003906 18.705322C 288.758206 40.022122 301.728706 63.521322 311.378506 88.666122C 311.817306 88.529922 312.260406 88.401522 312.707806 88.280922C 312.996906 88.201222 313.286106 88.131322 313.575206 88.061622L 313.577806 88.060922C 314.820406 87.760822 316.064406 87.529222 317.305706 87.363822C 307.324606 61.119722 293.801606 36.621322 277.320706 14.452622C 276.877406 14.969822 276.417006 15.477422 275.939506 15.974622L 275.409506 16.504622C 274.633406 17.280722 273.830806 18.015122 273.003906 18.705322ZM 334.605606 156.778022C 333.792506 157.079922 332.963006 157.354722 332.117706 157.600922C 331.858106 157.690822 331.598506 157.760722 331.338906 157.830722L 331.337806 157.830922C 330.481006 158.062822 329.621606 158.259122 328.763506 158.423622C 330.239506 170.425422 330.999506 182.648822 330.999506 195.049622C 330.999506 207.457522 330.238606 219.687622 328.761006 231.695922C 329.615706 231.860722 330.470406 232.058322 331.322706 232.289822C 331.582706 232.359822 331.832606 232.429822 332.092606 232.509822C 332.945706 232.758422 333.782806 233.035922 334.603006 233.341222C 336.184506 220.800022 336.999506 208.020022 336.999506 195.049622C 336.999506 182.086222 336.185406 169.312822 334.605606 156.778022ZM 317.296906 302.758622C 316.027006 302.589222 314.754106 302.350522 313.482706 302.039822C 313.286506 301.994622 313.084606 301.943622 312.885706 301.891222C 312.821006 301.874222 312.756506 301.857022 312.692706 301.839822C 312.247506 301.720222 311.806106 301.592922 311.369006 301.458022C 301.723606 326.584522 288.762106 350.067522 273.020606 371.371322C 273.857606 372.068522 274.671306 372.809922 275.454506 373.593122C 275.644506 373.783122 275.824506 373.963122 276.004506 374.153122C 276.465106 374.633522 276.909806 375.123522 277.338606 375.622622C 293.806506 353.466822 307.320206 328.984522 317.296906 302.758622Z`,
    };
  }

  getArrowTransform() {
    return { x: 200, y: 302.95001220703125 };
  }

  /**
   * Label positions for each ring
   */
  getLabelPositions() {
    return [
      { x: 58, y: 250 }, // Layer 1
      { x: 94, y: 118 }, // Layer 2
      { x: 130, y: 130 }, // Layer 3
      { x: 166, y: 166 }, // Layer 4
    ];
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
  }

  /**
   * Generate the chart
   */
  generateChart() {
    const ORIGINAL_WIDTH = 828;
    const ORIGINAL_HEIGHT = 912;
    const maxItems = 4;
    const numItems = Math.min(this.data.length, maxItems);

    const scaleX = this.width / ORIGINAL_WIDTH;
    const scaleY = this.height / ORIGINAL_HEIGHT;

    const ringPaths = this.getRingPaths();
    const ringTransforms = this.getRingTransforms();
    const labelPositions = this.getLabelPositions();
    const arrowPath = this.getArrowPath();
    const arrowTransform = this.getArrowTransform();

    let svg = "";

    // Bullseye rings (render from outside to inside)
    this.data.slice(0, numItems).forEach((item, index) => {
      const color = item.color || this.colors[index % this.colors.length];
      const labelColor = this.resolveTextColor
        ? this.resolveTextColor(color)
        : this.textColor;
      const transform = ringTransforms[index];
      const paths = ringPaths[index];
      const labelPos = labelPositions[index];

      const tx = transform.x * scaleX;
      const ty = transform.y * scaleY;

      svg += `
        <g transform="translate(${tx}, ${ty}) scale(${scaleX}, ${scaleY})">
          <!-- Ring arc -->
          <path
            d="${paths.arc}"
            fill="${color}"
            stroke="${this.textColor}"
            stroke-width="2"
            stroke-linejoin="round"
            stroke-linecap="round"
            opacity="0.9"/>

          <!-- Ring blob -->
          <path
            d="${paths.blob}"
            fill="${color}"
            stroke="${this.textColor}"
            stroke-width="2"
            stroke-linejoin="round"
            stroke-linecap="round"
            opacity="0.9"/>

          <!-- Label -->
          <text
            x="${labelPos.x}"
            y="${labelPos.y}"
            text-anchor="middle"
            dominant-baseline="middle"
            fill="${labelColor}"
            font-size="${Math.max(12, 16 / scaleX)}"
            font-weight="600">
            ${this.escapeHtml(item.label)}
          </text>
        </g>
      `;
    });

    // Single arrow
    const arrowTx = arrowTransform.x * scaleX;
    const arrowTy = arrowTransform.y * scaleY;

    svg += `
      <g transform="translate(${arrowTx}, ${arrowTy}) scale(${scaleX}, ${scaleY})">
        <!-- Arrow body -->
        <path
          d="${arrowPath.main}"
          fill="#e0e0e0"
          stroke="${this.textColor}33"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          opacity="0.7"/>

        <!-- Arrow arc decorations -->
        <path
          d="${arrowPath.arcs}"
          fill="#e0e0e0"
          stroke="${this.textColor}33"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          opacity="0.7"/>
      </g>
    `;

    // Center dot
    const centerX = this.width * 0.5;
    const centerY = this.height * 0.5;
    const radius = Math.max(4, this.width * 0.008);

    svg += `
      <circle
        cx="${centerX}"
        cy="${centerY}"
        r="${radius}"
        fill="${this.textColor}"
        opacity="0.6"/>
    `;

    return svg;
  }

  /**
   * Generate full SVG
   */
  generate() {
    const content = this.generateChart();

    return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bullseye Single Arrow Chart">
  <title>Bullseye Single Arrow Chart</title>
  <desc>Target rings with single arrow</desc>
  ${content}
</svg>`.trim();
  }
}

// Export
if (typeof window !== "undefined") {
  window.BullseyeSingleArrow = BullseyeSingleArrow;
}


// ========== charts/BullseyeWithSupport.js ==========
/**
 * Bullseye with Support Chart - Vanilla JavaScript
 * Based on chart_bullseye_with_support.html (原 chart_03)
 *
 * Features:
 * - Concentric rings (bullseye)
 * - 3D support structure at bottom
 * - Multiple layers with labels
 * - Original dimensions: 552×904
 */

class BullseyeWithSupport {
  constructor(config) {
    this.data = config.data || [];
    this.colors = config.colors || ["#7862d1", "#4f92ff", "#3cc583", "#de8431"];
    this.width = config.width || 552;
    this.height = config.height || 904;
    this.textColor = config.textColor || "#484848";
    this.showSupport =
      config.showSupport !== undefined ? config.showSupport : true;
    this.onItemClick = config.onItemClick;
  }

  /**
   * Original SVG paths extracted from chart_03
   */
  getSupportPath() {
    return `M 19.312069 169.97313L 42.463869 169.97313C 43.597069 169.97313 44.633569 169.33453 45.143269 168.32233L 112.527569 34.50963C 106.811169 29.80333 101.340769 24.65483 96.164269 19.09753L 19.312069 169.97313ZM 11.933069 167.16203L 19.312069 169.97313L 96.164269 19.09753C 93.443269 16.17643 90.803469 13.14233 88.251769 10.00003L 10.327769 162.99703C 9.518269 164.58653 10.266169 166.52703 11.933069 167.16203ZM 98.137769 206.90083L 105.312469 208.71413C 105.312469 208.71413 107.399969 209.13963 108.373769 209.22333L 142.927369 54.19863C 138.741969 52.14553 134.627769 49.87993 130.597869 47.41123L 95.944369 203.34153C 95.592169 204.92593 96.564169 206.50313 98.137769 206.90083ZM 108.373769 209.22333C 109.347569 209.30693 111.550769 209.06753 111.550769 209.06753L 132.500369 206.44883C 133.758369 206.29153 134.781769 205.36043 135.056769 204.12283L 144.646269 160.97313L 151.091169 131.97313L 166.368269 63.23073C 158.373169 60.95873 150.532869 57.92943 142.927369 54.19863L 108.373769 209.22333ZM 287.783969 142.22933L 280.140569 123.50303C 279.647069 122.29393 278.428169 121.54303 277.126369 121.64603L 271.615069 122.08223L 151.091169 131.97313L 144.646269 160.97313L 281.792469 146.67703L 285.286069 146.34993C 287.290269 146.16233 288.544669 144.09303 287.783969 142.22933ZM 299.102469 183.16813L 309.925069 184.27073L 257.406469 57.35433L 246.097469 60.41663L 271.615069 122.08223L 277.126369 121.64603C 278.428169 121.54303 279.647069 122.29393 280.140569 123.50303L 287.783969 142.22933C 288.544669 144.09303 287.290269 146.16233 285.286069 146.34993L 281.792469 146.67703L 295.812769 180.75563C 296.235969 181.77843 297.421569 182.93793 299.102469 183.16813ZM 309.925069 184.27073L 328.403269 181.96093C 330.369669 181.71513 331.561669 179.66423 330.801969 177.83403L 278.161469 51.01833C 274.074269 52.61093 269.870869 53.99153 265.557269 55.14733L 265.552969 55.14853L 265.499469 55.16283L 257.406469 57.35433L 309.925069 184.27073Z`;
  }

  getRingsPath() {
    return `M 229.212531 73.115254C 198.288731 25.646254 145.786331 0.174154 95.898931 13.541454C 31.082731 30.908854 -4.774769 107.262154 15.808831 184.081254C 36.392431 260.900354 105.622631 309.095554 170.438831 291.728054C 199.297431 283.995454 222.415431 264.569554 237.367031 238.615554L 218.863631 226.424054C 206.341431 246.969854 187.519831 262.304954 164.228231 268.545854C 110.081431 283.054454 52.281431 242.920854 35.128431 178.904954C 17.975431 114.888954 47.964831 51.232254 102.111631 36.723654C 143.045631 25.755454 186.067431 46.015754 212.037231 84.214654L 229.212531 73.115254ZM 215.297731 89.251454L 232.393531 78.203454C 240.151331 91.142354 246.345031 105.573954 250.528831 121.188254C 250.615531 121.511754 250.701231 121.835254 250.785831 122.158754L 231.077331 125.867854C 227.450931 112.523754 222.056531 100.224854 215.297731 89.251454ZM 194.042631 95.843554C 173.162331 66.724854 139.700431 51.497954 107.838431 60.035354C 64.627731 71.613654 40.722731 122.515754 54.445131 173.728554C 68.167531 224.941254 114.321031 257.071354 157.531731 245.493054C 175.335631 240.722554 189.862231 229.276154 199.829731 213.882854L 181.234731 201.630954C 173.922131 211.587954 163.873431 218.948254 151.803031 222.182454C 119.528331 230.830454 85.021331 206.703954 74.729531 168.294354C 64.437731 129.884854 82.258431 91.737154 114.533131 83.089154C 137.226931 77.008354 161.024431 87.131754 176.731231 107.030854L 194.042631 95.843554ZM 180.271131 111.887154L 197.400031 100.817654C 202.895031 109.475554 207.321931 119.199554 210.360431 129.766754L 190.592931 133.486954C 188.112331 125.567254 184.588831 118.309354 180.271131 111.887154ZM 159.072931 118.442454C 148.702231 107.704554 134.428431 102.604854 120.744831 106.271354C 99.139431 112.060554 87.186931 137.511654 94.048131 163.118054C 100.909331 188.724354 123.986131 204.789454 145.591431 199.000254C 152.053531 197.268754 157.652031 193.778354 162.141931 189.050954L 141.172331 175.234454C 140.590631 175.458754 139.992931 175.653854 139.379931 175.818054C 128.443831 178.748354 116.797431 170.744854 113.366831 157.941654C 109.936131 145.138454 116.020531 132.383954 126.956631 129.453654C 131.354231 128.275354 135.866731 128.865054 139.913731 130.823854L 159.072931 118.442454ZM 145.294031 134.490754L 163.010531 123.041554C 166.167431 127.202654 168.799431 131.972154 170.727831 137.225454L 150.440231 141.043554C 149.042831 138.520154 147.290631 136.310654 145.294031 134.490754ZM 152.794831 146.705754C 152.855331 146.912554 152.913631 147.120654 152.969731 147.330054C 153.916431 150.863354 154.138531 154.392854 153.734031 157.713254L 173.948531 162.126754C 174.576931 155.987254 174.146631 149.503554 172.507131 142.995954L 152.794831 146.705754ZM 192.192831 139.291154C 194.406631 148.560454 194.997231 157.780254 194.157031 166.538954L 214.324931 170.942254C 215.401231 159.564954 214.662731 147.611454 211.871931 135.587554L 192.192831 139.291154ZM 232.532631 131.699354C 235.925931 146.614854 236.790131 161.437054 235.416831 175.547254L 255.623231 179.958954C 257.211731 163.231454 256.184831 145.672254 252.206631 127.996654L 232.532631 131.699354ZM 254.938031 185.950754L 234.694731 181.530954C 232.631831 195.827654 228.244031 209.277254 221.848831 221.205554L 240.252031 233.331054C 247.639331 219.035454 252.657331 202.980754 254.938031 185.950754ZM 202.914831 208.730254C 208.179431 199.202854 211.822731 188.415654 213.584931 176.921954L 193.352431 172.504554C 191.819331 181.285954 188.814831 189.477554 184.549131 196.629354L 202.914831 208.730254ZM 165.948631 184.373854C 169.248431 179.637954 171.649831 174.084654 172.990831 168.058954L 152.304031 163.542354C 151.082131 166.752254 149.205831 169.574854 146.796731 171.754954L 165.948631 184.373854Z`;
  }

  getSupportTransform() {
    return { x: 21.995758056640625, y: 478.2558288574219 };
  }

  getRingsTransform() {
    return { x: 111.39120483398438, y: 218.7637176513672 };
  }

  /**
   * Label positions for each layer (approximate centers)
   */
  getLabelPositions() {
    return [
      { x: 166, y: 155 }, // Outermost
      { x: 138, y: 155 }, // Second
      { x: 110, y: 155 }, // Third
      { x: 82, y: 155 }, // Innermost
    ];
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
  }

  /**
   * Generate the chart
   */
  generateChart() {
    const ORIGINAL_WIDTH = 552;
    const ORIGINAL_HEIGHT = 904;
    const maxItems = 4;
    const numItems = Math.min(this.data.length, maxItems);

    const scaleX = this.width / ORIGINAL_WIDTH;
    const scaleY = this.height / ORIGINAL_HEIGHT;

    const supportPath = this.getSupportPath();
    const ringsPath = this.getRingsPath();
    const supportTransform = this.getSupportTransform();
    const ringsTransform = this.getRingsTransform();
    const labelPositions = this.getLabelPositions();

    let svg = "";

    // Support structure (render first, behind bullseye)
    if (this.showSupport) {
      const tx = supportTransform.x * scaleX;
      const ty = supportTransform.y * scaleY;

      svg += `
        <g transform="translate(${tx}, ${ty}) scale(${scaleX}, ${scaleY})">
          <path
            d="${supportPath}"
            fill="#e0e0e0"
            stroke="${this.textColor}33"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            opacity="0.6"/>
        </g>
      `;
    }

    // Bullseye rings group
    const ringsTx = ringsTransform.x * scaleX;
    const ringsTy = ringsTransform.y * scaleY;

    svg += `<g transform="translate(${ringsTx}, ${ringsTy}) scale(${scaleX}, ${scaleY})">`;

    // Labels for each layer
    this.data.slice(0, numItems).forEach((item, index) => {
      const pos = labelPositions[index];

      svg += `
        <text
          x="${pos.x}"
          y="${pos.y}"
          text-anchor="middle"
          dominant-baseline="middle"
          fill="${this.textColor}"
          font-size="${Math.max(12, 16 / scaleX)}"
          font-weight="600">
          ${this.escapeHtml(item.label)}
        </text>
      `;
    });

    // The compound rings path - all layers in one
    svg += `
      <path
        d="${ringsPath}"
        fill="none"
        stroke="${this.textColor}"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        opacity="0.9"/>
    </g>`;

    // Center dot
    const centerX = this.width * 0.5;
    const centerY = this.height * 0.38;
    const radius = Math.max(4, this.width * 0.008);

    svg += `
      <circle
        cx="${centerX}"
        cy="${centerY}"
        r="${radius}"
        fill="${this.textColor}"
        opacity="0.6"/>
    `;

    return svg;
  }

  /**
   * Generate full SVG
   */
  generate() {
    const content = this.generateChart();

    return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bullseye with Support Chart">
  <title>Bullseye with Support Chart</title>
  <desc>Concentric rings with 3D support structure</desc>
  ${content}
</svg>`.trim();
  }
}

// Export
if (typeof window !== "undefined") {
  window.BullseyeWithSupport = BullseyeWithSupport;
}


// ========== charts/ComparisonHouseFoundation.js ==========
/**
 * Comparison House Foundation Chart - Vanilla JavaScript
 * Based on chart_comparison_house_foundation.html (原 chart_19)
 *
 * 特征: 房屋/屋顶结构配合基础框架布局
 * - 顶部有灰色屋顶/檐口结构
 * - 底部有多个彩色方框（foundation blocks）
 * - 使用原始 SVG paths 保证真实形状
 * - 尺寸: 624×600
 */

class ComparisonHouseFoundation {
  constructor(config) {
    this.data = config.data || [];
    this.colors = config.colors || [
      "#ff4d4f",
      "#fa8c16",
      "#fadb14",
      "#52c41a",
      "#1677ff",
    ];
    this.width = config.width || 624;
    this.height = config.height || 600;
    this.showRoof = config.showRoof !== undefined ? config.showRoof : true;
    this.roofLabel = config.roofLabel || "";
    this.textColor = config.textColor || "#262626"; // For text outside shapes
  }

  /**
   * Original SVG paths
   */
  getRoofPath() {
    return `M 286 10L 562 130L 550 154L 22 154L 10 130L 286 10ZM 562 490L 10 490L 22 466L 550 466L 562 490Z`;
  }

  getBlockPaths() {
    return {
      small: `M 10 10L 178 10L 178 166L 10 166L 10 10Z`,
      large: `M 10 10L 262 10L 262 166L 10 166L 10 10Z`,
    };
  }

  getBlockPositions() {
    return [
      { x: 50, y: 194, type: "small" }, // Row 1, col 1
      { x: 218, y: 194, type: "small" }, // Row 1, col 2
      { x: 386, y: 194, type: "small" }, // Row 1, col 3
      { x: 50, y: 350, type: "large" }, // Row 2, col 1
      { x: 302, y: 350, type: "large" }, // Row 2, col 2
    ];
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
  }

  /**
   * Generate chart
   */
  generateChart() {
    const originalWidth = 624;
    const originalHeight = 600;
    const scaleX = this.width / originalWidth;
    const scaleY = this.height / originalHeight;

    let svg = "";

    // Roof structure
    if (this.showRoof) {
      const roofTextColor = this.resolveTextColor
        ? this.resolveTextColor("#ebebeb")
        : ColorUtils.getContrastingColor("#ebebeb", false);
      svg += `
        <g transform="translate(${26 * scaleX}, ${50 * scaleY}) scale(${scaleX}, ${scaleY})">
          <path d="${this.getRoofPath()}" fill="#ebebeb" stroke="#ffffff" stroke-width="2"
                stroke-linejoin="round" stroke-linecap="round" opacity="0.8"/>
          ${
            this.roofLabel
              ? `
            <text x="286" y="80" text-anchor="middle" dominant-baseline="middle"
                  fill="${roofTextColor}" font-size="${Math.max(16, 20 / scaleX)}" font-weight="700">
              ${this.escapeHtml(this.roofLabel)}
            </text>
          `
              : ""
          }
        </g>
      `;
    }

    // Foundation blocks
    const blocks = this.getBlockPositions();
    const paths = this.getBlockPaths();
    const maxItems = Math.min(this.data.length, 5);

    this.data.slice(0, maxItems).forEach((item, index) => {
      if (index >= blocks.length) return;

      const block = blocks[index];
      const color = item.color || this.colors[index % this.colors.length];
      const path = paths[block.type];
      const tx = block.x * scaleX;
      const ty = block.y * scaleY;

      // Text position
      const textX = block.type === "small" ? 94 : 136;
      const labelY = 88;

      // Calculate contrasting text color (text is inside colored block)
      const labelColor = this.resolveTextColor
        ? this.resolveTextColor(color)
        : ColorUtils.getContrastingColor(color, false);
      const descColor = this.resolveTextColor
        ? this.resolveTextColor(color, true, labelColor)
        : ColorUtils.getContrastingColor(color, true);

      svg += `
        <g transform="translate(${tx}, ${ty}) scale(${scaleX}, ${scaleY})">
          <path d="${path}" fill="${color}" stroke="#ffffff" stroke-width="2"
                stroke-linejoin="round" stroke-linecap="round" opacity="0.9"/>

          <text x="${textX}" y="${labelY}" text-anchor="middle" dominant-baseline="middle"
                fill="${labelColor}" font-size="${Math.max(14, 18 / scaleX)}" font-weight="700">
            ${this.escapeHtml(item.label)}
          </text>

          ${
            item.description
              ? `
            <text x="${textX}" y="${labelY + 24}" text-anchor="middle" dominant-baseline="middle"
                  fill="${descColor}" font-size="${Math.max(11, 14 / scaleX)}" opacity="0.9">
              ${this.escapeHtml(item.description)}
            </text>
          `
              : ""
          }
        </g>
      `;
    });

    return svg;
  }

  /**
   * Generate full SVG
   */
  generate() {
    const content = this.generateChart();

    return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Comparison House Foundation Chart">
  <title>Comparison House Foundation Chart</title>
  <desc>House structure with foundation blocks for hierarchical comparison</desc>
  ${content}
</svg>`.trim();
  }
}

// Export
if (typeof window !== "undefined") {
  window.ComparisonHouseFoundation = ComparisonHouseFoundation;
}


// ========== charts/ComparisonOverlappingCards.js ==========
/**
 * Comparison Overlapping Cards Chart - Vanilla JavaScript
 * Based on chart_comparison_overlapping_cards.html (原 chart_02)
 *
 * 特征: 重叠的横向卡片/货架形状
 * - 3个彩色卡片水平排列
 * - 每个卡片一侧有圆角
 * - 卡片之间有轻微重叠
 * - 使用原始 SVG paths 保证真实形状
 * - 尺寸: 672×408
 */

class ComparisonOverlappingCards {
  constructor(config) {
    this.data = config.data || [];
    this.colors = config.colors || ["#ff4d4f", "#fa8c16", "#fadb14"];
    this.width = config.width || 672;
    this.height = config.height || 408;
  }

  /**
   * Original SVG paths extracted from chart_02
   */
  getPaths() {
    return [
      // Card 1 (bottom-most, largest): both sides rounded
      `M 226 16C 226 12.686 223.314 10 220 10L 16 10C 12.686 10 10 12.686 10 16C 10 19.314 12.686 22 16 22L 22 22L 22 178L 214 178L 214 22L 220 22C 223.314 22 226 19.314 226 16Z`,
      // Card 2 (middle): left side rounded
      `M 16 10C 12.6863 10 10 12.686 10 16C 10 19.314 12.6863 22 16 22L 22 22L 22 142L 214 142L 214 10L 16 10Z`,
      // Card 3 (top-most, smallest): right side rounded
      `M 208 10C 211.314 10 214 12.686 214 16C 214 19.314 211.314 22 208 22L 202 22L 202 106L 10 106L 10 10L 208 10Z`,
    ];
  }

  /**
   * Original positions from HTML
   */
  getPositions() {
    return [
      { x: 218, y: 170 }, // sy_1 (bottom)
      { x: 26, y: 206 }, // sy_2 (middle)
      { x: 422, y: 242 }, // sy_3 (top)
    ];
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
  }

  /**
   * Generate chart
   */
  generateChart() {
    const paths = this.getPaths();
    const positions = this.getPositions();
    const maxItems = Math.min(this.data.length, 3);

    const originalWidth = 672;
    const originalHeight = 408;
    const scaleX = this.width / originalWidth;
    const scaleY = this.height / originalHeight;

    let svg = "";

    // Render cards in reverse order so first card is on top
    const reversedData = this.data.slice(0, maxItems).reverse();

    reversedData.forEach((item, reverseIndex) => {
      const index = maxItems - 1 - reverseIndex;
      const color = item.color || this.colors[index % this.colors.length];
      const pos = positions[index];
      const path = paths[index];

      const tx = pos.x * scaleX;
      const ty = pos.y * scaleY;

      // Calculate label positions based on card dimensions
      const labelY = index === 0 ? 90 : index === 1 ? 75 : 55;

      // Card shape
      svg += `
        <g transform="translate(${tx}, ${ty}) scale(${scaleX}, ${scaleY})">
          <path d="${path}" fill="${color}" stroke="#ffffff" stroke-width="2"
                stroke-linejoin="round" stroke-linecap="round" opacity="0.95"/>
      `;

      // Calculate contrasting text color
      const labelColor = this.resolveTextColor
        ? this.resolveTextColor(color)
        : ColorUtils.getContrastingColor(color, false);
      const descColor = this.resolveTextColor
        ? this.resolveTextColor(color, true, labelColor)
        : ColorUtils.getContrastingColor(color, true);

      // Label - 主标题
      svg += `
          <text x="${index === 0 ? 118 : 112}" y="${labelY}" text-anchor="middle"
                dominant-baseline="middle" fill="${labelColor}"
                font-size="${Math.max(14, 18 / scaleX)}" font-weight="700">
            ${this.escapeHtml(item.label)}
          </text>
      `;

      // Description - 次级文字
      if (item.description) {
        svg += `
          <text x="${index === 0 ? 118 : 112}" y="${labelY + 20}" text-anchor="middle"
                dominant-baseline="middle" fill="${descColor}"
                font-size="${Math.max(11, 14 / scaleX)}">
            ${this.escapeHtml(item.description)}
          </text>
        `;
      }

      svg += `</g>`;
    });

    return svg;
  }

  /**
   * Generate full SVG
   */
  generate() {
    const content = this.generateChart();

    return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Comparison Overlapping Cards Chart">
  <title>Comparison Overlapping Cards Chart</title>
  <desc>Overlapping cards for feature comparison</desc>
  ${content}
</svg>`.trim();
  }
}

// Export
if (typeof window !== "undefined") {
  window.ComparisonOverlappingCards = ComparisonOverlappingCards;
}


// ========== charts/ComparisonPodiumTrophies.js ==========
/**
 * Comparison Podium Trophies Chart - Vanilla JavaScript
 * Based on chart_comparison_podium_trophies.html (原 chart_06)
 *
 * 特征: 垂直的奖杯/灯泡领奖台柱状结构
 * - 3个高度不同的柱子（领奖台）
 * - 顶部有奖杯装饰
 * - 底部有基座
 * - 使用原始 SVG paths 保证真实形状
 * - 尺寸: 768×600
 */

class ComparisonPodiumTrophies {
  constructor(config) {
    this.data = config.data || [];
    this.colors = config.colors || ["#ff4d4f", "#fa8c16", "#fadb14"];
    this.width = config.width || 768;
    this.height = config.height || 600;
    this.showTrophy =
      config.showTrophy !== undefined ? config.showTrophy : true;
    this.showBase = config.showBase !== undefined ? config.showBase : true;
  }

  /**
   * Trophy SVG paths
   */
  getTrophyPaths() {
    return {
      cup: `M 27.438923 10C 27.261423 12.1445 27.132223 14.3207 27.053423 16.524C 20.608723 17.0975 15.114623 19.7017 12.165123 24.1687C 6.412123 32.8817 12.518823 45.3823 25.805023 52.0895C 27.485123 52.9377 29.199623 53.6526 30.924523 54.2368C 37.027323 77.826 49.546923 94 63.999923 94C 78.453023 94 90.972523 77.826 97.075323 54.2369C 98.800323 53.6527 100.514923 52.9377 102.195023 52.0895C 115.481223 45.3823 121.587923 32.8817 115.834923 24.1687C 112.885423 19.7017 107.391223 17.0975 100.946523 16.524C 100.867723 14.3207 100.738523 12.1445 100.561023 10L 27.438923 10ZM 98.269823 49.1357C 100.053723 40.6581 101.037623 31.3728 101.037623 21.6385C 101.037623 21.5693 101.037523 21.5001 101.037423 21.4309C 105.013323 22.2059 108.331523 24.0846 110.249023 26.9886C 114.666223 33.6785 109.977423 43.2765 99.776323 48.4264C 99.277723 48.6781 98.775223 48.9145 98.269823 49.1357ZM 17.751023 26.9886C 19.668523 24.0846 22.986623 22.206 26.962523 21.4309L 26.962323 21.6385C 26.962323 31.3728 27.946123 40.6581 29.730123 49.1357C 29.224723 48.9144 28.722223 48.678 28.223723 48.4264C 18.022623 43.2765 13.333823 33.6785 17.751023 26.9886Z`,
      stem: `M 52.000023 90.182861C 55.763423 92.699461 60.800023 93.999961 64.999923 93.999961C 69.199923 93.999961 72.236623 93.016661 76.000023 90.499961L 76.000023 105.999961L 88.000023 117.999961L 40.000023 117.999961L 52.000023 105.999961L 52.000023 90.182861Z`,
      base: `M 34.000023 118L 94.000023 118L 94.000023 142L 34.000023 142L 34.000023 118Z`,
    };
  }

  /**
   * Column dimensions
   */
  getColumnPaths() {
    return [
      { path: `M 10 10L 226 10L 226 250L 10 250L 10 10Z`, height: 250 }, // Rank 1 (tallest)
      { path: `M 10 10L 226 10L 226 214L 10 214L 10 10Z`, height: 214 }, // Rank 2 (medium)
      { path: `M 10 10L 226 10L 226 178L 10 178L 10 10Z`, height: 178 }, // Rank 3 (shortest)
    ];
  }

  getPositions() {
    return [
      { x: 266, y: 266, rank: 1 }, // Center (rank 1 - tallest)
      { x: 26, y: 302, rank: 2 }, // Left (rank 2 - medium)
      { x: 506, y: 338, rank: 3 }, // Right (rank 3 - shortest)
    ];
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
  }

  /**
   * Generate chart
   */
  generateChart() {
    const originalWidth = 768;
    const originalHeight = 600;
    const scaleX = this.width / originalWidth;
    const scaleY = this.height / originalHeight;

    const columns = this.getColumnPaths();
    const positions = this.getPositions();
    const trophyPaths = this.getTrophyPaths();
    const trophyOffset = { x: 53.999969, y: -132 }; // Relative to rank 1 column

    let svg = "";

    // Sort data by rank if provided
    const maxItems = Math.min(this.data.length, 3);
    const sortedData = this.data.slice(0, maxItems).sort((a, b) => {
      const rankA = a.rank || 999;
      const rankB = b.rank || 999;
      return rankA - rankB;
    });

    sortedData.forEach((item, index) => {
      const rank = item.rank || index + 1;
      const posIndex = rank - 1;
      if (posIndex < 0 || posIndex >= positions.length) return;

      const pos = positions[posIndex];
      const column = columns[posIndex];
      const color = item.color || this.colors[index % this.colors.length];

      const tx = pos.x * scaleX;
      const ty = pos.y * scaleY;

      // Calculate contrasting text color (text is inside colored column)
      const labelColor = this.resolveTextColor
        ? this.resolveTextColor(color)
        : ColorUtils.getContrastingColor(color, false);

      // Column
      svg += `
        <g transform="translate(${tx}, ${ty}) scale(${scaleX}, ${scaleY})">
          <path d="${column.path}" fill="${color}" stroke="#ffffff" stroke-width="2"
                stroke-linejoin="round" stroke-linecap="round" opacity="0.9"/>

          <!-- Label -->
          <text x="118" y="${column.height / 2}" text-anchor="middle" dominant-baseline="middle"
                fill="${labelColor}" font-size="${Math.max(16, 20 / scaleX)}" font-weight="700">
            ${this.escapeHtml(item.label)}
          </text>

          <!-- Rank badge -->
          <text x="118" y="30" text-anchor="middle" dominant-baseline="middle"
                fill="${this.resolveTextColor ? this.resolveTextColor(color, true, labelColor) : labelColor}" font-size="${Math.max(24, 32 / scaleX)}"
                font-weight="900" opacity="0.4">
            #${rank}
          </text>
        </g>
      `;

      // Trophy (only for rank 1)
      if (this.showTrophy && rank === 1) {
        const trophyX = (pos.x + trophyOffset.x) * scaleX;
        const trophyY = (pos.y + trophyOffset.y) * scaleY;

        svg += `
          <g transform="translate(${trophyX}, ${trophyY}) scale(${scaleX}, ${scaleY})">
            <path d="${trophyPaths.cup}" fill="${color}" stroke="#ffffff" stroke-width="2"
                  stroke-linejoin="round" stroke-linecap="round" opacity="0.95"/>
            <path d="${trophyPaths.stem}" fill="${color}" stroke="#ffffff" stroke-width="2"
                  stroke-linejoin="round" stroke-linecap="round" opacity="0.95"/>
            ${
              this.showBase
                ? `
              <path d="${trophyPaths.base}" fill="${color}" stroke="#ffffff" stroke-width="2"
                    stroke-linejoin="round" stroke-linecap="round" opacity="0.95"/>
            `
                : ""
            }
          </g>
        `;
      }
    });

    return svg;
  }

  /**
   * Generate full SVG
   */
  generate() {
    const content = this.generateChart();

    return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Comparison Podium Trophies Chart">
  <title>Comparison Podium Trophies Chart</title>
  <desc>Podium with trophies for ranking comparison</desc>
  ${content}
</svg>`.trim();
  }
}

// Export
if (typeof window !== "undefined") {
  window.ComparisonPodiumTrophies = ComparisonPodiumTrophies;
}


// ========== charts/DecisionBranching.js ==========
/**
 * Decision Branching Chart - Vanilla JavaScript
 * Tree structure with branches showing decision paths
 */

class DecisionBranching {
  constructor(config) {
    this.data = config.data || [];
    this.colors = config.colors || [
      "#7862d1",
      "#4f92ff",
      "#3cc583",
      "#de8431",
      "#e0cb15",
    ];
    this.width = config.width || 600;
    this.height = config.height || 400;
    this.textColor = config.textColor || "#484848";
    this.branchCount = config.branchCount || 2;
    this.onItemClick = config.onItemClick;
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
  }

  /**
   * Get node position
   */
  getNodePosition(index) {
    const centerX = this.width / 2;
    const levelHeight = this.height * 0.25;
    const startY = this.height * 0.15;

    if (index === 0) {
      // Root node
      return { x: centerX, y: startY, level: 0 };
    } else if (index <= this.branchCount) {
      // Level 1 branches
      const branchIndex = index - 1;
      const totalWidth = this.width * 0.6;
      const branchSpacing = totalWidth / Math.max(this.branchCount - 1, 1);
      const x =
        this.branchCount > 1
          ? centerX - totalWidth / 2 + branchIndex * branchSpacing
          : centerX;
      return { x, y: startY + levelHeight, level: 1 };
    } else {
      // Level 2 branches
      const level2Index = index - this.branchCount - 1;
      const parentBranch = Math.floor(level2Index / this.branchCount);
      const childIndex = level2Index % this.branchCount;

      const parentPos = this.getNodePosition(parentBranch + 1);
      const branchSpread = this.width * 0.15;
      const x =
        this.branchCount > 1
          ? parentPos.x - branchSpread / 2 + childIndex * branchSpread
          : parentPos.x;
      return { x, y: startY + levelHeight * 2, level: 2 };
    }
  }

  /**
   * Get parent node index
   */
  getParentIndex(index) {
    if (index === 0) return null;
    if (index <= this.branchCount) return 0;
    const level2Index = index - this.branchCount - 1;
    const parentBranch = Math.floor(level2Index / this.branchCount);
    return parentBranch + 1;
  }

  /**
   * Generate the chart
   */
  generateChart() {
    const maxNodes = 1 + this.branchCount + this.branchCount * this.branchCount;
    const numItems = Math.min(this.data.length, maxNodes);
    const nodeRadius = Math.min(this.width, this.height) * 0.04;

    let svg = "";

    // Draw connecting lines first (so they appear behind nodes)
    for (let i = 0; i < numItems; i++) {
      const parentIndex = this.getParentIndex(i);
      if (parentIndex === null) continue;

      const nodePos = this.getNodePosition(i);
      const parentPos = this.getNodePosition(parentIndex);

      svg += `
        <line x1="${parentPos.x}" y1="${parentPos.y + nodeRadius}"
              x2="${nodePos.x}" y2="${nodePos.y - nodeRadius}"
              stroke="${this.textColor}33"
              stroke-width="2"
              stroke-linecap="round"/>
      `;
    }

    // Draw nodes
    this.data.slice(0, numItems).forEach((item, index) => {
      const pos = this.getNodePosition(index);
      const color = item.color || this.colors[index % this.colors.length];

      // Node circle
      svg += `
        <circle cx="${pos.x}" cy="${pos.y}"
                r="${nodeRadius}"
                fill="${color}"
                stroke="${this.textColor}33"
                stroke-width="2"/>
      `;

      // Label
      const labelText =
        item.label.length > 10 ? item.label.slice(0, 10) + "..." : item.label;

      svg += `
        <text x="${pos.x}" y="${pos.y + nodeRadius + this.height * 0.06}"
              text-anchor="middle"
              dominant-baseline="hanging"
              fill="${this.textColor}"
              font-size="${Math.max(9, this.width * 0.018)}"
              font-weight="600">
          ${this.escapeHtml(labelText)}
        </text>
      `;

      // Value indicator inside node (if provided)
      if (item.value !== undefined && nodeRadius > this.width * 0.03) {
        const textColor = this.resolveTextColor
          ? this.resolveTextColor(color)
          : ColorUtils.getContrastingColor(color);
        svg += `
          <text x="${pos.x}" y="${pos.y}"
                text-anchor="middle"
                dominant-baseline="middle"
                fill="${textColor}"
                font-size="${Math.max(8, this.width * 0.016)}"
                font-weight="700">
            ${this.escapeHtml(String(item.value))}
          </text>
        `;
      }

      // Description
      if (item.description && pos.level < 2 && this.width > 350) {
        const descColor = this.textColor + "99"; // 60% opacity
        svg += `
          <text x="${pos.x}" y="${pos.y + nodeRadius + this.height * 0.1}"
                text-anchor="middle"
                dominant-baseline="hanging"
                fill="${descColor}"
                font-size="${Math.max(8, this.width * 0.015)}">
            ${this.escapeHtml(item.description)}
          </text>
        `;
      }
    });

    return svg;
  }

  /**
   * Generate full SVG
   */
  generate() {
    const content = this.generateChart();

    return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Decision Branching Chart">
  <title>Decision Branching Chart</title>
  <desc>Tree structure with branches showing decision paths</desc>
  ${content}
</svg>`.trim();
  }
}

// Export
if (typeof window !== "undefined") {
  window.DecisionBranching = DecisionBranching;
}


// ========== charts/DistributionDonut.js ==========
/**
 * Distribution Donut Chart - PowerPoint SmartArt RADIAL_CYCLE Style
 * Pie chart with curved arrows on outer edge showing cycle flow
 * Matches PowerPoint SmartArt rendering
 */

class DistributionDonut {
  constructor(config) {
    this.data = config.data || [];
    this.colors = config.colors || [
      "#C0504D", // Red
      "#9BBB59", // Green
      "#8064A2", // Purple
      "#4BACC6", // Cyan
      "#F79646", // Orange
    ];
    this.width = config.width || 720;
    this.height = config.height || 540;
    this.textColor = config.textColor || "#FFFFFF";
    this.showArrows = config.showArrows !== undefined ? config.showArrows : true;
    this.onItemClick = config.onItemClick;
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
  }

  /**
   * Convert polar coordinates to cartesian
   */
  polarToCartesian(cx, cy, radius, angleInDegrees) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: cx + radius * Math.cos(angleInRadians),
      y: cy + radius * Math.sin(angleInRadians),
    };
  }

  /**
   * Create pie slice path (PowerPoint style - from center)
   */
  createSlicePath(cx, cy, radius, startAngle, endAngle) {
    const start = this.polarToCartesian(cx, cy, radius, startAngle);
    const end = this.polarToCartesian(cx, cy, radius, endAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M", cx, cy,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y,
      "Z"
    ].join(" ");
  }

  /**
   * Generate curved arrow path for outer edge (PowerPoint RADIAL_CYCLE style)
   * Arrow follows the arc outside the slice and points to the next slice
   */
  generateOuterArrow(cx, cy, innerRadius, outerRadius, startAngle, endAngle, color) {
    // Arrow arc runs along outer edge
    const arrowInner = innerRadius;
    const arrowOuter = outerRadius;

    // Start and end points for outer arc
    const outerStart = this.polarToCartesian(cx, cy, arrowOuter, startAngle);
    const outerEnd = this.polarToCartesian(cx, cy, arrowOuter, endAngle);
    const innerStart = this.polarToCartesian(cx, cy, arrowInner, startAngle);
    const innerEnd = this.polarToCartesian(cx, cy, arrowInner, endAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    // Arrow body (curved band)
    const arrowPath = [
      "M", outerStart.x, outerStart.y,
      "A", arrowOuter, arrowOuter, 0, largeArcFlag, 1, outerEnd.x, outerEnd.y,
      "L", innerEnd.x, innerEnd.y,
      "A", arrowInner, arrowInner, 0, largeArcFlag, 0, innerStart.x, innerStart.y,
      "Z"
    ].join(" ");

    // Arrowhead at end - triangular pointer
    const midRadius = (arrowInner + arrowOuter) / 2;
    const arrowTipAngle = endAngle + 8; // Extend beyond slice
    const arrowBackAngle = endAngle - 5;

    const arrowTip = this.polarToCartesian(cx, cy, midRadius, arrowTipAngle);
    const arrowBack1 = this.polarToCartesian(cx, cy, arrowOuter + 5, arrowBackAngle);
    const arrowBack2 = this.polarToCartesian(cx, cy, arrowInner - 5, arrowBackAngle);

    const arrowHeadPath = [
      "M", arrowTip.x, arrowTip.y,
      "L", arrowBack1.x, arrowBack1.y,
      "L", arrowBack2.x, arrowBack2.y,
      "Z"
    ].join(" ");

    return { arrowPath, arrowHeadPath };
  }

  /**
   * Generate the chart - PowerPoint RADIAL_CYCLE style
   */
  generateChart() {
    const numItems = Math.min(this.data.length, 8);
    if (numItems === 0) return "";

    const centerX = this.width * 0.5;
    const centerY = this.height * 0.5;
    const radius = Math.min(this.width, this.height) * 0.4;

    // Equal slices for RADIAL_CYCLE style
    const sliceAngle = 360 / numItems;

    let svg = "";
    const slices = [];

    // First pass: draw all pie slices
    for (let i = 0; i < numItems; i++) {
      const item = this.data[i];
      const color = item.color || this.colors[i % this.colors.length];
      const startAngle = i * sliceAngle;
      const endAngle = (i + 1) * sliceAngle;

      // Create pie slice
      const path = this.createSlicePath(centerX, centerY, radius, startAngle, endAngle);

      svg += `
        <path d="${path}"
              fill="${color}"
              stroke="#FFFFFF"
              stroke-width="2"/>
      `;

      slices.push({ startAngle, endAngle, color });
    }

    // Second pass: draw outer arrows (PowerPoint style)
    if (this.showArrows) {
      const arrowInner = radius + 5;
      const arrowOuter = radius + 25;

      for (let i = 0; i < numItems; i++) {
        const { startAngle, endAngle, color } = slices[i];

        // Arrow covers most of the slice arc, pointing clockwise
        const arrowStart = startAngle + 5;
        const arrowEnd = endAngle - 5;

        const { arrowPath, arrowHeadPath } = this.generateOuterArrow(
          centerX, centerY,
          arrowInner, arrowOuter,
          arrowStart, arrowEnd,
          color
        );

        svg += `
          <path d="${arrowPath}" fill="${color}"/>
          <path d="${arrowHeadPath}" fill="${color}"/>
        `;
      }
    }

    // Third pass: add labels inside slices
    for (let i = 0; i < numItems; i++) {
      const item = this.data[i];
      const startAngle = i * sliceAngle;
      const midAngle = startAngle + sliceAngle / 2;

      // Label position inside slice
      const labelRadius = radius * 0.55;
      const labelPos = this.polarToCartesian(centerX, centerY, labelRadius, midAngle);

      const fontSize = Math.max(14, Math.min(24, this.width * 0.035));
      const labelText = item.label || `Item ${i + 1}`;

      // Multi-line text support
      const lines = labelText.split(' ').reduce((acc, word) => {
        if (acc.length === 0) return [word];
        const lastLine = acc[acc.length - 1];
        if (lastLine.length + word.length < 8) {
          acc[acc.length - 1] = lastLine + ' ' + word;
        } else {
          acc.push(word);
        }
        return acc;
      }, []);

      const lineHeight = fontSize * 1.3;
      const startY = labelPos.y - ((lines.length - 1) * lineHeight) / 2;

      lines.forEach((line, lineIndex) => {
        svg += `
          <text x="${labelPos.x}" y="${startY + lineIndex * lineHeight}"
                text-anchor="middle"
                dominant-baseline="middle"
                fill="${this.textColor}"
                font-size="${fontSize}"
                font-weight="600"
                font-family="Arial, sans-serif">
            ${this.escapeHtml(line)}
          </text>
        `;
      });
    }

    return svg;
  }

  /**
   * Generate full SVG
   */
  generate() {
    const content = this.generateChart();

    return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Radial Cycle Chart">
  <title>Radial Cycle Chart</title>
  <desc>Pie chart with outer arrows (PowerPoint RADIAL_CYCLE style)</desc>
  <rect x="0" y="0" width="${this.width}" height="${this.height}" fill="#FFFFFF"/>
  ${content}
</svg>`.trim();
  }
}

// Export
if (typeof window !== "undefined") {
  window.DistributionDonut = DistributionDonut;
}


// ========== charts/EdgeAnalysis.js ==========
/**
 * Edge Analysis Chart - Vanilla JavaScript
 * Hexagonal network showing multi-dimensional analysis
 *
 * Usage:
 * const chart = new EdgeAnalysis({
 *   data: [
 *     {label: 'Planning'},
 *     {label: 'Execution'},
 *     {label: 'Strategy'}
 *   ],
 *   colors: ['#d1f4ff', '#e7e1ff', '#ffd7ef'],
 *   width: 768,
 *   height: 756
 * });
 * const svg = chart.generate();
 */

class EdgeAnalysis {
  constructor(config) {
    this.data = config.data || [];
    this.colors = config.colors || [
      "#e7e1ff",
      "#dce9ff",
      "#d1f4ff",
      "#fff8b6",
      "#c8ffe5",
    ];
    this.width = config.width || 768;
    this.height = config.height || 756;
    this.textColor = config.textColor || "#484848"; // Theme text color for labels outside shapes
  }

  /**
   * Original SVG paths from chart_11
   */
  getPaths() {
    return {
      // Hexagon from chart_11 line 61 (large)
      hexagonLarge: `M 134 112L 103 166L 41 166L 10 112L 41 58L 103 58L 134 112Z`,

      // Hexagon from chart_11 line 177 (medium)
      hexagonMedium: `M 134 64L 103 118L 41 118L 10 64L 41 10L 103 10L 134 64`,

      // Indicator circle (top position)
      indicatorTop: `M 66 16C 66 19.313709 68.686292 22 72 22C 75.313709 22 78 19.313709 78 16C 78 12.686292 75.313709 10 72 10C 68.686292 10 66 12.686292 66 16`,

      // Indicator circle (bottom position)
      indicatorBottom: `M 66 160C 66 163.313709 68.686292 166 72 166C 75.313709 166 78 163.313709 78 160C 78 156.686292 75.313709 154 72 154C 68.686292 154 66 156.686292 66 160`,
    };
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
  }

  /**
   * Get hexagon positions in a network layout
   * Based on chart_11 positions: (72,272), (168,386), (264,272), (360,386), (456,272), (552,386)
   */
  getHexagonPositions() {
    const count = this.data.length;

    // Scale based on original chart dimensions (768x756)
    const originalWidth = 768;
    const originalHeight = 756;
    const scaleX = this.width / originalWidth;
    const scaleY = this.height / originalHeight;

    if (count <= 3) {
      // Simple horizontal layout for 1-3 items
      const spacing = this.width * 0.3;
      const startX = (this.width - (count - 1) * spacing) / 2;
      const centerY = this.height * 0.5;

      return this.data.map((_, index) => ({
        x: startX + index * spacing,
        y: centerY,
        type: "large",
      }));
    } else {
      // Staggered rows for 4+ items (like chart_11)
      // Original pattern: row1 at y=272, row2 at y=386
      const row1Y = 272 * scaleY;
      const row2Y = 386 * scaleY;
      const startX = 72 * scaleX;
      const spacing = 96 * scaleX;

      return this.data.map((_, index) => ({
        x: startX + Math.floor(index / 2) * spacing * 2,
        y: index % 2 === 0 ? row1Y : row2Y,
        type: index % 2 === 0 ? "large" : "medium",
      }));
    }
  }

  /**
   * Generate connection lines
   */
  generateConnections() {
    let svg = "";
    const positions = this.getHexagonPositions();

    // Connect adjacent hexagons
    positions.forEach((pos, index) => {
      if (index < positions.length - 1) {
        const nextPos = positions[index + 1];
        const strokeWidth = Math.max(2, this.width * 0.003);

        // Main stroke
        svg += `
          <path d="M ${pos.x} ${pos.y} L ${nextPos.x} ${nextPos.y}"
                fill="none" stroke="#484848" stroke-width="${strokeWidth}"
                stroke-linecap="round" stroke-linejoin="round"/>
        `;

        // Animated overlay stroke
        svg += `
          <path d="M ${pos.x} ${pos.y} L ${nextPos.x} ${nextPos.y}"
                fill="none" stroke="#ffffff25" stroke-width="${strokeWidth}"
                stroke-linecap="round" stroke-linejoin="round"
                stroke-dasharray="4,6">
            <animate attributeName="stroke-dashoffset" values="30;0" dur="1s" repeatCount="indefinite"/>
          </path>
        `;
      }
    });

    return svg;
  }

  /**
   * Generate hexagon with letter
   */
  generateHexagon(item, index, position) {
    const paths = this.getPaths();
    const color = item.color || this.colors[index % this.colors.length];
    const hexPath =
      position.type === "large" ? paths.hexagonLarge : paths.hexagonMedium;

    // Original hexagon dimensions
    const originalWidth = 144;
    const originalHeight = position.type === "large" ? 224 : 176;

    // Scale to fit
    const hexRadius = Math.min(this.width, this.height) * 0.11;
    const scale = (hexRadius * 2) / originalWidth;

    const hexCenterX = originalWidth / 2;
    const hexCenterY = originalHeight / 2;

    const displayChar = item.label.charAt(0).toUpperCase();
    const charFontSize = Math.max(24, hexRadius * 0.65);
    const labelFontSize = Math.max(11, this.width * 0.018);

    let svg = `
      <g transform="translate(${position.x - hexCenterX * scale}, ${position.y - hexCenterY * scale}) scale(${scale}, ${scale})">
        <!-- Fill -->
        <path d="${hexPath}" fill="${color}" stroke="none"/>

        <!-- Stroke -->
        <path d="${hexPath}" fill="none" stroke="#ffffff" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"/>

        <!-- Indicator circle -->
        <path d="${position.type === "large" ? paths.indicatorTop : paths.indicatorBottom}"
              fill="${color}" stroke="none"/>
      </g>

      <!-- Letter -->
      <text x="${position.x}" y="${position.y + charFontSize * 0.35}" text-anchor="middle"
            fill="${this.resolveTextColor ? this.resolveTextColor(color) : ColorUtils.getContrastingColor(color, false)}" font-size="${charFontSize}" font-weight="700" font-family="Arial, sans-serif">
        ${this.escapeHtml(displayChar)}
      </text>
    `;

    // Label below hexagon
    if (this.width > 400) {
      const labelY = position.y + hexRadius * 1.3;
      svg += `
        <text x="${position.x}" y="${labelY + labelFontSize * 0.35}" text-anchor="middle"
              fill="${this.textColor}" font-size="${labelFontSize}" font-weight="600">
          ${this.escapeHtml(item.label.length > 12 && this.width < 500 ? item.label.slice(0, 10) + "..." : item.label)}
        </text>
      `;
    }

    return svg;
  }

  /**
   * Generate chart
   */
  generateChart() {
    let svg = "";
    const positions = this.getHexagonPositions();

    // Draw connections first (so hexagons are on top)
    svg += this.generateConnections();

    // Draw hexagons
    this.data.forEach((item, index) => {
      svg += this.generateHexagon(item, index, positions[index]);
    });

    return svg;
  }

  /**
   * Generate full SVG
   */
  generate() {
    const content = this.generateChart();

    return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Edge Analysis Chart">
  <title>Edge Analysis Chart</title>
  <desc>A hexagonal network chart showing multi-dimensional project analysis</desc>
  ${content}
</svg>`.trim();
  }
}

// Export
if (typeof window !== "undefined") {
  window.EdgeAnalysis = EdgeAnalysis;
}


// ========== charts/EdgeCircularPetals.js ==========
/**
 * Edge Analysis - Circular Petals Chart - Vanilla JavaScript
 * Based on chart_edge_circular_petals.html (原 chart_15)
 *
 * Features:
 * - Center circle
 * - Surrounding elliptical petal regions
 * - Petals connected to center with lines
 * - Original dimensions: 984×672
 */

class EdgeCircularPetals {
  constructor(config) {
    this.data = config.data || [];
    this.colors = config.colors || [
      "#7862d1",
      "#4f92ff",
      "#3cc583",
      "#de8431",
      "#ff6b6b",
      "#ffd93d",
    ];
    this.width = config.width || 984;
    this.height = config.height || 672;
    this.textColor = config.textColor || "#484848";
    this.showCenter =
      config.showCenter !== undefined ? config.showCenter : true;
    this.centerLabel = config.centerLabel || "";
    this.onItemClick = config.onItemClick;
  }

  /**
   * Petal shape path
   */
  getPetalPath() {
    return `M 99.577169 34.007969C 112.832069 56.966069 104.966069 86.322369 82.007969 99.577169C 59.049969 112.832069 29.693569 104.966069 16.438769 82.007969C 3.183969 59.049969 11.049969 29.693569 34.007969 16.438769C 56.966069 3.183969 86.322369 11.049969 99.577169 34.007969Z`;
  }

  /**
   * Center circle path
   */
  getCenterCirclePath() {
    return `M 58 10C 84.5097 10 106 31.4903 106 58C 106 84.5097 84.5097 106 58 106C 31.4903 106 10 84.5097 10 58C 10 31.4903 31.4903 10 58 10Z`;
  }

  /**
   * Original petal positions
   */
  getPetalPositions() {
    return [
      { x: 481.9989929199219, y: 151.69602966308594 }, // top-right
      { x: 518.3699951171875, y: 292 }, // right
      { x: 481.9989929199219, y: 360.99798583984375 }, // bottom-right
      { x: 352.9920349121094, y: 360.99798583984375 }, // bottom-left
      { x: 272, y: 292 }, // left
      { x: 352.9920349121094, y: 151.69602966308594 }, // top-left
    ];
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
  }

  /**
   * Generate the chart
   */
  generateChart() {
    const ORIGINAL_WIDTH = 984;
    const ORIGINAL_HEIGHT = 672;
    const CENTER_X = 330;
    const CENTER_Y = 256;
    const maxItems = 6;
    const numItems = Math.min(this.data.length, maxItems);

    const scaleX = this.width / ORIGINAL_WIDTH;
    const scaleY = this.height / ORIGINAL_HEIGHT;

    const petalPath = this.getPetalPath();
    const centerCirclePath = this.getCenterCirclePath();
    const petalPositions = this.getPetalPositions();

    let svg = "";

    // Connection lines from center to petals
    this.data.slice(0, numItems).forEach((item, index) => {
      const pos = petalPositions[index];
      const petalCenterX = (pos.x + 58) * scaleX;
      const petalCenterY = (pos.y + 58) * scaleY;
      const centerX = (CENTER_X + 58) * scaleX;
      const centerY = (CENTER_Y + 58) * scaleY;

      svg += `
        <line
          x1="${centerX}"
          y1="${centerY}"
          x2="${petalCenterX}"
          y2="${petalCenterY}"
          stroke="${this.textColor}"
          stroke-width="2"
          opacity="0.3"/>
      `;
    });

    // Petals
    this.data.slice(0, numItems).forEach((item, index) => {
      const pos = petalPositions[index];
      const color = item.color || this.colors[index % this.colors.length];
      const primaryTextColor = this.resolveTextColor
        ? this.resolveTextColor(color)
        : this.textColor;
      const secondaryTextColor = this.resolveTextColor
        ? this.resolveTextColor(color, true, primaryTextColor)
        : this.textColor;

      const tx = pos.x * scaleX;
      const ty = pos.y * scaleY;

      svg += `
        <g transform="translate(${tx}, ${ty}) scale(${scaleX}, ${scaleY})">
          <!-- Petal shape -->
          <path
            d="${petalPath}"
            fill="${color}"
            stroke="${this.textColor}"
            stroke-width="2"
            stroke-linejoin="round"
            stroke-linecap="round"
            opacity="0.9"/>

          <!-- Label -->
          <text
            x="58"
            y="58"
            text-anchor="middle"
            dominant-baseline="middle"
            fill="${primaryTextColor}"
            font-size="${Math.max(14, 18 / scaleX)}"
            font-weight="700">
            ${this.escapeHtml(item.label)}
          </text>
      `;

      // Description
      if (item.description) {
        svg += `
          <text
            x="58"
            y="78"
            text-anchor="middle"
            dominant-baseline="middle"
            fill="${secondaryTextColor}"
            font-size="${Math.max(11, 14 / scaleX)}"
            opacity="0.9">
            ${this.escapeHtml(item.description)}
          </text>
        `;
      }

      svg += `</g>`;
    });

    // Center circle
    if (this.showCenter) {
      const centerTx = CENTER_X * scaleX;
      const centerTy = CENTER_Y * scaleY;

      svg += `
        <g transform="translate(${centerTx}, ${centerTy}) scale(${scaleX}, ${scaleY})">
          <path
            d="${centerCirclePath}"
            fill="${this.textColor}"
            stroke="${this.textColor}"
            stroke-width="2"
            opacity="0.2"/>
      `;

      if (this.centerLabel) {
        svg += `
          <text
            x="58"
            y="58"
            text-anchor="middle"
            dominant-baseline="middle"
            fill="${this.textColor}"
            font-size="${Math.max(16, 20 / scaleX)}"
            font-weight="700">
            ${this.escapeHtml(this.centerLabel)}
          </text>
        `;
      }

      svg += `</g>`;
    }

    return svg;
  }

  /**
   * Generate full SVG
   */
  generate() {
    const content = this.generateChart();

    return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Edge Circular Petals Chart">
  <title>Edge Circular Petals Chart</title>
  <desc>Circular petals distributed around center</desc>
  ${content}
</svg>`.trim();
  }
}

// Export
if (typeof window !== "undefined") {
  window.EdgeCircularPetals = EdgeCircularPetals;
}


// ========== charts/EdgeHexagonNodes.js ==========
/**
 * Edge Hexagon Nodes Chart - PowerPoint SmartArt HEXAGON_CLUSTER Style
 * Vertical zigzag hexagon layout with gradient colors
 * Matches PowerPoint SmartArt rendering
 */

class EdgeHexagonNodes {
  constructor(config) {
    this.data = config.data || [];
    this.colors = config.colors || [
      "#9BBB59", // Green (top)
      "#70B85A",
      "#5CB46F",
      "#5DB195",
      "#5FA4AD",
      "#6181A9",
      "#6362A6",
      "#8064A2", // Purple (bottom)
    ];
    this.width = config.width || 720;
    this.height = config.height || 540;
    this.textColor = config.textColor || "#000000";
    this.showConnections =
      config.showConnections !== undefined ? config.showConnections : true;
    this.onItemClick = config.onItemClick;
  }

  /**
   * Generate hexagon path for given size
   * PowerPoint hexagons are rotated 90 degrees (pointy top)
   */
  getHexagonPath(cx, cy, size) {
    const angle = Math.PI / 3; // 60 degrees
    const points = [];
    for (let i = 0; i < 6; i++) {
      const a = angle * i - Math.PI / 2; // Start from top
      points.push({
        x: cx + size * Math.cos(a),
        y: cy + size * Math.sin(a),
      });
    }
    return `M ${points.map((p) => `${p.x} ${p.y}`).join(" L ")} Z`;
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
  }

  /**
   * Generate the chart - PowerPoint HEXAGON_CLUSTER style
   * Vertical zigzag layout with labels on right
   */
  generateChart() {
    const numItems = Math.min(this.data.length, 8);
    if (numItems === 0) return "";

    // Hexagon sizing
    const hexSize = Math.min(this.width, this.height) * 0.12;
    const hexWidth = hexSize * 2;
    const hexHeight = hexSize * Math.sqrt(3);

    // Layout: zigzag pattern (left-right alternating going down)
    // Column 1 (left): items 0, 2, 4, 6
    // Column 2 (right): items 1, 3, 5, 7
    const col1X = this.width * 0.25;
    const col2X = this.width * 0.45;
    const startY = this.height * 0.15;
    const rowSpacing = hexHeight * 0.85;

    // Label area
    const labelStartX = this.width * 0.58;

    let svg = "";

    // Render hexagons
    for (let i = 0; i < numItems; i++) {
      const item = this.data[i];
      const color = item.color || this.colors[i % this.colors.length];

      // Position calculation - zigzag
      const isLeftCol = i % 2 === 0;
      const rowIndex = Math.floor(i / 2);
      const cx = isLeftCol ? col1X : col2X;
      const cy = startY + rowIndex * rowSpacing + (isLeftCol ? 0 : rowSpacing * 0.5);

      // Hexagon path
      const hexPath = this.getHexagonPath(cx, cy, hexSize);

      // Draw hexagon with white stroke (PowerPoint style)
      svg += `
        <path d="${hexPath}"
              fill="${color}"
              stroke="#FFFFFF"
              stroke-width="2"/>
      `;

      // Label inside hexagon (centered, short text)
      const labelInside = item.label.length <= 8 ? item.label : "";
      if (labelInside) {
        svg += `
          <text x="${cx}" y="${cy}"
                text-anchor="middle"
                dominant-baseline="middle"
                fill="#FFFFFF"
                font-size="${hexSize * 0.35}"
                font-weight="600"
                font-family="Arial, sans-serif">
            ${this.escapeHtml(labelInside)}
          </text>
        `;
      }
    }

    // Render labels on the right side (PowerPoint style)
    // First item is "Root", rest are hierarchical
    const labelTop = startY;
    const labelSpacing = (this.height * 0.7) / numItems;

    for (let i = 0; i < numItems; i++) {
      const item = this.data[i];
      const color = item.color || this.colors[i % this.colors.length];
      const labelY = labelTop + i * labelSpacing;

      // Determine indentation level
      const level = item.level !== undefined ? item.level : (i === 0 ? 0 : 1);
      const indent = level * 20;

      const fontSize = i === 0 ? 18 : 14;

      svg += `
        <text x="${labelStartX + indent}" y="${labelY}"
              text-anchor="start"
              dominant-baseline="middle"
              fill="${this.textColor}"
              font-size="${fontSize}"
              font-weight="${i === 0 ? '700' : '400'}"
              font-family="Arial, sans-serif">
          ${this.escapeHtml(item.label)}
        </text>
      `;

      // Description as sub-item
      if (item.description) {
        svg += `
          <text x="${labelStartX + indent + 15}" y="${labelY + fontSize * 1.3}"
                text-anchor="start"
                dominant-baseline="middle"
                fill="${this.textColor}"
                fill-opacity="0.7"
                font-size="${fontSize * 0.85}"
                font-family="Arial, sans-serif">
            • ${this.escapeHtml(item.description)}
          </text>
        `;
      }
    }

    return svg;
  }

  /**
   * Generate full SVG
   */
  generate() {
    const content = this.generateChart();

    return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Hexagon Cluster Chart">
  <title>Hexagon Cluster Chart</title>
  <desc>Vertical zigzag hexagon layout (PowerPoint HEXAGON_CLUSTER style)</desc>
  <rect x="0" y="0" width="${this.width}" height="${this.height}" fill="#FFFFFF"/>
  ${content}
</svg>`.trim();
  }
}

// Export
if (typeof window !== "undefined") {
  window.EdgeHexagonNodes = EdgeHexagonNodes;
}


// ========== charts/EdgeRectangularBoxes.js ==========
/**
 * Edge Analysis - Rectangular Boxes Chart - Vanilla JavaScript
 * Based on chart_edge_rectangular_boxes.html (原 chart_17)
 *
 * Features:
 * - Multiple three-layer stacked rectangular boxes
 * - Arranged horizontally
 * - Connection lines between boxes
 * - Circular connection points
 * - Letter labels in top layer
 * - Original dimensions: 1200×636
 */

class EdgeRectangularBoxes {
  constructor(config) {
    this.data = config.data || [];
    this.colors = config.colors || [
      "#7862d1",
      "#4f92ff",
      "#3cc583",
      "#de8431",
      "#ff6b6b",
      "#ffd93d",
    ];
    this.width = config.width || 1200;
    this.height = config.height || 636;
    this.textColor = config.textColor || "#484848";
    this.columns = config.columns || 6;
    this.showConnections =
      config.showConnections !== undefined ? config.showConnections : true;
    this.onItemClick = config.onItemClick;
  }

  /**
   * Three-layer stacked rectangles path
   */
  getBoxPath() {
    return `M 10 10L 178 10L 178 94L 10 94ZM 178 262L 10 262L 10 94L 178 94L 178 262ZM 178 418L 178 262L 10 262L 10 418L 94 418L 178 418Z`;
  }

  /**
   * Connection circle path
   */
  getConnectionCirclePath() {
    return `M 10 13C 10 14.656854 11.343146 16 13 16C 14.656854 16 16 14.656854 16 13C 16 11.343146 14.656854 10 13 10C 11.343146 10 10 11.343146 10 13`;
  }

  /**
   * Original box positions (6 columns)
   */
  getBoxPositions() {
    return [
      { x: 56, y: 134 }, // col 0
      { x: 236, y: 134 }, // col 1
      { x: 416, y: 134 }, // col 2
      { x: 596, y: 134 }, // col 3
      { x: 776, y: 134 }, // col 4
      { x: 956, y: 134 }, // col 5
    ];
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
  }

  /**
   * Generate the chart
   */
  generateChart() {
    const ORIGINAL_WIDTH = 1200;
    const ORIGINAL_HEIGHT = 636;
    const BOX_WIDTH = 188;
    const BOX_HEIGHT = 428;
    const maxItems = Math.min(this.data.length, 6);

    const scaleX = this.width / ORIGINAL_WIDTH;
    const scaleY = this.height / ORIGINAL_HEIGHT;

    const boxPath = this.getBoxPath();
    const connectionCirclePath = this.getConnectionCirclePath();
    const boxPositions = this.getBoxPositions();

    let svg = "";

    // Connection lines
    if (this.showConnections) {
      this.data.slice(0, maxItems).forEach((item, index) => {
        if (!item.connections) return;

        const from = boxPositions[index];

        item.connections.forEach((targetIndex) => {
          if (targetIndex >= maxItems) return;

          const to = boxPositions[targetIndex];

          // Calculate center points for middle layer
          const fromCenterX = (from.x + BOX_WIDTH / 2) * scaleX;
          const fromCenterY = (from.y + 178) * scaleY; // Middle of the middle layer
          const toCenterX = (to.x + BOX_WIDTH / 2) * scaleX;
          const toCenterY = (to.y + 178) * scaleY;

          svg += `
            <!-- Connection line -->
            <line
              x1="${fromCenterX}"
              y1="${fromCenterY}"
              x2="${toCenterX}"
              y2="${toCenterY}"
              stroke="${this.textColor}"
              stroke-width="2"
              opacity="0.4"/>

            <!-- Connection circle -->
            <g transform="translate(${toCenterX - 13 * scaleX}, ${toCenterY - 13 * scaleY}) scale(${scaleX}, ${scaleY})">
              <path
                d="${connectionCirclePath}"
                fill="${this.textColor}"
                opacity="0.6"/>
            </g>
          `;
        });
      });
    }

    // Rectangular boxes
    this.data.slice(0, maxItems).forEach((item, index) => {
      const pos = boxPositions[index];
      const color = item.color || this.colors[index % this.colors.length];
      const primaryTextColor = this.resolveTextColor
        ? this.resolveTextColor(color)
        : this.textColor;
      const secondaryTextColor = this.resolveTextColor
        ? this.resolveTextColor(color, true, primaryTextColor)
        : this.textColor;

      const tx = pos.x * scaleX;
      const ty = pos.y * scaleY;

      svg += `
        <g transform="translate(${tx}, ${ty}) scale(${scaleX}, ${scaleY})">
          <!-- Box -->
          <path
            d="${boxPath}"
            fill="${color}"
            stroke="${this.textColor}"
            stroke-width="2"
            stroke-linejoin="round"
            stroke-linecap="round"
            opacity="0.9"/>

          <!-- Label (top layer) -->
          <text
            x="94"
            y="52"
            text-anchor="middle"
            dominant-baseline="middle"
            fill="${primaryTextColor}"
            font-size="${Math.max(16, 20 / scaleX)}"
            font-weight="700">
            ${this.escapeHtml(item.label)}
          </text>
      `;

      // Description (if provided, shown in middle layer)
      if (item.description) {
        const desc =
          item.description.length > 15
            ? item.description.slice(0, 13) + "..."
            : item.description;

        svg += `
          <text
            x="94"
            y="178"
            text-anchor="middle"
            dominant-baseline="middle"
            fill="${secondaryTextColor}"
            font-size="${Math.max(12, 16 / scaleX)}"
            font-weight="600"
            opacity="0.9">
            ${this.escapeHtml(desc)}
          </text>
        `;
      }

      svg += `</g>`;
    });

    return svg;
  }

  /**
   * Generate full SVG
   */
  generate() {
    const content = this.generateChart();

    return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Edge Rectangular Boxes Chart">
  <title>Edge Rectangular Boxes Chart</title>
  <desc>Rectangular boxes network with connection lines</desc>
  ${content}
</svg>`.trim();
  }
}

// Export
if (typeof window !== "undefined") {
  window.EdgeRectangularBoxes = EdgeRectangularBoxes;
}


// ========== charts/FishboneDiagram.js ==========
/**
 * Fishbone Diagram Chart - Vanilla JavaScript
 * Cause-effect fishbone analysis structure (Ishikawa diagram)
 */

class FishboneDiagram {
  constructor(config) {
    this.data = config.data || [];
    this.colors = config.colors || [
      "#7862d1",
      "#4f92ff",
      "#3cc583",
      "#de8431",
      "#e0cb15",
      "#ba5de5",
    ];
    this.width = config.width || 600;
    this.height = config.height || 400;
    this.textColor = config.textColor || "#484848";
    this.onItemClick = config.onItemClick;
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
  }

  /**
   * Generate the chart
   */
  generateChart() {
    // Fishbone supports up to 6 main categories (3 top, 3 bottom)
    const maxItems = this.width < 768 ? 4 : Math.min(6, this.data.length);
    const numItems = Math.min(this.data.length, maxItems);

    // Layout calculations
    const spineStartX = this.width * 0.15; // Spine starts at 15% from left
    const spineEndX = this.width * 0.85; // Spine ends at 85%
    const spineY = this.height / 2; // Spine in middle
    const branchLength = this.height * 0.25; // Diagonal branch length
    const branchAngle = 45; // 45 degree angle for branches
    const branchAngleRad = (branchAngle * Math.PI) / 180;

    // Calculate branch positions along spine
    const spineLength = spineEndX - spineStartX;
    const branchSpacing = spineLength / (Math.ceil(numItems / 2) + 1);

    let svg = "";

    // Main spine (horizontal line) - using darker gray
    const spineColor = "#666666"; // Dark gray for main spine
    svg += `
      <line x1="${spineStartX}" y1="${spineY}"
            x2="${spineEndX}" y2="${spineY}"
            stroke="${spineColor}"
            stroke-width="4"
            stroke-linecap="round"/>
    `;

    // Arrowhead at end of spine
    svg += `
      <path d="M ${spineEndX} ${spineY}
              L ${spineEndX - 15} ${spineY - 8}
              M ${spineEndX} ${spineY}
              L ${spineEndX - 15} ${spineY + 8}"
            stroke="${spineColor}"
            stroke-width="4"
            stroke-linecap="round"
            fill="none"/>
    `;

    // Branches with labels
    this.data.slice(0, maxItems).forEach((item, index) => {
      const isTop = index % 2 === 0; // Alternate top/bottom
      const branchIndex = Math.floor(index / 2);
      const branchX = spineStartX + (branchIndex + 1) * branchSpacing;

      // Branch endpoint (diagonal)
      const branchEndX = branchX + branchLength * Math.cos(branchAngleRad);
      const branchEndY = isTop
        ? spineY - branchLength * Math.sin(branchAngleRad)
        : spineY + branchLength * Math.sin(branchAngleRad);

      // Use gray tones instead of colors for fishbone branches
      const branchColor = "#888888"; // Medium gray for branches
      const circleColor = "#999999"; // Slightly lighter gray for circles

      // Label position (perpendicular to branch)
      const labelX = branchEndX + 5;
      const labelY = branchEndY;

      // Diagonal branch
      svg += `
        <line x1="${branchX}" y1="${spineY}"
              x2="${branchEndX}" y2="${branchEndY}"
              stroke="${branchColor}"
              stroke-width="3"
              stroke-linecap="round"/>
      `;

      // Small circle at branch end
      svg += `
        <circle cx="${branchEndX}" cy="${branchEndY}"
                r="${this.width * 0.014}"
                fill="${circleColor}"
                stroke="${branchColor}"
                stroke-width="2"/>
      `;

      // Category label
      svg += `
        <text x="${labelX}" y="${labelY}"
              text-anchor="start"
              dominant-baseline="${isTop ? "auto" : "hanging"}"
              fill="${this.textColor}"
              font-size="${Math.max(10, this.width * 0.02)}"
              font-weight="600">
          ${this.escapeHtml(item.label)}
        </text>
      `;

      // Description (sub-causes)
      if (item.description && this.width > 400) {
        const descText =
          item.description.length > 15
            ? item.description.slice(0, 15) + "..."
            : item.description;
        const descColor = this.textColor + "99"; // 60% opacity

        svg += `
          <text x="${labelX}" y="${labelY + (isTop ? -15 : 15)}"
                text-anchor="start"
                dominant-baseline="${isTop ? "auto" : "hanging"}"
                fill="${descColor}"
                font-size="${Math.max(8, this.width * 0.016)}">
            ${this.escapeHtml(descText)}
          </text>
        `;
      }
    });

    // Effect/Result indicator circle at the end - using consistent gray
    if (this.data.length > 0) {
      svg += `
        <circle cx="${spineEndX}" cy="${spineY}"
                r="${this.width * 0.018}"
                fill="${spineColor}"
                opacity="0.9"/>
      `;

      // Effect label at the end
      svg += `
        <text x="${spineEndX + 25}" y="${spineY}"
              text-anchor="start"
              dominant-baseline="middle"
              fill="${spineColor}"
              font-size="${Math.max(11, this.width * 0.024)}"
              font-weight="700">
          Effect
        </text>
      `;
    }

    return svg;
  }

  /**
   * Generate full SVG
   */
  generate() {
    const content = this.generateChart();

    return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Fishbone Diagram Chart">
  <title>Fishbone Diagram Chart</title>
  <desc>Cause-effect fishbone analysis structure (Ishikawa diagram)</desc>
  ${content}
</svg>`.trim();
  }
}

// Export
if (typeof window !== "undefined") {
  window.FishboneDiagram = FishboneDiagram;
}


// ========== charts/FunnelDiagram.js ==========
/**
 * Funnel Diagram Chart - Vanilla JavaScript
 * Multi-stage funnel showing filtering progression
 */

class FunnelDiagram {
  constructor(config) {
    this.data = config.data || [];
    this.colors = config.colors || [
      "#7862d1",
      "#4f92ff",
      "#3cc583",
      "#de8431",
      "#e0cb15",
      "#ba5de5",
    ];
    this.width = config.width || 600;
    this.height = config.height || 400;
    this.textColor = config.textColor || "#484848";
    this.showValues =
      config.showValues !== undefined ? config.showValues : true;
    this.onItemClick = config.onItemClick;
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
  }

  /**
   * Generate the chart
   */
  generateChart() {
    // Responsive: Mobile (< 768px): 4 items, Desktop (>= 768px): 6 items
    const maxItems = this.width < 768 ? 4 : Math.min(6, this.data.length);
    const numItems = Math.min(this.data.length, maxItems);

    // Layout calculations for vertical funnel
    const availableHeight = this.height * 0.7; // Use 70% for funnel stages
    const stageHeight = availableHeight / numItems;
    const startY = this.height * 0.1; // Start at 10% from top
    const maxWidth = this.width * 0.7; // Maximum width at top
    const centerX = this.width / 2;

    let svg = "";

    this.data.slice(0, maxItems).forEach((item, index) => {
      const y = startY + index * stageHeight;

      // Calculate trapezoid width (narrowing from top to bottom)
      const topWidthRatio = 1 - (index / numItems) * 0.8; // From 100% to 20%
      const bottomWidthRatio = 1 - ((index + 1) / numItems) * 0.8;
      const topWidth = maxWidth * topWidthRatio;
      const bottomWidth = maxWidth * bottomWidthRatio;

      const color = item.color || this.colors[index % this.colors.length];

      // Trapezoid path: M topLeft L topRight L bottomRight L bottomLeft Z
      const trapezoidPath = `
        M ${centerX - topWidth / 2} ${y}
        L ${centerX + topWidth / 2} ${y}
        L ${centerX + bottomWidth / 2} ${y + stageHeight}
        L ${centerX - bottomWidth / 2} ${y + stageHeight}
        Z
      `;

      // Trapezoid stage
      svg += `
        <path d="${trapezoidPath}"
              fill="${color}"
              stroke="${this.textColor}33"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"/>
      `;

      // Label - reduced font size to prevent overflow
      const textColor = this.resolveTextColor
        ? this.resolveTextColor(color)
        : ColorUtils.getContrastingColor(color);
      const labelFontSize = Math.max(10, this.width * 0.018); // Reduced from 0.024
      svg += `
        <text x="${centerX}" y="${y + stageHeight / 2}"
              text-anchor="middle"
              dominant-baseline="middle"
              fill="${textColor}"
              font-size="${labelFontSize}"
              font-weight="600">
          ${this.escapeHtml(item.label)}
        </text>
      `;

      // Value/percentage (if provided and enabled)
      if (this.showValues && item.value !== undefined) {
        const valueText =
          typeof item.value === "number" && item.value <= 100
            ? `${item.value}%`
            : String(item.value);

        svg += `
          <text x="${centerX}" y="${y + stageHeight / 2 + this.width * 0.025}"
                text-anchor="middle"
                dominant-baseline="middle"
                fill="${this.resolveTextColor ? this.resolveTextColor(color, true, textColor) : textColor}"
                font-size="${Math.max(8, this.width * 0.015)}"
                font-weight="500"
                opacity="0.8">
            ${this.escapeHtml(valueText)}
          </text>
        `;
      }

      // Description (on larger screens)
      if (item.description && this.width > 400) {
        const descText =
          item.description.length > 20
            ? item.description.slice(0, 20) + "..."
            : item.description;
        const descColor = this.textColor + "99"; // 60% opacity

        svg += `
          <text x="${this.width * 0.85}" y="${y + stageHeight / 2}"
                text-anchor="start"
                dominant-baseline="middle"
                fill="${descColor}"
                font-size="${Math.max(9, this.width * 0.018)}">
            ${this.escapeHtml(descText)}
          </text>
        `;
      }
    });

    return svg;
  }

  /**
   * Generate full SVG
   */
  generate() {
    const content = this.generateChart();

    return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Funnel Diagram Chart">
  <title>Funnel Diagram Chart</title>
  <desc>Multi-stage funnel showing filtering progression</desc>
  ${content}
</svg>`.trim();
  }
}

// Export
if (typeof window !== "undefined") {
  window.FunnelDiagram = FunnelDiagram;
}


// ========== charts/GemPyramid.js ==========
/**
 * Gem Pyramid Chart - Vanilla JavaScript
 * 3D gem/crystal pyramid showing hierarchical data
 *
 * Usage:
 * const chart = new GemPyramid({
 *   data: [
 *     {label: 'Foundation', value: 100},
 *     {label: 'Growth', value: 75},
 *     {label: 'Peak', value: 50}
 *   ],
 *   colors: ['#fff8b6', '#e9ffb9', '#c8ffe5', '#dce9ff'],
 *   width: 672,
 *   height: 804
 * });
 * const svg = chart.generate();
 */

class GemPyramid {
  constructor(config) {
    this.data = config.data || [];
    this.colors = config.colors || ["#fff8b6", "#e9ffb9", "#c8ffe5", "#dce9ff"];
    this.barColors = config.barColors || [
      "#fffbda",
      "#f4ffdc",
      "#e3fff2",
      "#edf4ff",
    ];
    this.width = config.width || 672;
    this.height = config.height || 804;
    this.textColor = config.textColor || "#484848"; // Theme text color for labels outside shapes
  }

  /**
   * Original SVG paths from chart_05
   */
  getPaths() {
    return {
      // Column 4 (smallest, top) - from chart_05 line 61
      column4: {
        fill: `M 82 34L 46 34L 10 34L 10 22L 46 10L 82 22L 82 34ZM 82 166L 82 34L 10 34L 10 166L 82 166ZM 82 166L 82 178L 46 190L 10 178L 10 166L 46 166L 82 166Z`,
        stroke: `M 82 22L 46 34L 10 22M 82 22L 46 10L 10 22M 82 22L 82 34M 10 22L 10 34M 46 34L 46 168M 82 34L 82 168M 10 34L 10 168M 46 190L 82 178L 82 168M 46 190C 31.9411 185.3137 24.0589 182.6863 10 178L 10 168M 46 190L 46 168`,
      },

      // Column 3 - from chart_05 line 241
      column3: {
        fill: `M 130 41L 10 41L 10 19.0584L 34 10L 34 19.0584L 70 31.1363L 106 19.0584L 106 10L 130 19.0584L 130 41ZM 130 139.230682L 130 138.866364M 130 138.866364L 130 41L 10 41L 10 138.866364L 130 138.866364ZM 130 151.1286L 70 173L 10 151.1286L 10 139L 130 139L 130 151.1286Z`,
        stroke: `M 130 19.0584L 70 40.9999L 10 19.0584L 34 10L 34 19.0584L 70 31.1363L 106 19.0584L 106 10L 130 19.0584ZM 130 19.0584L 130 41M 10 19.0584L 10 41M 130 139L 130 41M 70 139L 70 41M 10 139L 10 41M 70 173L 130 151.1286L 130 139M 70 173L 70 139M 70 173L 10 151.1286L 10 139`,
      },

      // Column 2 - from chart_05 line 373
      column2: {
        fill: `M 178 19L 178 51L 94 51L 10 51L 10 19L 34 10L 34 19L 94 41L 154 19L 154 10L 178 19ZM 178 51L 178 139L 10 139L 10 51L 178 51ZM 94 183L 178 151L 178 139L 10 139L 10 151L 94 183Z`,
        stroke: `M 178 19L 94 51L 10 19L 34 10L 34 19L 94 41L 154 19L 154 10L 178 19ZM 178 19L 178 51M 10 19L 10 51M 94 51L 94 139M 10 51L 10 139M 178 51L 178 139M 94 183L 178 151L 178 139M 94 183L 10 151L 10 139M 94 183L 94 139`,
      },

      // Column 1 (largest, bottom) - from chart_05 line 505
      column1: {
        fill: `M 226 19.27L 226 61L 118 60.9999L 10 61L 10 19.27L 34 10L 34 19.27L 118 51.0642L 202 19.27L 202 10L 226 19.27ZM 226 61L 10 61L 10 139L 226 139L 226 61ZM 118 193L 226 151L 226 139L 10 139L 10 151L 118 193ZM 118 193L 118 139`,
        stroke: `M 226 18.9999L 118 60.9999L 10 18.9999L 34 10L 34 18.9999L 118 50.9999L 202 18.9999L 202 10L 226 18.9999ZM 226 18.9999L 226 61M 10 18.9999L 10 61M 226 139L 226 61M 118 139L 118 61M 10 139L 10 61M 226 139L 226 151L 118 193M 118 193L 10 151L 10 139M 118 193L 118 139`,
      },

      // Bar (simple rectangle) - from chart_05 line 417
      bar: `M 10 10L 22 10L 22 142L 10 142Z`,
    };
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
  }

  /**
   * Generate chart
   */
  generateChart() {
    const paths = this.getPaths();

    // Original dimensions from chart_05: viewBox="0 0 672 804"
    const originalWidth = 672;
    const originalHeight = 804;
    const scaleX = this.width / originalWidth;
    const scaleY = this.height / originalHeight;

    // Original positions from chart_05 (from bottom to top: 1->2->3->4)
    const levels = [
      {
        col: { x: 74, y: 569, path: paths.column1 },
        bar: { x: 314, y: 578 },
        barWidth: 236,
      },
      {
        col: { x: 98, y: 437, path: paths.column2 },
        bar: { x: 314, y: 446 },
        barWidth: 188,
      },
      {
        col: { x: 122, y: 305, path: paths.column3 },
        bar: { x: 314, y: 314 },
        barWidth: 140,
      },
      {
        col: { x: 146, y: 146, path: paths.column4 },
        bar: { x: 314, y: 158 },
        barWidth: 92,
      },
    ];

    let svg = "";

    // Limit to 4 items (pyramid levels from bottom to top)
    const limitedData = this.data.slice(0, 4).reverse(); // Reverse so first item is at bottom

    limitedData.forEach((item, index) => {
      const level = levels[index];
      const color = item.color || this.colors[index % this.colors.length];
      const barColor = this.barColors[index % this.barColors.length];
      const labelTextColor = this.resolveTextColor
        ? this.resolveTextColor(color)
        : this.textColor;
      const barValueColor = this.resolveTextColor
        ? this.resolveTextColor(barColor)
        : "#484848";

      const labelFontSize = Math.max(12, this.width * 0.018);
      const valueFontSize = Math.max(14, this.width * 0.022);

      // Draw column
      svg += `
        <g transform="translate(${level.col.x * scaleX}, ${level.col.y * scaleY}) scale(${scaleX}, ${scaleY})">
          <path d="${level.col.path.fill}" fill="${color}" stroke="none"/>
          <path d="${level.col.path.stroke}" fill="none" stroke="#ffffff" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"/>
        </g>
      `;

      // Draw bar on the right
      svg += `
        <g transform="translate(${level.bar.x * scaleX}, ${level.bar.y * scaleY}) scale(${scaleX}, ${scaleY})">
          <path d="${paths.bar}" fill="${barColor}" stroke="none"/>
          <path d="${paths.bar}" fill="none" stroke="#484848" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"/>
        </g>
      `;

      // Label for the level
      if (item.label) {
        const labelX = (level.col.x + level.barWidth / 2) * scaleX;
        const labelY = (level.col.y - 20) * scaleY;

        svg += `
          <text x="${labelX}" y="${labelY + labelFontSize * 0.35}" text-anchor="middle"
                fill="${labelTextColor}" font-size="${labelFontSize}" font-weight="600">
            ${this.escapeHtml(item.label.length > 15 && this.width < 500 ? item.label.slice(0, 13) + "..." : item.label)}
          </text>
        `;
      }

      // Value in bar
      if (item.value !== undefined) {
        const valueX = (level.bar.x + 16) * scaleX;
        const valueY = (level.bar.y + 76) * scaleY;

        svg += `
          <text x="${valueX}" y="${valueY + valueFontSize * 0.35}" text-anchor="middle"
                fill="${barValueColor}" font-size="${valueFontSize}" font-weight="700">
            ${this.escapeHtml(String(item.value))}
          </text>
        `;
      }
    });

    return svg;
  }

  /**
   * Generate full SVG
   */
  generate() {
    const content = this.generateChart();

    return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Gem Pyramid Chart">
  <title>Gem Pyramid Chart</title>
  <desc>A 3D gem/crystal pyramid chart showing hierarchical data with varying levels</desc>
  ${content}
</svg>`.trim();
  }
}

// Export
if (typeof window !== "undefined") {
  window.GemPyramid = GemPyramid;
}


// ========== charts/IcebergComplexLayers.js ==========
/**
 * Iceberg Complex Layers Chart - Vanilla JavaScript
 * 精准还原 chart_41_pattern_complex_detailed.html（仅配色/文案可定制）
 */

(function (globalScope) {
  const ORIGINAL_WIDTH = 1104;
  const ORIGINAL_HEIGHT = 852;

  const ABOVE_TRANSFORM = "translate(86, 134)";
  const LAYER_CONFIG = [
    { key: "layer1", transform: "translate(86, 338)" },
    { key: "layer2", transform: "translate(86, 446)" },
    { key: "layer3", transform: "translate(86, 542)" },
    { key: "layer4", transform: "translate(86, 638)" },
  ];
  const WATERLINE_TRANSFORM = "translate(62, 338)";
  const LEFT_LABEL_X = 180;
  const RIGHT_LABEL_X = ORIGINAL_WIDTH - 180;
  const TEXT_POSITIONS = [
    {
      left: { x: 170, y: 301.5, fontSize: 25 },
      right: { x: 874.54, y: 289, fontSize: 15 },
    },
    {
      left: { x: 110, y: 409.5, fontSize: 20 },
      right: { x: 906.73, y: 409, fontSize: 15 },
    },
    {
      left: { x: 110, y: 517.5, fontSize: 20 },
      right: { x: 861.7, y: 505, fontSize: 15 },
    },
    {
      left: { x: 110, y: 613.5, fontSize: 20 },
      right: { x: 839.45, y: 601, fontSize: 15 },
    },
    {
      left: { x: 110, y: 709.5, fontSize: 20 },
      right: { x: 833.31, y: 697, fontSize: 15 },
    },
  ];

  class IcebergComplexLayers {
    constructor(config) {
      this.data = config.data || [];
      this.colors = config.colors || [
        "#eddcc2",
        "#d8e4f8",
        "#f2f6ff",
        "#e0f2d8",
        "#f7e7ff",
      ];
      this.width = config.width || ORIGINAL_WIDTH;
      this.height = config.height || ORIGINAL_HEIGHT;
      this.showWaterLine =
        config.showWaterLine !== undefined ? config.showWaterLine : true;
      this.visibleLabel = config.visibleLabel || "Visible";
      this.hiddenLabel = config.hiddenLabel || "Hidden Depths";
      this.textColor = config.textColor || "#484848";
    }

    getColorUtils() {
      if (typeof ColorUtils !== "undefined") {
        return ColorUtils;
      }
      if (typeof window !== "undefined" && window.ColorUtils) {
        return window.ColorUtils;
      }
      return null;
    }

    getPaths() {
      return {
        aboveWater: `M 543.741875 56.9121L 478.719375 10L 455.764375 45.6352L 424.678875 63.5456L 404.889375 106L 404.888275 106L 398.984375 118L 457.428275 118L 495.999775 88L 481.957075 27.1328L 534.600275 65.1136C 541.355575 77.0021 558.999775 106 558.999775 106L 577.161875 118L 597.999775 118L 566.499775 96.5L 543.741875 56.9121ZM 365.5504 118L 10 118L 10 190L 283.6058 190C 284.3893 189.2743 285.2171 188.5854 286.088 187.9371L 294.5194 181.6618L 304.2577 164.6777C 307.6768 158.7147 313.0399 154.1066 319.4499 151.6244L 355.9641 137.4848L 365.5504 118ZM 668.2852 190L 640.9822 147.5906L 629.6135 118L 922 118L 922 190L 668.2852 190ZM 377.7144 161.2329L 330.2831 179.6L 324.32 190L 502 190L 460 172L 466 154L 442 130L 457.4286 118L 398.9846 118L 377.7144 161.2329ZM 614.0857 161.2329L 598 118L 577.1622 118L 587 124.5L 602.884 165.5363C 602.884 165.5363 613.3 182.2438 618.2715 190L 632.3716 190L 614.0857 161.2329ZM 502 190L 618.2715 190M 639.9975 214L 317.4375 214L 324.3181 190L 501.998 190L 618.2696 190L 632.3696 190L 639.9975 214Z`,
        layer1: `M 615.897931 118.0002L 333.279331 118.0002L 329.082031 106L 626.865231 106L 615.897931 118.0002ZM 317.219638 10L 639.999338 10L 647.824938 34L 303.898438 34L 317.219638 10ZM 274.0645 34L 10 34L 10 106L 296.1955 106L 275.4291 41.1523C 274.674 38.7941 274.2244 36.3937 274.0645 34ZM 666.9711 106L 688.4561 81.5484C 697.3004 71.4829 698.3976 56.773 691.1445 45.5069L 683.7364 34L 922 34L 922 106L 666.9711 106ZM 647.8256 34.0002L 665.92 61.7464L 626.8658 106L 329.0827 106L 303.8991 34.0002L 647.8256 34.0002Z`,
        layer2: `M 616.106856 10L 605.500856 21.9997L 337.688156 21.9997L 333.222656 10L 616.106856 10ZM 305.7337 22L 10 22L 10 94L 327.4129 94L 322.7471 67.8616L 305.7337 22ZM 609.386 94L 613.3403 83.4328C 613.3751 83.3399 613.4094 83.2469 613.4432 83.1536L 627.7603 43.7068L 638.8775 29.3261L 645.5731 22L 922 22L 922 94L 609.386 94ZM 605.5 22L 585.2432 72.9192L 577.3546 94L 357.9107 94L 351.8083 59.9462L 337.6873 22L 605.5 22ZM 572.863456 106.0003L 360.060556 106.0003L 357.910156 94L 577.354056 94L 572.863456 106.0003Z`,
        layer3: `M 573.11905 10L 571.34425 22.1203L 362.00195 22L 360.03125 10L 573.11905 10ZM 382 106L 557.9202 106L 559.8804 94L 382 94L 382 106ZM 362 22.000031L 382 81.500031L 381.933 94.000031L 559.8134 94.000031L 571.3423 22.120331L 362 22.000031ZM 335.8012 38.214931C 334.0231 35.034731 332.823 31.528531 332.2935 27.856031L 331.4492 22.000031L 10 22.000031L 10 94.000031L 352.0002 94.000031L 352.0002 86.407131L 335.8012 38.214931ZM 590.1553 94.000031L 922 94.000031L 922 22.000031L 601.6801 22.000031L 601.026 26.466731C 601.0068 26.598131 600.9867 26.729431 600.9657 26.860531L 590.1553 94.000031Z`,
        layer4: `M 382 10L 382 22L 556 22L 557.9202 10L 382 10ZM 465.997663 118L 439.476563 94L 499.142963 94L 465.997663 118ZM 352 22L 10 22L 10 94L 404.3847 94L 374.8894 69.6254C 371.6031 66.9097 368.9334 63.5247 367.0582 59.696L 355.0582 35.196C 353.0132 31.0208 351.9998 26.5045 352 22ZM 530.8644 94L 922 94L 922 22L 586.0023 22C 586.0015 31.7573 581.2259 41.1384 572.8428 46.8258L 535.0936 80.5776L 530.8644 94ZM 514.2 58.5L 556 22L 382 22L 394 46.5L 439.4789 94L 499.1453 94L 514.2 58.5Z`,
      };
    }

    escapeHtml(text) {
      const div = document.createElement("div");
      div.textContent = text || "";
      return div.innerHTML;
    }

    renderAboveSection(paths, visibleItems) {
      const colorUtils = this.getColorUtils();
      const aboveColor = visibleItems[0]?.color || "#d6c9b5";
      let section = `
      <g transform="${ABOVE_TRANSFORM}">
        <path d="${paths.aboveWater}" fill="${aboveColor}" stroke="#ffffff" stroke-width="2"
              stroke-linejoin="round" stroke-linecap="round" opacity="0.9"/>
      </g>
    `;

      if (visibleItems.length > 0) {
        const item = visibleItems[0];
        const labelColor =
          (colorUtils && colorUtils.getContrastingColor(aboveColor, false)) ||
          this.textColor;
        const positions = TEXT_POSITIONS[0];
        section += `
        <text x="${positions.left.x}" y="${positions.left.y}" text-anchor="start"
              font-size="${positions.left.fontSize}" font-weight="600"
              fill="${labelColor}">
          ${this.escapeHtml(item.label)}
        </text>
      `;
        if (item.description) {
          section += `
          <text x="${positions.right.x}" y="${positions.right.y}" text-anchor="start"
                font-size="${positions.right.fontSize}"
                fill="${
                  (colorUtils &&
                    colorUtils.getContrastingColor(aboveColor, true)) ||
                  this.textColor
                }" opacity="0.9">
            ${this.escapeHtml(item.description)}
          </text>
        `;
        }
      }

      return section;
    }

    renderLayers(paths, hiddenItems) {
      let layersSvg = "";
      LAYER_CONFIG.forEach((layer, index) => {
        const color =
          hiddenItems[index]?.color ||
          this.colors[index] ||
          this.colors[index % this.colors.length];
        const item = hiddenItems[index];

        layersSvg += `
        <g transform="${layer.transform}">
          <path d="${paths[layer.key]}" fill="${color}" stroke="#ffffff" stroke-width="2"
                stroke-linejoin="round" stroke-linecap="round" opacity="0.95"/>
        </g>
      `;

        if (item) {
          const positions = TEXT_POSITIONS[index + 1];
          layersSvg += `
          <text x="${positions.left.x}" y="${positions.left.y}" text-anchor="start"
                font-size="${positions.left.fontSize}" font-weight="600" fill="${this.textColor}">
            ${this.escapeHtml(item.label)}
          </text>
        `;
          if (item.description) {
            layersSvg += `
            <text x="${positions.right.x}" y="${positions.right.y}" text-anchor="start"
                  font-size="${positions.right.fontSize}" fill="${this.textColor}" opacity="0.9">
              ${this.escapeHtml(item.description)}
            </text>
          `;
          }
        }
      });
      return layersSvg;
    }

    renderWaterline() {
      if (!this.showWaterLine) {
        return "";
      }
      return `
      <g transform="${WATERLINE_TRANSFORM}">
        <line x1="10" y1="10" x2="970" y2="10"
              stroke="${this.textColor}" stroke-width="2" stroke-dasharray="5,7" opacity="0.5"/>
        <line x1="10" y1="10" x2="970" y2="10"
              stroke="${this.textColor}" stroke-width="2" stroke-dasharray="8,12" opacity="0.3">
          <animate attributeName="stroke-dashoffset" values="0;20" dur="2s" repeatCount="indefinite"/>
        </line>
      </g>
    `;
    }

    renderSideLabels() {
      return `
      <text x="140" y="300" font-size="22" font-weight="600" fill="${this.textColor}">
        ${this.escapeHtml(this.visibleLabel)}
      </text>
      <text x="140" y="540" font-size="22" font-weight="600" fill="${this.textColor}">
        ${this.escapeHtml(this.hiddenLabel)}
      </text>
    `;
    }

    generateChart() {
      const paths = this.getPaths();
      const visibleItems = this.data.filter((item) => item.visible);
      const hiddenItems = this.data.filter((item) => !item.visible);

      return `
      ${this.renderAboveSection(paths, visibleItems)}
      ${this.renderWaterline()}
      ${this.renderLayers(paths, hiddenItems)}
      ${this.renderSideLabels()}
    `;
    }

    generate() {
      const content = this.generateChart();
      return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${ORIGINAL_WIDTH} ${ORIGINAL_HEIGHT}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Iceberg Complex Layers Chart">
  <title>Iceberg Complex Layers Chart</title>
  <desc>Complex iceberg visualization with visible and hidden sections</desc>
  ${content}
</svg>`.trim();
    }
  }

  if (globalScope) {
    globalScope.IcebergComplexLayers = IcebergComplexLayers;
  }
})(typeof window !== "undefined" ? window : globalThis);


// ========== charts/IcebergDepth.js ==========
/**
 * Iceberg Depth Chart - Vanilla JavaScript
 * 冰山深度图表 - 展示软件开发的可见层和隐藏层
 *
 * Usage:
 * const chart = new IcebergDepth({
 *   data: [
 *     {label: 'Surface', description: 'Visible output'},
 *     {label: 'Features', description: 'Core functionality'},
 *     {label: 'Architecture', description: 'System design'},
 *     {label: 'Testing', description: 'Quality assurance'},
 *     {label: 'Culture', description: 'Team values'}
 *   ],
 *   colors: ['#ebebeb', '#dce9ff', '#ebebeb', '#fff8b6', '#f5e0ff'],
 *   width: 1104,
 *   height: 852
 * });
 * const svg = chart.generate();
 */

class IcebergDepth {
  constructor(config) {
    this.data = config.data || [];
    this.colors = config.colors || [
      "#ebebeb",
      "#dce9ff",
      "#ebebeb",
      "#fff8b6",
      "#f5e0ff",
    ];
    this.width = config.width || 1104;
    this.height = config.height || 852;
    this.textColor = config.textColor || "#484848"; // Theme text color for labels outside shapes
  }

  /**
   * Original SVG paths from chart_21
   */
  getPaths() {
    return {
      // Row-top (gray) - from chart_21 line 61
      rowTop: {
        fill: `M 543.741875 56.9121L 478.719375 10L 455.764375 45.6352L 424.678875 63.5456L 404.889375 106L 404.888275 106L 398.984375 118L 457.428275 118L 495.999775 88L 481.957075 27.1328L 534.600275 65.1136C 541.355575 77.0021 558.999775 106 558.999775 106L 577.161875 118L 597.999775 118L 566.499775 96.5L 543.741875 56.9121ZM 365.5504 118L 10 118L 10 190L 283.6058 190C 284.3893 189.2743 285.2171 188.5854 286.088 187.9371L 294.5194 181.6618L 304.2577 164.6777C 307.6768 158.7147 313.0399 154.1066 319.4499 151.6244L 355.9641 137.4848L 365.5504 118ZM 668.2852 190L 640.9822 147.5906L 629.6135 118L 922 118L 922 190L 668.2852 190ZM 377.7144 161.2329L 330.2831 179.6L 324.32 190L 502 190L 460 172L 466 154L 442 130L 457.4286 118L 398.9846 118L 377.7144 161.2329ZM 614.0857 161.2329L 598 118L 577.1622 118L 587 124.5L 602.884 165.5363C 602.884 165.5363 613.3 182.2438 618.2715 190L 632.3716 190L 614.0857 161.2329ZM 502 190L 618.2715 190M 639.9975 214L 317.4375 214L 324.3181 190L 501.998 190L 618.2696 190L 632.3696 190L 639.9975 214Z`,
        stroke: `M 597.999775 118L 566.499775 96.5L 543.741875 56.9121L 478.719375 10L 455.764375 45.6352L 424.678875 63.5456L 404.889375 106L 404.888275 106L 398.984375 118M 457.428275 118L 495.999775 88L 481.957075 27.1328L 534.600275 65.1136C 541.355575 77.0021 558.999775 106 558.999775 106L 577.161875 118M 365.5504 118L 10 118L 10 190L 283.6058 190C 284.3893 189.2743 285.2171 188.5854 286.088 187.9371L 294.5194 181.6618L 304.2577 164.6777C 307.6768 158.7147 313.0399 154.1066 319.4499 151.6244L 355.9641 137.4848L 365.5504 118ZM 668.2852 190L 640.9822 147.5906L 629.6135 118L 922 118L 922 190L 668.2852 190ZM 598 118L 614.0857 161.2329L 632.3716 190M 324.32 190L 330.2831 179.6L 377.7144 161.2329L 398.9846 118M 457.4286 118L 442 130L 466 154L 460 172L 502 190L 618.2715 190C 613.3 182.2438 602.884 165.5363 602.884 165.5363L 587 124.5L 577.1622 118M 501.998 190L 618.2696 190M 324.3181 190L 317.4375 214L 639.9975 214L 632.3696 190`,
      },

      // Row-1 (blue) - from chart_21 line 146
      row1: {
        fill: `M 615.897931 118.0002L 333.279331 118.0002L 329.082031 106L 626.865231 106L 615.897931 118.0002ZM 317.219638 10L 639.999338 10L 647.824938 34L 303.898438 34L 317.219638 10ZM 274.0645 34L 10 34L 10 106L 296.1955 106L 275.4291 41.1523C 274.674 38.7941 274.2244 36.3937 274.0645 34ZM 666.9711 106L 688.4561 81.5484C 697.3004 71.4829 698.3976 56.773 691.1445 45.5069L 683.7364 34L 922 34L 922 106L 666.9711 106ZM 647.8256 34.0002L 665.92 61.7464L 626.8658 106L 329.0827 106L 303.8991 34.0002L 647.8256 34.0002Z`,
        stroke: `M 626.865231 106L 615.897931 118.0002L 333.279331 118.0002L 329.082031 106M 303.898438 34L 317.219638 10L 639.999338 10L 647.824938 34M 274.0645 34L 10 34L 10 106L 296.1955 106L 275.4291 41.1523C 274.674 38.7941 274.2244 36.3937 274.0645 34ZM 666.9711 106L 688.4561 81.5484C 697.3004 71.4829 698.3976 56.773 691.1445 45.5069L 683.7364 34L 922 34L 922 106L 666.9711 106ZM 303.8991 34.0002L 329.0827 106M 647.8256 34.0002L 665.92 61.7464L 626.8658 106`,
      },

      // Row-2 (gray) - from chart_21 line 192
      row2: {
        fill: `M 616.106856 10L 605.500856 21.9997L 337.688156 21.9997L 333.222656 10L 616.106856 10ZM 305.7337 22L 10 22L 10 94L 327.4129 94L 322.7471 67.8616L 305.7337 22ZM 609.386 94L 613.3403 83.4328C 613.3751 83.3399 613.4094 83.2469 613.4432 83.1536L 627.7603 43.7068L 638.8775 29.3261L 645.5731 22L 922 22L 922 94L 609.386 94ZM 605.5 22L 585.2432 72.9192L 577.3546 94L 357.9107 94L 351.8083 59.9462L 337.6873 22L 605.5 22ZM 572.863456 106.0003L 360.060556 106.0003L 357.910156 94L 577.354056 94L 572.863456 106.0003Z`,
        stroke: `M 605.500856 21.9997L 616.106856 10L 333.222656 10L 337.688156 21.9997M 305.7337 22L 10 22L 10 94L 327.4129 94L 322.7471 67.8616L 305.7337 22ZM 609.386 94L 613.3403 83.4328C 613.3751 83.3399 613.4094 83.2469 613.4432 83.1536L 627.7603 43.7068L 638.8775 29.3261L 645.5731 22L 922 22L 922 94L 609.386 94ZM 605.5 22L 585.2432 72.9192L 577.3546 94M 337.6873 22L 351.8083 59.9462L 357.9107 94M 357.910156 94L 360.060556 106.0003L 572.863456 106.0003L 577.354056 94`,
      },

      // Row-3 (yellow) - from chart_21 line 238
      row3: {
        fill: `M 573.11905 10L 571.34425 22.1203L 362.00195 22L 360.03125 10L 573.11905 10ZM 382 106L 557.9202 106L 559.8804 94L 382 94L 382 106ZM 362 22.000031L 382 81.500031L 381.933 94.000031L 559.8134 94.000031L 571.3423 22.120331L 362 22.000031ZM 335.8012 38.214931C 334.0231 35.034731 332.823 31.528531 332.2935 27.856031L 331.4492 22.000031L 10 22.000031L 10 94.000031L 352.0002 94.000031L 352.0002 86.407131L 335.8012 38.214931ZM 590.1553 94.000031L 922 94.000031L 922 22.000031L 601.6801 22.000031L 601.026 26.466731C 601.0068 26.598131 600.9867 26.729431 600.9657 26.860531L 590.1553 94.000031Z`,
        stroke: `M 362.00195 22L 360.03125 10L 573.11905 10L 571.34425 22.1203M 335.8012 38.215031C 334.0231 35.034831 332.823 31.528631 332.2935 27.856131L 331.4492 22.000031L 10 22.000031L 10 94.000031L 352.0002 94.000031L 352.0002 86.407131L 335.8012 38.215031ZM 590.2223 94.000031L 922 94.000031L 922 22.000031L 601.6801 22.000031L 601.026 26.466731C 601.0068 26.598131 600.9867 26.729431 600.9657 26.860531L 590.2223 94.000031ZM 362 22.000031L 382 81.500031L 382 94.000031M 559.8804 94.000031L 571.3423 22.120331M 382 94L 382 106L 557.9202 106L 559.8804 94`,
      },

      // Row-4 (purple) - from chart_21 line 284
      row4: {
        fill: `M 382 10L 382 22L 556 22L 557.9202 10L 382 10ZM 465.997663 118L 439.476563 94L 499.142963 94L 465.997663 118ZM 352 22L 10 22L 10 94L 404.3847 94L 374.8894 69.6254C 371.6031 66.9097 368.9334 63.5247 367.0582 59.696L 355.0582 35.196C 353.0132 31.0208 351.9998 26.5045 352 22ZM 530.8644 94L 922 94L 922 22L 586.0023 22C 586.0015 31.7573 581.2259 41.1384 572.8428 46.8258L 535.0936 80.5776L 530.8644 94ZM 514.2 58.5L 556 22L 382 22L 394 46.5L 439.4789 94L 499.1453 94L 514.2 58.5Z`,
        stroke: `M 352 22.000031L 10 22.000031L 10 94.000031L 404.3847 94.000031L 374.8894 69.625431C 371.6031 66.909731 368.9334 63.524731 367.0582 59.696031L 355.0582 35.196031C 353.0132 31.020831 351.9998 26.504531 352 22.000031ZM 530.8644 94.000031L 922 94.000031L 922 22.000031L 586.0023 22.000031C 586.0015 31.757331 581.2259 41.138431 572.8428 46.825831L 535.0936 80.577631L 530.8644 94.000031ZM 382 22.000031L 394 46.500031L 439.4789 94.000031M 556 22.000031L 514.2 58.500031L 499.1453 94.000031M 382 22L 382 10L 557.9202 10L 556 22M 439.476563 94L 465.997663 118L 499.142963 94`,
      },
    };
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
  }

  /**
   * Generate chart
   */
  generateChart() {
    const paths = this.getPaths();

    // Original dimensions from chart_21: viewBox="0 0 1104 852"
    const originalWidth = 1104;
    const originalHeight = 852;
    const scaleX = this.width / originalWidth;
    const scaleY = this.height / originalHeight;

    // Row positions from chart_21
    const rows = [
      { x: 86, y: 134, path: paths.rowTop, color: this.colors[0] || "#ebebeb" },
      { x: 86, y: 338, path: paths.row1, color: this.colors[1] || "#dce9ff" },
      { x: 86, y: 446, path: paths.row2, color: this.colors[2] || "#ebebeb" },
      { x: 86, y: 542, path: paths.row3, color: this.colors[3] || "#fff8b6" },
      { x: 86, y: 638, path: paths.row4, color: this.colors[4] || "#f5e0ff" },
    ];

    let svg = "";

    // Dashed separator line (between row-top and row-1)
    const separatorY = 338;
    svg += `
      <g transform="translate(${62 * scaleX}, ${separatorY * scaleY})">
        <path d="M 342 10L 10 10M 970 10L 664 10"
              fill="none" stroke="${this.textColor}" stroke-width="2"
              stroke-dasharray="5.0, 7.0" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M 342 10L 10 10M 970 10L 664 10"
              fill="none" stroke="#ffffff25" stroke-width="2"
              stroke-dasharray="4,6" stroke-linecap="round" stroke-linejoin="round">
          <animate attributeName="stroke-dashoffset" values="30;0" dur="1s" repeatCount="indefinite"/>
        </path>
      </g>
    `;

    // Draw all rows
    rows.forEach((row, index) => {
      if (index >= this.data.length) return;

      const item = this.data[index];
      const color = item.color || row.color;

      // Draw the row
      svg += `
        <g transform="translate(${row.x * scaleX}, ${row.y * scaleY}) scale(${scaleX}, ${scaleY})">
          <path d="${row.path.fill}" fill="${color}" stroke="none"/>
          <path d="${row.path.stroke}" fill="none" stroke="#ffffff" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"/>
        </g>
      `;

      // Add labels if provided
      if (item.label) {
        const labelFontSize = Math.max(14, this.width * 0.018);
        const descFontSize = Math.max(12, this.width * 0.015);
        const labelColor = this.resolveTextColor
          ? this.resolveTextColor(color)
          : this.textColor;
        const descColor = this.resolveTextColor
          ? this.resolveTextColor(color, true, this.textColor)
          : this.textColor;

        // Label on the left
        const labelX = 50 * scaleX;
        const labelY = (row.y + 60) * scaleY;

        svg += `
          <text x="${labelX}" y="${labelY + labelFontSize * 0.35}"
                fill="${labelColor}" font-size="${labelFontSize}" font-weight="600">
            ${this.escapeHtml(item.label)}
          </text>
        `;

        // Description on the right
        if (item.description) {
          const descX = (row.x + 932 + 50) * scaleX;
          const descY = (row.y + 60) * scaleY;

          svg += `
            <text x="${descX}" y="${descY + descFontSize * 0.35}"
                  fill="${descColor}" font-size="${descFontSize}">
              ${this.escapeHtml(item.description)}
            </text>
          `;
        }
      }
    });

    return svg;
  }

  /**
   * Generate full SVG
   */
  generate() {
    const content = this.generateChart();

    return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Iceberg Depth Chart">
  <title>Iceberg Depth Chart</title>
  <desc>A layered 3D chart showing visible and hidden aspects of software development</desc>
  ${content}
</svg>`.trim();
  }
}

// Export
if (typeof window !== "undefined") {
  window.IcebergDepth = IcebergDepth;
}


// ========== charts/IcebergSimpleMountain.js ==========
/**
 * Iceberg Simple Mountain Chart - Vanilla JavaScript
 * 重构版本：基于原始 chart_iceberg_simple_mountain.html (原 chart_22)
 *
 * - 还原原始 SVG 的冰山造型、连接线、icon 与水面动画
 * - 数据驱动 4 个呼出卡片（上/下、左/右）
 * - 支持自定义标题、峰顶/深海标签与是否展示水面
 */

(function (globalScope) {
  const ORIGINAL_WIDTH = 1080;
  const ORIGINAL_HEIGHT = 576;

  const SIMPLE_MOUNTAIN_PATHS = {
    background: "M 0 0L 1044 0L 1044 546L 0 546Z",
    aboveFill:
      "M 436.5 147.8828C 424.1125 147.8828 418.1187 148.1327 412 148.1545L 415.5 144.5L 425 133L 428 138L 435 142L 439.5 139.5L 443.5 142L 448 148.2453C 443.6582 148.0872 439.7723 147.8828 436.5 147.8828ZM 34.5 147.8828C 22.1125 147.8828 16.1187 148.1327 10 148.1545L 13.5 144.5L 23 143L 26 138L 29.5 140.5L 33 142.5L 34.5 147.8828ZM 64 148L 87.3867 127.3902L 102.4327 105.9256L 126.9642 93.3888L 135.1414 99.1824L 142.5009 84.1762L 152.477 74.6786L 157.3833 64.8011L 174.3918 57.108L 180.2794 36.2134L 193.5264 25.861L 197.615 28.0454L 212.1704 10L 216.586 16.2684L 216.586 20.5423L 225.0903 29.3751L 232.1227 23.2966L 249.1312 53.214L 262.3782 46.5657L 274.3169 64.8011L 274.3169 73.159L 279.5503 77.053L 281.6763 90.4446L 289.8535 80.4721L 292 82.0463L 315.3663 99.1824L 317.1653 111.4343L 332.8654 107.3503L 339.4072 127.3902L 342.8416 126.3455L 352 148L 255.5 148L 64 148Z",
    aboveStroke:
      "M 126.9642 93.3888L 123 119.25L 115 117.1591L 104.5 135.9773L 99.5 132.3182L 96.5 140.1591M 135.1414 99.1824L 157.3833 111.4343L 166 123.4318L 178.5 119.25L 190.5 129.1818L 225.0903 135.9773L 235.5 129.1818L 255.5 148M 212.1704 10L 206.5 36.2134L 214.5 46.5657L 221 41.8864L 225.0903 64.8011L 240.5 84.1762L 245 80.4721L 249.1312 93.3888L 255.5 99.1824M 281.6763 90.4446L 260 105.9256L 252 117.1591L 232.1227 111.4343L 214.5 103.0454L 206.5 121.3409L 199.5 126.3455M 292 82.0463L 289.8535 105.9256L 297.5 119.25L 304 111.4343L 315.3663 135.9773M 201 75.5L 188 80L 178.5 94.6786L 166 97.053M 279.5503 103.0454L 274.3169 111.4343L 267 114M 131.5 129.1818L 142.5008 123.4318L 152.477 132.3182L 158.9106 129.1818L 166 135.9773L 178.5 140.1591",
    belowFill:
      "M 138.1641 11.183415C 146.3805 11.784315 152.0267 11.582115 158.8692 11.188515C 159.8457 11.132315 160.8469 11.072215 161.8831 11.010015C 171.0875 10.457515 183.0816 9.737515 205.5322 10.096215C 207.0289 10.120115 208.5722 10.148915 210.1641 10.182715L 292.5165 11.129915L 294.3441 21.355315L 295.1642 25.944015L 292.1755 45.259415L 287.8463 88.744115L 261.1641 121.619915L 248.6275 166.744115L 197.3461 201.244115L 184.6641 222.744115L 160.1641 227.744115L 149.6641 235.744115L 132.6641 244.244115L 108.6641 230.244115L 104.8463 202.620015L 77.1641 190.744115L 58.1641 166.744115L 52.1641 128.244115L 38.8584 113.619915L 18.664 87.070915L 15.5056 61.244115L 10 11.263915L 11.8165 11.211615C 29.4809 10.702915 48.1573 10.165015 62.1641 11.183415C 75.0652 12.121315 88.0763 11.849215 100.3715 11.450815C 102.128 11.393915 103.8698 11.334415 105.5946 11.275515C 117.5325 10.867815 128.6552 10.487915 138.1641 11.183415ZM 138.1641 11.183415L 138.1641 11.179515C 128.6552 10.484015 117.5326 10.866915 105.5946 11.275515M 205.5322 10.096215C 207.0289 10.120115 208.5722 10.144915 210.1641 10.178815L 210.1641 10.182715M 292.5165 11.129915L 292.5165 11.126015M 294.3441 21.355315L 295.1636 25.940915M 295.1642 25.944015L 295.1636 25.940915M 62.1641 11.183415L 62.1641 11.179515M 295.1636 25.940915L 295.1642 25.940115M 11.8075 11.211915L 11.8165 11.211615C 11.8135 11.211715 11.8105 11.211815 11.8075 11.211915ZM 11.8075 11.211915L 10 11.263915L 10 11.259915C 10.6011 11.242715 11.2038 11.229215 11.8075 11.211915Z",
    belowStroke:
      "M 158.8692 11.188515C 152.0267 11.582115 146.3805 11.784315 138.1641 11.183415C 128.6552 10.487915 117.5326 10.867815 105.5946 11.275515C 103.8698 11.334415 102.128 11.393915 100.3715 11.450815C 88.0763 11.849215 75.0652 12.121315 62.1641 11.183415C 48.1573 10.165015 29.4809 10.702915 11.8165 11.211615L 11.8075 11.211915L 10 11.263915L 15.5056 61.244115L 18.664 87.070915L 38.8584 113.619915L 52.1641 128.244115L 58.1641 166.744115L 77.1641 190.744115L 104.8463 202.620015L 108.6641 230.244115L 132.6641 244.244115L 149.6641 235.744115L 160.1641 227.744115L 184.6641 222.744115L 197.3461 201.244115L 248.6275 166.744115L 261.1641 121.619915L 287.8463 88.744115L 292.1755 45.259415L 295.1642 25.944015L 295.1636 25.940915L 294.3441 21.355315L 292.5165 11.129915L 210.1641 10.182715C 208.5722 10.148915 207.0289 10.120115 205.5322 10.096215C 183.0816 9.737515 171.0878 10.457515 161.8834 11.010015C 160.847 11.072215 159.8458 11.132315 158.8692 11.188515ZM 138.1641 11.183415L 138.1641 11.179515C 128.6552 10.484015 117.5326 10.866915 105.5946 11.275515M 62.1641 11.183415L 62.1641 11.179515M 11.8165 11.211615C 11.8135 11.211715 11.8105 11.211815 11.8075 11.211915C 11.2038 11.229215 10.6011 11.242715 10 11.259915L 10 11.263915M 15.5056 61.244115L 24.0666 44.977015L 33.164 56.745415L 38.8584 45.255515L 54.664 54.244115M 18.664 87.070915L 54.664 83.744115L 69.9446 91.244115L 74.664 102.244115L 84.1023 123.752815L 104.8462 113.619915L 119.164 133.244115M 294.3441 21.355315L 277.6642 33.245415L 268.8228 56.745415M 292.5165 11.129915L 292.5165 11.126015M 210.1641 10.182715L 210.1641 10.178815C 208.5722 10.144915 207.0289 10.120115 205.5322 10.096215M 248.6275 75.745415L 245.1153 39.245415L 237.6519 23.245415L 228.8714 59.183015M 199.3463 150.619915L 214.9316 123.119915L 236.3462 135.121215L 253.1641 106.744115M 65.164 67.744115L 69.9446 44.977015L 84.4325 39.245415L 87.9446 24.343415L 91.8958 52.305215L 98.9203 52.305215L 113.9316 45.255515M 207.3462 45.292415L 183.1641 59.219915L 177.6641 34.745415L 168.664 40.744115L 158.8692 34.745415M 295.1636 25.940915L 295.1642 25.940115",
    waterline:
      "M 238 24.434C 252.3333 23.7674 285.1 22.834 301.5 24.434C 311.1999 25.3804 326.4969 24.9835 342.8359 24.5145C 361.0281 23.9923 380.512 23.3807 395 24.434C 422.5 26.4334 450.5 22.9347 471 24.434C 491.5 25.9334 496 22.4334 543 23.4334C 568.9358 23.9852 599.4392 24.3852 625.3523 24.3806C 646.3981 24.3768 664.4161 24.1062 674.5 23.4334C 697 21.9321 750 24.9347 768.5 23.4334M 308 10L 346.5 10M 10 10L 299.5 10M 625.5 10L 693.5 10M 719.5 10L 958 10M 326 15.9566C 330.4566 15.9798 335.2835 15.9994 340 15.9994L 628 15.9994C 639 16.4104 643.5 15.8828 661.5 15.8828M 317.5 15.9092C 314.7028 15.8939 312.3013 15.8828 310.5 15.8828C 292.5 15.8828 288 16.4104 277 15.9994L 265.5 15.9994M 679 15.9994C 690 16.4104 694.5 15.8828 712.5 15.8828C 718.343 15.8828 726.1426 16.5347 735 16.4104M 755.5 16.4104L 788 16.4104C 800.4 16.4104 813.8333 16.0587 819 15.8828M 247.5 15.9994C 237.5 15.8828 221 17.5989 215 15.9994",
  };

  const CALLOUT_SLOTS = [
    {
      labelTransform: {
        group: "translate(175.99996948242188, 299)",
        text: "translate(138, 22)",
        position: { x: -122.25, y: 7.5 },
      },
      descriptionTransform: {
        group: "translate(140, 323)",
        text: "translate(174, 16)",
        position: { x: -161.73, y: 6.5 },
      },
      color: "#4e88e7",
      pattern: "url(#crawlingPattern-0054dc93)",
      label: "Code Understanding",
      description: "Efficiency in comprehending code.",
    },
    {
      labelTransform: {
        group: "translate(752, 338)",
        text: "translate(10, 22)",
        position: { x: 2, y: 7.5 },
      },
      descriptionTransform: {
        group: "translate(752, 362)",
        text: "translate(10, 16)",
        position: { x: 2, y: 6.5 },
      },
      color: "#969696",
      pattern: "url(#crawlingPattern-0000002b)",
      label: "Code Quality",
      description: "Excellence in code construction.",
    },
    {
      labelTransform: {
        group: "translate(212, 377)",
        text: "translate(102, 22)",
        position: { x: -79.02, y: 7.5 },
      },
      descriptionTransform: {
        group: "translate(116, 401)",
        text: "translate(198, 16)",
        position: { x: -176.1, y: 6.5 },
      },
      color: "#e0cb15",
      pattern: "url(#crawlingPattern-ffec4b59)",
      label: "Figma Design",
      description: "Visual representation of the product.",
    },
    {
      labelTransform: {
        group: "translate(752, 416)",
        text: "translate(10, 22)",
        position: { x: 2, y: 7.5 },
      },
      descriptionTransform: {
        group: "translate(752, 440)",
        text: "translate(10, 16)",
        position: { x: 2, y: 6.5 },
      },
      color: "#ba5de5",
      pattern: "url(#crawlingPattern-9200d678)",
      label: "AI Agent",
      description: "Automated assistance for task management.",
    },
  ];
  const DEFAULT_CALLOUT_COLORS = CALLOUT_SLOTS.map((slot) => slot.color);

  class IcebergSimpleMountain {
    constructor(config) {
      this.data = Array.isArray(config.data) ? config.data : [];
      this.width = config.width || ORIGINAL_WIDTH;
      this.height = config.height || ORIGINAL_HEIGHT;
      this.textColor = config.textColor || "#484848";
      this.colors =
        Array.isArray(config.colors) && config.colors.length
          ? config.colors
          : DEFAULT_CALLOUT_COLORS;
      this.options = config.options || {};
      this.title =
        this.options.title ||
        "Unveiling the Depths of Software Development Success.";
      this.showWaterLine =
        this.options.showWaterLine !== undefined
          ? this.options.showWaterLine
          : true;
      this.peakLabel =
        this.options.peakLabel || this.options.visibleLabel || "Visible Peak";
      this.depthLabel =
        this.options.depthLabel || this.options.hiddenLabel || "Hidden Depths";
    }

    getResponsiveFontSize(multiplier, minSize) {
      return Math.max(minSize, this.width * multiplier);
    }

    escapeHtml(text) {
      const div = document.createElement("div");
      div.textContent = text || "";
      return div.innerHTML;
    }

    getCalloutEntries() {
      return CALLOUT_SLOTS.map((slot, index) => {
        const source = this.data[index] || {};
        const resolvedColor =
          source.color ||
          (this.colors && this.colors[index % this.colors.length]) ||
          slot.color;
        return {
          slot,
          label: this.escapeHtml(source.label || slot.label),
          description: this.escapeHtml(source.description || slot.description),
          color: resolvedColor,
          pattern: source.pattern || slot.pattern,
        };
      });
    }

    renderCallout({ slot, label, description, color, pattern }) {
      const descColor = this.textColor;
      const labelFontSize = this.getResponsiveFontSize(0.018, 16);
      const descriptionFontSize = this.getResponsiveFontSize(0.014, 13);
      return `
      <g transform="${slot.labelTransform.group}">
        <g stroke="none" fill="${color}" fill-opacity="1">
          <g>
            <text
              style="font: bold ${labelFontSize}px &quot;Shantell Sans&quot;, cursive; white-space: pre;"
              transform="${slot.labelTransform.text}"
              font-weight="bold"
              font-size="${labelFontSize}"
              font-family="'Shantell Sans', cursive"
            >
              <tspan x="${slot.labelTransform.position.x}" y="${slot.labelTransform.position.y}" dominant-baseline="ideographic">${label}</tspan>
            </text>
          </g>
        </g>
        <g stroke="none" fill="${pattern}" fill-opacity="1">
          <g>
            <text
              style="font: bold ${labelFontSize}px &quot;Shantell Sans&quot;, cursive; white-space: pre;"
              transform="${slot.labelTransform.text}"
              font-weight="bold"
              font-size="${labelFontSize}"
              font-family="'Shantell Sans', cursive"
            >
              <tspan x="${slot.labelTransform.position.x}" y="${slot.labelTransform.position.y}" dominant-baseline="ideographic">${label}</tspan>
            </text>
          </g>
        </g>
      </g>
      <g transform="${slot.descriptionTransform.group}">
        <g stroke="none" fill="${descColor}" fill-opacity="1">
          <g>
            <text
              style="font: ${descriptionFontSize}px &quot;Shantell Sans&quot;, cursive; white-space: pre;"
              transform="${slot.descriptionTransform.text}"
              font-size="${descriptionFontSize}"
              font-family="'Shantell Sans', cursive"
            >
              <tspan x="${slot.descriptionTransform.position.x}" y="${slot.descriptionTransform.position.y}" dominant-baseline="ideographic">${description}</tspan>
            </text>
          </g>
        </g>
        <g stroke="none" fill="url(#crawlingPattern-ffffff31)" fill-opacity="1">
          <g>
            <text
              style="font: ${descriptionFontSize}px &quot;Shantell Sans&quot;, cursive; white-space: pre;"
              transform="${slot.descriptionTransform.text}"
              font-size="${descriptionFontSize}"
              font-family="'Shantell Sans', cursive"
            >
              <tspan x="${slot.descriptionTransform.position.x}" y="${slot.descriptionTransform.position.y}" dominant-baseline="ideographic">${description}</tspan>
            </text>
          </g>
        </g>
      </g>
    `;
    }

    generateCallouts() {
      return this.getCalloutEntries()
        .map((entry) => this.renderCallout(entry))
        .join("\n");
    }

    generateTitle() {
      const title = this.escapeHtml(this.title);
      const titleFontSize = this.getResponsiveFontSize(0.023, 20);
      return `
      <g transform="translate(236, 50.00001525878906)">
        <g stroke="none" fill="${this.textColor}" fill-opacity="1">
          <g>
            <text
              style="font: bold ${titleFontSize}px &quot;Shantell Sans&quot;, cursive; white-space: pre;"
              transform="translate(302, 22)"
              font-weight="bold"
              font-size="${titleFontSize}"
              font-family="'Shantell Sans', cursive"
            >
              <tspan x="-286.49" y="13.5" dominant-baseline="ideographic">${title}</tspan>
            </text>
          </g>
        </g>
        <g stroke="none" fill="url(#crawlingPattern-ffffff31)" fill-opacity="1">
          <g>
            <text
              style="font: bold ${titleFontSize}px &quot;Shantell Sans&quot;, cursive; white-space: pre;"
              transform="translate(302, 22)"
              font-weight="bold"
              font-size="${titleFontSize}"
              font-family="'Shantell Sans', cursive"
            >
              <tspan x="-286.49" y="13.5" dominant-baseline="ideographic">${title}</tspan>
            </text>
          </g>
        </g>
      </g>
    `;
    }

    generateSectionLabels() {
      const peak = this.escapeHtml(this.peakLabel);
      const depth = this.escapeHtml(this.depthLabel);
      const sectionFontSize = this.getResponsiveFontSize(0.018, 16);
      return `
      <text
        x="540"
        y="220"
        text-anchor="middle"
        dominant-baseline="middle"
        fill="${this.textColor}"
        font-size="${sectionFontSize}"
        font-weight="600"
        font-family="'Shantell Sans', cursive"
      >${peak}</text>
      <text
        x="540"
        y="420"
        text-anchor="middle"
        dominant-baseline="middle"
        fill="${this.textColor}"
        font-size="${sectionFontSize}"
        font-weight="600"
        font-family="'Shantell Sans', cursive"
      >${depth}</text>
    `;
    }

    getBackgroundGroup() {
      return `
      <g transform="translate(18, 12)">
        <g stroke="none" fill="#ffffff" fill-opacity="1">
          <g><path d="${SIMPLE_MOUNTAIN_PATHS.background}"></path></g>
        </g>
      </g>
    `;
    }

    getAboveWaterGroup() {
      return `
      <g transform="translate(332, 110.00001525878906)">
        <g stroke="none" fill="#ebebeb" fill-opacity="1">
          <g><path d="${SIMPLE_MOUNTAIN_PATHS.aboveFill}"></path></g>
        </g>
        <g stroke="none" fill="url(#crawlingPattern-b8b8b81a)" fill-opacity="1">
          <g><path d="${SIMPLE_MOUNTAIN_PATHS.aboveFill}"></path></g>
        </g>
        <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke="#ffffff" stroke-width="2" stroke-opacity="1">
          <g><path d="${SIMPLE_MOUNTAIN_PATHS.aboveStroke}"></path></g>
        </g>
      </g>
    `;
    }

    getBelowWaterGroup() {
      return `
      <g transform="translate(388.8359680175781, 255.25596618652344)">
        <g stroke="none" fill="#d1f4ff" fill-opacity="1">
          <g><path d="${SIMPLE_MOUNTAIN_PATHS.belowFill}"></path></g>
        </g>
        <g stroke="none" fill="url(#crawlingPattern-6bdcff1a)" fill-opacity="1">
          <g><path d="${SIMPLE_MOUNTAIN_PATHS.belowFill}"></path></g>
        </g>
        <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke="#ffffff" stroke-width="2" stroke-opacity="1">
          <g><path d="${SIMPLE_MOUNTAIN_PATHS.belowStroke}"></path></g>
        </g>
      </g>
    `;
    }

    getWaterlineGroup() {
      if (!this.showWaterLine) {
        return "";
      }
      return `
      <g transform="translate(56, 242.00001525878906)">
        <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke="#484848" stroke-width="2" stroke-opacity="1">
          <g><path d="${SIMPLE_MOUNTAIN_PATHS.waterline}"></path></g>
        </g>
        <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke="#ffffff25" stroke-width="2" stroke-opacity="1" stroke-dasharray="4,6">
          <animate attributeName="stroke-dashoffset" values="30;0" dur="1s" repeatCount="indefinite" begin="0"></animate>
          <g><path d="${SIMPLE_MOUNTAIN_PATHS.waterline}"></path></g>
        </g>
      </g>
    `;
    }

    getConnectorGroups() {
      return `
      <g transform="translate(361, 157.9960174560547)">
        <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke="#484848" stroke-width="2" stroke-opacity="1">
          <g>
            <path d="M 10 10.003906L 176 10.003906"></path>
            <path d="M 170 16.503906L 176.5 10.003906L 170 3.503906" stroke-dasharray="none"></path>
          </g>
        </g>
        <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke="#ffffff25" stroke-width="2" stroke-opacity="1" stroke-dasharray="4,6">
          <animate attributeName="stroke-dashoffset" values="30;0" dur="1s" repeatCount="indefinite" begin="0"></animate>
          <g>
            <path d="M 10 10.003906L 176 10.003906"></path>
            <path d="M 170 16.503906L 176.5 10.003906L 170 3.503906" stroke-dasharray="none"></path>
          </g>
        </g>
      </g>
      <g transform="translate(368, 317)">
        <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke="#484848" stroke-width="2" stroke-dasharray="0.1, 6.0" stroke-opacity="1">
          <g>
            <path d="M 10 10L 170 10"></path>
            <path d="M 164 16.5L 170.5 10L 164 3.5" stroke-dasharray="none"></path>
          </g>
        </g>
        <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke="#ffffff25" stroke-width="2" stroke-opacity="1" stroke-dasharray="4,6">
          <animate attributeName="stroke-dashoffset" values="30;0" dur="1s" repeatCount="indefinite" begin="0"></animate>
          <g>
            <path d="M 10 10L 170 10"></path>
            <path d="M 164 16.5L 170.5 10L 164 3.5" stroke-dasharray="none"></path>
          </g>
        </g>
      </g>
      <g transform="translate(530, 356)">
        <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke="#484848" stroke-width="2" stroke-dasharray="0.1, 6.0" stroke-opacity="1">
          <g>
            <path d="M 12 10L 172 10"></path>
            <path d="M 18 3.5L 11.5 10L 18 16.5" stroke-dasharray="none"></path>
          </g>
        </g>
        <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke="#ffffff25" stroke-width="2" stroke-opacity="1" stroke-dasharray="4,6">
          <animate attributeName="stroke-dashoffset" values="30;0" dur="1s" repeatCount="indefinite" begin="0"></animate>
          <g>
            <path d="M 12 10L 172 10"></path>
            <path d="M 18 3.5L 11.5 10L 18 16.5" stroke-dasharray="none"></path>
          </g>
        </g>
      </g>
      <g transform="translate(368, 395)">
        <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke="#484848" stroke-width="2" stroke-dasharray="0.1, 6.0" stroke-opacity="1">
          <g>
            <path d="M 10 10L 128 10"></path>
            <path d="M 122 16.5L 128.5 10L 122 3.5" stroke-dasharray="none"></path>
          </g>
        </g>
        <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke="#ffffff25" stroke-width="2" stroke-opacity="1" stroke-dasharray="4,6">
          <animate attributeName="stroke-dashoffset" values="30;0" dur="1s" repeatCount="indefinite" begin="0"></animate>
          <g>
            <path d="M 10 10L 128 10"></path>
            <path d="M 122 16.5L 128.5 10L 122 3.5" stroke-dasharray="none"></path>
          </g>
        </g>
      </g>
      <g transform="translate(572, 434)">
        <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke="#484848" stroke-width="2" stroke-dasharray="0.1, 6.0" stroke-opacity="1">
          <g>
            <path d="M 12 10L 130 10"></path>
            <path d="M 18 3.5L 11.5 10L 18 16.5" stroke-dasharray="none"></path>
          </g>
        </g>
        <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke="#ffffff25" stroke-width="2" stroke-opacity="1" stroke-dasharray="4,6">
          <animate attributeName="stroke-dashoffset" values="30;0" dur="1s" repeatCount="indefinite" begin="0"></animate>
          <g>
            <path d="M 12 10L 130 10"></path>
            <path d="M 18 3.5L 11.5 10L 18 16.5" stroke-dasharray="none"></path>
          </g>
        </g>
      </g>
    `;
    }

    getDefs() {
      return `
      <defs>
        <pattern id="crawlingPattern-b8b8b81a" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse" fill="#b8b8b81a">
          <use href="#crawlingSymbol"></use>
        </pattern>
        <symbol id="crawlingSymbol">
          <g>
            <animateTransform attributeName="transform" type="translate" from="0 0" to="-12 0" dur="0.4s" repeatCount="indefinite"></animateTransform>
            <path d="M -12.5 12.5 l 13 -13 l 6 0 l -13 13 Z M -0.5 12.5 l 13 -13 l 6 0 l -13 13 Z M 11.5 12.5 l 13 -13 l 6 0 l -13 13 Z"></path>
          </g>
        </symbol>
        <pattern id="crawlingPattern-6bdcff1a" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse" fill="#6bdcff1a">
          <use href="#crawlingSymbol"></use>
        </pattern>
        <pattern id="crawlingPattern-ffffff31" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse" fill="#ffffff31">
          <use href="#crawlingSymbol"></use>
        </pattern>
        <pattern id="crawlingPattern-0054dc93" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse" fill="#0054dc93">
          <use href="#crawlingSymbol"></use>
        </pattern>
        <pattern id="crawlingPattern-0000002b" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse" fill="#0000002b">
          <use href="#crawlingSymbol"></use>
        </pattern>
        <pattern id="crawlingPattern-ffec4b59" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse" fill="#ffec4b59">
          <use href="#crawlingSymbol"></use>
        </pattern>
        <pattern id="crawlingPattern-9200d678" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse" fill="#9200d678">
          <use href="#crawlingSymbol"></use>
        </pattern>
      </defs>
    `;
    }

    generateChart() {
      return `
      ${this.getBackgroundGroup()}
      ${this.getAboveWaterGroup()}
      ${this.getWaterlineGroup()}
      ${this.getBelowWaterGroup()}
      ${this.getConnectorGroups()}
      ${this.generateTitle()}
      ${this.generateCallouts()}
      ${this.generateSectionLabels()}
    `;
    }

    generate() {
      const content = this.generateChart();

      return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${ORIGINAL_WIDTH} ${ORIGINAL_HEIGHT}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Iceberg Simple Mountain Chart">
  <title>Iceberg Simple Mountain Chart</title>
  <desc>Simple mountain-shaped iceberg chart with visible and hidden insights</desc>
  <style>@import url('https://fonts.googleapis.com/css2?family=Shantell+Sans:wght@300..800&amp;display=block');</style>
  ${this.getDefs()}
  ${content}
</svg>`.trim();
    }
  }

  if (globalScope) {
    globalScope.IcebergSimpleMountain = IcebergSimpleMountain;
  }
})(typeof window !== "undefined" ? window : globalThis);


// ========== charts/JourneyCards.js ==========
/**
 * Journey Cards Chart - PowerPoint SmartArt CONTINUOUS_CYCLE Style
 * Cards with curved arc arrows and separate level labels
 * Matches PowerPoint SmartArt rendering
 */

class JourneyCards {
  constructor(config) {
    this.data = config.data || [];
    this.colors = config.colors || [
      "#8064A2", // Purple
      "#5F5BAE",
      "#537ABA",
      "#4BACC6", // Cyan
    ];
    this.width = config.width || 720;
    this.height = config.height || 540;
    this.textColor = config.textColor || "#000000";
    this.onItemClick = config.onItemClick;
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
  }

  /**
   * Generate curved arrow path (arc)
   * PowerPoint style: curved connection above or below cards
   */
  generateCurvedArrow(x1, y1, x2, y2, curveUp = true) {
    const midX = (x1 + x2) / 2;
    const curveHeight = Math.abs(x2 - x1) * 0.3;
    const curveY = curveUp ? y1 - curveHeight : y1 + curveHeight;

    // Quadratic bezier curve
    const path = `M ${x1} ${y1} Q ${midX} ${curveY} ${x2} ${y2}`;

    // Arrow head at end
    const angle = Math.atan2(y2 - curveY, x2 - midX);
    const arrowSize = 8;
    const arrowX1 = x2 - arrowSize * Math.cos(angle - Math.PI / 6);
    const arrowY1 = y2 - arrowSize * Math.sin(angle - Math.PI / 6);
    const arrowX2 = x2 - arrowSize * Math.cos(angle + Math.PI / 6);
    const arrowY2 = y2 - arrowSize * Math.sin(angle + Math.PI / 6);

    return {
      curve: path,
      arrow: `M ${arrowX1} ${arrowY1} L ${x2} ${y2} L ${arrowX2} ${arrowY2}`,
    };
  }

  /**
   * Generate the chart - PowerPoint CONTINUOUS_CYCLE style
   */
  generateChart() {
    const numItems = Math.min(this.data.length, 5);
    if (numItems === 0) return "";

    // Layout calculations
    const margin = this.width * 0.05;
    const cardAreaWidth = this.width - margin * 2;
    const cardWidth = cardAreaWidth / numItems * 0.85;
    const cardHeight = this.height * 0.35;
    const cardSpacing = (cardAreaWidth - cardWidth * numItems) / (numItems - 1 || 1);
    const startX = margin;

    // Vertical positions
    const cardY = this.height * 0.25;
    const labelY = cardY + cardHeight + this.height * 0.08;
    const labelHeight = this.height * 0.15;

    let svg = "";

    // Draw curved arrows between cards
    for (let i = 0; i < numItems - 1; i++) {
      const color = this.colors[i % this.colors.length];
      const x1 = startX + i * (cardWidth + cardSpacing) + cardWidth;
      const x2 = startX + (i + 1) * (cardWidth + cardSpacing);
      const y = labelY + labelHeight / 2;

      // Alternate curve direction
      const curveUp = i % 2 === 0;
      const { curve, arrow } = this.generateCurvedArrow(
        x1, y,
        x2, y,
        curveUp
      );

      // Lighter color for arrow
      svg += `
        <path d="${curve}"
              stroke="${color}"
              stroke-width="2"
              fill="none"
              opacity="0.6"/>
        <path d="${arrow}"
              stroke="${color}"
              stroke-width="2"
              fill="none"
              opacity="0.6"/>
      `;
    }

    // Draw cards and labels
    this.data.slice(0, numItems).forEach((item, index) => {
      const x = startX + index * (cardWidth + cardSpacing);
      const color = item.color || this.colors[index % this.colors.length];
      const borderRadius = 8;

      // Card - white background with colored border (PowerPoint style)
      svg += `
        <rect x="${x}" y="${cardY}"
              width="${cardWidth}" height="${cardHeight}"
              fill="#FFFFFF"
              fill-opacity="0.9"
              stroke="${color}"
              stroke-width="2"
              rx="${borderRadius}"/>
      `;

      // Card content - label and description
      const labelText = item.label || `Item ${index + 1}`;
      const fontSize = Math.max(12, cardWidth * 0.1);

      svg += `
        <text x="${x + cardWidth / 2}" y="${cardY + cardHeight * 0.35}"
              text-anchor="middle"
              dominant-baseline="middle"
              fill="${this.textColor}"
              font-size="${fontSize}"
              font-weight="600"
              font-family="Arial, sans-serif">
          ${this.escapeHtml(labelText.slice(0, 12))}
        </text>
      `;

      // Description inside card
      if (item.description) {
        svg += `
          <text x="${x + cardWidth / 2}" y="${cardY + cardHeight * 0.55}"
                text-anchor="middle"
                dominant-baseline="middle"
                fill="${this.textColor}"
                fill-opacity="0.7"
                font-size="${fontSize * 0.75}"
                font-family="Arial, sans-serif">
            • ${this.escapeHtml(item.description.slice(0, 15))}
          </text>
        `;
      }

      // Level label box below card (colored, rounded rectangle)
      svg += `
        <rect x="${x}" y="${labelY}"
              width="${cardWidth}" height="${labelHeight}"
              fill="${color}"
              stroke="#FFFFFF"
              stroke-width="2"
              rx="${borderRadius}"/>
      `;

      // Level text
      const levelText = item.levelLabel || `Level ${index + 1}`;
      svg += `
        <text x="${x + cardWidth / 2}" y="${labelY + labelHeight / 2}"
              text-anchor="middle"
              dominant-baseline="middle"
              fill="#FFFFFF"
              font-size="${fontSize}"
              font-weight="600"
              font-family="Arial, sans-serif">
          ${this.escapeHtml(levelText)}
        </text>
      `;
    });

    return svg;
  }

  /**
   * Generate full SVG
   */
  generate() {
    const content = this.generateChart();

    return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Journey Cards Chart">
  <title>Journey Cards Chart</title>
  <desc>Cards with curved arrows (PowerPoint CONTINUOUS_CYCLE style)</desc>
  <rect x="0" y="0" width="${this.width}" height="${this.height}" fill="#FFFFFF"/>
  ${content}
</svg>`.trim();
  }
}

// Export
if (typeof window !== "undefined") {
  window.JourneyCards = JourneyCards;
}


// ========== charts/JourneyRocks.js ==========
/**
 * Journey Rocks Chart - PowerPoint SmartArt INCREASING_CIRCLE_PROCESS Style
 * Curved line with arrowhead and increasing size circles along the path
 * Matches PowerPoint SmartArt rendering
 */

class JourneyRocks {
  constructor(config) {
    this.data = config.data || [];
    this.colors = config.colors || [
      "#7B9ED8", // Light blue (smallest)
      "#8064A2", // Purple
      "#7B9ED8", // Blue
      "#9BBB59", // Green
      "#9BBB59", // Green (largest)
    ];
    this.lineColor = config.lineColor || "#C5D5A6";
    this.arrowColor = config.arrowColor || "#C5D5A6";
    this.width = config.width || 720;
    this.height = config.height || 540;
    this.textColor = config.textColor || "#000000";
    this.onItemClick = config.onItemClick;
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
  }

  /**
   * Generate the chart - PowerPoint INCREASING_CIRCLE_PROCESS style
   */
  generateChart() {
    const numItems = Math.min(this.data.length, 6);
    if (numItems === 0) return "";

    let svg = "";

    // Calculate circle positions along curved path
    const circles = this.calculateCirclePositions(numItems);

    // Draw curved line through circle centers
    svg += this.generateCurvedLine(circles);

    // Draw arrowhead at the end
    svg += this.generateArrowHead(circles);

    // Draw circles with white stroke
    circles.forEach((circle, index) => {
      const item = this.data[index];
      const color = item.color || this.colors[index % this.colors.length];

      svg += `
        <circle cx="${circle.x}" cy="${circle.y}"
                r="${circle.radius}"
                fill="${color}"
                stroke="#FFFFFF"
                stroke-width="2"/>
      `;
    });

    // Draw labels to the right of each circle
    circles.forEach((circle, index) => {
      const item = this.data[index];
      const labelX = circle.x + circle.radius + 15;
      const labelY = circle.y;

      // Font size scales with chart size
      const fontSize = Math.max(14, Math.min(24, this.width * 0.032));

      // Main label
      const labelText = item.label || `Item ${index + 1}`;

      svg += `
        <text x="${labelX}" y="${labelY}"
              text-anchor="start"
              dominant-baseline="middle"
              fill="${this.textColor}"
              font-size="${fontSize}"
              font-weight="600"
              font-family="Arial, sans-serif">
          ${this.escapeHtml(labelText)}
        </text>
      `;

      // Description (sub-item) if provided
      if (item.description) {
        svg += `
          <text x="${labelX}" y="${labelY + fontSize * 1.3}"
                text-anchor="start"
                dominant-baseline="middle"
                fill="${this.textColor}"
                fill-opacity="0.7"
                font-size="${fontSize * 0.8}"
                font-family="Arial, sans-serif">
            • ${this.escapeHtml(item.description.slice(0, 25))}
          </text>
        `;
      }
    });

    return svg;
  }

  /**
   * Calculate circle positions and sizes along curved path
   * Path goes from bottom-left to top-right
   */
  calculateCirclePositions(numItems) {
    const circles = [];

    // Circle sizes increase progressively
    const minRadius = Math.min(this.width, this.height) * 0.025;
    const maxRadius = Math.min(this.width, this.height) * 0.09;
    const radiusStep = (maxRadius - minRadius) / Math.max(numItems - 1, 1);

    // Define curve control points (bottom-left to top-right)
    const startX = this.width * 0.12;
    const startY = this.height * 0.85;
    const endX = this.width * 0.45;
    const endY = this.height * 0.18;

    // Quadratic bezier control point
    const cpX = this.width * 0.15;
    const cpY = this.height * 0.35;

    for (let i = 0; i < numItems; i++) {
      const t = i / Math.max(numItems - 1, 1);

      // Quadratic bezier formula: B(t) = (1-t)²P0 + 2(1-t)tP1 + t²P2
      const oneMinusT = 1 - t;
      const x = oneMinusT * oneMinusT * startX + 2 * oneMinusT * t * cpX + t * t * endX;
      const y = oneMinusT * oneMinusT * startY + 2 * oneMinusT * t * cpY + t * t * endY;

      // Radius increases with each step
      const radius = minRadius + i * radiusStep;

      circles.push({ x, y, radius, t });
    }

    return circles;
  }

  /**
   * Generate curved line path through circles
   */
  generateCurvedLine(circles) {
    if (circles.length < 2) return "";

    const startX = this.width * 0.05;
    const startY = this.height * 0.92;
    const endX = this.width * 0.52;
    const endY = this.height * 0.12;
    const cpX = this.width * 0.12;
    const cpY = this.height * 0.30;

    const lineWidth = Math.max(3, this.width * 0.006);

    return `
      <path d="M ${startX} ${startY} Q ${cpX} ${cpY} ${endX} ${endY}"
            stroke="${this.lineColor}"
            stroke-width="${lineWidth}"
            fill="none"
            stroke-linecap="round"/>
    `;
  }

  /**
   * Generate triangular arrowhead at the end
   */
  generateArrowHead(circles) {
    // Arrowhead position at top-right, pointing up-right
    const tipX = this.width * 0.58;
    const tipY = this.height * 0.08;

    // Arrow size
    const arrowSize = Math.min(this.width, this.height) * 0.12;

    // Triangle pointing up-right (like PowerPoint)
    const baseX1 = tipX - arrowSize * 0.9;
    const baseY1 = tipY + arrowSize * 0.3;
    const baseX2 = tipX - arrowSize * 0.3;
    const baseY2 = tipY + arrowSize * 0.9;

    return `
      <path d="M ${tipX} ${tipY} L ${baseX1} ${baseY1} L ${baseX2} ${baseY2} Z"
            fill="${this.arrowColor}"
            stroke="#FFFFFF"
            stroke-width="1"/>
    `;
  }

  /**
   * Generate full SVG
   */
  generate() {
    const content = this.generateChart();

    return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Increasing Circle Process Chart">
  <title>Increasing Circle Process Chart</title>
  <desc>Curved line with increasing circles (PowerPoint INCREASING_CIRCLE_PROCESS style)</desc>
  <rect x="0" y="0" width="${this.width}" height="${this.height}" fill="#FFFFFF"/>
  ${content}
</svg>`.trim();
  }
}

// Export
if (typeof window !== "undefined") {
  window.JourneyRocks = JourneyRocks;
}


// ========== charts/MatrixCurvedQuadrant.js ==========
/**
 * Priority Matrix - Curved Quadrant Chart - Vanilla JavaScript
 * Based on chart_matrix_curved_quadrant.html (原 chart_14)
 *
 * Features:
 * - 4 quadrant areas with curved paths
 * - Curved divider lines between quadrants
 * - Center point radiation
 * - Organic boundaries
 * - Original dimensions: 792×756
 */

class MatrixCurvedQuadrant {
  constructor(config) {
    this.data = config.data || [];
    this.colors = config.colors || ["#7862d1", "#4f92ff", "#3cc583", "#de8431"];
    this.width = config.width || 792;
    this.height = config.height || 756;
    this.textColor = config.textColor || "#484848";
    this.showCurvedDividers =
      config.showCurvedDividers !== undefined
        ? config.showCurvedDividers
        : true;
    this.onItemClick = config.onItemClick;
  }

  /**
   * Quadrant paths (complex curved shapes)
   */
  getQuadrantPaths() {
    return [
      // cp_1 (bottom-left): curved L-shape
      `M 135.436 10L 135.436 178C 79.8454 178 34.0645 220.0006 28.0952 274L 10 274C 15.4793 216.0047 60.2681 169.4532 117.436 161.276L 117.436 10L 135.436 10Z`,

      // cp_2 (top-right): curved horizontal strip
      `M 106 135.436015C 106 79.845415 63.9994 34.064515 10 28.095215L 10 10.000015C 67.9952 15.479315 114.5468 60.268115 122.724 117.436015L 346 117.436015L 346 135.436015L 106 135.436015Z`,

      // cp_3 (bottom-right): curved L-shape mirrored
      `M 10 274L 28 274L 28 123.436C 88.0094 117.7664 135.7664 70.0094 141.436 10L 123.3409 10C 117.3715 63.9994 71.5906 106 16 106C 13.9867 106 11.9862 105.9449 10 105.8362L 10 274Z`,

      // cp_4 (top-left): curved corner piece
      `M 10 10L 250 10C 250 63.5139 288.9212 107.9373 340 116.5067L 340 134.724C 284.8176 126.8308 241.1692 83.1824 233.276 28L 10 28L 10 10Z`,
    ];
  }

  /**
   * Original quadrant positions
   */
  getQuadrantPositions() {
    return [
      { x: 260.56396484375, y: 122 }, // cp_1 (bottom-left)
      { x: 398, y: 272.564453125 }, // cp_2 (top-right)
      { x: 380, y: 410 }, // cp_3 (bottom-right)
      { x: 38, y: 398 }, // cp_4 (top-left)
    ];
  }

  /**
   * Label offsets for each quadrant
   */
  getLabelOffsets() {
    return [
      { x: 70, y: 140 }, // cp_1
      { x: 220, y: 70 }, // cp_2
      { x: 75, y: 140 }, // cp_3
      { x: 120, y: 60 }, // cp_4
    ];
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
  }

  /**
   * Generate the chart
   */
  generateChart() {
    const ORIGINAL_WIDTH = 792;
    const ORIGINAL_HEIGHT = 756;
    const maxItems = 4;
    const numItems = Math.min(this.data.length, maxItems);

    const scaleX = this.width / ORIGINAL_WIDTH;
    const scaleY = this.height / ORIGINAL_HEIGHT;

    const quadrantPaths = this.getQuadrantPaths();
    const quadrantPositions = this.getQuadrantPositions();
    const labelOffsets = this.getLabelOffsets();

    let svg = "";

    // Quadrant areas
    this.data.slice(0, numItems).forEach((item, index) => {
      const quadIndex = item.quadrant !== undefined ? item.quadrant : index;
      if (quadIndex >= 4) return;

      const pos = quadrantPositions[quadIndex];
      const path = quadrantPaths[quadIndex];
      const color = item.color || this.colors[index % this.colors.length];
      const primaryTextColor = this.resolveTextColor
        ? this.resolveTextColor(color)
        : this.textColor;
      const secondaryTextColor = this.resolveTextColor
        ? this.resolveTextColor(color, true, primaryTextColor)
        : this.textColor;

      const tx = pos.x * scaleX;
      const ty = pos.y * scaleY;

      svg += `
        <g transform="translate(${tx}, ${ty}) scale(${scaleX}, ${scaleY})">
          <!-- Quadrant shape -->
          <path
            d="${path}"
            fill="${color}"
            stroke="${this.textColor}"
            stroke-width="2"
            stroke-linejoin="round"
            stroke-linecap="round"
            opacity="0.9"/>

          <!-- Label -->
          <text
            x="${labelOffsets[quadIndex].x}"
            y="${labelOffsets[quadIndex].y}"
            text-anchor="middle"
            dominant-baseline="middle"
            fill="${primaryTextColor}"
            font-size="${Math.max(15, 22 / scaleX)}"
            font-weight="700">
            ${this.escapeHtml(item.label)}
          </text>
      `;

      // Description
      if (item.description) {
        svg += `
          <text
            x="${labelOffsets[quadIndex].x}"
            y="${labelOffsets[quadIndex].y + 20}"
            text-anchor="middle"
            dominant-baseline="middle"
            fill="${secondaryTextColor}"
            font-size="${Math.max(11, 14 / scaleX)}"
            opacity="0.9">
            ${this.escapeHtml(item.description)}
          </text>
        `;
      }

      svg += `</g>`;
    });

    return svg;
  }

  /**
   * Generate full SVG
   */
  generate() {
    const content = this.generateChart();

    return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Matrix Curved Quadrant Chart">
  <title>Matrix Curved Quadrant Chart</title>
  <desc>Four-quadrant matrix with curved dividers</desc>
  ${content}
</svg>`.trim();
  }
}

// Export
if (typeof window !== "undefined") {
  window.MatrixCurvedQuadrant = MatrixCurvedQuadrant;
}


// ========== charts/MatrixGrid2x2.js ==========
(function (globalScope) {
  /**
   * Priority Matrix - 2x2 Grid Chart - Vanilla JavaScript
   * Based on chart_matrix_grid_2x2.html (原 chart_12)
   */

  const ORIGINAL_WIDTH = 816;
  const ORIGINAL_HEIGHT = 720;
  const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;
  const CARD_BASE_SIZE = 190;
  const PATH_MIN = 10;
  const TARGET_CARD_HEIGHT = 235;
  const TARGET_CARD_WIDTH = TARGET_CARD_HEIGHT * GOLDEN_RATIO;
  const GAP_X = 48;
  const GAP_Y = 48;

  const CARD_LAYOUT = (() => {
    const totalWidth = TARGET_CARD_WIDTH * 2 + GAP_X;
    const totalHeight = TARGET_CARD_HEIGHT * 2 + GAP_Y;
    const gridLeft = (ORIGINAL_WIDTH - totalWidth) / 2;
    const gridTop = (ORIGINAL_HEIGHT - totalHeight) / 2;
    const scaleX = TARGET_CARD_WIDTH / CARD_BASE_SIZE;
    const scaleY = TARGET_CARD_HEIGHT / CARD_BASE_SIZE;
    const pathOffsetX = PATH_MIN * scaleX;
    const pathOffsetY = PATH_MIN * scaleY;

    const positions = [
      { x: gridLeft, y: gridTop },
      { x: gridLeft + TARGET_CARD_WIDTH + GAP_X, y: gridTop },
      { x: gridLeft, y: gridTop + TARGET_CARD_HEIGHT + GAP_Y },
      {
        x: gridLeft + TARGET_CARD_WIDTH + GAP_X,
        y: gridTop + TARGET_CARD_HEIGHT + GAP_Y,
      },
    ];

    const cards = positions.map((pos) => ({
      translateX: pos.x - pathOffsetX,
      translateY: pos.y - pathOffsetY,
      centerX: pos.x + TARGET_CARD_WIDTH / 2,
      centerY: pos.y + TARGET_CARD_HEIGHT / 2,
    }));

    return {
      scaleX,
      scaleY,
      cards,
      cardWidth: TARGET_CARD_WIDTH,
      cardHeight: TARGET_CARD_HEIGHT,
      gapX: GAP_X,
      gapY: GAP_Y,
      gridLeft,
      gridTop,
      totalWidth,
      totalHeight,
    };
  })();

  class MatrixGrid2x2 {
    constructor(config) {
      this.data = config.data || [];
      this.colors = config.colors || [
        "#7862d1",
        "#4f92ff",
        "#3cc583",
        "#de8431",
      ];
      this.width = config.width || ORIGINAL_WIDTH;
      this.height = config.height || ORIGINAL_HEIGHT;
      this.textColor = config.textColor || "#484848";
      this.xAxisLabel = config.xAxisLabel || "";
      this.yAxisLabel = config.yAxisLabel || "";
      this.quadrantLabels = config.quadrantLabels || [];
      this.onItemClick = config.onItemClick;
    }

    escapeHtml(text) {
      const div = document.createElement("div");
      div.textContent = text || "";
      return div.innerHTML;
    }

    generateChart() {
      const layout = CARD_LAYOUT;
      const maxItems = 4;
      const numItems = Math.min(this.data.length, maxItems);
      const rectPath =
        "M 21 10L 189 10C 195.075 10 200 14.925 200 21L 200 189C 200 195.075 195.075 200 189 200L 21 200C 14.925 200 10 195.075 10 189L 10 21C 10 14.925 14.925 10 21 10Z";

      let svg = "";

      if (this.xAxisLabel) {
        svg += `
        <text
          x="${layout.gridLeft + layout.totalWidth / 2}"
          y="${layout.gridTop + layout.totalHeight + 48}"
          text-anchor="middle"
          fill="${this.textColor}"
          font-size="18"
          font-weight="600">
          ${this.escapeHtml(this.xAxisLabel)}
        </text>
      `;
      }

      if (this.yAxisLabel) {
        const axisX = layout.gridLeft - 40;
        const axisY = layout.gridTop + layout.totalHeight / 2;
        svg += `
        <text
          x="${axisX}"
          y="${axisY}"
          text-anchor="middle"
          transform="rotate(-90 ${axisX} ${axisY})"
          fill="${this.textColor}"
          font-size="18"
          font-weight="600">
          ${this.escapeHtml(this.yAxisLabel)}
        </text>
      `;
      }

      this.data.slice(0, numItems).forEach((item, index) => {
        const quadIndex = item.quadrant !== undefined ? item.quadrant : index;
        if (quadIndex >= 4) return;

        const cardInfo = layout.cards[quadIndex];
        const color =
          item?.color || this.colors[quadIndex % this.colors.length];
        const primaryTextColor = this.resolveTextColor
          ? this.resolveTextColor(color)
          : this.textColor;
        const secondaryTextColor = this.resolveTextColor
          ? this.resolveTextColor(color, true, primaryTextColor)
          : this.textColor;

        svg += `
        <g transform="translate(${cardInfo.translateX}, ${
          cardInfo.translateY
        })">
          <g transform="scale(${layout.scaleX}, ${layout.scaleY})">
            <path
              d="${rectPath}"
              fill="${color}"
              stroke="${this.textColor}"
              stroke-width="2"
              stroke-linejoin="round"
              stroke-linecap="round"
              opacity="0.9"/>
          </g>
        </g>
      `;

        const labelText = item?.label || this.quadrantLabels[quadIndex] || "";
        const finalLabelLines = this.wrapLabel(labelText, 18);

        const labelFontSize = 24;
        const lineHeight = labelFontSize * 1.25;
        const labelStartY =
          cardInfo.centerY -
          ((finalLabelLines.length - 1) * lineHeight) / 2 -
          8;

        finalLabelLines.forEach((line, lineIndex) => {
          svg += `
        <text
          x="${cardInfo.centerX}"
          y="${labelStartY + lineIndex * lineHeight}"
          text-anchor="middle"
          fill="${primaryTextColor}"
          font-size="${labelFontSize}"
          font-weight="700">
          ${this.escapeHtml(line)}
        </text>
      `;
        });

        if (item?.description) {
          const descLines = this.wrapLabel(item.description, 30);
          const descFontSize = 16;
          const descLineHeight = descFontSize * 1.2;
          const descStartY =
            labelStartY + finalLabelLines.length * lineHeight + 12;

          descLines.forEach((line, lineIndex) => {
            svg += `
        <text
          x="${cardInfo.centerX}"
          y="${descStartY + lineIndex * descLineHeight}"
          text-anchor="middle"
          fill="${secondaryTextColor}"
          font-size="${descFontSize}"
          opacity="0.9">
          ${this.escapeHtml(line)}
        </text>
      `;
          });
        }
      });

      return svg;
    }

    wrapLabel(text, maxCharsPerLine = 18) {
      const tokens = (text || "").split(" ");
      const lines = [];
      let current = "";

      tokens.forEach((token) => {
        const tentative = current ? `${current} ${token}` : token;
        if (tentative.length > maxCharsPerLine && current) {
          lines.push(current);
          current = token;
        } else {
          current = tentative;
        }
      });

      if (current) {
        lines.push(current);
      }

      return lines;
    }

    generate() {
      const content = this.generateChart();

      return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${ORIGINAL_WIDTH} ${ORIGINAL_HEIGHT}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Matrix 2x2 Grid Chart">
  <title>Matrix 2x2 Grid Chart</title>
  <desc>2x2 quadrant matrix for prioritization</desc>
  ${content}
</svg>`.trim();
    }
  }

  if (globalScope) {
    globalScope.MatrixGrid2x2 = MatrixGrid2x2;
  }
})(typeof window !== "undefined" ? window : globalThis);


// ========== charts/MatrixGrid2x2Cards.js ==========
(function (globalScope) {
  /**
   * Matrix Grid 2x2 Cards - Vanilla JavaScript
   * Pure 2x2 grid with soft color cards (no arrows)
   */

  const ORIGINAL_WIDTH = 816;
  const ORIGINAL_HEIGHT = 720;
  const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;
  const CARD_BASE_SIZE = 190;
  const PATH_MIN = 10;
  const TARGET_CARD_HEIGHT = 235;
  const TARGET_CARD_WIDTH = TARGET_CARD_HEIGHT * GOLDEN_RATIO;
  const GAP_X = 48;
  const GAP_Y = 48;

  const CARD_LAYOUT = (() => {
    const totalWidth = TARGET_CARD_WIDTH * 2 + GAP_X;
    const totalHeight = TARGET_CARD_HEIGHT * 2 + GAP_Y;
    const gridLeft = (ORIGINAL_WIDTH - totalWidth) / 2;
    const gridTop = (ORIGINAL_HEIGHT - totalHeight) / 2;
    const scaleX = TARGET_CARD_WIDTH / CARD_BASE_SIZE;
    const scaleY = TARGET_CARD_HEIGHT / CARD_BASE_SIZE;
    const pathOffsetX = PATH_MIN * scaleX;
    const pathOffsetY = PATH_MIN * scaleY;

    const positions = [
      { x: gridLeft, y: gridTop },
      { x: gridLeft + TARGET_CARD_WIDTH + GAP_X, y: gridTop },
      { x: gridLeft, y: gridTop + TARGET_CARD_HEIGHT + GAP_Y },
      {
        x: gridLeft + TARGET_CARD_WIDTH + GAP_X,
        y: gridTop + TARGET_CARD_HEIGHT + GAP_Y,
      },
    ];

    const cards = positions.map((pos) => ({
      translateX: pos.x - pathOffsetX,
      translateY: pos.y - pathOffsetY,
      centerX: pos.x + TARGET_CARD_WIDTH / 2,
      centerY: pos.y + TARGET_CARD_HEIGHT / 2,
    }));

    return {
      scaleX,
      scaleY,
      cards,
      cardWidth: TARGET_CARD_WIDTH,
      cardHeight: TARGET_CARD_HEIGHT,
      gapX: GAP_X,
      gapY: GAP_Y,
      gridLeft,
      gridTop,
      totalWidth,
      totalHeight,
    };
  })();

  class MatrixGrid2x2Cards {
    constructor(config) {
      this.data = config.data || [];
      this.colors = config.colors || [
        "#c8ffe5",
        "#dce9ff",
        "#e9ffb9",
        "#d1f4ff",
      ];
      this.width = config.width || ORIGINAL_WIDTH;
      this.height = config.height || ORIGINAL_HEIGHT;
      this.textColor = config.textColor || "#484848";
      this.onItemClick = config.onItemClick;
    }

    escapeHtml(text) {
      const div = document.createElement("div");
      div.textContent = text || "";
      return div.innerHTML;
    }

    wrapText(text, maxCharsPerLine = 15) {
      const words = (text || "").split(" ");
      const lines = [];
      let currentLine = "";

      words.forEach((word) => {
        if (
          (currentLine + word).length > maxCharsPerLine &&
          currentLine.length > 0
        ) {
          lines.push(currentLine.trim());
          currentLine = word + " ";
        } else {
          currentLine += word + " ";
        }
      });

      if (currentLine.trim().length > 0) {
        lines.push(currentLine.trim());
      }

      return lines;
    }

    generateChart() {
      const layout = CARD_LAYOUT;
      const maxItems = 4;
      const numItems = Math.min(this.data.length, maxItems);
      const rectPath =
        "M 21 10L 189 10C 195.075 10 200 14.925 200 21L 200 189C 200 195.075 195.075 200 189 200L 21 200C 14.925 200 10 195.075 10 189L 10 21C 10 14.925 14.925 10 21 10Z";

      let svg = "";

      this.data.slice(0, numItems).forEach((item, index) => {
        const quadIndex = item.quadrant !== undefined ? item.quadrant : index;
        if (quadIndex >= 4) return;

        const cardInfo = layout.cards[quadIndex];
        const color = item.color || this.colors[quadIndex % this.colors.length];
        const primaryTextColor = this.resolveTextColor
          ? this.resolveTextColor(color)
          : this.textColor;
        const secondaryTextColor = this.resolveTextColor
          ? this.resolveTextColor(color, true, primaryTextColor)
          : this.textColor;

        svg += `
        <g transform="translate(${cardInfo.translateX}, ${
          cardInfo.translateY
        })">
          <g transform="scale(${layout.scaleX}, ${layout.scaleY})">
            <path
              d="${rectPath}"
              fill="${color}"
              stroke="#ffffff"
              stroke-width="2"
              stroke-linejoin="round"
              stroke-linecap="round"
              opacity="1"/>
          </g>
        </g>
      `;

        const labelLines = this.wrapText(item.label || "", 18);
        const labelFontSize = 24;
        const lineHeight = labelFontSize * 1.25;
        const labelStartY =
          cardInfo.centerY - ((labelLines.length - 1) * lineHeight) / 2 - 8;

        labelLines.forEach((line, lineIndex) => {
          svg += `
        <text
          x="${cardInfo.centerX}"
          y="${labelStartY + lineIndex * lineHeight}"
          text-anchor="middle"
          fill="${primaryTextColor}"
          font-size="${labelFontSize}"
          font-weight="700">
          ${this.escapeHtml(line)}
        </text>
      `;
        });

        if (item.description) {
          const descLines = this.wrapText(item.description, 30);
          const descFontSize = 16;
          const descLineHeight = descFontSize * 1.2;
          const descStartY = labelStartY + labelLines.length * lineHeight + 12;

          descLines.forEach((line, lineIndex) => {
            svg += `
          <text
            x="${cardInfo.centerX}"
            y="${descStartY + lineIndex * descLineHeight}"
            text-anchor="middle"
            fill="${secondaryTextColor}"
            font-size="${descFontSize}"
            opacity="0.8">
            ${this.escapeHtml(line)}
          </text>
        `;
          });
        }
      });

      return svg;
    }

    generate() {
      const content = this.generateChart();

      return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${ORIGINAL_WIDTH} ${ORIGINAL_HEIGHT}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Matrix 2x2 Cards">
  <title>Matrix 2x2 Cards</title>
  <desc>2x2 grid card layout</desc>
  <rect width="${ORIGINAL_WIDTH}" height="${ORIGINAL_HEIGHT}" fill="#ffffff"/>
  ${content}
</svg>`.trim();
    }
  }

  if (globalScope) {
    globalScope.MatrixGrid2x2Cards = MatrixGrid2x2Cards;
  }
})(typeof window !== "undefined" ? window : globalThis);


// ========== charts/MatrixGrid2x2WithArrows.js ==========
(function (globalScope) {
  /**
   * Matrix Grid 2x2 With Arrows - Vanilla JavaScript
   * Based on chart_matrix_grid_2x2.html
   */

  const ORIGINAL_WIDTH = 816;
  const ORIGINAL_HEIGHT = 720;
  const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;
  const CARD_BASE_SIZE = 190;
  const PATH_MIN = 10;
  const TARGET_CARD_HEIGHT = 235;
  const TARGET_CARD_WIDTH = TARGET_CARD_HEIGHT * GOLDEN_RATIO;
  const GAP_X = 48;
  const GAP_Y = 48;

  const CARD_LAYOUT = (() => {
    const totalWidth = TARGET_CARD_WIDTH * 2 + GAP_X;
    const totalHeight = TARGET_CARD_HEIGHT * 2 + GAP_Y;
    const gridLeft = (ORIGINAL_WIDTH - totalWidth) / 2;
    const gridTop = (ORIGINAL_HEIGHT - totalHeight) / 2;
    const scaleX = TARGET_CARD_WIDTH / CARD_BASE_SIZE;
    const scaleY = TARGET_CARD_HEIGHT / CARD_BASE_SIZE;
    const pathOffsetX = PATH_MIN * scaleX;
    const pathOffsetY = PATH_MIN * scaleY;

    const positions = [
      { x: gridLeft, y: gridTop },
      { x: gridLeft + TARGET_CARD_WIDTH + GAP_X, y: gridTop },
      { x: gridLeft, y: gridTop + TARGET_CARD_HEIGHT + GAP_Y },
      {
        x: gridLeft + TARGET_CARD_WIDTH + GAP_X,
        y: gridTop + TARGET_CARD_HEIGHT + GAP_Y,
      },
    ];

    const cards = positions.map((pos) => ({
      translateX: pos.x - pathOffsetX,
      translateY: pos.y - pathOffsetY,
      centerX: pos.x + TARGET_CARD_WIDTH / 2,
      centerY: pos.y + TARGET_CARD_HEIGHT / 2,
    }));

    return {
      scaleX,
      scaleY,
      cards,
      cardWidth: TARGET_CARD_WIDTH,
      cardHeight: TARGET_CARD_HEIGHT,
      gapX: GAP_X,
      gapY: GAP_Y,
      gridLeft,
      gridTop,
      totalWidth,
      totalHeight,
    };
  })();

  class MatrixGrid2x2WithArrows {
    constructor(config) {
      this.data = config.data || [];
      this.colors = config.colors || [
        "#c8ffe5",
        "#dce9ff",
        "#e9ffb9",
        "#d1f4ff",
      ];
      this.width = config.width || ORIGINAL_WIDTH;
      this.height = config.height || ORIGINAL_HEIGHT;
      this.textColor = config.textColor || "#484848";
      this.arrowColor = config.arrowColor || "#969696";
      this.xAxisLabels = config.xAxisLabels || {
        start: "Low Impact",
        end: "High Impact",
      };
      this.yAxisLabels = config.yAxisLabels || {
        start: "Low Complexity",
        end: "High Complexity",
      };
      this.onItemClick = config.onItemClick;
    }

    escapeHtml(text) {
      const div = document.createElement("div");
      div.textContent = text || "";
      return div.innerHTML;
    }

    wrapText(text, maxCharsPerLine = 15) {
      const words = (text || "").split(" ");
      const lines = [];
      let currentLine = "";

      words.forEach((word) => {
        if (
          (currentLine + word).length > maxCharsPerLine &&
          currentLine.length > 0
        ) {
          lines.push(currentLine.trim());
          currentLine = word + " ";
        } else {
          currentLine += word + " ";
        }
      });

      if (currentLine.trim().length > 0) {
        lines.push(currentLine.trim());
      }

      return lines;
    }

    generateHorizontalArrow() {
      const layout = CARD_LAYOUT;
      const lineY = layout.gridTop + layout.cardHeight + layout.gapY / 2;
      const lineStartX = layout.gridLeft;
      const lineEndX = layout.gridLeft + layout.totalWidth;
      const arrowSize = 6.5;

      return `
      <line
        x1="${lineStartX}"
        y1="${lineY}"
        x2="${lineEndX}"
        y2="${lineY}"
        stroke="${this.arrowColor}"
        stroke-width="2"
        stroke-linecap="round"/>

      <path
        d="M ${lineStartX + arrowSize} ${lineY - arrowSize} L ${lineStartX} ${lineY} L ${lineStartX + arrowSize} ${lineY + arrowSize}"
        stroke="${this.arrowColor}"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"/>

      <path
        d="M ${lineEndX - arrowSize} ${lineY - arrowSize} L ${lineEndX} ${lineY} L ${lineEndX - arrowSize} ${lineY + arrowSize}"
        stroke="${this.arrowColor}"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"/>
    `;
    }

    generateVerticalArrow() {
      const layout = CARD_LAYOUT;
      const lineX = layout.gridLeft + layout.cardWidth + layout.gapX / 2;
      const lineStartY = layout.gridTop;
      const lineEndY = layout.gridTop + layout.totalHeight;
      const arrowSize = 6.5;

      return `
      <line
        x1="${lineX}"
        y1="${lineStartY}"
        x2="${lineX}"
        y2="${lineEndY}"
        stroke="${this.arrowColor}"
        stroke-width="2"
        stroke-linecap="round"/>

      <path
        d="M ${lineX - arrowSize} ${lineStartY + arrowSize} L ${lineX} ${lineStartY} L ${lineX + arrowSize} ${lineStartY + arrowSize}"
        stroke="${this.arrowColor}"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"/>

      <path
        d="M ${lineX - arrowSize} ${lineEndY - arrowSize} L ${lineX} ${lineEndY} L ${lineX + arrowSize} ${lineEndY - arrowSize}"
        stroke="${this.arrowColor}"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"/>
    `;
    }

    generateAxisLabels() {
      const layout = CARD_LAYOUT;
      const fontSize = 20;
      const lineY = layout.gridTop + layout.cardHeight + layout.gapY / 2;
      const lineX = layout.gridLeft + layout.cardWidth + layout.gapX / 2;

      return `
      <text
        x="${layout.gridLeft - 24}"
        y="${lineY}"
        text-anchor="end"
        dominant-baseline="middle"
        fill="${this.textColor}"
        font-size="${fontSize}">
        ${this.escapeHtml(this.xAxisLabels.start)}
      </text>

      <text
        x="${layout.gridLeft + layout.totalWidth + 24}"
        y="${lineY}"
        text-anchor="start"
        dominant-baseline="middle"
        fill="${this.textColor}"
        font-size="${fontSize}">
        ${this.escapeHtml(this.xAxisLabels.end)}
      </text>

      <text
        x="${lineX}"
        y="${layout.gridTop - 24}"
        text-anchor="middle"
        dominant-baseline="middle"
        fill="${this.textColor}"
        font-size="${fontSize}">
        ${this.escapeHtml(this.yAxisLabels.end)}
      </text>

      <text
        x="${lineX}"
        y="${layout.gridTop + layout.totalHeight + 32}"
        text-anchor="middle"
        dominant-baseline="middle"
        fill="${this.textColor}"
        font-size="${fontSize}">
        ${this.escapeHtml(this.yAxisLabels.start)}
      </text>
    `;
    }

    generateChart() {
      const layout = CARD_LAYOUT;
      const maxItems = 4;
      const numItems = Math.min(this.data.length, maxItems);
      const rectPath =
        "M 21 10L 189 10C 195.075 10 200 14.925 200 21L 200 189C 200 195.075 195.075 200 189 200L 21 200C 14.925 200 10 195.075 10 189L 10 21C 10 14.925 14.925 10 21 10Z";

      let svg = "";

      svg += this.generateHorizontalArrow();
      svg += this.generateVerticalArrow();

      this.data.slice(0, numItems).forEach((item, index) => {
        const quadIndex = item.quadrant !== undefined ? item.quadrant : index;
        if (quadIndex >= 4) return;

        const cardInfo = layout.cards[quadIndex];
        const color = item.color || this.colors[quadIndex % this.colors.length];
        const primaryTextColor = this.resolveTextColor
          ? this.resolveTextColor(color)
          : this.textColor;
        const secondaryTextColor = this.resolveTextColor
          ? this.resolveTextColor(color, true, primaryTextColor)
          : this.textColor;

        svg += `
        <g transform="translate(${cardInfo.translateX}, ${
          cardInfo.translateY
        })">
          <g transform="scale(${layout.scaleX}, ${layout.scaleY})">
            <path
              d="${rectPath}"
              fill="${color}"
              stroke="#ffffff"
              stroke-width="2"
              stroke-linejoin="round"
              stroke-linecap="round"
              opacity="1"/>
          </g>
        </g>
      `;

        const labelLines = this.wrapText(item.label || "", 18);
        const labelFontSize = 24;
        const lineHeight = labelFontSize * 1.25;
        const labelStartY =
          cardInfo.centerY - ((labelLines.length - 1) * lineHeight) / 2 - 8;

        labelLines.forEach((line, lineIndex) => {
          svg += `
        <text
          x="${cardInfo.centerX}"
          y="${labelStartY + lineIndex * lineHeight}"
          text-anchor="middle"
          fill="${primaryTextColor}"
          font-size="${labelFontSize}"
          font-weight="700">
          ${this.escapeHtml(line)}
        </text>
      `;
        });

        if (item.description) {
          const descLines = this.wrapText(item.description, 30);
          const descFontSize = 16;
          const descLineHeight = descFontSize * 1.2;
          const descStartY = labelStartY + labelLines.length * lineHeight + 12;

          descLines.forEach((line, lineIndex) => {
            svg += `
        <text
          x="${cardInfo.centerX}"
          y="${descStartY + lineIndex * descLineHeight}"
          text-anchor="middle"
          fill="${secondaryTextColor}"
          font-size="${descFontSize}"
          opacity="0.8">
          ${this.escapeHtml(line)}
        </text>
      `;
          });
        }
      });

      svg += this.generateAxisLabels();

      return svg;
    }

    generate() {
      const content = this.generateChart();

      return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${ORIGINAL_WIDTH} ${ORIGINAL_HEIGHT}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Matrix 2x2 With Arrows">
  <title>Matrix 2x2 With Arrows</title>
  <desc>2x2 quadrant matrix with bidirectional arrows showing dimensions</desc>
  <rect width="${ORIGINAL_WIDTH}" height="${ORIGINAL_HEIGHT}" fill="#ffffff"/>
  ${content}
</svg>`.trim();
    }
  }

  if (globalScope) {
    globalScope.MatrixGrid2x2WithArrows = MatrixGrid2x2WithArrows;
  }
})(typeof window !== "undefined" ? window : globalThis);


// ========== charts/MatrixScatterPlot.js ==========
/**
 * Priority Matrix - Scatter Plot Chart - Vanilla JavaScript
 * Based on chart_matrix_scatter_plot.html (原 chart_16)
 *
 * Features:
 * - Coordinate axes (X/Y axes)
 * - Dashed grid lines
 * - 3D scatter points/bubbles (polyhedron shapes)
 * - Four quadrant layout
 * - Original dimensions: 888×756
 */

class MatrixScatterPlot {
  constructor(config) {
    this.data = config.data || [];
    this.colors = config.colors || [
      "#7862d1",
      "#4f92ff",
      "#3cc583",
      "#de8431",
      "#ff6b6b",
      "#ffd93d",
    ];
    this.width = config.width || 888;
    this.height = config.height || 756;
    this.textColor = config.textColor || "#484848";
    this.xAxisLabel = config.xAxisLabel || "";
    this.yAxisLabel = config.yAxisLabel || "";
    this.showGrid = config.showGrid !== undefined ? config.showGrid : true;
    this.onItemClick = config.onItemClick;
  }

  /**
   * 3D bubble/diamond paths (multi-faceted polyhedrons)
   */
  getBubblePaths() {
    return {
      // Regular size bubble
      regular: {
        top: `M 58 130L 34 154L 70 154L 178 130L 58 130Z`,
        left: `M 58 130L 58 10L 34 118L 34 154L 58 130Z`,
        bottomRight: `M 34 154L 34 118L 50 46L 10 46L 10 178L 142 178L 142 138L 69.769 154L 34 154Z`,
        rect: `M 178 10L 58 10L 58 130L 178 130L 178 10Z`,
      },
      // Small size bubble
      small: {
        top: `M 58 58L 34 34L 70 34L 178 58L 58 58Z`,
        left: `M 58 58L 58 178L 34 70L 34 34L 58 58Z`,
        bottomRight: `M 34 34L 34 70L 50 142L 10 142L 10 10L 142 10L 142 50L 69.769 34L 34 34Z`,
        rect: `M 178 178L 58 178L 58 58L 178 58L 178 178Z`,
      },
    };
  }

  /**
   * Convert normalized coordinates (-1 to 1) to SVG coordinates
   */
  toSVGCoords(x, y) {
    const centerX = this.width * 0.5;
    const centerY = this.height * 0.5;
    const plotWidth = this.width * 0.7;
    const plotHeight = this.height * 0.65;

    return {
      x: centerX + (x || 0) * (plotWidth / 2),
      y: centerY - (y || 0) * (plotHeight / 2),
    };
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
  }

  /**
   * Generate the chart
   */
  generateChart() {
    const ORIGINAL_WIDTH = 888;
    const ORIGINAL_HEIGHT = 756;
    const maxItems = 20;
    const numItems = Math.min(this.data.length, maxItems);

    const centerX = this.width * 0.5;
    const centerY = this.height * 0.5;
    const plotWidth = this.width * 0.7;
    const plotHeight = this.height * 0.65;

    const bubblePaths = this.getBubblePaths();

    let svg = "";

    // Grid lines
    if (this.showGrid) {
      // Vertical center line
      svg += `
        <line
          x1="${centerX}"
          y1="${centerY - plotHeight / 2}"
          x2="${centerX}"
          y2="${centerY + plotHeight / 2}"
          stroke="${this.textColor}"
          stroke-width="2"
          stroke-dasharray="5,7"
          opacity="0.6"/>
      `;

      // Horizontal center line
      svg += `
        <line
          x1="${centerX - plotWidth / 2}"
          y1="${centerY}"
          x2="${centerX + plotWidth / 2}"
          y2="${centerY}"
          stroke="${this.textColor}"
          stroke-width="2"
          stroke-dasharray="5,7"
          opacity="0.6"/>
      `;
    }

    // Axis labels
    if (this.xAxisLabel) {
      svg += `
        <text
          x="${centerX}"
          y="${this.height * 0.92}"
          text-anchor="middle"
          fill="${this.textColor}"
          font-size="${Math.max(14, this.width * 0.018)}"
          font-weight="600">
          ${this.escapeHtml(this.xAxisLabel)}
        </text>
      `;
    }

    if (this.yAxisLabel) {
      svg += `
        <text
          x="${this.width * 0.05}"
          y="${centerY}"
          text-anchor="middle"
          transform="rotate(-90 ${this.width * 0.05} ${centerY})"
          fill="${this.textColor}"
          font-size="${Math.max(14, this.width * 0.018)}"
          font-weight="600">
          ${this.escapeHtml(this.yAxisLabel)}
        </text>
      `;
    }

    // Scatter plot bubbles (3D polyhedrons)
    this.data.slice(0, numItems).forEach((item, index) => {
      const pos = this.toSVGCoords(item.x || 0, item.y || 0);
      const sizeMultiplier = item.sizeMultiplier || 1;
      const isSmall = sizeMultiplier < 1;
      const color = item.color || this.colors[index % this.colors.length];

      // Select bubble paths based on size
      const paths = isSmall ? bubblePaths.small : bubblePaths.regular;

      // Scale based on size multiplier
      const scale =
        (sizeMultiplier * 0.15 * Math.min(this.width, this.height)) /
        ORIGINAL_WIDTH;

      const primaryTextColor = this.resolveTextColor
        ? this.resolveTextColor(color)
        : this.textColor;

      svg += `
        <g transform="translate(${pos.x}, ${pos.y}) scale(${scale})">
          <!-- Top facet -->
          <path
            d="${paths.top}"
            fill="${color}"
            stroke="${this.textColor}"
            stroke-width="${2 / scale}"
            stroke-linejoin="round"
            stroke-linecap="round"
            opacity="0.9"/>

          <!-- Left facet -->
          <path
            d="${paths.left}"
            fill="${color}"
            stroke="${this.textColor}"
            stroke-width="${2 / scale}"
            stroke-linejoin="round"
            stroke-linecap="round"
            opacity="0.9"/>

          <!-- Bottom/right facet -->
          <path
            d="${paths.bottomRight}"
            fill="${color}"
            stroke="${this.textColor}"
            stroke-width="${2 / scale}"
            stroke-linejoin="round"
            stroke-linecap="round"
            opacity="0.9"/>

          <!-- Main rect facet -->
          <path
            d="${paths.rect}"
            fill="${color}"
            stroke="${this.textColor}"
            stroke-width="${2 / scale}"
            stroke-linejoin="round"
            stroke-linecap="round"
            opacity="0.9"/>

          <!-- Label -->
          <text
            x="118"
            y="${isSmall ? 118 : 94}"
            text-anchor="middle"
            dominant-baseline="middle"
            fill="${primaryTextColor}"
            font-size="${Math.max(40, 60 / sizeMultiplier)}"
            font-weight="700">
            ${this.escapeHtml(item.label)}
          </text>
        </g>
      `;
    });

    return svg;
  }

  /**
   * Generate full SVG
   */
  generate() {
    const content = this.generateChart();

    return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Matrix Scatter Plot Chart">
  <title>Matrix Scatter Plot Chart</title>
  <desc>Scatter plot matrix with coordinate axes</desc>
  ${content}
</svg>`.trim();
  }
}

// Export
if (typeof window !== "undefined") {
  window.MatrixScatterPlot = MatrixScatterPlot;
}


// ========== charts/MetricsGrid.js ==========
/**
 * Metrics Grid Chart - Vanilla JavaScript
 * 3D bar chart with shared base platform
 *
 * Usage:
 * const chart = new MetricsGrid({
 *   data: [
 *     {label: 'Revenue', value: '$2.4M'},
 *     {label: 'Users', value: '12.5K'}
 *   ],
 *   colors: ['#c8ffe5', '#e9ffb9', '#d1f4ff', '#e7e1ff', '#ffd7ef'],
 *   width: 1032,
 *   height: 960
 * });
 * const svg = chart.generate();
 */

class MetricsGrid {
  constructor(config) {
    this.data = config.data || [];
    this.colors = config.colors || [
      "#c8ffe5",
      "#e9ffb9",
      "#d1f4ff",
      "#e7e1ff",
      "#ffd7ef",
    ];
    this.width = config.width || 1032;
    this.height = config.height || 960;
    this.textColor = config.textColor || "#484848"; // Theme text color for labels outside shapes
  }

  /**
   * Original SVG paths from chart_18
   */
  getPaths() {
    return {
      // Base platform (gray) from chart_18 line 61
      basePlatform: `M 10 442L 24.5455 442L 475.4546 442L 490 442L 490 466L 10 466L 10 442ZM 39.0909 418L 460.9091 418L 460.9091 430L 39.0909 430L 39.0909 418ZM 250 10L 490 82L 490 94L 475.4546 94L 24.5455 94L 10 94L 10 82L 250 10ZM 39.0909 118L 460.9091 118L 460.9091 106L 39.0909 106L 39.0909 118ZM 24.5455 94L 24.5455 106L 39.0909 106L 460.9091 106L 475.4546 106L 475.4546 94L 24.5455 94ZM 460.9091 430L 39.0909 430L 24.5455 430L 24.5455 442L 475.4546 442L 475.4546 430L 460.9091 430Z`,

      // 3D bar (combined path) from chart_18 line 107
      bar: `M 22 34L 70 34L 70 286L 22 286L 22 34ZM 16 22L 76 22L 82 22L 82 10L 10 10L 10 22L 16 22ZM 76 298L 16 298L 10 298L 10 310L 82 310L 82 298L 76 298ZM 76 298L 76 286L 70 286L 22 286L 16 286L 16 298L 76 298ZM 76 22L 16 22L 16 34L 22 34L 70 34L 76 34L 76 22Z`,
    };
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
  }

  /**
   * Generate chart
   */
  generateChart() {
    const paths = this.getPaths();

    // Original dimensions from chart_18: viewBox="0 0 1032 960"
    const originalWidth = 1032;
    const originalHeight = 960;
    const scaleX = this.width / originalWidth;
    const scaleY = this.height / originalHeight;

    // Original bar positions from chart_18 (in order: bar1 to bar5)
    // Bar 1: (92, 380.5) - #c8ffe5
    // Bar 2: (176, 380.5) - #e9ffb9
    // Bar 3: (260, 379.5) - #d1f4ff
    // Bar 4: (344, 379.5) - #e7e1ff
    // Bar 5: (428, 379.5) - #ffd7ef
    const barPositions = [
      { x: 92, y: 380.5 },
      { x: 176, y: 380.5 },
      { x: 260, y: 379.5 },
      { x: 344, y: 379.5 },
      { x: 428, y: 379.5 },
    ];

    const basePosition = { x: 55, y: 271.5 };
    const originalBarWidth = 92;
    const originalBarHeight = 320;

    let svg = "";

    // Base platform
    svg += `
      <g transform="translate(${basePosition.x * scaleX}, ${basePosition.y * scaleY}) scale(${scaleX}, ${scaleY})">
        <path d="${paths.basePlatform}" fill="#ebebeb" stroke="none"/>
        <path d="${paths.basePlatform}" fill="none" stroke="#ffffff" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"/>
      </g>
    `;

    // Bars (limit to 5)
    this.data.slice(0, 5).forEach((item, index) => {
      const barPos = barPositions[index];
      const color = item.color || this.colors[index % this.colors.length];

      const labelFontSize = Math.max(12, this.width * 0.015);
      const valueFontSize = Math.max(16, this.width * 0.02);

      // Draw bar
      svg += `
        <g transform="translate(${barPos.x * scaleX}, ${barPos.y * scaleY}) scale(${scaleX}, ${scaleY})">
          <path d="${paths.bar}" fill="${color}" stroke="none"/>
          <path d="${paths.bar}" fill="none" stroke="#ffffff" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"/>
        </g>
      `;

      // Label and value
      const centerX = (barPos.x + originalBarWidth / 2) * scaleX;
      const centerY = (barPos.y + originalBarHeight / 2) * scaleY;
      const primaryTextColor = this.resolveTextColor
        ? this.resolveTextColor(color)
        : this.textColor;
      const secondaryTextColor = this.resolveTextColor
        ? this.resolveTextColor(color, true, primaryTextColor)
        : this.textColor;

      svg += `
        <text x="${centerX}" y="${centerY + labelFontSize * 0.35}"
              text-anchor="middle" fill="${primaryTextColor}"
              font-size="${labelFontSize}" font-weight="600">
          ${this.escapeHtml(item.label.length > 8 && this.width < 600 ? item.label.slice(0, 6) + "..." : item.label)}
        </text>
      `;

      if (item.value !== undefined) {
        svg += `
          <text x="${centerX}" y="${centerY + 30 * scaleY + valueFontSize * 0.35}"
                text-anchor="middle" fill="${secondaryTextColor}"
                font-size="${valueFontSize}" font-weight="700">
            ${this.escapeHtml(String(item.value))}
          </text>
        `;
      }
    });

    return svg;
  }

  /**
   * Generate full SVG
   */
  generate() {
    const content = this.generateChart();

    return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Metrics Grid Chart">
  <title>Metrics Grid Chart</title>
  <desc>A 3D bar chart showing multiple metrics on a shared platform</desc>
  ${content}
</svg>`.trim();
  }
}

// Export
if (typeof window !== "undefined") {
  window.MetricsGrid = MetricsGrid;
}


// ========== charts/PlaceholderChart.js ==========
/**
 * Placeholder Chart - Vanilla JavaScript
 * 用于尚未迁移的React组件的占位符
 */

class PlaceholderChart {
  constructor(config) {
    this.data = config.data || [];
    this.colors = config.colors || ["#e7e1ff", "#dce9ff", "#c8ffe5"];
    this.width = config.width || 800;
    this.height = config.height || 600;
    this.chartType = config.options?.chartType || "Placeholder";
    this.textColor = config.textColor || "#484848";
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
  }

  /**
   * Generate placeholder chart
   */
  generateChart() {
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    // Create a simple placeholder visualization
    let svg = "";

    // Background
    svg += `
      <rect x="20" y="20" width="${this.width - 40}" height="${this.height - 40}"
            fill="${this.colors[0]}" opacity="0.2" rx="8" stroke="${this.colors[0]}" stroke-width="2"/>
    `;

    // Center icon/shape
    const iconSize = Math.min(this.width, this.height) * 0.3;
    svg += `
      <rect x="${centerX - iconSize / 2}" y="${centerY - iconSize / 2}"
            width="${iconSize}" height="${iconSize}"
            fill="${this.colors[1]}" opacity="0.5" rx="4"/>

      <circle cx="${centerX}" cy="${centerY}" r="${iconSize * 0.3}"
              fill="${this.colors[2]}" opacity="0.7"/>
    `;

    // Title
    svg += `
      <text x="${centerX}" y="${centerY}" text-anchor="middle" dominant-baseline="middle"
            fill="${this.textColor}" font-size="${Math.max(16, this.width * 0.025)}" font-weight="600">
        ${this.escapeHtml(this.chartType)}
      </text>
    `;

    // Coming soon text
    svg += `
      <text x="${centerX}" y="${centerY + 30}" text-anchor="middle" dominant-baseline="middle"
            fill="${this.textColor}" font-size="${Math.max(12, this.width * 0.015)}" opacity="0.6">
        (Vanilla JS - Coming Soon)
      </text>
    `;

    return svg;
  }

  /**
   * Generate full SVG
   */
  generate() {
    const content = this.generateChart();

    return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${this.chartType} Chart">
  <title>${this.chartType} Chart</title>
  <desc>Placeholder for ${this.chartType} chart - vanilla JS version coming soon</desc>
  ${content}
</svg>`.trim();
  }
}

// Export
if (typeof window !== "undefined") {
  window.PlaceholderChart = PlaceholderChart;
}


// ========== charts/PriorityMatrix.js ==========
(function (globalScope) {
  /**
   * Priority Matrix Chart - Vanilla JavaScript
   * 2x2 matrix for categorizing items by two dimensions
   */

  const ORIGINAL_WIDTH = 816;
  const ORIGINAL_HEIGHT = 720;
  const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;
  const CARD_BASE_SIZE = 190;
  const PATH_MIN = 10;
  const TARGET_CARD_HEIGHT = 235;
  const TARGET_CARD_WIDTH = TARGET_CARD_HEIGHT * GOLDEN_RATIO;
  const GAP_X = 48;
  const GAP_Y = 48;

  const CARD_LAYOUT = (() => {
    const totalWidth = TARGET_CARD_WIDTH * 2 + GAP_X;
    const totalHeight = TARGET_CARD_HEIGHT * 2 + GAP_Y;
    const gridLeft = (ORIGINAL_WIDTH - totalWidth) / 2;
    const gridTop = (ORIGINAL_HEIGHT - totalHeight) / 2;
    const scaleX = TARGET_CARD_WIDTH / CARD_BASE_SIZE;
    const scaleY = TARGET_CARD_HEIGHT / CARD_BASE_SIZE;
    const pathOffsetX = PATH_MIN * scaleX;
    const pathOffsetY = PATH_MIN * scaleY;

    const positions = [
      { x: gridLeft, y: gridTop },
      { x: gridLeft + TARGET_CARD_WIDTH + GAP_X, y: gridTop },
      { x: gridLeft, y: gridTop + TARGET_CARD_HEIGHT + GAP_Y },
      {
        x: gridLeft + TARGET_CARD_WIDTH + GAP_X,
        y: gridTop + TARGET_CARD_HEIGHT + GAP_Y,
      },
    ];

    const cards = positions.map((pos) => ({
      translateX: pos.x - pathOffsetX,
      translateY: pos.y - pathOffsetY,
      centerX: pos.x + TARGET_CARD_WIDTH / 2,
      centerY: pos.y + TARGET_CARD_HEIGHT / 2,
    }));

    return {
      scaleX,
      scaleY,
      cards,
      cardWidth: TARGET_CARD_WIDTH,
      cardHeight: TARGET_CARD_HEIGHT,
      gapX: GAP_X,
      gapY: GAP_Y,
      gridLeft,
      gridTop,
      totalWidth,
      totalHeight,
    };
  })();

  const QUADRANT_LABELS = [
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right",
  ];

  class PriorityMatrix {
    constructor(config) {
      this.data = config.data || [];
      this.colors = config.colors || [
        "#d1f4ff",
        "#e9ffb9",
        "#dce9ff",
        "#ffd7ef",
      ];
      this.width = config.width || ORIGINAL_WIDTH;
      this.height = config.height || ORIGINAL_HEIGHT;
      this.xLabel = config.xLabel || "";
      this.yLabel = config.yLabel || "";
      this.textColor = config.textColor || "#484848";
    }

    getPaths() {
      return {
        roundedSquare: `M 21 10L 189 10C 195.075 10 200 14.925 200 21L 200 189C 200 195.075 195.075 200 189 200L 21 200C 14.925 200 10 195.075 10 189L 10 21C 10 14.925 14.925 10 21 10Z`,
      };
    }

    escapeHtml(text) {
      const div = document.createElement("div");
      div.textContent = text || "";
      return div.innerHTML;
    }

    wrapLabel(text, maxCharsPerLine = 18) {
      const words = (text || "").split(" ");
      const lines = [];
      let currentLine = "";

      words.forEach((word) => {
        if (
          (currentLine + " " + word).trim().length > maxCharsPerLine &&
          currentLine
        ) {
          lines.push(currentLine.trim());
          currentLine = word;
        } else {
          currentLine = currentLine ? `${currentLine} ${word}` : word;
        }
      });

      if (currentLine) {
        lines.push(currentLine.trim());
      }

      return lines.length ? lines : [""];
    }

    resolveQuadrantIndex(quadrant) {
      if (typeof quadrant === "number" && quadrant >= 0 && quadrant < 4) {
        return quadrant;
      }
      if (typeof quadrant === "string") {
        return QUADRANT_LABELS.indexOf(quadrant);
      }
      return -1;
    }

    generateChart() {
      const paths = this.getPaths();
      const layout = CARD_LAYOUT;
      let svg = "";

      const resolvedItems = QUADRANT_LABELS.map((label, index) => {
        const explicitMatch = this.data.find((item) => {
          const resolvedIndex = this.resolveQuadrantIndex(item.quadrant);
          if (resolvedIndex >= 0) {
            return resolvedIndex === index;
          }
          return item.quadrant === label;
        });
        return explicitMatch || this.data[index] || null;
      });

      resolvedItems.forEach((item, index) => {
        const cardInfo = layout.cards[index];
        const color =
          item?.color || this.colors[index % this.colors.length] || "#d1f4ff";

        svg += `
        <g transform="translate(${cardInfo.translateX}, ${
          cardInfo.translateY
        })">
          <g transform="scale(${layout.scaleX}, ${layout.scaleY})">
            <path d="${paths.roundedSquare}" fill="${color}" stroke="#ffffff" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </g>
        </g>
      `;

        if (item?.label) {
          const labelLines = this.wrapLabel(item.label, 18);
          const labelFontSize = 24;
          const lineHeight = labelFontSize * 1.25;
          const labelStartY =
            cardInfo.centerY - ((labelLines.length - 1) * lineHeight) / 2 - 8;
          const labelColor = this.resolveTextColor
            ? this.resolveTextColor(color)
            : typeof ColorUtils !== "undefined"
              ? ColorUtils.getContrastingColor(color, false)
              : "#1f1f1f";

          labelLines.forEach((line, lineIndex) => {
            svg += `
          <text
            x="${cardInfo.centerX}"
            y="${labelStartY + lineIndex * lineHeight}"
            text-anchor="middle"
            fill="${labelColor}"
            font-size="${labelFontSize}"
            font-weight="600">
            ${this.escapeHtml(line)}
          </text>
        `;
          });
        }
      });

      const axisLabelFontSize = 18;
      const centerX = layout.gridLeft + layout.totalWidth / 2;
      const centerY = layout.gridTop + layout.totalHeight / 2;

      if (this.xLabel) {
        svg += `
        <text x="${centerX}" y="${layout.gridTop + layout.totalHeight + 48}" text-anchor="middle"
              fill="${this.textColor}" font-size="${axisLabelFontSize}" font-weight="500">
          ${this.escapeHtml(this.xLabel)}
        </text>
      `;
      }

      if (this.yLabel) {
        const axisX = layout.gridLeft - 40;
        svg += `
        <text x="${axisX}" y="${centerY}" text-anchor="middle"
              fill="${this.textColor}" font-size="${axisLabelFontSize}" font-weight="500"
              transform="rotate(-90, ${axisX}, ${centerY})">
          ${this.escapeHtml(this.yLabel)}
        </text>
      `;
      }

      return svg;
    }

    generate() {
      const content = this.generateChart();

      return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${ORIGINAL_WIDTH} ${ORIGINAL_HEIGHT}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Priority Matrix Chart">
  <title>Priority Matrix Chart</title>
  <desc>A 2x2 matrix for categorizing items by two dimensions</desc>
  ${content}
</svg>`.trim();
    }
  }

  if (globalScope) {
    globalScope.PriorityMatrix = PriorityMatrix;
  }
})(typeof window !== "undefined" ? window : globalThis);


// ========== charts/PyramidAlternateLabels.js ==========
/**
 * Pyramid with Alternate Labels Chart - Vanilla JavaScript
 * Based on chart_pyramid_alternate_labels.html (原 chart_07)
 *
 * Features:
 * - Pyramid with alternating left/right text labels
 * - Label background matches layer color
 * - Original dimensions: 960×576
 */

class PyramidAlternateLabels {
  constructor(config) {
    this.data = config.data || [];
    this.colors = config.colors || ["#7862d1", "#4f92ff", "#3cc583", "#de8431"];
    this.width = config.width || 960;
    this.height = config.height || 576;
    this.textColor = config.textColor || "#484848";
    this.labelPosition = config.labelPosition || "alternate";
    this.matchLayerColor =
      config.matchLayerColor !== undefined ? config.matchLayerColor : true;
    this.onItemClick = config.onItemClick;
  }

  /**
   * Original SVG paths for each layer
   */
  getLayerPaths() {
    return [
      // Level 1 (smallest, top)
      {
        main: `M 50.9 10L 10 94L 91.8 94L 50.9 10Z`,
        label: `M 62.4 10L 103.3 94L 199.3 94L 158.4 10L 62.4 10Z`,
      },
      // Level 2
      {
        main: `M 240.4 10L 158.6 10L 117.7 94L 281.3 94L 240.4 10Z`,
        label: `M 146.9 10L 106 94L 10 94L 50.9 10L 146.9 10Z`,
      },
      // Level 3
      {
        main: `M 214.5 10L 50.9 10L 10 94L 255.4 94L 214.5 10Z`,
        label: `M 226.2 10L 267.1 94L 363.1 94L 322.2 10L 226.2 10Z`,
      },
      // Level 4 (largest, bottom)
      {
        main: `M 404.2001 10L 158.8001 10L 117.9001 94L 445.1001 94L 404.2001 10Z`,
        label: `M 146.9 10L 106 94L 10 94L 50.9 10L 146.9 10Z`,
      },
    ];
  }

  /**
   * Original layer positions
   */
  getLayerPositions() {
    return [
      { x: 446.6000061035156, y: 134 }, // cp_1 (top)
      { x: 298, y: 218 }, // cp_2
      { x: 364.79998779296875, y: 302 }, // cp_3
      { x: 216, y: 386 }, // cp_4 (bottom)
    ];
  }

  /**
   * Determine label position for this level
   */
  getLabelPosition(index) {
    if (this.labelPosition === "left") return "left";
    if (this.labelPosition === "right") return "right";
    // Alternate: first level on right, second on left, etc.
    return index % 2 === 0 ? "right" : "left";
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
  }

  /**
   * Generate the chart
   */
  generateChart() {
    const ORIGINAL_WIDTH = 960;
    const ORIGINAL_HEIGHT = 576;
    const maxItems = 4;
    const numItems = Math.min(this.data.length, maxItems);

    const scaleX = this.width / ORIGINAL_WIDTH;
    const scaleY = this.height / ORIGINAL_HEIGHT;

    const layerPaths = this.getLayerPaths();
    const layerPositions = this.getLayerPositions();

    let svg = "";

    this.data.slice(0, numItems).forEach((item, index) => {
      const pos = layerPositions[index];
      const paths = layerPaths[index];
      const color = item.color || this.colors[index % this.colors.length];

      const tx = pos.x * scaleX;
      const ty = pos.y * scaleY;

      // Level number positions on pyramid
      const numberX =
        index === 0 ? 50.9 : index === 1 ? 199.5 : index === 2 ? 132.65 : 281.5;
      // Label text positions
      const labelX =
        index === 0
          ? 130.85
          : index === 1
            ? 78.45
            : index === 2
              ? 292.65
              : 78.45;

      svg += `
        <g transform="translate(${tx}, ${ty}) scale(${scaleX}, ${scaleY})">
          <!-- Main pyramid layer -->
          <path
            d="${paths.main}"
            fill="${color}"
            stroke="${this.textColor}"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            opacity="0.9"/>

          <!-- Label box -->
          <path
            d="${paths.label}"
            fill="${this.matchLayerColor ? color : this.textColor}"
            stroke="${this.textColor}"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            opacity="0.9"/>

          <!-- Level number on pyramid -->
          <text
            x="${numberX}"
            y="52"
            text-anchor="middle"
            dominant-baseline="middle"
            fill="${this.textColor}"
            font-size="${Math.max(16, 24 / scaleX)}"
            font-weight="700">
            ${index + 1}
          </text>

          <!-- Label text -->
          <text
            x="${labelX}"
            y="52"
            text-anchor="middle"
            dominant-baseline="middle"
            fill="${this.matchLayerColor ? "#ffffff" : this.textColor}"
            font-size="${Math.max(14, 20 / scaleX)}"
            font-weight="600">
            ${this.escapeHtml(item.label)}
          </text>
        </g>
      `;
    });

    return svg;
  }

  /**
   * Generate full SVG
   */
  generate() {
    const content = this.generateChart();

    return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pyramid Alternate Labels Chart">
  <title>Pyramid Alternate Labels Chart</title>
  <desc>Pyramid with alternating left/right labels</desc>
  ${content}
</svg>`.trim();
  }
}

// Export
if (typeof window !== "undefined") {
  window.PyramidAlternateLabels = PyramidAlternateLabels;
}


// ========== charts/PyramidCubesWithArrow.js ==========
/**
 * Pyramid Cubes with Arrow Chart (Vanilla JS)
 * 重新按照 chart_pyramid_cubes_arrow.html 复刻：左侧 3D 立方体、中央箭头、右侧说明文字
 */

class PyramidCubesWithArrow {
  constructor(config) {
    this.data = config.data || [];
    this.colors = config.colors || ["#dce9ff", "#c8ffe5", "#e9ffb9", "#fff8b6"];
    this.width = config.width || 672;
    this.height = config.height || 804;
    this.textColor = config.textColor || "#484848";
    this.title = config.title || "Project Success Pyramid";
    this.showArrow = config.showArrow !== undefined ? config.showArrow : true;
    this.fontFamily =
      (config.font && config.font.family) ||
      config.fontFamily ||
      "'Shantell Sans', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
  }

  /**
   * 立方体模版（从顶部到底部）
   */
  getLayerTemplates() {
    return [
      {
        transform: "translate(146, 146)",
        fillPath:
          "M 82 34L 46 34L 10 34L 10 22L 46 10L 82 22L 82 34ZM 82 166L 82 34L 10 34L 10 166L 82 166ZM 82 166L 82 178L 46 190L 10 178L 10 166L 46 166L 82 166Z",
        strokePath:
          "M 82 22L 46 34L 10 22M 82 22L 46 10L 10 22M 82 22L 82 34M 10 22L 10 34M 46 34L 46 168M 82 34L 82 168M 10 34L 10 168M 46 190L 82 178L 82 168M 46 190C 31.9411 185.3137 24.0589 182.6863 10 178L 10 168M 46 190L 46 168",
      },
      {
        transform: "translate(122, 305)",
        fillPath:
          "M 130 41L 10 41L 10 19.0584L 34 10L 34 19.0584L 70 31.1363L 106 19.0584L 106 10L 130 19.0584L 130 41ZM 130 138.866364L 130 41L 10 41L 10 138.866364L 130 138.866364ZM 130 151.1286L 70 173L 10 151.1286L 10 139L 130 139L 130 151.1286Z",
        strokePath:
          "M 130 19.0584L 70 40.9999L 10 19.0584L 34 10L 34 19.0584L 70 31.1363L 106 19.0584L 106 10L 130 19.0584ZM 130 19.0584L 130 41M 10 19.0584L 10 41M 130 139L 130 41M 70 139L 70 41M 10 139L 10 41M 70 173L 130 151.1286L 130 139M 70 173L 70 139M 70 173L 10 151.1286L 10 139",
      },
      {
        transform: "translate(98, 437)",
        fillPath:
          "M 178 19L 178 51L 94 51L 10 51L 10 19L 34 10L 34 19L 94 41L 154 19L 154 10L 178 19ZM 178 51L 178 139L 10 139L 10 51L 178 51ZM 94 183L 178 151L 178 139L 10 139L 10 151L 94 183Z",
        strokePath:
          "M 178 19L 94 51L 10 19L 34 10L 34 19L 94 41L 154 19L 154 10L 178 19ZM 178 19L 178 51M 10 19L 10 51M 94 51L 94 139M 10 51L 10 139M 178 51L 178 139M 94 183L 178 151L 178 139M 94 183L 10 151L 10 139M 94 183L 94 139",
      },
      {
        transform: "translate(74, 569)",
        fillPath:
          "M 226 19.27L 226 61L 118 60.9999L 10 61L 10 19.27L 34 10L 34 19.27L 118 51.0642L 202 19.27L 202 10L 226 19.27ZM 226 61L 10 61L 10 139L 226 139L 226 61ZM 118 193L 226 151L 226 139L 10 139L 10 151L 118 193ZM 118 193L 118 139",
        strokePath:
          "M 226 18.9999L 118 60.9999L 10 18.9999L 34 10L 34 18.9999L 118 50.9999L 202 18.9999L 202 10L 226 18.9999ZM 226 18.9999L 226 61M 10 18.9999L 10 61M 226 139L 226 61M 118 139L 118 61M 10 139L 10 61M 226 139L 226 151L 118 193M 118 193L 10 151L 10 139M 118 193L 118 139",
      },
    ];
  }

  /**
   * 箭头 + 右向连线（从顶部到底部）
   */
  getConnectorTemplates() {
    return [
      {
        transform: "translate(307.0078125, 158)",
        rectPath: "M 16.992188 22L 28.992188 22L 28.992188 166L 16.992188 166Z",
        arrowHeadPath:
          "M 22.992207 10L 35.982606 22L 10.001806 22L 22.992207 10Z",
        rectOutlinePath:
          "M 28.992188 22L 28.992188 166M 16.992188 22L 16.992188 166",
        arrowOutlinePath:
          "M 27.990201 22L 35.9808 22L 22.990401 10L 10 22L 17.990201 22",
        guidePath: "M 28.992188 88L 88.992188 88",
      },
      {
        transform: "translate(314, 314)",
        rectPath: "M 10 10L 22 10L 22 142L 10 142Z",
        rectOutlinePath: "M 10 10L 22 10L 22 142L 10 142Z",
        guidePath: "M 22 76L 82 76",
      },
      {
        transform: "translate(314, 446)",
        rectPath: "M 10 10L 22 10L 22 142L 10 142Z",
        rectOutlinePath: "M 10 10L 22 10L 22 142L 10 142Z",
        guidePath: "M 22 76L 82 76",
      },
      {
        transform: "translate(314, 578)",
        rectPath: "M 10 10L 22 10L 22 142L 10 142Z",
        rectOutlinePath: "M 10 10L 22 10L 22 142L 10 142Z",
        guidePath: "M 22 76L 82 76",
      },
    ];
  }

  /**
   * 右侧文本布局（从顶部到底部）
   */
  getInfoLayoutTemplates() {
    return [
      {
        title: { transform: "translate(398, 170)", x: 10, y: 34 },
        body: { transform: "translate(398, 230)", x: 10, startY: -10.5 },
      },
      {
        title: { transform: "translate(398, 326)", x: 10, y: 22 },
        body: { transform: "translate(398, 362)", x: 10, startY: -10.5 },
      },
      {
        title: { transform: "translate(398, 458)", x: 10, y: 22 },
        body: { transform: "translate(398, 494)", x: 10, startY: -10.5 },
      },
      {
        title: { transform: "translate(398, 590)", x: 10, y: 22 },
        body: { transform: "translate(398, 626)", x: 10, startY: -10.5 },
      },
    ];
  }

  escapeHtml(text) {
    if (typeof document === "undefined") {
      return (text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
  }

  wrapLines(text, maxLength = 26) {
    if (!text) return [];
    const words = text.split(/\s+/);
    const lines = [];
    let current = "";
    words.forEach((word) => {
      const tentative = current ? `${current} ${word}` : word;
      if (tentative.length > maxLength && current) {
        lines.push(current);
        current = word;
      } else {
        current = tentative;
      }
    });
    if (current) lines.push(current);
    return lines;
  }

  renderBackground() {
    return `<rect x="12" y="12" width="648" height="774" fill="#ffffff" rx="24" ry="24"/>`;
  }

  renderTitle() {
    return `
      <text x="324" y="90" text-anchor="middle"
            fill="${this.textColor}"
            font-size="32"
            font-weight="700"
            font-family="${this.fontFamily}">
        ${this.escapeHtml(this.title)}
      </text>
    `;
  }

  renderPyramid(items) {
    const templates = this.getLayerTemplates();
    return items
      .slice(0, templates.length)
      .map((item, index) => {
        const template = templates[index];
        const fallbackColor = this.colors[index % this.colors.length];
        const color =
          item && (item.color || fallbackColor)
            ? item.color || fallbackColor
            : fallbackColor;
        return `
          <g transform="${template.transform}">
            <path d="${template.fillPath}" fill="${color}" stroke="none"/>
            <path d="${template.strokePath}"
                  fill="none"
                  stroke="#ffffff"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"/>
          </g>
        `;
      })
      .join("");
  }

  renderConnectors(items) {
    if (!this.showArrow) {
      return "";
    }
    const templates = this.getConnectorTemplates();
    return items
      .slice(0, templates.length)
      .map((item, index) => {
        const template = templates[index];
        const fallbackColor = this.colors[index % this.colors.length];
        const color =
          item && (item.color || fallbackColor)
            ? item.color || fallbackColor
            : fallbackColor;
        const segments = [];

        if (template.arrowHeadPath) {
          segments.push(
            `<path d="${template.arrowHeadPath}" fill="${color}" stroke="none"/>`
          );
          segments.push(
            `<path d="${template.arrowOutlinePath}" fill="none" stroke="${this.textColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
          );
        }

        segments.push(
          `<path d="${template.rectPath}" fill="${color}" stroke="none"/>`
        );

        if (template.rectOutlinePath) {
          segments.push(
            `<path d="${template.rectOutlinePath}" fill="none" stroke="${this.textColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
          );
        }

        if (template.guidePath) {
          segments.push(
            `<path d="${template.guidePath}" fill="none" stroke="${this.textColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
          );
        }

        return `<g transform="${template.transform}">${segments.join("")}</g>`;
      })
      .join("");
  }

  renderInfoPanel(items) {
    const layouts = this.getInfoLayoutTemplates();
    return items
      .slice(0, layouts.length)
      .map((item, index) => {
        const layout = layouts[index];
        const fallbackColor = this.colors[index % this.colors.length];
        const color =
          item && (item.color || fallbackColor)
            ? item.color || fallbackColor
            : fallbackColor;
        const title = item?.label || `Stage ${index + 1}`;
        const description = item?.description || "";
        const lines = this.wrapLines(description, 24);

        const titleNode = `
          <g transform="${layout.title.transform}">
            <text x="${layout.title.x}" y="${layout.title.y}"
                  font-size="20"
                  font-weight="700"
                  font-family="${this.fontFamily}"
                  fill="${color}">
              ${this.escapeHtml(title)}
            </text>
          </g>
        `;

        const bodyLines = lines.length ? lines : [" "];
        const bodyText = bodyLines
          .map(
            (line, lineIndex) => `
              <tspan x="${layout.body.x}"
                     y="${layout.body.startY + lineIndex * 24}"
                     dominant-baseline="ideographic">
                ${this.escapeHtml(line)}
              </tspan>`
          )
          .join("");

        const bodyNode = `
          <g transform="${layout.body.transform}">
            <text font-size="20"
                  font-family="${this.fontFamily}"
                  fill="${this.textColor}"
                  opacity="0.92">
              ${bodyText}
            </text>
          </g>
        `;

        return `${titleNode}${bodyNode}`;
      })
      .join("");
  }

  generate() {
    const items = this.data.slice(0, 4);
    const background = this.renderBackground();
    const title = this.renderTitle();
    const pyramid = this.renderPyramid(items);
    const connectors = this.renderConnectors(items);
    const info = this.renderInfoPanel(items);

    return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 672 804"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pyramid Cubes with Arrow">
  ${background}
  ${title}
  ${pyramid}
  ${connectors}
  ${info}
</svg>`.trim();
  }
}

if (typeof window !== "undefined") {
  window.PyramidCubesWithArrow = PyramidCubesWithArrow;
}


// ========== charts/PyramidIsometric.js ==========
/**
 * Pyramid Isometric Chart - Vanilla JavaScript
 * Rotated pyramid with isometric projection showing front and left side
 *
 * Based on chart_pyramid_isometric.html (原 chart_08)
 *
 * Features:
 * - Isometric projection
 * - Each layer shows two faces: front (trapezoid) + left side (parallelogram)
 * - Hierarchical from top to bottom
 * - Original dimensions: 552x552
 */

class PyramidIsometric {
  constructor(config) {
    this.data = config.data || [];
    this.colors = config.colors || ["#7862d1", "#4f92ff", "#3cc583", "#de8431"];
    this.width = config.width || 552;
    this.height = config.height || 552;
    this.textColor = config.textColor || "#484848";
    this.showSideFace =
      config.showSideFace !== undefined ? config.showSideFace : true;
    this.onItemClick = config.onItemClick;
  }

  /**
   * Original SVG paths extracted from chart_08
   * Each layer has two parts: front face (trapezoid) + side face (parallelogram)
   */
  getLayerPaths() {
    return [
      // Level 1 (smallest, top)
      {
        front: `M 105.952343 10L 201.952343 154L 29.152343 154L 105.952343 10Z`,
        side: `M 105.9525 10L 29.1525 154L 10 139.536L 105.9525 10Z`,
      },
      // Level 2
      {
        front: `M 250.045703 24.464111L 298.045703 96.464111L 38.845703 96.464111L 77.245703 24.464111L 250.045703 24.464111Z`,
        side: `M 77.2464 24.4641L 38.8464 96.4641L 10 74.9267L 58.0939 10L 77.2464 24.4641Z`,
      },
      // Level 3
      {
        front: `M 86.705223 31.537354L 48.311523 103.537354L 393.897523 103.537354L 345.905523 31.537354L 86.705223 31.537354Z`,
        side: `M 86.705 31.5374L 48.3113 103.5256L 10 74.6091L 57.8586 10L 86.705 31.5374Z`,
      },
      // Level 4 (largest, bottom)
      {
        front: `M 490 110.928223L 58 110.928223L 96.4063 38.928223L 441.992 38.928223L 490 110.928223Z`,
        side: `M 58 110.928L 10 74.9283L 58.095 10L 96.4063 38.9165L 58 110.928Z`,
      },
    ];
  }

  /**
   * Original layer positions from HTML
   */
  getLayerPositions() {
    return [
      { x: 170.0478515625, y: 122 }, // sy_1 (top)
      { x: 121.9541015625, y: 251.535888671875 }, // sy_2
      { x: 74.0947265625, y: 316.462646484375 }, // sy_3
      { x: 26, y: 381.07177734375 }, // sy_4 (bottom)
    ];
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
  }

  /**
   * Generate the chart
   */
  generateChart() {
    const ORIGINAL_WIDTH = 552;
    const ORIGINAL_HEIGHT = 552;
    const maxItems = 4;
    const numItems = Math.min(this.data.length, maxItems);

    const scaleX = this.width / ORIGINAL_WIDTH;
    const scaleY = this.height / ORIGINAL_HEIGHT;

    const layerPaths = this.getLayerPaths();
    const layerPositions = this.getLayerPositions();

    let svg = "";

    this.data.slice(0, numItems).forEach((item, index) => {
      const pos = layerPositions[index];
      const paths = layerPaths[index];
      const color = item.color || this.colors[index % this.colors.length];

      const tx = pos.x * scaleX;
      const ty = pos.y * scaleY;

      // Calculate label positions based on index
      const labelX =
        index === 0 ? 115.55 : index === 1 ? 168.45 : index === 2 ? 217.1 : 274;
      const labelY =
        index === 0 ? 82 : index === 1 ? 60 : index === 2 ? 67.5 : 75;

      // Side face (left) - render first for proper z-order
      if (this.showSideFace) {
        svg += `
          <g transform="translate(${tx}, ${ty}) scale(${scaleX}, ${scaleY})">
            <path
              d="${paths.side}"
              fill="${color}"
              stroke="${this.textColor}33"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              opacity="0.7"/>
          </g>
        `;
      }

      // Front face (trapezoid)
      svg += `
        <g transform="translate(${tx}, ${ty}) scale(${scaleX}, ${scaleY})">
          <path
            d="${paths.front}"
            fill="${color}"
            stroke="${this.textColor}33"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            opacity="0.9"/>

          <!-- Label on front face -->
          <text
            x="${labelX}"
            y="${labelY}"
            text-anchor="middle"
            dominant-baseline="middle"
            fill="${this.textColor}"
            font-size="${Math.max(14, 20 / scaleX)}"
            font-weight="700">
            ${this.escapeHtml(item.label)}
          </text>
        </g>
      `;
    });

    return svg;
  }

  /**
   * Generate full SVG
   */
  generate() {
    const content = this.generateChart();

    return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pyramid Isometric Chart">
  <title>Pyramid Isometric Chart</title>
  <desc>Rotated pyramid with isometric projection</desc>
  ${content}
</svg>`.trim();
  }
}

// Export
if (typeof window !== "undefined") {
  window.PyramidIsometric = PyramidIsometric;
}


// ========== charts/RangeSpectrum.js ==========
/**
 * Range Spectrum Chart - Vanilla JavaScript
 * Stacked 3D cylinders showing items along a range
 *
 * Usage:
 * const chart = new RangeSpectrum({
 *   data: [{label: 'Item 1'}, {label: 'Item 2'}],
 *   colors: ['#fff8b6', '#ffd7ef', '#e7e1ff', '#d1f4ff'],
 *   width: 800,
 *   height: 600
 * });
 * const svg = chart.generate();
 */

class RangeSpectrum {
  constructor(config) {
    this.data = config.data || [];
    this.colors = config.colors || ["#fff8b6", "#ffd7ef", "#e7e1ff", "#d1f4ff"];
    this.width = config.width || 504;
    this.height = config.height || 774;
    this.textColor = config.textColor || "#484848"; // Theme text color for labels outside shapes
  }

  /**
   * Original SVG paths from chart_10
   */
  getPaths() {
    return {
      // Top cylinder (gray frame)
      topCylinder: `M 202 28C 202 18.0589 159.0193 10 106 10C 52.9807 10 10 18.0589 10 28C 10 44.775 10 35.225 10 52C 10 61.9411 52.9807 70 106 70C 159.0193 70 202 61.9411 202 52C 202 35.225 202 44.775 202 28Z`,
      topEllipse: `M 10 28C 10.000003 37.941126 52.980667 46 106.000003 46C 159.019339 46 202.000003 37.941126 202.000003 28C 202.000003 18.058875 159.019339 10 106.000003 10C 52.980667 10 10.000003 18.058875 10.000003 28`,
      topInner: `M 70 28C 70 31.866 86.1177 35 106 35C 125.8823 35 142 31.866 142 28L 142 17C 142 13.134 125.8823 10 106 10C 86.1177 10 70 13.134 70 17L 70 28Z`,

      // Bubble segment - left 3D part
      bubbleLeft: `M 10 10L 10 58L 202 58L 202 10C 202 19.9411 159.0193 28 106 28C 52.9807 28 10 19.9411 10 10ZM 10 118L 10 70L 202 70L 202 118C 202 127.9411 159.0193 136 106 136C 52.9807 136 10 127.9411 10 118ZM 202 70L 202 58L 10 58L 10 70L 202 70Z`,
      bubbleLeftStroke: `M 202 70L 202 58M 10 70L 10 58M 10 70L 10 118C 10 127.9411 52.9807 136 106 136C 159.0193 136 202 127.9411 202 118L 202 70M 10 58L 10 10C 10 19.9411 52.9807 28 106 28C 159.0193 28 202 19.9411 202 10L 202 58`,

      // Bubble segment - right flat part
      bubbleRight: `M 202 58L 10 58C 10.000001 31.4903 10 10 10 10L 202 10L 202 58ZM 202 70L 202 58L 10 58L 10 70L 202 70ZM 10 118L 10 70L 202 70L 202 118L 10 118Z`,
      bubbleRightStroke: `M 202 58L 202 10.0001L 10.0001 10L 10 57.9999M 202 70L 202 58M 10 70L 10 58M 10 70L 10 118L 202 118L 202 70`,

      // Bottom hemisphere
      bottomHalf: `M 202 10C 202 19.9411 159.0193 28 106 28C 52.9807 28 10 19.9411 10 10`,
      bottomInner: `M 142 21C 142 24.866 125.8823 28 106 28C 86.1177 28 70 24.866 70 21`,
      bottomOuter: `M 202 10C 202 0.05887 159.0193 -8 106 -8C 52.9807 -8 10 0.05887 10 10C 10 19.9411 52.9807 28 106 28C 159.0193 28 202 19.9411 202 10Z`,
    };
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
  }

  /**
   * Generate chart
   */
  generateChart() {
    const paths = this.getPaths();

    // Original dimensions from chart_10
    const originalWidth = 212;
    const originalBubbleHeight = 146;
    const originalTopHeight = 80;
    const originalBottomHeight = 36;

    // Calculate scaling
    const scaleX = (this.width * 0.4) / originalWidth;
    const scaleY = scaleX; // Keep aspect ratio

    const leftX = this.width * 0.15;
    const rightX = leftX + originalWidth * scaleX + 10;

    let currentY = 50;
    let svg = "";

    // Top cylinder (gray)
    svg += `
      <g transform="translate(${leftX}, ${currentY}) scale(${scaleX}, ${scaleY})">
        <path d="${paths.topCylinder}" fill="#ebebeb" stroke="#ffffff" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"/>
        <path d="${paths.topEllipse}" fill="#ebebeb" stroke="#ffffff" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"/>
        <path d="${paths.topInner}" fill="#ebebeb" stroke="none"/>
      </g>
    `;

    currentY += originalTopHeight * scaleY + 10;

    // Bubble segments
    this.data.forEach((item, index) => {
      const color = item.color || this.colors[index % this.colors.length];
      const bubbleY = currentY;

      // Left 3D part
      svg += `
        <g transform="translate(${leftX}, ${bubbleY}) scale(${scaleX}, ${scaleY})">
          <path d="${paths.bubbleLeft}" fill="${color}" stroke="none"/>
          <path d="${paths.bubbleLeftStroke}" fill="none" stroke="#ffffff" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"/>
        </g>
      `;

      // Right flat part
      svg += `
        <g transform="translate(${rightX}, ${bubbleY}) scale(${scaleX}, ${scaleY})">
          <path d="${paths.bubbleRight}" fill="${color}" stroke="none"/>
          <path d="${paths.bubbleRightStroke}" fill="none" stroke="#ffffff" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round"/>
        </g>
      `;

      // Label
      const labelX = this.width * 0.5;
      const labelY = bubbleY + originalBubbleHeight * scaleY * 0.5;
      const labelFontSize = Math.max(12, this.width * 0.022);
      const labelColor = this.resolveTextColor
        ? this.resolveTextColor(color)
        : this.textColor;

      svg += `
        <text x="${labelX}" y="${labelY + labelFontSize * 0.35}" text-anchor="middle"
              fill="${labelColor}" font-size="${labelFontSize}" font-weight="600">
          ${this.escapeHtml(item.label.length > 15 && this.width < 500 ? item.label.slice(0, 13) + "..." : item.label)}
        </text>
      `;

      currentY += originalBubbleHeight * scaleY + 10;
    });

    // Bottom hemisphere (gray)
    svg += `
      <g transform="translate(${leftX}, ${currentY}) scale(${scaleX}, ${scaleY})">
        <path d="${paths.bottomOuter}" fill="#ebebeb" stroke="#ffffff" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"/>
        <path d="${paths.bottomHalf}" fill="none" stroke="#ffffff" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"/>
        <path d="${paths.bottomInner}" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.5"
              stroke-linecap="round" stroke-linejoin="round"/>
      </g>
    `;

    return svg;
  }

  /**
   * Generate full SVG
   */
  generate() {
    const content = this.generateChart();

    return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Range Spectrum Chart">
  <title>Range Spectrum Chart</title>
  <desc>A stacked 3D cylinder chart showing items along a range</desc>
  ${content}
</svg>`.trim();
  }
}

// Export
if (typeof window !== "undefined") {
  window.RangeSpectrum = RangeSpectrum;
}


// ========== charts/SpectrumHorizontal.js ==========
/**
 * Spectrum Horizontal Chart - Vanilla JavaScript
 * Based on chart_spectrum_horizontal.html (原 chart_13)
 *
 * Features:
 * - Horizontal range spectrum from internal to external
 * - Cards distributed along horizontal axis
 * - Arrow shapes on left and right ends
 * - Rounded rectangles in middle
 * - Original dimensions: 816×660
 */

class SpectrumHorizontal {
  constructor(config) {
    this.data = config.data || [];
    this.colors = config.colors || ["#7862d1", "#4f92ff", "#3cc583", "#de8431"];
    this.width = config.width || 816;
    this.height = config.height || 660;
    this.textColor = config.textColor || "#484848";
    this.startLabel = config.startLabel || "Internal";
    this.endLabel = config.endLabel || "External";
    this.onItemClick = config.onItemClick;
  }

  /**
   * Card shape paths
   */
  getCardPaths() {
    return {
      // Left arrow shape (pointing right)
      leftArrow: {
        rect: `M 70.810242 34.655838L 162.810242 34.655838C 165.019342 34.655838 166.810242 36.446738 166.810242 38.655838L 166.810242 126.655838C 166.810242 128.864938 165.019342 130.655838 162.810242 130.655838L 70.810242 130.655838L 70.810242 34.655838Z`,
        arrow: `M 10.917027 85.204402C 9.694327 83.725302 9.694327 81.586302 10.917027 80.107302L 68.268727 10.729702C 69.463127 9.284902 71.810227 10.129502 71.810227 12.004002L 71.810227 153.307702C 71.810227 155.182202 69.463127 156.026802 68.268727 154.582002L 10.917027 85.204402Z`,
      },
      // Middle rounded rectangles
      roundedRect: `M 10 14C 10 11.7909 11.7909 10 14 10L 102 10C 104.2091 10 106 11.7909 106 14L 106 102C 106 104.2091 104.2091 106 102 106L 14 106C 11.7909 106 10 104.2091 10 102L 10 14Z`,
      // Right arrow shape (pointing right)
      rightArrow: {
        rect: `M 9.999992 38.999985C 9.999992 36.790885 11.790892 34.999985 13.999992 34.999985L 105.999992 34.999985L 105.999992 130.999985L 13.999992 130.999985C 11.790892 130.999985 9.999992 129.209085 9.999992 126.999985L 9.999992 38.999985Z`,
        arrow: `M 165.893192 85.204385C 167.115892 83.725285 167.115892 81.586285 165.893192 80.107285L 108.541492 10.729685C 107.347192 9.284885 104.999992 10.129485 104.999992 12.003985L 104.999992 153.307685C 104.999992 155.182185 107.347092 156.026785 108.541492 154.581985L 165.893192 85.204385Z`,
      },
    };
  }

  /**
   * Original card positions
   */
  getCardPositions() {
    return [
      { x: 151.18975830078125, y: 277.34417724609375 }, // cp_1
      { x: 308, y: 302 }, // cp_2
      { x: 404, y: 302 }, // cp_3
      { x: 500, y: 277 }, // cp_4
    ];
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
  }

  /**
   * Generate the chart
   */
  generateChart() {
    const ORIGINAL_WIDTH = 816;
    const ORIGINAL_HEIGHT = 660;
    const maxItems = 4;
    const numItems = Math.min(this.data.length, maxItems);

    const scaleX = this.width / ORIGINAL_WIDTH;
    const scaleY = this.height / ORIGINAL_HEIGHT;

    const cardPaths = this.getCardPaths();
    const cardPositions = this.getCardPositions();

    let svg = "";

    // Cards
    this.data.slice(0, numItems).forEach((item, index) => {
      const color = item.color || this.colors[index % this.colors.length];
      const pos = cardPositions[index];
      const tx = pos.x * scaleX;
      const ty = pos.y * scaleY;

      let paths;
      let labelX, labelY;

      if (index === 0) {
        // Left arrow
        paths = [cardPaths.leftArrow.rect, cardPaths.leftArrow.arrow];
        labelX = 115;
        labelY = 85;
      } else if (index === numItems - 1) {
        // Right arrow
        paths = [cardPaths.rightArrow.rect, cardPaths.rightArrow.arrow];
        labelX = 55;
        labelY = 85;
      } else {
        // Middle rounded rect
        paths = [cardPaths.roundedRect];
        labelX = 58;
        labelY = 58;
      }

      const primaryTextColor = this.resolveTextColor
        ? this.resolveTextColor(color)
        : this.textColor;
      const secondaryTextColor = this.resolveTextColor
        ? this.resolveTextColor(color, true, primaryTextColor)
        : this.textColor;

      svg += `<g transform="translate(${tx}, ${ty}) scale(${scaleX}, ${scaleY})">`;

      // Draw paths
      paths.forEach((path) => {
        svg += `
          <path
            d="${path}"
            fill="${color}"
            stroke="${this.textColor}"
            stroke-width="2"
            stroke-linejoin="round"
            stroke-linecap="round"
            opacity="0.9"/>
        `;
      });

      // Label
      svg += `
        <text
          x="${labelX}"
          y="${labelY}"
          text-anchor="middle"
          dominant-baseline="middle"
          fill="${primaryTextColor}"
          font-size="${Math.max(12, 16 / scaleX)}"
          font-weight="600">
          ${this.escapeHtml(item.label)}
        </text>
      `;

      // Description
      if (item.description) {
        const descY = index === 0 || index === numItems - 1 ? 105 : 78;
        svg += `
          <text
            x="${labelX}"
            y="${descY}"
            text-anchor="middle"
            dominant-baseline="middle"
            fill="${secondaryTextColor}"
            font-size="${Math.max(10, 12 / scaleX)}"
            opacity="0.9">
            ${this.escapeHtml(item.description)}
          </text>
        `;
      }

      svg += `</g>`;
    });

    // Axis labels
    svg += `
      <text
        x="${this.width * 0.05}"
        y="${this.height * 0.15}"
        text-anchor="middle"
        fill="${this.textColor}"
        font-size="${Math.max(12, this.width * 0.02)}"
        font-weight="600">
        ${this.escapeHtml(this.startLabel)}
      </text>

      <text
        x="${this.width * 0.95}"
        y="${this.height * 0.15}"
        text-anchor="middle"
        fill="${this.textColor}"
        font-size="${Math.max(12, this.width * 0.02)}"
        font-weight="600">
        ${this.escapeHtml(this.endLabel)}
      </text>
    `;

    return svg;
  }

  /**
   * Generate full SVG
   */
  generate() {
    const content = this.generateChart();

    return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Spectrum Horizontal Chart">
  <title>Spectrum Horizontal Chart</title>
  <desc>Horizontal card distribution spectrum</desc>
  ${content}
</svg>`.trim();
  }
}

// Export
if (typeof window !== "undefined") {
  window.SpectrumHorizontal = SpectrumHorizontal;
}


// ========== charts/SpectrumVertical.js ==========
/**
 * Spectrum Vertical Chart - Vanilla JavaScript
 * Based on chart_spectrum_vertical.html (原 chart_10)
 *
 * Features:
 * - Vertical 3D capsule stack from internal to external
 * - Top and bottom gray spheres
 * - Middle colored capsule segments (left 3D, right flat)
 * - Original dimensions: 504×774
 */

class SpectrumVertical {
  constructor(config) {
    this.data = config.data || [];
    this.colors = config.colors || ["#c8ffe5", "#ffd9d8", "#ffe4cb", "#fff8b6"];
    this.width = config.width || 600;
    this.height = config.height || 900;
    this.textColor = config.textColor || "#484848";
    this.startLabel = config.startLabel || "Internal";
    this.endLabel = config.endLabel || "External";
    this.onItemClick = config.onItemClick;
  }

  /**
   * Top sphere paths
   */
  getTopSpherePaths() {
    return {
      outer: `M 202 28C 202 18.0589 159.0193 10 106 10C 52.9807 10 10 18.0589 10 28C 10 44.775 10 35.225 10 52C 10 61.9411 52.9807 70 106 70C 159.0193 70 202 61.9411 202 52C 202 35.225 202 44.775 202 28Z`,
      middle: `M 10 28C 10.000003 37.941126 52.980667 46 106.000003 46C 159.019339 46 202.000003 37.941126 202.000003 28C 202.000003 18.058875 159.019339 10 106.000003 10C 52.980667 10 10.000003 18.058875 10.000003 28`,
      inner: `M 70 28C 70 31.866 86.1177 35 106 35C 125.8823 35 142 31.866 142 28L 142 17C 142 13.134 125.8823 10 106 10C 86.1177 10 70 13.134 70 17L 70 28Z`,
      cap: `M 142 17C 142 13.134 125.8823 10 106 10C 86.1177 10 70 13.134 70 17C 70 20.866 86.1177 24 106 24C 125.8823 24 142 20.866 142 17Z`,
    };
  }

  /**
   * Capsule segment paths
   */
  getCapsuleSegmentPaths() {
    return {
      left3D: `M 10 10L 10 58L 202 58L 202 10C 202 19.9411 159.0193 28 106 28C 52.9807 28 10 19.9411 10 10ZM 10 118L 10 70L 202 70L 202 118C 202 127.9411 159.0193 136 106 136C 52.9807 136 10 127.9411 10 118ZM 202 70L 202 58L 10 58L 10 70L 202 70Z`,
      left3DStroke: `M 202 70L 202 58M 10 70L 10 58M 10 70L 10 118C 10 127.9411 52.9807 136 106 136C 159.0193 136 202 127.9411 202 118L 202 70M 10 58L 10 10C 10 19.9411 52.9807 28 106 28C 159.0193 28 202 19.9411 202 10L 202 58`,
      rightFlat: `M 202 58L 10 58C 10.000001 31.4903 10 10 10 10L 202 10L 202 58ZM 202 70L 202 58L 10 58L 10 70L 202 70ZM 10 118L 10 70L 202 70L 202 118L 10 118Z`,
      rightFlatStroke: `M 202 58L 202 10.0001L 10.0001 10L 10 57.9999M 202 70L 202 58M 10 70L 10 58M 10 70L 10 118L 202 118L 202 70`,
    };
  }

  /**
   * Bottom sphere paths
   */
  getBottomSpherePaths() {
    return {
      fill: `M 202 34C 202 43.9411 159.0193 52 106 52C 52.9807 52 10 43.9411 10 34L 10 10C 10 19.9411 52.9807 28 106 28C 159.0193 28 202 19.9411 202 10L 202 34Z`,
      stroke: `M 106 52C 52.9807 52 10 43.9411 10 34L 10 10C 10 19.9411 52.9807 28 106 28C 159.0193 28 202 19.9411 202 10L 202 34C 202 43.9411 159.0193 52 106 52ZM 202 10C 202 26.775 202 17.225 202 34M 10 10C 10 26.775 10 17.225 10 34`,
    };
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
  }

  /**
   * Generate the chart
   */
  generateChart() {
    const ORIGINAL_WIDTH = 504;
    const ORIGINAL_HEIGHT = 774;
    const sphereColor = "#ebebeb";

    const scaleX = this.width / ORIGINAL_WIDTH;
    const scaleY = this.height / ORIGINAL_HEIGHT;

    const topSpherePaths = this.getTopSpherePaths();
    const capsulePaths = this.getCapsuleSegmentPaths();
    const bottomSpherePaths = this.getBottomSpherePaths();

    const LAYOUT = {
      topSphere: { x: 62, y: 188 },
      segments: [
        { x: 62, y: 230 },
        { x: 62, y: 338 },
        { x: 62, y: 446 },
        { x: 62, y: 554 },
      ],
      segmentRightOffset: 192,
      bottomSphere: { x: 62, y: 662 },
    };

    let svg = "";

    // Header label
    svg += `
      <text
        x="${this.width * 0.5}"
        y="${this.height * 0.06}"
        text-anchor="middle"
        fill="${this.textColor}"
        font-size="${Math.max(18, this.width * 0.03)}"
        font-weight="700">
        ${this.escapeHtml(this.endLabel)} ← → ${this.escapeHtml(this.startLabel)}
      </text>
    `;

    // Top sphere
    const topX = LAYOUT.topSphere.x * scaleX;
    const topY = LAYOUT.topSphere.y * scaleY;
    svg += `
      <g transform="translate(${topX}, ${topY}) scale(${scaleX}, ${scaleY})">
        <path d="${topSpherePaths.outer}" fill="${sphereColor}" stroke="${this.textColor}" stroke-width="2"/>
        <path d="${topSpherePaths.middle}" fill="${sphereColor}" stroke="${this.textColor}" stroke-width="2"/>
        <path d="${topSpherePaths.inner}" fill="${sphereColor}" stroke="${this.textColor}" stroke-width="2"/>
        <path d="${topSpherePaths.cap}" fill="${sphereColor}" stroke="${this.textColor}" stroke-width="2"/>
      </g>
    `;

    // Capsule segments (up to 4)
    const segments = this.data.slice(0, 4);
    segments.forEach((item, index) => {
      const segmentLayout = LAYOUT.segments[index];
      if (!segmentLayout) return;

      const color = item.color || this.colors[index % this.colors.length];
      const x = segmentLayout.x;
      const y = segmentLayout.y;

      const labelColor = this.resolveTextColor
        ? this.resolveTextColor(color)
        : this.textColor;

      // Left 3D part
      svg += `
        <g transform="translate(${x * scaleX}, ${y * scaleY}) scale(${scaleX}, ${scaleY})">
          <path d="${capsulePaths.left3D}" fill="${color}" stroke="none"/>
          <path
            d="${capsulePaths.left3DStroke}"
            fill="none"
            stroke="${this.textColor}"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"/>
        </g>
      `;

      // Right flat part
      const rightX = (x + LAYOUT.segmentRightOffset) * scaleX;
      const rightY = y * scaleY;
      svg += `
        <g transform="translate(${rightX}, ${rightY}) scale(${scaleX}, ${scaleY})">
          <path d="${capsulePaths.rightFlat}" fill="${color}" stroke="none"/>
          <path
            d="${capsulePaths.rightFlatStroke}"
            fill="none"
            stroke="${this.textColor}"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"/>
        </g>
      `;

      // Label
      svg += `
        <text
          x="${(x + 106) * scaleX}"
          y="${(y + 73) * scaleY}"
          text-anchor="middle"
          fill="${labelColor}"
          font-size="${Math.max(16, this.width * 0.025)}"
          font-weight="600">
          ${this.escapeHtml(item.label)}
        </text>
      `;
    });

    // Bottom sphere
    const bottomX = LAYOUT.bottomSphere.x * scaleX;
    const bottomY = LAYOUT.bottomSphere.y * scaleY;
    svg += `
      <g transform="translate(${bottomX}, ${bottomY}) scale(${scaleX}, ${scaleY})">
        <path d="${bottomSpherePaths.fill}" fill="${sphereColor}" stroke="none"/>
        <path
          d="${bottomSpherePaths.stroke}"
          fill="none"
          stroke="${this.textColor}"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"/>
      </g>
    `;

    return svg;
  }

  /**
   * Generate full SVG
   */
  generate() {
    const content = this.generateChart();

    return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Spectrum Vertical Chart">
  <title>Spectrum Vertical Chart</title>
  <desc>Vertical 3D capsule spectrum from internal to external</desc>
  ${content}
</svg>`.trim();
  }
}

// Export
if (typeof window !== "undefined") {
  window.SpectrumVertical = SpectrumVertical;
}


// ========== charts/StairsBlocks.js ==========
/**
 * Stairs Blocks Chart - Vanilla JavaScript
 * Flat block steps illustrating gradual progression
 */

class StairsBlocks {
  constructor(config) {
    this.data = config.data || [];
    this.colors = config.colors || [
      "#7862d1",
      "#4f92ff",
      "#3cc583",
      "#de8431",
      "#e0cb15",
    ];
    this.width = config.width || 600;
    this.height = config.height || 400;
    this.textColor = config.textColor || "#484848";
    this.onItemClick = config.onItemClick;
    this.getTextColor =
      typeof config.getTextColor === "function" ? config.getTextColor : null;
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
  }

  /**
   * Generate the chart
   */
  generateChart() {
    // Responsive dimensions based on available width/height
    const maxItems = this.width < 768 ? 4 : 10;
    const numItems = Math.min(this.data.length, maxItems);
    const availableWidth = this.width * 0.85; // Use 85% of width for content
    const totalSpacing = availableWidth * 0.12; // 12% for all spacing
    const blockWidth = (availableWidth - totalSpacing) / numItems;
    const maxHeight = this.height * 0.5; // 50% of height for max block height
    const spacing = totalSpacing / (numItems - 1);
    const startX = this.width * 0.075; // Start at 7.5% from left
    const baseY = this.height * 0.75; // Base at 75% from top

    let svg = "";

    this.data.slice(0, maxItems).forEach((item, index) => {
      const x = startX + index * (blockWidth + spacing);
      const blockHeight = maxHeight * ((index + 1) / this.data.length);
      const y = baseY - blockHeight;
      const color = item.color || this.colors[index % this.colors.length];
      const primaryTextColor = this.resolveTextColor(color);
      const secondaryTextColor = this.resolveTextColor(color, true);

      // Block
      svg += `
        <rect x="${x}" y="${y}"
              width="${blockWidth}" height="${blockHeight}"
              fill="${color}"
              stroke="${this.textColor}33"
              stroke-width="2"
              rx="4"/>
      `;

      // Value text (if provided)
      if (item.value !== undefined && blockHeight > this.height * 0.15) {
        svg += `
          <text x="${x + blockWidth / 2}" y="${y - this.height * 0.03}"
                text-anchor="middle"
                fill="${primaryTextColor}"
                font-size="${Math.max(10, this.width * 0.025)}"
                font-weight="700">
            ${this.escapeHtml(String(item.value))}
          </text>
        `;
      }

      // Label
      const labelText =
        item.label.length > 8 && this.width < 400
          ? item.label.slice(0, 6) + "..."
          : item.label;

      svg += `
        <text x="${x + blockWidth / 2}" y="${baseY + this.height * 0.08}"
              text-anchor="middle"
              fill="${primaryTextColor}"
              font-size="${Math.max(10, this.width * 0.02)}"
              font-weight="600">
          ${this.escapeHtml(labelText)}
        </text>
      `;

      // Description (if provided)
      if (item.description && this.width > 250) {
        const descText =
          item.description.length > 12
            ? item.description.slice(0, 12) + "..."
            : item.description;
        svg += `
          <text x="${x + blockWidth / 2}" y="${baseY + this.height * 0.15}"
                text-anchor="middle"
                fill="${secondaryTextColor}"
                font-size="${Math.max(8, this.width * 0.018)}">
            ${this.escapeHtml(descText)}
          </text>
        `;
      }
    });

    return svg;
  }

  /**
   * Generate full SVG
   */
  generate() {
    const content = this.generateChart();

    return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Stairs Blocks Chart">
  <title>Stairs Blocks Chart</title>
  <desc>Flat block steps illustrating gradual progression</desc>
  ${content}
</svg>`.trim();
  }

  resolveTextColor(fill, secondary = false) {
    if (this.getTextColor && fill) {
      return this.getTextColor(fill, { secondary });
    }
    if (typeof ColorUtils !== "undefined" && fill) {
      return ColorUtils.getContrastingColor(fill, secondary);
    }
    return secondary ? this.textColor + "99" : this.textColor;
  }
}

// Export
if (typeof window !== "undefined") {
  window.StairsBlocks = StairsBlocks;
}


// ========== charts/StairsCubes.js ==========
/**
 * Stairs Cubes Chart - Vanilla JavaScript
 * 3D stacked cube progression showing step-by-step advancement
 */

class StairsCubes {
  constructor(config) {
    this.data = config.data || [];
    this.colors = config.colors || [
      "#7862d1",
      "#4f92ff",
      "#3cc583",
      "#de8431",
      "#e0cb15",
    ];
    this.width = config.width || 600;
    this.height = config.height || 400;
    this.textColor = config.textColor || "#484848";
    this.onItemClick = config.onItemClick;
    this.getTextColor =
      typeof config.getTextColor === "function" ? config.getTextColor : null;
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
  }

  /**
   * Generate the chart
   */
  generateChart() {
    // Responsive dimensions based on available width/height
    const maxItems = this.width < 768 ? 4 : 10;
    const numItems = Math.min(this.data.length, maxItems);

    // Reserve space for isometric projection on the right
    const availableWidth = this.width * 0.78; // Reduced from 0.85 to leave room for right face
    const totalSpacing = availableWidth * 0.15; // 15% for all spacing
    const cubeWidth = (availableWidth - totalSpacing) / numItems;
    const cubeHeight = this.height * 0.22; // Reduced from 0.25 to fit better
    const cubeDepth = cubeWidth * 0.4; // Depth proportional to width
    const spacing = totalSpacing / (numItems - 1);
    const startX = this.width * 0.075; // Start at 7.5% from left

    // Calculate position: work backwards from the last (highest) cube
    const topFaceProjection = cubeDepth * 0.5; // Top face extends upward
    const topMargin = this.height * 0.12; // Leave 12% margin at top
    const bottomMargin = this.height * 0.18; // Leave 18% margin at bottom for labels

    // The highest cube's top edge position
    const highestCubeTop = topMargin + topFaceProjection;
    // Each cube steps down by this amount
    const stepDown = cubeHeight * 0.4;
    // The last cube's y position (it's at index numItems-1)
    const lastCubeY = highestCubeTop;
    // The first cube's y position
    const startY = lastCubeY + (numItems - 1) * stepDown;

    let svg = "";

    this.data.slice(0, maxItems).forEach((item, index) => {
      const x = startX + index * (cubeWidth + spacing);
      const y = startY - index * (cubeHeight * 0.4);
      const color = item.color || this.colors[index % this.colors.length];
      const labelColor = this.resolveTextColor(color);
      const descColor = this.resolveTextColor(color, true);

      // Front face
      svg += `
        <rect x="${x}" y="${y}"
              width="${cubeWidth}" height="${cubeHeight}"
              fill="${color}"
              stroke="${this.textColor}33"
              stroke-width="2"/>
      `;

      // Top face (isometric)
      svg += `
        <path d="M ${x} ${y}
                L ${x + cubeDepth} ${y - cubeDepth * 0.5}
                L ${x + cubeWidth + cubeDepth} ${y - cubeDepth * 0.5}
                L ${x + cubeWidth} ${y}
                Z"
              fill="${color}"
              stroke="${this.textColor}33"
              stroke-width="2"
              opacity="0.8"/>
      `;

      // Right face (isometric)
      svg += `
        <path d="M ${x + cubeWidth} ${y}
                L ${x + cubeWidth + cubeDepth} ${y - cubeDepth * 0.5}
                L ${x + cubeWidth + cubeDepth} ${y + cubeHeight - cubeDepth * 0.5}
                L ${x + cubeWidth} ${y + cubeHeight}
                Z"
              fill="${color}"
              stroke="${this.textColor}33"
              stroke-width="2"
              opacity="0.6"/>
      `;

      // Label
      svg += `
        <text x="${x + cubeWidth / 2}" y="${y + cubeHeight + this.height * 0.08}"
              text-anchor="middle"
              fill="${labelColor}"
              font-size="${Math.max(10, this.width * 0.022)}"
              font-weight="600">
          ${this.escapeHtml(item.label)}
        </text>
      `;

      // Description (if provided)
      if (item.description && this.width > 250) {
        const descText =
          item.description.length > 12
            ? item.description.slice(0, 12) + "..."
            : item.description;
        svg += `
          <text x="${x + cubeWidth / 2}" y="${y + cubeHeight + this.height * 0.14}"
                text-anchor="middle"
                fill="${descColor}"
                font-size="${Math.max(8, this.width * 0.018)}">
            ${this.escapeHtml(descText)}
          </text>
        `;
      }
    });

    return svg;
  }

  /**
   * Generate full SVG
   */
  generate() {
    const content = this.generateChart();

    return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Stairs Cubes Chart">
  <title>Stairs Cubes Chart</title>
  <desc>3D stacked cube progression showing step-by-step advancement</desc>
  ${content}
</svg>`.trim();
  }

  resolveTextColor(fill, secondary = false) {
    if (this.getTextColor && fill) {
      return this.getTextColor(fill, { secondary });
    }
    if (typeof ColorUtils !== "undefined" && fill) {
      return ColorUtils.getContrastingColor(fill, secondary);
    }
    return secondary ? this.textColor + "99" : this.textColor;
  }
}

// Export
if (typeof window !== "undefined") {
  window.StairsCubes = StairsCubes;
}


// ========== charts/StairsFocused.js ==========
/**
 * Stairs Focused Chart - Vanilla JavaScript
 * Highlighted progressive stairs emphasizing key stages
 */

class StairsFocused {
  constructor(config) {
    this.data = config.data || [];
    this.colors = config.colors || [
      "#7862d1",
      "#4f92ff",
      "#3cc583",
      "#de8431",
      "#e0cb15",
    ];
    this.width = config.width || 600;
    this.height = config.height || 400;
    this.textColor = config.textColor || "#484848";
    this.focusIndex =
      config.focusIndex !== undefined
        ? config.focusIndex
        : Math.floor(this.data.length / 2);
    this.onItemClick = config.onItemClick;
    this.getTextColor =
      typeof config.getTextColor === "function" ? config.getTextColor : null;
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text || "";
    return div.innerHTML;
  }

  /**
   * Generate the chart
   */
  generateChart() {
    // Responsive dimensions based on available width/height
    const maxItems = this.width < 768 ? 4 : 10;
    const numItems = Math.min(this.data.length, maxItems);
    const availableWidth = this.width * 0.85; // Use 85% of width for content
    const totalSpacing = availableWidth * 0.12; // 12% for all spacing
    const blockWidth = (availableWidth - totalSpacing) / numItems;
    const maxHeight = this.height * 0.5; // 50% of height for max block height
    const spacing = totalSpacing / (numItems - 1);
    const startX = this.width * 0.075; // Start at 7.5% from left
    const baseY = this.height * 0.75; // Base at 75% from top

    let svg = "";

    this.data.slice(0, maxItems).forEach((item, index) => {
      const x = startX + index * (blockWidth + spacing);
      const blockHeight = maxHeight * ((index + 1) / this.data.length);
      const y = baseY - blockHeight;
      const isFocused = index === this.focusIndex;
      const color = item.color || this.colors[index % this.colors.length];
      const strokeWidth = isFocused ? 3 : 2;
      const opacity = isFocused ? 1 : 0.7;
      const primaryTextColor = this.resolveTextColor(color);
      const secondaryTextColor = this.resolveTextColor(color, true);

      // Glow effect for focused item
      if (isFocused) {
        svg += `
          <rect x="${x - 4}" y="${y - 4}"
                width="${blockWidth + 8}" height="${blockHeight + 8}"
                fill="none"
                stroke="${color}"
                stroke-width="1"
                rx="6"
                opacity="0.4"/>
        `;
      }

      // Block
      svg += `
        <rect x="${x}" y="${y}"
              width="${blockWidth}" height="${blockHeight}"
              fill="${color}"
              stroke="${this.textColor}33"
              stroke-width="${strokeWidth}"
              rx="4"
              opacity="${opacity}"/>
      `;

      // Value text (if provided)
      if (item.value !== undefined && blockHeight > this.height * 0.15) {
        const fontSize = isFocused
          ? Math.max(12, this.width * 0.028)
          : Math.max(10, this.width * 0.022);
        const fontWeight = isFocused ? 700 : 600;

        svg += `
          <text x="${x + blockWidth / 2}" y="${y - this.height * 0.03}"
                text-anchor="middle"
                fill="${primaryTextColor}"
                font-size="${fontSize}"
                font-weight="${fontWeight}">
            ${this.escapeHtml(String(item.value))}
          </text>
        `;
      }

      // Label
      const labelText =
        item.label.length > 8 && this.width < 400
          ? item.label.slice(0, 6) + "..."
          : item.label;

      const labelFontSize = isFocused
        ? Math.max(11, this.width * 0.024)
        : Math.max(10, this.width * 0.02);
      const labelFontWeight = isFocused ? 700 : 600;

      svg += `
        <text x="${x + blockWidth / 2}" y="${baseY + this.height * 0.08}"
              text-anchor="middle"
              fill="${primaryTextColor}"
              font-size="${labelFontSize}"
              font-weight="${labelFontWeight}">
          ${this.escapeHtml(labelText)}
        </text>
      `;

      // Description (if provided)
      if (item.description && this.width > 250) {
        const descText =
          item.description.length > 12
            ? item.description.slice(0, 12) + "..."
            : item.description;
        const descFontSize = isFocused
          ? Math.max(9, this.width * 0.02)
          : Math.max(8, this.width * 0.018);

        svg += `
          <text x="${x + blockWidth / 2}" y="${baseY + this.height * 0.15}"
                text-anchor="middle"
                fill="${secondaryTextColor}"
                font-size="${descFontSize}">
            ${this.escapeHtml(descText)}
          </text>
        `;
      }
    });

    return svg;
  }

  /**
   * Generate full SVG
   */
  generate() {
    const content = this.generateChart();

    return `
<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}"
     xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Stairs Focused Chart">
  <title>Stairs Focused Chart</title>
  <desc>Highlighted progressive stairs emphasizing key stages</desc>
  ${content}
</svg>`.trim();
  }

  resolveTextColor(fill, secondary = false) {
    if (this.getTextColor && fill) {
      return this.getTextColor(fill, { secondary });
    }
    if (typeof ColorUtils !== "undefined" && fill) {
      return ColorUtils.getContrastingColor(fill, secondary);
    }
    return secondary ? this.textColor + "99" : this.textColor;
  }
}

// Export
if (typeof window !== "undefined") {
  window.StairsFocused = StairsFocused;
}


// ========== index.js ==========
/**
 * Infographics Vanilla JavaScript Library
 * 信息图表库 - 纯 JavaScript 实现
 *
 * 使用方式（类似 Chart.js）：
 *
 * new Infographic({
 *   container: 'myChart',
 *   type: 'iceberg-depth',
 *   data: [...],
 *   colors: [...],
 *   width: 800,
 *   height: 600
 * });
 */

class Infographic {
  constructor(config) {
    // 验证必需参数
    if (!config.container) {
      throw new Error("Infographic: container is required");
    }
    if (!config.type) {
      throw new Error("Infographic: type is required");
    }

    // 获取容器元素
    this.container =
      typeof config.container === "string"
        ? document.getElementById(config.container) ||
          document.querySelector(config.container)
        : config.container;

    if (!this.container) {
      throw new Error(`Infographic: container "${config.container}" not found`);
    }

    // 样式上下文（字体 + 主题）
    this.themeName = config.theme || Infographic.defaults.theme;
    this.colorOverrides = Array.isArray(config.colors) ? config.colors : null;
    this.fontOverride = config.font || null;
    this.styleContext = null;

    // 配置参数
    this.type = config.type;
    this.data = config.data || [];

    this.width = config.width || 800;
    this.height = config.height || 600;
    this.options = config.options || {};

    this.applyStyleContext({
      themeName: this.themeName,
      colors: this.colorOverrides,
      font: this.fontOverride,
      textColor: config.textColor,
    });

    // 动画选项
    this.animated = config.animated !== undefined ? config.animated : false;

    // 渲染图表
    this.render();
  }

  /**
   * 默认配色方案
   */
  getDefaultColors() {
    return Array.isArray(Infographic.defaults.palette)
      ? [...Infographic.defaults.palette]
      : [];
  }

  /**
   * 渲染图表
   */
  render() {
    try {
      let svg;

      switch (this.type) {
        case "iceberg-depth":
          svg = this.instantiateChart(IcebergDepth, "IcebergDepth").generate();
          break;

        case "range-spectrum":
          svg = this.instantiateChart(
            RangeSpectrum,
            "RangeSpectrum"
          ).generate();
          break;

        case "metrics-grid":
          svg = this.instantiateChart(MetricsGrid, "MetricsGrid").generate();
          break;

        case "edge-analysis":
          svg = this.instantiateChart(EdgeAnalysis, "EdgeAnalysis").generate();
          break;

        case "brain-mapping":
          svg = this.instantiateChart(BrainMapping, "BrainMapping").generate();
          break;

        case "comparison-overlapping-cards":
          svg = this.instantiateChart(
            ComparisonOverlappingCards,
            "ComparisonOverlappingCards"
          ).generate();
          break;

        case "comparison-house-foundation":
          svg = this.instantiateChart(
            ComparisonHouseFoundation,
            "ComparisonHouseFoundation"
          ).generate();
          break;

        case "comparison-podium-trophies":
          svg = this.instantiateChart(
            ComparisonPodiumTrophies,
            "ComparisonPodiumTrophies"
          ).generate();
          break;

        case "gem-pyramid":
          svg = this.instantiateChart(GemPyramid, "GemPyramid").generate();
          break;

        case "priority-matrix":
          svg = this.instantiateChart(
            PriorityMatrix,
            "PriorityMatrix"
          ).generate();
          break;

        case "distribution-donut":
          svg = this.instantiateChart(
            DistributionDonut,
            "DistributionDonut"
          ).generate();
          break;

        case "iceberg-complex-layers":
          svg = this.instantiateChart(
            IcebergComplexLayers,
            "IcebergComplexLayers"
          ).generate();
          break;

        case "journey-cards":
          svg = this.instantiateChart(JourneyCards, "JourneyCards").generate();
          break;

        case "journey-rocks":
          svg = this.instantiateChart(JourneyRocks, "JourneyRocks").generate();
          break;

        case "stairs-blocks":
          svg = this.instantiateChart(StairsBlocks, "StairsBlocks").generate();
          break;

        case "stairs-cubes":
          svg = this.instantiateChart(StairsCubes, "StairsCubes").generate();
          break;

        case "stairs-focused":
          svg = this.instantiateChart(
            StairsFocused,
            "StairsFocused"
          ).generate();
          break;

        case "decision-branching":
          svg = this.instantiateChart(
            DecisionBranching,
            "DecisionBranching"
          ).generate();
          break;

        case "fishbone-diagram":
          svg = this.instantiateChart(
            FishboneDiagram,
            "FishboneDiagram"
          ).generate();
          break;

        case "funnel-diagram":
          svg = this.instantiateChart(
            FunnelDiagram,
            "FunnelDiagram"
          ).generate();
          break;

        case "bullseye-progression":
          svg = this.instantiateChart(
            BullseyeProgression,
            "BullseyeProgression"
          ).generate();
          break;

        case "pyramid-isometric":
          svg = this.instantiateChart(
            PyramidIsometric,
            "PyramidIsometric"
          ).generate();
          break;

        case "bullseye-with-support":
          svg = this.instantiateChart(
            BullseyeWithSupport,
            "BullseyeWithSupport"
          ).generate();
          break;

        case "bullseye-single-arrow":
          svg = this.instantiateChart(
            BullseyeSingleArrow,
            "BullseyeSingleArrow"
          ).generate();
          break;

        case "bullseye-multi-arrows":
          svg = this.instantiateChart(
            BullseyeMultiArrows,
            "BullseyeMultiArrows"
          ).generate();
          break;

        case "block-hierarchy":
          svg = this.instantiateChart(
            BlockHierarchy,
            "BlockHierarchy"
          ).generate();
          break;

        case "iceberg-simple-mountain":
          svg = this.instantiateChart(
            IcebergSimpleMountain,
            "IcebergSimpleMountain"
          ).generate();
          break;

        case "pyramid-alternate-labels":
          svg = this.instantiateChart(
            PyramidAlternateLabels,
            "PyramidAlternateLabels"
          ).generate();
          break;

        case "pyramid-cubes-with-arrow":
          svg = this.instantiateChart(
            PyramidCubesWithArrow,
            "PyramidCubesWithArrow"
          ).generate();
          break;

        case "edge-circular-petals":
          svg = this.instantiateChart(
            EdgeCircularPetals,
            "EdgeCircularPetals"
          ).generate();
          break;

        case "edge-hexagon-nodes":
          svg = this.instantiateChart(
            EdgeHexagonNodes,
            "EdgeHexagonNodes"
          ).generate();
          break;

        case "edge-rectangular-boxes":
          svg = this.instantiateChart(
            EdgeRectangularBoxes,
            "EdgeRectangularBoxes"
          ).generate();
          break;

        case "spectrum-vertical":
          svg = this.instantiateChart(
            SpectrumVertical,
            "SpectrumVertical"
          ).generate();
          break;

        case "spectrum-horizontal":
          svg = this.instantiateChart(
            SpectrumHorizontal,
            "SpectrumHorizontal"
          ).generate();
          break;

        case "matrix-grid-2x2":
          svg = this.instantiateChart(
            MatrixGrid2x2,
            "MatrixGrid2x2"
          ).generate();
          break;

        case "matrix-curved-quadrant":
          svg = this.instantiateChart(
            MatrixCurvedQuadrant,
            "MatrixCurvedQuadrant"
          ).generate();
          break;

        case "matrix-scatter-plot":
          svg = this.instantiateChart(
            MatrixScatterPlot,
            "MatrixScatterPlot"
          ).generate();
          break;

        case "matrix-grid-2x2-cards":
          svg = this.instantiateChart(
            MatrixGrid2x2Cards,
            "MatrixGrid2x2Cards"
          ).generate();
          break;

        case "matrix-grid-2x2-with-arrows":
          svg = this.instantiateChart(
            MatrixGrid2x2WithArrows,
            "MatrixGrid2x2WithArrows",
            {
              arrowColor: this.options.arrowColor || "#969696",
              xAxisLabels: this.options.xAxisLabels,
              yAxisLabels: this.options.yAxisLabels,
            }
          ).generate();
          break;

        default:
          // Use placeholder for unknown/unimplemented chart types
          if (typeof PlaceholderChart !== "undefined") {
            svg = this.instantiateChart(PlaceholderChart, "PlaceholderChart", {
              options: { ...this.options, chartType: this.type },
            }).generate();
          } else {
            throw new Error(`Unknown chart type: ${this.type}`);
          }
      }

      // 插入 SVG 到容器（附加字体/主题属性）
      const svgWithAttributes = this.applySvgAttributes(svg);
      this.container.innerHTML = svgWithAttributes;

      // 保存 SVG 引用
      this.svgElement = this.container.querySelector("svg");
    } catch (error) {
      console.error("Infographic render error:", error);
      this.container.innerHTML = `
        <div style="padding: 20px; border: 2px solid #ff4444; border-radius: 8px; background: #fff5f5; color: #cc0000;">
          <strong>Error:</strong> ${error.message}
        </div>
      `;
      throw error;
    }
  }

  applyStyleContext(overrides = {}) {
    const styleFactory =
      typeof InfographicStyleContext !== "undefined"
        ? InfographicStyleContext
        : null;

    if (overrides.colors) {
      this.colorOverrides = overrides.colors;
    }
    if (overrides.themeName) {
      this.themeName = overrides.themeName;
    }
    if (overrides.font) {
      this.fontOverride = overrides.font;
    }

    const context = styleFactory
      ? styleFactory.createStyleContext({
          themeName: overrides.themeName || this.themeName,
          colors: overrides.colors || this.colorOverrides,
          font: overrides.font || this.fontOverride,
          textColor: overrides.textColor,
        })
      : this.fallbackStyleContext({
          themeName: overrides.themeName || this.themeName,
          colors: overrides.colors || this.colorOverrides,
          font: overrides.font || this.fontOverride,
          textColor: overrides.textColor,
        });

    this.styleContext = context;
    this.themeName = context.name;
    this.colors = Array.isArray(context.palette)
      ? [...context.palette]
      : context.palette;
    this.textColor = context.text.primary;
    this.font = context.font;
    this.getTextColor = context.getTextColor;
    this.resolveTextColor = (fill, secondary = false, fallback = null) => {
      if (this.getTextColor && fill) {
        return this.getTextColor(fill, { secondary });
      }
      if (typeof ColorUtils !== "undefined" && fill) {
        return ColorUtils.getContrastingColor(fill, secondary);
      }
      if (fallback) {
        return fallback;
      }
      if (secondary) {
        return this.textColor ? `${this.textColor}99` : "#666666";
      }
      return this.textColor || "#484848";
    };
  }

  fallbackStyleContext(options = {}) {
    const paletteSource =
      (options.colors && options.colors.length && options.colors) ||
      this.getDefaultColors();

    const font = {
      ...Infographic.defaults.font,
      ...(options.font || {}),
    };

    const primaryText = options.textColor || Infographic.defaults.textColor;
    const secondaryText = "#666666";

    const getTextColor = (fill, config = {}) => {
      if (fill && typeof ColorUtils !== "undefined") {
        return ColorUtils.getContrastingColor(fill, !!config.secondary);
      }
      return config.secondary ? secondaryText : primaryText;
    };

    const resolveTextColor = (fill, secondary = false, fallback = null) => {
      if (fill && typeof ColorUtils !== "undefined") {
        return ColorUtils.getContrastingColor(fill, secondary);
      }
      if (fallback) {
        return fallback;
      }
      return secondary ? `${primaryText}99` : primaryText;
    };

    return {
      name: options.themeName || Infographic.defaults.theme,
      palette: paletteSource,
      font,
      text: {
        primary: primaryText,
        secondary: secondaryText,
      },
      neutrals: {},
      getTextColor,
      resolveTextColor,
    };
  }

  createChartConfig(overrides = {}) {
    const paletteSource = overrides.colors ?? this.colors;
    const palette = Array.isArray(paletteSource)
      ? [...paletteSource]
      : paletteSource;

    return {
      data: overrides.data ?? this.data,
      colors: palette,
      width: overrides.width ?? this.width,
      height: overrides.height ?? this.height,
      textColor: overrides.textColor ?? this.textColor,
      font: this.font,
      themeContext: this.styleContext,
      getTextColor: this.getTextColor,
      resolveTextColor:
        typeof this.resolveTextColor === "function"
          ? this.resolveTextColor
          : (fill, secondary = false, fallback = null) =>
              fill && typeof ColorUtils !== "undefined"
                ? ColorUtils.getContrastingColor(fill, secondary)
                : fallback || this.textColor,
      accessibility: {
        getTextColor: this.getTextColor,
      },
      ...this.options,
      ...overrides,
    };
  }

  instantiateChart(ChartConstructor, chartName, overrides = {}) {
    if (typeof ChartConstructor === "undefined") {
      throw new Error(`${chartName} chart type not loaded`);
    }

    const config = this.createChartConfig(overrides);
    const chartInstance = new ChartConstructor(config);
    if (typeof chartInstance.resolveTextColor !== "function") {
      chartInstance.resolveTextColor = (fill, secondary = false, fallback) =>
        config.resolveTextColor(fill, secondary, fallback);
    }
    return chartInstance;
  }

  applySvgAttributes(svgContent) {
    if (!svgContent || typeof svgContent !== "string") {
      return svgContent;
    }

    const attributes = [];
    if (this.themeName) {
      attributes.push(
        `data-infographic-theme="${this.escapeAttribute(this.themeName)}"`
      );
    }
    if (this.font?.family) {
      attributes.push(
        `font-family="${this.escapeAttribute(this.font.family)}"`
      );
    }
    if (this.font?.weight) {
      attributes.push(
        `font-weight="${this.escapeAttribute(this.font.weight)}"`
      );
    }
    if (this.font?.size) {
      attributes.push(`font-size="${this.escapeAttribute(this.font.size)}"`);
    }

    if (!attributes.length) {
      return svgContent;
    }

    const svgTagPattern = /<svg\b/;
    if (!svgTagPattern.test(svgContent)) {
      return svgContent;
    }

    return svgContent.replace(svgTagPattern, `<svg ${attributes.join(" ")} `);
  }

  escapeAttribute(value) {
    if (value === undefined || value === null) {
      return "";
    }
    return String(value).replace(/"/g, "&quot;");
  }

  /**
   * 更新图表数据
   */
  update(newData) {
    this.data = newData;
    this.render();
  }

  /**
   * 更新图表配色
   */
  updateColors(newColors) {
    this.applyStyleContext({ colors: newColors });
    this.render();
  }

  /**
   * 导出 SVG 字符串
   */
  exportSVG() {
    return this.svgElement ? this.svgElement.outerHTML : "";
  }

  /**
   * 销毁图表
   */
  destroy() {
    if (this.container) {
      this.container.innerHTML = "";
    }
    this.svgElement = null;
  }
}

Infographic.defaults = {
  theme: "professional",
  textColor: "#484848",
  font: {
    family: "'Shantell Sans', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    size: 16,
    weight: 600,
    lineHeight: 1.3,
  },
  palette: [
    "#5d6aee",
    "#7B4397",
    "#70a7ff",
    "#4ECDC4",
    "#95E1D3",
    "#B6CEED",
    "#8E44AD",
    "#16A085",
  ],
};

Infographic.setDefaultFont = function setDefaultFont(font = {}) {
  Infographic.defaults.font = {
    ...Infographic.defaults.font,
    ...font,
  };
};

Infographic.setDefaultTheme = function setDefaultTheme(themeName) {
  if (themeName) {
    Infographic.defaults.theme = themeName;
  }
};

Infographic.setDefaultPalette = function setDefaultPalette(palette = []) {
  if (Array.isArray(palette) && palette.length) {
    Infographic.defaults.palette = [...palette];
  }
};

// 全局暴露
if (typeof window !== "undefined") {
  window.Infographic = Infographic;
}

// 导出（支持模块系统）


// ========== Auto-initialization ==========

/**
 * Auto-initialization for data-attribute driven infographics
 * Detects [data-infographic-type] elements and renders them
 */
(function() {
  function initInfographics() {
    document.querySelectorAll('[data-infographic-type]').forEach(function(container) {
      // Skip if already initialized
      if (container.__infographic) return;

      var type = container.dataset.infographicType;
      var theme = container.dataset.infographicTheme || 'professional';
      var width = parseInt(container.dataset.infographicWidth) || 800;
      var height = parseInt(container.dataset.infographicHeight) || 500;

      // Read data from embedded JSON script
      var jsonScript = container.querySelector('script[type="application/json"]');
      var data = [];
      if (jsonScript) {
        try {
          data = JSON.parse(jsonScript.textContent);
        } catch (e) {
          console.error('Infographics: Failed to parse JSON data', e);
        }
      }

      // Create infographic instance
      try {
        var instance = new Infographic({
          container: container,
          type: type,
          theme: theme,
          width: width,
          height: height,
          data: data
        });
        container.__infographic = instance;
      } catch (e) {
        console.error('Infographics: Failed to create instance', e);
      }
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInfographics);
  } else {
    initInfographics();
  }

  // Listen for theme changes from parent window
  window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'infographic-theme-change') {
      var themeId = event.data.themeId;
      document.querySelectorAll('[data-infographic-type]').forEach(function(container) {
        if (container.__infographic && typeof container.__infographic.applyStyleContext === 'function') {
          container.__infographic.applyStyleContext({ themeName: themeId });
          container.__infographic.render();
        }
      });
    }
  });

  // Expose init function for manual triggering
  window.initInfographics = initInfographics;
})();


})(typeof window !== 'undefined' ? window : this);