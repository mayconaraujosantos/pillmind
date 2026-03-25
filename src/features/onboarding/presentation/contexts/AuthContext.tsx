import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse } from '../../domain/models/auth.model';
import { authService } from '../../domain/services/auth.service';
import { oauthService } from '../../domain/services/oauth.service';
import { logger } from '@shared/utils/logger';
import { resolveProfilePictureUrlForDevice } from '@shared/utils/profilePictureUrl';

export interface AuthContextType {
  user: AuthResponse['user'] | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  /** URL pública do servidor (MinIO) ou URI local temporária — use for avatars in UI */
  displayPictureUrl: string | undefined;
  setProfilePhotoUri: (uri: string | null) => Promise<void>;
  /**
   * Após upload/remoção no backend: persiste usuário.
   * {@code preferDisplayWithLocalUri}: guarda URI do picker só quando o servidor ainda não tem
   * {@code pictureUrl} (preview antes da URL remota existir). Com URL remota definida, ignora-se
   * o caminho local para não reaparecer avatar vazio após reinício (ficheiros temporários).
   */
  applyServerUser: (
    sessionUser: AuthResponse['user'],
    options?: { preferDisplayWithLocalUri?: string }
  ) => Promise<void>;
  login: (authData: AuthResponse) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const AUTH_STORAGE_KEY = '@pillmind_auth';
const profilePhotoStorageKey = (userId: string) =>
  `@pillmind_profile_photo_${userId}`;

/**
 * Só OAuth costuma reutilizar a mesma URL com foto nova; MinIO/S3 costumam ter chave única.
 * Query extra (?pillmind_cb) em URLs MinIO pode fazer o GET falhar em alguns setups.
 */
function shouldApplyRemoteAvatarCacheBust(uri: string): boolean {
  try {
    const host = new URL(uri).hostname.toLowerCase();
    return (
      host.includes('googleusercontent.com') ||
      host.includes('ggpht.com') ||
      host.includes('facebook.com') ||
      host.includes('fbcdn.net')
    );
  } catch {
    return false;
  }
}

/**
 * Google (e outros CDNs) podem manter a mesma URL ao trocar a foto; o cliente cacheia por URL.
 * Anexa um nonce após cada sync de sessão para forçar novo fetch (apenas hosts OAuth).
 */
function withRemoteImageCacheBust(
  uri: string | undefined,
  cacheNonce: number
): string | undefined {
  if (!uri || cacheNonce <= 0 || !/^https?:\/\//i.test(uri)) {
    return uri;
  }
  if (!shouldApplyRemoteAvatarCacheBust(uri)) {
    return uri;
  }
  const sep = uri.includes('?') ? '&' : '?';
  return `${uri}${sep}pillmind_cb=${cacheNonce}`;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [localProfilePhotoUri, setLocalProfilePhotoUri] = useState<
    string | null
  >(null);
  const [remoteAvatarCacheNonce, setRemoteAvatarCacheNonce] = useState(0);

  const setSessionState = useCallback(
    (sessionUser: AuthResponse['user'], sessionToken: string) => {
      setUser(sessionUser);
      setToken(sessionToken);
    },
    []
  );

  const persistSession = useCallback(
    async (sessionUser: AuthResponse['user'], sessionToken: string) => {
      setSessionState(sessionUser, sessionToken);
      await AsyncStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ user: sessionUser, token: sessionToken })
      );
      setRemoteAvatarCacheNonce(Date.now());
    },
    [setSessionState]
  );

  const clearSession = useCallback(async () => {
    setUser(null);
    setToken(null);
    setLocalProfilePhotoUri(null);
    setRemoteAvatarCacheNonce(0);
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  useEffect(() => {
    if (!user?.id) {
      setLocalProfilePhotoUri(null);
      return;
    }
    const hasRemotePicture =
      typeof user.pictureUrl === 'string' && user.pictureUrl.trim().length > 0;

    let cancelled = false;
    (async () => {
      try {
        if (hasRemotePicture) {
          await AsyncStorage.removeItem(profilePhotoStorageKey(user.id));
          if (!cancelled) {
            setLocalProfilePhotoUri(null);
          }
          return;
        }
        const uri = await AsyncStorage.getItem(profilePhotoStorageKey(user.id));
        if (!cancelled) {
          setLocalProfilePhotoUri(uri);
        }
      } catch {
        if (!cancelled) {
          setLocalProfilePhotoUri(null);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id, user?.pictureUrl]);

  const setProfilePhotoUri = useCallback(
    async (uri: string | null) => {
      if (!user?.id) {
        return;
      }
      const key = profilePhotoStorageKey(user.id);
      if (uri === null) {
        await AsyncStorage.removeItem(key);
        setLocalProfilePhotoUri(null);
      } else {
        await AsyncStorage.setItem(key, uri);
        setLocalProfilePhotoUri(uri);
      }
    },
    [user?.id]
  );

  const displayPictureUrl = useMemo(() => {
    const raw = user?.pictureUrl;
    const remoteRaw =
      typeof raw === 'string' && raw.trim().length > 0 ? raw.trim() : undefined;
    const resolvedRemote =
      typeof remoteRaw === 'string' && /^https?:\/\//i.test(remoteRaw)
        ? resolveProfilePictureUrlForDevice(remoteRaw)
        : remoteRaw;
    const bustedRemote = withRemoteImageCacheBust(
      resolvedRemote,
      remoteAvatarCacheNonce
    );
    const remoteNonEmpty =
      typeof bustedRemote === 'string' && bustedRemote.trim().length > 0;
    if (remoteNonEmpty) {
      return bustedRemote;
    }
    if (localProfilePhotoUri) {
      return localProfilePhotoUri;
    }
    return undefined;
  }, [localProfilePhotoUri, remoteAvatarCacheNonce, user?.pictureUrl]);

  const applyServerUser = useCallback(
    async (
      sessionUser: AuthResponse['user'],
      options?: { preferDisplayWithLocalUri?: string }
    ) => {
      if (!token) {
        return;
      }
      await persistSession(sessionUser, token);
      const key = profilePhotoStorageKey(sessionUser.id);
      const hasRemotePicture =
        typeof sessionUser.pictureUrl === 'string' &&
        sessionUser.pictureUrl.trim().length > 0;
      if (options?.preferDisplayWithLocalUri && !hasRemotePicture) {
        await AsyncStorage.setItem(key, options.preferDisplayWithLocalUri);
        setLocalProfilePhotoUri(options.preferDisplayWithLocalUri);
      } else {
        await AsyncStorage.removeItem(key);
        setLocalProfilePhotoUri(null);
      }
    },
    [token, persistSession]
  );

  const hasValidAuthData = useCallback(
    (data: AuthResponse | null): data is AuthResponse =>
      Boolean(data?.user && data?.token),
    []
  );

  const refreshSessionFromBackend = useCallback(
    async (parsedData: AuthResponse) => {
      const profileResponse = await authService.getProfile(parsedData.token);

      if (profileResponse.success && profileResponse.data) {
        const refreshed = profileResponse.data;
        await persistSession(refreshed, parsedData.token);
        const avatar = refreshed.pictureUrl;
        if (typeof avatar === 'string' && avatar.trim().length > 0) {
          await AsyncStorage.removeItem(profilePhotoStorageKey(refreshed.id));
          setLocalProfilePhotoUri(null);
        }
        logger.info('AuthContext', '✅ Session restored (refreshed)', {
          userId: refreshed.id,
          email: refreshed.email,
        });
        return;
      }

      const status = profileResponse.error?.status;
      if (status === 401 || status === 403) {
        logger.warn('AuthContext', 'Session invalid, clearing...', { status });
        await clearSession();
        return;
      }

      setSessionState(parsedData.user, parsedData.token);
      setRemoteAvatarCacheNonce(Date.now());
      logger.info('AuthContext', '✅ Session restored (cached)', {
        userId: parsedData.user.id,
        email: parsedData.user.email,
      });
    },
    [clearSession, persistSession, setSessionState]
  );

  const handleStoredSession = useCallback(
    async (authData: string) => {
      try {
        const parsedData = JSON.parse(authData) as AuthResponse;
        if (!hasValidAuthData(parsedData)) {
          logger.warn(
            'AuthContext',
            'Invalid auth data structure, clearing...'
          );
          await clearSession();
          return;
        }

        await refreshSessionFromBackend(parsedData);
      } catch (parseError) {
        logger.error(
          'AuthContext',
          '❌ Error parsing stored session, clearing corrupted data',
          {
            error:
              parseError instanceof Error
                ? parseError.message
                : String(parseError),
          },
          parseError instanceof Error ? parseError : undefined
        );
        await clearSession();
      }
    },
    [clearSession, hasValidAuthData, refreshSessionFromBackend]
  );

  const restoreSession = useCallback(async () => {
    logger.info('AuthContext', '🔄 Restoring session');
    setIsLoading(true);
    try {
      const authData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (!authData) {
        logger.debug('AuthContext', 'No stored session found');
        return;
      }

      await handleStoredSession(authData);
    } catch (err) {
      logger.error(
        'AuthContext',
        '❌ Error restoring session',
        { error: err instanceof Error ? err.message : String(err) },
        err instanceof Error ? err : undefined
      );
      // Em caso de erro, tentar limpar o storage
      try {
        await clearSession();
      } catch (clearError) {
        logger.error('AuthContext', 'Failed to clear corrupted storage', {
          error:
            clearError instanceof Error
              ? clearError.message
              : String(clearError),
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [clearSession, handleStoredSession]);

  // Restaurar sessão ao inicializar
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const login = useCallback(
    async (authData: AuthResponse) => {
      logger.info('AuthContext', '🔐 Login called', {
        userId: authData.user.id,
        email: authData.user.email,
      });
      try {
        await persistSession(authData.user, authData.token);
        const serverAvatar = authData.user.pictureUrl;
        if (
          typeof serverAvatar === 'string' &&
          serverAvatar.trim().length > 0
        ) {
          await AsyncStorage.removeItem(
            profilePhotoStorageKey(authData.user.id)
          );
          setLocalProfilePhotoUri(null);
        }
        logger.info('AuthContext', '✅ Login successful', {
          userId: authData.user.id,
        });
      } catch (err) {
        logger.error(
          'AuthContext',
          '❌ Error saving auth data',
          { error: err instanceof Error ? err.message : String(err) },
          err instanceof Error ? err : undefined
        );
        throw err;
      }
    },
    [persistSession]
  );

  const logout = useCallback(async () => {
    logger.info('AuthContext', '🚪 Logout called');
    try {
      // Faz logout do Google se estiver logado
      const isGoogleSignedIn = await oauthService.isSignedIn();
      if (isGoogleSignedIn) {
        await oauthService.signOutGoogle();
      }

      await clearSession();
      logger.info('AuthContext', '✅ Logout successful');
    } catch (err) {
      logger.error(
        'AuthContext',
        '❌ Error during logout',
        { error: err instanceof Error ? err.message : String(err) },
        err instanceof Error ? err : undefined
      );
      throw err;
    }
  }, [clearSession]);

  const signInWithGoogle = useCallback(async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    logger.info('AuthContext', '🔐 Google Sign-In initiated');
    try {
      const response = await oauthService.signInWithGoogle();

      if (response.success && response.data) {
        // Salva os dados de autenticação
        await login(response.data);
        logger.info('AuthContext', '✅ Google Sign-In successful');
        return { success: true };
      } else {
        const errorMessage =
          response.error?.message || 'Erro ao fazer login com Google';
        logger.warn('AuthContext', '⚠️ Google Sign-In failed', {
          error: errorMessage,
        });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      logger.error('AuthContext', '❌ Google Sign-In error', { error });
      return { success: false, error: errorMessage };
    }
  }, [login]);

  const value: AuthContextType = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: !!user,
      displayPictureUrl,
      setProfilePhotoUri,
      applyServerUser,
      login,
      logout,
      restoreSession,
      signInWithGoogle,
    }),
    [
      user,
      token,
      isLoading,
      displayPictureUrl,
      setProfilePhotoUri,
      applyServerUser,
      login,
      logout,
      restoreSession,
      signInWithGoogle,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext deve ser usado dentro de AuthProvider');
  }
  return context;
};
