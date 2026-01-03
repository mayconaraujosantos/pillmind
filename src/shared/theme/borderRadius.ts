/**
 * Border Radius System - PillMind Style Guide
 *
 * Sistema de border radius consistente para componentes.
 * Valores: 4, 8, 16, 24, 32
 */

/**
 * Border Radius Values
 */
export const borderRadius = {
  /** 4px - Elementos pequenos (badges, chips) */
  xs: 4,

  /** 8px - Botões, inputs, cards pequenos */
  sm: 8,

  /** 16px - Cards, modais, containers (padrão) */
  md: 16,

  /** 24px - Cards grandes, sheets */
  lg: 24,

  /** 32px - Elementos destacados, hero sections */
  xl: 32,

  /** 9999px - Botões pill, avatares circulares */
  full: 9999,

  /** 0px - Sem arredondamento */
  none: 0,
} as const;

/**
 * Border Radius Presets
 * Combinações comuns de border radius para diferentes componentes
 */
export const borderRadiusPresets = {
  /** Botão padrão */
  button: {
    borderRadius: borderRadius.sm,
  },

  /** Botão pill (completamente arredondado) */
  buttonPill: {
    borderRadius: borderRadius.full,
  },

  /** Card padrão */
  card: {
    borderRadius: borderRadius.md,
  },

  /** Card grande */
  cardLarge: {
    borderRadius: borderRadius.lg,
  },

  /** Input de texto */
  input: {
    borderRadius: borderRadius.sm,
  },

  /** Badge pequeno */
  badge: {
    borderRadius: borderRadius.xs,
  },

  /** Badge pill */
  badgePill: {
    borderRadius: borderRadius.full,
  },

  /** Modal/Dialog */
  modal: {
    borderRadius: borderRadius.lg,
  },

  /** Bottom sheet */
  bottomSheet: {
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  /** Avatar circular */
  avatarCircular: {
    borderRadius: borderRadius.full,
  },

  /** Avatar arredondado */
  avatarRounded: {
    borderRadius: borderRadius.md,
  },

  /** Chip */
  chip: {
    borderRadius: borderRadius.full,
  },

  /** Alert/Toast */
  alert: {
    borderRadius: borderRadius.sm,
  },

  /** Image thumbnail */
  thumbnail: {
    borderRadius: borderRadius.xs,
  },

  /** Arredondamento apenas no topo */
  topOnly: {
    borderTopLeftRadius: borderRadius.md,
    borderTopRightRadius: borderRadius.md,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  /** Arredondamento apenas embaixo */
  bottomOnly: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: borderRadius.md,
    borderBottomRightRadius: borderRadius.md,
  },

  /** Arredondamento apenas à esquerda */
  leftOnly: {
    borderTopLeftRadius: borderRadius.md,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: borderRadius.md,
    borderBottomRightRadius: 0,
  },

  /** Arredondamento apenas à direita */
  rightOnly: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: borderRadius.md,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: borderRadius.md,
  },
} as const;

/**
 * Helper function para criar border radius customizado
 */
export const createBorderRadius = (
  size: keyof typeof borderRadius
): { borderRadius: number } => ({
  borderRadius: borderRadius[size],
});

/**
 * Helper function para border radius seletivo
 */
export const createSelectiveBorderRadius = (options: {
  topLeft?: keyof typeof borderRadius;
  topRight?: keyof typeof borderRadius;
  bottomLeft?: keyof typeof borderRadius;
  bottomRight?: keyof typeof borderRadius;
}) => ({
  borderTopLeftRadius: options.topLeft ? borderRadius[options.topLeft] : 0,
  borderTopRightRadius: options.topRight ? borderRadius[options.topRight] : 0,
  borderBottomLeftRadius: options.bottomLeft
    ? borderRadius[options.bottomLeft]
    : 0,
  borderBottomRightRadius: options.bottomRight
    ? borderRadius[options.bottomRight]
    : 0,
});

/**
 * Tipos para TypeScript
 */
export type BorderRadiusSize = keyof typeof borderRadius;
export type BorderRadiusPreset = keyof typeof borderRadiusPresets;
