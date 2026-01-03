import {
  styleGuide,
  primaryBlue,
  neutral,
  success,
  error,
  warning,
  info,
} from '../styleGuide';

describe('styleGuide', () => {
  describe('primaryBlue', () => {
    it('should have all shades from 50 to 900', () => {
      expect(primaryBlue[50]).toBe('#EAEFFB');
      expect(primaryBlue[100]).toBe('#D3DFF6');
      expect(primaryBlue[200]).toBe('#A4BDEE');
      expect(primaryBlue[300]).toBe('#6897F3');
      expect(primaryBlue[400]).toBe('#3674EE');
      expect(primaryBlue[500]).toBe('#1256DB');
      expect(primaryBlue[600]).toBe('#0E45B0');
      expect(primaryBlue[700]).toBe('#0B3484');
      expect(primaryBlue[800]).toBe('#0B2455');
      expect(primaryBlue[900]).toBe('#06122B');
    });

    it('should have base color at 500', () => {
      expect(primaryBlue[500]).toBe('#1256DB');
    });
  });

  describe('neutral', () => {
    it('should have all shades from 50 to 900', () => {
      expect(neutral[50]).toBe('#F2F2F2');
      expect(neutral[100]).toBe('#E6E6E6');
      expect(neutral[200]).toBe('#CECECE');
      expect(neutral[300]).toBe('#B6B6B6');
      expect(neutral[400]).toBe('#9E9E9E');
      expect(neutral[500]).toBe('#868686');
      expect(neutral[600]).toBe('#6B6B6B');
      expect(neutral[700]).toBe('#505050');
      expect(neutral[800]).toBe('#353535');
      expect(neutral[900]).toBe('#151515');
    });

    it('should have base color at 500', () => {
      expect(neutral[500]).toBe('#868686');
    });
  });

  describe('success', () => {
    it('should have specific shades (50, 200, 500, 800)', () => {
      expect(success[50]).toBe('#E6F5E6');
      expect(success[200]).toBe('#B0E1B0');
      expect(success[500]).toBe('#009E00');
      expect(success[800]).toBe('#0D3616');
    });

    it('should have base color at 500', () => {
      expect(success[500]).toBe('#009E00');
    });
  });

  describe('error', () => {
    it('should have specific shades (50, 200, 500, 800)', () => {
      expect(error[50]).toBe('#FCE6E6');
      expect(error[200]).toBe('#F4B0B0');
      expect(error[500]).toBe('#DC0000');
      expect(error[800]).toBe('#4D0000');
    });

    it('should have base color at 500', () => {
      expect(error[500]).toBe('#DC0000');
    });
  });

  describe('warning', () => {
    it('should have specific shades (200, 500, 800)', () => {
      expect(warning[200]).toBe('#FFEBB2');
      expect(warning[500]).toBe('#F6B500');
      expect(warning[800]).toBe('#805E00');
    });

    it('should have base color at 500', () => {
      expect(warning[500]).toBe('#F6B500');
    });
  });

  describe('info', () => {
    it('should have specific shades (200, 500, 800)', () => {
      expect(info[200]).toBe('#82C3DF');
      expect(info[500]).toBe('#007BAF');
      expect(info[800]).toBe('#003146');
    });

    it('should have base color at 500', () => {
      expect(info[500]).toBe('#007BAF');
    });
  });

  describe('styleGuide object', () => {
    it('should contain all color palettes', () => {
      expect(styleGuide.primaryBlue).toBeDefined();
      expect(styleGuide.neutral).toBeDefined();
      expect(styleGuide.success).toBeDefined();
      expect(styleGuide.error).toBeDefined();
      expect(styleGuide.warning).toBeDefined();
      expect(styleGuide.info).toBeDefined();
    });

    it('should have consistent structure', () => {
      expect(styleGuide.primaryBlue).toBe(primaryBlue);
      expect(styleGuide.neutral).toBe(neutral);
      expect(styleGuide.success).toBe(success);
      expect(styleGuide.error).toBe(error);
      expect(styleGuide.warning).toBe(warning);
      expect(styleGuide.info).toBe(info);
    });
  });

  describe('Color format validation', () => {
    it('all primaryBlue colors should be valid hex codes', () => {
      const hexPattern = /^#[0-9A-F]{6}$/i;
      Object.values(primaryBlue).forEach((color) => {
        expect(color).toMatch(hexPattern);
      });
    });

    it('all neutral colors should be valid hex codes', () => {
      const hexPattern = /^#[0-9A-F]{6}$/i;
      Object.values(neutral).forEach((color) => {
        expect(color).toMatch(hexPattern);
      });
    });

    it('all success colors should be valid hex codes', () => {
      const hexPattern = /^#[0-9A-F]{6}$/i;
      Object.values(success).forEach((color) => {
        expect(color).toMatch(hexPattern);
      });
    });

    it('all error colors should be valid hex codes', () => {
      const hexPattern = /^#[0-9A-F]{6}$/i;
      Object.values(error).forEach((color) => {
        expect(color).toMatch(hexPattern);
      });
    });

    it('all warning colors should be valid hex codes', () => {
      const hexPattern = /^#[0-9A-F]{6}$/i;
      Object.values(warning).forEach((color) => {
        expect(color).toMatch(hexPattern);
      });
    });

    it('all info colors should be valid hex codes', () => {
      const hexPattern = /^#[0-9A-F]{6}$/i;
      Object.values(info).forEach((color) => {
        expect(color).toMatch(hexPattern);
      });
    });
  });

  describe('Type safety', () => {
    it('should allow accessing colors by numeric keys', () => {
      // This is more of a TypeScript compile-time test
      // If this compiles without errors, the types are correct
      const color1: string = primaryBlue[500];
      const color2: string = neutral[50];
      const color3: string = success[500];
      const color4: string = error[500];
      const color5: string = warning[500];
      const color6: string = info[500];

      expect(color1).toBeDefined();
      expect(color2).toBeDefined();
      expect(color3).toBeDefined();
      expect(color4).toBeDefined();
      expect(color5).toBeDefined();
      expect(color6).toBeDefined();
    });
  });
});
