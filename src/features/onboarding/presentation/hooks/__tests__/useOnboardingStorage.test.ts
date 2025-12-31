import { renderHook, waitFor, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useOnboardingStorage } from '../useOnboardingStorage';

// Mock do AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('useOnboardingStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar hasSeenOnboarding como false quando não há valor no AsyncStorage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useOnboardingStorage());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasSeenOnboarding).toBe(false);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(
      '@pillmind:has_seen_onboarding'
    );
  });

  it('deve retornar hasSeenOnboarding como true quando o valor no AsyncStorage é "true"', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('true');

    const { result } = renderHook(() => useOnboardingStorage());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasSeenOnboarding).toBe(true);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(
      '@pillmind:has_seen_onboarding'
    );
  });

  it('deve salvar "true" no AsyncStorage quando markOnboardingAsSeen é chamado', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useOnboardingStorage());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.markOnboardingAsSeen();
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@pillmind:has_seen_onboarding',
      'true'
    );
    await waitFor(() => {
      expect(result.current.hasSeenOnboarding).toBe(true);
    });
  });

  it('deve remover a chave do AsyncStorage quando resetOnboarding é chamado', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('true');
    (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useOnboardingStorage());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.resetOnboarding();
    });

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
      '@pillmind:has_seen_onboarding'
    );
    await waitFor(() => {
      expect(result.current.hasSeenOnboarding).toBe(false);
    });
  });

  it('deve lidar com erro ao carregar do AsyncStorage e retornar false', async () => {
    const consoleWarnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {});
    (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
      new Error('Storage error')
    );

    const { result } = renderHook(() => useOnboardingStorage());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hasSeenOnboarding).toBe(false);
    expect(consoleWarnSpy).toHaveBeenCalled();

    consoleWarnSpy.mockRestore();
  });

  it('deve lidar com erro ao salvar no AsyncStorage sem quebrar', async () => {
    const consoleWarnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {});
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockRejectedValue(
      new Error('Storage error')
    );

    const { result } = renderHook(() => useOnboardingStorage());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await result.current.markOnboardingAsSeen();

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@pillmind:has_seen_onboarding',
      'true'
    );
    expect(consoleWarnSpy).toHaveBeenCalled();

    consoleWarnSpy.mockRestore();
  });

  it('deve usar a chave correta "@pillmind:has_seen_onboarding" em todas as operações', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useOnboardingStorage());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.markOnboardingAsSeen();
    });

    await waitFor(() => {
      expect(result.current.hasSeenOnboarding).toBe(true);
    });

    await act(async () => {
      await result.current.resetOnboarding();
    });

    await waitFor(() => {
      expect(result.current.hasSeenOnboarding).toBe(false);
    });

    const expectedKey = '@pillmind:has_seen_onboarding';
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(expectedKey);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(expectedKey, 'true');
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(expectedKey);
  });
});
