import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeSelector } from '../ThemeSelector';
import { ThemeProvider } from '../../theme';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  default: jest.fn(() => 'light'),
}));

jest.mock('react-native/Libraries/Utilities/Appearance', () => ({
  getColorScheme: jest.fn(() => 'light'),
  addChangeListener: jest.fn(() => ({ remove: jest.fn() })),
}));

describe('ThemeSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('automatic');
  });

  it('should render theme options', async () => {
    const { getByText } = render(
      <ThemeProvider>
        <ThemeSelector />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByText('Aparência')).toBeTruthy();
    });

    expect(getByText('Automático')).toBeTruthy();
    expect(getByText('Claro')).toBeTruthy();
    expect(getByText('Escuro')).toBeTruthy();
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
    const { getByText } = render(
      <ThemeProvider>
        <ThemeSelector />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByText('Automático')).toBeTruthy();
    });

    expect(getByText('Segue a configuração do sistema')).toBeTruthy();
    expect(getByText('Sempre usa o tema claro')).toBeTruthy();
    expect(getByText('Sempre usa o tema escuro')).toBeTruthy();
  });
});
