/**
 * Testes de integração para o fluxo completo de onboarding
 * @description Testa o fluxo end-to-end do onboarding: carousel → auth → post-login → success
 */

import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { OnboardingContainer } from '../../presentation/screens/OnboardingContainer';
import { AuthProvider } from '../../presentation/contexts/AuthContext';
import { authService } from '../../domain/services/auth.service';
import { 
  TEST_DATA, 
  MOCK_AUTH_RESPONSE, 
  TEST_ERROR_MESSAGES,
  TEST_TIMEOUTS 
} from '../test-constants';
import { STORAGE_KEYS } from '../../presentation/constants/storage.constants';

// Mocks necessários
jest.mock('@shared/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(), 
    debug: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../../domain/services/auth.service');
jest.mock('../../domain services/oauth.service');

const mockAuthService = authService as jest.Mocked<typeof authService>;

/**
 * Wrapper para renderizar OnboardingContainer com providers necessários
 */
const renderOnboardingWithProviders = () => {
  return render(
    <AuthProvider>
      <OnboardingContainer />
    </AuthProvider>
  );
};

/**
 * Helper para simular navegação através do carousel
 */
const navigateCarousel = async (getByTestId: any) => {
  // Passo 0 → 1
  const nextButton0 = getByTestId('onboarding-next-button');
  fireEvent.press(nextButton0);
  
  // Passo 1 → 2  
  await waitFor(() => {
    expect(getByTestId('onboarding-step-indicator-1')).toBeDefined();
  });
  
  const nextButton1 = getByTestId('onboarding-next-button');
  fireEvent.press(nextButton1);
  
  // Passo 2 → Auth
  await waitFor(() => {
    expect(getByTestId('onboarding-step-indicator-2')).toBeDefined();
  });
  
  const getStartedButton = getByTestId('onboarding-get-started-button');
  fireEvent.press(getStartedButton);
};

/**
 * Helper para preencher formulário de registro
 */
const fillSignUpForm = async (getByTestId: any, getByPlaceholderText: any) => {
  await waitFor(() => {
    expect(getByTestId('onboarding-auth-form')).toBeDefined();
  });
  
  // Preencher formulário
  const nameInput = getByPlaceholderText('Digite seu nome completo');
  const emailInput = getByPlaceholderText('Digite seu e-mail');
  const passwordInput = getByPlaceholderText('Digite sua senha');
  
  fireEvent.changeText(nameInput, TEST_DATA.name);
  fireEvent.changeText(emailInput, TEST_DATA.email);
  fireEvent.changeText(passwordInput, TEST_DATA.password);
  
  // Submeter formulário
  const submitButton = getByTestId('onboarding-auth-submit-button');
  fireEvent.press(submitButton);
};

describe('Onboarding Integration Tests', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
  });
  
  afterEach(async () => {
    await AsyncStorage.clear();
  });

  describe('🎯 Fluxo Completo de Sucesso', () => {
    it('deve completar o fluxo completo de onboarding com sucesso', async () => {
      // Arrange
      mockAuthService.signUp.mockResolvedValue({
        success: true,
        data: MOCK_AUTH_RESPONSE,
      });

      const { getByTestId, getByPlaceholderText, queryByTestId } = renderOnboardingWithProviders();

      // Act 1: Navegar através do carousel
      await act(async () => {
        await navigateCarousel(getByTestId);
      });

      // Assert 1: Deve estar na tela de auth
      await waitFor(() => {
        expect(getByTestId('onboarding-auth-form')).toBeDefined();
      });

      // Act 2: Preencher e submeter formulário de registro
      await act(async () => {
        await fillSignUpForm(getByTestId, getByPlaceholderText);
      });

      // Assert 2: Deve mostrar loading pós-login
      await waitFor(() => {
        expect(getByTestId('post-login-loading-overlay')).toBeDefined();
      }, { timeout: TEST_TIMEOUTS.NORMAL });

      // Assert 3: Deve completar e sinalizar sucesso
      await waitFor(() => {
        expect(queryByTestId('post-login-loading-overlay')).toBeNull();
      }, { timeout: TEST_TIMEOUTS.SLOW });

      // Assert 4: Verificar que dados foram salvos
      const savedAuthData = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_DATA);
      expect(savedAuthData).toBeDefined();
      
      const savedOnboardingStatus = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_SEEN);
      expect(savedOnboardingStatus).toBe('true');

      // Assert 5: Verificar que authService foi chamado corretamente
      expect(mockAuthService.signUp).toHaveBeenCalledWith({
        name: TEST_DATA.name,
        email: TEST_DATA.email,
        password: TEST_DATA.password,
      });
    });
    
    it('deve permitir pular carousel e ir direto para auth', async () => {
      // Arrange
      mockAuthService.signIn.mockResolvedValue({
        success: true,
        data: MOCK_AUTH_RESPONSE,
      });

      const { getByTestId, getByPlaceholderText } = renderOnboardingWithProviders();

      // Act: Pular onboarding
      const skipButton = getByTestId('onboarding-skip-button');
      fireEvent.press(skipButton);

      // Assert: Deve ir direto para auth
      await waitFor(() => {
        expect(getByTestId('onboarding-auth-form')).toBeDefined();
      });
      
      // Act: Trocar para modo de login
      const signInToggle = getByTestId('auth-mode-toggle-signin');
      fireEvent.press(signInToggle);
      
      // Act: Fazer login
      const emailInput = getByPlaceholderText('Digite seu e-mail');
      const passwordInput = getByPlaceholderText('Digite sua senha');
      
      fireEvent.changeText(emailInput, TEST_DATA.email);
      fireEvent.changeText(passwordInput, TEST_DATA.password);
      
      const submitButton = getByTestId('onboarding-auth-submit-button');
      fireEvent.press(submitButton);

      // Assert: Deve completar com sucesso
      await waitFor(() => {
        expect(getByTestId('post-login-loading-overlay')).toBeDefined();
      }, { timeout: TEST_TIMEOUTS.NORMAL });
    });
  });

  describe('❌ Casos de Erro', () => {
    it('deve lidar com erro de email já existente', async () => {
      // Arrange
      mockAuthService.signUp.mockResolvedValue({
        success: false,
        error: {
          message: TEST_ERROR_MESSAGES.EMAIL_EXISTS,
          code: 'EMAIL_EXISTS',
        },
      });

      const { getByTestId, getByPlaceholderText, getByText } = renderOnboardingWithProviders();

      // Act: Navegar até auth e tentar registrar
      await act(async () => {
        await navigateCarousel(getByTestId);
        await fillSignUpForm(getByTestId, getByPlaceholderText);
      });

      // Assert: Deve mostrar mensagem de erro
      await waitFor(() => {
        expect(getByText(TEST_ERROR_MESSAGES.EMAIL_EXISTS)).toBeDefined();
      });
      
      // Assert: Não deve salvar dados
      const savedAuthData = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_DATA);
      expect(savedAuthData).toBeNull();
    });
    
    it('deve lidar com erro de rede e permitir retry', async () => {
      // Arrange - Primeiro erro, depois sucesso
      mockAuthService.signUp
        .mockResolvedValueOnce({
          success: false,
          error: {
            message: TEST_ERROR_MESSAGES.NETWORK_ERROR,
            code: 'NETWORK_ERROR',
          },
        })
        .mockResolvedValueOnce({
          success: true,
          data: MOCK_AUTH_RESPONSE,
        });

      const { getByTestId, getByPlaceholderText, getByText } = renderOnboardingWithProviders();

      // Act: Tentar registrar (primeira tentativa - falha)
      await act(async () => {
        await navigateCarousel(getByTestId);
        await fillSignUpForm(getByTestId, getByPlaceholderText);
      });

      // Assert: Deve mostrar erro de rede
      await waitFor(() => {
        expect(getByText(TEST_ERROR_MESSAGES.NETWORK_ERROR)).toBeDefined();
      });

      // Act: Tentar novamente
      const retryButton = getByTestId('onboarding-auth-submit-button');
      fireEvent.press(retryButton);

      // Assert: Segunda tentativa deve funcionar
      await waitFor(() => {
        expect(getByTestId('post-login-loading-overlay')).toBeDefined();
      }, { timeout: TEST_TIMEOUTS.NORMAL });
    });
  });

  describe('🔄 Persistência e Restauração', () => {
    it('não deve mostrar onboarding se já foi visto', async () => {
      // Arrange: Marcar onboarding como visto
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_SEEN, 'true');
      
      const { queryByTestId } = renderOnboardingWithProviders();

      // Act: Renderizar
      await waitFor(() => {
        // Assert: Não deve mostrar carousel
        expect(queryByTestId('onboarding-carousel')).toBeNull();
        
        // Deve ir direto para auth ou app principal
        expect(
          queryByTestId('onboarding-auth-form') || 
          queryByTestId('main-app')
        ).toBeDefined();
      });
    });
    
    it('deve restaurar sessão de usuário autenticado', async () => {
      // Arrange: Simular dados salvos
      await AsyncStorage.setItem(
        STORAGE_KEYS.AUTH_DATA, 
        JSON.stringify(MOCK_AUTH_RESPONSE)
      );
      
      const { queryByTestId } = renderOnboardingWithProviders();

      // Act: Renderizar
      await waitFor(() => {
        // Assert: Não deve mostrar onboarding nem auth
        expect(queryByTestId('onboarding-carousel')).toBeNull();
        expect(queryByTestId('onboarding-auth-form')).toBeNull();
      });
    });
  });

  describe('🎨 Estados de Interface', () => {
    it('deve mostrar indicadores de progresso corretos', async () => {
      const { getByTestId } = renderOnboardingWithProviders();

      // Step 0
      expect(getByTestId('onboarding-step-indicator-0')).toBeDefined();
      
      // Navegar para step 1
      const nextButton = getByTestId('onboarding-next-button');
      fireEvent.press(nextButton);
      
      await waitFor(() => {
        expect(getByTestId('onboarding-step-indicator-1')).toBeDefined();
      });
    });
    
    it('deve mostrar/ocultar botão skip corretamente', async () => {
      const { getByTestId, queryByTestId } = renderOnboardingWithProviders();

      // Steps 0 e 1 devem ter botão skip
      expect(getByTestId('onboarding-skip-button')).toBeDefined();
      
      // Navegar para step 2
      fireEvent.press(getByTestId('onboarding-next-button'));
      await waitFor(() => expect(getByTestId('onboarding-step-indicator-1')).toBeDefined());
      
      fireEvent.press(getByTestId('onboarding-next-button'));
      await waitFor(() => expect(getByTestId('onboarding-step-indicator-2')).toBeDefined());
      
      // Step 2 não deve ter botão skip
      expect(queryByTestId('onboarding-skip-button')).toBeNull();
    });
  });

  describe('♿ Acessibilidade', () => {
    it('deve ter elementos acessíveis configurados', async () => {
      const { getByTestId } = renderOnboardingWithProviders();

      const skipButton = getByTestId('onboarding-skip-button');
      const nextButton = getByTestId('onboarding-next-button');

      // Verificar propriedades de acessibilidade
      expect(skipButton.props.accessibilityRole).toBe('button');
      expect(skipButton.props.accessibilityLabel).toBeDefined();
      
      expect(nextButton.props.accessibilityRole).toBe('button');
      expect(nextButton.props.accessibilityLabel).toBeDefined();
    });
  });
});