import { logger } from '../utils/logger';

/**
 * Hook simplificado para debugging - versão segura sem dependências complexas
 */
export function useSimpleLogger(componentName: string) {
  const logEvent = (event: string, data?: any) => {
    try {
      logger.info(componentName, event, data);
    } catch (error) {
      console.log(`[${componentName}] ${event}`, data);
    }
  };

  const logError = (error: Error | unknown, context?: string) => {
    try {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(componentName, `Error: ${context || 'Unknown'}`, { error: errorMessage });
      console.error(`[${componentName}] Error in ${context}:`, error);
    } catch (logError) {
      console.error(`[${componentName}] Failed to log error:`, error);
    }
  };

  return { logEvent, logError };
}

/**
 * Hook ainda mais simples para navegação - apenas logs básicos
 */
export function useSimpleNavLogger(screenName: string) {
  const logNavEvent = (event: string, data?: any) => {
    try {
      console.log(`📱 [${screenName}] ${event}`, data);
      logger.info(`${screenName}Screen`, event, data);
    } catch (error) {
      console.log(`📱 [${screenName}] ${event}`, data);
    }
  };

  const logNavError = (error: Error | unknown, context?: string) => {
    try {
      console.error(`📱 [${screenName}] Error:`, error);
      logger.error(`${screenName}Screen`, `Error: ${context}`, { 
        error: error instanceof Error ? error.message : String(error) 
      });
    } catch (logError) {
      console.error(`📱 [${screenName}] Failed to log error:`, error);
    }
  };

  return { logNavEvent, logNavError };
}