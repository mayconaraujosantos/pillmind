/**
 * Tipos centralizados para o feature de onboarding
 * @description Define todas as interfaces, tipos e enums utilizados no onboarding
 */

import { ERROR_CODES } from './presentation/constants/storage.constants';

/**
 * Fases do processo de onboarding
 */
export type OnboardingPhase =
  | 'carousel'
  | 'auth'
  | 'postLoginLoading'
  | 'success';

/**
 * Métodos de autenticação disponíveis
 */
export type AuthMethod = 'email' | 'google' | 'apple';

/**
 * Tipos de ações de autenticação
 */
export type AuthAction = 'signUp' | 'signIn';

/**
 * Status de loading para diferentes componentes
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Estrutura de resposta de erro
 */
export interface ErrorResponse {
  code: keyof typeof ERROR_CODES;
  message: string;
  details?: Record<string, unknown>;
  retryable?: boolean;
}

/**
 * Estrutura de dados do usuário
 */
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Estrutura de resposta de autenticação bem-sucedida
 */
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresAt?: string;
}

/**
 * Dados para registro de usuário
 */
export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

/**
 * Dados para login de usuário
 */
export interface SignInRequest {
  email: string;
  password: string;
}

/**
 * Resultado de operação de autenticação
 */
export interface AuthResult {
  success: boolean;
  data?: AuthResponse;
  error?: ErrorResponse;
}

/**
 * Estado do carousel de onboarding
 */
export interface CarouselState {
  currentStep: number;
  totalSteps: number;
  progress: number;
  completed: boolean;
}

/**
 * Estado da autenticação em tempo real
 */
export interface AuthState {
  phase: OnboardingPhase;
  method?: AuthMethod;
  action?: AuthAction;
  loading: boolean;
  error?: string;
  user?: User;
  token?: string;
}

/**
 * Estado do pós-login (preparação)
 */
export interface PostLoginState {
  preparing: boolean;
  progress: number;
  currentTask?: string;
  error?: string;
  completed: boolean;
}

/**
 * Estado completo do onboarding
 */
export interface OnboardingState {
  carousel: CarouselState;
  auth: AuthState;
  postLogin: PostLoginState;
  hasSeenOnboarding: boolean;
}

/**
 * Props para componentes de onboarding
 */
export interface OnboardingStepProps {
  onNext?: () => void;
  onSkip?: () => void;
  onBack?: () => void;
  currentStep: number;
  totalSteps: number;
  isLoading?: boolean;
}

/**
 * Configuração de validação de campo
 */
export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: string) => string | null;
}

/**
 * Estado de validação de formulário
 */
export interface FormValidationState {
  isValid: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

/**
 * Dados de teste para desenvolvimento
 */
export interface TestData {
  readonly email: string;
  readonly password: string;
  readonly name: string;
}

/**
 * Configurações de retry para operações
 */
export interface RetryConfig {
  maxAttempts: number;
  delay: number;
  backoff: 'linear' | 'exponential';
  retryableErrors: string[];
}
