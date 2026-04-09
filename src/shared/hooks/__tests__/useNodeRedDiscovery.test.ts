import { act, renderHook, waitFor } from '@testing-library/react-native';
import {
  useNodeRedConnection,
  useNodeRedDiscovery,
} from '../useNodeRedDiscovery';

const mockGetNodeRedURL = jest.fn();
const mockSetManualNodeRedURL = jest.fn();
const mockClearConfiguration = jest.fn();

jest.mock('@shared/services/nodeRedDiscovery', () => ({
  nodeRedDiscovery: {
    getNodeRedURL: () => mockGetNodeRedURL(),
    setManualNodeRedURL: (url: string) => mockSetManualNodeRedURL(url),
    clearConfiguration: () => mockClearConfiguration(),
  },
}));

describe('useNodeRedDiscovery', () => {
  beforeEach(() => {
    mockGetNodeRedURL.mockReset();
    mockSetManualNodeRedURL.mockReset();
    mockClearConfiguration.mockReset();
  });

  it('discovers Node-RED on mount when available', async () => {
    mockGetNodeRedURL.mockResolvedValue('http://localhost:1880');

    const { result } = renderHook(() => useNodeRedDiscovery());

    await waitFor(() => {
      expect(result.current.nodeRedURL).toBe('http://localhost:1880');
      expect(result.current.error).toBeNull();
    });
  });

  it('sets error when discovery fails', async () => {
    mockGetNodeRedURL.mockResolvedValue(null);

    const { result } = renderHook(() => useNodeRedDiscovery());

    await waitFor(() => {
      expect(result.current.nodeRedURL).toBeNull();
      expect(result.current.error).toBe(
        'Node-RED não encontrado na rede. Configure manualmente.'
      );
    });
  });

  it('sets manual URL when configuration succeeds', async () => {
    mockGetNodeRedURL.mockResolvedValue(null);
    mockSetManualNodeRedURL.mockResolvedValue(true);

    const { result } = renderHook(() => useNodeRedDiscovery());

    await act(async () => {
      const success = await result.current.manualSetURL('http://manual:1880');
      expect(success).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.nodeRedURL).toBe('http://manual:1880');
      expect(result.current.error).toBeNull();
    });
  });

  it('sets error when manual configuration fails', async () => {
    mockGetNodeRedURL.mockResolvedValue(null);
    mockSetManualNodeRedURL.mockResolvedValue(false);

    const { result } = renderHook(() => useNodeRedDiscovery());

    await act(async () => {
      const success = await result.current.manualSetURL('http://manual:1880');
      expect(success).toBe(false);
    });

    await waitFor(() => {
      expect(result.current.nodeRedURL).toBeNull();
      expect(result.current.error).toBe(
        'Não foi possível conectar ao Node-RED neste endereço'
      );
    });
  });

  it('rediscover clears configuration and retries discovery', async () => {
    mockGetNodeRedURL
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce('http://rediscovered:1880');

    const { result } = renderHook(() => useNodeRedDiscovery());

    await waitFor(() => {
      expect(result.current.error).toBe(
        'Node-RED não encontrado na rede. Configure manualmente.'
      );
    });

    await act(async () => {
      await result.current.rediscover();
    });

    await waitFor(() => {
      expect(mockClearConfiguration).toHaveBeenCalled();
      expect(result.current.nodeRedURL).toBe('http://rediscovered:1880');
    });
  });

  it('clears configuration state', async () => {
    mockGetNodeRedURL.mockResolvedValue('http://localhost:1880');

    const { result } = renderHook(() => useNodeRedDiscovery());

    await waitFor(() => {
      expect(result.current.nodeRedURL).toBe('http://localhost:1880');
    });

    await act(async () => {
      await result.current.clearConfig();
    });

    expect(mockClearConfiguration).toHaveBeenCalled();
    expect(result.current.nodeRedURL).toBeNull();
    expect(result.current.error).toBeNull();
  });
});

describe('useNodeRedConnection', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('reports connection status when request succeeds', async () => {
    const mockFetch = jest.fn().mockResolvedValue({ ok: true });
    globalThis.fetch = mockFetch as typeof fetch;

    const { result } = renderHook(() =>
      useNodeRedConnection('http://localhost:1880')
    );

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
      expect(result.current.isTestingConnection).toBe(false);
    });
  });

  it('reports disconnected when request fails', async () => {
    const mockFetch = jest.fn().mockRejectedValue(new Error('Network error'));
    globalThis.fetch = mockFetch as typeof fetch;

    const { result } = renderHook(() =>
      useNodeRedConnection('http://localhost:1880')
    );

    await waitFor(() => {
      expect(result.current.isConnected).toBe(false);
      expect(result.current.isTestingConnection).toBe(false);
    });
  });
});
