/**
 * Constantes de teste para o feature de onboarding
 * @description Centraliza dados de teste seguros e consistentes
 */

import { TestData, AuthResponse, User } from '../types';

/**
 * Dados de teste seguros para usar em testes
 * @description Substitui hard-coded passwords por constantes seguras
 */
export const TEST_DATA: TestData = {
  email: 'test.user@pillmind.example.com',
  password: 'SecureTestPassword123!',
  name: 'Test User',
} as const;

/**
 * Múltiplos cenários de teste
 */
export const TEST_SCENARIOS = {
  VALID_USER: {
    email: 'valid.user@pillmind.example.com',
    password: 'ValidPassword123!',
    name: 'Valid Test User',
  },

  EXISTING_USER: {
    email: 'existing.user@pillmind.example.com',
    password: 'ExistingPassword123!',
    name: 'Existing User',
  },

  INVALID_EMAIL_USER: {
    email: 'invalid-email',
    password: 'ValidPassword123!',
    name: 'Invalid Email User',
  },

  WEAK_PASSWORD_USER: {
    email: 'weakpass.user@pillmind.example.com',
    password: '123',
    name: 'Weak Password User',
  },
} as const;

/**
 * Mock de usuário para testes
 */
export const MOCK_USER: User = {
  id: 'test-user-id-123',
  name: TEST_DATA.name,
  email: TEST_DATA.email,
  avatar: 'https://example.com/avatar.jpg',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
} as const;

/**
 * Mock de resposta de autenticação bem-sucedida
 */
export const MOCK_AUTH_RESPONSE: AuthResponse = {
  user: MOCK_USER,
  token: 'mock-jwt-token-for-testing',
  refreshToken: 'mock-refresh-token',
  expiresAt: '2024-12-31T23:59:59.000Z',
} as const;

/**
 * Mensagens de erro padronizadas para testes
 */
export const TEST_ERROR_MESSAGES = {
  EMAIL_EXISTS: 'Este email já está em uso',
  EMAIL_NOT_FOUND: 'Email não encontrado',
  INVALID_EMAIL: 'Formato de email inválido',
  WEAK_PASSWORD: 'Senha deve ter pelo menos 8 caracteres',
  NETWORK_ERROR: 'Erro de conexão. Tente novamente.',
  SERVER_ERROR: 'Erro interno do servidor',
  VALIDATION_ERROR: 'Dados inválidos fornecidos',
} as const;

/**
 * Timeouts para testes assíncronos
 */
export const TEST_TIMEOUTS = {
  FAST: 100,
  NORMAL: 500,
  SLOW: 2000,
  VERY_SLOW: 5000,
} as const;

/**
 * Função helper para criar dados de teste customizados
 */
export const createTestData = (overrides?: Partial<TestData>): TestData => ({
  ...TEST_DATA,
  ...overrides,
});
