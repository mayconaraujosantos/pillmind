import React, { useState } from 'react';
import { useTranslation } from '@shared/i18n';
import { OnboardingAuth } from './OnboardingAuth';

interface OnboardingSignUpProps {
  onSignUpComplete?: () => void;
  onGoToSignIn?: () => void;
}

export const OnboardingSignUp: React.FC<OnboardingSignUpProps> = ({
  onSignUpComplete,
  onGoToSignIn,
}) => {
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
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
      onPrimaryPress={onSignUpComplete}
      appleLabel={t('onboarding.signUp.continueWithApple')}
      googleLabel={t('onboarding.signUp.continueWithGoogle')}
      termsText={t('onboarding.signUp.terms')}
      linkCta={{
        text: t('onboarding.signUp.alreadyHaveAccount'),
        linkLabel: t('onboarding.signUp.signInLink'),
        onPress: onGoToSignIn,
      }}
    />
  );
};
