"use client";

/**
 * Color conversion utilities for PDF export compatibility
 * Converts modern CSS color functions (oklch, lab, lch, etc.) to RGB format
 * that html2canvas can properly process
 */

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface HSLColor {
  h: number;
  s: number;
  l: number;
}

export interface LABColor {
  l: number;
  a: number;
  b: number;
}

export interface OKLCHColor {
  l: number;
  c: number;
  h: number;
}

export class ColorConverter {
  /**
   * Convert OKLCH color to RGB
   * @param l Lightness (0-1)
   * @param c Chroma (0-0.4+)
   * @param h Hue (0-360)
   * @returns RGB color object
   */
  static oklchToRgb(l: number, c: number, h: number): RGBColor {
    // Convert OKLCH to OKLab first
    const hRad = (h * Math.PI) / 180;
    const a = c * Math.cos(hRad);
    const b = c * Math.sin(hRad);
    
    // Convert OKLab to linear RGB
    const lms = this.oklabToLms(l, a, b);
    const linearRgb = this.lmsToLinearRgb(lms);
    
    // Convert linear RGB to sRGB
    return this.linearRgbToSrgb(linearRgb);
  }

  /**
   * Convert LAB color to RGB
   * @param l Lightness (0-100)
   * @param a Green-Red axis (-128 to 127)
   * @param b Blue-Yellow axis (-128 to 127)
   * @returns RGB color object
   */
  static labToRgb(l: number, a: number, b: number): RGBColor {
    // Convert LAB to XYZ
    const xyz = this.labToXyz(l, a, b);
    
    // Convert XYZ to RGB
    return this.xyzToRgb(xyz);
  }

  /**
   * Parse CSS color string and convert to RGB
   * Supports: oklch(), lab(), lch(), hsl(), rgb(), hex
   */
  static parseAndConvertToRgb(colorString: string): string {
    const trimmed = colorString.trim();

    // Already RGB format
    if (trimmed.startsWith('rgb(') || trimmed.startsWith('rgba(')) {
      return trimmed;
    }

    // Hex colors
    if (trimmed.startsWith('#')) {
      return this.hexToRgb(trimmed);
    }

    // OKLCH colors
    const oklchMatch = trimmed.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/);
    if (oklchMatch) {
      const [, l, c, h] = oklchMatch;
      const rgb = this.oklchToRgb(parseFloat(l), parseFloat(c), parseFloat(h));
      return `rgb(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)})`;
    }

    // LAB colors
    const labMatch = trimmed.match(/lab\(\s*([\d.]+)%?\s+([-\d.]+)\s+([-\d.]+)\s*\)/);
    if (labMatch) {
      const [, l, a, b] = labMatch;
      const rgb = this.labToRgb(parseFloat(l), parseFloat(a), parseFloat(b));
      return `rgb(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)})`;
    }

    // LCH colors
    const lchMatch = trimmed.match(/lch\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)\s*\)/);
    if (lchMatch) {
      const [, l, c, h] = lchMatch;
      // Convert LCH to LAB first
      const hRad = (parseFloat(h) * Math.PI) / 180;
      const a = parseFloat(c) * Math.cos(hRad);
      const b = parseFloat(c) * Math.sin(hRad);
      const rgb = this.labToRgb(parseFloat(l), a, b);
      return `rgb(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)})`;
    }

    // HSL colors
    const hslMatch = trimmed.match(/hsl\(\s*([\d.]+)\s*,?\s*([\d.]+)%\s*,?\s*([\d.]+)%\s*\)/);
    if (hslMatch) {
      const [, h, s, l] = hslMatch;
      const rgb = this.hslToRgb(parseFloat(h), parseFloat(s) / 100, parseFloat(l) / 100);
      return `rgb(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)})`;
    }

    // Named colors - convert common ones
    const namedColors: Record<string, string> = {
      black: 'rgb(0, 0, 0)',
      white: 'rgb(255, 255, 255)',
      red: 'rgb(255, 0, 0)',
      green: 'rgb(0, 128, 0)',
      blue: 'rgb(0, 0, 255)',
      yellow: 'rgb(255, 255, 0)',
      cyan: 'rgb(0, 255, 255)',
      magenta: 'rgb(255, 0, 255)',
      gray: 'rgb(128, 128, 128)',
      grey: 'rgb(128, 128, 128)',
      transparent: 'rgba(0, 0, 0, 0)',
    };

    if (namedColors[trimmed.toLowerCase()]) {
      return namedColors[trimmed.toLowerCase()];
    }

    // If we can't parse it, return as-is
    console.warn(`Unable to convert color: ${colorString}`);
    return trimmed;
  }

  /**
   * Convert all CSS color functions in a stylesheet to RGB
   */
  static convertStyleSheetColors(cssText: string): string {
    // Replace OKLCH functions
    cssText = cssText.replace(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/g, (match, l, c, h) => {
      const rgb = this.oklchToRgb(parseFloat(l), parseFloat(c), parseFloat(h));
      return `rgb(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)})`;
    });

    // Replace LAB functions
    cssText = cssText.replace(/lab\(\s*([\d.]+)%?\s+([-\d.]+)\s+([-\d.]+)\s*\)/g, (match, l, a, b) => {
      const rgb = this.labToRgb(parseFloat(l), parseFloat(a), parseFloat(b));
      return `rgb(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)})`;
    });

    // Replace LCH functions
    cssText = cssText.replace(/lch\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)\s*\)/g, (match, l, c, h) => {
      const hRad = (parseFloat(h) * Math.PI) / 180;
      const a = parseFloat(c) * Math.cos(hRad);
      const b = parseFloat(c) * Math.sin(hRad);
      const rgb = this.labToRgb(parseFloat(l), a, b);
      return `rgb(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)})`;
    });

    return cssText;
  }

  /**
   * Apply color conversion to all stylesheets in the document
   */
  static async convertDocumentColors(): Promise<void> {
    // Process all style elements
    document.querySelectorAll('style').forEach(styleElement => {
      if (styleElement.textContent) {
        styleElement.textContent = this.convertStyleSheetColors(styleElement.textContent);
      }
    });

    // Process inline styles
    document.querySelectorAll('[style]').forEach(element => {
      const style = (element as HTMLElement).style;
      for (let i = 0; i < style.length; i++) {
        const property = style[i];
        const value = style.getPropertyValue(property);
        const convertedValue = this.parseAndConvertToRgb(value);
        if (convertedValue !== value) {
          style.setProperty(property, convertedValue);
        }
      }
    });

    // Process external stylesheets (if same-origin)
    for (let i = 0; i < document.styleSheets.length; i++) {
      try {
        const styleSheet = document.styleSheets[i] as CSSStyleSheet;
        if (styleSheet.cssRules) {
          this.processStyleSheetRules(styleSheet);
        }
      } catch (e) {
        // Skip cross-origin stylesheets
        console.warn('Cannot process cross-origin stylesheet:', e);
      }
    }
  }

  private static processStyleSheetRules(styleSheet: CSSStyleSheet): void {
    try {
      for (let i = 0; i < styleSheet.cssRules.length; i++) {
        const rule = styleSheet.cssRules[i];
        if (rule instanceof CSSStyleRule) {
          const style = rule.style;
          for (let j = 0; j < style.length; j++) {
            const property = style[j];
            const value = style.getPropertyValue(property);
            const convertedValue = this.parseAndConvertToRgb(value);
            if (convertedValue !== value) {
              style.setProperty(property, convertedValue);
            }
          }
        }
      }
    } catch (e) {
      console.warn('Error processing stylesheet rules:', e);
    }
  }

  // Helper methods for color space conversions

  private static oklabToLms(l: number, a: number, b: number): { l: number; m: number; s: number } {
    const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

    return {
      l: l_ * l_ * l_,
      m: m_ * m_ * m_,
      s: s_ * s_ * s_,
    };
  }

  private static lmsToLinearRgb(lms: { l: number; m: number; s: number }): RGBColor {
    return {
      r: +4.0767416621 * lms.l - 3.3077115913 * lms.m + 0.2309699292 * lms.s,
      g: -1.2684380046 * lms.l + 2.6097574011 * lms.m - 0.3413193965 * lms.s,
      b: -0.0041960863 * lms.l - 0.7034186147 * lms.m + 1.7076147010 * lms.s,
    };
  }

  private static linearRgbToSrgb(rgb: RGBColor): RGBColor {
    const gamma = (val: number) => {
      const abs = Math.abs(val);
      if (abs > 0.0031308) {
        return (val < 0 ? -1 : 1) * (1.055 * Math.pow(abs, 1 / 2.4) - 0.055);
      }
      return val * 12.92;
    };

    return {
      r: Math.max(0, Math.min(255, gamma(rgb.r) * 255)),
      g: Math.max(0, Math.min(255, gamma(rgb.g) * 255)),
      b: Math.max(0, Math.min(255, gamma(rgb.b) * 255)),
    };
  }

  private static labToXyz(l: number, a: number, b: number): { x: number; y: number; z: number } {
    const fy = (l + 16) / 116;
    const fx = a / 500 + fy;
    const fz = fy - b / 200;

    const xr = fx > 0.206893034 ? fx * fx * fx : (fx - 16 / 116) / 7.787;
    const yr = fy > 0.206893034 ? fy * fy * fy : (fy - 16 / 116) / 7.787;
    const zr = fz > 0.206893034 ? fz * fz * fz : (fz - 16 / 116) / 7.787;

    return {
      x: xr * 95.047,
      y: yr * 100.000,
      z: zr * 108.883,
    };
  }

  private static xyzToRgb(xyz: { x: number; y: number; z: number }): RGBColor {
    const x = xyz.x / 100;
    const y = xyz.y / 100;
    const z = xyz.z / 100;

    let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
    let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
    let b = x * 0.0557 + y * -0.2040 + z * 1.0570;

    r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
    g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
    b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b;

    return {
      r: Math.max(0, Math.min(255, Math.round(r * 255))),
      g: Math.max(0, Math.min(255, Math.round(g * 255))),
      b: Math.max(0, Math.min(255, Math.round(b * 255))),
    };
  }

  private static hslToRgb(h: number, s: number, l: number): RGBColor {
    h = h / 360;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h * 6) % 2 - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 1 / 6) {
      r = c; g = x; b = 0;
    } else if (h >= 1 / 6 && h < 2 / 6) {
      r = x; g = c; b = 0;
    } else if (h >= 2 / 6 && h < 3 / 6) {
      r = 0; g = c; b = x;
    } else if (h >= 3 / 6 && h < 4 / 6) {
      r = 0; g = x; b = c;
    } else if (h >= 4 / 6 && h < 5 / 6) {
      r = x; g = 0; b = c;
    } else if (h >= 5 / 6 && h < 1) {
      r = c; g = 0; b = x;
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
    };
  }

  private static hexToRgb(hex: string): string {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      return `rgb(${r}, ${g}, ${b})`;
    }
    return hex;
  }
}

export default ColorConverter;