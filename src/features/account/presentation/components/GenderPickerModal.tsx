import React from 'react';
import { useTranslation } from '@shared/i18n';
import {
  BottomSheetPicker,
  PickerOption,
} from '@shared/components/BottomSheetPicker';

export type Gender = 'male' | 'female' | 'non-binary' | '';

interface GenderPickerModalProps {
  visible: boolean;
  selectedGender: Gender;
  onSelect: (gender: Gender) => void;
  onClose: () => void;
}

export const GenderPickerModal: React.FC<GenderPickerModalProps> = ({
  visible,
  selectedGender,
  onSelect,
  onClose,
}) => {
  const { t } = useTranslation();

  const genderOptions: PickerOption<Gender>[] = [
    {
      value: 'non-binary',
      label: t('profile.genderNonBinary') || 'Non-binary',
    },
    { value: 'male', label: t('profile.genderMale') || 'Male' },
    { value: 'female', label: t('profile.genderFemale') || 'Female' },
  ];

  return (
    <BottomSheetPicker<Gender>
      visible={visible}
      title={t('profile.chooseGender') || 'Choose Gender'}
      options={genderOptions}
      selectedValue={selectedGender}
      onSelect={onSelect}
      onClose={onClose}
      doneButtonText={t('common.done') || 'Done'}
    />
  );
};
