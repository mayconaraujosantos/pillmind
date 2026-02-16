import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { OnboardingAuth } from './OnboardingAuth';
import { SocialAuthModal } from './SocialAuthModal';
import { useAuth } from '../hooks/useAuth';
import { useSocialAuth } from '../hooks/useSocialAuth';
import { logger } from '@shared/utils/logger';
import { useAuthContext } from '../contexts/AuthContext';

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

  // Hook para autenticação social (Google/Apple)
  const { modalState, openSocialAuth, closeSocialAuth, confirmSocialAuth } =
    useSocialAuth(onSignInComplete);

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
      Alert.alert(t('common.error'), t('errors.pleaseFieldAllFields'));
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
      // Tratamento específico para diferentes códigos de erro
      let errorMsg: string;

      if (result.error?.code === 'NETWORK_ERROR') {
        errorMsg = t('errors.networkError');
      } else if (result.error?.code === 'EMAIL_NOT_FOUND') {
        errorMsg = t('errors.emailNotFound');
      } else if (result.error?.code === 'INVALID_CREDENTIALS') {
        errorMsg = t('errors.invalidCredentials');
      } else {
        errorMsg = result.error?.message || error || t('errors.failedToSignIn');
      }

      logger.error('OnboardingSignIn', '❌ Sign in failed', {
        email,
        error: errorMsg,
        code: result.error?.code,
      });
      Alert.alert(t('common.error'), errorMsg);
    }
  };

  const handleSocialSignInClick = (provider: 'apple' | 'google') => {
    logger.info('OnboardingSignIn', `Opening ${provider} auth modal`);
    openSocialAuth(provider);
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
        appleDisabled={loading || modalState.loading}
        googleLabel={t('onboarding.signIn.continueWithGoogle')}
        onGooglePress={() => handleSocialSignInClick('google')}
        googleDisabled={loading || modalState.loading}
        linkCta={{
          text: t('onboarding.signIn.dontHaveAccount'),
          linkLabel: t('onboarding.signIn.signUp'),
          onPress: onGoToSignUp,
        }}
      />
      <SocialAuthModal
        visible={modalState.visible}
        provider={modalState.provider}
        loading={modalState.loading}
        onConfirm={confirmSocialAuth}
        onCancel={closeSocialAuth}
      />
    </>
  );
};
