import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { LanguageSelector } from '../LanguageSelector';

const mockChangeLanguage = jest.fn();
const mockSaveLanguagePreference = jest.fn();

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}));

jest.mock('@shared/theme', () => ({
  useTheme: () => ({ isDark: false }),
}));

jest.mock('@shared/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
      changeLanguage: mockChangeLanguage,
    },
  }),
}));

jest.mock('@shared/i18n/i18n.config', () => ({
  saveLanguagePreference: (lang: string) => mockSaveLanguagePreference(lang),
}));

describe('LanguageSelector', () => {
  beforeEach(() => {
    mockChangeLanguage.mockReset();
    mockSaveLanguagePreference.mockReset();
  });

  it('changes language when selecting a new language', async () => {
    const onLanguageChange = jest.fn();
    const { getByLabelText, getByText } = render(
      <LanguageSelector onLanguageChange={onLanguageChange} />
    );

    fireEvent.press(getByLabelText('Current language: EN-US'));

    await act(async () => {
      fireEvent.press(getByText('PT-BR'));
    });

    await waitFor(() => {
      expect(mockChangeLanguage).toHaveBeenCalledWith('pt-BR');
      expect(mockSaveLanguagePreference).toHaveBeenCalledWith('pt-BR');
      expect(onLanguageChange).toHaveBeenCalledWith('pt-BR');
    });
  });

  it('closes dropdown without changing language when selecting current', async () => {
    const { getAllByText, getByLabelText } = render(<LanguageSelector />);

    fireEvent.press(getByLabelText('Current language: EN-US'));

    await act(async () => {
      const entries = getAllByText('EN-US');
      fireEvent.press(entries[entries.length - 1]);
    });

    expect(mockChangeLanguage).not.toHaveBeenCalled();
    expect(mockSaveLanguagePreference).not.toHaveBeenCalled();
  });
});
