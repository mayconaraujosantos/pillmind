import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/theme';
import { useTranslation } from '@shared/i18n';

interface FrequencyPickerBottomSheetProps {
  visible: boolean;
  selectedValue: number;
  selectedUnit: string;
  onSelect: (value: number, unit: string) => void;
  onClose: () => void;
}

const frequencyValues = Array.from({ length: 30 }, (_, i) => i + 1);
const frequencyUnits = ['Day', 'Hour', 'Week'];

export const FrequencyPickerBottomSheet: React.FC<
  FrequencyPickerBottomSheetProps
> = ({ visible, selectedValue, selectedUnit, onSelect, onClose }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [tempValue, setTempValue] = useState(selectedValue);
  const [tempUnit, setTempUnit] = useState(selectedUnit);

  React.useEffect(() => {
    if (visible) {
      setTempValue(selectedValue);
      setTempUnit(selectedUnit);
    }
  }, [visible, selectedValue, selectedUnit]);

  const handleDone = () => {
    onSelect(tempValue, tempUnit);
    onClose();
  };

  const getUnitLabel = (unit: string): string => {
    switch (unit) {
      case 'Day':
        return t('medicationDetail.day');
      case 'Hour':
        return t('medicationDetail.hour');
      case 'Week':
        return t('medicationDetail.week');
      default:
        return unit;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.container,
                { backgroundColor: theme.colors.background },
              ]}
            >
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.handle} />
                <View style={styles.headerContent}>
                  <Text style={[styles.title, { color: theme.colors.text }]}>
                    {t('medicationDetail.setFrequency')}
                  </Text>
                  <TouchableOpacity
                    onPress={onClose}
                    style={styles.closeButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons
                      name="close"
                      size={24}
                      color={theme.colors.text}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Unit Selection */}
              <View style={styles.unitRow}>
                {frequencyUnits.map((unit) => (
                  <TouchableOpacity
                    key={unit}
                    style={[
                      styles.unitChip,
                      {
                        backgroundColor:
                          tempUnit === unit
                            ? theme.colors.primary
                            : theme.colors.surface,
                        borderColor:
                          tempUnit === unit
                            ? theme.colors.primary
                            : theme.colors.border,
                      },
                    ]}
                    onPress={() => setTempUnit(unit)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.unitChipText,
                        {
                          color:
                            tempUnit === unit
                              ? '#FFFFFF'
                              : theme.colors.textSecondary,
                        },
                      ]}
                    >
                      {getUnitLabel(unit)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Value Selection */}
              <Text
                style={[
                  styles.sectionLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {t('medicationDetail.every')}
              </Text>
              <ScrollView
                style={styles.valueScroll}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.valueGrid}>
                  {frequencyValues.map((value) => (
                    <TouchableOpacity
                      key={value}
                      style={[
                        styles.valueCell,
                        {
                          backgroundColor:
                            tempValue === value
                              ? theme.colors.primary
                              : theme.colors.surface,
                          borderColor:
                            tempValue === value
                              ? theme.colors.primary
                              : theme.colors.border,
                        },
                      ]}
                      onPress={() => setTempValue(value)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.valueCellText,
                          {
                            color:
                              tempValue === value
                                ? '#FFFFFF'
                                : theme.colors.text,
                          },
                        ]}
                      >
                        {value}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              {/* Done Button */}
              <View style={styles.footer}>
                <TouchableOpacity
                  style={[
                    styles.doneButton,
                    { backgroundColor: theme.colors.primary },
                  ]}
                  onPress={handleDone}
                  activeOpacity={0.8}
                >
                  <Text style={styles.doneButtonText}>{t('common.done')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
    maxHeight: '70%',
  },
  header: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 16,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
  },
  // Unit chips
  unitRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  unitChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  unitChipText: {
    fontSize: 15,
    fontWeight: '600',
  },
  // Value grid
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  valueScroll: {
    maxHeight: 200,
    paddingHorizontal: 20,
  },
  valueGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  valueCell: {
    width: 52,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueCellText: {
    fontSize: 16,
    fontWeight: '500',
  },
  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  doneButton: {
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
