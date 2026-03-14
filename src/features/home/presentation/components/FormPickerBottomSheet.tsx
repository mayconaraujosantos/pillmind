import React from 'react';
import { useTranslation } from '@shared/i18n';
import {
  BottomSheetPicker,
  PickerOption,
} from '@shared/components/BottomSheetPicker';

interface FormPickerBottomSheetProps {
  visible: boolean;
  selectedForm: string;
  onSelect: (form: string) => void;
  onClose: () => void;
}

export const FormPickerBottomSheet: React.FC<FormPickerBottomSheetProps> = ({
  visible,
  selectedForm,
  onSelect,
  onClose,
}) => {
  const { t } = useTranslation();

  const formOptions: PickerOption<string>[] = [
    { value: 'Capsule', label: t('medicationDetail.formCapsule') },
    { value: 'Pill', label: t('medicationDetail.formPill') },
    { value: 'Drop', label: t('medicationDetail.formDrop') },
    { value: 'Syrup', label: t('medicationDetail.formSyrup') },
    { value: 'Injection', label: t('medicationDetail.formInjection') },
  ];

  return (
    <BottomSheetPicker<string>
      visible={visible}
      title={t('medicationDetail.selectForm')}
      options={formOptions}
      selectedValue={selectedForm}
      onSelect={(value) => {
        onSelect(value);
        onClose();
      }}
      onClose={onClose}
      doneButtonText={t('common.done')}
    />
  );
};
