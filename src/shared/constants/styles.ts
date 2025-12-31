// Shared style constants to reduce duplication
export const COMMON_STYLES = {
  borderRadius: {
    small: 8,
    medium: 12,
  },
  padding: {
    horizontal: {
      small: 12,
      medium: 16,
      large: 24,
    },
    vertical: {
      small: 8,
      medium: 12,
      large: 16,
    },
  },
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    error: '#FF3B30',
    text: {
      primary: '#000',
      secondary: '#999',
      white: '#FFFFFF',
    },
    border: {
      default: '#DDD',
      light: '#E5E5E5',
    },
    background: {
      white: '#FFF',
      light: '#F0F0F0',
    },
  },
  fontSize: {
    small: 12,
    medium: 14,
    large: 16,
  },
  fontWeight: {
    normal: '400',
    semibold: '600',
    bold: '700',
  },
} as const;
