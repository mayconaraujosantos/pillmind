import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BaseScreen } from '../BaseScreen';
import { Text } from 'react-native';
import { ThemeProvider } from '@shared/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('BaseScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('automatic');
  });

  it('should render with title and children', async () => {
    const { getByText } = renderWithTheme(
      <BaseScreen title="Test Title">
        <Text>Test Content</Text>
      </BaseScreen>
    );

    await waitFor(() => {
      expect(getByText('Test Title')).toBeTruthy();
      expect(getByText('Test Content')).toBeTruthy();
    });
  });

  it('should apply custom styles when provided', async () => {
    const customStyle = { backgroundColor: '#FFFFFF' };

    const { getByTestId } = renderWithTheme(
      <BaseScreen title="Test Screen" style={customStyle}>
        <Text testID="content">Test Content</Text>
      </BaseScreen>
    );

    await waitFor(() => {
      expect(getByTestId('content')).toBeTruthy();
    });
  });
});
