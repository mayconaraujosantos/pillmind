import { Platform } from 'react-native';
import { logger } from './logger';

interface DeviceInfo {
  platform: string;
  version: string;
  model?: string;
}

interface CrashReport {
  timestamp: string;
  error: Error;
  context: string;
  deviceInfo: DeviceInfo;
  userActions: string[];
  appState: Record<string, any>;
}

class CrashReporter {
  private userActions: string[] = [];
  private maxActionHistory = 20;
  private deviceInfo: DeviceInfo;

  constructor() {
    this.deviceInfo = {
      platform: Platform.OS,
      version: Platform.Version?.toString() || 'unknown',
    };

    // Setup global error handlers safely
    this.setupGlobalErrorHandlers();
  }

  private setupGlobalErrorHandlers() {
    try {
      // Handle JavaScript errors - check if ErrorUtils exists
      if (typeof ErrorUtils !== 'undefined') {
        const defaultErrorHandler = ErrorUtils.getGlobalHandler();
        ErrorUtils.setGlobalHandler((error, isFatal) => {
          this.reportCrash(error, 'Global JavaScript Error', isFatal);
          if (defaultErrorHandler) {
            defaultErrorHandler(error, isFatal);
          }
        });
      }

      // Handle unhandled promise rejections - safer approach
      if (typeof global !== 'undefined') {
        const originalHandler = global.Promise;
        if (originalHandler) {
          // Add a simple unhandled rejection handler
          global.addEventListener?.('unhandledrejection', (event: PromiseRejectionEvent) => {
            const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
            this.reportCrash(error, 'Unhandled Promise Rejection');
          });
        }
      }
    } catch (setupError) {
      // If setup fails, just log it and continue - don't crash the app
      logger.warn('CrashReporter', 'Failed to setup global error handlers', {
        error: setupError instanceof Error ? setupError.message : String(setupError)
      });
    }
  }

  recordUserAction(action: string, details?: Record<string, any>) {
    const actionEntry = `${new Date().toISOString()}: ${action}${
      details ? ` - ${JSON.stringify(details)}` : ''
    }`;

    this.userActions.push(actionEntry);
    
    if (this.userActions.length > this.maxActionHistory) {
      this.userActions.shift();
    }

    logger.debug('CrashReporter', `User action: ${action}`, details);
  }

  reportCrash(
    error: Error, 
    context: string, 
    isFatal: boolean = false,
    appState?: Record<string, any>
  ) {
    const crashReport: CrashReport = {
      timestamp: new Date().toISOString(),
      error,
      context,
      deviceInfo: this.deviceInfo,
      userActions: [...this.userActions],
      appState: appState || {},
    };

    logger.error(
      'CrashReporter',
      `💥 ${isFatal ? 'FATAL' : 'NON-FATAL'} CRASH: ${context}`,
      {
        errorMessage: error.message,
        errorStack: error.stack,
        deviceInfo: this.deviceInfo,
        userActions: this.userActions,
        appState,
        isFatal,
      },
      error
    );

    // In production, you could send this to a crash reporting service
    // like Bugsnag, Sentry, or Firebase Crashlytics
    if (__DEV__) {
      console.group('🚨 CRASH REPORT');
      console.error('Error:', error);
      console.log('Context:', context);
      console.log('Device Info:', this.deviceInfo);
      console.log('Recent User Actions:', this.userActions);
      console.log('App State:', appState);
      console.groupEnd();
    }

    return crashReport;
  }

  getRecentActions(): string[] {
    return [...this.userActions];
  }

  clearActionHistory() {
    this.userActions = [];
    logger.info('CrashReporter', 'Action history cleared');
  }

  // Record navigation events
  recordNavigation(from: string, to: string, params?: any) {
    this.recordUserAction(`Navigation: ${from} → ${to}`, { params });
  }

  // Record component lifecycle events
  recordComponentEvent(componentName: string, event: string, details?: any) {
    this.recordUserAction(`${componentName}: ${event}`, details);
  }

  // Record API calls
  recordApiCall(endpoint: string, method: string, success: boolean) {
    this.recordUserAction(`API ${method} ${endpoint}`, { success });
  }
}

export const crashReporter = new CrashReporter();