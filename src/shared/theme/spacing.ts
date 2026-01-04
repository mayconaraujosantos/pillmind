/**
 * Spacing System - PillMind Style Guide
 *
 * Sistema de espaçamento consistente baseado em múltiplos de 8px.
 * Valores: 4, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96
 */

/**
 * Spacing Values
 * Base de 8px com meio valor (4px) para ajustes finos
 */
export const spacing = {
  /** 0px - Sem espaçamento */
  none: 0,

  /** 4px - Espaçamento mínimo (meio) */
  xxs: 4,

  /** 8px - Espaçamento extra pequeno (1x base) */
  xs: 8,

  /** 16px - Espaçamento pequeno (2x base) */
  sm: 16,

  /** 24px - Espaçamento médio (3x base) */
  md: 24,

  /** 32px - Espaçamento grande (4x base) */
  lg: 32,

  /** 40px - Espaçamento extra grande (5x base) */
  xl: 40,

  /** 48px - Espaçamento 2xl (6x base) */
  xxl: 48,

  /** 56px - Espaçamento 3xl (7x base) */
  xxxl: 56,

  /** 64px - Espaçamento 4xl (8x base) */
  xxxxl: 64,

  /** 72px - Espaçamento 5xl (9x base) */
  xxxxxl: 72,

  /** 80px - Espaçamento 6xl (10x base) */
  xxxxxxl: 80,

  /** 88px - Espaçamento 7xl (11x base) */
  xxxxxxxl: 88,

  /** 96px - Espaçamento 8xl (12x base) */
  xxxxxxxxl: 96,
} as const;

/**
 * Spacing Scale (alternativo - nomenclatura numérica)
 */
export const spacingScale = {
  0: spacing.none, // 0px
  1: spacing.xxs, // 4px
  2: spacing.xs, // 8px
  4: spacing.sm, // 16px
  6: spacing.md, // 24px
  8: spacing.lg, // 32px
  10: spacing.xl, // 40px
  12: spacing.xxl, // 48px
  14: spacing.xxxl, // 56px
  16: spacing.xxxxl, // 64px
  18: spacing.xxxxxl, // 72px
  20: spacing.xxxxxxl, // 80px
  22: spacing.xxxxxxxl, // 88px
  24: spacing.xxxxxxxxl, // 96px
} as const;

/**
 * Insets - Padding para containers
 */
export const insets = {
  /** Sem padding */
  none: {
    padding: spacing.none,
  },

  /** Padding mínimo (4px) */
  xxs: {
    padding: spacing.xxs,
  },

  /** Padding extra pequeno (8px) */
  xs: {
    padding: spacing.xs,
  },

  /** Padding pequeno (16px) */
  sm: {
    padding: spacing.sm,
  },

  /** Padding médio (24px) - padrão para cards */
  md: {
    padding: spacing.md,
  },

  /** Padding grande (32px) */
  lg: {
    padding: spacing.lg,
  },

  /** Padding extra grande (40px) */
  xl: {
    padding: spacing.xl,
  },
} as const;

/**
 * Stack - Espaçamento vertical entre elementos
 */
export const stack = {
  /** Sem espaçamento */
  none: {
    marginBottom: spacing.none,
  },

  /** Espaçamento mínimo (4px) */
  xxs: {
    marginBottom: spacing.xxs,
  },

  /** Espaçamento extra pequeno (8px) */
  xs: {
    marginBottom: spacing.xs,
  },

  /** Espaçamento pequeno (16px) */
  sm: {
    marginBottom: spacing.sm,
  },

  /** Espaçamento médio (24px) */
  md: {
    marginBottom: spacing.md,
  },

  /** Espaçamento grande (32px) */
  lg: {
    marginBottom: spacing.lg,
  },

  /** Espaçamento extra grande (40px) */
  xl: {
    marginBottom: spacing.xl,
  },
} as const;

/**
 * Inline - Espaçamento horizontal entre elementos
 */
export const inline = {
  /** Sem espaçamento */
  none: {
    marginRight: spacing.none,
  },

  /** Espaçamento mínimo (4px) */
  xxs: {
    marginRight: spacing.xxs,
  },

  /** Espaçamento extra pequeno (8px) */
  xs: {
    marginRight: spacing.xs,
  },

  /** Espaçamento pequeno (16px) */
  sm: {
    marginRight: spacing.sm,
  },

  /** Espaçamento médio (24px) */
  md: {
    marginRight: spacing.md,
  },

  /** Espaçamento grande (32px) */
  lg: {
    marginRight: spacing.lg,
  },

  /** Espaçamento extra grande (40px) */
  xl: {
    marginRight: spacing.xl,
  },
} as const;

/**
 * Gap - Para uso com flexbox gap
 */
export const gap = {
  none: spacing.none,
  xxs: spacing.xxs,
  xs: spacing.xs,
  sm: spacing.sm,
  md: spacing.md,
  lg: spacing.lg,
  xl: spacing.xl,
  xxl: spacing.xxl,
} as const;

/**
 * Component Spacing Presets
 * Espaçamentos recomendados para componentes específicos
 */
export const componentSpacing = {
  /** Espaçamento interno de botões */
  button: {
    paddingVertical: spacing.xs, // 8px
    paddingHorizontal: spacing.sm, // 16px
  },

  /** Espaçamento interno de botões grandes */
  buttonLarge: {
    paddingVertical: spacing.sm, // 16px
    paddingHorizontal: spacing.md, // 24px
  },

  /** Espaçamento interno de botões pequenos */
  buttonSmall: {
    paddingVertical: spacing.xxs, // 4px
    paddingHorizontal: spacing.xs, // 8px
  },

  /** Espaçamento interno de cards */
  card: {
    padding: spacing.sm, // 16px
  },

  /** Espaçamento interno de cards grandes */
  cardLarge: {
    padding: spacing.md, // 24px
  },

  /** Espaçamento interno de inputs */
  input: {
    paddingVertical: spacing.xs, // 8px
    paddingHorizontal: spacing.sm, // 16px
  },

  /** Espaçamento interno de modais */
  modal: {
    padding: spacing.md, // 24px
  },

  /** Espaçamento entre seções */
  section: {
    marginBottom: spacing.lg, // 32px
  },

  /** Espaçamento entre itens de lista */
  listItem: {
    marginBottom: spacing.xs, // 8px
  },

  /** Espaçamento de containers de página */
  page: {
    paddingHorizontal: spacing.sm, // 16px
    paddingVertical: spacing.md, // 24px
  },
} as const;

/**
 * Helper Functions
 */

/**
 * Cria padding uniforme
 */
export const createPadding = (size: keyof typeof spacing) => ({
  padding: spacing[size],
});

/**
 * Cria padding horizontal
 */
export const createPaddingHorizontal = (size: keyof typeof spacing) => ({
  paddingHorizontal: spacing[size],
});

/**
 * Cria padding vertical
 */
export const createPaddingVertical = (size: keyof typeof spacing) => ({
  paddingVertical: spacing[size],
});

/**
 * Cria margin uniforme
 */
export const createMargin = (size: keyof typeof spacing) => ({
  margin: spacing[size],
});

/**
 * Cria margin horizontal
 */
export const createMarginHorizontal = (size: keyof typeof spacing) => ({
  marginHorizontal: spacing[size],
});

/**
 * Cria margin vertical
 */
export const createMarginVertical = (size: keyof typeof spacing) => ({
  marginVertical: spacing[size],
});

/**
 * Cria gap (flexbox)
 */
export const createGap = (size: keyof typeof spacing) => ({
  gap: spacing[size],
});

/**
 * Cria espaçamento customizado
 */
export const createCustomSpacing = (options: {
  top?: keyof typeof spacing;
  right?: keyof typeof spacing;
  bottom?: keyof typeof spacing;
  left?: keyof typeof spacing;
}) => ({
  paddingTop: options.top ? spacing[options.top] : 0,
  paddingRight: options.right ? spacing[options.right] : 0,
  paddingBottom: options.bottom ? spacing[options.bottom] : 0,
  paddingLeft: options.left ? spacing[options.left] : 0,
});

/**
 * Tipos para TypeScript
 */
export type SpacingSize = keyof typeof spacing;
export type SpacingScaleSize = keyof typeof spacingScale;
export type InsetSize = keyof typeof insets;
export type StackSize = keyof typeof stack;
export type InlineSize = keyof typeof inline;
export type GapSize = keyof typeof gap;
