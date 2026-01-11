import { apiService, ApiResponse } from '@core/services/api.service';
import {
  SignUpRequest,
  SignInRequest,
  AuthResponse,
} from '../models/auth.model';
import { logger } from '@shared/utils/logger';

class AuthService {
  async signUp(data: SignUpRequest): Promise<ApiResponse<AuthResponse>> {
    logger.info('AuthService', '📝 Sign Up request started', {
      email: data.email,
      name: data.name,
    });

    const response = await apiService.post<AuthResponse>('/auth/signup', data);

    if (response.success) {
      logger.info('AuthService', '✅ Sign Up successful', {
        email: data.email,
        userId: response.data?.user.id,
      });
    } else {
      logger.warn('AuthService', '⚠️ Sign Up failed', {
        email: data.email,
        error: response.error?.message,
        code: response.error?.code,
      });
    }

    return response;
  }

  async signIn(data: SignInRequest): Promise<ApiResponse<AuthResponse>> {
    logger.info('AuthService', '🔐 Sign In request started', {
      email: data.email,
    });

    const response = await apiService.post<AuthResponse>('/auth/signin', data);

    if (response.success) {
      logger.info('AuthService', '✅ Sign In successful', {
        email: data.email,
        userId: response.data?.user.id,
      });
    } else {
      logger.warn('AuthService', '⚠️ Sign In failed', {
        email: data.email,
        error: response.error?.message,
        code: response.error?.code,
      });
    }

    return response;
  }

  logout(): void {
    logger.info('AuthService', '🚪 Logout initiated');
    // Aqui você pode limpar dados de sessão, tokens, etc.
    logger.info('AuthService', '✅ Logout successful');
  }
}

export const authService = new AuthService();
