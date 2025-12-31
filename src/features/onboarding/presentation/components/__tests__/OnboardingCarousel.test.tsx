import React from 'react';
import { render } from '@testing-library/react-native';
import { OnboardingCarousel } from '../OnboardingCarousel';

describe('OnboardingCarousel', () => {
  it('deve renderizar ScrollView horizontal', () => {
    const onScroll = jest.fn();
    const { UNSAFE_getByType } = render(
      <OnboardingCarousel onScroll={onScroll} />
    );

    const scrollView = UNSAFE_getByType(require('react-native').ScrollView);
    expect(scrollView.props.horizontal).toBe(true);
    expect(scrollView.props.pagingEnabled).toBe(true);
  });

  it('deve renderizar todos os steps do onboarding', () => {
    const onScroll = jest.fn();
    const { getByText } = render(<OnboardingCarousel onScroll={onScroll} />);

    expect(getByText("DON'T FORGET YOUR MEDICINES.")).toBeTruthy();
    expect(getByText("DON'T FORGET YOUR APPOINTMENTS.")).toBeTruthy();
  });

  it('deve renderizar corretamente sem erros visuais', () => {
    const onScroll = jest.fn();
    const { toJSON } = render(<OnboardingCarousel onScroll={onScroll} />);

    expect(toJSON()).toMatchSnapshot();
  });
});
