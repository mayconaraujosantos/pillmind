import React, { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { OnboardingAuth } from './OnboardingAuth';
import { SocialAuthModal } from './SocialAuthModal';
import { useAuth } from '../hooks/useAuth';
import { useAuthContext } from '../contexts/AuthContext';
import { logger } from '@shared/utils/logger';

interface OnboardingSignInProps {
  onSignInComplete?: () => void;
  onGoToSignUp?: () => void;
}

export const OnboardingSignIn: React.FC<OnboardingSignInProps> = ({
  onSignInComplete,
  onGoToSignUp,
}) => {
  const { t } = useTranslation();
  const { signIn, loading, error } = useAuth();
  const authContext = useAuthContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [socialAuthModal, setSocialAuthModal] = useState({
    visible: false,
    provider: 'google' as 'apple' | 'google',
    loading: false,
  });

  const getSocialAuthUrl = (provider: 'apple' | 'google'): string => {
    const noredHost = process.env.EXPO_PUBLIC_NODERED_HOST;
    const noredPort = process.env.EXPO_PUBLIC_NODERED_PORT || '1880';

    let host = noredHost;

    if (!host || host === 'localhost' || host === '127.0.0.1') {
      // Auto-detect based on platform
      if (Platform.OS === 'android') {
        host = '10.0.2.2'; // Android emulator special alias
      } else {
        // iOS: User must set EXPO_PUBLIC_NODERED_HOST to machine IP
        // Fallback to localhost (may not work without proper config)
        host = '192.168.1.100'; // Change this to your machine IP
      }
    }

    return `http://${host}:${noredPort}/api/auth/${provider}`;
  };

  const fetchWithTimeout = async (
    url: string,
    timeout = 30000
  ): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const body = JSON.stringify({});

    try {
      return await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Content-Length': body.length.toString(),
        },
        body,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const handleSignIn = async () => {
    logger.info('OnboardingSignIn', '🔄 Sign in button pressed', {
      email,
      passwordLength: password.length,
    });

    if (!email || !password) {
      logger.warn('OnboardingSignIn', '⚠️ Missing required fields', {
        email: email ? 'filled' : 'empty',
        password: password ? 'filled' : 'empty',
      });
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    logger.debug('OnboardingSignIn', '📤 Calling signIn with data', { email });
    const result = await signIn({ email, password });

    if (result.success && result.data) {
      logger.info('OnboardingSignIn', '✅ Sign in successful', {
        email,
        userId: result.data?.user.id,
      });
      await authContext.login(result.data);
      // Removed success alert - PostLoginLoadingScreen provides better UX feedback
      onSignInComplete?.();
    } else {
      const errorMsg = error || 'Failed to sign in';
      logger.error('OnboardingSignIn', '❌ Sign in failed', {
        email,
        error: errorMsg,
        code: result.error?.code,
      });
      Alert.alert('Error', errorMsg);
    }
  };

  const handleSocialSignInClick = (provider: 'apple' | 'google') => {
    // Show modal first without loading
    setSocialAuthModal({
      visible: true,
      provider,
      loading: false,
    });
  };

  const handleSocialSignInConfirm = async () => {
    const { provider } = socialAuthModal;

    // Start loading
    setSocialAuthModal((prev) => ({
      ...prev,
      loading: true,
    }));

    try {
      logger.info('OnboardingSignIn', `🔐 ${provider} sign in started`);

      const endpoint = getSocialAuthUrl(provider);
      logger.debug('OnboardingSignIn', `📡 Calling ${provider} endpoint`, {
        endpoint,
        platform: Platform.OS,
      });

      const startTime = Date.now();
      logger.debug('OnboardingSignIn', `⏱️ Request started at`, {
        time: new Date().toISOString(),
      });

      const response = await fetchWithTimeout(endpoint);

      const duration = Date.now() - startTime;
      logger.debug(
        'OnboardingSignIn',
        `⏱️ Request completed in ${duration}ms`,
        {
          duration,
          status: response.status,
        }
      );

      logger.debug('OnboardingSignIn', `📥 ${provider} response received`, {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
      });

      const data = await response.json();
      logger.debug('OnboardingSignIn', `📦 ${provider} response data`, {
        hasUser: !!data.user,
        hasToken: !!data.token,
        dataKeys: Object.keys(data),
        message: data.message,
        error: data.error,
      });

      if (response.ok && data.user && data.token) {
        logger.info('OnboardingSignIn', `✅ ${provider} sign in successful`, {
          userId: data.user.id,
          email: data.user.email,
        });

        // Hide modal
        setSocialAuthModal({ visible: false, provider, loading: false });

        await authContext.login(data);
        // Removed success alert - PostLoginLoadingScreen provides better UX feedback
        onSignInComplete?.();
      } else {
        const errorMsg =
          data.message || data.error || `Failed to sign in with ${provider}`;
        logger.warn('OnboardingSignIn', `⚠️ ${provider} sign in failed`, {
          status: response.status,
          message: errorMsg,
          data,
        });

        // Hide modal and show error
        setSocialAuthModal({ visible: false, provider, loading: false });
        Alert.alert('Error', errorMsg);
      }
    } catch (err) {
      // Hide modal on error
      setSocialAuthModal({ visible: false, provider, loading: false });

      if (err instanceof Error && err.name === 'AbortError') {
        logger.error('OnboardingSignIn', `⏱️ ${provider} request timeout`, {
          error: 'Request took more than 30 seconds',
          suggestion:
            'Ensure Node-RED is running on http://localhost:1880 and reachable from your device',
        });
        Alert.alert(
          'Error',
          `${provider} request timed out. Make sure Node-RED is running.`
        );
      } else {
        const errorObj = err as Error & { code?: string };
        logger.error('OnboardingSignIn', `❌ ${provider} error`, {
          error: err instanceof Error ? err.message : String(err),
          name: err instanceof Error ? err.name : 'Unknown',
          code: errorObj?.code,
          platform: Platform.OS,
          endpoint: getSocialAuthUrl(provider),
        });
        const errorMsg = err instanceof Error ? err.message : String(err);
        Alert.alert('Error', `Network error: ${errorMsg}`);
      }
    }
  };

  const handleSocialSignInCancel = () => {
    setSocialAuthModal({
      visible: false,
      provider: socialAuthModal.provider,
      loading: false,
    });
  };

  return (
    <>
      <OnboardingAuth
        title={t('onboarding.signIn.title')}
        subtitle={t('onboarding.signIn.subtitle')}
        dividerLabel={t('onboarding.signIn.or')}
        fields={[
          {
            key: 'email',
            label: t('onboarding.signIn.email'),
            placeholder: t('onboarding.signIn.emailPlaceholder'),
            value: email,
            onChangeText: setEmail,
            keyboardType: 'email-address',
            autoCapitalize: 'none',
          },
          {
            key: 'password',
            label: t('onboarding.signIn.password'),
            placeholder: t('onboarding.signIn.passwordPlaceholder'),
            value: password,
            onChangeText: setPassword,
            secureTextEntry: true,
          },
        ]}
        primaryLabel={t('onboarding.signIn.signInButton')}
        onPrimaryPress={handleSignIn}
        isLoading={loading}
        appleLabel={t('onboarding.signIn.continueWithApple')}
        onApplePress={() => handleSocialSignInClick('apple')}
        googleLabel={t('onboarding.signIn.continueWithGoogle')}
        onGooglePress={() => handleSocialSignInClick('google')}
        linkCta={{
          text: t('onboarding.signIn.dontHaveAccount'),
          linkLabel: t('onboarding.signIn.signUp'),
          onPress: onGoToSignUp,
        }}
      />
      <SocialAuthModal
        visible={socialAuthModal.visible}
        provider={socialAuthModal.provider}
        loading={socialAuthModal.loading}
        onConfirm={handleSocialSignInConfirm}
        onCancel={handleSocialSignInCancel}
      />
    </>
  );
};
