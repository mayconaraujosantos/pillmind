import React, { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { OnboardingAuth } from './OnboardingAuth';
import { SocialAuthModal } from './SocialAuthModal';
import { useAuth } from '../hooks/useAuth';
import { useAuthContext } from '../contexts/AuthContext';
import { logger } from '@shared/utils/logger';

const NODERED_HOST = process.env.EXPO_PUBLIC_NODERED_HOST || '192.168.1.13';
const NODERED_PORT = process.env.EXPO_PUBLIC_NODERED_PORT || '1880';

interface OnboardingSignInProps {
  onSignInComplete?: () => void;
  onGoToSignUp?: () => void;
}

interface SocialAuthModalState {
  visible: boolean;
  provider: 'apple' | 'google';
  loading: boolean;
}

export const OnboardingSignIn: React.FC<OnboardingSignInProps> = ({
  onSignInComplete,
  onGoToSignUp,
}) => {
  const { t } = useTranslation();
  const { signIn, loading, error: _error } = useAuth();
  const authContext = useAuthContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [socialAuthModal, setSocialAuthModal] = useState<SocialAuthModalState>({
    visible: false,
    provider: 'google',
    loading: false,
  });

  const getSocialAuthUrl = (provider: string): string => {
    return `http://${NODERED_HOST}:${NODERED_PORT}/api/auth/${provider}`;
  };

  const handleSignIn = async () => {
    try {
      await signIn({ email, password });
      onSignInComplete?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      Alert.alert(t('common.error'), errorMessage);
    }
  };

  const handleSocialSignInClick = (provider: 'apple' | 'google') => {
    setSocialAuthModal({
      visible: true,
      provider,
      loading: false,
    });
  };

  const handleSocialSignInConfirm = async () => {
    const { provider } = socialAuthModal;

    setSocialAuthModal((prev) => ({
      ...prev,
      loading: true,
    }));

    try {
      const endpoint = getSocialAuthUrl(provider);

      logger.info('OnboardingSignIn', `🔐 ${provider} sign in started`);
      logger.debug('OnboardingSignIn', `📡 Calling ${provider} endpoint`, {
        endpoint,
        platform: Platform.OS,
      });

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: Platform.OS }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `${provider} authentication failed`);
      }

      logger.info('OnboardingSignIn', `✅ ${provider} sign in successful`, {
        data,
      });
      await authContext.login(data);

      setSocialAuthModal({ visible: false, provider, loading: false });
      onSignInComplete?.();
    } catch (err) {
      setSocialAuthModal({ visible: false, provider, loading: false });

      const errorMessage = err instanceof Error ? err.message : String(err);

      logger.error('OnboardingSignIn', `❌ ${provider} error`, {
        error: errorMessage,
        endpoint: getSocialAuthUrl(provider),
      });

      Alert.alert(
        'Authentication Error',
        `${provider} authentication failed: ${errorMessage}`
      );
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
        appleDisabled={false}
        googleLabel={t('onboarding.signIn.continueWithGoogle')}
        onGooglePress={() => handleSocialSignInClick('google')}
        googleDisabled={false}
        linkCta={{
          text: t('onboarding.signIn.dontHaveAccount'),
          linkLabel: t('onboarding.signIn.signUp'),
          onPress: onGoToSignUp,
        }}
        footerInfo={`🟢 Node-RED: ${NODERED_HOST}:${NODERED_PORT}`}
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
