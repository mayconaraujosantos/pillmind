/**
 * Exportações de teste para o feature de onboarding
 * @description Este arquivo deve ser usado APENAS EM TESTES
 * Não importar este arquivo em código de produção
 */

// Re-export todas as constantes de teste
export {
  TEST_DATA,
  TEST_SCENARIOS,
  MOCK_USER,
  MOCK_AUTH_RESPONSE,
  TEST_ERROR_MESSAGES,
  TEST_TIMEOUTS,
  createTestData,
} from './__tests__/test-constants';

// Re-export tipos úteis para testes
export type { TestData, ErrorResponse, AuthResponse, User } from './types';
