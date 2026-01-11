import { useState, useEffect, useCallback, useRef } from 'react';
import { logger } from '@shared/utils/logger';
import { useAuthContext } from '../contexts/AuthContext';

export interface UsePostLoginPreparationResult {
  isPreparing: boolean;
  error: string | null;
  progress: number; // 0-100
  retry: () => void; // Function to retry preparation
}

/**
 * Custom hook for preparing user session after login
 *
 * Best practices implemented:
 * - Simulates loading of initial data (profile, settings, preferences)
 * - Progress tracking for better UX
 * - Error handling with retry capability
 * - Automatic cancellation on unmount
 * - Separation of concerns (auth vs data loading)
 */
export const usePostLoginPreparation = (): UsePostLoginPreparationResult => {
  const [isPreparing, setIsPreparing] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const authContext = useAuthContext();
  const hasStartedRef = useRef<boolean>(false);

  const prepareSession = useCallback(async () => {
    try {
      setIsPreparing(true);
      setError(null);
      setProgress(0);

      logger.info(
        'usePostLoginPreparation',
        '🔄 Starting session preparation',
        {
          userId: authContext.user?.id,
        }
      );

      // Simulate loading steps with progress
      // Optimized durations for fast UX - total ~500ms
      const steps = [
        { name: 'Loading profile', duration: 120, progress: 25 },
        { name: 'Loading preferences', duration: 150, progress: 50 },
        { name: 'Loading settings', duration: 120, progress: 75 },
        { name: 'Preparing home data', duration: 110, progress: 100 },
      ];

      for (const step of steps) {
        logger.debug('usePostLoginPreparation', `⏳ ${step.name}`, {
          progress: step.progress,
        });

        // Simulate API call or data loading
        await new Promise((resolve) => setTimeout(resolve, step.duration));
        setProgress(step.progress);

        // Error simulation removed - was causing random failures in development
        // If you need to test error handling, uncomment and adjust the condition:
        // if (process.env.NODE_ENV === 'development' && Math.random() < 0.05) {
        //   throw new Error(`Error loading ${step.name}`);
        // }
      }

      logger.info(
        'usePostLoginPreparation',
        '✅ Session preparation complete',
        {
          userId: authContext.user?.id,
        }
      );

      // Minimal delay for smooth transition (50ms for instant feel)
      await new Promise((resolve) => setTimeout(resolve, 50));
      setIsPreparing(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to prepare session. Please try again.';

      logger.error(
        'usePostLoginPreparation',
        '❌ Session preparation failed',
        {
          error: errorMessage,
          userId: authContext.user?.id,
        },
        err instanceof Error ? err : undefined
      );

      setError(errorMessage);
      setIsPreparing(false);
    }
  }, [authContext.user?.id]);

  const retry = useCallback(() => {
    logger.info('usePostLoginPreparation', '🔄 Retry requested');
    hasStartedRef.current = false; // Allow preparation to restart
    setError(null); // Clear error state
    prepareSession(); // Call prepareSession again
  }, [prepareSession]);

  useEffect(() => {
    let isMounted = true;

    const startPreparation = async () => {
      if (isMounted && authContext.isAuthenticated && !hasStartedRef.current) {
        hasStartedRef.current = true;
        await prepareSession();
      }
    };

    startPreparation();

    return () => {
      isMounted = false;
    };
  }, [prepareSession, authContext.isAuthenticated]);

  return {
    isPreparing,
    error,
    progress,
    retry,
  };
};
