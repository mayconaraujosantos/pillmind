import React, { useRef } from 'react';
import { ScrollView, Dimensions } from 'react-native';
import { OnboardingView } from '../components/OnboardingView';
import { useOnboardingScroll } from '../hooks/useOnboardingScroll';
import { ONBOARDING_STEPS } from '../constants/onboarding.constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingContainerProps {
  onFinish?: () => void;
  onSkip?: () => void;
}

export const OnboardingContainer: React.FC<OnboardingContainerProps> = ({
  onFinish,
  onSkip,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const { currentStep, handleScroll } = useOnboardingScroll(
    ONBOARDING_STEPS.length
  );

  const handleSkip = () => {
    onSkip?.();
  };

  const handleCreateAccount = () => {
    // Navega para o step de Sign Up (step 4)
    const nextPosition = 3 * SCREEN_WIDTH;
    scrollViewRef.current?.scrollTo({
      x: nextPosition,
      animated: true,
    });
  };

  const handleLogin = () => {
    // Navega para o step de Sign In (step 5)
    const nextPosition = 4 * SCREEN_WIDTH;
    scrollViewRef.current?.scrollTo({
      x: nextPosition,
      animated: true,
    });
  };

  const handleSignUpComplete = () => {
    // Navega para a tela de sucesso (step 5)
    const nextPosition = 5 * SCREEN_WIDTH;
    scrollViewRef.current?.scrollTo({
      x: nextPosition,
      animated: true,
    });
  };

  const handleSignInComplete = () => {
    // Navega para a tela de sucesso (step 5)
    const nextPosition = 5 * SCREEN_WIDTH;
    scrollViewRef.current?.scrollTo({
      x: nextPosition,
      animated: true,
    });
    onFinish?.();
  };

  return (
    <OnboardingView
      ref={scrollViewRef}
      currentStep={currentStep}
      totalSteps={ONBOARDING_STEPS.length}
      onScroll={handleScroll}
      onSkip={handleSkip}
      onCreateAccount={handleCreateAccount}
      onLogin={handleLogin}
      onSignUpComplete={handleSignUpComplete}
      onSignInComplete={handleSignInComplete}
      onFinish={onFinish}
    />
  );
};
