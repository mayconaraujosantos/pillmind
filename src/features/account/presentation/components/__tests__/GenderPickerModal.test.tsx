import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GenderPickerModal } from '../GenderPickerModal';
import { ThemeProvider } from '@shared/theme';

jest.mock('@shared/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'profile.chooseGender': 'Choose Gender',
        'profile.genderMale': 'Male',
        'profile.genderFemale': 'Female',
        'profile.genderNonBinary': 'Non-binary',
        'common.done': 'Done',
      };
      return translations[key] || key;
    },
    i18n: { language: 'en' },
  }),
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('GenderPickerModal', () => {
  const mockOnSelect = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render when visible', () => {
    const { getByText } = renderWithProviders(
      <GenderPickerModal
        visible={true}
        selectedGender=""
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    );

    expect(getByText('Choose Gender')).toBeTruthy();
    expect(getByText('Male')).toBeTruthy();
    expect(getByText('Female')).toBeTruthy();
    expect(getByText('Non-binary')).toBeTruthy();
    expect(getByText('Done')).toBeTruthy();
  });

  it('should not render when not visible', () => {
    const { queryByText } = renderWithProviders(
      <GenderPickerModal
        visible={false}
        selectedGender=""
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    );

    expect(queryByText('Choose Gender')).toBeNull();
  });

  it('should call onSelect when option is pressed', () => {
    const { getByText } = renderWithProviders(
      <GenderPickerModal
        visible={true}
        selectedGender=""
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    );

    fireEvent.press(getByText('Male'));

    expect(mockOnSelect).toHaveBeenCalledWith('male');
  });

  it('should call onClose when Done button is pressed', () => {
    const { getByText } = renderWithProviders(
      <GenderPickerModal
        visible={true}
        selectedGender="male"
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    );

    fireEvent.press(getByText('Done'));

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onClose when close button is pressed', () => {
    const { getByTestId } = renderWithProviders(
      <GenderPickerModal
        visible={true}
        selectedGender=""
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    );

    // The close button has an Ionicons component
    // We need to find its parent TouchableOpacity
    const closeButton = getByTestId('gender-modal-close-button');
    fireEvent.press(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should highlight selected gender', () => {
    const { getByText } = renderWithProviders(
      <GenderPickerModal
        visible={true}
        selectedGender="female"
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    );

    const femaleOption = getByText('Female');
    // The selected option should have different styling (fontWeight: 600)
    expect(femaleOption.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontWeight: '600',
        }),
      ])
    );
  });
});
