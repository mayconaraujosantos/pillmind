/**
 * Hook responsivo inteligente para adaptação automática de telas
 * Suporta todos os dispositivos iOS e Android
 */
import { useMemo } from 'react';
import { Dimensions, PixelRatio } from 'react-native';

export interface ScreenDimensions {
  width: number;
  height: number;
  scale: number;
  fontScale: number;
}

export interface BreakpointConfig {
  xs: number;  // Extra small phones
  sm: number;  // Small phones
  md: number;  // Medium phones/small tablets
  lg: number;  // Large phones/tablets
  xl: number;  // Extra large tablets
}

export interface ResponsiveValues {
  // Breakpoints
  isXS: boolean;
  isSM: boolean;
  isMD: boolean;
  isLG: boolean;
  isXL: boolean;
  
  // Screen info
  screenWidth: number;
  screenHeight: number;
  isLandscape: boolean;
  isPortrait: boolean;
  
  // Scaling factors
  widthScale: number;
  heightScale: number;
  moderateScale: number;
  
  // Device type detection
  isSmallDevice: boolean;
  isMediumDevice: boolean;
  isLargeDevice: boolean;
  isTablet: boolean;
  
  // Responsive functions
  wp: (percentage: number) => number; // width percentage
  hp: (percentage: number) => number; // height percentage
  rf: (size: number, factor?: number) => number; // responsive font
  rs: (size: number, factor?: number) => number; // responsive size
}

// Breakpoints baseados em largura
const breakpoints: BreakpointConfig = {
  xs: 320,  // iPhone SE, old Android
  sm: 375,  // iPhone 6/7/8, most Android
  md: 414,  // iPhone 6+/7+/8+, large Android
  lg: 768,  // iPad mini, Android tablets
  xl: 1024, // iPad, large tablets
};

// Dimensões de referência (iPhone 11 como base)
const REFERENCE_WIDTH = 414;
const REFERENCE_HEIGHT = 896;

export const useResponsive = (): ResponsiveValues => {
  const screenData = Dimensions.get('window');
  
  return useMemo(() => {
    const { width, height } = screenData;
    const scale = PixelRatio.get();
    const fontScale = PixelRatio.getFontScale();
    
    // Determinar orientação
    const isLandscape = width > height;
    const isPortrait = !isLandscape;
    
    // Sempre usar a menor dimensão para classificação (device consistency)
    const deviceWidth = Math.min(width, height);
    
    // Breakpoint detection
    const isXS = deviceWidth <= breakpoints.xs;
    const isSM = deviceWidth > breakpoints.xs && deviceWidth <= breakpoints.sm;
    const isMD = deviceWidth > breakpoints.sm && deviceWidth <= breakpoints.md;
    const isLG = deviceWidth > breakpoints.md && deviceWidth <= breakpoints.lg;
    const isXL = deviceWidth > breakpoints.lg;
    
    // Device type classification
    const isSmallDevice = isXS || isSM;
    const isMediumDevice = isMD;
    const isLargeDevice = isLG || isXL;
    const isTablet = deviceWidth >= breakpoints.lg;
    
    // Scaling factors
    const widthScale = width / REFERENCE_WIDTH;
    const heightScale = height / REFERENCE_HEIGHT;
    const moderateScale = (widthScale + heightScale) / 2;
    
    // Responsive functions
    const wp = (percentage: number): number => {
      return (width * percentage) / 100;
    };
    
    const hp = (percentage: number): number => {
      return (height * percentage) / 100;
    };
    
    const rf = (size: number, factor: number = 0.5): number => {
      // Responsive font size
      const newSize = size + (moderateScale - 1) * size * factor;
      
      // Clamp values to reasonable bounds
      const minSize = size * 0.8;
      const maxSize = size * 1.3;
      
      return Math.max(minSize, Math.min(maxSize, newSize));
    };
    
    const rs = (size: number, factor: number = 0.5): number => {
      // Responsive size (for padding, margins, etc.)
      const newSize = size * (1 + (moderateScale - 1) * factor);
      
      // Ensure minimum usability
      return Math.max(size * 0.7, newSize);
    };
    
    return {
      // Breakpoints
      isXS,
      isSM,
      isMD,
      isLG,
      isXL,
      
      // Screen info
      screenWidth: width,
      screenHeight: height,
      isLandscape,
      isPortrait,
      
      // Scaling factors
      widthScale,
      heightScale,
      moderateScale,
      
      // Device type detection
      isSmallDevice,
      isMediumDevice,
      isLargeDevice,
      isTablet,
      
      // Responsive functions
      wp,
      hp,
      rf,
      rs,
    };
  }, [screenData]);
};

// Hook para valores condicionais baseados em breakpoint
export const useBreakpointValue = <T>(values: {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  default: T;
}): T => {
  const { isXS, isSM, isMD, isLG, isXL } = useResponsive();
  
  if (isXL && values.xl !== undefined) return values.xl;
  if (isLG && values.lg !== undefined) return values.lg;
  if (isMD && values.md !== undefined) return values.md;
  if (isSM && values.sm !== undefined) return values.sm;
  if (isXS && values.xs !== undefined) return values.xs;
  
  return values.default;
};