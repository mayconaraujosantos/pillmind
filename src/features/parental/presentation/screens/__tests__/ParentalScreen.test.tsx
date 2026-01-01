import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ParentalScreen } from '../ParentalScreen';
import { ThemeProvider } from '@shared/theme';

describe('ParentalScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('automatic');
  });

  it('should render correctly', async () => {
    const { getByText } = render(
      <ThemeProvider>
        <ParentalScreen />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByText('Parental Control')).toBeTruthy();
    });
  });
});
