import React, { ComponentType, useCallback, useEffect } from 'react';
import { crashReporter } from '../utils/crashReporter';
import { logger } from '../utils/logger';

interface WithErrorTrackingProps {
  componentName?: string;
}

/**
 * HOC que adiciona tracking de erros automático aos componentes
 */
export function withErrorTracking<P extends object>(
  WrappedComponent: ComponentType<P>,
  componentName?: string
) {
  const displayName = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component';
  
  const TrackedComponent: React.FC<P & WithErrorTrackingProps> = (props) => {
    useEffect(() => {
      // Log component mount
      logger.debug('ComponentLifecycle', `🔧 ${displayName} mounted`);
      crashReporter.recordComponentEvent(displayName, 'mounted');

      return () => {
        // Log component unmount
        logger.debug('ComponentLifecycle', `🔧 ${displayName} unmounted`);
        crashReporter.recordComponentEvent(displayName, 'unmounted');
      };
    }, []);

    try {
      return <WrappedComponent {...props} />;
    } catch (error) {
      const errorInstance = error instanceof Error ? error : new Error(String(error));
      
      logger.error(
        'ComponentError',
        `💥 Error in ${displayName}`,
        { componentName: displayName },
        errorInstance
      );

      crashReporter.reportCrash(errorInstance, `Component Error - ${displayName}`, false);

      // Re-throw to let ErrorBoundary handle it
      throw error;
    }
  };

  TrackedComponent.displayName = `withErrorTracking(${displayName})`;
  return TrackedComponent;
}

/**
 * Hook para tracking manual de eventos em componentes
 */
export function useComponentTracker(componentName: string) {
  useEffect(() => {
    try {
      logger.debug('ComponentLifecycle', `🔧 ${componentName} mounted`);
      crashReporter.recordUserAction(`${componentName}: mounted`);
    } catch (error) {
      // Silent fail for mount tracking
    }

    return () => {
      try {
        logger.debug('ComponentLifecycle', `🔧 ${componentName} unmounted`);
        crashReporter.recordUserAction(`${componentName}: unmounted`);
      } catch (error) {
        // Silent fail for unmount tracking
      }
    };
  }, [componentName]);

  const trackEvent = useCallback((eventName: string, data?: Record<string, any>) => {
    try {
      logger.info(componentName, eventName, data);
      crashReporter.recordUserAction(`${componentName}: ${eventName}`, data);
    } catch (error) {
      // Silent fail for event tracking
    }
  }, [componentName]);

  const trackError = useCallback((error: Error, context?: string) => {
    try {
      logger.error(componentName, `Error: ${context}`, { error: error.message }, error);
      crashReporter.reportCrash(error, `${componentName} - ${context}`, false);
    } catch (reportError) {
      // Silent fail for error tracking
    }
  }, [componentName]);

  return { trackEvent, trackError };
}