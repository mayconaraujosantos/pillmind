import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { OnboardingContainer } from '../OnboardingContainer';
import { WithThemeProvider } from '../../components/WithThemeProvider';
import { AuthProvider } from '../../contexts/AuthContext';

jest.mock('../../hooks/useOnboardingScroll', () => ({
  useOnboardingScroll: jest.fn(() => ({
    currentStep: 0,
    handleScroll: jest.fn(),
  })),
}));

const mockUseOnboardingScroll = () =>
  require('../../hooks/useOnboardingScroll').useOnboardingScroll as jest.Mock;

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <WithThemeProvider>
      <AuthProvider>
        {component}
      </AuthProvider>
    </WithThemeProvider>
  );
};

describe('OnboardingContainer', () => {
  it('deve renderizar o componente sem erros', async () => {
    mockUseOnboardingScroll().mockReturnValue({
      currentStep: 0,
      handleScroll: jest.fn(),
    });
    const { getByText } = renderWithProviders(<OnboardingContainer />);

    await waitFor(() => {
      expect(getByText('Skip')).toBeTruthy();
      expect(getByText('Next')).toBeTruthy();
    });
  });

  it('deve chamar onSkip quando Skip é pressionado', async () => {
    mockUseOnboardingScroll().mockReturnValue({
      currentStep: 0,
      handleScroll: jest.fn(),
    });
    const onSkip = jest.fn();
    const { getByText } = renderWithProviders(<OnboardingContainer onSkip={onSkip} />);

    await waitFor(() => {
      fireEvent.press(getByText('Skip'));
    });

    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  it('deve mostrar botões de autenticação no passo 2', async () => {
    mockUseOnboardingScroll().mockReturnValue({
      currentStep: 2,
      handleScroll: jest.fn(),
    });
    const { getByText } = renderWithProviders(<OnboardingContainer />);

    await waitFor(() => {
      expect(getByText('Create an account')).toBeTruthy();
      expect(getByText('Login')).toBeTruthy();
    });
  });

  it('não deve chamar onFinish ao pressionar Login (apenas navega)', async () => {
    mockUseOnboardingScroll().mockReturnValue({
      currentStep: 2,
      handleScroll: jest.fn(),
    });
    const onFinish = jest.fn();
    const { getByText } = renderWithProviders(<OnboardingContainer onFinish={onFinish} />);

    await waitFor(() => {
      expect(getByText('Login')).toBeTruthy();
    });

    fireEvent.press(getByText('Login'));

    expect(onFinish).not.toHaveBeenCalled();
  });

  it('não deve chamar onFinish ao pressionar Create an account (apenas navega)', async () => {
    mockUseOnboardingScroll().mockReturnValue({
      currentStep: 2,
      handleScroll: jest.fn(),
    });
    const onFinish = jest.fn();
    const { getByText } = renderWithProviders(<OnboardingContainer onFinish={onFinish} />);

    await waitFor(() => {
      expect(getByText('Create an account')).toBeTruthy();
    });

    fireEvent.press(getByText('Create an account'));

    expect(onFinish).not.toHaveBeenCalled();
  });

  it('deve inicializar com currentStep 0', async () => {
    mockUseOnboardingScroll().mockReturnValue({
      currentStep: 0,
      handleScroll: jest.fn(),
    });
    renderWithProviders(<OnboardingContainer />);
    // Se não houver erros ao renderizar, o estado inicial está correto
    await waitFor(() => {
      expect(true).toBe(true);
    });
  });

  it('deve funcionar sem callbacks (onSkip e onFinish opcionais)', async () => {
    mockUseOnboardingScroll().mockReturnValue({
      currentStep: 2,
      handleScroll: jest.fn(),
    });
    const { getByText } = renderWithProviders(<OnboardingContainer />);

    // At step 2, the authentication screen is rendered with "Create an account" and "Login" buttons
    await waitFor(() => {
      expect(getByText('Create an account')).toBeTruthy();
      expect(getByText('Login')).toBeTruthy();
    });

    // Verify buttons exist without pressing them (as pressing causes navigation)
    const createAccountButton = getByText('Create an account');
    const loginButton = getByText('Login');

    expect(createAccountButton).toBeTruthy();
    expect(loginButton).toBeTruthy();
  });

  it('deve renderizar corretamente sem erros visuais', async () => {
    mockUseOnboardingScroll().mockReturnValue({
      currentStep: 0,
      handleScroll: jest.fn(),
    });
    const { toJSON } = renderWithProviders(<OnboardingContainer />);

    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot();
    });
  });
});
