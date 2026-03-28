import { crashReporter } from '@shared/utils/crashReporter';
import { logger } from '@shared/utils/logger';
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Enhanced error logging
    logger.error(
      'ErrorBoundary',
      '💥 React Error Boundary caught an error',
      {
        errorMessage: error.message,
        errorStack: error.stack,
        componentStack: errorInfo.componentStack,
        errorBoundaryStack: errorInfo.errorBoundaryStack,
        eventPhase: errorInfo.eventPhase,
      },
      error
    );

    // Report crash with context
    crashReporter.reportCrash(
      error, 
      'React Error Boundary', 
      true, // This is fatal for the component tree
      {
        componentStack: errorInfo.componentStack,
        errorBoundaryStack: errorInfo.errorBoundaryStack,
      }
    );

    // Store error info for display
    this.setState({ errorInfo });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    logger.info('ErrorBoundary', '🔄 Error boundary reset - attempting recovery');
    crashReporter.recordUserAction('Error Boundary Reset', { recovered: true });
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleShowDetails = () => {
    const { error, errorInfo } = this.state;
    if (error && errorInfo) {
      logger.info('ErrorBoundary', '🔍 User requested error details', {
        error: error.message,
        componentStack: errorInfo.componentStack,
      });
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <Text style={styles.title}>😵 Oops! Something went wrong</Text>
          
          <Text style={styles.message}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>

          {__DEV__ && this.state.errorInfo && (
            <View style={styles.debugSection}>
              <Text style={styles.debugTitle}>Debug Information:</Text>
              <ScrollView style={styles.debugScroll}>
                <Text style={styles.debugText}>
                  Stack: {this.state.error?.stack}
                </Text>
                <Text style={styles.debugText}>
                  Component Stack: {this.state.errorInfo.componentStack}
                </Text>
              </ScrollView>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={this.handleReset}>
              <Text style={styles.buttonText}>🔄 Try Again</Text>
            </TouchableOpacity>
            
            {__DEV__ && (
              <TouchableOpacity 
                style={[styles.button, styles.secondaryButton]} 
                onPress={this.handleShowDetails}
              >
                <Text style={styles.buttonText}>🔍 Show Details</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.helpText}>
            This error has been logged for debugging. If the problem persists, please contact support.
          </Text>
        </ScrollView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
    lineHeight: 22,
  },
  debugSection: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    maxHeight: 200,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  debugScroll: {
    maxHeight: 150,
  },
  debugText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#666',
    lineHeight: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  helpText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
