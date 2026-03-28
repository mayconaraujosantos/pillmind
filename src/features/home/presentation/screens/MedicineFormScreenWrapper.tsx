import { ErrorBoundary } from '@shared/components/ErrorBoundary';
import { logger } from '@shared/utils/logger';
import React from 'react';
import { MedicineFormScreen } from './MedicineFormScreen';
import { MedicineFormScreenBridge } from './MedicineFormScreenBridge';
import { MedicineFormScreenDebug } from './MedicineFormScreenDebug';
import { MedicineFormScreenFixed } from './MedicineFormScreenFixed';
import { MedicineFormScreenFixing } from './MedicineFormScreenFixing';
import { MedicineFormScreenSimple } from './MedicineFormScreenSimple';
import { MedicineFormScreenTest1 } from './MedicineFormScreenTest1';
import { MedicineFormScreenTest2 } from './MedicineFormScreenTest2';
import { MedicineFormScreenVectorIcons } from './MedicineFormScreenVectorIcons';
const MedicineFormScreenWithErrorBoundary: React.FC = () => {
  console.log('🔧 MedicineFormScreenWrapper: Component mounting...');
  
  const handleError = (error: Error, errorInfo: any) => {
    console.group('💥 CRASH CAPTURADO NO ERROR BOUNDARY!');
    console.error('Error Object:', error);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    console.error('Component Stack:', errorInfo.componentStack);
    console.groupEnd();
    
    logger.error('MedicineFormErrorBoundary', '💥 MedicineForm crashed', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    }, error);
  };

  // Usando tela COMPLETA original com HealthIcons substituídos por Vector Icons! 💊
  const useVersion: 'simple' | 'debug' | 'fixing' | 'test1' | 'test2' | 'bridge' | 'fixed' | 'vector-icons' | 'full' = 'full';
  
  console.log(`🔧 Using ${useVersion.toUpperCase()} version`);

  const renderScreen = () => {
    switch (useVersion) {
      case 'simple':
        return <MedicineFormScreenSimple />;
      case 'debug':
        return <MedicineFormScreenDebug />;
      case 'fixing':
        return <MedicineFormScreenFixing />;
      case 'test1':
        return <MedicineFormScreenTest1 />;
      case 'test2':
        return <MedicineFormScreenTest2 />;
      case 'bridge':
        return <MedicineFormScreenBridge />;
      case 'fixed':
        return <MedicineFormScreenFixed />;
      case 'vector-icons':
        return <MedicineFormScreenVectorIcons />;
      case 'full':
      default:
        return <MedicineFormScreen />;
    }
  };

  return (
    <ErrorBoundary onError={handleError}>
      {renderScreen()}
    </ErrorBoundary>
  );
};

export { MedicineFormScreenWithErrorBoundary as MedicineFormScreen };
