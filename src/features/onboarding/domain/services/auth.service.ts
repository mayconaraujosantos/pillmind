import { ApiResponse, apiService } from '@core/services/api.service';
import { logger } from '@shared/utils/logger';
import {
  AuthResponse,
  SignInRequest,
  SignUpRequest,
} from '../models/auth.model';

// Backend response format (different from frontend AuthResponse)
type BackendAuthResponse = {
  accessToken: string;
  id: string;
  name: string;
  email: string;
};

class AuthService {
  /**
   * Maps backend response format to frontend AuthResponse format
   */
  private mapBackendResponse(
    backendData: BackendAuthResponse | AuthResponse
  ): AuthResponse {
    // Check if already in correct format
    if ('user' in backendData && 'token' in backendData) {
      return backendData as AuthResponse;
    }

    // Map backend format to frontend format
    const backend = backendData as BackendAuthResponse;
    return {
      user: {
        id: backend.id,
        name: backend.name,
        email: backend.email,
      },
      token: backend.accessToken,
    };
  }

  async signUp(data: SignUpRequest): Promise<ApiResponse<AuthResponse>> {
    logger.info('AuthService', '📝 Sign Up request started', {
      email: data.email,
      name: data.name,
    });

    const response = await apiService.post<BackendAuthResponse | AuthResponse>(
      '/signup',
      data
    );

    if (response.success && response.data) {
      const mappedData = this.mapBackendResponse(response.data);
      logger.info('AuthService', '✅ Sign Up successful', {
        email: data.email,
        userId: mappedData.user.id,
      });
      return { ...response, data: mappedData };
    }

    logger.warn('AuthService', '⚠️ Sign Up failed', {
      email: data.email,
      error: response.error?.message,
      code: response.error?.code,
    });

    return response as ApiResponse<AuthResponse>;
  }

  async signIn(data: SignInRequest): Promise<ApiResponse<AuthResponse>> {
    logger.info('AuthService', '🔐 Sign In request started', {
      email: data.email,
    });

    const response = await apiService.post<BackendAuthResponse | AuthResponse>(
      '/signin',
      data
    );

    if (response.success && response.data) {
      const mappedData = this.mapBackendResponse(response.data);
      logger.info('AuthService', '✅ Sign In successful', {
        email: data.email,
        userId: mappedData.user.id,
      });
      return { ...response, data: mappedData };
    }

    logger.warn('AuthService', '⚠️ Sign In failed', {
      email: data.email,
      error: response.error?.message,
      code: response.error?.code,
    });

    return response as ApiResponse<AuthResponse>;
  }

  logout(): void {
    logger.info('AuthService', '🚪 Logout initiated');
    // Aqui você pode limpar dados de sessão, tokens, etc.
    logger.info('AuthService', '✅ Logout successful');
  }
}

export const authService = new AuthService();
