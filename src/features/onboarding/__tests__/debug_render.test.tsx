import React from 'react';
import { render } from '@testing-library/react-native';
import { OnboardingContainer } from '../presentation/screens/OnboardingContainer';
import { ThemeProvider } from '@shared/theme';
import { AuthProvider } from '../presentation/contexts/AuthContext';

jest.mock('@shared/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
  },
}));
jest.mock('../domain/services/auth.service');
jest.mock('../domain/services/oauth.service');

it('renders next button', () => {
  const { toJSON } = render(
    <ThemeProvider>
      <AuthProvider>
        <OnboardingContainer />
      </AuthProvider>
    </ThemeProvider>
  );
  const json = toJSON();
  let jsonDesc: string;
  if (Array.isArray(json)) jsonDesc = 'array len=' + (json as unknown[]).length;
  else if (json === null) jsonDesc = 'NULL';
  else
    jsonDesc =
      'object type=' + (json as unknown as Record<string, unknown>).type;
  console.log('TYPE:', typeof json, jsonDesc);
});
