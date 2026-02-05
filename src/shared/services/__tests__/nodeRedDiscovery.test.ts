import type { NodeRedDiscoveryService } from '../nodeRedDiscovery';

const createServiceWithStorage = () => {
  jest.resetModules();

  const storageMock = {
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve()),
    removeItem: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
  };

  jest.doMock('@react-native-async-storage/async-storage', () => ({
    __esModule: true,
    default: storageMock,
  }));

  let NodeRedDiscoveryService:
    | typeof import('../nodeRedDiscovery').NodeRedDiscoveryService
    | undefined;

  jest.isolateModules(() => {
    ({ NodeRedDiscoveryService } = require('../nodeRedDiscovery'));
  });

  if (!NodeRedDiscoveryService) {
    throw new Error('Failed to load NodeRedDiscoveryService');
  }

  return {
    service: new NodeRedDiscoveryService(),
    storageMock,
  };
};

describe('NodeRedDiscoveryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const getServiceInternals = (service: NodeRedDiscoveryService) =>
    service as unknown as {
      getLocalMachineIP: () => Promise<string | null>;
      getFallbackIPs: () => string[];
      testNodeRedConnection: (url: string) => Promise<boolean>;
    };

  it('should return local IP when Node-RED is reachable', async () => {
    const { service } = createServiceWithStorage();
    const serviceInternal = getServiceInternals(service);

    jest
      .spyOn(serviceInternal, 'getLocalMachineIP')
      .mockResolvedValue('192.168.1.2');
    jest
      .spyOn(serviceInternal, 'testNodeRedConnection')
      .mockResolvedValue(true);

    const url = await service.discoverNodeRed();

    expect(url).toBe('http://192.168.1.2:1880');
  });

  it('should use fallback IPs when local IP is not available', async () => {
    const { service } = createServiceWithStorage();
    const serviceInternal = getServiceInternals(service);

    jest.spyOn(serviceInternal, 'getLocalMachineIP').mockResolvedValue(null);
    jest
      .spyOn(serviceInternal, 'getFallbackIPs')
      .mockReturnValue(['127.0.0.1']);
    jest
      .spyOn(serviceInternal, 'testNodeRedConnection')
      .mockResolvedValue(true);

    const url = await service.discoverNodeRed();

    expect(url).toBe('http://127.0.0.1:1880');
  });

  it('should allow manual Node-RED URL when valid', async () => {
    const { service } = createServiceWithStorage();
    const serviceInternal = getServiceInternals(service);

    jest
      .spyOn(serviceInternal, 'testNodeRedConnection')
      .mockResolvedValue(true);

    const result = await service.setManualNodeRedURL('http://manual:1880');

    expect(result).toBe(true);
  });

  it('should return null when no saved Node-RED URL is available', async () => {
    const { service } = createServiceWithStorage();

    const saved = await service.getSavedNodeRedURL();

    expect(saved).toBeNull();
  });

  it('should clear Node-RED configuration state when possible', async () => {
    const { service } = createServiceWithStorage();

    await service.clearConfiguration();

    expect(service.getCurrentService()).toBeNull();
  });
});
