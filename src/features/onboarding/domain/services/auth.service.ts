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
  pictureUrl?: string | null;
};

type BackendProfilePayload = {
  id: string;
  name: string;
  email: string;
  pictureUrl?: string | null;
};

class AuthService {
  /**
   * Aceita camelCase ou snake_case (ex.: picture_url) por compatibilidade com serialização JSON.
   */
  private coerceProfilePayload(raw: unknown): BackendProfilePayload | null {
    if (raw === null || typeof raw !== 'object') {
      return null;
    }
    const r = raw as Record<string, unknown>;
    const id = r.id;
    const name = r.name;
    const email = r.email;
    if (
      typeof id !== 'string' ||
      typeof name !== 'string' ||
      typeof email !== 'string'
    ) {
      return null;
    }
    const pic = r.pictureUrl ?? r.picture_url;
    const pictureUrl =
      pic == null || pic === ''
        ? null
        : typeof pic === 'string'
        ? pic
        : String(pic);
    return { id, name, email, pictureUrl };
  }

  private mapToSessionUser(data: BackendProfilePayload): AuthResponse['user'] {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      pictureUrl: data.pictureUrl ?? null,
    };
  }

  /**
   * Maps backend response format to frontend AuthResponse format
   */
  private mapBackendResponse(
    backendData: BackendAuthResponse | AuthResponse
  ): AuthResponse {
    // Check if already in correct format
    if ('user' in backendData && 'token' in backendData) {
      return backendData;
    }

    // Map backend format to frontend format
    const backend = backendData as BackendAuthResponse & {
      picture_url?: string | null;
    };
    const pic = backend.pictureUrl ?? backend.picture_url;
    return {
      user: {
        id: backend.id,
        name: backend.name,
        email: backend.email,
        pictureUrl: pic == null || pic === '' ? null : String(pic),
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
      '/api/signup',
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
      '/api/signin',
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

  async getProfile(token: string): Promise<ApiResponse<AuthResponse['user']>> {
    logger.info('AuthService', '👤 Loading profile', {
      hasToken: !!token,
    });

    type BackendProfile = {
      id: string;
      name: string;
      email: string;
      pictureUrl?: string | null;
    };

    const response = await apiService.get<BackendProfile>('/api/profile', {
      headers: {
        'x-access-token': token,
      },
    });

    if (response.success && response.data) {
      const coerced = this.coerceProfilePayload(response.data);
      if (!coerced) {
        logger.warn('AuthService', '⚠️ Profile JSON shape inválido');
        return {
          success: false,
          error: {
            message: 'Invalid profile response',
            code: 'INVALID_PAYLOAD',
          },
        };
      }
      return {
        ...response,
        data: this.mapToSessionUser(coerced),
      };
    }

    logger.warn('AuthService', '⚠️ Load profile failed', {
      error: response.error?.message,
      code: response.error?.code,
      status: response.error?.status,
    });

    return response as ApiResponse<AuthResponse['user']>;
  }

  /**
   * Envia imagem de perfil para o backend (MinIO); atualiza {@code pictureUrl} no servidor.
   */
  async uploadProfilePicture(
    localUri: string,
    token: string,
    mimeType: string,
    fileName: string
  ): Promise<ApiResponse<AuthResponse['user']>> {
    logger.info('AuthService', '📷 Upload profile picture started');

    const form = new FormData();
    form.append('file', {
      uri: localUri,
      name: fileName,
      type: mimeType,
    } as unknown as Blob);

    const response = await apiService.postFormData<BackendProfilePayload>(
      '/api/profile/picture',
      form,
      { 'x-access-token': token }
    );

    if (response.success && response.data) {
      const coerced = this.coerceProfilePayload(response.data);
      if (!coerced) {
        logger.warn(
          'AuthService',
          '⚠️ Upload respondeu OK mas payload de perfil inválido'
        );
        return {
          success: false,
          error: {
            message: 'Invalid profile response',
            code: 'INVALID_PAYLOAD',
          },
        };
      }
      logger.info('AuthService', '✅ Profile picture uploaded', {
        hasPictureUrl: !!coerced.pictureUrl,
      });
      return {
        ...response,
        data: this.mapToSessionUser(coerced),
      };
    }

    logger.warn('AuthService', '⚠️ Profile picture upload failed', {
      error: response.error?.message,
      status: response.error?.status,
    });

    return response as ApiResponse<AuthResponse['user']>;
  }

  async deleteProfilePicture(
    token: string
  ): Promise<ApiResponse<AuthResponse['user']>> {
    logger.info('AuthService', '🗑️ Delete profile picture started');

    const response = await apiService.delete<BackendProfilePayload>(
      '/api/profile/picture',
      {
        headers: {
          'x-access-token': token,
        },
      }
    );

    if (response.success && response.data) {
      const coerced = this.coerceProfilePayload(response.data);
      if (!coerced) {
        logger.warn(
          'AuthService',
          '⚠️ Delete OK mas payload de perfil inválido'
        );
        return {
          success: false,
          error: {
            message: 'Invalid profile response',
            code: 'INVALID_PAYLOAD',
          },
        };
      }
      logger.info('AuthService', '✅ Profile picture removed on server');
      return {
        ...response,
        data: this.mapToSessionUser(coerced),
      };
    }

    logger.warn('AuthService', '⚠️ Delete profile picture failed', {
      error: response.error?.message,
      status: response.error?.status,
    });

    return response as ApiResponse<AuthResponse['user']>;
  }

  logout(): void {
    logger.info('AuthService', '🚪 Logout initiated');
    // Aqui você pode limpar dados de sessão, tokens, etc.
    logger.info('AuthService', '✅ Logout successful');
  }
}

export const authService = new AuthService();
