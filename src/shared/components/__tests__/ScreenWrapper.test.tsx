import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScreenWrapper } from '../ScreenWrapper';
import { Text } from 'react-native';
import { ThemeProvider } from '@shared/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('ScreenWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('automatic');
  });

  it('should render children correctly', async () => {
    const { getByText } = renderWithTheme(
      <ScreenWrapper>
        <Text>Screen Content</Text>
      </ScreenWrapper>
    );

    await waitFor(() => {
      expect(getByText('Screen Content')).toBeTruthy();
    });
  });

  it('should apply custom styles when provided', async () => {
    const customStyle = { backgroundColor: '#F0F0F0' };
    const { getByText } = renderWithTheme(
      <ScreenWrapper style={customStyle}>
        <Text>Content</Text>
      </ScreenWrapper>
    );

    await waitFor(() => {
      expect(getByText('Content')).toBeTruthy();
    });
  });

  it('should render multiple children', async () => {
    const { getByText } = renderWithTheme(
      <ScreenWrapper>
        <Text>First Child</Text>
        <Text>Second Child</Text>
      </ScreenWrapper>
    );

    await waitFor(() => {
      expect(getByText('First Child')).toBeTruthy();
      expect(getByText('Second Child')).toBeTruthy();
    });
  });
});
