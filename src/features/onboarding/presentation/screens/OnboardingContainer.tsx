import React, { useRef, useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { OnboardingView } from '../components/OnboardingView';
import {
  OnboardingUnifiedAuth,
  type AuthScreen,
} from '../components/OnboardingUnifiedAuth';
import { OnboardingSuccess } from '../components/OnboardingSuccess';
import { PostLoginLoadingScreen } from './PostLoginLoadingScreen';
import { useOnboardingScroll } from '../hooks/useOnboardingScroll';
import { logger } from '@shared/utils/logger';

const TOTAL_ONBOARDING_STEPS = 3; // Apenas 3 telas informativas

type ScreenType = 'carousel' | 'auth' | 'success' | 'postLoginLoading';

interface OnboardingContainerProps {
  onFinish?: () => void;
  onSkip?: () => void;
  /** Abre login/cadastro direto (ex.: usuário já dispensou o carrossel antes) */
  startWithAuth?: boolean;
}

export const OnboardingContainer: React.FC<OnboardingContainerProps> = ({
  onFinish,
  onSkip,
  startWithAuth = false,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const { currentStep, handleScroll } = useOnboardingScroll(
    TOTAL_ONBOARDING_STEPS
  );
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(
    startWithAuth ? 'auth' : 'carousel'
  );
  const [authEntryScreen, setAuthEntryScreen] = useState<AuthScreen>('signIn');

  useEffect(() => {
    logger.info('OnboardingContainer', '📋 Onboarding container mounted');
    return () => {
      logger.debug('OnboardingContainer', 'Onboarding container unmounted');
    };
  }, []);

  useEffect(() => {
    logger.debug('OnboardingContainer', `Screen changed to: ${currentScreen}`);
  }, [currentScreen]);

  const handleSkip = () => {
    logger.info('OnboardingContainer', '⏭️ Skip pressed → auth');
    setAuthEntryScreen('signIn');
    setCurrentScreen('auth');
    onSkip?.();
  };

  const handleGoToAuthSignIn = () => {
    logger.debug('OnboardingContainer', 'Login entry → auth (sign in)');
    setAuthEntryScreen('signIn');
    setCurrentScreen('auth');
  };

  const handleGoToAuthSignUp = () => {
    logger.debug(
      'OnboardingContainer',
      'Create account entry → auth (sign up)'
    );
    setAuthEntryScreen('signUp');
    setCurrentScreen('auth');
  };

  const handleAuthComplete = () => {
    logger.debug(
      'OnboardingContainer',
      'Authentication completed, showing post-login loading screen'
    );
    setCurrentScreen('postLoginLoading');
  };

  const handleFinish = () => {
    logger.info(
      'OnboardingContainer',
      '✅ Onboarding finished, calling onFinish'
    );
    onFinish?.();
  };

  // Renderiza a tela apropriada baseado no estado
  if (currentScreen === 'auth') {
    logger.debug('OnboardingContainer', 'Rendering unified auth screen');
    return (
      <OnboardingUnifiedAuth
        defaultScreen={authEntryScreen}
        onAuthComplete={handleAuthComplete}
      />
    );
  }

  if (currentScreen === 'postLoginLoading') {
    logger.debug('OnboardingContainer', 'Rendering post-login loading screen');
    return <PostLoginLoadingScreen onComplete={handleFinish} />;
  }

  if (currentScreen === 'success') {
    logger.debug('OnboardingContainer', 'Rendering success screen');
    return <OnboardingSuccess onFinish={handleFinish} />;
  }

  // Renderiza o carousel de onboarding
  logger.debug('OnboardingContainer', 'Rendering carousel screen');
  return (
    <OnboardingView
      ref={scrollViewRef}
      currentStep={currentStep}
      totalSteps={TOTAL_ONBOARDING_STEPS}
      onScroll={handleScroll}
      onSkip={handleSkip}
      onCreateAccount={handleGoToAuthSignUp}
      onLogin={handleGoToAuthSignIn}
      onFinish={onFinish}
    />
  );
};
