import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse } from '../../domain/models/auth.model';
import { oauthService } from '../../domain/services/oauth.service';
import { logger } from '@shared/utils/logger';

export interface AuthContextType {
  user: AuthResponse['user'] | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (authData: AuthResponse) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const AUTH_STORAGE_KEY = '@pillmind_auth';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaurar sessão ao inicializar
  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    logger.info('AuthContext', '🔄 Restoring session');
    setIsLoading(true);
    try {
      const authData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (authData) {
        try {
          const parsedData: AuthResponse = JSON.parse(authData);
          if (parsedData && parsedData.user && parsedData.token) {
            setUser(parsedData.user);
            setToken(parsedData.token);
            logger.info('AuthContext', '✅ Session restored', {
              userId: parsedData.user.id,
              email: parsedData.user.email,
            });
          } else {
            logger.warn(
              'AuthContext',
              'Invalid auth data structure, clearing...'
            );
            await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
          }
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
          // Limpar dados corrompidos
          await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
        }
      } else {
        logger.debug('AuthContext', 'No stored session found');
      }
    } catch (err) {
      logger.error(
        'AuthContext',
        '❌ Error restoring session',
        { error: err instanceof Error ? err.message : String(err) },
        err instanceof Error ? err : undefined
      );
      // Em caso de erro, tentar limpar o storage
      try {
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
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
  };

  const login = async (authData: AuthResponse) => {
    logger.info('AuthContext', '🔐 Login called', {
      userId: authData.user.id,
      email: authData.user.email,
    });
    try {
      setUser(authData.user);
      setToken(authData.token);
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
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
  };

  const logout = async () => {
    logger.info('AuthContext', '🚪 Logout called');
    try {
      // Faz logout do Google se estiver logado
      const isGoogleSignedIn = await oauthService.isSignedIn();
      if (isGoogleSignedIn) {
        await oauthService.signOutGoogle();
      }

      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
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
  };

  const signInWithGoogle = async (): Promise<{
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
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    restoreSession,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext deve ser usado dentro de AuthProvider');
  }
  return context;
};
