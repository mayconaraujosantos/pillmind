import React, { useState } from 'react';
import { useTranslation } from '@shared/i18n';
import { OnboardingAuth } from './OnboardingAuth';

interface OnboardingSignInProps {
  onSignInComplete?: () => void;
  onGoToSignUp?: () => void;
}

export const OnboardingSignIn: React.FC<OnboardingSignInProps> = ({
  onSignInComplete,
  onGoToSignUp,
}) => {
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
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
      onPrimaryPress={onSignInComplete}
      appleLabel={t('onboarding.signIn.continueWithApple')}
      googleLabel={t('onboarding.signIn.continueWithGoogle')}
      linkCta={{
        text: t('onboarding.signIn.noAccount'),
        linkLabel: t('onboarding.signIn.signUpLink'),
        onPress: onGoToSignUp,
      }}
    />
  );
};
