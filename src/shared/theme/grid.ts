/**
 * Grid System - PillMind Style Guide
 *
 * Sistema de grid responsivo baseado em 4 colunas para iPhone.
 * Specs: 440x956px, 4 columns, 16px gutter, 20px margin
 */

import { Dimensions } from 'react-native';

/**
 * Breakpoints
 */
export const breakpoints = {
  mobile: 440, // iPhone base
  tablet: 768,
  desktop: 1024,
} as const;

/**
 * Grid Configuration para Mobile (iPhone)
 */
export const mobileGrid = {
  columns: 4,
  gutterWidth: 16, // Espaço entre colunas
  marginWidth: 20, // Margens laterais
  screenWidth: 440,
  screenHeight: 956,
} as const;

/**
 * Função para calcular a largura de uma coluna
 * Formula: (screenWidth - 2*margin - (columns-1)*gutter) / columns
 */
export const getColumnWidth = (
  columns: number = mobileGrid.columns,
  gutterWidth: number = mobileGrid.gutterWidth,
  marginWidth: number = mobileGrid.marginWidth,
  screenWidth?: number
): number => {
  const width = screenWidth || Dimensions.get('window').width;
  const availableWidth = width - 2 * marginWidth - (columns - 1) * gutterWidth;
  return availableWidth / columns;
};

/**
 * Função para calcular largura de um elemento que ocupa N colunas
 */
export const getSpanWidth = (
  span: number,
  columns: number = mobileGrid.columns,
  gutterWidth: number = mobileGrid.gutterWidth,
  marginWidth: number = mobileGrid.marginWidth,
  screenWidth?: number
): number => {
  const columnWidth = getColumnWidth(
    columns,
    gutterWidth,
    marginWidth,
    screenWidth
  );
  return columnWidth * span + gutterWidth * (span - 1);
};

/**
 * Grid Spacing
 * Baseado no gutter width (16px)
 */
export const gridSpacing = {
  xxs: 4, // 1/4 gutter
  xs: 8, // 1/2 gutter
  sm: 12, // 3/4 gutter
  md: 16, // 1 gutter (base)
  lg: 24, // 1.5 gutter
  xl: 32, // 2 gutter
  xxl: 48, // 3 gutter
  xxxl: 64, // 4 gutter
} as const;

/**
 * Container Styles
 * Margens laterais de 20px
 */
export const container = {
  paddingHorizontal: mobileGrid.marginWidth,
  width: '100%',
} as const;

/**
 * Row - Container para colunas
 */
export const row = {
  flexDirection: 'row' as const,
  marginHorizontal: -mobileGrid.gutterWidth / 2, // Compensar padding das colunas
} as const;

/**
 * Column - Base para todas as colunas
 */
export const columnBase = {
  paddingHorizontal: mobileGrid.gutterWidth / 2,
} as const;

/**
 * Grid Helper - Gera estilos para diferentes spans
 */
export const generateColumnStyles = (screenWidth?: number) => {
  const width = screenWidth || Dimensions.get('window').width;

  return {
    col1: {
      ...columnBase,
      width: getSpanWidth(
        1,
        mobileGrid.columns,
        mobileGrid.gutterWidth,
        mobileGrid.marginWidth,
        width
      ),
    },
    col2: {
      ...columnBase,
      width: getSpanWidth(
        2,
        mobileGrid.columns,
        mobileGrid.gutterWidth,
        mobileGrid.marginWidth,
        width
      ),
    },
    col3: {
      ...columnBase,
      width: getSpanWidth(
        3,
        mobileGrid.columns,
        mobileGrid.gutterWidth,
        mobileGrid.marginWidth,
        width
      ),
    },
    col4: {
      ...columnBase,
      width: getSpanWidth(
        4,
        mobileGrid.columns,
        mobileGrid.gutterWidth,
        mobileGrid.marginWidth,
        width
      ),
    },
  };
};

/**
 * Grid Columns - Estilos pré-calculados para 440px
 */
export const columns = generateColumnStyles(mobileGrid.screenWidth);

/**
 * Responsive Grid Hook
 * Use este hook para recalcular colunas quando a tela muda
 */
export const useResponsiveGrid = () => {
  const { width, height } = Dimensions.get('window');

  return {
    screenWidth: width,
    screenHeight: height,
    columns: generateColumnStyles(width),
    columnWidth: getColumnWidth(
      mobileGrid.columns,
      mobileGrid.gutterWidth,
      mobileGrid.marginWidth,
      width
    ),
    isMobile: width < breakpoints.tablet,
    isTablet: width >= breakpoints.tablet && width < breakpoints.desktop,
    isDesktop: width >= breakpoints.desktop,
  };
};

/**
 * Layout Presets
 * Layouts comuns pré-definidos
 */
export const layoutPresets = {
  // 4 colunas iguais (1+1+1+1)
  fourColumns: [{ span: 1 }, { span: 1 }, { span: 1 }, { span: 1 }],
  // 2 colunas iguais (2+2)
  twoColumns: [{ span: 2 }, { span: 2 }],
  // Sidebar + Content (1+3)
  sidebarRight: [{ span: 3 }, { span: 1 }],
  // Sidebar + Content (3+1)
  sidebarLeft: [{ span: 1 }, { span: 3 }],
  // Full width
  fullWidth: [{ span: 4 }],
} as const;

/**
 * Tipos para TypeScript
 */
export type GridSpan = 1 | 2 | 3 | 4;
export type SpacingSize = keyof typeof gridSpacing;
export type BreakpointName = keyof typeof breakpoints;
