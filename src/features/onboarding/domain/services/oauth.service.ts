import { ApiResponse, apiService } from '@core/services/api.service';
import { logger } from '@shared/utils/logger';
import { AuthResponse } from '../models/auth.model';

type GoogleSigninType =
  typeof import('@react-native-google-signin/google-signin').GoogleSignin;
type GoogleSignInUser =
  import('@react-native-google-signin/google-signin').User;

// Lazy import Google Sign-In to avoid crash in Expo Go
let GoogleSignin: GoogleSigninType | null = null;
try {
  GoogleSignin =
    require('@react-native-google-signin/google-signin').GoogleSignin;
} catch {
  logger.warn(
    'OAuthService',
    '⚠️ Google Sign-In module not available (requires Custom Development Build)'
  );
}

/**
 * Verifica se o módulo Google Sign-In está disponível
 */
const isGoogleSignInAvailable = (): boolean => {
  return GoogleSignin !== null;
};

/**
 * Configuração do Google Sign-In
 * Deve ser chamada no início do app (App.tsx)
 */
export const configureGoogleSignIn = (webClientId: string) => {
  if (!isGoogleSignInAvailable()) {
    logger.warn(
      'OAuthService',
      '⚠️ Skipping Google Sign-In configuration (module not available)'
    );
    return;
  }

  const googleSignin = GoogleSignin;
  if (!googleSignin) {
    return;
  }

  try {
    googleSignin.configure({
      webClientId,
    });
    logger.info('OAuthService', '✅ Google Sign-In configured successfully');
  } catch (error) {
    logger.error('OAuthService', '❌ Failed to configure Google Sign-In', {
      error,
    });
    throw error;
  }
};

/**
 * Serviço de autenticação OAuth2
 */
class OAuthService {
  /**
   * Autentica usuário com Google
   * Funciona tanto para signup quanto para signin
   * O backend decide automaticamente se cria ou autentica
   */
  async signInWithGoogle(): Promise<ApiResponse<AuthResponse>> {
    if (!isGoogleSignInAvailable()) {
      logger.error(
        'OAuthService',
        '❌ Google Sign-In not available (requires Custom Development Build)',
        {
          reason: 'MODULE_NOT_AVAILABLE',
        }
      );
      return {
        success: false,
        error: {
          message:
            'Google Sign-In requires Custom Development Build. Use email/password for now.',
          code: 'MODULE_NOT_AVAILABLE',
        },
      };
    }

    const googleSignin = GoogleSignin;
    if (!googleSignin) {
      return {
        success: false,
        error: {
          message: 'Google Sign-In module not loaded',
          code: 'MODULE_NOT_AVAILABLE',
        },
      };
    }

    try {
      logger.info('OAuthService', '🔐 Google Sign-In started');

      await googleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: false,
      });

      const resolveIdToken = async (
        user: GoogleSignInUser
      ): Promise<string | null> => {
        if (user.idToken) {
          return user.idToken;
        }
        try {
          const tokens = await googleSignin.getTokens();
          return tokens.idToken ?? null;
        } catch {
          return null;
        }
      };

      let idToken: string | null = null;
      let sessionUser: GoogleSignInUser | null = null;

      const silent = await googleSignin.signInSilently();
      if (silent.type === 'success' && silent.data) {
        idToken = await resolveIdToken(silent.data);
        if (idToken) {
          sessionUser = silent.data;
        }
      }

      if (!idToken) {
        const interactive = await googleSignin.signIn();
        if (interactive.type === 'cancelled') {
          logger.info('OAuthService', 'ℹ️ User cancelled Google Sign-In');
          return {
            success: false,
            error: {
              message: 'Login cancelado pelo usuário',
              code: 'USER_CANCELLED',
            },
          };
        }
        if (interactive.type !== 'success' || !interactive.data) {
          throw new Error('Google Sign-In failed');
        }
        idToken = await resolveIdToken(interactive.data);
        sessionUser = interactive.data;
      }

      if (!idToken || !sessionUser) {
        throw new Error('ID Token not received from Google');
      }

      logger.info('OAuthService', '✅ Google authentication successful', {
        email: sessionUser.user.email,
        name: sessionUser.user.name,
      });

      logger.info('OAuthService', '📤 Sending ID Token to backend');

      // 4. Envia ID Token para o backend validar
      type FlatGoogleAuthBackend = {
        accessToken: string;
        /** Resposta atual do {@code GoogleAuthController} (Java) */
        userId?: string;
        /** Alias legado */
        accountId?: string;
        name: string;
        email: string;
        pictureUrl?: string | null;
      };

      type BackendResponse = AuthResponse | FlatGoogleAuthBackend;

      const response = await apiService.post<BackendResponse>(
        '/api/auth/google',
        {
          idToken,
        }
      );

      // Log completo da resposta do backend para debug
      logger.debug('OAuthService', '📦 Backend response received', {
        success: response.success,
        hasData: !!response.data,
        dataKeys: response.data ? Object.keys(response.data) : [],
        fullData: response.data,
      });

      if (response.success && response.data) {
        const backendData = response.data;

        if ('user' in backendData && 'token' in backendData) {
          logger.info(
            'OAuthService',
            '✅ Backend authentication successful - User created/authenticated',
            {
              userId: backendData.user.id,
              userName: backendData.user.name,
              email: backendData.user.email,
              hasToken: !!backendData.token,
              hasPicture: !!backendData.user.pictureUrl,
            }
          );
          return {
            success: true,
            data: backendData,
          };
        }

        const flat = backendData as FlatGoogleAuthBackend;
        const userId = flat.userId ?? flat.accountId;
        if (!userId || !flat.accessToken) {
          logger.error(
            'OAuthService',
            '❌ Google auth backend payload missing userId or accessToken',
            { keys: Object.keys(flat) }
          );
          return {
            success: false,
            error: {
              message: 'Resposta inválida do servidor após login Google',
              code: 'INVALID_GOOGLE_AUTH_PAYLOAD',
            },
          };
        }

        const serverPicture =
          flat.pictureUrl != null && String(flat.pictureUrl).trim() !== ''
            ? flat.pictureUrl
            : null;
        const googleSdkPicture = sessionUser.user.photo?.trim() || null;
        const pictureUrl = serverPicture ?? googleSdkPicture;

        const mappedResponse: AuthResponse = {
          user: {
            id: userId,
            name: flat.name,
            email: flat.email,
            pictureUrl,
          },
          token: flat.accessToken,
        };

        logger.info(
          'OAuthService',
          '✅ Backend authentication successful - User created/authenticated',
          {
            userId: mappedResponse.user.id,
            userName: mappedResponse.user.name,
            email: mappedResponse.user.email,
            hasToken: !!mappedResponse.token,
            hasPicture: !!mappedResponse.user.pictureUrl,
          }
        );

        return {
          success: true,
          data: mappedResponse,
        };
      } else {
        logger.error('OAuthService', '❌ Backend authentication failed', {
          error: response.error?.message,
          code: response.error?.code,
        });
        return {
          success: false,
          error: response.error,
        };
      }
    } catch (error: unknown) {
      // Tratamento específico de erros do Google Sign-In
      if (error && typeof error === 'object' && 'code' in error) {
        const googleError = error as {
          code: string;
          message?: string;
          userInfo?: unknown;
        };

        // Usuário cancelou o login
        if (googleError.code === 'SIGN_IN_CANCELLED') {
          logger.info('OAuthService', 'ℹ️ User cancelled Google Sign-In');
          return {
            success: false,
            error: {
              message: 'Login cancelado pelo usuário',
              code: 'USER_CANCELLED',
            },
          };
        }

        // Google Play Services não disponível ou desatualizado
        if (googleError.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
          logger.error('OAuthService', '❌ Google Play Services not available');
          return {
            success: false,
            error: {
              message: 'Google Play Services não disponível',
              code: 'PLAY_SERVICES_ERROR',
            },
          };
        }

        // Error Code 10: DEVELOPER_ERROR - SHA-1 mismatch with Google Cloud Console
        if (googleError.code === '10') {
          const debugMessage =
            'Error Code 10 (DEVELOPER_ERROR): This usually means the app signing certificate SHA-1 does not match Google Cloud Console configuration. ' +
            'See GOOGLE_OAUTH_DEBUG.md for solution.';
          logger.error('OAuthService', debugMessage, {
            code: googleError.code,
            troubleshootingUrl:
              'https://react-native-google-signin.github.io/docs/troubleshooting',
          });
          return {
            success: false,
            error: {
              message: debugMessage,
              code: 'DEVELOPER_ERROR',
            },
          };
        }

        // Log all error details for debugging
        logger.error(
          'OAuthService',
          '❌ Google Sign-In failed with error code: ' + googleError.code,
          {
            code: googleError.code,
            message: googleError.message,
            fullError: googleError,
          }
        );
      }

      // Erro genérico
      logger.error('OAuthService', '❌ Google Sign-In failed', { error });
      return {
        success: false,
        error: {
          message:
            error instanceof Error
              ? error.message
              : 'Erro ao fazer login com Google',
          code: 'GOOGLE_SIGNIN_ERROR',
        },
      };
    }
  }

  /**
   * Faz logout do Google (limpa sessão local)
   */
  async signOutGoogle(): Promise<void> {
    const googleSignin = GoogleSignin;
    if (!googleSignin) {
      logger.warn(
        'OAuthService',
        '⚠️ Google Sign-In not available, skipping sign out'
      );
      return;
    }

    try {
      logger.info('OAuthService', '🚪 Google Sign-Out started');
      await googleSignin.signOut();
      logger.info('OAuthService', '✅ Google Sign-Out successful');
    } catch (error) {
      logger.error('OAuthService', '❌ Google Sign-Out failed', { error });
      // Não lança erro, apenas loga
    }
  }

  /**
   * Revoga acesso do Google (remove permissões completamente)
   */
  async revokeGoogleAccess(): Promise<void> {
    const googleSignin = GoogleSignin;
    if (!googleSignin) {
      logger.warn(
        'OAuthService',
        '⚠️ Google Sign-In not available, skipping revoke access'
      );
      return;
    }

    try {
      logger.info('OAuthService', '🔐 Revoking Google access');
      await googleSignin.revokeAccess();
      logger.info('OAuthService', '✅ Google access revoked');
    } catch (error) {
      logger.error('OAuthService', '❌ Failed to revoke Google access', {
        error,
      });
      // Não lança erro, apenas loga
    }
  }

  /**
   * Verifica se usuário está logado no Google
   */
  async isSignedIn(): Promise<boolean> {
    const googleSignin = GoogleSignin;
    if (!googleSignin) {
      return false;
    }

    try {
      const isSignedIn = await googleSignin.hasPreviousSignIn();
      return isSignedIn;
    } catch (error) {
      logger.error('OAuthService', '❌ Failed to check Google sign-in status', {
        error,
      });
      return false;
    }
  }

  /**
   * Pega informações do usuário logado no Google (se houver)
   */
  async getCurrentUser() {
    const googleSignin = GoogleSignin;
    if (!googleSignin) {
      return null;
    }

    try {
      const userInfo = await googleSignin.getCurrentUser();
      return userInfo;
    } catch (error) {
      logger.error('OAuthService', '❌ Failed to get current Google user', {
        error,
      });
      return null;
    }
  }
}

export const oauthService = new OAuthService();
