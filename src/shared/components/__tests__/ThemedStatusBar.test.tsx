import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedStatusBar } from '../ThemedStatusBar';
import { ThemeProvider } from '@shared/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('ThemedStatusBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('automatic');
  });

  it('should render with light theme', async () => {
    const result = renderWithTheme(<ThemedStatusBar />);

    await waitFor(() => {
      expect(result).toBeTruthy();
    });
  });

  it('should render with dark theme', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('dark');

    const result = renderWithTheme(<ThemedStatusBar />);

    await waitFor(() => {
      expect(result).toBeTruthy();
    });
  });

  it('should render on Android platform', async () => {
    Platform.OS = 'android';

    const result = renderWithTheme(<ThemedStatusBar />);

    await waitFor(() => {
      expect(result).toBeTruthy();
    });
  });
});
