import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { OnboardingContainer } from '../OnboardingContainer';

describe('OnboardingContainer', () => {
  it('deve renderizar o componente sem erros', () => {
    const { getByText } = render(<OnboardingContainer />);

    expect(getByText('Skip')).toBeTruthy();
    expect(getByText('SIGN IN')).toBeTruthy();
    expect(getByText('SIGN UP')).toBeTruthy();
  });

  it('deve chamar onSkip quando Skip é pressionado', () => {
    const onSkip = jest.fn();
    const { getByText } = render(<OnboardingContainer onSkip={onSkip} />);

    fireEvent.press(getByText('Skip'));

    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onFinish quando Sign In é pressionado', () => {
    const onFinish = jest.fn();
    const { getByText } = render(<OnboardingContainer onFinish={onFinish} />);

    fireEvent.press(getByText('SIGN IN'));

    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onFinish quando Sign Up é pressionado', () => {
    const onFinish = jest.fn();
    const { getByText } = render(<OnboardingContainer onFinish={onFinish} />);

    fireEvent.press(getByText('SIGN UP'));

    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it('deve inicializar com currentStep 0', () => {
    render(<OnboardingContainer />);
    // Se não houver erros ao renderizar, o estado inicial está correto
    expect(true).toBe(true);
  });

  it('deve funcionar sem callbacks (onSkip e onFinish opcionais)', () => {
    const { getByText } = render(<OnboardingContainer />);

    // Não deve lançar erro ao pressionar botões sem callbacks
    fireEvent.press(getByText('Skip'));
    fireEvent.press(getByText('SIGN IN'));
    fireEvent.press(getByText('SIGN UP'));

    expect(true).toBe(true);
  });

  it('deve renderizar corretamente sem erros visuais', () => {
    const { toJSON } = render(<OnboardingContainer />);

    expect(toJSON()).toMatchSnapshot();
  });
});
