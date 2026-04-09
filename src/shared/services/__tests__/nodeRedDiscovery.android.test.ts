import { Platform } from 'react-native';
import { NodeRedDiscoveryService } from '../nodeRedDiscovery';

const mockFetch = jest.fn();

const createService = () => new NodeRedDiscoveryService();

describe('NodeRedDiscoveryService (android)', () => {
  const originalFetch = globalThis.fetch;
  const originalOS = Platform.OS;

  beforeEach(() => {
    mockFetch.mockReset();
    globalThis.fetch = mockFetch as typeof fetch;
    Object.defineProperty(Platform, 'OS', {
      value: 'android',
      configurable: true,
    });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    Object.defineProperty(Platform, 'OS', {
      value: originalOS,
      configurable: true,
    });
  });

  it('returns android host IP when settings respond', async () => {
    const service = createService();

    mockFetch.mockResolvedValue({ ok: true });

    const result = await service['getLocalMachineIP']();

    expect(result).toBe('10.0.2.2');
  });

  it('falls back to null when android connectivity check fails', async () => {
    const service = createService();

    mockFetch.mockResolvedValue({ ok: false });

    const result = await service['getLocalMachineIP']();

    expect(result).toBeNull();
  });
});
