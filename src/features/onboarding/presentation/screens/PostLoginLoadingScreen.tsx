import React, { useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { ScreenWrapper, Loader } from '@shared/components';
import { usePostLoginPreparation } from '../hooks/usePostLoginPreparation';
import { useAuthContext } from '../contexts/AuthContext';
import { useTheme } from '@shared/theme';
import { logger } from '@shared/utils/logger';

interface PostLoginLoadingScreenProps {
  onComplete: () => void;
}

/**
 * Post-login loading screen
 *
 * Shows a professional loading experience after successful login.
 * Prepares user session data before navigating to home.
 *
 * Best practices:
 * - Clear feedback to user
 * - Progress indication
 * - Error handling with retry
 * - Smooth transitions
 */
export const PostLoginLoadingScreen: React.FC<PostLoginLoadingScreenProps> = ({
  onComplete,
}) => {
  const { theme } = useTheme();
  const authContext = useAuthContext();
  const { isPreparing, error, progress, retry } = usePostLoginPreparation();
  const hasCompletedRef = useRef(false);
  const errorShownRef = useRef<string | null>(null);

  // Stable callbacks using useCallback to prevent effect re-runs
  const stableOnComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  // If user is not authenticated, navigate to completion immediately
  // This handles edge cases where user navigates here without being logged in
  useEffect(() => {
    if (!authContext.isAuthenticated && !hasCompletedRef.current) {
      logger.warn(
        'PostLoginLoadingScreen',
        'User not authenticated, navigating to completion'
      );
      hasCompletedRef.current = true;
      stableOnComplete();
    }
  }, [authContext.isAuthenticated, stableOnComplete]);

  useEffect(() => {
    if (!isPreparing && !error && !hasCompletedRef.current) {
      logger.info(
        'PostLoginLoadingScreen',
        '✅ Preparation complete, navigating to home'
      );
      hasCompletedRef.current = true;
      // Minimal delay for instant transition (50ms for smooth feel)
      const timer = setTimeout(() => {
        stableOnComplete();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isPreparing, error, stableOnComplete]);

  useEffect(() => {
    // Only show alert if error exists, is different from last shown error, and hasn't been shown yet
    if (error && error !== errorShownRef.current) {
      logger.error('PostLoginLoadingScreen', '❌ Preparation error', { error });
      errorShownRef.current = error;

      Alert.alert(
        'Loading Error',
        error,
        [
          {
            text: 'Retry',
            onPress: () => {
              logger.info('PostLoginLoadingScreen', '🔄 Retrying preparation');
              errorShownRef.current = null; // Reset to allow showing again on new error
              // Call the retry function from the hook to actually retry preparation
              retry();
            },
          },
          {
            text: 'Continue Anyway',
            style: 'cancel',
            onPress: () => {
              logger.warn(
                'PostLoginLoadingScreen',
                '⚠️ Continuing despite error'
              );
              stableOnComplete();
            },
          },
        ],
        { cancelable: false }
      );
    } else if (!error) {
      // Reset error tracking when error clears
      errorShownRef.current = null;
    }
  }, [error, retry, stableOnComplete]);

  return (
    <ScreenWrapper>
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Loader
          variant="fullscreen"
          size="large"
          message={
            progress < 25
              ? 'Preparing your session...'
              : progress < 50
              ? 'Loading your preferences...'
              : progress < 75
              ? 'Setting up your account...'
              : progress < 100
              ? 'Almost ready!'
              : 'Ready!'
          }
          testID="post-login-loader"
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
