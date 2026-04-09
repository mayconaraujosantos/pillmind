import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import type { Theme } from '@shared/theme/types';
import { Platform, StyleSheet, type ViewStyle } from 'react-native';

const BORDER_LIGHT = 'rgba(0,0,0,0.14)';
const BORDER_DARK = 'rgba(255,255,255,0.14)';

export type AppHeaderChromeParams = {
  theme: Theme;
  isDark: boolean;
  /** Fundo da zona scroll/conteúdo por baixo do header (contrasta com a barra). */
  contentBackgroundColor: string;
};

/**
 * Cromado de topo alinhado a apps de referência (iOS / Material):
 * — barra com fundo sólido distinto do canvas do ecrã;
 * — separador inferior visível + leve elevação no Android;
 * — título centrado (raízes de tab); stacks empurrados mantêm o back nativo.
 */
export function getAppHeaderChrome(
  params: AppHeaderChromeParams
): NativeStackNavigationOptions {
  const { theme, isDark, contentBackgroundColor } = params;

  const headerBackground = isDark ? theme.colors.surface : '#FFFFFF';

  const headerBarStyle: ViewStyle = {
    backgroundColor: headerBackground,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: isDark ? BORDER_DARK : BORDER_LIGHT,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0.4 : 0.14,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      default: {},
    }),
  };

  return {
    headerStyle: headerBarStyle as NativeStackNavigationOptions['headerStyle'],
    headerTintColor: theme.colors.primary,
    headerTitleStyle: {
      color: theme.colors.text,
      fontWeight: '600',
      fontSize: 17,
    },
    headerTitleAlign: 'center',
    headerShadowVisible: false,
    statusBarStyle: isDark ? 'light' : 'dark',
    statusBarBackgroundColor: headerBackground,
    contentStyle: { backgroundColor: contentBackgroundColor },
  };
}

/** Canvas por defeito por baixo do header nas tabs principais (modo claro: cinza suave). */
export function getTabMainCanvasBackground(
  theme: Theme,
  isDark: boolean
): string {
  return isDark ? theme.colors.background : theme.colors.surface;
}
