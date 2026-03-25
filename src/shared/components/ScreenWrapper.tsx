import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@shared/theme';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  /**
   * Alinha o fundo ao canvas por baixo do header nativo das tabs (surface claro / background escuro).
   */
  tabContentCanvas?: boolean;
  /**
   * Fundo suave (lavanda/cinza frio) só no modo claro — estilo apps de bem-estar de referência.
   */
  homeSoftTint?: boolean;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  style,
  tabContentCanvas = false,
  homeSoftTint = false,
}) => {
  const { theme, isDark } = useTheme();

  const HOME_TINT_LIGHT = '#F0F2FA';

  let bg = theme.colors.background;
  if (homeSoftTint && !isDark) {
    bg = HOME_TINT_LIGHT;
  } else if (tabContentCanvas) {
    bg = theme.colors.surface;
  }

  return (
    <View style={[styles.container, { backgroundColor: bg }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
