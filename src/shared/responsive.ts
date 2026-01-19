/**
 * Sistema Responsivo PillMind
 * Sistema completo de responsividade para adaptação automática em todos os dispositivos iOS e Android
 */

// Hooks
export { useResponsive, useBreakpointValue } from './hooks/useResponsive';

// Theme extensions
export { useResponsiveTypography } from './theme/typography';
export { useResponsiveSpacing } from './theme/spacing';

// Components
export { ResponsiveContainer } from './components/ResponsiveContainer';
export { ResponsiveText } from './components/ResponsiveText';

// Types
export type { ResponsiveValues, BreakpointConfig } from './hooks/useResponsive';
export type { ResponsiveContainerProps } from './components/ResponsiveContainer';
export type { ResponsiveTextProps } from './components/ResponsiveText';
