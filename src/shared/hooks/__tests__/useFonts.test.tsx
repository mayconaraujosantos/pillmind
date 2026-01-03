import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { useFonts } from '../useFonts';

jest.mock('@expo-google-fonts/roboto', () => ({
  useFonts: jest.fn(),
}));

const mockUseFonts = jest.requireMock('@expo-google-fonts/roboto')
  .useFonts as jest.Mock;

const HookTester = ({
  onResult,
}: {
  onResult: (result: ReturnType<typeof useFonts>) => void;
}) => {
  const result = useFonts();

  React.useEffect(() => {
    onResult(result);
  }, [result, onResult]);

  return null;
};

describe('useFonts', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns loaded state when fonts load successfully', async () => {
    mockUseFonts.mockReturnValue([true, null]);
    const onResult = jest.fn();

    render(<HookTester onResult={onResult} />);

    await waitFor(() => {
      expect(onResult).toHaveBeenCalledWith({ fontsLoaded: true, error: null });
    });
  });

  it('returns loaded=true and warns when fonts fail to load', async () => {
    const error = new Error('fail');
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    mockUseFonts.mockReturnValue([false, error]);
    const onResult = jest.fn();

    render(<HookTester onResult={onResult} />);

    await waitFor(() => {
      expect(onResult).toHaveBeenCalledWith({ fontsLoaded: true, error });
    });
    expect(warnSpy).toHaveBeenCalledWith(
      'Failed to load Roboto fonts, falling back to system fonts.',
      error
    );

    warnSpy.mockRestore();
  });
});
