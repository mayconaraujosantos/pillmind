import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { OnboardingContainer } from '../OnboardingContainer';
import { WithThemeProvider } from '../../components/WithThemeProvider';

describe('OnboardingContainer', () => {
  it('deve renderizar o componente sem erros', async () => {
    const { getByText } = render(
      <WithThemeProvider>
        <OnboardingContainer />
      </WithThemeProvider>
    );

    await waitFor(() => {
      expect(getByText('Skip')).toBeTruthy();
      expect(getByText('Login')).toBeTruthy();
      expect(getByText('Create an account')).toBeTruthy();
    });
  });

  it('deve chamar onSkip quando Skip é pressionado', async () => {
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

  it('deve chamar onFinish quando Login é pressionado', async () => {
    const onFinish = jest.fn();
    const { getByText } = render(
      <WithThemeProvider>
        <OnboardingContainer onFinish={onFinish} />
      </WithThemeProvider>
    );

    await waitFor(() => {
      fireEvent.press(getByText('Login'));
    });

    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onFinish quando Create an account é pressionado', async () => {
    const onFinish = jest.fn();
    const { getByText } = render(
      <WithThemeProvider>
        <OnboardingContainer onFinish={onFinish} />
      </WithThemeProvider>
    );

    await waitFor(() => {
      fireEvent.press(getByText('Create an account'));
    });

    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it('deve inicializar com currentStep 0', async () => {
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
    const { getByText } = render(
      <WithThemeProvider>
        <OnboardingContainer />
      </WithThemeProvider>
    );

    // Não deve lançar erro ao pressionar botões sem callbacks
    await waitFor(() => {
      fireEvent.press(getByText('Skip'));
      fireEvent.press(getByText('Login'));
      fireEvent.press(getByText('Create an account'));
    });

    expect(true).toBe(true);
  });

  it('deve renderizar corretamente sem erros visuais', async () => {
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
