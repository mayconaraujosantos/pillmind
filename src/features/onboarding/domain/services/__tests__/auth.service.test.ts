import { apiService } from '@core/services/api.service';
import { authService } from '../auth.service';

jest.mock('@core/services/api.service', () => ({
  apiService: {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    postFormData: jest.fn(),
    setBaseUrl: jest.fn(),
    getBaseUrl: jest.fn(() => 'https://api.test'),
  },
}));

const mockApiService = apiService as jest.Mocked<typeof apiService>;

const baseUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
};

const baseSuccessResponse = {
  success: true,
  data: {
    user: baseUser,
    token: 'mock-token',
  },
};

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should call apiService.post with correct data', async () => {
      mockApiService.post.mockResolvedValueOnce(baseSuccessResponse);

      const signUpData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const result = await authService.signUp(signUpData);

      expect(mockApiService.post).toHaveBeenCalledWith(
        '/api/signup',
        signUpData
      );
      expect(result).toEqual(baseSuccessResponse);
    });

    it('should handle signup error', async () => {
      const mockError = {
        success: false,
        error: {
          message: 'Email already exists',
          code: 'EMAIL_EXISTS',
        },
      };

      mockApiService.post.mockResolvedValueOnce(mockError);

      const signUpData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const result = await authService.signUp(signUpData);

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Email already exists');
    });

    it('should map backend response format on signup', async () => {
      const mockResponse = {
        success: true,
        data: {
          accessToken: 'backend-token',
          id: '42',
          name: 'Backend User',
          email: 'backend@example.com',
          pictureUrl: null,
        },
      };

      mockApiService.post.mockResolvedValueOnce(mockResponse);

      const signUpData = {
        name: 'Backend User',
        email: 'backend@example.com',
        password: 'password123',
      };

      const result = await authService.signUp(signUpData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        user: {
          id: '42',
          name: 'Backend User',
          email: 'backend@example.com',
          pictureUrl: null,
        },
        token: 'backend-token',
      });
    });
  });

  describe('signIn', () => {
    it('should call apiService.post with correct data', async () => {
      mockApiService.post.mockResolvedValueOnce(baseSuccessResponse);

      const signInData = {
        email: 'john@example.com',
        password: 'password123',
      };

      const result = await authService.signIn(signInData);

      expect(mockApiService.post).toHaveBeenCalledWith(
        '/api/signin',
        signInData
      );
      expect(result).toEqual(baseSuccessResponse);
    });

    it('should handle signin error', async () => {
      const mockError = {
        success: false,
        error: {
          message: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS',
          status: 401,
        },
      };

      mockApiService.post.mockResolvedValueOnce(mockError);

      const signInData = {
        email: 'john@example.com',
        password: 'wrongpassword',
      };

      const result = await authService.signIn(signInData);

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Invalid credentials');
      expect(result.error?.status).toBe(401);
    });

    it('should handle email not found error', async () => {
      const mockError = {
        success: false,
        error: {
          message: 'Email not found',
          code: 'EMAIL_NOT_FOUND',
          status: 404,
        },
      };

      mockApiService.post.mockResolvedValueOnce(mockError);

      const signInData = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      const result = await authService.signIn(signInData);

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Email not found');
      expect(result.error?.code).toBe('EMAIL_NOT_FOUND');
      expect(result.error?.status).toBe(404);
    });

    it('should map backend response format on signin', async () => {
      const mockResponse = {
        success: true,
        data: {
          accessToken: 'backend-token',
          id: '7',
          name: 'Backend SignIn',
          email: 'signin@example.com',
          pictureUrl: 'https://example.com/avatar.png',
        },
      };

      mockApiService.post.mockResolvedValueOnce(mockResponse);

      const signInData = {
        email: 'signin@example.com',
        password: 'password123',
      };

      const result = await authService.signIn(signInData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        user: {
          id: '7',
          name: 'Backend SignIn',
          email: 'signin@example.com',
          pictureUrl: 'https://example.com/avatar.png',
        },
        token: 'backend-token',
      });
    });
  });

  describe('getProfile', () => {
    it('should fetch and map profile data', async () => {
      const mockResponse = {
        success: true,
        data: {
          id: 'user-1',
          name: 'Profile User',
          email: 'profile@example.com',
          pictureUrl: undefined,
        },
      };

      mockApiService.get.mockResolvedValueOnce(mockResponse);

      const result = await authService.getProfile('token-123');

      expect(mockApiService.get).toHaveBeenCalledWith('/api/profile', {
        headers: { 'x-access-token': 'token-123' },
      });
      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        id: 'user-1',
        name: 'Profile User',
        email: 'profile@example.com',
        pictureUrl: null,
      });
    });

    it('should return error when profile request fails', async () => {
      const mockError = {
        success: false,
        error: {
          message: 'Unauthorized',
          code: 'UNAUTHORIZED',
          status: 401,
        },
      };

      mockApiService.get.mockResolvedValueOnce(mockError);

      const result = await authService.getProfile('token-456');

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Unauthorized');
      expect(result.error?.status).toBe(401);
    });
  });

  describe('logout', () => {
    it('should not throw when logging out', () => {
      expect(() => authService.logout()).not.toThrow();
    });
  });

  describe('uploadProfilePicture', () => {
    it('should post multipart and map profile payload to session user', async () => {
      mockApiService.postFormData.mockResolvedValueOnce({
        success: true,
        data: {
          id: 'u99',
          name: 'Photo User',
          email: 'photo@example.com',
          pictureUrl: 'https://cdn.example/p.png',
        },
      });

      const result = await authService.uploadProfilePicture(
        'file:///local/avatar.jpg',
        'tok-abc',
        'image/jpeg',
        'avatar.jpg'
      );

      expect(mockApiService.postFormData).toHaveBeenCalledWith(
        '/api/profile/picture',
        expect.any(FormData),
        { 'x-access-token': 'tok-abc' }
      );
      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        id: 'u99',
        name: 'Photo User',
        email: 'photo@example.com',
        pictureUrl: 'https://cdn.example/p.png',
      });
    });

    it('should map picture_url (snake_case) from API response', async () => {
      mockApiService.postFormData.mockResolvedValueOnce({
        success: true,
        data: {
          id: 'u100',
          name: 'Snake User',
          email: 'snake@example.com',
          picture_url: 'https://minio.example/bucket/a.jpg',
        },
      });

      const result = await authService.uploadProfilePicture(
        'file:///local/a.jpg',
        'tok',
        'image/jpeg',
        'a.jpg'
      );

      expect(result.success).toBe(true);
      expect(result.data?.pictureUrl).toBe(
        'https://minio.example/bucket/a.jpg'
      );
    });

    it('should return error when upload fails', async () => {
      mockApiService.postFormData.mockResolvedValueOnce({
        success: false,
        error: { message: 'Too large', status: 413 },
      });

      const result = await authService.uploadProfilePicture(
        'file:///x',
        't',
        'image/png',
        'x.png'
      );

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Too large');
      expect(result.error?.status).toBe(413);
    });
  });

  describe('deleteProfilePicture', () => {
    it('should delete on server and map response user', async () => {
      mockApiService.delete.mockResolvedValueOnce({
        success: true,
        data: {
          id: 'u1',
          name: 'User',
          email: 'u@u.com',
          pictureUrl: null,
        },
      });

      const result = await authService.deleteProfilePicture('token-del');

      expect(mockApiService.delete).toHaveBeenCalledWith(
        '/api/profile/picture',
        {
          headers: { 'x-access-token': 'token-del' },
        }
      );
      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        id: 'u1',
        name: 'User',
        email: 'u@u.com',
        pictureUrl: null,
      });
    });

    it('should return error when delete fails', async () => {
      mockApiService.delete.mockResolvedValueOnce({
        success: false,
        error: { message: 'Forbidden', status: 403 },
      });

      const result = await authService.deleteProfilePicture('bad');

      expect(result.success).toBe(false);
      expect(result.error?.status).toBe(403);
    });
  });
});
