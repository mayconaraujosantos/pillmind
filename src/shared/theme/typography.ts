import { TextStyle } from 'react-native';
import { useResponsive } from '../hooks/useResponsive';

/**
 * Typography System - PillMind Style Guide
 *
 * Sistema completo de tipografia usando Roboto como fonte padrão.
 * Todas as variantes seguem o formato: tamanho / line height / letter spacing
 * AGORA COM SUPORTE RESPONSIVO AUTOMÁTICO
 */

/**
 * Font Weights
 */
export const fontWeights = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
} as const;

/**
 * Font Family
 * Usando os nomes registrados no useFonts hook
 */
export const fontFamily = {
  regular: 'Roboto-Regular',
  medium: 'Roboto-Medium',
  semibold: 'Roboto-Bold', // Roboto não possui Semibold oficial, usando Bold
  bold: 'Roboto-Bold',
} as const;

/**
 * Display Styles
 * Usado para títulos grandes e de destaque
 */
export const display = {
  display1: {
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeights.semibold,
    fontSize: 46,
    lineHeight: 46 * 1.2, // 120%
    letterSpacing: 0,
  } as TextStyle,
  display2: {
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeights.semibold,
    fontSize: 42,
    lineHeight: 42 * 1.2, // 120%
    letterSpacing: 0,
  } as TextStyle,
  display3: {
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeights.semibold,
    fontSize: 36,
    lineHeight: 36 * 1.2, // 120%
    letterSpacing: 0,
  } as TextStyle,
} as const;

/**
 * Heading Styles
 * Usado para títulos de seções e hierarquia de conteúdo
 */
export const heading = {
  h1: {
    fontFamily: fontFamily.bold,
    fontWeight: fontWeights.bold,
    fontSize: 32,
    lineHeight: 32 * 1.2, // 120%
    letterSpacing: 0,
  } as TextStyle,
  h2: {
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeights.semibold,
    fontSize: 30,
    lineHeight: 30 * 1.2, // 120%
    letterSpacing: 0,
  } as TextStyle,
  h3: {
    fontFamily: fontFamily.regular,
    fontWeight: fontWeights.regular,
    fontSize: 24,
    lineHeight: 24 * 1.2, // 120%
    letterSpacing: 0,
  } as TextStyle,
  h4: {
    fontFamily: fontFamily.medium,
    fontWeight: fontWeights.medium,
    fontSize: 20,
    lineHeight: 20 * 1.2, // 120%
    letterSpacing: 0,
  } as TextStyle,
  h5: {
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeights.semibold,
    fontSize: 18,
    lineHeight: 18 * 1.2, // 120%
    letterSpacing: 0,
  } as TextStyle,
  h6: {
    fontFamily: fontFamily.medium,
    fontWeight: fontWeights.medium,
    fontSize: 18,
    lineHeight: 18 * 1.2, // 120%
    letterSpacing: 0,
  } as TextStyle,
  h7: {
    fontFamily: fontFamily.medium,
    fontWeight: fontWeights.medium,
    fontSize: 16,
    lineHeight: 16 * 1.2, // 120%
    letterSpacing: 0,
  } as TextStyle,
  h8: {
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeights.semibold,
    fontSize: 14,
    lineHeight: 14 * 1.2, // 120%
    letterSpacing: 0,
  } as TextStyle,
} as const;

/**
 * Body Styles
 * Usado para texto de corpo, parágrafos e conteúdo principal
 */
export const body = {
  xlRegular: {
    fontFamily: fontFamily.regular,
    fontWeight: fontWeights.regular,
    fontSize: 20,
    lineHeight: 20 * 1.2, // 120%
    letterSpacing: 0,
  } as TextStyle,
  xlMedium: {
    fontFamily: fontFamily.medium,
    fontWeight: fontWeights.medium,
    fontSize: 16,
    lineHeight: 16 * 1.5, // 150%
    letterSpacing: 0,
  } as TextStyle,
  xlRegular2: {
    fontFamily: fontFamily.regular,
    fontWeight: fontWeights.regular,
    fontSize: 16,
    lineHeight: 16 * 1.2, // 120%
    letterSpacing: 0,
  } as TextStyle,
  lBold: {
    fontFamily: fontFamily.bold,
    fontWeight: fontWeights.bold,
    fontSize: 14,
    lineHeight: 14 * 1.2, // 120%
    letterSpacing: 0,
  } as TextStyle,
  lMedium: {
    fontFamily: fontFamily.medium,
    fontWeight: fontWeights.medium,
    fontSize: 14,
    lineHeight: 14 * 1.2, // 120%
    letterSpacing: 0,
  } as TextStyle,
  mRegular: {
    fontFamily: fontFamily.regular,
    fontWeight: fontWeights.regular,
    fontSize: 14,
    lineHeight: 14 * 1.2, // 120%
    letterSpacing: 0,
  } as TextStyle,
  xmMedium: {
    fontFamily: fontFamily.medium,
    fontWeight: fontWeights.medium,
    fontSize: 12,
    lineHeight: 12 * 1.2, // 120%
    letterSpacing: 0,
  } as TextStyle,
  xmRegular: {
    fontFamily: fontFamily.regular,
    fontWeight: fontWeights.regular,
    fontSize: 12,
    lineHeight: 12 * 1.2, // 120%
    letterSpacing: 0,
  } as TextStyle,
} as const;

/**
 * Button Styles
 * Usado para texto em botões e elementos interativos
 */
export const button = {
  xlRegular: {
    fontFamily: fontFamily.regular,
    fontWeight: fontWeights.regular,
    fontSize: 24,
    lineHeight: 24 * 1.2, // 120%
    letterSpacing: 0,
  } as TextStyle,
  xlMedium: {
    fontFamily: fontFamily.medium,
    fontWeight: fontWeights.medium,
    fontSize: 20,
    lineHeight: 20 * 1.2, // 120%
    letterSpacing: 0,
  } as TextStyle,
  xlRegular2: {
    fontFamily: fontFamily.regular,
    fontWeight: fontWeights.regular,
    fontSize: 20,
    lineHeight: 20 * 1.2, // 120%
    letterSpacing: 0,
  } as TextStyle,
  lMedium: {
    fontFamily: fontFamily.medium,
    fontWeight: fontWeights.medium,
    fontSize: 18,
    lineHeight: 18 * 1.2, // 120%
    letterSpacing: 0,
  } as TextStyle,
  lRegular: {
    fontFamily: fontFamily.regular,
    fontWeight: fontWeights.regular,
    fontSize: 18,
    lineHeight: 18 * 1.2, // 120%
    letterSpacing: 0,
  } as TextStyle,
  mMedium: {
    fontFamily: fontFamily.medium,
    fontWeight: fontWeights.medium,
    fontSize: 16,
    lineHeight: 16 * 1.2, // 120%
    letterSpacing: 0,
  } as TextStyle,
  mRegular: {
    fontFamily: fontFamily.regular,
    fontWeight: fontWeights.regular,
    fontSize: 16,
    lineHeight: 16 * 1.2, // 120%
    letterSpacing: 0,
  } as TextStyle,
  sMedium: {
    fontFamily: fontFamily.medium,
    fontWeight: fontWeights.medium,
    fontSize: 14,
    lineHeight: 14 * 1.2, // 120%
    letterSpacing: 0,
  } as TextStyle,
  sRegular: {
    fontFamily: fontFamily.regular,
    fontWeight: fontWeights.regular,
    fontSize: 14,
    lineHeight: 14 * 1.2, // 120%
    letterSpacing: 0,
  } as TextStyle,
  xsMedium: {
    fontFamily: fontFamily.medium,
    fontWeight: fontWeights.medium,
    fontSize: 12,
    lineHeight: 12 * 1.2, // 120%
    letterSpacing: 0,
  } as TextStyle,
  xsRegular: {
    fontFamily: fontFamily.regular,
    fontWeight: fontWeights.regular,
    fontSize: 12,
    lineHeight: 12 * 1.2, // 120%
    letterSpacing: 0,
  } as TextStyle,
} as const;

/**
 * Caption Styles
 * Usado para textos pequenos, legendas e metadados
 */
export const caption = {
  lRegular: {
    fontFamily: fontFamily.regular,
    fontWeight: fontWeights.regular,
    fontSize: 12,
    lineHeight: 12 * 1.2, // 120%
    letterSpacing: 0,
  } as TextStyle,
  mRegular: {
    fontFamily: fontFamily.regular,
    fontWeight: fontWeights.regular,
    fontSize: 10,
    lineHeight: 10 * 1.2, // 120%
    letterSpacing: 0,
  } as TextStyle,
} as const;

/**
 * Typography completa agrupada
 */
export const typography = {
  display,
  heading,
  body,
  button,
  caption,
  fontWeights,
  fontFamily,
} as const;

/**
 * SISTEMA RESPONSIVO DE TIPOGRAFIA
 * Hook para aplicar tipografia que se adapta automaticamente ao tamanho da tela
 */
export interface ResponsiveTypographySystem {
  display: typeof display;
  heading: typeof heading;
  body: typeof body;
  button: typeof button;
  caption: typeof caption;
  responsive: {
    display: { [K in keyof typeof display]: TextStyle };
    heading: { [K in keyof typeof heading]: TextStyle };
    body: { [K in keyof typeof body]: TextStyle };
    button: { [K in keyof typeof button]: TextStyle };
    caption: { [K in keyof typeof caption]: TextStyle };
  };
}

export const useResponsiveTypography = (): ResponsiveTypographySystem => {
  const { rf, isSmallDevice, isMediumDevice, isLargeDevice } = useResponsive();
  
  // Fator de escala baseado no tamanho do dispositivo
  const getScaleFactor = () => {
    if (isSmallDevice) return 0.3; // Escala conservadora para telas pequenas
    if (isMediumDevice) return 0.5; // Escala padrão
    if (isLargeDevice) return 0.7; // Escala maior para tablets
    return 0.5;
  };
  
  const scaleFactor = getScaleFactor();
  
  // Função para aplicar responsividade a um estilo
  const makeResponsive = (style: TextStyle): TextStyle => ({
    ...style,
    fontSize: style.fontSize ? rf(style.fontSize, scaleFactor) : style.fontSize,
    lineHeight: style.lineHeight ? rf(style.lineHeight, scaleFactor) : style.lineHeight,
  });
  
  // Aplicar responsividade a todas as categorias
  const responsiveDisplay = Object.keys(display).reduce((acc, key) => {
    acc[key as keyof typeof display] = makeResponsive(display[key as keyof typeof display]);
    return acc;
  }, {} as { [K in keyof typeof display]: TextStyle });
  
  const responsiveHeading = Object.keys(heading).reduce((acc, key) => {
    acc[key as keyof typeof heading] = makeResponsive(heading[key as keyof typeof heading]);
    return acc;
  }, {} as { [K in keyof typeof heading]: TextStyle });
  
  const responsiveBody = Object.keys(body).reduce((acc, key) => {
    acc[key as keyof typeof body] = makeResponsive(body[key as keyof typeof body]);
    return acc;
  }, {} as { [K in keyof typeof body]: TextStyle });
  
  const responsiveButton = Object.keys(button).reduce((acc, key) => {
    acc[key as keyof typeof button] = makeResponsive(button[key as keyof typeof button]);
    return acc;
  }, {} as { [K in keyof typeof button]: TextStyle });
  
  const responsiveCaption = Object.keys(caption).reduce((acc, key) => {
    acc[key as keyof typeof caption] = makeResponsive(caption[key as keyof typeof caption]);
    return acc;
  }, {} as { [K in keyof typeof caption]: TextStyle });
  
  return {
    display,
    heading,
    body,
    button,
    caption,
    responsive: {
      display: responsiveDisplay,
      heading: responsiveHeading,
      body: responsiveBody,
      button: responsiveButton,
      caption: responsiveCaption,
    },
  };
};

/**
 * Tipos para autocomplete e type safety
 */
export type DisplayVariant = keyof typeof display;
export type HeadingVariant = keyof typeof heading;
export type BodyVariant = keyof typeof body;
export type ButtonVariant = keyof typeof button;
export type CaptionVariant = keyof typeof caption;
export type FontWeight = keyof typeof fontWeights;
export type FontFamily = keyof typeof fontFamily;
