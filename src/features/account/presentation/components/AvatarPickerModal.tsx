import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/theme';
import { useTranslation } from '@shared/i18n';

interface AvatarPickerModalProps {
  visible: boolean;
  currentAvatar?: string;
  onChoosePhoto: () => void;
  onTakePhoto: () => void;
  onSaveAvatar: (avatarUrl: string) => void;
  onClose: () => void;
}

const AVATAR_OPTIONS = [
  'https://api.dicebear.com/9.x/personas/png?seed=Ana',
  'https://api.dicebear.com/9.x/personas/png?seed=Bruno',
  'https://api.dicebear.com/9.x/personas/png?seed=Caio',
  'https://api.dicebear.com/9.x/personas/png?seed=Duda',
  'https://api.dicebear.com/9.x/personas/png?seed=Elisa',
  'https://api.dicebear.com/9.x/personas/png?seed=Fabio',
  'https://api.dicebear.com/9.x/personas/png?seed=Gabi',
  'https://api.dicebear.com/9.x/personas/png?seed=Hugo',
  'https://api.dicebear.com/9.x/personas/png?seed=Iara',
  'https://api.dicebear.com/9.x/personas/png?seed=Joao',
  'https://api.dicebear.com/9.x/personas/png?seed=Katia',
  'https://api.dicebear.com/9.x/personas/png?seed=Leo',
];

export const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({
  visible,
  currentAvatar,
  onChoosePhoto,
  onTakePhoto,
  onSaveAvatar,
  onClose,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const normalizedCurrentAvatar = currentAvatar?.trim();
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  const defaultAvatar = useMemo(() => {
    if (
      normalizedCurrentAvatar &&
      AVATAR_OPTIONS.includes(normalizedCurrentAvatar)
    ) {
      return normalizedCurrentAvatar;
    }
    return AVATAR_OPTIONS[0];
  }, [normalizedCurrentAvatar]);

  useEffect(() => {
    if (visible) {
      setSelectedAvatar(defaultAvatar);
    }
  }, [defaultAvatar, visible]);

  const handleSave = () => {
    if (!selectedAvatar) {
      return;
    }

    onSaveAvatar(selectedAvatar);
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
              <View style={styles.header}>
                <View style={styles.handle} />
                <View style={styles.headerContent}>
                  <Text style={[styles.title, { color: theme.colors.text }]}>
                    {t('profile.choosePhoto') || 'Choose photo'}
                  </Text>
                  <TouchableOpacity
                    onPress={onClose}
                    style={styles.closeButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    testID="avatar-picker-close-button"
                  >
                    <Ionicons
                      name="close"
                      size={24}
                      color={theme.colors.text}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.grid}>
                <TouchableOpacity
                  style={[
                    styles.choosePhotoButton,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  onPress={onChoosePhoto}
                  activeOpacity={0.8}
                  testID="avatar-picker-choose-photo"
                >
                  <Ionicons
                    name="images-outline"
                    size={28}
                    color={theme.colors.textSecondary}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.choosePhotoButton,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  onPress={onTakePhoto}
                  activeOpacity={0.8}
                  testID="avatar-picker-take-photo"
                >
                  <Ionicons
                    name="camera-outline"
                    size={28}
                    color={theme.colors.textSecondary}
                  />
                </TouchableOpacity>

                {AVATAR_OPTIONS.map((avatarUrl) => {
                  const isSelected = selectedAvatar === avatarUrl;

                  return (
                    <TouchableOpacity
                      key={avatarUrl}
                      style={[
                        styles.avatarOption,
                        {
                          borderColor: isSelected
                            ? theme.colors.primary
                            : 'transparent',
                        },
                      ]}
                      onPress={() => setSelectedAvatar(avatarUrl)}
                      activeOpacity={0.8}
                      testID={`avatar-option-${avatarUrl.split('=').pop()}`}
                    >
                      <Image
                        source={{ uri: avatarUrl }}
                        style={styles.avatarImage}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.footer}>
                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    { backgroundColor: theme.colors.primary },
                  ]}
                  onPress={handleSave}
                  activeOpacity={0.8}
                  testID="avatar-picker-save-button"
                >
                  <Text style={styles.saveButtonText}>
                    {t('common.save') || 'Save'}
                  </Text>
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
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 16,
  },
  handle: {
    width: 44,
    height: 5,
    backgroundColor: '#D1D5DB',
    borderRadius: 999,
    marginBottom: 16,
  },
  headerContent: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    lineHeight: 36,
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
    columnGap: 10,
  },
  choosePhotoButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  avatarOption: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 68,
    height: 68,
    borderRadius: 34,
  },
  footer: {
    marginTop: 24,
  },
  saveButton: {
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
