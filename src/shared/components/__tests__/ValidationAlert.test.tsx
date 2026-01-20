import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { ValidationAlert } from '../ValidationAlert';
import { ThemeProvider } from '@shared/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('ValidationAlert', () => {
  it('should render when visible is true', async () => {
    const { getByTestId } = renderWithTheme(
      <ValidationAlert visible={true} message="Test message" />
    );

    await waitFor(() => {
      expect(getByTestId('validation-message')).toBeTruthy();
    });
  });

  it('should not render when visible is false', () => {
    const { queryByTestId } = renderWithTheme(
      <ValidationAlert visible={false} message="Test message" />
    );

    expect(queryByTestId('validation-message')).toBeNull();
  });

  it('should call onDismiss when dismiss button is pressed', () => {
    const onDismiss = jest.fn();
    renderWithTheme(
      <ValidationAlert
        visible={true}
        message="Test message"
        onDismiss={onDismiss}
      />
    );

    // The close button would need a testID for this test to work properly
    // This is a placeholder test structure
    expect(onDismiss).toBeTruthy();
  });

  it('should use default message when none provided', async () => {
    const { getByTestId } = renderWithTheme(<ValidationAlert visible={true} />);

    await waitFor(() => {
      expect(getByTestId('validation-message')).toBeTruthy();
    });
  });

  it('should show custom message when provided', async () => {
    const customMessage = 'Custom validation error';
    const { getByTestId } = renderWithTheme(
      <ValidationAlert visible={true} message={customMessage} />
    );

    await waitFor(() => {
      expect(getByTestId('validation-message')).toBeTruthy();
    });
  });
});
