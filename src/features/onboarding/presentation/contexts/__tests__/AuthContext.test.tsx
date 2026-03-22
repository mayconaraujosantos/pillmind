import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider, useAuthContext } from '../AuthContext';
import { logger } from '@shared/utils/logger';

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

  it('clears local profile cache on login when server sends pictureUrl', async () => {
    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await act(async () => {
      await result.current.login({
        user: {
          id: '5',
          name: 'A',
          email: 'a@a.com',
          pictureUrl: 'https://lh3.googleusercontent.com/x',
        },
        token: 'tok',
      });
    });

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
      '@pillmind_profile_photo_5'
    );
  });

  it('clears local profile cache when restore refreshes profile with pictureUrl', async () => {
    const stored = JSON.stringify({
      user: { id: '1', name: 'User', email: 'user@example.com' },
      token: 'token',
    });

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(stored);
    mockGetProfile.mockResolvedValue({
      success: true,
      data: {
        id: '1',
        name: 'User',
        email: 'user@example.com',
        pictureUrl: 'https://cdn/avatar.png',
      },
    });

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.user?.pictureUrl).toBe('https://cdn/avatar.png');
    });

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
      '@pillmind_profile_photo_1'
    );
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

  it('appends cache-bust query on remote avatar URLs after login', async () => {
    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.login({
        user: {
          id: '9',
          name: 'P',
          email: 'p@p.com',
          pictureUrl: 'https://cdn.example/photo.jpg?size=128',
        },
        token: 't9',
      });
    });

    await waitFor(() => {
      expect(result.current.displayPictureUrl).toMatch(/pillmind_cb=\d+/);
      expect(result.current.displayPictureUrl).toContain(
        'https://cdn.example/photo.jpg?size=128&pillmind_cb='
      );
    });
  });

  it('does not cache-bust local file avatar URIs', async () => {
    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.login({
        user: { id: '8', name: 'L', email: 'l@l.com' },
        token: 't8',
      });
    });

    await act(async () => {
      await result.current.setProfilePhotoUri('file:///local/avatar.png');
    });

    await waitFor(() => {
      expect(result.current.displayPictureUrl).toBe('file:///local/avatar.png');
    });
  });

  it('clears session when stored auth JSON is structurally invalid', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({
        user: { id: '1', name: 'X', email: 'x@x.com' },
        token: '',
      })
    );

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.user).toBeNull();
    });

    expect(AsyncStorage.removeItem).toHaveBeenCalled();
  });

  it('restores cached user when profile refresh fails with non-auth error', async () => {
    const stored = JSON.stringify({
      user: { id: '1', name: 'Cached', email: 'c@c.com' },
      token: 'tok',
    });

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(stored);
    mockGetProfile.mockResolvedValue({
      success: false,
      error: { status: 503, message: 'Unavailable' },
    });

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.user?.name).toBe('Cached');
      expect(result.current.token).toBe('tok');
    });
  });

  it('clears session when profile returns 403', async () => {
    const stored = JSON.stringify({
      user: { id: '1', name: 'User', email: 'u@u.com' },
      token: 'tok',
    });

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(stored);
    mockGetProfile.mockResolvedValue({
      success: false,
      error: { status: 403 },
    });

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });

  it('clears session when restore getItem throws', async () => {
    (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
      new Error('storage read failed')
    );

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.user).toBeNull();
    });

    expect(AsyncStorage.removeItem).toHaveBeenCalled();
  });

  it('rethrows when login cannot persist to storage', async () => {
    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(
      new Error('persist failed')
    );

    await expect(
      act(async () => {
        await result.current.login({
          user: { id: 'z', name: 'Z', email: 'z@z.com' },
          token: 'tz',
        });
      })
    ).rejects.toThrow('persist failed');
  });

  it('applyServerUser is a no-op when there is no token', async () => {
    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const setCallsBefore = (AsyncStorage.setItem as jest.Mock).mock.calls
      .length;

    await act(async () => {
      await result.current.applyServerUser({
        id: 'n',
        name: 'N',
        email: 'n@n.com',
        pictureUrl: 'https://x/p.png',
      });
    });

    expect((AsyncStorage.setItem as jest.Mock).mock.calls.length).toBe(
      setCallsBefore
    );
    expect(result.current.user).toBeNull();
  });

  it('applyServerUser persists server user when session is active', async () => {
    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.login({
        user: { id: '10', name: 'Ten', email: '10@10.com' },
        token: 't10',
      });
    });

    await act(async () => {
      await result.current.applyServerUser({
        id: '10',
        name: 'Ten Updated',
        email: '10@10.com',
        pictureUrl: 'https://minio/bucket/a.png',
      });
    });

    await waitFor(() => {
      expect(result.current.user?.name).toBe('Ten Updated');
      expect(result.current.user?.pictureUrl).toBe(
        'https://minio/bucket/a.png'
      );
    });
  });

  it('returns error when signInWithGoogle throws', async () => {
    mockSignInWithGoogle.mockRejectedValue(new Error('SDK exploded'));

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    let response: { success: boolean; error?: string } | undefined;
    await act(async () => {
      response = await result.current.signInWithGoogle();
    });

    expect(response?.success).toBe(false);
    expect(response?.error).toBe('SDK exploded');
  });

  it('propagates logout failure when Google sign-out throws', async () => {
    mockIsSignedIn.mockResolvedValue(true);
    mockSignOutGoogle.mockRejectedValue(new Error('signOut failed'));

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await expect(
      act(async () => {
        await result.current.logout();
      })
    ).rejects.toThrow('signOut failed');
  });

  it('does not persist profile photo when there is no logged-in user', async () => {
    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const setCallsBefore = (AsyncStorage.setItem as jest.Mock).mock.calls
      .length;

    await act(async () => {
      await result.current.setProfilePhotoUri('file:///ignored.png');
    });

    expect((AsyncStorage.setItem as jest.Mock).mock.calls.length).toBe(
      setCallsBefore
    );
  });

  it('removes cached profile photo when setProfilePhotoUri is called with null', async () => {
    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.login({
        user: { id: 'ph', name: 'Ph', email: 'ph@ph.com' },
        token: 'tph',
      });
    });

    await act(async () => {
      await result.current.setProfilePhotoUri(null);
    });

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
      '@pillmind_profile_photo_ph'
    );
  });

  it('ignores profile photo load errors from AsyncStorage', async () => {
    const stored = JSON.stringify({
      user: { id: 'u1', name: 'N', email: 'e@e.com' },
      token: 'tok',
    });

    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === '@pillmind_auth') {
        return Promise.resolve(stored);
      }
      if (key === '@pillmind_profile_photo_u1') {
        return Promise.reject(new Error('profile key read failed'));
      }
      return Promise.resolve(null);
    });

    mockGetProfile.mockResolvedValue({
      success: false,
      error: { status: 503 },
    });

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.user?.id).toBe('u1');
    });
  });

  it('logs when clearSession fails during restore error handling', async () => {
    (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
      new Error('storage read failed')
    );
    (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(
      new Error('clear failed')
    );

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(logger.error).toHaveBeenCalledWith(
      'AuthContext',
      'Failed to clear corrupted storage',
      expect.objectContaining({ error: 'clear failed' })
    );
  });
});

describe('useAuthContext', () => {
  it('throws when used outside AuthProvider', () => {
    expect(() => {
      renderHook(() => useAuthContext());
    }).toThrow('useAuthContext deve ser usado dentro de AuthProvider');
  });
});
