import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/theme';
import { useTranslation } from '@shared/i18n';
import { useAuthContext } from '@features/onboarding/presentation/contexts/AuthContext';
import { logger } from '@shared/utils/logger';
import { profileService } from '@features/account/domain/services/profile.service';
import { GenderPickerModal, Gender } from '../components/GenderPickerModal';
import { DatePickerModal } from '../components/DatePickerModal';
import { AvatarPickerModal } from '../components/AvatarPickerModal';

interface ProfileFormData {
  name: string;
  email: string;
  dateOfBirth: Date | undefined;
  gender: Gender;
}

interface LocalAvatarFile {
  uri: string;
  fileName?: string;
  mimeType?: string;
  fileSize?: number;
}

export const EditProfileScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const authContext = useAuthContext();
  const [isSaving, setIsSaving] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  // Current avatar URL from server
  const [avatarUri, setAvatarUri] = useState<string | undefined>(
    authContext.user?.pictureUrl || undefined
  );
  // New local avatar file to upload
  const [newAvatarFile, setNewAvatarFile] = useState<
    LocalAvatarFile | undefined
  >(undefined);

  const applyLocalAvatarSelection = (asset: {
    uri: string;
    fileName?: string | null;
    mimeType?: string | null;
    fileSize?: number | null;
  }) => {
    setAvatarUri(asset.uri);
    setNewAvatarFile({
      uri: asset.uri,
      fileName: asset.fileName || undefined,
      mimeType: asset.mimeType || undefined,
      fileSize: asset.fileSize || undefined,
    });
    setShowAvatarPicker(false);
  };

  const openCamera = async () => {
    try {
      logger.info('EditProfileScreen', '📸 Requesting camera permissions...');
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          t('common.error') || 'Error',
          t('profile.cameraPermissionDenied') ||
            'Camera permission is required to take photos'
        );
        logger.warn('EditProfileScreen', '⚠️ Camera permission denied');
        return;
      }

      logger.info('EditProfileScreen', '📸 Opening camera...');
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        applyLocalAvatarSelection(result.assets[0]);
        logger.info('EditProfileScreen', '✅ Photo captured');
      }
    } catch (error) {
      logger.error('EditProfileScreen', '❌ Camera error', { error });
      Alert.alert(
        t('common.error') || 'Error',
        t('profile.cameraError') || 'Failed to open camera'
      );
    }
  };

  const [formData, setFormData] = useState<ProfileFormData>({
    name: authContext.user?.name || '',
    email: authContext.user?.email || '',
    dateOfBirth: undefined,
    gender: '',
  });

  const getGenderLabel = (gender: Gender): string => {
    switch (gender) {
      case 'male':
        return t('profile.genderMale') || 'Male';
      case 'female':
        return t('profile.genderFemale') || 'Female';
      case 'non-binary':
        return t('profile.genderNonBinary') || 'Non-binary';
      default:
        return '';
    }
  };

  const formatDate = (date: Date | undefined): string => {
    if (!date) {
      return '';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const openGallery = async () => {
    try {
      logger.info(
        'EditProfileScreen',
        '🖼️ Requesting media library permissions...'
      );
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          t('common.error') || 'Error',
          t('profile.galleryPermissionDenied') ||
            'Gallery permission is required to select photos'
        );
        logger.warn('EditProfileScreen', '⚠️ Media library permission denied');
        return;
      }

      logger.info('EditProfileScreen', '🖼️ Opening gallery...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        applyLocalAvatarSelection(result.assets[0]);
        logger.info('EditProfileScreen', '✅ Photo selected');
      }
    } catch (error) {
      logger.error('EditProfileScreen', '❌ Gallery error', { error });
      Alert.alert(
        t('common.error') || 'Error',
        t('profile.galleryError') || 'Failed to open gallery'
      );
    }
  };

  const canSaveProfile = (): boolean => {
    if (!formData.name.trim()) {
      Alert.alert(
        t('common.error') || 'Error',
        t('profile.nameRequired') || 'Name is required'
      );
      return false;
    }

    if (!authContext.token || !authContext.user?.id) {
      Alert.alert(
        t('common.error') || 'Error',
        t('profile.notAuthenticated') ||
          'You must be logged in to update your profile'
      );
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    logger.info('EditProfileScreen', '💾 Save button pressed', { formData });

    if (!canSaveProfile()) {
      return;
    }

    const authToken = authContext.token;
    const currentUser = authContext.user;

    if (!authToken || !currentUser?.id) {
      return;
    }

    setIsSaving(true);

    try {
      let latestPictureUrl = currentUser.pictureUrl || null;

      // Upload avatar if a new local file was selected
      if (newAvatarFile?.uri) {
        logger.info('EditProfileScreen', '📤 Uploading new avatar...');
        const uploadResponse = await profileService.uploadAvatar(
          authToken,
          newAvatarFile.uri,
          {
            fileName: newAvatarFile.fileName,
            mimeType: newAvatarFile.mimeType,
            fileSize: newAvatarFile.fileSize,
          }
        );

        if (!uploadResponse.success) {
          throw new Error(
            uploadResponse.error?.message || 'Failed to upload avatar'
          );
        }

        latestPictureUrl = uploadResponse.data?.pictureUrl || latestPictureUrl;

        logger.info('EditProfileScreen', '✅ Avatar uploaded successfully', {
          pictureUrl: latestPictureUrl,
        });
      }

      // Update profile
      const updateData = {
        name: formData.name,
        email: formData.email, // Email can be updated in backend
        pictureUrl: latestPictureUrl || undefined,
        dateOfBirth: formData.dateOfBirth
          ? formData.dateOfBirth.toISOString().split('T')[0]
          : undefined,
        gender: formData.gender || undefined,
      };

      const response = await profileService.updateProfile(
        authToken,
        updateData
      );

      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to update profile');
      }

      const isPictureUrlMissingInUpdateResponse =
        response.data?.pictureUrl === undefined;

      latestPictureUrl = isPictureUrlMissingInUpdateResponse
        ? latestPictureUrl
        : response.data?.pictureUrl || null;

      const fallbackUser = {
        id: currentUser.id,
        name: response.data?.name || formData.name,
        email: response.data?.email || formData.email,
        pictureUrl: latestPictureUrl,
      };

      // Fetch updated profile to get all current data including avatar
      logger.info('EditProfileScreen', '🔄 Fetching updated profile...');
      const profileResponse = await profileService.getProfile(authToken);

      // Update context with fresh data from backend
      if (profileResponse.success && profileResponse.data) {
        await authContext.updateUser({
          id: profileResponse.data.id,
          name: profileResponse.data.name,
          email: profileResponse.data.email,
          pictureUrl: profileResponse.data.pictureUrl || null,
        });
        // Update local avatar with server URL
        setAvatarUri(profileResponse.data.pictureUrl || undefined);
        setNewAvatarFile(undefined); // Clear new avatar flag
        logger.info('EditProfileScreen', '✅ Context updated with fresh data', {
          pictureUrl: profileResponse.data.pictureUrl,
        });
      } else {
        await authContext.updateUser(fallbackUser);
        setAvatarUri(latestPictureUrl || undefined);
        setNewAvatarFile(undefined);
        logger.warn(
          'EditProfileScreen',
          '⚠️ Could not refresh profile, fallback user data applied',
          {
            pictureUrl: latestPictureUrl,
            profileError: profileResponse.error?.message,
          }
        );
      }

      Alert.alert(
        t('common.success') || 'Success',
        t('profile.updateSuccess') || 'Profile updated successfully'
      );
      logger.info('EditProfileScreen', '✅ Profile updated successfully');
    } catch (error) {
      logger.error('EditProfileScreen', '❌ Failed to update profile', {
        error,
      });
      Alert.alert(
        t('common.error') || 'Error',
        error instanceof Error
          ? error.message
          : t('profile.updateError') || 'Failed to update profile'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Section */}
        <View style={styles.avatarContainer}>
          <TouchableOpacity
            style={styles.avatarPressable}
            onPress={() => setShowAvatarPicker(true)}
            activeOpacity={0.8}
            testID="avatar-button"
          >
            <View
              style={[styles.avatar, { backgroundColor: theme.colors.surface }]}
            >
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
              ) : (
                <>
                  {authContext.user?.name ? (
                    <Text
                      style={[styles.avatarText, { color: theme.colors.text }]}
                    >
                      {authContext.user.name.charAt(0).toUpperCase()}
                    </Text>
                  ) : (
                    <Ionicons
                      name="person-outline"
                      size={48}
                      color={theme.colors.textSecondary}
                    />
                  )}
                </>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.cameraButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => setShowAvatarPicker(true)}
            activeOpacity={0.7}
            testID="camera-button"
          >
            <Ionicons name="camera" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Name Field */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            {t('profile.name') || 'Name'}
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            placeholder={t('profile.namePlaceholder') || 'Enter your name'}
            placeholderTextColor={theme.colors.placeholder}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            testID="name-input"
          />
        </View>

        {/* E-mail Field */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            {t('profile.email') || 'E-mail'}
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.surface,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            placeholder={t('profile.emailPlaceholder') || 'Enter your email'}
            placeholderTextColor={theme.colors.placeholder}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
            testID="email-input"
          />
        </View>

        {/* Date of Birth Field */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            {t('profile.dateOfBirth') || 'Date of Birth'}
          </Text>
          <TouchableOpacity
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                justifyContent: 'center',
              },
            ]}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.7}
            testID="date-of-birth-button"
          >
            <Text
              style={[
                styles.inputPlaceholder,
                {
                  color: formData.dateOfBirth
                    ? theme.colors.text
                    : theme.colors.placeholder,
                },
              ]}
            >
              {formatDate(formData.dateOfBirth) ||
                t('profile.dateOfBirthPlaceholder') ||
                'Enter your date of birth'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Gender Field */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            {t('profile.gender') || 'Gender'}
          </Text>
          <TouchableOpacity
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                justifyContent: 'center',
              },
            ]}
            onPress={() => setShowGenderPicker(true)}
            activeOpacity={0.7}
            testID="gender-button"
          >
            <Text
              style={[
                styles.inputPlaceholder,
                {
                  color: formData.gender
                    ? theme.colors.text
                    : theme.colors.placeholder,
                },
              ]}
            >
              {getGenderLabel(formData.gender) ||
                t('profile.genderPlaceholder') ||
                'Enter your gender'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View
        style={[styles.footer, { backgroundColor: theme.colors.background }]}
      >
        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: theme.colors.primary },
            isSaving && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={isSaving}
          activeOpacity={0.8}
          testID="save-button"
        >
          {isSaving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>
              {t('common.save') || 'Save'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Gender Picker Modal */}
      <GenderPickerModal
        visible={showGenderPicker}
        selectedGender={formData.gender}
        onSelect={(gender) => {
          setFormData({ ...formData, gender });
        }}
        onClose={() => setShowGenderPicker(false)}
      />

      {/* Date Picker Modal */}
      <DatePickerModal
        visible={showDatePicker}
        selectedDate={formData.dateOfBirth}
        onSelect={(date) => {
          setFormData({ ...formData, dateOfBirth: date });
          setShowDatePicker(false);
        }}
        onClose={() => setShowDatePicker(false)}
        maximumDate={new Date()}
        minimumDate={new Date(1900, 0, 1)}
      />

      <AvatarPickerModal
        visible={showAvatarPicker}
        currentAvatar={avatarUri}
        onChoosePhoto={openGallery}
        onTakePhoto={openCamera}
        onSaveAvatar={(selectedAvatar) => {
          setAvatarUri(selectedAvatar);
          setNewAvatarFile(undefined);
        }}
        onClose={() => setShowAvatarPicker(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  avatarPressable: {
    borderRadius: 50,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '600',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraButton: {
    position: 'absolute',
    right: '35%',
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  inputDisabled: {
    opacity: 0.6,
  },
  inputPlaceholder: {
    fontSize: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 34,
  },
  saveButton: {
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
