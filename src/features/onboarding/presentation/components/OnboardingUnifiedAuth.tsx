import React, { useState } from 'react';
import { OnboardingSignIn } from './OnboardingSignIn';
import { OnboardingSignUp } from './OnboardingSignUp';

export type AuthScreen = 'signIn' | 'signUp';

interface OnboardingUnifiedAuthProps {
  onAuthComplete?: () => void;
  defaultScreen?: AuthScreen;
}

export const OnboardingUnifiedAuth: React.FC<OnboardingUnifiedAuthProps> = ({
  onAuthComplete,
  defaultScreen = 'signIn',
}) => {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>(defaultScreen);

  if (currentScreen === 'signUp') {
    return (
      <OnboardingSignUp
        onSignUpComplete={onAuthComplete}
        onGoToSignIn={() => setCurrentScreen('signIn')}
      />
    );
  }

  return (
    <OnboardingSignIn
      onSignInComplete={onAuthComplete}
      onGoToSignUp={() => setCurrentScreen('signUp')}
    />
  );
};
