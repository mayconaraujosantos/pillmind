import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { ThemeProvider } from '../ThemeContext';
import { useTheme } from '../useTheme';
import { Text } from 'react-native';

const TestComponent = () => {
  const { theme, themeMode, isDark } = useTheme();

  return (
    <>
      <Text testID="theme-mode">{themeMode}</Text>
      <Text testID="is-dark">{isDark ? 'dark' : 'light'}</Text>
      <Text testID="primary-color">{theme.colors.primary}</Text>
    </>
  );
};

describe('ThemeProvider', () => {
  let mockAppearanceListener:
    | ((preferences: { colorScheme: 'light' | 'dark' | null }) => void)
    | null = null;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAppearanceListener = null;

    // Mock do Appearance.getColorScheme
    (Appearance.getColorScheme as jest.Mock).mockReturnValue('light');

    // Mock do Appearance.addChangeListener
    (Appearance.addChangeListener as jest.Mock).mockImplementation(
      (listener) => {
        mockAppearanceListener = listener;
        return {
          remove: jest.fn(),
        };
      }
    );
  });

  afterEach(() => {
    mockAppearanceListener = null;
  });

  it('should render with automatic theme by default', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByTestId('theme-mode')).toBeTruthy();
    });

    expect(getByTestId('theme-mode').props.children).toBe('automatic');
  });

  it('should load saved theme from storage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('dark');

    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByTestId('theme-mode').props.children).toBe('dark');
    });
  });

  it('should use light colors for light theme', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('light');

    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByTestId('is-dark').props.children).toBe('light');
      expect(getByTestId('primary-color').props.children).toBe('#1256DB');
    });
  });

  it('should use dark colors for dark theme', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('dark');

    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByTestId('is-dark').props.children).toBe('dark');
      expect(getByTestId('primary-color').props.children).toBe('#3674EE');
    });
  });

  it('should throw error when useTheme is used outside ThemeProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme must be used within a ThemeProvider');

    consoleError.mockRestore();
  });

  describe('Automatic theme mode - System detection', () => {
    it('should detect light theme from system when no theme is saved (first launch)', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (Appearance.getColorScheme as jest.Mock).mockReturnValue('light');

      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(getByTestId('theme-mode')).toBeTruthy();
      });

      expect(getByTestId('theme-mode').props.children).toBe('automatic');
      expect(getByTestId('is-dark').props.children).toBe('light');
      expect(getByTestId('primary-color').props.children).toBe('#1256DB'); // light theme color
    });

    it('should detect dark theme from system when no theme is saved (first launch)', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (Appearance.getColorScheme as jest.Mock).mockReturnValue('dark');

      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(getByTestId('theme-mode')).toBeTruthy();
      });

      expect(getByTestId('theme-mode').props.children).toBe('automatic');
      expect(getByTestId('is-dark').props.children).toBe('dark');
      expect(getByTestId('primary-color').props.children).toBe('#3674EE'); // dark theme color
    });

    it('should follow system theme when mode is automatic', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('automatic');
      (Appearance.getColorScheme as jest.Mock).mockReturnValue('light');

      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(getByTestId('is-dark').props.children).toBe('light');
      });

      // Simula mudança do tema do sistema para dark
      act(() => {
        if (mockAppearanceListener) {
          mockAppearanceListener({ colorScheme: 'dark' });
        }
      });

      await waitFor(() => {
        expect(getByTestId('is-dark').props.children).toBe('dark');
      });
    });

    it('should NOT follow system theme when mode is set to light', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('light');
      (Appearance.getColorScheme as jest.Mock).mockReturnValue('light');

      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(getByTestId('is-dark').props.children).toBe('light');
      });

      // Simula mudança do tema do sistema para dark
      act(() => {
        if (mockAppearanceListener) {
          mockAppearanceListener({ colorScheme: 'dark' });
        }
      });

      // Deve continuar light porque o modo está fixo em light
      await waitFor(() => {
        expect(getByTestId('is-dark').props.children).toBe('light');
      });
    });

    it('should NOT follow system theme when mode is set to dark', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('dark');
      (Appearance.getColorScheme as jest.Mock).mockReturnValue('dark');

      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(getByTestId('is-dark').props.children).toBe('dark');
      });

      // Simula mudança do tema do sistema para light
      act(() => {
        if (mockAppearanceListener) {
          mockAppearanceListener({ colorScheme: 'light' });
        }
      });

      // Deve continuar dark porque o modo está fixo em dark
      await waitFor(() => {
        expect(getByTestId('is-dark').props.children).toBe('dark');
      });
    });

    it('should handle null colorScheme from system gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('automatic');
      (Appearance.getColorScheme as jest.Mock).mockReturnValue(null);

      const { getByTestId } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(getByTestId('theme-mode')).toBeTruthy();
      });

      // Deve usar light como fallback quando sistema retorna null
      expect(getByTestId('is-dark').props.children).toBe('light');
    });

    describe('Production scenarios - First launch without cache', () => {
      it('should IMMEDIATELY apply dark theme on first render if system is dark (no flash)', async () => {
        // Simula produção: sem cache, sistema dark
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
        (Appearance.getColorScheme as jest.Mock).mockReturnValue('dark');

        const { getByTestId } = render(
          <ThemeProvider>
            <TestComponent />
          </ThemeProvider>
        );

        // CRÍTICO: Deve aplicar dark IMEDIATAMENTE, sem flash de light
        // Não usa waitFor aqui porque queremos validar o estado inicial síncrono
        await waitFor(() => {
          expect(getByTestId('theme-mode')).toBeTruthy();
        });

        // Valida que foi dark desde o início
        expect(getByTestId('is-dark').props.children).toBe('dark');
        expect(getByTestId('primary-color').props.children).toBe('#3674EE');
      });

      it('should IMMEDIATELY apply light theme on first render if system is light (no flash)', async () => {
        // Simula produção: sem cache, sistema light
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
        (Appearance.getColorScheme as jest.Mock).mockReturnValue('light');

        const { getByTestId } = render(
          <ThemeProvider>
            <TestComponent />
          </ThemeProvider>
        );

        // CRÍTICO: Deve aplicar light IMEDIATAMENTE
        await waitFor(() => {
          expect(getByTestId('theme-mode')).toBeTruthy();
        });

        expect(getByTestId('is-dark').props.children).toBe('light');
        expect(getByTestId('primary-color').props.children).toBe('#1256DB');
      });

      it('should work correctly when AsyncStorage takes time to respond', async () => {
        // Simula AsyncStorage lento (primeira execução em produção)
        (AsyncStorage.getItem as jest.Mock).mockImplementation(
          () =>
            new Promise((resolve) => {
              setTimeout(() => resolve(null), 100);
            })
        );
        (Appearance.getColorScheme as jest.Mock).mockReturnValue('dark');

        const { getByTestId } = render(
          <ThemeProvider>
            <TestComponent />
          </ThemeProvider>
        );

        await waitFor(() => {
          expect(getByTestId('theme-mode')).toBeTruthy();
        });

        // Mesmo com AsyncStorage lento, deve usar o tema do sistema
        expect(getByTestId('is-dark').props.children).toBe('dark');
        expect(getByTestId('theme-mode').props.children).toBe('automatic');
      });
    });
  });
});
