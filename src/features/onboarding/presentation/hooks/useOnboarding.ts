import { useState, useCallback } from 'react';

interface UseOnboardingProps {
  totalSteps: number;
  onFinish?: () => void;
  onSkip?: () => void;
  initialStep?: number;
}

export const useOnboarding = ({
  totalSteps,
  onFinish,
  onSkip,
  initialStep = 0,
}: UseOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onFinish?.();
    }
  }, [currentStep, totalSteps, onFinish]);

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 0 && step < totalSteps) {
        setCurrentStep(step);
      }
    },
    [totalSteps]
  );

  const skip = useCallback(() => {
    onSkip?.();
  }, [onSkip]);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return {
    currentStep,
    nextStep,
    previousStep,
    goToStep,
    skip,
    isFirstStep,
    isLastStep,
  };
};
