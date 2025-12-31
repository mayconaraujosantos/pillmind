import React from 'react';
import { OnboardingView } from '../components/OnboardingView';
import { useOnboardingScroll } from '../hooks/useOnboardingScroll';
import { ONBOARDING_STEPS } from '../constants/onboarding.constants';

interface OnboardingContainerProps {
  onFinish?: () => void;
  onSkip?: () => void;
}

export const OnboardingContainer: React.FC<OnboardingContainerProps> = ({
  onFinish,
  onSkip,
}) => {
  const { currentStep, handleScroll } = useOnboardingScroll(
    ONBOARDING_STEPS.length
  );

  const handleSkip = () => {
    onSkip?.();
  };

  const handleSignIn = () => {
    onFinish?.();
  };

  const handleSignUp = () => {
    onFinish?.();
  };

  return (
    <OnboardingView
      currentStep={currentStep}
      totalSteps={ONBOARDING_STEPS.length}
      onScroll={handleScroll}
      onSkip={handleSkip}
      onSignIn={handleSignIn}
      onSignUp={handleSignUp}
    />
  );
};
