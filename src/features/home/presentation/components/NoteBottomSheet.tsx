import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/theme';
import { useTranslation } from '@shared/i18n';

interface NoteBottomSheetProps {
  visible: boolean;
  currentNote: string;
  onSubmit: (note: string) => void;
  onClose: () => void;
}

export const NoteBottomSheet: React.FC<NoteBottomSheetProps> = ({
  visible,
  currentNote,
  onSubmit,
  onClose,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [tempNote, setTempNote] = useState(currentNote);

  React.useEffect(() => {
    if (visible) {
      setTempNote(currentNote);
    }
  }, [visible, currentNote]);

  const handleDone = () => {
    onSubmit(tempNote);
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
                    {t('medicationDetail.note')}
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

              {/* Text Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  value={tempNote}
                  onChangeText={setTempNote}
                  placeholder={t('medicationDetail.optionalNote')}
                  placeholderTextColor={theme.colors.textSecondary}
                  style={[
                    styles.textInput,
                    {
                      color: theme.colors.text,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  autoFocus
                />
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
  // Input
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  textInput: {
    fontSize: 16,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 80,
  },
  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
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
