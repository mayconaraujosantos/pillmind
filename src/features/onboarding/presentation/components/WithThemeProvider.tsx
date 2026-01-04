import React, { ReactNode } from 'react';
import { ThemeProvider } from '@shared/theme';

// Componente exportado que envolve com ThemeProvider
// AsyncStorage já está mockado globalmente no jest.setup.js
export const WithThemeProvider = ({ children }: { children: ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);
