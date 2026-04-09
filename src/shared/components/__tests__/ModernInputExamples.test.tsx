import React from 'react';
import { render } from '@testing-library/react-native';
import { ModernInputExamples } from '../ModernInputExamples';

jest.mock('../Input', () => ({
  Input: () => null,
}));

describe('ModernInputExamples', () => {
  it('renders examples screen', () => {
    const { getByText } = render(<ModernInputExamples />);

    expect(getByText('🎨 Modern Input Design 2025')).toBeTruthy();
  });
});
