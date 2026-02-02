import { ApiResponse } from '@core/services/api.service';
import { AuthResponse } from '../../models/auth.model';

type GoogleUserInfo = {
  data?: {
    idToken?: string;
    user: { email: string; name: string };
  };
};

type GoogleModule = {
  configure: jest.Mock;
  hasPlayServices: jest.Mock;
  signIn: jest.Mock;
};

const buildGoogleModule = (): GoogleModule => ({
  configure: jest.fn(),
  hasPlayServices: jest.fn().mockResolvedValue(true),
  signIn: jest.fn(),
});

const setupOAuthModule = (googleSigninModule: GoogleModule | 'throw') => {
  jest.resetModules();

  const apiServiceMock = {
    post: jest.fn(),
  };

  const loggerMock = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  };

  jest.doMock('@core/services/api.service', () => ({
    apiService: apiServiceMock,
  }));

  jest.doMock('@shared/utils/logger', () => ({
    logger: loggerMock,
  }));

  if (googleSigninModule === 'throw') {
    jest.doMock('@react-native-google-signin/google-signin', () => {
      throw new Error('module not available');
    });
  } else {
    jest.doMock('@react-native-google-signin/google-signin', () => ({
      GoogleSignin: googleSigninModule,
    }));
  }

  let oauthModule: typeof import('../oauth.service') | undefined;
  jest.isolateModules(() => {
    oauthModule = require('../oauth.service');
  });

  if (!oauthModule) {
    throw new Error('Failed to load oauth.service module');
  }

  return {
    ...oauthModule,
    apiServiceMock,
    loggerMock,
  };
};

const toApiResponse = (data: AuthResponse): ApiResponse<AuthResponse> => ({
  success: true,
  data,
});

const createUserInfo = (
  overrides: Partial<GoogleUserInfo> = {}
): GoogleUserInfo => ({
  data: {
    idToken: 'id-token',
    user: { email: 'user@example.com', name: 'User' },
  },
  ...overrides,
});

describe('OAuthService', () => {
  it('should skip configure when module is unavailable', () => {
    const { configureGoogleSignIn, loggerMock } = setupOAuthModule('throw');

    configureGoogleSignIn('client-id');

    expect(loggerMock.warn).toHaveBeenCalled();
  });

  it('should return error when Google Sign-In is unavailable', async () => {
    const { oauthService } = setupOAuthModule('throw');

    const response = await oauthService.signInWithGoogle();

    expect(response.success).toBe(false);
    expect(response.error?.code).toBe('MODULE_NOT_AVAILABLE');
  });

  it('should map backend response with user/token format', async () => {
    const googleModule = buildGoogleModule();
    googleModule.signIn.mockResolvedValue(createUserInfo());

    const { oauthService, apiServiceMock } = setupOAuthModule(googleModule);

    apiServiceMock.post.mockResolvedValue(
      toApiResponse({
        user: { id: '1', name: 'User', email: 'user@example.com' },
        token: 'token',
      })
    );

    const response = await oauthService.signInWithGoogle();

    expect(response.success).toBe(true);
    expect(response.data?.token).toBe('token');
  });

  it('should map backend response with accessToken/accountId format', async () => {
    const googleModule = buildGoogleModule();
    googleModule.signIn.mockResolvedValue(createUserInfo());

    const { oauthService, apiServiceMock } = setupOAuthModule(googleModule);

    apiServiceMock.post.mockResolvedValue({
      success: true,
      data: {
        accessToken: 'backend-token',
        accountId: '42',
        name: 'Backend User',
        email: 'backend@example.com',
      },
    });

    const response = await oauthService.signInWithGoogle();

    expect(response.success).toBe(true);
    expect(response.data?.user.id).toBe('42');
    expect(response.data?.token).toBe('backend-token');
  });

  it('should handle user cancelled error', async () => {
    const googleModule = buildGoogleModule();
    googleModule.signIn.mockRejectedValue({ code: 'SIGN_IN_CANCELLED' });

    const { oauthService } = setupOAuthModule(googleModule);

    const response = await oauthService.signInWithGoogle();

    expect(response.success).toBe(false);
    expect(response.error?.code).toBe('USER_CANCELLED');
  });

  it('should handle play services error', async () => {
    const googleModule = buildGoogleModule();
    googleModule.signIn.mockRejectedValue({
      code: 'PLAY_SERVICES_NOT_AVAILABLE',
    });

    const { oauthService } = setupOAuthModule(googleModule);

    const response = await oauthService.signInWithGoogle();

    expect(response.success).toBe(false);
    expect(response.error?.code).toBe('PLAY_SERVICES_ERROR');
  });

  it('should handle developer error code 10', async () => {
    const googleModule = buildGoogleModule();
    googleModule.signIn.mockRejectedValue({ code: '10' });

    const { oauthService } = setupOAuthModule(googleModule);

    const response = await oauthService.signInWithGoogle();

    expect(response.success).toBe(false);
    expect(response.error?.code).toBe('DEVELOPER_ERROR');
  });
});
