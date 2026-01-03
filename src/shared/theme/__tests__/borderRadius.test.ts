/**
 * Border Radius System - Testes
 */

import {
  borderRadius,
  borderRadiusPresets,
  createBorderRadius,
  createSelectiveBorderRadius,
} from '../borderRadius';

describe('Border Radius System', () => {
  describe('borderRadius', () => {
    it('should have correct radius values', () => {
      expect(borderRadius.xs).toBe(4);
      expect(borderRadius.sm).toBe(8);
      expect(borderRadius.md).toBe(16);
      expect(borderRadius.lg).toBe(24);
      expect(borderRadius.xl).toBe(32);
      expect(borderRadius.full).toBe(9999);
      expect(borderRadius.none).toBe(0);
    });

    it('should have progressive values', () => {
      expect(borderRadius.sm).toBeGreaterThan(borderRadius.xs);
      expect(borderRadius.md).toBeGreaterThan(borderRadius.sm);
      expect(borderRadius.lg).toBeGreaterThan(borderRadius.md);
      expect(borderRadius.xl).toBeGreaterThan(borderRadius.lg);
    });

    it('should follow 2x progression pattern', () => {
      expect(borderRadius.sm).toBe(borderRadius.xs * 2);
      expect(borderRadius.md).toBe(borderRadius.sm * 2);
    });

    it('should have values that are multiples of 4', () => {
      expect(borderRadius.xs % 4).toBe(0);
      expect(borderRadius.sm % 4).toBe(0);
      expect(borderRadius.md % 4).toBe(0);
      expect(borderRadius.lg % 4).toBe(0);
      expect(borderRadius.xl % 4).toBe(0);
    });
  });

  describe('borderRadiusPresets', () => {
    describe('button presets', () => {
      it('should have button preset with sm radius', () => {
        expect(borderRadiusPresets.button.borderRadius).toBe(8);
      });

      it('should have buttonPill preset with full radius', () => {
        expect(borderRadiusPresets.buttonPill.borderRadius).toBe(9999);
      });
    });

    describe('card presets', () => {
      it('should have card preset with md radius', () => {
        expect(borderRadiusPresets.card.borderRadius).toBe(16);
      });

      it('should have cardLarge preset with lg radius', () => {
        expect(borderRadiusPresets.cardLarge.borderRadius).toBe(24);
      });
    });

    describe('input preset', () => {
      it('should have input preset with sm radius', () => {
        expect(borderRadiusPresets.input.borderRadius).toBe(8);
      });
    });

    describe('badge presets', () => {
      it('should have badge preset with xs radius', () => {
        expect(borderRadiusPresets.badge.borderRadius).toBe(4);
      });

      it('should have badgePill preset with full radius', () => {
        expect(borderRadiusPresets.badgePill.borderRadius).toBe(9999);
      });
    });

    describe('modal preset', () => {
      it('should have modal preset with lg radius', () => {
        expect(borderRadiusPresets.modal.borderRadius).toBe(24);
      });
    });

    describe('bottomSheet preset', () => {
      it('should have rounded top corners', () => {
        expect(borderRadiusPresets.bottomSheet.borderTopLeftRadius).toBe(24);
        expect(borderRadiusPresets.bottomSheet.borderTopRightRadius).toBe(24);
      });

      it('should have square bottom corners', () => {
        expect(borderRadiusPresets.bottomSheet.borderBottomLeftRadius).toBe(0);
        expect(borderRadiusPresets.bottomSheet.borderBottomRightRadius).toBe(0);
      });
    });

    describe('avatar presets', () => {
      it('should have avatarCircular with full radius', () => {
        expect(borderRadiusPresets.avatarCircular.borderRadius).toBe(9999);
      });

      it('should have avatarRounded with md radius', () => {
        expect(borderRadiusPresets.avatarRounded.borderRadius).toBe(16);
      });
    });

    describe('chip preset', () => {
      it('should have chip preset with full radius', () => {
        expect(borderRadiusPresets.chip.borderRadius).toBe(9999);
      });
    });

    describe('alert preset', () => {
      it('should have alert preset with sm radius', () => {
        expect(borderRadiusPresets.alert.borderRadius).toBe(8);
      });
    });

    describe('thumbnail preset', () => {
      it('should have thumbnail preset with xs radius', () => {
        expect(borderRadiusPresets.thumbnail.borderRadius).toBe(4);
      });
    });

    describe('selective presets', () => {
      it('should have topOnly preset with rounded top', () => {
        expect(borderRadiusPresets.topOnly.borderTopLeftRadius).toBe(16);
        expect(borderRadiusPresets.topOnly.borderTopRightRadius).toBe(16);
        expect(borderRadiusPresets.topOnly.borderBottomLeftRadius).toBe(0);
        expect(borderRadiusPresets.topOnly.borderBottomRightRadius).toBe(0);
      });

      it('should have bottomOnly preset with rounded bottom', () => {
        expect(borderRadiusPresets.bottomOnly.borderTopLeftRadius).toBe(0);
        expect(borderRadiusPresets.bottomOnly.borderTopRightRadius).toBe(0);
        expect(borderRadiusPresets.bottomOnly.borderBottomLeftRadius).toBe(16);
        expect(borderRadiusPresets.bottomOnly.borderBottomRightRadius).toBe(16);
      });

      it('should have leftOnly preset with rounded left', () => {
        expect(borderRadiusPresets.leftOnly.borderTopLeftRadius).toBe(16);
        expect(borderRadiusPresets.leftOnly.borderTopRightRadius).toBe(0);
        expect(borderRadiusPresets.leftOnly.borderBottomLeftRadius).toBe(16);
        expect(borderRadiusPresets.leftOnly.borderBottomRightRadius).toBe(0);
      });

      it('should have rightOnly preset with rounded right', () => {
        expect(borderRadiusPresets.rightOnly.borderTopLeftRadius).toBe(0);
        expect(borderRadiusPresets.rightOnly.borderTopRightRadius).toBe(16);
        expect(borderRadiusPresets.rightOnly.borderBottomLeftRadius).toBe(0);
        expect(borderRadiusPresets.rightOnly.borderBottomRightRadius).toBe(16);
      });
    });
  });

  describe('createBorderRadius', () => {
    it('should create border radius object for xs', () => {
      const result = createBorderRadius('xs');
      expect(result).toEqual({ borderRadius: 4 });
    });

    it('should create border radius object for sm', () => {
      const result = createBorderRadius('sm');
      expect(result).toEqual({ borderRadius: 8 });
    });

    it('should create border radius object for md', () => {
      const result = createBorderRadius('md');
      expect(result).toEqual({ borderRadius: 16 });
    });

    it('should create border radius object for lg', () => {
      const result = createBorderRadius('lg');
      expect(result).toEqual({ borderRadius: 24 });
    });

    it('should create border radius object for xl', () => {
      const result = createBorderRadius('xl');
      expect(result).toEqual({ borderRadius: 32 });
    });

    it('should create border radius object for full', () => {
      const result = createBorderRadius('full');
      expect(result).toEqual({ borderRadius: 9999 });
    });

    it('should create border radius object for none', () => {
      const result = createBorderRadius('none');
      expect(result).toEqual({ borderRadius: 0 });
    });
  });

  describe('createSelectiveBorderRadius', () => {
    it('should create all corners with different values', () => {
      const result = createSelectiveBorderRadius({
        topLeft: 'xs',
        topRight: 'sm',
        bottomLeft: 'md',
        bottomRight: 'lg',
      });

      expect(result).toEqual({
        borderTopLeftRadius: 4,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 24,
      });
    });

    it('should default to 0 for missing corners', () => {
      const result = createSelectiveBorderRadius({
        topLeft: 'md',
      });

      expect(result).toEqual({
        borderTopLeftRadius: 16,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      });
    });

    it('should handle no options provided', () => {
      const result = createSelectiveBorderRadius({});

      expect(result).toEqual({
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      });
    });

    it('should create diagonal rounded corners', () => {
      const result = createSelectiveBorderRadius({
        topLeft: 'xl',
        bottomRight: 'xl',
      });

      expect(result).toEqual({
        borderTopLeftRadius: 32,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 32,
      });
    });

    it('should create top-only rounded corners', () => {
      const result = createSelectiveBorderRadius({
        topLeft: 'lg',
        topRight: 'lg',
      });

      expect(result).toEqual({
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      });
    });
  });

  describe('Type Safety', () => {
    it('should have all required size keys', () => {
      const keys = Object.keys(borderRadius);
      expect(keys).toContain('xs');
      expect(keys).toContain('sm');
      expect(keys).toContain('md');
      expect(keys).toContain('lg');
      expect(keys).toContain('xl');
      expect(keys).toContain('full');
      expect(keys).toContain('none');
    });

    it('should have all required preset keys', () => {
      const keys = Object.keys(borderRadiusPresets);
      expect(keys).toContain('button');
      expect(keys).toContain('buttonPill');
      expect(keys).toContain('card');
      expect(keys).toContain('cardLarge');
      expect(keys).toContain('input');
      expect(keys).toContain('badge');
      expect(keys).toContain('badgePill');
      expect(keys).toContain('modal');
      expect(keys).toContain('bottomSheet');
      expect(keys).toContain('avatarCircular');
      expect(keys).toContain('avatarRounded');
      expect(keys).toContain('chip');
      expect(keys).toContain('alert');
      expect(keys).toContain('thumbnail');
    });
  });
});
