import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeSettingsScreen } from '../ThemeSettingsScreen';
import { ThemeProvider } from '@shared/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('ThemeSettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('automatic');
  });

  it('should render theme settings screen', async () => {
    const { getByTestId } = renderWithTheme(<ThemeSettingsScreen />);

    await waitFor(() => {
      expect(getByTestId('preview-title')).toBeTruthy();
    });
  });

  it('should render theme selector', async () => {
    const { getByText } = renderWithTheme(<ThemeSettingsScreen />);

    await waitFor(() => {
      expect(getByText('Pré-visualização')).toBeTruthy();
    });
  });

  it('should render preview card', async () => {
    const { getByText } = renderWithTheme(<ThemeSettingsScreen />);

    await waitFor(() => {
      expect(getByText('Título do Card')).toBeTruthy();
      expect(getByText('Descrição do card com texto secundário')).toBeTruthy();
    });
  });

  it('should render color preview', async () => {
    const { getByText } = renderWithTheme(<ThemeSettingsScreen />);

    await waitFor(() => {
      expect(getByText('Primary')).toBeTruthy();
      expect(getByText('Secondary')).toBeTruthy();
    });
  });

  it('should render with dark theme', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('dark');

    const { getByText } = renderWithTheme(<ThemeSettingsScreen />);

    await waitFor(() => {
      expect(getByText('Pré-visualização')).toBeTruthy();
    });
  });
});
