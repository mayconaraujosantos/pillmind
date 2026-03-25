export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

/** Valores aceites pelo backend ({@code PUT /api/profile}). */
export type ProfileGender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    pictureUrl?: string | null;
    /** ISO {@code yyyy-MM-dd} */
    dateOfBirth?: string | null;
    gender?: ProfileGender | null;
    emailVerified?: boolean;
  };
  token: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  pictureUrl?: string | null;
  dateOfBirth?: string | null;
  gender?: ProfileGender | null;
  emailVerified?: boolean;
}
