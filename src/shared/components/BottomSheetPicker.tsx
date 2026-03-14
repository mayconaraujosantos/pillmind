import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/theme';

export interface PickerOption<T = string> {
  value: T;
  label: string;
  icon?: string;
}

interface BottomSheetPickerProps<T = string> {
  visible: boolean;
  title: string;
  options: PickerOption<T>[];
  selectedValue?: T;
  onSelect: (value: T) => void;
  onClose: () => void;
  doneButtonText?: string;
}

export function BottomSheetPicker<T = string>({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
  doneButtonText = 'Done',
}: Readonly<BottomSheetPickerProps<T>>) {
  const { theme } = useTheme();

  const handleSelect = (value: T) => {
    onSelect(value);
  };

  const handleDone = () => {
    onClose();
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
                    {title}
                  </Text>
                  <TouchableOpacity
                    onPress={onClose}
                    style={styles.closeButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    testID="bottom-sheet-close-button"
                  >
                    <Ionicons
                      name="close"
                      size={24}
                      color={theme.colors.text}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Options */}
              <View style={styles.options}>
                {options.map((option, index) => (
                  <TouchableOpacity
                    key={String(option.value)}
                    style={[
                      styles.option,
                      {
                        borderBottomColor: theme.colors.border,
                        borderBottomWidth: index < options.length - 1 ? 1 : 0,
                      },
                    ]}
                    onPress={() => handleSelect(option.value)}
                    activeOpacity={0.7}
                  >
                    {option.icon && (
                      <Ionicons
                        name={option.icon as keyof typeof Ionicons.glyphMap}
                        size={24}
                        color={
                          selectedValue === option.value
                            ? theme.colors.primary
                            : theme.colors.textSecondary
                        }
                        style={styles.optionIcon}
                      />
                    )}
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color:
                            selectedValue === option.value
                              ? theme.colors.text
                              : theme.colors.textSecondary,
                          fontWeight:
                            selectedValue === option.value ? '600' : '400',
                        },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Done Button */}
              <View style={styles.footer}>
                <TouchableOpacity
                  style={[
                    styles.doneButton,
                    { backgroundColor: theme.colors.primary },
                  ]}
                  onPress={handleDone}
                  activeOpacity={0.8}
                  testID="bottom-sheet-done-button"
                >
                  <Text style={styles.doneButtonText}>{doneButtonText}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

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
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
  },
  options: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  option: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 17,
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
