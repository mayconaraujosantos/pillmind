import { useLocalSearchParams, useNavigation, usePathname } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';
import { crashReporter } from '../utils/crashReporter';
import { logger } from '../utils/logger';

interface NavigationLoggerProps {
  screenName: string;
  additionalData?: Record<string, unknown>;
}

/**
 * Hook para logging automático de navegação
 */
export function useNavigationLogger({
  screenName,
  additionalData,
}: NavigationLoggerProps) {
  const navigation = useNavigation();
  const pathname = usePathname();
  const params = useLocalSearchParams();
  const screenStartTime = useRef<number>(Date.now());
  const previousScreenRef = useRef<string>('');

  useEffect(() => {
    try {
      const startTime = Date.now();
      screenStartTime.current = startTime;

      // Log screen entry
      logger.info('Navigation', `📱 Entered screen: ${screenName}`, {
        routeName: pathname,
        routeParams: params,
        additionalData,
        timestamp: new Date().toISOString(),
      });

      // Record for crash reporting safely
      try {
        crashReporter.recordUserAction(
          `Navigation: ${previousScreenRef.current || 'Unknown'} → ${screenName}`,
          {
            params,
          }
        );
      } catch (crashError) {
        // Don't let crash reporter crash the app
        logger.warn(
          'NavigationLogger',
          'Failed to record navigation for crash reporter',
          {
            error:
              crashError instanceof Error
                ? crashError.message
                : String(crashError),
          }
        );
      }

      // Setup navigation state listener
      const unsubscribe = navigation.addListener('state', (e) => {
        try {
          logger.debug('Navigation', 'Navigation state changed', {
            currentScreen: screenName,
            state: e.data?.state,
          });
        } catch {
          // Silent fail for state listener
        }
      });

      return () => {
        try {
          const timeSpent = Date.now() - startTime;

          // Log screen exit
          logger.info('Navigation', `📱 Exited screen: ${screenName}`, {
            timeSpent,
            routeName: pathname,
          });

          previousScreenRef.current = screenName;
          unsubscribe();
        } catch {
          // Silent fail for cleanup
        }
      };
    } catch (mainError) {
      logger.error(
        'NavigationLogger',
        'Critical error in navigation logger',
        {},
        mainError instanceof Error ? mainError : new Error(String(mainError))
      );
    }
  }, [screenName, pathname, params, additionalData, navigation]);

  // Return stable functions to log custom events within the screen
  const logScreenEvent = useCallback(
    (event: string, data?: Record<string, unknown>) => {
      try {
        logger.info(`${screenName}Screen`, event, data);
        crashReporter.recordUserAction(`${screenName}: ${event}`, data);
      } catch {
        // Silent fail for logging
      }
    },
    [screenName]
  );

  const logError = useCallback(
    (error: Error, context?: string) => {
      try {
        logger.error(
          `${screenName}Screen`,
          `Error: ${context || 'Unknown context'}`,
          {
            error: error.message,
            stack: error.stack,
          },
          error
        );
        crashReporter.reportCrash(error, `${screenName} - ${context}`, false);
      } catch {
        // Silent fail for error reporting
      }
    },
    [screenName]
  );

  return {
    logScreenEvent,
    logError,
  };
}
