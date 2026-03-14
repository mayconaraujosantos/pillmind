import { ApiResponse, apiService } from '@core/services/api.service';
import { Gender } from '@features/account/presentation/components/GenderPickerModal';
import { logger } from '@shared/utils/logger';
import {
  AvatarUploadResponse,
  BackendGender,
  ConfirmImageUploadResponse,
  ProfileData,
  ProfileResponseData,
  ProfileUpdateRequest,
  ProfileUpdateResponse,
  RequestImageUploadResponse,
  UploadImageKind,
} from '../models/profile.model';

class ProfileService {
  private static readonly MIN_FALLBACK_FILE_SIZE = 1024;

  private inferExtensionFromMimeType(mimeType?: string): string {
    if (!mimeType) {
      return 'jpg';
    }

    const normalizedMimeType = mimeType.toLowerCase();

    if (normalizedMimeType.includes('png')) return 'png';
    if (normalizedMimeType.includes('webp')) return 'webp';
    if (normalizedMimeType.includes('gif')) return 'gif';
    return 'jpg';
  }

  private resolvePictureUrl(data: unknown): string | null {
    if (!data || typeof data !== 'object') {
      return null;
    }

    const candidate =
      (data as Record<string, unknown>).pictureUrl ||
      (data as Record<string, unknown>).avatarUrl ||
      (data as Record<string, unknown>).imageUrl ||
      (data as Record<string, unknown>).url;

    if (typeof candidate !== 'string') {
      return null;
    }

    const rawUrl = candidate.trim();
    if (!rawUrl) {
      return null;
    }

    if (
      rawUrl.startsWith('http://') ||
      rawUrl.startsWith('https://') ||
      rawUrl.startsWith('file://') ||
      rawUrl.startsWith('content://') ||
      rawUrl.startsWith('data:')
    ) {
      if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
        try {
          const avatarUrl = new URL(rawUrl);
          const isLocalHostUrl =
            avatarUrl.hostname === 'localhost' ||
            avatarUrl.hostname === '127.0.0.1';

          if (isLocalHostUrl) {
            const apiUrl = new URL(apiService.getBaseUrl());
            return `${apiUrl.origin}${avatarUrl.pathname}${avatarUrl.search}${avatarUrl.hash}`;
          }
        } catch {
          return rawUrl;
        }
      }

      return rawUrl;
    }

    if (rawUrl.startsWith('//')) {
      return `https:${rawUrl}`;
    }

    const baseUrl = apiService.getBaseUrl().replace(/\/+$/, '');
    const avatarPath = rawUrl.startsWith('/') ? rawUrl : `/${rawUrl}`;

    return `${baseUrl}${avatarPath}`;
  }

  /**
   * Map frontend Gender to backend BackendGender
   */
  private mapGenderToBackend(gender: Gender): BackendGender | undefined {
    if (!gender) return undefined;
    const mapping: Record<string, BackendGender> = {
      male: 'MALE',
      female: 'FEMALE',
      'non-binary': 'OTHER',
    };
    return mapping[gender];
  }

  /**
   * Map backend BackendGender to frontend Gender
   */
  private mapGenderFromBackend(gender?: BackendGender): Gender {
    if (!gender) return '';
    const mapping: Record<BackendGender, Gender> = {
      MALE: 'male',
      FEMALE: 'female',
      OTHER: 'non-binary',
      PREFER_NOT_TO_SAY: 'non-binary',
    };
    return mapping[gender] || '';
  }
  /**
   * Update user profile
   */
  async updateProfile(
    token: string,
    data: ProfileData
  ): Promise<ApiResponse<ProfileResponseData>> {
    logger.info('ProfileService', '📝 Update profile request started', {
      name: data.name,
      hasDateOfBirth: !!data.dateOfBirth,
      hasGender: !!data.gender,
    });

    // Map frontend data to backend format
    const backendData: ProfileUpdateRequest = {
      name: data.name,
      email: data.email,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender ? this.mapGenderToBackend(data.gender) : undefined,
      pictureUrl: data.pictureUrl,
    };

    const response = await apiService.put<ProfileUpdateResponse>(
      '/api/profile',
      backendData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.success && response.data) {
      logger.info('ProfileService', '✅ Profile updated successfully', {
        userId: response.data.id,
        name: response.data.name,
      });

      // Map backend response to frontend format
      const mappedData: ProfileResponseData = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        dateOfBirth: response.data.dateOfBirth,
        gender: this.mapGenderFromBackend(response.data.gender),
        pictureUrl: this.resolvePictureUrl(response.data),
        emailVerified: response.data.emailVerified,
        updatedAt: response.data.updatedAt,
      };

      return { ...response, data: mappedData };
    }

    logger.warn('ProfileService', '⚠️ Profile update failed', {
      error: response.error?.message,
      code: response.error?.code,
    });

    return response as ApiResponse<ProfileResponseData>;
  }

  /**
   * Request + direct upload + confirm image flow
   */
  private async uploadImage(
    kind: UploadImageKind,
    token: string,
    imageUri: string,
    fileMeta?: {
      fileName?: string;
      mimeType?: string;
      fileSize?: number;
    }
  ): Promise<ApiResponse<{ imageUrl: string }>> {
    logger.info('ProfileService', '🖼️ Image direct upload started', {
      kind,
      imageUri: imageUri.substring(0, 50) + '...',
    });

    try {
      const rawFileName =
        fileMeta?.fileName?.trim() || imageUri.split('/').pop() || 'image';
      const hasValidExtension = /\.(jpg|jpeg|png|gif|webp)$/i.test(rawFileName);
      const inferredExtension = this.inferExtensionFromMimeType(
        fileMeta?.mimeType
      );
      const filename = hasValidExtension
        ? rawFileName
        : `${rawFileName}.${inferredExtension}`;

      const normalizedMimeType = fileMeta?.mimeType?.toLowerCase();
      const type = normalizedMimeType?.startsWith('image/')
        ? normalizedMimeType
        : `image/${this.inferExtensionFromMimeType(fileMeta?.mimeType)}`;

      const resolvedSize =
        fileMeta?.fileSize && fileMeta.fileSize > 0
          ? fileMeta.fileSize
          : ProfileService.MIN_FALLBACK_FILE_SIZE;

      const requestUploadResponse = await apiService.post<RequestImageUploadResponse>(
        '/api/uploads/images/request',
        {
          kind,
          fileName: filename,
          contentType: type,
          size: resolvedSize,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!requestUploadResponse.success || !requestUploadResponse.data) {
        logger.warn('ProfileService', '⚠️ Failed to request direct upload URL', {
          kind,
          error: requestUploadResponse.error?.message,
        });

        return {
          success: false,
          error: {
            message:
              requestUploadResponse.error?.message ||
              'Failed to request image upload URL',
            status: requestUploadResponse.error?.status,
          },
        };
      }

      const { imageId, uploadUrl } = requestUploadResponse.data;
      const directUploadFormData = new FormData();
      directUploadFormData.append('file', {
        uri: imageUri,
        name: filename,
        type,
      } as unknown as Blob);

      const directUploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        body: directUploadFormData,
      });

      if (!directUploadResponse.ok) {
        const uploadError = await directUploadResponse.text();
        logger.warn('ProfileService', '⚠️ Direct upload failed', {
          kind,
          status: directUploadResponse.status,
          error: uploadError,
        });

        return {
          success: false,
          error: {
            message: 'Failed to upload image to storage',
            status: directUploadResponse.status,
          },
        };
      }

      const confirmUploadResponse = await apiService.post<ConfirmImageUploadResponse>(
        '/api/uploads/images/confirm',
        {
          kind,
          imageId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!confirmUploadResponse.success || !confirmUploadResponse.data) {
        logger.warn('ProfileService', '⚠️ Failed to confirm image upload', {
          kind,
          error: confirmUploadResponse.error?.message,
        });

        return {
          success: false,
          error: {
            message:
              confirmUploadResponse.error?.message ||
              'Failed to confirm uploaded image',
            status: confirmUploadResponse.error?.status,
          },
        };
      }

      const resolvedImageUrl = this.resolvePictureUrl(confirmUploadResponse.data);

      logger.info('ProfileService', '✅ Image uploaded and confirmed successfully', {
        kind,
        imageId,
        imageUrl: resolvedImageUrl,
      });

      return {
        success: true,
        data: {
          imageUrl: resolvedImageUrl || '',
        },
      };
    } catch (error) {
      logger.error('ProfileService', '❌ Image upload error', { kind, error });
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to upload image',
        },
      };
    }
  }

  /**
   * Upload user avatar/profile picture
   */
  async uploadAvatar(
    token: string,
    imageUri: string,
    fileMeta?: {
      fileName?: string;
      mimeType?: string;
      fileSize?: number;
    }
  ): Promise<ApiResponse<AvatarUploadResponse>> {
    const response = await this.uploadImage('PROFILE', token, imageUri, fileMeta);

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error,
      };
    }

    return {
      success: true,
      data: {
        pictureUrl: response.data.imageUrl,
      },
    };
  }

  async uploadMedicationImage(
    token: string,
    imageUri: string,
    fileMeta?: {
      fileName?: string;
      mimeType?: string;
      fileSize?: number;
    }
  ): Promise<ApiResponse<{ imageUrl: string }>> {
    return this.uploadImage('MEDICATION', token, imageUri, fileMeta);
  }

  /**
   * Get user profile
   */
  async getProfile(token: string): Promise<ApiResponse<ProfileResponseData>> {
    logger.info('ProfileService', '📖 Get profile request started');

    const response = await apiService.get<ProfileUpdateResponse>(
      '/api/profile',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.success && response.data) {
      logger.info('ProfileService', '✅ Profile fetched successfully', {
        userId: response.data.id,
        name: response.data.name,
      });

      // Map backend response to frontend format
      const mappedData: ProfileResponseData = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        dateOfBirth: response.data.dateOfBirth,
        gender: this.mapGenderFromBackend(response.data.gender),
        pictureUrl: this.resolvePictureUrl(response.data),
        emailVerified: response.data.emailVerified,
        updatedAt: response.data.updatedAt,
      };

      return { ...response, data: mappedData };
    }

    logger.warn('ProfileService', '⚠️ Get profile failed', {
      error: response.error?.message,
      code: response.error?.code,
    });

    return response as ApiResponse<ProfileResponseData>;
  }
}

export const profileService = new ProfileService();
