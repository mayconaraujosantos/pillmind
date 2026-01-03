/**
 * Spacing System - Testes
 */

import {
  spacing,
  spacingScale,
  insets,
  stack,
  inline,
  gap,
  componentSpacing,
  createPadding,
  createPaddingHorizontal,
  createPaddingVertical,
  createMargin,
  createMarginHorizontal,
  createMarginVertical,
  createGap,
  createCustomSpacing,
} from '../spacing';

describe('Spacing System', () => {
  describe('spacing', () => {
    it('should have correct spacing values', () => {
      expect(spacing.none).toBe(0);
      expect(spacing.xxs).toBe(4);
      expect(spacing.xs).toBe(8);
      expect(spacing.sm).toBe(16);
      expect(spacing.md).toBe(24);
      expect(spacing.lg).toBe(32);
      expect(spacing.xl).toBe(40);
      expect(spacing.xxl).toBe(48);
      expect(spacing.xxxl).toBe(56);
      expect(spacing.xxxxl).toBe(64);
      expect(spacing.xxxxxl).toBe(72);
      expect(spacing.xxxxxxl).toBe(80);
      expect(spacing.xxxxxxxl).toBe(88);
      expect(spacing.xxxxxxxxl).toBe(96);
    });

    it('should follow 8px base progression', () => {
      expect(spacing.xs).toBe(8);
      expect(spacing.sm).toBe(16);
      expect(spacing.md).toBe(24);
      expect(spacing.lg).toBe(32);
      expect(spacing.xl).toBe(40);
      expect(spacing.xxl).toBe(48);
    });

    it('should have values that are multiples of 4', () => {
      Object.values(spacing).forEach((value) => {
        expect(value % 4).toBe(0);
      });
    });

    it('should have progressive values', () => {
      expect(spacing.xs).toBeGreaterThan(spacing.xxs);
      expect(spacing.sm).toBeGreaterThan(spacing.xs);
      expect(spacing.md).toBeGreaterThan(spacing.sm);
      expect(spacing.lg).toBeGreaterThan(spacing.md);
    });
  });

  describe('spacingScale', () => {
    it('should map scale numbers to spacing values', () => {
      expect(spacingScale[0]).toBe(0);
      expect(spacingScale[1]).toBe(4);
      expect(spacingScale[2]).toBe(8);
      expect(spacingScale[4]).toBe(16);
      expect(spacingScale[6]).toBe(24);
      expect(spacingScale[8]).toBe(32);
    });

    it('should have correct max scale value', () => {
      expect(spacingScale[24]).toBe(96);
    });
  });

  describe('insets', () => {
    it('should have correct inset padding values', () => {
      expect(insets.none.padding).toBe(0);
      expect(insets.xxs.padding).toBe(4);
      expect(insets.xs.padding).toBe(8);
      expect(insets.sm.padding).toBe(16);
      expect(insets.md.padding).toBe(24);
      expect(insets.lg.padding).toBe(32);
      expect(insets.xl.padding).toBe(40);
    });

    it('should use spacing values', () => {
      expect(insets.xs.padding).toBe(spacing.xs);
      expect(insets.sm.padding).toBe(spacing.sm);
      expect(insets.md.padding).toBe(spacing.md);
    });
  });

  describe('stack', () => {
    it('should have correct stack margin values', () => {
      expect(stack.none.marginBottom).toBe(0);
      expect(stack.xxs.marginBottom).toBe(4);
      expect(stack.xs.marginBottom).toBe(8);
      expect(stack.sm.marginBottom).toBe(16);
      expect(stack.md.marginBottom).toBe(24);
      expect(stack.lg.marginBottom).toBe(32);
      expect(stack.xl.marginBottom).toBe(40);
    });

    it('should use spacing values', () => {
      expect(stack.xs.marginBottom).toBe(spacing.xs);
      expect(stack.md.marginBottom).toBe(spacing.md);
    });
  });

  describe('inline', () => {
    it('should have correct inline margin values', () => {
      expect(inline.none.marginRight).toBe(0);
      expect(inline.xxs.marginRight).toBe(4);
      expect(inline.xs.marginRight).toBe(8);
      expect(inline.sm.marginRight).toBe(16);
      expect(inline.md.marginRight).toBe(24);
      expect(inline.lg.marginRight).toBe(32);
      expect(inline.xl.marginRight).toBe(40);
    });

    it('should use spacing values', () => {
      expect(inline.xs.marginRight).toBe(spacing.xs);
      expect(inline.lg.marginRight).toBe(spacing.lg);
    });
  });

  describe('gap', () => {
    it('should have correct gap values', () => {
      expect(gap.none).toBe(0);
      expect(gap.xxs).toBe(4);
      expect(gap.xs).toBe(8);
      expect(gap.sm).toBe(16);
      expect(gap.md).toBe(24);
      expect(gap.lg).toBe(32);
      expect(gap.xl).toBe(40);
      expect(gap.xxl).toBe(48);
    });
  });

  describe('componentSpacing', () => {
    describe('button spacing', () => {
      it('should have correct button padding', () => {
        expect(componentSpacing.button.paddingVertical).toBe(8);
        expect(componentSpacing.button.paddingHorizontal).toBe(16);
      });

      it('should have correct buttonLarge padding', () => {
        expect(componentSpacing.buttonLarge.paddingVertical).toBe(16);
        expect(componentSpacing.buttonLarge.paddingHorizontal).toBe(24);
      });

      it('should have correct buttonSmall padding', () => {
        expect(componentSpacing.buttonSmall.paddingVertical).toBe(4);
        expect(componentSpacing.buttonSmall.paddingHorizontal).toBe(8);
      });
    });

    describe('card spacing', () => {
      it('should have correct card padding', () => {
        expect(componentSpacing.card.padding).toBe(16);
      });

      it('should have correct cardLarge padding', () => {
        expect(componentSpacing.cardLarge.padding).toBe(24);
      });
    });

    describe('input spacing', () => {
      it('should have correct input padding', () => {
        expect(componentSpacing.input.paddingVertical).toBe(8);
        expect(componentSpacing.input.paddingHorizontal).toBe(16);
      });
    });

    describe('modal spacing', () => {
      it('should have correct modal padding', () => {
        expect(componentSpacing.modal.padding).toBe(24);
      });
    });

    describe('layout spacing', () => {
      it('should have correct section margin', () => {
        expect(componentSpacing.section.marginBottom).toBe(32);
      });

      it('should have correct listItem margin', () => {
        expect(componentSpacing.listItem.marginBottom).toBe(8);
      });

      it('should have correct page padding', () => {
        expect(componentSpacing.page.paddingHorizontal).toBe(16);
        expect(componentSpacing.page.paddingVertical).toBe(24);
      });
    });
  });

  describe('createPadding', () => {
    it('should create uniform padding', () => {
      expect(createPadding('sm')).toEqual({ padding: 16 });
      expect(createPadding('md')).toEqual({ padding: 24 });
      expect(createPadding('lg')).toEqual({ padding: 32 });
    });
  });

  describe('createPaddingHorizontal', () => {
    it('should create horizontal padding', () => {
      expect(createPaddingHorizontal('xs')).toEqual({ paddingHorizontal: 8 });
      expect(createPaddingHorizontal('sm')).toEqual({ paddingHorizontal: 16 });
    });
  });

  describe('createPaddingVertical', () => {
    it('should create vertical padding', () => {
      expect(createPaddingVertical('xs')).toEqual({ paddingVertical: 8 });
      expect(createPaddingVertical('md')).toEqual({ paddingVertical: 24 });
    });
  });

  describe('createMargin', () => {
    it('should create uniform margin', () => {
      expect(createMargin('sm')).toEqual({ margin: 16 });
      expect(createMargin('lg')).toEqual({ margin: 32 });
    });
  });

  describe('createMarginHorizontal', () => {
    it('should create horizontal margin', () => {
      expect(createMarginHorizontal('xs')).toEqual({ marginHorizontal: 8 });
      expect(createMarginHorizontal('md')).toEqual({ marginHorizontal: 24 });
    });
  });

  describe('createMarginVertical', () => {
    it('should create vertical margin', () => {
      expect(createMarginVertical('sm')).toEqual({ marginVertical: 16 });
      expect(createMarginVertical('xl')).toEqual({ marginVertical: 40 });
    });
  });

  describe('createGap', () => {
    it('should create gap value', () => {
      expect(createGap('xs')).toEqual({ gap: 8 });
      expect(createGap('sm')).toEqual({ gap: 16 });
      expect(createGap('md')).toEqual({ gap: 24 });
    });
  });

  describe('createCustomSpacing', () => {
    it('should create custom spacing for all sides', () => {
      const result = createCustomSpacing({
        top: 'xs',
        right: 'sm',
        bottom: 'md',
        left: 'lg',
      });

      expect(result).toEqual({
        paddingTop: 8,
        paddingRight: 16,
        paddingBottom: 24,
        paddingLeft: 32,
      });
    });

    it('should default to 0 for missing sides', () => {
      const result = createCustomSpacing({
        top: 'md',
      });

      expect(result).toEqual({
        paddingTop: 24,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
      });
    });

    it('should handle no options', () => {
      const result = createCustomSpacing({});

      expect(result).toEqual({
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
      });
    });

    it('should create asymmetric spacing', () => {
      const result = createCustomSpacing({
        top: 'xl',
        bottom: 'xs',
      });

      expect(result).toEqual({
        paddingTop: 40,
        paddingRight: 0,
        paddingBottom: 8,
        paddingLeft: 0,
      });
    });
  });

  describe('Type Safety', () => {
    it('should have all spacing size keys', () => {
      const keys = Object.keys(spacing);
      expect(keys).toContain('none');
      expect(keys).toContain('xxs');
      expect(keys).toContain('xs');
      expect(keys).toContain('sm');
      expect(keys).toContain('md');
      expect(keys).toContain('lg');
      expect(keys).toContain('xl');
    });

    it('should have all component spacing keys', () => {
      const keys = Object.keys(componentSpacing);
      expect(keys).toContain('button');
      expect(keys).toContain('buttonLarge');
      expect(keys).toContain('buttonSmall');
      expect(keys).toContain('card');
      expect(keys).toContain('cardLarge');
      expect(keys).toContain('input');
      expect(keys).toContain('modal');
      expect(keys).toContain('section');
      expect(keys).toContain('listItem');
      expect(keys).toContain('page');
    });
  });

  describe('Consistency', () => {
    it('should maintain consistency between insets and spacing', () => {
      expect(insets.sm.padding).toBe(spacing.sm);
      expect(insets.md.padding).toBe(spacing.md);
      expect(insets.lg.padding).toBe(spacing.lg);
    });

    it('should maintain consistency between stack and spacing', () => {
      expect(stack.xs.marginBottom).toBe(spacing.xs);
      expect(stack.md.marginBottom).toBe(spacing.md);
      expect(stack.xl.marginBottom).toBe(spacing.xl);
    });

    it('should maintain consistency between inline and spacing', () => {
      expect(inline.sm.marginRight).toBe(spacing.sm);
      expect(inline.lg.marginRight).toBe(spacing.lg);
    });
  });
});
