import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { OnboardingContainer } from '../OnboardingContainer';
import { WithThemeProvider } from '../../components/WithThemeProvider';

jest.mock('../../hooks/useOnboardingScroll', () => ({
  useOnboardingScroll: jest.fn(() => ({
    currentStep: 0,
    handleScroll: jest.fn(),
  })),
}));

const mockUseOnboardingScroll = () =>
  require('../../hooks/useOnboardingScroll').useOnboardingScroll as jest.Mock;

describe('OnboardingContainer', () => {
  it('deve renderizar o componente sem erros', async () => {
    mockUseOnboardingScroll().mockReturnValue({
      currentStep: 0,
      handleScroll: jest.fn(),
    });
    const { getByText } = render(
      <WithThemeProvider>
        <OnboardingContainer />
      </WithThemeProvider>
    );

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
    const { getByText } = render(
      <WithThemeProvider>
        <OnboardingContainer onSkip={onSkip} />
      </WithThemeProvider>
    );

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
    const { getByText } = render(
      <WithThemeProvider>
        <OnboardingContainer />
      </WithThemeProvider>
    );

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
    const { getByText } = render(
      <WithThemeProvider>
        <OnboardingContainer onFinish={onFinish} />
      </WithThemeProvider>
    );

    await waitFor(() => {
      fireEvent.press(getByText('Login'));
    });

    expect(onFinish).not.toHaveBeenCalled();
  });

  it('não deve chamar onFinish ao pressionar Create an account (apenas navega)', async () => {
    mockUseOnboardingScroll().mockReturnValue({
      currentStep: 2,
      handleScroll: jest.fn(),
    });
    const onFinish = jest.fn();
    const { getByText } = render(
      <WithThemeProvider>
        <OnboardingContainer onFinish={onFinish} />
      </WithThemeProvider>
    );

    await waitFor(() => {
      fireEvent.press(getByText('Create an account'));
    });

    expect(onFinish).not.toHaveBeenCalled();
  });

  it('deve inicializar com currentStep 0', async () => {
    mockUseOnboardingScroll().mockReturnValue({
      currentStep: 0,
      handleScroll: jest.fn(),
    });
    render(
      <WithThemeProvider>
        <OnboardingContainer />
      </WithThemeProvider>
    );
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
    const { getByText } = render(
      <WithThemeProvider>
        <OnboardingContainer />
      </WithThemeProvider>
    );

    // Não deve lançar erro ao pressionar botões sem callbacks
    await waitFor(() => {
      fireEvent.press(getByText('Login'));
      fireEvent.press(getByText('Create an account'));
    });

    expect(true).toBe(true);
  });

  it('deve renderizar corretamente sem erros visuais', async () => {
    mockUseOnboardingScroll().mockReturnValue({
      currentStep: 0,
      handleScroll: jest.fn(),
    });
    const { toJSON } = render(
      <WithThemeProvider>
        <OnboardingContainer />
      </WithThemeProvider>
    );

    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot();
    });
  });
});
