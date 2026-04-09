/**
 * Constantes de armazenamento para o feature de onboarding
 * @description Centraliza todas as chaves de armazenamento utilizadas no onboarding
 */

export const STORAGE_KEYS = {
  /** Chave para controlar se o usuário já viu o onboarding */
  ONBOARDING_SEEN: '@pillmind:has_seen_onboarding',

  /** Chave para dados de autenticação do usuário */
  AUTH_DATA: '@pillmind_auth',

  /** Chave para preferência de idioma do usuário */
  LANGUAGE_PREFERENCE: '@pillmind:language',

  /** Chave para token de autenticação */
  AUTH_TOKEN: '@pillmind:auth_token',

  /** Chave para dados do usuário */
  USER_DATA: '@pillmind:user_data',
} as const;

/**
 * Constantes de tempo (em milissegundos)
 */
export const TIMING_CONSTANTS = {
  /** Tempo de debounce para validação de campos */
  VALIDATION_DEBOUNCE: 300,

  /** Tempo de timeout para requisições de autenticação */
  AUTH_TIMEOUT: 30000,

  /** Tempo de loading mínimo para feedback visual */
  MIN_LOADING_TIME: 1000,

  /** Tempo de delay entre tentativas de retry */
  RETRY_DELAY: 2000,
} as const;

/**
 * Constantes de validação
 */
export const VALIDATION_CONSTANTS = {
  /** Tamanho mínimo da senha */
  MIN_PASSWORD_LENGTH: 8,

  /** Tamanho máximo da senha */
  MAX_PASSWORD_LENGTH: 128,

  /** Tamanho máximo do nome */
  MAX_NAME_LENGTH: 100,

  /** Regex para validação de email */
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

/**
 * Constantes de erro
 */
export const ERROR_CODES = {
  EMAIL_EXISTS: 'EMAIL_EXISTS',
  EMAIL_NOT_FOUND: 'EMAIL_NOT_FOUND',
  INVALID_EMAIL: 'INVALID_EMAIL',
  WEAK_PASSWORD: 'WEAK_PASSWORD',
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;
