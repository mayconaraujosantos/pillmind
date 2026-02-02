import { apiService } from '@core/services/api.service';
import { authService } from '../auth.service';

jest.mock('@core/services/api.service');

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
});
