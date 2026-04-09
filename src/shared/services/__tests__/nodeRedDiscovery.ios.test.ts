import { Platform } from 'react-native';
import { NodeRedDiscoveryService } from '../nodeRedDiscovery';

const mockFetch = jest.fn();

const createService = () => new NodeRedDiscoveryService();

describe('NodeRedDiscoveryService (ios)', () => {
  const originalFetch = globalThis.fetch;
  const originalOS = Platform.OS;

  beforeEach(() => {
    mockFetch.mockReset();
    globalThis.fetch = mockFetch as typeof fetch;
    Object.defineProperty(Platform, 'OS', {
      value: 'ios',
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

  it('returns matching local IP when ios connectivity succeeds', async () => {
    const service = createService();

    mockFetch
      .mockResolvedValueOnce({ ok: true })
      .mockResolvedValueOnce({ ok: true });

    const result = await service['getLocalMachineIP']();

    expect(result).toBe('192.168.1.2');
  });

  it('returns null when ios connectivity checks fail', async () => {
    const service = createService();

    mockFetch.mockRejectedValue(new Error('network'));

    const result = await service['getLocalMachineIP']();

    expect(result).toBeNull();
  });
});
