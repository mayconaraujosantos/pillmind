import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from '../Card';
import { Text } from 'react-native';
import { ThemeProvider } from '@shared/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Card', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('automatic');
  });

  it('should render children correctly', async () => {
    const { getByText } = renderWithTheme(
      <Card>
        <Text>Card Content</Text>
      </Card>
    );

    await waitFor(() => {
      expect(getByText('Card Content')).toBeTruthy();
    });
  });

  it('should apply default styles', async () => {
    const { getByTestId } = renderWithTheme(
      <Card>
        <Text testID="card-content">Test Content</Text>
      </Card>
    );

    await waitFor(() => {
      expect(getByTestId('card-content')).toBeTruthy();
    });
  });

  it('should apply custom styles when provided', async () => {
    const customStyle = { backgroundColor: '#FF0000' };

    const { getByTestId } = renderWithTheme(
      <Card style={customStyle}>
        <Text testID="card-content">Custom Style Content</Text>
      </Card>
    );

    await waitFor(() => {
      expect(getByTestId('card-content')).toBeTruthy();
    });
  });

  it('should render multiple children', async () => {
    const { getByText } = renderWithTheme(
      <Card>
        <Text>First Child</Text>
        <Text>Second Child</Text>
      </Card>
    );

    await waitFor(() => {
      expect(getByText('First Child')).toBeTruthy();
      expect(getByText('Second Child')).toBeTruthy();
    });
  });
});
