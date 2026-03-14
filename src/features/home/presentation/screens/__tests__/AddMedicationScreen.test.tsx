import React from 'react';
import { Alert } from 'react-native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import * as ImagePicker from 'expo-image-picker';
import { AddMedicationScreen } from '../AddMedicationScreen';

const mockGoBack = jest.fn();
const mockUploadMedicationImage = jest.fn();
const mockCreateMedicineExecute = jest.fn();

jest.mock('@shared/i18n', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@shared/theme', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        background: '#fff',
        text: '#000',
        border: '#ccc',
        surface: '#f7f7f7',
        placeholder: '#999',
        primary: '#1f6feb',
      },
    },
  }),
}));

jest.mock('@features/onboarding/presentation/contexts/AuthContext', () => ({
  useAuthContext: () => ({
    token: 'test-token',
  }),
}));

jest.mock('@features/account/domain/services/profile.service', () => ({
  profileService: {
    uploadMedicationImage: (...args: unknown[]) =>
      mockUploadMedicationImage(...args),
  },
}));

jest.mock('@features/home/presentation/medicine.dependencies', () => ({
  createMedicineUseCase: {
    execute: (...args: unknown[]) => mockCreateMedicineExecute(...args),
  },
}));

jest.mock('@shared/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
  requestCameraPermissionsAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
}));

const renderScreen = () => {
  const route = {
    key: 'AddMedication-test',
    name: 'AddMedication',
    params: undefined,
  } as never;

  return render(
    <AddMedicationScreen
      navigation={{ goBack: mockGoBack } as never}
      route={route}
    />
  );
};

describe('AddMedicationScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());

    mockCreateMedicineExecute.mockResolvedValue({ id: 'med-1' });
    mockUploadMedicationImage.mockResolvedValue({
      success: true,
      data: { imageUrl: 'https://cdn.example.com/medication.png' },
    });

    (
      ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock
    ).mockResolvedValue({ granted: true });
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [
        {
          uri: 'file:///tmp/medication.png',
          fileName: 'medication.png',
          mimeType: 'image/png',
          fileSize: 1024,
        },
      ],
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('shows validation error when name is missing', async () => {
    const { getByPlaceholderText, getByText } = renderScreen();

    fireEvent.changeText(getByPlaceholderText('Ex: 500mg'), '500mg');
    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'common.error',
        'Medication name is required'
      );
    });

    expect(mockCreateMedicineExecute).not.toHaveBeenCalled();
  });

  it('creates medication and navigates back on success', async () => {
    const { getByPlaceholderText, getByText } = renderScreen();

    fireEvent.changeText(
      getByPlaceholderText('Ex: Paracetamol'),
      'Paracetamol'
    );
    fireEvent.changeText(getByPlaceholderText('Ex: 500mg'), '500mg');
    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(mockCreateMedicineExecute).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Paracetamol',
          dosage: '500mg',
          frequency: 'once-a-day',
          times: ['08:00'],
          imageUrl: undefined,
        })
      );
    });

    const successCall = (Alert.alert as jest.Mock).mock.calls.find(
      (call) => call[0] === 'common.success'
    );

    expect(successCall).toBeTruthy();

    const successButtons = successCall?.[2] as
      | Array<{ onPress?: () => void }>
      | undefined;

    successButtons?.[0]?.onPress?.();
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('uploads selected image before creating medication', async () => {
    const { getByPlaceholderText, getByText } = renderScreen();

    fireEvent.changeText(getByPlaceholderText('Ex: Paracetamol'), 'Ibuprofeno');
    fireEvent.changeText(getByPlaceholderText('Ex: 500mg'), '400mg');

    fireEvent.press(getByText('Gallery'));

    await waitFor(() => {
      expect(
        ImagePicker.requestMediaLibraryPermissionsAsync
      ).toHaveBeenCalled();
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
    });

    fireEvent.press(getByText('Save'));

    await waitFor(() => {
      expect(mockUploadMedicationImage).toHaveBeenCalledWith(
        'test-token',
        'file:///tmp/medication.png',
        {
          fileName: 'medication.png',
          mimeType: 'image/png',
          fileSize: 1024,
        }
      );
    });

    await waitFor(() => {
      expect(mockCreateMedicineExecute).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Ibuprofeno',
          dosage: '400mg',
          imageUrl: 'https://cdn.example.com/medication.png',
        })
      );
    });
  });
});
