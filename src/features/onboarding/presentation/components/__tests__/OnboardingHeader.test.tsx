import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { OnboardingHeader } from '../OnboardingHeader';
import { WithThemeProvider } from '../WithThemeProvider';

describe('OnboardingHeader', () => {
  it('deve renderizar botão Skip', async () => {
    const onSkip = jest.fn();
    const { getByText } = render(
      <WithThemeProvider>
        <OnboardingHeader onSkip={onSkip} />
      </WithThemeProvider>
    );

    await waitFor(() => {
      expect(getByText('Skip')).toBeTruthy();
    });
  });

  it('deve chamar onSkip ao pressionar o botão', async () => {
    const onSkip = jest.fn();
    const { getByText } = render(
      <WithThemeProvider>
        <OnboardingHeader onSkip={onSkip} />
      </WithThemeProvider>
    );

    await waitFor(() => {
      fireEvent.press(getByText('Skip'));
    });

    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  it('deve ter propriedades de acessibilidade configuradas', async () => {
    const onSkip = jest.fn();
    const { getByLabelText } = render(
      <WithThemeProvider>
        <OnboardingHeader onSkip={onSkip} />
      </WithThemeProvider>
    );

    await waitFor(() => {
      const skipButton = getByLabelText('Pular onboarding');
      expect(skipButton).toBeTruthy();
      expect(skipButton.props.accessibilityRole).toBe('button');
      expect(skipButton.props.accessibilityHint).toBe(
        'Pula a introdução e vai direto para o app'
      );
    });
  });

  it('deve ter hitSlop para facilitar toque', async () => {
    const onSkip = jest.fn();
    const { getByLabelText } = render(
      <WithThemeProvider>
        <OnboardingHeader onSkip={onSkip} />
      </WithThemeProvider>
    );

    await waitFor(() => {
      const skipButton = getByLabelText('Pular onboarding');
      expect(skipButton.props.hitSlop).toEqual({
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
      });
    });
  });

  it('deve ter design moderno com border e background sutil', async () => {
    const onSkip = jest.fn();
    const { getByLabelText } = render(
      <WithThemeProvider>
        <OnboardingHeader onSkip={onSkip} />
      </WithThemeProvider>
    );

    await waitFor(() => {
      const skipButton = getByLabelText('Pular onboarding');
      const buttonStyle = skipButton.props.style;

      // Verifica estilo moderno
      expect(buttonStyle).toMatchObject(
        expect.objectContaining({
          paddingVertical: 10,
          paddingHorizontal: 18,
          borderRadius: 20,
          borderWidth: 1.5,
        })
      );
      // Deve ter background sutil e border
      expect(buttonStyle.backgroundColor).toBeDefined();
      expect(buttonStyle.borderColor).toBeDefined();
    });
  });

  it('deve renderizar corretamente sem erros visuais', async () => {
    const onSkip = jest.fn();
    const { toJSON } = render(
      <WithThemeProvider>
        <OnboardingHeader onSkip={onSkip} />
      </WithThemeProvider>
    );

    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot();
    });
  });
});
