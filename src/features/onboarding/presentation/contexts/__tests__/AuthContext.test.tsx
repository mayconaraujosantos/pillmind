import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider, useAuthContext } from '../AuthContext';

const mockGetProfile = jest.fn();
const mockSignInWithGoogle = jest.fn();
const mockIsSignedIn = jest.fn();
const mockSignOutGoogle = jest.fn();

jest.mock('../../../domain/services/auth.service', () => ({
  authService: {
    getProfile: () => mockGetProfile(),
  },
}));

jest.mock('../../../domain/services/oauth.service', () => ({
  oauthService: {
    signInWithGoogle: () => mockSignInWithGoogle(),
    isSignedIn: () => mockIsSignedIn(),
    signOutGoogle: () => mockSignOutGoogle(),
  },
}));

jest.mock('@shared/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  beforeEach(() => {
    jest.spyOn(AsyncStorage, 'getItem').mockResolvedValue(null);
    jest.spyOn(AsyncStorage, 'setItem').mockResolvedValue();
    jest.spyOn(AsyncStorage, 'removeItem').mockResolvedValue();
    mockGetProfile.mockReset();
    mockSignInWithGoogle.mockReset();
    mockIsSignedIn.mockReset();
    mockSignOutGoogle.mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('restores with no stored session', async () => {
    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });

  it('clears corrupted stored session', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('bad-json');

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(AsyncStorage.removeItem).toHaveBeenCalled();
  });

  it('restores and refreshes session when backend returns profile', async () => {
    const stored = JSON.stringify({
      user: { id: '1', name: 'User', email: 'user@example.com' },
      token: 'token',
    });

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(stored);
    mockGetProfile.mockResolvedValue({
      success: true,
      data: { id: '1', name: 'User', email: 'user@example.com' },
    });

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.user?.id).toBe('1');
      expect(result.current.token).toBe('token');
    });

    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it('clears session when backend returns unauthorized', async () => {
    const stored = JSON.stringify({
      user: { id: '1', name: 'User', email: 'user@example.com' },
      token: 'token',
    });

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(stored);
    mockGetProfile.mockResolvedValue({
      success: false,
      error: { status: 401 },
    });

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(AsyncStorage.removeItem).toHaveBeenCalled();
  });

  it('logs in and persists session', async () => {
    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await act(async () => {
      await result.current.login({
        user: { id: '2', name: 'Tester', email: 'tester@example.com' },
        token: 'token-2',
      });
    });

    await waitFor(() => {
      expect(result.current.user?.id).toBe('2');
      expect(result.current.token).toBe('token-2');
    });
    expect(AsyncStorage.setItem).toHaveBeenCalled();
  });

  it('logs out and clears session with Google sign-out', async () => {
    mockIsSignedIn.mockResolvedValue(true);

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await act(async () => {
      await result.current.logout();
    });

    expect(mockSignOutGoogle).toHaveBeenCalled();
    expect(AsyncStorage.removeItem).toHaveBeenCalled();
  });

  it('signs in with Google and persists session', async () => {
    mockSignInWithGoogle.mockResolvedValue({
      success: true,
      data: {
        user: { id: '3', name: 'G', email: 'g@example.com' },
        token: 't',
      },
    });

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    let response: { success: boolean; error?: string } | undefined;
    await act(async () => {
      response = await result.current.signInWithGoogle();
    });

    expect(response).toBeDefined();
    expect(response?.success).toBe(true);

    await waitFor(() => {
      expect(result.current.user?.id).toBe('3');
    });
  });

  it('returns error when Google sign-in fails', async () => {
    mockSignInWithGoogle.mockResolvedValue({
      success: false,
      error: { message: 'Fail' },
    });

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    let response: { success: boolean; error?: string } | undefined;
    await act(async () => {
      response = await result.current.signInWithGoogle();
    });

    expect(response).toBeDefined();
    expect(response?.success).toBe(false);
    expect(response?.error).toBe('Fail');
  });
});
