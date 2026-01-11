import { authService } from '../auth.service';
import { apiService } from '@core/services/api.service';

jest.mock('@core/services/api.service');

const mockApiService = apiService as jest.Mocked<typeof apiService>;

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should call apiService.post with correct data', async () => {
      const mockResponse = {
        success: true,
        data: {
          user: {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
          },
          token: 'mock-token',
        },
      };

      mockApiService.post.mockResolvedValueOnce(mockResponse);

      const signUpData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const result = await authService.signUp(signUpData);

      expect(mockApiService.post).toHaveBeenCalledWith(
        '/auth/signup',
        signUpData
      );
      expect(result).toEqual(mockResponse);
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
  });

  describe('signIn', () => {
    it('should call apiService.post with correct data', async () => {
      const mockResponse = {
        success: true,
        data: {
          user: {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
          },
          token: 'mock-token',
        },
      };

      mockApiService.post.mockResolvedValueOnce(mockResponse);

      const signInData = {
        email: 'john@example.com',
        password: 'password123',
      };

      const result = await authService.signIn(signInData);

      expect(mockApiService.post).toHaveBeenCalledWith(
        '/auth/signin',
        signInData
      );
      expect(result).toEqual(mockResponse);
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
  });
});
