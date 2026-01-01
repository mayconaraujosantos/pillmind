import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NearbyScreen } from '../NearbyScreen';
import { ThemeProvider } from '@shared/theme';

describe('NearbyScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('automatic');
  });

  it('should render correctly', async () => {
    const { getByText } = render(
      <ThemeProvider>
        <NearbyScreen />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByText('Locais Próximos')).toBeTruthy();
    });
  });
});
