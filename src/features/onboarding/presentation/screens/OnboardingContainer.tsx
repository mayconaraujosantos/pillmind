import React, { useRef, useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { OnboardingView } from '../components/OnboardingView';
import { OnboardingSignUp } from '../components/OnboardingSignUp';
import { OnboardingSignIn } from '../components/OnboardingSignIn';
import { OnboardingSuccess } from '../components/OnboardingSuccess';
import { PostLoginLoadingScreen } from './PostLoginLoadingScreen';
import { useOnboardingScroll } from '../hooks/useOnboardingScroll';
import { logger } from '@shared/utils/logger';

const TOTAL_ONBOARDING_STEPS = 3; // Apenas 3 telas informativas

type ScreenType =
  | 'carousel'
  | 'signup'
  | 'signin'
  | 'success'
  | 'postLoginLoading';

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
    TOTAL_ONBOARDING_STEPS
  );
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('carousel');

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
    logger.info('OnboardingContainer', '⏭️ Skip pressed');
    onSkip?.();
  };

  const handleCreateAccount = () => {
    logger.debug('OnboardingContainer', 'Sign up button pressed');
    setCurrentScreen('signup');
  };

  const handleLogin = () => {
    logger.debug('OnboardingContainer', 'Sign in button pressed');
    setCurrentScreen('signin');
  };

  const handleSignUpComplete = () => {
    logger.debug(
      'OnboardingContainer',
      'Sign up completed - checking if user is authenticated'
    );
    // If user is authenticated (social signup), show loading screen
    // Otherwise, show success screen to prompt sign in
    // Note: This will be handled by checking auth state in the component
    setCurrentScreen('postLoginLoading');
  };

  const handleSignInComplete = () => {
    logger.debug(
      'OnboardingContainer',
      'Sign in completed, showing post-login loading screen'
    );
    // Show post-login loading screen instead of success screen
    // This prepares user data before navigating to home
    setCurrentScreen('postLoginLoading');
  };

  const handleGoToSignIn = () => {
    logger.debug('OnboardingContainer', 'Going to sign in screen');
    setCurrentScreen('signin');
  };

  const handleGoToSignUp = () => {
    logger.debug('OnboardingContainer', 'Going to sign up screen');
    setCurrentScreen('signup');
  };

  const handleFinish = () => {
    logger.info(
      'OnboardingContainer',
      '✅ Onboarding finished, calling onFinish'
    );
    onFinish?.();
  };

  // Renderiza a tela apropriada baseado no estado
  if (currentScreen === 'signup') {
    logger.debug('OnboardingContainer', 'Rendering signup screen');
    return (
      <OnboardingSignUp
        onSignUpComplete={handleSignUpComplete}
        onGoToSignIn={handleGoToSignIn}
      />
    );
  }

  if (currentScreen === 'signin') {
    logger.debug('OnboardingContainer', 'Rendering signin screen');
    return (
      <OnboardingSignIn
        onSignInComplete={handleSignInComplete}
        onGoToSignUp={handleGoToSignUp}
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
      onCreateAccount={handleCreateAccount}
      onLogin={handleLogin}
      onSignUpComplete={handleSignUpComplete}
      onSignInComplete={handleSignInComplete}
      onFinish={onFinish}
    />
  );
};
