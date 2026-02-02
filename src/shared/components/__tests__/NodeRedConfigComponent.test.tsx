import React from 'react';
import { Alert } from 'react-native';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { NodeRedConfigComponent } from '../NodeRedConfigComponent';

const mockManualSetURL = jest.fn();
const mockRediscover = jest.fn();
const mockClearConfig = jest.fn();

jest.mock('@shared/theme', () => ({
  useTheme: () => ({ isDark: false }),
}));

jest.mock('@shared/i18n', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@shared/hooks/useNodeRedDiscovery', () => ({
  useNodeRedDiscovery: () => ({
    nodeRedURL: null,
    isDiscovering: false,
    error: null,
    manualSetURL: mockManualSetURL,
    rediscover: mockRediscover,
    clearConfig: mockClearConfig,
  }),
  useNodeRedConnection: () => ({
    isConnected: false,
    isTestingConnection: false,
  }),
}));

describe('NodeRedConfigComponent', () => {
  beforeEach(() => {
    jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
    mockManualSetURL.mockReset();
  });

  it('shows default status when not configured', () => {
    const { getByText } = render(<NodeRedConfigComponent />);

    expect(getByText('Node-RED não configurado')).toBeTruthy();
  });

  it('shows error when manual URL is empty', async () => {
    const { getByText } = render(<NodeRedConfigComponent />);

    act(() => {
      fireEvent.press(getByText('Configurar'));
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'common.error',
      'errors.invalidUrl'
    );
  });

  it('formats url and configures successfully', async () => {
    mockManualSetURL.mockResolvedValue(true);
    const { getByText, getByPlaceholderText } = render(
      <NodeRedConfigComponent />
    );

    await act(async () => {
      fireEvent.changeText(
        getByPlaceholderText('Ex: 192.168.1.100:1880 ou localhost:1880'),
        'localhost:1880'
      );
    });
    await act(async () => {
      fireEvent.press(getByText('Configurar'));
    });

    await waitFor(() => {
      expect(mockManualSetURL).toHaveBeenCalledWith('http://localhost:1880');
      expect(Alert.alert).toHaveBeenCalledWith(
        'common.success',
        'errors.configuredSuccess'
      );
    });
  });
});
