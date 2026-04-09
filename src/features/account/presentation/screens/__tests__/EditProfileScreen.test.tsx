import React from 'react';
import {
  render,
  fireEvent,
  act,
  waitFor,
  screen,
} from '@testing-library/react-native';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EditProfileScreen } from '../EditProfileScreen';
import { ThemeProvider } from '@shared/theme';
import { AuthProvider } from '@features/onboarding/presentation/contexts/AuthContext';

const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: mockBack,
  }),
}));

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted' })
  ),
  requestCameraPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted' })
  ),
  launchImageLibraryAsync: jest.fn(() =>
    Promise.resolve({ canceled: true, assets: [] })
  ),
  launchCameraAsync: jest.fn(() =>
    Promise.resolve({ canceled: true, assets: [] })
  ),
}));

jest.mock('@features/onboarding/domain/services/auth.service', () => ({
  authService: {
    getProfile: jest.fn(() =>
      Promise.resolve({ success: false, error: { status: 500 } })
    ),
    updateProfile: jest.fn(() =>
      Promise.resolve({
        success: true,
        data: { id: '1', name: 'User', email: 'u@u.com' },
      })
    ),
    uploadProfilePicture: jest.fn(() =>
      Promise.resolve({
        success: true,
        data: {
          id: '1',
          name: 'User',
          email: 'u@u.com',
          pictureUrl: 'https://example.com/p.jpg',
        },
      })
    ),
    deleteProfilePicture: jest.fn(() =>
      Promise.resolve({
        success: true,
        data: {
          id: '1',
          name: 'User',
          email: 'u@u.com',
          pictureUrl: null,
        },
      })
    ),
  },
}));

jest.mock('@features/onboarding/domain/services/oauth.service', () => ({
  oauthService: {
    signInWithGoogle: jest.fn(),
    isSignedIn: jest.fn(() => Promise.resolve(false)),
    signOutGoogle: jest.fn(),
  },
}));

jest.mock('@shared/i18n', () => {
  const translations: Record<string, string> = {
    'onboarding.signUp.name': 'Name',
    'onboarding.signUp.email': 'Email',
    'account.dateOfBirth': 'Date of birth',
    'account.gender': 'Gender',
    'account.genderMale': 'Male',
    'account.genderFemale': 'Female',
    'account.genderOther': 'Other',
    'account.genderPreferNot': 'Prefer not to say',
    'account.genderNotSet': 'Not set',
    'account.saveProfile': 'Save',
    'account.changePhoto': 'Change photo',
    'account.changePhotoTitle': 'Profile photo',
    'account.chooseFromLibrary': 'Choose from library',
    'account.takePhoto': 'Take photo',
    'account.user': 'User',
    'common.cancel': 'Cancel',
    'common.error': 'Error',
    'account.chooseGender': 'Choose gender',
    'common.ok': 'OK',
  };
  return {
    useTranslation: () => ({
      t: (key: string) => translations[key] || key,
      i18n: { language: 'en' },
    }),
  };
});

const mockedAuthService = jest.requireMock(
  '@features/onboarding/domain/services/auth.service'
).authService as {
  uploadProfilePicture: jest.Mock;
};

const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <ThemeProvider>
      <AuthProvider>{ui}</AuthProvider>
    </ThemeProvider>
  );

describe('EditProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === '@pillmind_auth') {
        return Promise.resolve(
          JSON.stringify({
            user: {
              id: '1',
              name: 'User',
              email: 'u@u.com',
            },
            token: 'test-token',
          })
        );
      }
      return Promise.resolve(null);
    });
  });

  it('picker → upload chama API (edit profile)', async () => {
    const pickedUri = 'file:///cache/profile-pick.jpg';
    const expoImagePicker = jest.requireMock('expo-image-picker') as {
      launchImageLibraryAsync: jest.Mock;
    };
    expoImagePicker.launchImageLibraryAsync.mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: pickedUri, mimeType: 'image/jpeg' }],
    });

    const alertSpy = jest
      .spyOn(Alert, 'alert')
      .mockImplementation((_title, _message, buttons) => {
        const choose = buttons?.find((b) => b.text === 'Choose from library');
        if (choose && typeof choose.onPress === 'function') {
          choose.onPress();
        }
      });

    renderWithProviders(<EditProfileScreen />);

    await screen.findByDisplayValue('User', {}, { timeout: 8000 });

    await act(async () => {
      fireEvent.press(screen.getByTestId('edit-profile-change-photo-button'));
    });

    await waitFor(
      () => {
        expect(mockedAuthService.uploadProfilePicture).toHaveBeenCalledWith(
          pickedUri,
          'test-token',
          'image/jpeg',
          'profile.jpg'
        );
      },
      { timeout: 5000 }
    );

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@pillmind_profile_photo_1',
        pickedUri
      );
    });

    alertSpy.mockRestore();
  });
});
