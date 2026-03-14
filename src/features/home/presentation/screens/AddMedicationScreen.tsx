import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { StackScreenProps } from '@react-navigation/stack';
import { useTheme } from '@shared/theme';
import { useTranslation } from '@shared/i18n';
import { useAuthContext } from '@features/onboarding/presentation/contexts/AuthContext';
import { profileService } from '@features/account/domain/services/profile.service';
import { logger } from '@shared/utils/logger';
import { createMedicineUseCase } from '../medicine.dependencies';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';

type AddMedicationScreenProps = StackScreenProps<
  HomeStackParamList,
  'AddMedication'
>;

interface SelectedImage {
  uri: string;
  fileName?: string;
  mimeType?: string;
  fileSize?: number;
}

export const AddMedicationScreen: React.FC<AddMedicationScreenProps> = ({
  navigation,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const authContext = useAuthContext();

  const [name, setName] = React.useState('');
  const [dosage, setDosage] = React.useState('');
  const [frequency, setFrequency] = React.useState('once-a-day');
  const [time, setTime] = React.useState('08:00');
  const [notes, setNotes] = React.useState('');
  const [selectedImage, setSelectedImage] = React.useState<
    SelectedImage | undefined
  >(undefined);
  const [isSaving, setIsSaving] = React.useState(false);

  const chooseFromGallery = React.useCallback(async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        t('common.error') || 'Error',
        t('profile.galleryPermissionDenied') ||
          'Gallery permission is required to select photos'
      );
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (pickerResult.canceled || !pickerResult.assets[0]) {
      return;
    }

    const asset = pickerResult.assets[0];
    setSelectedImage({
      uri: asset.uri,
      fileName: asset.fileName || undefined,
      mimeType: asset.mimeType || undefined,
      fileSize: asset.fileSize || undefined,
    });
  }, [t]);

  const takePhoto = React.useCallback(async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        t('common.error') || 'Error',
        t('profile.cameraPermissionDenied') ||
          'Camera permission is required to take photos'
      );
      return;
    }

    const pickerResult = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (pickerResult.canceled || !pickerResult.assets[0]) {
      return;
    }

    const asset = pickerResult.assets[0];
    setSelectedImage({
      uri: asset.uri,
      fileName: asset.fileName || undefined,
      mimeType: asset.mimeType || undefined,
      fileSize: asset.fileSize || undefined,
    });
  }, [t]);

  const validateForm = (): boolean => {
    if (!name.trim()) {
      Alert.alert(t('common.error') || 'Error', 'Medication name is required');
      return false;
    }

    if (!dosage.trim()) {
      Alert.alert(t('common.error') || 'Error', 'Dosage is required');
      return false;
    }

    if (!authContext.token) {
      Alert.alert(
        t('common.error') || 'Error',
        t('profile.notAuthenticated') || 'You must be logged in'
      );
      return false;
    }

    return true;
  };

  const handleSave = React.useCallback(async () => {
    if (!validateForm() || !authContext.token) {
      return;
    }

    setIsSaving(true);

    try {
      let imageUrl: string | undefined;

      if (selectedImage?.uri) {
        logger.info('AddMedicationScreen', '📤 Uploading medication image');

        const uploadResponse = await profileService.uploadMedicationImage(
          authContext.token,
          selectedImage.uri,
          {
            fileName: selectedImage.fileName,
            mimeType: selectedImage.mimeType,
            fileSize: selectedImage.fileSize,
          }
        );

        if (!uploadResponse.success || !uploadResponse.data?.imageUrl) {
          throw new Error(
            uploadResponse.error?.message || 'Failed to upload medication image'
          );
        }

        imageUrl = uploadResponse.data.imageUrl;
      }

      await createMedicineUseCase.execute({
        name: name.trim(),
        dosage: dosage.trim(),
        frequency: frequency.trim(),
        times: [time.trim()],
        startDate: new Date(),
        notes: notes.trim() || undefined,
        imageUrl,
      });

      Alert.alert(
        t('common.success') || 'Success',
        'Medication created successfully',
        [
          {
            text: t('common.ok') || 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      logger.error('AddMedicationScreen', '❌ Failed to create medication', {
        error: error instanceof Error ? error.message : String(error),
      });

      Alert.alert(
        t('common.error') || 'Error',
        error instanceof Error ? error.message : 'Failed to create medication'
      );
    } finally {
      setIsSaving(false);
    }
  }, [
    authContext.token,
    dosage,
    frequency,
    name,
    navigation,
    notes,
    selectedImage,
    t,
    time,
  ]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.label, { color: theme.colors.text }]}>Name</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
            color: theme.colors.text,
            borderColor: theme.colors.border,
          },
        ]}
        value={name}
        onChangeText={setName}
        placeholder="Ex: Paracetamol"
        placeholderTextColor={theme.colors.placeholder}
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>Dosage</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
            color: theme.colors.text,
            borderColor: theme.colors.border,
          },
        ]}
        value={dosage}
        onChangeText={setDosage}
        placeholder="Ex: 500mg"
        placeholderTextColor={theme.colors.placeholder}
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>
        Frequency
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
        value={frequency}
        onChangeText={setFrequency}
        placeholder="Ex: once-a-day"
        placeholderTextColor={theme.colors.placeholder}
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>Time</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
            color: theme.colors.text,
            borderColor: theme.colors.border,
          },
        ]}
        value={time}
        onChangeText={setTime}
        placeholder="08:00"
        placeholderTextColor={theme.colors.placeholder}
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>Notes</Text>
      <TextInput
        style={[
          styles.input,
          styles.notesInput,
          {
            backgroundColor: theme.colors.surface,
            color: theme.colors.text,
            borderColor: theme.colors.border,
          },
        ]}
        value={notes}
        onChangeText={setNotes}
        placeholder="Optional"
        placeholderTextColor={theme.colors.placeholder}
        multiline
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>Photo</Text>
      <View style={styles.imageActionsRow}>
        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: theme.colors.border }]}
          onPress={() => {
            void takePhoto();
          }}
        >
          <Text
            style={[styles.secondaryButtonText, { color: theme.colors.text }]}
          >
            Take Photo
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: theme.colors.border }]}
          onPress={() => {
            void chooseFromGallery();
          }}
        >
          <Text
            style={[styles.secondaryButtonText, { color: theme.colors.text }]}
          >
            Gallery
          </Text>
        </TouchableOpacity>
      </View>

      {selectedImage?.uri ? (
        <Image
          source={{ uri: selectedImage.uri }}
          style={styles.previewImage}
        />
      ) : null}

      <View style={styles.footerButtons}>
        <TouchableOpacity
          style={[styles.cancelButton, { borderColor: theme.colors.border }]}
          onPress={() => navigation.goBack()}
          disabled={isSaving}
        >
          <Text style={[styles.cancelButtonText, { color: theme.colors.text }]}>
            Cancel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => {
            void handleSave();
          }}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  imageActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  secondaryButton: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginTop: 10,
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
