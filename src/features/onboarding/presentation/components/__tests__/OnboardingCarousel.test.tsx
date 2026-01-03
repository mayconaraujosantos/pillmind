import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { OnboardingCarousel } from '../OnboardingCarousel';
import { WithThemeProvider } from '../WithThemeProvider';

describe('OnboardingCarousel', () => {
  it('deve renderizar ScrollView horizontal', async () => {
    const onScroll = jest.fn();
    const { UNSAFE_getByType } = render(
      <WithThemeProvider>
        <OnboardingCarousel onScroll={onScroll} />
      </WithThemeProvider>
    );

    await waitFor(() => {
      const scrollView = UNSAFE_getByType(require('react-native').ScrollView);
      expect(scrollView.props.horizontal).toBe(true);
      expect(scrollView.props.pagingEnabled).toBe(true);
    });
  });

  it('deve renderizar todos os steps do onboarding', async () => {
    const onScroll = jest.fn();
    const { getByText } = render(
      <WithThemeProvider>
        <OnboardingCarousel onScroll={onScroll} />
      </WithThemeProvider>
    );

    await waitFor(() => {
      // Verifica se renderiza steps traduzidos (inglês por padrão nos testes)
      expect(getByText('Your health, on schedule')).toBeTruthy();
      expect(getByText('Advanced reminders, Easy use')).toBeTruthy();
      expect(getByText('For yourself, family and friends')).toBeTruthy();
    });
  });

  it('deve renderizar corretamente sem erros visuais', async () => {
    const onScroll = jest.fn();
    const { toJSON } = render(
      <WithThemeProvider>
        <OnboardingCarousel onScroll={onScroll} />
      </WithThemeProvider>
    );

    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot();
    });
  });
});
