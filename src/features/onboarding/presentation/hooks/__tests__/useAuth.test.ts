import { act, renderHook, waitFor } from '@testing-library/react-native';
import { authService } from '../../../domain/services/auth.service';
import { useAuth } from '../useAuth';

jest.mock('@shared/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../../../domain/services/auth.service');

const mockAuthService = authService as jest.Mocked<typeof authService>;

type AuthActionResult = Awaited<
  ReturnType<ReturnType<typeof useAuth>['signUp']>
>;
type ServiceAuthResponse = Awaited<ReturnType<typeof authService.signUp>>;

const baseAuthResponse: ServiceAuthResponse = {
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

const executeAuthAction = async (
  action: (auth: ReturnType<typeof useAuth>) => Promise<AuthActionResult>
) => {
  const { result } = renderHook(() => useAuth());

  expect(result.current.loading).toBe(false);

  let response: AuthActionResult | undefined;
  await act(async () => {
    response = await action(result.current);
  });

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  return { result, response };
};

const expectSuccessfulAuth = async (
  action: (auth: ReturnType<typeof useAuth>) => Promise<AuthActionResult>
) => {
  const { result, response } = await executeAuthAction(action);

  expect(response?.success).toBe(true);
  expect(response?.data).toEqual(baseAuthResponse.data);
  expect(result.current.error).toBeNull();
};

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should successfully sign up a user', async () => {
      mockAuthService.signUp.mockResolvedValueOnce(baseAuthResponse);

      await expectSuccessfulAuth((auth) =>
        auth.signUp({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        })
      );
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

      const { result, response } = await executeAuthAction((auth) =>
        auth.signUp({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        })
      );

      expect(response?.success).toBe(false);
      expect(result.current.error).toBe('Email already exists');
    });

    it('should handle email not found error on sign in', async () => {
      const mockError = {
        success: false,
        error: {
          message: 'Email not found',
          code: 'EMAIL_NOT_FOUND',
        },
      };

      mockAuthService.signIn.mockResolvedValueOnce(mockError);

      const { result, response } = await executeAuthAction((auth) =>
        auth.signIn({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
      );

      expect(response?.success).toBe(false);
      expect(result.current.error).toBe('Email not found');
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
      mockAuthService.signIn.mockResolvedValueOnce(baseAuthResponse);

      await expectSuccessfulAuth((auth) =>
        auth.signIn({
          email: 'john@example.com',
          password: 'password123',
        })
      );
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

      const { result, response } = await executeAuthAction((auth) =>
        auth.signIn({
          email: 'john@example.com',
          password: 'wrongpassword',
        })
      );

      expect(response?.success).toBe(false);
      expect(result.current.error).toBe('Invalid credentials');
    });

    it('should handle sign in exception', async () => {
      mockAuthService.signIn.mockRejectedValueOnce(new Error('Boom'));

      const { result, response } = await executeAuthAction((auth) =>
        auth.signIn({
          email: 'john@example.com',
          password: 'wrongpassword',
        })
      );

      expect(response?.success).toBe(false);
      expect(result.current.error).toBe('Boom');
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      mockAuthService.logout.mockImplementationOnce(() => undefined);

      const { result } = renderHook(() => useAuth());

      let response: ReturnType<typeof result.current.logout> | undefined;
      await act(async () => {
        response = result.current.logout();
      });

      expect(response?.success).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('should handle logout errors', async () => {
      mockAuthService.logout.mockImplementationOnce(() => {
        throw new Error('Logout failed');
      });

      const { result } = renderHook(() => useAuth());

      let response: ReturnType<typeof result.current.logout> | undefined;
      await act(async () => {
        response = result.current.logout();
      });

      expect(response?.success).toBe(false);
      expect(result.current.error).toBe('Logout failed');
    });
  });
});
