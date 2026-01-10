import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { ScreenWrapper, Loader } from '@shared/components';
import { usePostLoginPreparation } from '../hooks/usePostLoginPreparation';
import { useAuthContext } from '../contexts/AuthContext';
import { useTheme } from '@shared/theme';
import { logger } from '@shared/utils/logger';

interface PostLoginLoadingScreenProps {
  onComplete: () => void;
  onError?: (error: string) => void;
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
  onError,
}) => {
  const { theme } = useTheme();
  const authContext = useAuthContext();
  const { isPreparing, error, progress } = usePostLoginPreparation();
  const hasCompletedRef = useRef(false);

  // If user is not authenticated, navigate to completion immediately
  // This handles edge cases where user navigates here without being logged in
  useEffect(() => {
    if (!authContext.isAuthenticated && !hasCompletedRef.current) {
      logger.warn(
        'PostLoginLoadingScreen',
        'User not authenticated, navigating to completion'
      );
      hasCompletedRef.current = true;
      onComplete();
    }
  }, [authContext.isAuthenticated, onComplete]);

  useEffect(() => {
    if (!isPreparing && !error && !hasCompletedRef.current) {
      logger.info(
        'PostLoginLoadingScreen',
        '✅ Preparation complete, navigating to home'
      );
      hasCompletedRef.current = true;
      // Minimal delay for instant transition (50ms for smooth feel)
      const timer = setTimeout(() => {
        onComplete();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isPreparing, error, onComplete]);

  useEffect(() => {
    if (error) {
      logger.error('PostLoginLoadingScreen', '❌ Preparation error', { error });

      Alert.alert(
        'Loading Error',
        error,
        [
          {
            text: 'Retry',
            onPress: () => {
              logger.info('PostLoginLoadingScreen', '🔄 Retrying preparation');
              // Retry by reloading the component or calling onError
              onError?.(error);
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
              onComplete();
            },
          },
        ],
        { cancelable: false }
      );
    }
  }, [error, onError, onComplete]);

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
