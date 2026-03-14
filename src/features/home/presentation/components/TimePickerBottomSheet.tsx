import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/theme';
import { useTranslation } from '@shared/i18n';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

interface TimePickerBottomSheetProps {
  visible: boolean;
  selectedTime: string;
  onSelect: (time: string) => void;
  onClose: () => void;
}

const parseTimeToDate = (timeStr: string): Date => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours || 0, minutes || 0, 0, 0);
  return date;
};

const formatDateToTime = (date: Date): string => {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
};

export const TimePickerBottomSheet: React.FC<TimePickerBottomSheetProps> = ({
  visible,
  selectedTime,
  onSelect,
  onClose,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [tempDate, setTempDate] = useState(() => parseTimeToDate(selectedTime));

  React.useEffect(() => {
    if (visible) {
      setTempDate(parseTimeToDate(selectedTime));
    }
  }, [visible, selectedTime]);

  const handleConfirm = () => {
    onSelect(formatDateToTime(tempDate));
    onClose();
  };

  const handleChange = (_event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      if (date) {
        onSelect(formatDateToTime(date));
      }
      onClose();
      return;
    }
    if (date) {
      setTempDate(date);
    }
  };

  if (Platform.OS === 'android') {
    return visible ? (
      <DateTimePicker
        value={tempDate}
        mode="time"
        display="default"
        onChange={handleChange}
        is24Hour
      />
    ) : null;
  }

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
                    {t('medicationDetail.setTime')}
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

              {/* Time Picker */}
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={tempDate}
                  mode="time"
                  display="spinner"
                  onChange={handleChange}
                  is24Hour
                  textColor={theme.colors.text}
                />
              </View>

              {/* Done Button */}
              <View style={styles.footer}>
                <TouchableOpacity
                  style={[
                    styles.doneButton,
                    { backgroundColor: theme.colors.primary },
                  ]}
                  onPress={handleConfirm}
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
  },
  closeButton: {
    position: 'absolute',
    right: 20,
  },
  pickerContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
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
