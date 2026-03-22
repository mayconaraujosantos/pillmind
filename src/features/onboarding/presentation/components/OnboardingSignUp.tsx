import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { OnboardingAuth } from './OnboardingAuth';
import { SocialAuthModal } from './SocialAuthModal';
import { useAuth } from '../hooks/useAuth';
import { useSocialAuth } from '../hooks/useSocialAuth';
import { logger } from '@shared/utils/logger';
import { useAuthContext } from '../contexts/AuthContext';

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

  // Hook para autenticação social (Google/Apple)
  const {
    modalState,
    googleLoading,
    openSocialAuth,
    closeSocialAuth,
    confirmSocialAuth,
  } = useSocialAuth(onSignUpComplete);

  const handleSignUp = async () => {
    logger.info('OnboardingSignUp', '🔄 Sign up button pressed', {
      email,
      name,
      passwordLength: password.length,
    });

    if (!name || !email || !password) {
      logger.warn('OnboardingSignUp', '⚠️ Missing required fields', {
        name: name ? 'filled' : 'empty',
        email: email ? 'filled' : 'empty',
        password: password ? 'filled' : 'empty',
      });
      Alert.alert(t('common.error'), t('errors.pleaseFieldAllFields'));
      return;
    }

    logger.debug('OnboardingSignUp', '📤 Calling signUp with data', {
      email,
      name,
    });
    const result = await signUp({ name, email, password });

    if (result.success && result.data) {
      logger.info('OnboardingSignUp', '✅ Sign up successful', {
        email,
        userId: result.data?.user.id,
      });
      // Auto-login after signup
      await authContext.login(result.data);
      onSignUpComplete?.();
    } else {
      // Tratamento específico para diferentes códigos de erro
      let errorMsg: string;

      if (result.error?.code === 'NETWORK_ERROR') {
        errorMsg = t('errors.networkError');
      } else if (result.error?.code === 'EMAIL_EXISTS') {
        errorMsg = result.error.message || 'Email já existe';
      } else {
        errorMsg =
          result.error?.message ||
          authError ||
          t('errors.failedToCreateAccount');
      }

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
            key: 'name',
            label: t('onboarding.signUp.name'),
            placeholder: t('onboarding.signUp.namePlaceholder'),
            value: name,
            onChangeText: setName,
            autoCapitalize: 'words',
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
        appleDisabled={loading || modalState.loading || googleLoading}
        googleLabel={t('onboarding.signUp.continueWithGoogle')}
        onGooglePress={() => handleSocialSignUpClick('google')}
        googleDisabled={loading || modalState.loading || googleLoading}
        googleLoading={googleLoading}
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
