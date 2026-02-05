import React from 'react';
import { Alert } from 'react-native';
import { render } from '@testing-library/react-native';
import { PostLoginLoadingScreen } from '../PostLoginLoadingScreen';

const mockRetry = jest.fn();

jest.mock('@shared/components', () => ({
  ScreenWrapper: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  Loader: ({ message, testID }: { message: string; testID?: string }) => (
    <>
      {testID ? <></> : null}
      {message}
    </>
  ),
}));

jest.mock('@shared/theme', () => ({
  useTheme: () => ({ theme: { colors: { background: '#fff' } } }),
}));

jest.mock('@shared/i18n', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('../../hooks/usePostLoginPreparation', () => ({
  usePostLoginPreparation: () => ({
    isPreparing: false,
    error: null,
    progress: 100,
    retry: mockRetry,
  }),
}));

jest.mock('../../contexts/AuthContext', () => ({
  useAuthContext: () => ({ isAuthenticated: false }),
}));

describe('PostLoginLoadingScreen', () => {
  beforeEach(() => {
    jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
    mockRetry.mockReset();
  });

  it('calls onComplete when user is not authenticated', () => {
    const onComplete = jest.fn();

    render(<PostLoginLoadingScreen onComplete={onComplete} />);

    expect(onComplete).toHaveBeenCalled();
  });
});
