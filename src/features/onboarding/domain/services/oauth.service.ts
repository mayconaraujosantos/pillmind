import { ApiResponse, apiService } from '@core/services/api.service';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { logger } from '@shared/utils/logger';
import { AuthResponse } from '../models/auth.model';

/**
 * Configuração do Google Sign-In
 * Deve ser chamada no início do app (App.tsx)
 */
export const configureGoogleSignIn = (webClientId: string) => {
  try {
    GoogleSignin.configure({
      webClientId, // Web Client ID do Google Cloud Console
      offlineAccess: true, // Para obter refresh token
      forceCodeForRefreshToken: true,
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
    try {
      logger.info('OAuthService', '🔐 Google Sign-In started');

      // 1. Verifica se Google Play Services está disponível
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // 2. Abre popup do Google para autenticação
      const userInfo = await GoogleSignin.signIn();

      logger.info('OAuthService', '✅ Google authentication successful', {
        email: userInfo.data?.user.email,
        name: userInfo.data?.user.name,
      });

      // 3. Pega o ID Token do Google
      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        throw new Error('ID Token not received from Google');
      }

      logger.info('OAuthService', '📤 Sending ID Token to backend');

      // 4. Envia ID Token para o backend validar
      const response = await apiService.post<AuthResponse>('/auth/google', {
        idToken,
      });

      if (response.success) {
        logger.info('OAuthService', '✅ Backend authentication successful', {
          userId: response.data?.user.id,
          email: response.data?.user.email,
        });
      } else {
        logger.error('OAuthService', '❌ Backend authentication failed', {
          error: response.error?.message,
          code: response.error?.code,
        });
      }

      return response;
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
    try {
      logger.info('OAuthService', '🚪 Google Sign-Out started');
      await GoogleSignin.signOut();
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
    try {
      logger.info('OAuthService', '🔐 Revoking Google access');
      await GoogleSignin.revokeAccess();
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
    try {
      const isSignedIn = await GoogleSignin.hasPreviousSignIn();
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
    try {
      const userInfo = await GoogleSignin.getCurrentUser();
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
