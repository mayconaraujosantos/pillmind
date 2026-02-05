import { NodeRedDiscoveryService } from '../nodeRedDiscovery';

const mockFetch = jest.fn();

const createService = () => new NodeRedDiscoveryService();

const setGlobalRTCPeerConnection = (candidate: string | null) => {
  class FakeRTCPeerConnection {
    public static lastInstance: FakeRTCPeerConnection | null = null;
    public onicecandidate:
      | ((event: { candidate: { candidate: string } | null }) => void)
      | null = null;

    constructor() {
      FakeRTCPeerConnection.lastInstance = this;
    }

    createDataChannel() {
      return null;
    }

    createOffer() {
      return Promise.resolve({});
    }

    setLocalDescription() {
      if (this.onicecandidate) {
        this.onicecandidate({
          candidate: candidate ? { candidate } : null,
        });
      }
      return Promise.resolve();
    }

    close() {
      return undefined;
    }
  }

  (global as typeof globalThis).RTCPeerConnection =
    FakeRTCPeerConnection as unknown as typeof RTCPeerConnection;
  return FakeRTCPeerConnection;
};

describe('NodeRedDiscoveryService (web)', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    mockFetch.mockReset();
    global.fetch = mockFetch as typeof fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    // @ts-expect-error - remove test global
    delete (global as typeof globalThis).RTCPeerConnection;
  });

  it('returns null when RTCPeerConnection is unavailable', async () => {
    // @ts-expect-error - simulate missing browser API
    delete (global as typeof globalThis).RTCPeerConnection;

    const service = createService();

    const result = await service['getLocalMachineIP']();

    expect(result).toBeNull();
  });

  it('resolves IP from WebRTC candidate when local IP', async () => {
    const candidate =
      'candidate 0 0 UDP 2122252543 192.168.1.50 12345 typ host';
    const FakeRTCPeerConnection = setGlobalRTCPeerConnection(candidate);

    const service = createService();

    const resultPromise = service['getLocalMachineIP']();

    const instance = FakeRTCPeerConnection.lastInstance;
    expect(instance).toBeTruthy();

    const result = await resultPromise;

    expect(result).toBe('192.168.1.50');
  });

  it('uses testNodeRedConnection to validate URL', async () => {
    const service = createService();

    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ version: '3.0.0' }),
    });

    const result = await service['testNodeRedConnection'](
      'http://localhost:1880'
    );

    expect(result).toBe(true);
  });
});
