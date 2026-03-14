import { Gender } from '../../presentation/components/GenderPickerModal';

// Backend gender values
export type BackendGender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';

export interface ProfileUpdateRequest {
  name?: string;
  email?: string;
  dateOfBirth?: string; // ISO 8601 format: YYYY-MM-DD
  gender?: BackendGender;
  pictureUrl?: string;
}

export interface ProfileUpdateResponse {
  id: string;
  name: string;
  email: string;
  dateOfBirth?: string; // yyyy-MM-dd
  gender?: BackendGender;
  pictureUrl?: string | null;
  emailVerified: boolean;
  updatedAt: string; // yyyy-MM-dd'T'HH:mm:ss
}

// Interface para dados do frontend (usa Gender do frontend)
export interface ProfileData {
  name?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: Gender;
  pictureUrl?: string;
}

// Response mapeada para o frontend
export interface ProfileResponseData {
  id: string;
  name: string;
  email: string;
  dateOfBirth?: string;
  gender?: Gender;
  pictureUrl?: string | null;
  emailVerified: boolean;
  updatedAt: string;
}

export interface AvatarUploadResponse {
  pictureUrl: string;
}

export type UploadImageKind = 'PROFILE' | 'MEDICATION';

export interface RequestImageUploadRequest {
  kind: UploadImageKind;
  fileName: string;
  contentType: string;
  size: number;
}

export interface RequestImageUploadResponse {
  imageId: string;
  uploadUrl: string;
}

export interface ConfirmImageUploadRequest {
  kind: UploadImageKind;
  imageId: string;
}

export interface ConfirmImageUploadResponse {
  imageId: string;
  imageUrl: string;
  kind: UploadImageKind;
}
