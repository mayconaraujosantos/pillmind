import { ErrorBoundary } from '@shared/components/ErrorBoundary';
import { logger } from '@shared/utils/logger';
import React from 'react';
import type { ErrorInfo } from 'react';
import { MedicineFormScreen } from './MedicineFormScreen';

const MedicineFormScreenWithErrorBoundary: React.FC = () => {
  console.log('🔧 MedicineFormScreenWrapper: Component mounting...');

  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    console.group('💥 CRASH CAPTURADO NO ERROR BOUNDARY!');
    console.error('Error Object:', error);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    console.error('Component Stack:', errorInfo.componentStack);
    console.groupEnd();

    logger.error(
      'MedicineFormErrorBoundary',
      '💥 MedicineForm crashed',
      {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      },
      error
    );
  };

  console.log('🔧 Using FULL version');

  return (
    <ErrorBoundary onError={handleError}>
      <MedicineFormScreen />
    </ErrorBoundary>
  );
};

export { MedicineFormScreenWithErrorBoundary as MedicineFormScreen };
