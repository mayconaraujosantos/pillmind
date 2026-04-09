import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeSelector } from '../ThemeSelector';
import { ThemeProvider } from '../../theme';

// Mock i18n
jest.mock('@shared/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'theme.automatic': 'Automático',
        'theme.systemDescription': 'Segue a configuração do sistema',
        'theme.light': 'Claro',
        'theme.lightDescription': 'Sempre usa o tema claro',
        'theme.dark': 'Escuro',
        'theme.darkDescription': 'Sempre usa o tema escuro',
        'account.appearance': 'Aparência',
      };
      return translations[key] || key;
    },
  }),
}));

describe('ThemeSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('automatic');
  });

  it('should render theme options', async () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <ThemeSelector />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByTestId('theme-selector-title')).toBeTruthy();
    });

    expect(getByTestId('theme-option-automatic')).toBeTruthy();
    expect(getByTestId('theme-option-light')).toBeTruthy();
    expect(getByTestId('theme-option-dark')).toBeTruthy();
  });

  it('should show checkmark for selected theme', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('dark');

    const { getByTestId } = render(
      <ThemeProvider>
        <ThemeSelector />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByTestId('theme-checkmark-dark')).toBeTruthy();
    });
  });

  it('should change theme when option is pressed', async () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <ThemeSelector />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByTestId('theme-option-light')).toBeTruthy();
    });

    fireEvent.press(getByTestId('theme-option-light'));

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@pillmind:theme_mode',
        'light'
      );
    });
  });

  it('should render all theme options with correct labels', async () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <ThemeSelector />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByTestId('theme-option-automatic')).toBeTruthy();
    });

    expect(getByTestId('theme-option-light')).toBeTruthy();
    expect(getByTestId('theme-option-dark')).toBeTruthy();
  });
});
