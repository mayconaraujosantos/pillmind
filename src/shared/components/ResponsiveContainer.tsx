/**
 * Container responsivo que se adapta automaticamente a todos os tamanhos de tela
 */
import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useResponsive } from '../hooks/useResponsive';
import { useResponsiveSpacing } from '../theme/spacing';

export interface ResponsiveContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  
  // Variantes de container
  variant?: 'full' | 'padded' | 'centered' | 'card' | 'section';
  
  // Controles de padding responsivo
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  paddingHorizontal?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  paddingVertical?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  // Controles de margin responsivo
  margin?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  marginHorizontal?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  marginVertical?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  // Controles de alinhamento responsivo
  align?: 'left' | 'center' | 'right';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  
  // Controles de largura máxima responsiva
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  
  // Se deve aplicar safe area
  safeArea?: boolean;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  style,
  variant = 'full',
  padding,
  paddingHorizontal,
  paddingVertical,
  margin,
  marginHorizontal,
  marginVertical,
  align = 'left',
  justify = 'start',
  maxWidth = 'full',
  safeArea = false,
}) => {
  const { wp, isSmallDevice, isMediumDevice, isLargeDevice, isTablet } = useResponsive();
  const spacing = useResponsiveSpacing();
  const insets = useSafeAreaInsets();
  
  // Mapping de alinhamentos
  const alignItems: ViewStyle['alignItems'] = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
  }[align];
  
  const justifyContent: ViewStyle['justifyContent'] = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
    around: 'space-around',
    evenly: 'space-evenly',
  }[justify];
  
  // Mapping de larguras máximas responsivas
  const maxWidthValues = {
    xs: wp(90),
    sm: wp(85),
    md: wp(80),
    lg: wp(75),
    xl: wp(70),
    full: '100%',
  } as const;
  
  // Função para obter valor de espaçamento
  const getSpacingValue = (size?: string) => {
    if (!size || size === 'none') return 0;
    return spacing.pad(size as any);
  };
  
  // Estilos base das variantes
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'full':
        return { flex: 1 };
      
      case 'padded':
        return {
          ...spacing.containerPadding,
        };
      
      case 'centered':
        return {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          ...spacing.containerPadding,
        };
      
      case 'card':
        return {
          backgroundColor: '#FFFFFF',
          borderRadius: isTablet ? 12 : 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
          ...spacing.cardPadding,
        };
      
      case 'section':
        return {
          ...spacing.sectionSpacing,
          ...spacing.containerPadding,
        };
      
      default:
        return {};
    }
  };
  
  // Construir estilo final
  const containerStyle: ViewStyle = {
    ...getVariantStyle(),
    alignItems,
    justifyContent,
    maxWidth: maxWidthValues[maxWidth],
    alignSelf: maxWidth !== 'full' ? 'center' : undefined,
    
    // Aplicar padding customizado
    ...(padding && { padding: getSpacingValue(padding) }),
    ...(paddingHorizontal && { paddingHorizontal: getSpacingValue(paddingHorizontal) }),
    ...(paddingVertical && { paddingVertical: getSpacingValue(paddingVertical) }),
    
    // Aplicar margin customizado
    ...(margin && { margin: getSpacingValue(margin) }),
    ...(marginHorizontal && { marginHorizontal: getSpacingValue(marginHorizontal) }),
    ...(marginVertical && { marginVertical: getSpacingValue(marginVertical) }),
    
    // Safe area
    ...(safeArea && {
      paddingTop: (containerStyle.paddingTop || 0) + insets.top,
      paddingBottom: (containerStyle.paddingBottom || 0) + insets.bottom,
      paddingLeft: (containerStyle.paddingLeft || 0) + insets.left,
      paddingRight: (containerStyle.paddingRight || 0) + insets.right,
    }),
  };
  
  return (
    <View style={[containerStyle, style]}>
      {children}
    </View>
  );
};