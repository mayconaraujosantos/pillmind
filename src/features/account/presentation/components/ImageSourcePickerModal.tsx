import React from 'react';
import { useTranslation } from '@shared/i18n';
import {
  BottomSheetPicker,
  PickerOption,
} from '@shared/components/BottomSheetPicker';

export type ImageSource = 'camera' | 'gallery' | '';

interface ImageSourcePickerModalProps {
  visible: boolean;
  onSelect: (source: ImageSource) => void;
  onClose: () => void;
}

export const ImageSourcePickerModal: React.FC<ImageSourcePickerModalProps> = ({
  visible,
  onSelect,
  onClose,
}) => {
  const { t } = useTranslation();

  const imageSourceOptions: PickerOption<ImageSource>[] = [
    {
      value: 'camera',
      label: t('profile.takePhoto') || 'Take Photo',
      icon: 'camera',
    },
    {
      value: 'gallery',
      label: t('profile.chooseFromGallery') || 'Choose from Gallery',
      icon: 'images',
    },
  ];

  return (
    <BottomSheetPicker<ImageSource>
      visible={visible}
      title={t('profile.changePhoto') || 'Change Photo'}
      options={imageSourceOptions}
      onSelect={onSelect}
      onClose={onClose}
      doneButtonText={t('common.cancel') || 'Cancel'}
    />
  );
};
