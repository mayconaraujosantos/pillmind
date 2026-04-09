import { logger } from '../utils/logger';

function toLogData(data: unknown): Record<string, unknown> | undefined {
  if (data === undefined) return undefined;
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    return data as Record<string, unknown>;
  }
  return { value: data };
}

/**
 * Hook simplificado para debugging - versão segura sem dependências complexas
 */
export function useSimpleLogger(componentName: string) {
  const logEvent = (event: string, data?: unknown) => {
    try {
      logger.info(componentName, event, toLogData(data));
    } catch {
      console.log(`[${componentName}] ${event}`, data);
    }
  };

  const logError = (error: Error | unknown, context?: string) => {
    try {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error(componentName, `Error: ${context || 'Unknown'}`, {
        error: errorMessage,
      });
      console.error(`[${componentName}] Error in ${context}:`, error);
    } catch {
      console.error(`[${componentName}] Failed to log error:`, error);
    }
  };

  return { logEvent, logError };
}

/**
 * Hook ainda mais simples para navegação - apenas logs básicos
 */
export function useSimpleNavLogger(screenName: string) {
  const logNavEvent = (event: string, data?: unknown) => {
    try {
      console.log(`📱 [${screenName}] ${event}`, data);
      logger.info(`${screenName}Screen`, event, toLogData(data));
    } catch {
      console.log(`📱 [${screenName}] ${event}`, data);
    }
  };

  const logNavError = (error: Error | unknown, context?: string) => {
    try {
      console.error(`📱 [${screenName}] Error:`, error);
      logger.error(`${screenName}Screen`, `Error: ${context}`, {
        error: error instanceof Error ? error.message : String(error),
      });
    } catch {
      console.error(`📱 [${screenName}] Failed to log error:`, error);
    }
  };

  return { logNavEvent, logNavError };
}
