import React, { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { OnboardingAuth } from './OnboardingAuth';
import { SocialAuthModal } from './SocialAuthModal';
import { useAuth } from '../hooks/useAuth';
import { useAuthContext } from '../contexts/AuthContext';
import { logger } from '@shared/utils/logger';

interface OnboardingSignUpProps {
  onSignUpComplete?: () => void;
  onGoToSignIn?: () => void;
}

export const OnboardingSignUp: React.FC<OnboardingSignUpProps> = ({
  onSignUpComplete,
  onGoToSignIn,
}) => {
  const { t } = useTranslation();
  const { signUp, loading, error: authError } = useAuth();
  const authContext = useAuthContext();

  const [name, setName] = useState('');
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

  const handleSignUp = async () => {
    logger.info('OnboardingSignUp', '🔄 Sign up button pressed', {
      email,
      nameLength: name.length,
      passwordLength: password.length,
    });

    if (!name || !email || !password) {
      logger.warn('OnboardingSignUp', '⚠️ Missing required fields', {
        name: name ? 'filled' : 'empty',
        email: email ? 'filled' : 'empty',
        password: password ? 'filled' : 'empty',
      });
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    logger.debug('OnboardingSignUp', '📤 Calling signUp with data', { email });
    const result = await signUp({ name, email, password });

    if (result.success && result.data) {
      logger.info('OnboardingSignUp', '✅ Sign up successful', {
        email,
        userId: result.data?.user.id,
      });
      Alert.alert('Success', 'Account created! Please sign in.');
      onGoToSignIn?.();
    } else {
      const errorMsg = authError || 'Failed to create account';
      logger.error('OnboardingSignUp', '❌ Sign up failed', {
        email,
        error: errorMsg,
        code: result.error?.code,
      });
      Alert.alert('Error', errorMsg);
    }
  };

  const handleSocialSignUpClick = (provider: 'apple' | 'google') => {
    // Show modal first without loading
    setSocialAuthModal({
      visible: true,
      provider,
      loading: false,
    });
  };

  const handleSocialSignUpConfirm = async () => {
    const { provider } = socialAuthModal;

    // Start loading
    setSocialAuthModal((prev) => ({
      ...prev,
      loading: true,
    }));

    try {
      logger.info('OnboardingSignUp', `🔐 ${provider} sign up started`);

      const endpoint = getSocialAuthUrl(provider);
      logger.debug('OnboardingSignUp', `📡 Calling ${provider} endpoint`, {
        endpoint,
        platform: Platform.OS,
      });

      const startTime = Date.now();
      logger.debug('OnboardingSignUp', `⏱️ Request started at`, {
        time: new Date().toISOString(),
      });

      const response = await fetchWithTimeout(endpoint);

      const duration = Date.now() - startTime;
      logger.debug(
        'OnboardingSignUp',
        `⏱️ Request completed in ${duration}ms`,
        {
          duration,
          status: response.status,
        }
      );

      logger.debug('OnboardingSignUp', `📥 ${provider} response received`, {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
      });

      const data = await response.json();
      logger.debug('OnboardingSignUp', `📦 ${provider} response data`, {
        hasUser: !!data.user,
        hasToken: !!data.token,
        dataKeys: Object.keys(data),
        message: data.message,
        error: data.error,
      });

      if (response.ok && data.user && data.token) {
        logger.info('OnboardingSignUp', `✅ ${provider} sign up successful`, {
          userId: data.user.id,
          email: data.user.email,
        });

        // Hide modal
        setSocialAuthModal({ visible: false, provider, loading: false });

        await authContext.login(data);
        // Removed success alert - PostLoginLoadingScreen provides better UX feedback
        onSignUpComplete?.();
      } else {
        const errorMsg =
          data.message || data.error || `Failed to sign up with ${provider}`;
        logger.warn('OnboardingSignUp', `⚠️ ${provider} sign up failed`, {
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
        logger.error('OnboardingSignUp', `⏱️ ${provider} request timeout`, {
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
        logger.error('OnboardingSignUp', `❌ ${provider} error`, {
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

  const handleSocialSignUpCancel = () => {
    setSocialAuthModal({
      visible: false,
      provider: socialAuthModal.provider,
      loading: false,
    });
  };

  return (
    <>
      <OnboardingAuth
        title={t('onboarding.signUp.title')}
        subtitle={t('onboarding.signUp.subtitle')}
        dividerLabel={t('onboarding.signUp.or')}
        fields={[
          {
            key: 'name',
            label: t('onboarding.signUp.name'),
            placeholder: t('onboarding.signUp.namePlaceholder'),
            value: name,
            onChangeText: setName,
          },
          {
            key: 'email',
            label: t('onboarding.signUp.email'),
            placeholder: t('onboarding.signUp.emailPlaceholder'),
            value: email,
            onChangeText: setEmail,
            keyboardType: 'email-address',
            autoCapitalize: 'none',
          },
          {
            key: 'password',
            label: t('onboarding.signUp.password'),
            placeholder: t('onboarding.signUp.passwordPlaceholder'),
            value: password,
            onChangeText: setPassword,
            secureTextEntry: true,
          },
        ]}
        primaryLabel={t('onboarding.signUp.signUpButton')}
        onPrimaryPress={handleSignUp}
        isLoading={loading}
        appleLabel={t('onboarding.signUp.continueWithApple')}
        onApplePress={() => handleSocialSignUpClick('apple')}
        googleLabel={t('onboarding.signUp.continueWithGoogle')}
        onGooglePress={() => handleSocialSignUpClick('google')}
        termsText={t('onboarding.signUp.terms')}
        linkCta={{
          text: t('onboarding.signUp.alreadyHaveAccount'),
          linkLabel: t('onboarding.signUp.signIn'),
          onPress: onGoToSignIn,
        }}
      />
      <SocialAuthModal
        visible={socialAuthModal.visible}
        provider={socialAuthModal.provider}
        loading={socialAuthModal.loading}
        onConfirm={handleSocialSignUpConfirm}
        onCancel={handleSocialSignUpCancel}
      />
    </>
  );
};
