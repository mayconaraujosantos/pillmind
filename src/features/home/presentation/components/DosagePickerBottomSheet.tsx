import React from 'react';
import { useTranslation } from '@shared/i18n';
import {
  BottomSheetPicker,
  PickerOption,
} from '@shared/components/BottomSheetPicker';

interface DosagePickerBottomSheetProps {
  visible: boolean;
  selectedDosage: string;
  onSelect: (dosage: string) => void;
  onClose: () => void;
}

const dosageValues = [
  '0.5',
  '1',
  '1.5',
  '2',
  '2.5',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
];

export const DosagePickerBottomSheet: React.FC<
  DosagePickerBottomSheetProps
> = ({ visible, selectedDosage, onSelect, onClose }) => {
  const { t } = useTranslation();

  const dosageOptions: PickerOption<string>[] = dosageValues.map((value) => ({
    value,
    label: value,
  }));

  return (
    <BottomSheetPicker<string>
      visible={visible}
      title={t('medicationDetail.selectDosage')}
      options={dosageOptions}
      selectedValue={selectedDosage}
      onSelect={(value) => {
        onSelect(value);
        onClose();
      }}
      onClose={onClose}
      doneButtonText={t('common.done')}
    />
  );
};
