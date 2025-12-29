import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { SCREEN_WIDTH } from '../constants/dimensions';
import { useState } from 'react';

export const useOnboardingScroll = (totalSteps: number) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newStep = Math.round(
      event.nativeEvent.contentOffset.x / SCREEN_WIDTH
    );

    // Garante que o passo está dentro dos limites válidos
    if (newStep >= 0 && newStep < totalSteps) {
      setCurrentStep(newStep);
    }
  };

  return { currentStep, handleScroll };
};
