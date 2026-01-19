import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { OnboardingAuth } from './OnboardingAuth';
import { SocialAuthModal } from './SocialAuthModal';
import { useAuth } from '../hooks/useAuth';
import { useSocialAuth } from '../hooks/useSocialAuth';
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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Hook para autenticação social (Google/Apple)
  const { modalState, openSocialAuth, closeSocialAuth, confirmSocialAuth } =
    useSocialAuth(onSignUpComplete);

  const handleSignUp = async () => {
    logger.info('OnboardingSignUp', '🔄 Sign up button pressed', {
      email,
      passwordLength: password.length,
    });

    if (!email || !password) {
      logger.warn('OnboardingSignUp', '⚠️ Missing required fields', {
        email: email ? 'filled' : 'empty',
        password: password ? 'filled' : 'empty',
      });
      Alert.alert(t('common.error'), t('errors.pleaseFieldAllFields'));
      return;
    }

    logger.debug('OnboardingSignUp', '📤 Calling signUp with data', { email });
    const result = await signUp({ email, password });

    if (result.success && result.data) {
      logger.info('OnboardingSignUp', '✅ Sign up successful', {
        email,
        userId: result.data?.user.id,
      });
      Alert.alert(t('common.success'), t('errors.accountCreatedSuccess'));
      onGoToSignIn?.();
    } else {
      const errorMsg = authError || t('errors.failedToCreateAccount');
      logger.error('OnboardingSignUp', '❌ Sign up failed', {
        email,
        error: errorMsg,
        code: result.error?.code,
      });
      Alert.alert(t('common.error'), errorMsg);
    }
  };

  const handleSocialSignUpClick = (provider: 'apple' | 'google') => {
    logger.info('OnboardingSignUp', `Opening ${provider} auth modal`);
    openSocialAuth(provider);
  };

  return (
    <>
      <OnboardingAuth
        title={t('onboarding.signUp.title')}
        subtitle={t('onboarding.signUp.subtitle')}
        dividerLabel={t('onboarding.signUp.or')}
        fields={[
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
        visible={modalState.visible}
        provider={modalState.provider}
        loading={modalState.loading}
        onConfirm={confirmSocialAuth}
        onCancel={closeSocialAuth}
      />
    </>
  );
};
