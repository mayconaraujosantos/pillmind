import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '@shared/utils/logger';

const ONBOARDING_STORAGE_KEY = '@pillmind:has_seen_onboarding';

export const useOnboardingStorage = () => {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOnboardingStatus();
  }, []);

  const loadOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
      const hasSeen = value === 'true';
      logger.debug(
        'useOnboardingStorage',
        `Loaded onboarding status: ${hasSeen}`,
        { value }
      );
      setHasSeenOnboarding(hasSeen);
    } catch (error) {
      logger.error('useOnboardingStorage', 'Error loading onboarding status', {
        error: error instanceof Error ? error.message : String(error),
      });
      console.warn('Error loading onboarding status:', error);
      setHasSeenOnboarding(false);
    } finally {
      setIsLoading(false);
    }
  };

  const markOnboardingAsSeen = async () => {
    try {
      logger.info('useOnboardingStorage', 'Marking onboarding as seen');
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
      setHasSeenOnboarding(true);
      logger.info('useOnboardingStorage', '✅ Onboarding marked as seen');
    } catch (error) {
      logger.error('useOnboardingStorage', 'Error saving onboarding status', {
        error: error instanceof Error ? error.message : String(error),
      });
      console.warn('Error saving onboarding status:', error);
    }
  };

  const resetOnboarding = async () => {
    try {
      logger.info('useOnboardingStorage', 'Resetting onboarding');
      await AsyncStorage.removeItem(ONBOARDING_STORAGE_KEY);
      setHasSeenOnboarding(false);
      logger.info('useOnboardingStorage', '✅ Onboarding reset');
    } catch (error) {
      logger.error(
        'useOnboardingStorage',
        'Error resetting onboarding status',
        {
          error: error instanceof Error ? error.message : String(error),
        }
      );
      console.warn('Error resetting onboarding status:', error);
    }
  };

  return {
    hasSeenOnboarding,
    isLoading,
    markOnboardingAsSeen: markOnboardingAsSeen,
    resetOnboarding,
  };
};
