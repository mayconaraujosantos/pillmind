import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ErrorBoundary } from '../ErrorBoundary';

const createThrowingComponent = (shouldThrowRef: { value: boolean }) => {
  const ThrowingComponent: React.FC = () => {
    if (shouldThrowRef.value) {
      throw new Error('Boom');
    }
    return <Text>Recovered</Text>;
  };

  return ThrowingComponent;
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders fallback UI when child throws', () => {
    const shouldThrowRef = { value: true };
    const ThrowingComponent = createThrowingComponent(shouldThrowRef);

    const { getByText } = render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(getByText(/Oops! Something went wrong/)).toBeTruthy();
    expect(getByText('Boom')).toBeTruthy();
  });

  it('resets error state on retry', () => {
    const shouldThrowRef = { value: true };
    const ThrowingComponent = createThrowingComponent(shouldThrowRef);

    const { getByText, queryByText } = render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(getByText(/Try Again/)).toBeTruthy();

    shouldThrowRef.value = false;
    fireEvent.press(getByText(/Try Again/));

    expect(queryByText(/Oops! Something went wrong/)).toBeNull();
    expect(getByText('Recovered')).toBeTruthy();
  });

  it('renders custom fallback when provided', () => {
    const shouldThrowRef = { value: true };
    const ThrowingComponent = createThrowingComponent(shouldThrowRef);

    const { getByText } = render(
      <ErrorBoundary fallback={<Text>Custom fallback</Text>}>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(getByText('Custom fallback')).toBeTruthy();
  });
});
