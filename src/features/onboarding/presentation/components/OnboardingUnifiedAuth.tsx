import React, { useState } from 'react';
import { View } from 'react-native';
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
      <View testID="onboarding-auth-form" style={{ flex: 1 }}>
        <OnboardingSignUp
          onSignUpComplete={onAuthComplete}
          onGoToSignIn={() => setCurrentScreen('signIn')}
        />
      </View>
    );
  }

  return (
    <View testID="onboarding-auth-form" style={{ flex: 1 }}>
      <OnboardingSignIn
        onSignInComplete={onAuthComplete}
        onGoToSignUp={() => setCurrentScreen('signUp')}
      />
    </View>
  );
};
