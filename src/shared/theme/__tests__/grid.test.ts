/**
 * Grid System - Testes
 */

import { Dimensions } from 'react-native';
import {
  breakpoints,
  mobileGrid,
  getColumnWidth,
  getSpanWidth,
  gridSpacing,
  container,
  row,
  columnBase,
  columns,
  generateColumnStyles,
  layoutPresets,
} from '../grid';

describe('Grid System', () => {
  describe('breakpoints', () => {
    it('should have correct breakpoint values', () => {
      expect(breakpoints.mobile).toBe(440);
      expect(breakpoints.tablet).toBe(768);
      expect(breakpoints.desktop).toBe(1024);
    });
  });

  describe('mobileGrid', () => {
    it('should have correct grid configuration', () => {
      expect(mobileGrid.columns).toBe(4);
      expect(mobileGrid.gutterWidth).toBe(16);
      expect(mobileGrid.marginWidth).toBe(20);
      expect(mobileGrid.screenWidth).toBe(440);
      expect(mobileGrid.screenHeight).toBe(956);
    });
  });

  describe('getColumnWidth', () => {
    it('should calculate column width correctly for mobile', () => {
      const columnWidth = getColumnWidth(4, 16, 20, 440);
      // (440 - 40 - 48) / 4 = 352 / 4 = 88
      expect(columnWidth).toBe(88);
    });

    it('should calculate column width for different screen sizes', () => {
      const columnWidth = getColumnWidth(4, 16, 20, 768);
      // (768 - 40 - 48) / 4 = 680 / 4 = 170
      expect(columnWidth).toBe(170);
    });

    it('should use default values when not provided', () => {
      jest
        .spyOn(Dimensions, 'get')
        .mockReturnValue({ width: 440, height: 956, scale: 1, fontScale: 1 });
      const columnWidth = getColumnWidth();
      expect(columnWidth).toBe(88);
    });
  });

  describe('getSpanWidth', () => {
    it('should calculate span width for 1 column', () => {
      const spanWidth = getSpanWidth(1, 4, 16, 20, 440);
      // 88 * 1 + 16 * 0 = 88
      expect(spanWidth).toBe(88);
    });

    it('should calculate span width for 2 columns', () => {
      const spanWidth = getSpanWidth(2, 4, 16, 20, 440);
      // 88 * 2 + 16 * 1 = 176 + 16 = 192
      expect(spanWidth).toBe(192);
    });

    it('should calculate span width for 3 columns', () => {
      const spanWidth = getSpanWidth(3, 4, 16, 20, 440);
      // 88 * 3 + 16 * 2 = 264 + 32 = 296
      expect(spanWidth).toBe(296);
    });

    it('should calculate span width for 4 columns (full width)', () => {
      const spanWidth = getSpanWidth(4, 4, 16, 20, 440);
      // 88 * 4 + 16 * 3 = 352 + 48 = 400
      expect(spanWidth).toBe(400);
    });
  });

  describe('gridSpacing', () => {
    it('should have correct spacing values', () => {
      expect(gridSpacing.xxs).toBe(4);
      expect(gridSpacing.xs).toBe(8);
      expect(gridSpacing.sm).toBe(12);
      expect(gridSpacing.md).toBe(16);
      expect(gridSpacing.lg).toBe(24);
      expect(gridSpacing.xl).toBe(32);
      expect(gridSpacing.xxl).toBe(48);
      expect(gridSpacing.xxxl).toBe(64);
    });

    it('should follow gutter-based progression', () => {
      expect(gridSpacing.md).toBe(mobileGrid.gutterWidth);
      expect(gridSpacing.xl).toBe(mobileGrid.gutterWidth * 2);
      expect(gridSpacing.xxl).toBe(mobileGrid.gutterWidth * 3);
      expect(gridSpacing.xxxl).toBe(mobileGrid.gutterWidth * 4);
    });
  });

  describe('container', () => {
    it('should have correct padding', () => {
      expect(container.paddingHorizontal).toBe(20);
      expect(container.width).toBe('100%');
    });
  });

  describe('row', () => {
    it('should have correct flex direction', () => {
      expect(row.flexDirection).toBe('row');
    });

    it('should have negative margin to compensate gutter', () => {
      expect(row.marginHorizontal).toBe(-8);
    });
  });

  describe('columnBase', () => {
    it('should have correct padding', () => {
      expect(columnBase.paddingHorizontal).toBe(8);
    });
  });

  describe('columns', () => {
    it('should have col1 with correct width', () => {
      expect(columns.col1.paddingHorizontal).toBe(8);
      expect(columns.col1.width).toBe(88);
    });

    it('should have col2 with correct width', () => {
      expect(columns.col2.paddingHorizontal).toBe(8);
      expect(columns.col2.width).toBe(192);
    });

    it('should have col3 with correct width', () => {
      expect(columns.col3.paddingHorizontal).toBe(8);
      expect(columns.col3.width).toBe(296);
    });

    it('should have col4 with correct width', () => {
      expect(columns.col4.paddingHorizontal).toBe(8);
      expect(columns.col4.width).toBe(400);
    });

    it('should verify total width equals screen width minus margins', () => {
      // col4 + 2*marginWidth = screenWidth
      expect(columns.col4.width + 2 * mobileGrid.marginWidth).toBe(440);
    });
  });

  describe('generateColumnStyles', () => {
    it('should generate columns for custom screen width', () => {
      const customColumns = generateColumnStyles(768);

      expect(customColumns.col1.width).toBe(170);
      expect(customColumns.col2.width).toBe(356);
      expect(customColumns.col3.width).toBe(542);
      expect(customColumns.col4.width).toBe(728);
    });

    it('should use current screen width when not provided', () => {
      jest
        .spyOn(Dimensions, 'get')
        .mockReturnValue({ width: 375, height: 667, scale: 1, fontScale: 1 });
      const generatedColumns = generateColumnStyles();

      const expectedColumnWidth = getColumnWidth(4, 16, 20, 375);
      expect(generatedColumns.col1.width).toBe(expectedColumnWidth);
    });
  });

  describe('layoutPresets', () => {
    it('should have fourColumns preset', () => {
      expect(layoutPresets.fourColumns).toHaveLength(4);
      expect(layoutPresets.fourColumns).toEqual([
        { span: 1 },
        { span: 1 },
        { span: 1 },
        { span: 1 },
      ]);
    });

    it('should have twoColumns preset', () => {
      expect(layoutPresets.twoColumns).toHaveLength(2);
      expect(layoutPresets.twoColumns).toEqual([{ span: 2 }, { span: 2 }]);
    });

    it('should have sidebarRight preset', () => {
      expect(layoutPresets.sidebarRight).toHaveLength(2);
      expect(layoutPresets.sidebarRight).toEqual([{ span: 3 }, { span: 1 }]);
    });

    it('should have sidebarLeft preset', () => {
      expect(layoutPresets.sidebarLeft).toHaveLength(2);
      expect(layoutPresets.sidebarLeft).toEqual([{ span: 1 }, { span: 3 }]);
    });

    it('should have fullWidth preset', () => {
      expect(layoutPresets.fullWidth).toHaveLength(1);
      expect(layoutPresets.fullWidth).toEqual([{ span: 4 }]);
    });

    it('should verify all presets sum to 4 columns', () => {
      const sumSpans = (preset: readonly { span: number }[]) =>
        preset.reduce((sum, col) => sum + col.span, 0);

      expect(sumSpans(layoutPresets.fourColumns)).toBe(4);
      expect(sumSpans(layoutPresets.twoColumns)).toBe(4);
      expect(sumSpans(layoutPresets.sidebarRight)).toBe(4);
      expect(sumSpans(layoutPresets.sidebarLeft)).toBe(4);
      expect(sumSpans(layoutPresets.fullWidth)).toBe(4);
    });
  });

  describe('Grid Math Validation', () => {
    it('should maintain consistent spacing across all columns', () => {
      // Verificar que a soma das colunas + gutters = largura disponível
      const totalColumns = columns.col4.width;
      const expectedWidth = 440 - 2 * mobileGrid.marginWidth;
      expect(totalColumns).toBe(expectedWidth);
    });

    it('should verify gutter spacing is consistent', () => {
      // col2 = 2 * col1 + 1 gutter
      const expected = 2 * columns.col1.width + mobileGrid.gutterWidth;
      expect(columns.col2.width).toBe(expected);
    });

    it('should verify margins are symmetric', () => {
      expect(container.paddingHorizontal).toBe(mobileGrid.marginWidth);
      expect(row.marginHorizontal).toBe(-mobileGrid.gutterWidth / 2);
      expect(columnBase.paddingHorizontal).toBe(mobileGrid.gutterWidth / 2);
    });
  });
});
