import React from 'react';
import { Alert, type AlertButton } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { authService } from '@features/onboarding/domain/services/auth.service';
import { useAuthContext } from '@features/onboarding/presentation/contexts/AuthContext';
import { logger } from '@shared/utils/logger';

type Translate = (key: string) => string;

const pickerOptions: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.85,
};

export function useProfilePhotoActions(t: Translate) {
  const authContext = useAuthContext();
  const [uploadingPhoto, setUploadingPhoto] = React.useState(false);
  const displayPictureUrl = authContext.displayPictureUrl;

  const uploadPickedAsset = React.useCallback(
    async (asset: ImagePicker.ImagePickerAsset) => {
      const uri = asset.uri;
      const mimeType = asset.mimeType ?? 'image/jpeg';
      let ext = 'jpg';
      if (mimeType === 'image/png') {
        ext = 'png';
      } else if (mimeType === 'image/webp') {
        ext = 'webp';
      }
      const token = authContext.token;
      if (!token) {
        return;
      }
      setUploadingPhoto(true);
      await authContext.setProfilePhotoUri(uri);
      try {
        const res = await authService.uploadProfilePicture(
          uri,
          token,
          mimeType,
          `profile.${ext}`
        );
        if (res.success && res.data) {
          await authContext.applyServerUser(res.data, {
            preferDisplayWithLocalUri: uri,
          });
        } else {
          await authContext.setProfilePhotoUri(null);
          Alert.alert(
            t('common.error'),
            res.error?.message || t('account.uploadPhotoFailed')
          );
        }
      } catch (err) {
        await authContext.setProfilePhotoUri(null);
        logger.error(
          'useProfilePhotoActions',
          'Profile picture upload threw',
          { error: err instanceof Error ? err.message : String(err) },
          err instanceof Error ? err : undefined
        );
        Alert.alert(t('common.error'), t('account.uploadPhotoFailed'));
      } finally {
        setUploadingPhoto(false);
      }
    },
    [authContext, t]
  );

  const pickFromLibrary = React.useCallback(async () => {
    if (!authContext.user?.id) {
      return;
    }
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('common.error'), t('account.photoPermissionDenied'));
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync(pickerOptions);
      if (!result.canceled && result.assets[0]) {
        await uploadPickedAsset(result.assets[0]);
      }
    } catch (err) {
      logger.error(
        'useProfilePhotoActions',
        'Photo library error',
        { error: err instanceof Error ? err.message : String(err) },
        err instanceof Error ? err : undefined
      );
      Alert.alert(t('common.error'), t('account.photoPickerError'));
    }
  }, [authContext.user?.id, t, uploadPickedAsset]);

  const takePhoto = React.useCallback(async () => {
    if (!authContext.user?.id) {
      return;
    }
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('common.error'), t('account.photoPermissionDenied'));
        return;
      }
      const result = await ImagePicker.launchCameraAsync(pickerOptions);
      if (!result.canceled && result.assets[0]) {
        await uploadPickedAsset(result.assets[0]);
      }
    } catch (err) {
      logger.error(
        'useProfilePhotoActions',
        'Camera error',
        { error: err instanceof Error ? err.message : String(err) },
        err instanceof Error ? err : undefined
      );
      Alert.alert(t('common.error'), t('account.photoPickerError'));
    }
  }, [authContext.user?.id, t, uploadPickedAsset]);

  const removePhoto = React.useCallback(async () => {
    const hasServerPicture =
      typeof authContext.user?.pictureUrl === 'string' &&
      authContext.user.pictureUrl.length > 0;
    if (hasServerPicture && authContext.token) {
      setUploadingPhoto(true);
      try {
        const res = await authService.deleteProfilePicture(authContext.token);
        if (res.success && res.data) {
          await authContext.applyServerUser(res.data);
        } else {
          Alert.alert(
            t('common.error'),
            res.error?.message || t('account.uploadPhotoFailed')
          );
        }
      } finally {
        setUploadingPhoto(false);
      }
    } else {
      await authContext.setProfilePhotoUri(null);
    }
  }, [authContext, t]);

  const openPhotoOptions = React.useCallback(() => {
    if (!authContext.user?.id) {
      return;
    }
    const buttons: AlertButton[] = [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('account.chooseFromLibrary'),
        onPress: () => {
          void pickFromLibrary();
        },
      },
      {
        text: t('account.takePhoto'),
        onPress: () => {
          void takePhoto();
        },
      },
    ];
    if (displayPictureUrl) {
      buttons.push({
        text: t('account.removePhoto'),
        style: 'destructive',
        onPress: () => {
          void removePhoto();
        },
      });
    }
    Alert.alert(t('account.changePhotoTitle'), undefined, buttons);
  }, [
    displayPictureUrl,
    pickFromLibrary,
    takePhoto,
    removePhoto,
    t,
    authContext.user?.id,
  ]);

  const initial = (
    authContext.user?.name?.trim()?.charAt(0) || t('account.user').charAt(0)
  ).toUpperCase();

  return {
    displayPictureUrl,
    uploadingPhoto,
    openPhotoOptions,
    initial,
  };
}
