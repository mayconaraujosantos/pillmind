import { Dimensions, Platform, PixelRatio } from 'react-native';

// Dimensões base de referência (iPhone 11 Pro)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

// Obter dimensões atuais da tela
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get('window');

// Calcular fator de escala
export const widthScale = SCREEN_WIDTH / BASE_WIDTH;
export const heightScale = SCREEN_HEIGHT / BASE_HEIGHT;

/**
 * Escala horizontal baseada na largura da tela
 */
export const wp = (size: number): number => {
  return SCREEN_WIDTH * (size / 100);
};

/**
 * Escala vertical baseada na altura da tela
 */
export const hp = (size: number): number => {
  return SCREEN_HEIGHT * (size / 100);
};

/**
 * Escala de fonte responsiva
 * Usa a escala de largura com limite máximo/mínimo
 */
export const fs = (size: number, factor: number = 0.5): number => {
  const newSize = size + (widthScale - 1) * size * factor;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/**
 * Escala responsiva para largura
 * Mantém proporção baseada na largura da tela
 */
export const scaleWidth = (size: number): number => {
  return Math.round(size * widthScale);
};

/**
 * Escala responsiva para altura
 * Mantém proporção baseada na altura da tela
 */
export const scaleHeight = (size: number): number => {
  return Math.round(size * heightScale);
};

/**
 * Escala moderada - usa média entre largura e altura
 * Melhor para elementos que precisam manter proporção
 */
export const scale = (size: number, factor: number = 0.5): number => {
  const averageScale = (widthScale + heightScale) / 2;
  return Math.round(size + (averageScale - 1) * size * factor);
};

/**
 * Verifica se é um dispositivo pequeno (< 5 polegadas)
 */
export const isSmallDevice = (): boolean => {
  return SCREEN_HEIGHT < 700;
};

/**
 * Verifica se é um dispositivo médio (5-6 polegadas)
 */
export const isMediumDevice = (): boolean => {
  return SCREEN_HEIGHT >= 700 && SCREEN_HEIGHT < 900;
};

/**
 * Verifica se é um dispositivo grande (> 6 polegadas)
 */
export const isLargeDevice = (): boolean => {
  return SCREEN_HEIGHT >= 900;
};

/**
 * Retorna valor baseado no tamanho do dispositivo
 */
export const deviceSize = <T>(
  small: T,
  medium: T,
  large: T,
  defaultValue?: T
): T => {
  if (isSmallDevice()) return small;
  if (isMediumDevice()) return medium;
  if (isLargeDevice()) return large;
  return defaultValue ?? medium;
};

/**
 * Espaçamento adaptativo baseado no tamanho da tela
 */
export const adaptiveSpacing = {
  xs: deviceSize(4, 6, 8),
  sm: deviceSize(8, 12, 16),
  md: deviceSize(12, 16, 20),
  lg: deviceSize(16, 20, 24),
  xl: deviceSize(20, 24, 32),
  xxl: deviceSize(24, 32, 40),
};

/**
 * Tamanhos de fonte adaptivos
 */
export const adaptiveFontSizes = {
  xs: deviceSize(10, 11, 12),
  sm: deviceSize(12, 13, 14),
  md: deviceSize(14, 15, 16),
  lg: deviceSize(16, 18, 20),
  xl: deviceSize(20, 22, 24),
  xxl: deviceSize(24, 28, 32),
  xxxl: deviceSize(28, 32, 36),
};

/**
 * Informações sobre o dispositivo
 */
export const deviceInfo = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmall: isSmallDevice(),
  isMedium: isMediumDevice(),
  isLarge: isLargeDevice(),
  platform: Platform.OS,
  pixelRatio: PixelRatio.get(),
  fontScale: PixelRatio.getFontScale(),
};

/**
 * Debug: Imprime informações do dispositivo
 */
export const logDeviceInfo = (): void => {
  let deviceSizeLabel = 'Large';
  if (isSmallDevice()) {
    deviceSizeLabel = 'Small';
  } else if (isMediumDevice()) {
    deviceSizeLabel = 'Medium';
  }

  console.log('📱 Device Info:', {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    widthScale: widthScale.toFixed(2),
    heightScale: heightScale.toFixed(2),
    size: deviceSizeLabel,
    platform: Platform.OS,
    pixelRatio: PixelRatio.get(),
  });
};
