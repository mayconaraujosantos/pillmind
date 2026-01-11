import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useAuth } from '../useAuth';
import { authService } from '../../../domain/services/auth.service';
import { AuthResponse } from '../../../domain/models/auth.model';
import { ApiResponse } from '@core/services/api.service';

jest.mock('../../../domain/services/auth.service');

const mockAuthService = authService as jest.Mocked<typeof authService>;

type AuthResult = ApiResponse<AuthResponse> | undefined;

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should successfully sign up a user', async () => {
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

      mockAuthService.signUp.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useAuth());

      expect(result.current.loading).toBe(false);

      let signUpResult: AuthResult;
      await act(async () => {
        signUpResult = await result.current.signUp({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        });
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(signUpResult?.success).toBe(true);
      expect(signUpResult?.data).toEqual(mockResponse.data);
      expect(result.current.error).toBeNull();
    });

    it('should handle sign up error', async () => {
      const mockError = {
        success: false,
        error: {
          message: 'Email already exists',
          code: 'EMAIL_EXISTS',
        },
      };

      mockAuthService.signUp.mockResolvedValueOnce(mockError);

      const { result } = renderHook(() => useAuth());

      let signUpResult: AuthResult;
      await act(async () => {
        signUpResult = await result.current.signUp({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        });
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(signUpResult?.success).toBe(false);
      expect(result.current.error).toBe('Email already exists');
    });

    it('should set loading state during sign up', async () => {
      mockAuthService.signUp.mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  success: true,
                  data: {
                    user: { id: '1', name: 'Test', email: 'test@test.com' },
                    token: 'token',
                  },
                }),
              100
            )
          )
      );

      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.signUp({
          name: 'Test',
          email: 'test@test.com',
          password: 'password',
        });
      });

      // Should be loading immediately after calling signUp
      await waitFor(() => {
        expect(result.current.loading).toBe(true);
      });

      // Should stop loading after completion
      await waitFor(
        () => {
          expect(result.current.loading).toBe(false);
        },
        { timeout: 200 }
      );
    });
  });

  describe('signIn', () => {
    it('should successfully sign in a user', async () => {
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

      mockAuthService.signIn.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useAuth());

      let signInResult: AuthResult;
      await act(async () => {
        signInResult = await result.current.signIn({
          email: 'john@example.com',
          password: 'password123',
        });
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(signInResult?.success).toBe(true);
      expect(signInResult?.data).toEqual(mockResponse.data);
      expect(result.current.error).toBeNull();
    });

    it('should handle sign in error', async () => {
      const mockError = {
        success: false,
        error: {
          message: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS',
        },
      };

      mockAuthService.signIn.mockResolvedValueOnce(mockError);

      const { result } = renderHook(() => useAuth());

      let signInResult: AuthResult;
      await act(async () => {
        signInResult = await result.current.signIn({
          email: 'john@example.com',
          password: 'wrongpassword',
        });
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(signInResult?.success).toBe(false);
      expect(result.current.error).toBe('Invalid credentials');
    });
  });
});
