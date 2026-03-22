import { ApiResponse } from '@core/services/api.service';
import { AuthResponse } from '../../models/auth.model';

type GoogleModule = {
  configure: jest.Mock;
  hasPlayServices: jest.Mock;
  signInSilently: jest.Mock;
  signIn: jest.Mock;
  getTokens: jest.Mock;
  signOut: jest.Mock;
  revokeAccess: jest.Mock;
  hasPreviousSignIn: jest.Mock;
  getCurrentUser: jest.Mock;
};

const buildGoogleUser = () => ({
  user: {
    id: '1',
    email: 'user@example.com',
    name: 'User',
    photo: null as string | null,
    familyName: null as string | null,
    givenName: null as string | null,
  },
  scopes: [] as string[],
  idToken: 'id-token',
  serverAuthCode: null as string | null,
});

const buildGoogleModule = (): GoogleModule => ({
  configure: jest.fn(),
  hasPlayServices: jest.fn().mockResolvedValue(true),
  signInSilently: jest
    .fn()
    .mockResolvedValue({ type: 'noSavedCredentialFound', data: null }),
  signIn: jest.fn(),
  getTokens: jest.fn(),
  signOut: jest.fn().mockResolvedValue(undefined),
  revokeAccess: jest.fn().mockResolvedValue(undefined),
  hasPreviousSignIn: jest.fn().mockResolvedValue(false),
  getCurrentUser: jest.fn().mockResolvedValue(null),
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

const createSignInSuccess = (
  overrides: Partial<ReturnType<typeof buildGoogleUser>> = {}
) => ({
  type: 'success' as const,
  data: { ...buildGoogleUser(), ...overrides },
});

describe('OAuthService', () => {
  it('should skip configure when module is unavailable', () => {
    const { configureGoogleSignIn, loggerMock } = setupOAuthModule('throw');

    configureGoogleSignIn('client-id');

    expect(loggerMock.warn).toHaveBeenCalled();
  });

  it('should configure Google Sign-In when available', () => {
    const googleModule = buildGoogleModule();

    const { configureGoogleSignIn } = setupOAuthModule(googleModule);

    configureGoogleSignIn('client-id');

    expect(googleModule.configure).toHaveBeenCalledWith({
      webClientId: 'client-id',
    });
  });

  it('should throw if configure fails', () => {
    const googleModule = buildGoogleModule();
    googleModule.configure.mockImplementation(() => {
      throw new Error('configure failed');
    });

    const { configureGoogleSignIn } = setupOAuthModule(googleModule);

    expect(() => configureGoogleSignIn('client-id')).toThrow(
      'configure failed'
    );
  });

  it('should return error when Google Sign-In is unavailable', async () => {
    const { oauthService } = setupOAuthModule('throw');

    const response = await oauthService.signInWithGoogle();

    expect(response.success).toBe(false);
    expect(response.error?.code).toBe('MODULE_NOT_AVAILABLE');
  });

  it('should map backend response with user/token format', async () => {
    const googleModule = buildGoogleModule();
    googleModule.signIn.mockResolvedValue(createSignInSuccess());

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

  it('should map GoogleAuthController payload (userId + pictureUrl)', async () => {
    const googleModule = buildGoogleModule();
    googleModule.signIn.mockResolvedValue(createSignInSuccess());

    const { oauthService, apiServiceMock } = setupOAuthModule(googleModule);

    apiServiceMock.post.mockResolvedValue({
      success: true,
      data: {
        accessToken: 'backend-token',
        userId: '42',
        name: 'Backend User',
        email: 'backend@example.com',
        pictureUrl: 'https://lh3.googleusercontent.com/a/abc',
      },
    });

    const response = await oauthService.signInWithGoogle();

    expect(response.success).toBe(true);
    expect(response.data?.user.id).toBe('42');
    expect(response.data?.user.pictureUrl).toBe(
      'https://lh3.googleusercontent.com/a/abc'
    );
    expect(response.data?.token).toBe('backend-token');
  });

  it('should map legacy accountId alias when userId absent', async () => {
    const googleModule = buildGoogleModule();
    googleModule.signIn.mockResolvedValue(createSignInSuccess());

    const { oauthService, apiServiceMock } = setupOAuthModule(googleModule);

    apiServiceMock.post.mockResolvedValue({
      success: true,
      data: {
        accessToken: 'backend-token',
        accountId: '99',
        name: 'Legacy User',
        email: 'legacy@example.com',
      },
    });

    const response = await oauthService.signInWithGoogle();

    expect(response.success).toBe(true);
    expect(response.data?.user.id).toBe('99');
    expect(response.data?.token).toBe('backend-token');
  });

  it('should return error when idToken is missing', async () => {
    const googleModule = buildGoogleModule();
    googleModule.signIn.mockResolvedValue({
      type: 'success' as const,
      data: { ...buildGoogleUser(), idToken: null },
    });
    googleModule.getTokens.mockRejectedValue(new Error('no tokens'));

    const { oauthService } = setupOAuthModule(googleModule);

    const response = await oauthService.signInWithGoogle();

    expect(response.success).toBe(false);
    expect(response.error?.code).toBe('GOOGLE_SIGNIN_ERROR');
  });

  it('should return backend error when authentication fails', async () => {
    const googleModule = buildGoogleModule();
    googleModule.signIn.mockResolvedValue(createSignInSuccess());

    const { oauthService, apiServiceMock } = setupOAuthModule(googleModule);

    apiServiceMock.post.mockResolvedValue({
      success: false,
      error: { message: 'Backend error', code: 'BACKEND_ERROR' },
    });

    const response = await oauthService.signInWithGoogle();

    expect(response.success).toBe(false);
    expect(response.error?.code).toBe('BACKEND_ERROR');
  });

  it('should handle user cancelled error', async () => {
    const googleModule = buildGoogleModule();
    googleModule.signIn.mockResolvedValue({
      type: 'cancelled',
      data: null,
    });

    const { oauthService } = setupOAuthModule(googleModule);

    const response = await oauthService.signInWithGoogle();

    expect(response.success).toBe(false);
    expect(response.error?.code).toBe('USER_CANCELLED');
  });

  it('should handle play services error', async () => {
    const googleModule = buildGoogleModule();
    googleModule.hasPlayServices.mockRejectedValue({
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

  it('should skip interactive sign-in when silent returns id token', async () => {
    const googleModule = buildGoogleModule();
    googleModule.signInSilently.mockResolvedValue({
      type: 'success',
      data: buildGoogleUser(),
    });

    const { oauthService, apiServiceMock } = setupOAuthModule(googleModule);

    apiServiceMock.post.mockResolvedValue(
      toApiResponse({
        user: { id: '1', name: 'User', email: 'user@example.com' },
        token: 'token',
      })
    );

    const response = await oauthService.signInWithGoogle();

    expect(response.success).toBe(true);
    expect(googleModule.signIn).not.toHaveBeenCalled();
  });

  it('should sign out and revoke access when available', async () => {
    const googleModule = buildGoogleModule();

    const { oauthService } = setupOAuthModule(googleModule);

    await oauthService.signOutGoogle();
    await oauthService.revokeGoogleAccess();

    expect(googleModule.signOut).toHaveBeenCalled();
    expect(googleModule.revokeAccess).toHaveBeenCalled();
  });

  it('should return sign-in status and current user', async () => {
    const googleModule = buildGoogleModule();
    googleModule.hasPreviousSignIn.mockResolvedValue(true);
    googleModule.getCurrentUser.mockResolvedValue({ user: { email: 'a' } });

    const { oauthService } = setupOAuthModule(googleModule);

    const signedIn = await oauthService.isSignedIn();
    const currentUser = await oauthService.getCurrentUser();

    expect(signedIn).toBe(true);
    expect(currentUser).toEqual({ user: { email: 'a' } });
  });

  it('should return false when sign-in status check fails', async () => {
    const googleModule = buildGoogleModule();
    googleModule.hasPreviousSignIn.mockRejectedValue(new Error('fail'));

    const { oauthService } = setupOAuthModule(googleModule);

    const signedIn = await oauthService.isSignedIn();

    expect(signedIn).toBe(false);
  });
});
