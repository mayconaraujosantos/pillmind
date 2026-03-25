import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import type { Theme } from '@shared/theme/types';
import {
  getAppHeaderChrome,
  getTabMainCanvasBackground,
} from './appHeaderChrome';

/**
 * Header + canvas das tabs principais (contraste barra branca vs conteúdo em surface).
 */
export function getMainTabStackScreenOptions(
  theme: Theme,
  isDark: boolean
): NativeStackNavigationOptions {
  return getAppHeaderChrome({
    theme,
    isDark,
    contentBackgroundColor: getTabMainCanvasBackground(theme, isDark),
  });
}
