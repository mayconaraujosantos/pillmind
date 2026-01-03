import { styleGuide } from './styleGuide';

export const lightColors = {
  primary: styleGuide.primaryBlue[500],
  secondary: styleGuide.primaryBlue[400],
  background: '#FFFFFF',
  surface: styleGuide.neutral[50],
  text: styleGuide.neutral[900],
  textSecondary: styleGuide.neutral[600],
  border: styleGuide.neutral[200],
  error: styleGuide.error[500],
  success: styleGuide.success[500],
  warning: styleGuide.warning[500],
  info: styleGuide.info[500],
  disabled: styleGuide.neutral[300],
  placeholder: styleGuide.neutral[400],
};

export const darkColors = {
  primary: styleGuide.primaryBlue[400],
  secondary: styleGuide.primaryBlue[300],
  background: '#000000',
  surface: styleGuide.neutral[900],
  text: '#FFFFFF',
  textSecondary: styleGuide.neutral[400],
  border: styleGuide.neutral[700],
  error: styleGuide.error[500],
  success: styleGuide.success[500],
  warning: styleGuide.warning[500],
  info: styleGuide.info[500],
  disabled: styleGuide.neutral[600],
  placeholder: styleGuide.neutral[500],
};

export const commonTheme = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};
