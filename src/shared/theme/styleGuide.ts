/**
 * Style Guide - Color Palette
 *
 * Este arquivo contém todas as cores utilizadas no aplicativo PillMind.
 * As cores estão organizadas em escalas de tonalidade (50-900) para facilitar
 * a criação de variações e estados (hover, pressed, disabled, etc).
 */

/**
 * Primary Blue - Cor principal do aplicativo
 * Base: 500 (#1256DB)
 *
 * Uso recomendado:
 * - 50-200: Backgrounds claros, estados hover
 * - 300-400: Bordas, ícones secundários
 * - 500: Cor principal (botões, links, destaques)
 * - 600-700: Estados pressed/active
 * - 800-900: Textos em fundos claros, sombras
 */
export const primaryBlue = {
  50: '#EAEFFB',
  100: '#D3DFF6',
  200: '#A4BDEE',
  300: '#6897F3',
  400: '#3674EE',
  500: '#1256DB', // Base color
  600: '#0E45B0',
  700: '#0B3484',
  800: '#0B2455',
  900: '#06122B',
} as const;

/**
 * Neutral - Escala de cinzas
 * Base: 500 (#868686)
 *
 * Uso recomendado:
 * - 50-200: Backgrounds, surfaces
 * - 300-400: Bordas, divisores
 * - 500: Texto secundário, ícones
 * - 600-700: Texto regular
 * - 800-900: Texto primário, headings
 */
export const neutral = {
  50: '#F2F2F2',
  100: '#E6E6E6',
  200: '#CECECE',
  300: '#B6B6B6',
  400: '#9E9E9E',
  500: '#868686', // Base color
  600: '#6B6B6B',
  700: '#505050',
  800: '#353535',
  900: '#151515',
} as const;

/**
 * Success - Cores de sucesso
 * Base: 500 (#009E00)
 *
 * Uso recomendado:
 * - 50: Backgrounds de alertas/notificações de sucesso
 * - 200: Bordas, ícones em estado hover
 * - 500: Cor principal de sucesso
 * - 800: Textos, estados pressed
 */
export const success = {
  50: '#E6F5E6',
  200: '#B0E1B0',
  500: '#009E00', // Base color
  800: '#0D3616',
} as const;

/**
 * Error - Cores de erro
 * Base: 500 (#DC0000)
 *
 * Uso recomendado:
 * - 50: Backgrounds de alertas/notificações de erro
 * - 200: Bordas, ícones em estado hover
 * - 500: Cor principal de erro
 * - 800: Textos, estados pressed
 */
export const error = {
  50: '#FCE6E6',
  200: '#F4B0B0',
  500: '#DC0000', // Base color
  800: '#4D0000',
} as const;

/**
 * Warning - Cores de aviso
 * Base: 500 (#F6B500)
 *
 * Uso recomendado:
 * - 200: Backgrounds de alertas/notificações de aviso
 * - 500: Cor principal de aviso
 * - 800: Textos, estados pressed
 */
export const warning = {
  200: '#FFEBB2',
  500: '#F6B500', // Base color
  800: '#805E00',
} as const;

/**
 * Info - Cores informativas
 * Base: 500 (#007BAF)
 *
 * Uso recomendado:
 * - 200: Backgrounds de alertas/notificações informativas
 * - 500: Cor principal de informação
 * - 800: Textos, estados pressed
 */
export const info = {
  200: '#82C3DF',
  500: '#007BAF', // Base color
  800: '#003146',
} as const;

/**
 * Paleta completa de cores
 */
export const styleGuide = {
  primaryBlue,
  neutral,
  success,
  error,
  warning,
  info,
} as const;

/**
 * Tipos para autocomplete e type safety
 */
export type PrimaryBlueShade = keyof typeof primaryBlue;
export type NeutralShade = keyof typeof neutral;
export type SuccessShade = keyof typeof success;
export type ErrorShade = keyof typeof error;
export type WarningShade = keyof typeof warning;
export type InfoShade = keyof typeof info;
