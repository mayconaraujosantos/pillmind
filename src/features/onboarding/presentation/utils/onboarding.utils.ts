/**
 * Utilitários profissionais para o feature de onboarding
 * @description Funções auxiliares para retry, error handling, validação e outras operações comuns
 */

import { ERROR_CODES, TIMING_CONSTANTS, VALIDATION_CONSTANTS } from '../constants/storage.constants';
import { ErrorResponse } from '../types';

/**
 * Executa uma operação com retry automático
 * @param operation - Função assíncrona para executar
 * @param maxRetries - Número máximo de tentativas (padrão: 3)
 * @param delay - Delay entre tentativas em ms (padrão: 2000)
 * @param backoff - Tipo de backoff: 'linear' | 'exponential' (padrão: 'exponential')
 * @returns Resultado da operação ou lança erro após esgotar tentativas
 */
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = TIMING_CONSTANTS.RETRY_DELAY,
  backoff: 'linear' | 'exponential' = 'exponential'
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      const waitTime = backoff === 'exponential' 
        ? delay * Math.pow(2, attempt - 1) 
        : delay * attempt;
        
      await sleep(waitTime);
    }
  }
  
  throw lastError!;
};

/**
 * Sleep utility para aguardar tempo específico
 */
export const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Cria um ErrorResponse estruturado
 */
export const createError = (
  code: keyof typeof ERROR_CODES,
  message: string,
  details?: Record<string, unknown>,
  retryable: boolean = false
): ErrorResponse => ({
  code,
  message,
  details,
  retryable
});

/**
 * Verifica se um erro é retryable
 */
export const isRetryableError = (error: ErrorResponse): boolean => {
  const retryableCodes = [
    ERROR_CODES.NETWORK_ERROR,
    ERROR_CODES.TIMEOUT_ERROR,
    ERROR_CODES.SERVER_ERROR
  ];
  
  return error.retryable || retryableCodes.includes(error.code);
};

/**
 * Validação de email
 */
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email.trim()) {
    return { isValid: false, error: 'Email é obrigatório' };
  }
  
  if (!VALIDATION_CONSTANTS.EMAIL_REGEX.test(email)) {
    return { isValid: false, error: 'Formato de email inválido' };
  }
  
  return { isValid: true };
};

/**
 * Validação de senha
 */
export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password) {
    return { isValid: false, error: 'Senha é obrigatória' };
  }
  
  if (password.length < VALIDATION_CONSTANTS.MIN_PASSWORD_LENGTH) {
    return { 
      isValid: false, 
      error: `Senha deve ter pelo menos ${VALIDATION_CONSTANTS.MIN_PASSWORD_LENGTH} caracteres` 
    };
  }
  
  if (password.length > VALIDATION_CONSTANTS.MAX_PASSWORD_LENGTH) {
    return { 
      isValid: false, 
      error: `Senha deve ter no máximo ${VALIDATION_CONSTANTS.MAX_PASSWORD_LENGTH} caracteres` 
    };
  }
  
  return { isValid: true };
};

/**
 * Validação de nome
 */
export const validateName = (name: string): { isValid: boolean; error?: string } => {
  if (!name.trim()) {
    return { isValid: false, error: 'Nome é obrigatório' };
  }
  
  if (name.length > VALIDATION_CONSTANTS.MAX_NAME_LENGTH) {
    return { 
      isValid: false, 
      error: `Nome deve ter no máximo ${VALIDATION_CONSTANTS.MAX_NAME_LENGTH} caracteres` 
    };
  }
  
  return { isValid: true };
};

/**
 * Validação completa de formulário de registro
 */
export const validateSignUpForm = (data: { email: string; password: string; name: string }) => {
  const errors: Record<string, string> = {};
  
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error!;
  }
  
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error!;
  }
  
  const nameValidation = validateName(data.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error!;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validação completa de formulário de login
 */
export const validateSignInForm = (data: { email: string; password: string }) => {
  const errors: Record<string, string> = {};
  
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error!;
  }
  
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error!;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Debounce function para validação em tempo real
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Format error message for user display
 */
export const formatErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  
  return 'Ocorreu um erro inesperado';
};

/**
 * Timeout wrapper para operações
 */
export const withTimeout = <T>(
  operation: () => Promise<T>,
  timeoutMs: number = TIMING_CONSTANTS.AUTH_TIMEOUT
): Promise<T> => {
  return Promise.race([
    operation(),
    new Promise<never>((_, reject) => 
      setTimeout(() => reject(createError(
        'TIMEOUT_ERROR',
        'Operação expirou. Tente novamente.',
        { timeout: timeoutMs },
        true
      )), timeoutMs)
    )
  ]);
};