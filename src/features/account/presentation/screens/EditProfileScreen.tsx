import { Ionicons } from '@expo/vector-icons';
import type { ProfileGender } from '@features/onboarding/domain/models/auth.model';
import { authService } from '@features/onboarding/domain/services/auth.service';
import { useAuthContext } from '@features/onboarding/presentation/contexts/AuthContext';
import { useTranslation } from '@shared/i18n';
import { useTheme } from '@shared/theme';
import { logger } from '@shared/utils/logger';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useProfilePhotoActions } from '../hooks/useProfilePhotoActions';

const DOB_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const GENDERS: { value: ProfileGender; key: string }[] = [
  { value: 'MALE', key: 'account.genderMale' },
  { value: 'FEMALE', key: 'account.genderFemale' },
  { value: 'OTHER', key: 'account.genderOther' },
  { value: 'PREFER_NOT_TO_SAY', key: 'account.genderPreferNot' },
];

export const EditProfileScreen: React.FC = () => {
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const authContext = useAuthContext();
  const user = authContext.user;

  const { displayPictureUrl, uploadingPhoto, openPhotoOptions, initial } =
    useProfilePhotoActions(t);

  const [name, setName] = React.useState(user?.name ?? '');
  const [email, setEmail] = React.useState(user?.email ?? '');
  const [dateOfBirth, setDateOfBirth] = React.useState(user?.dateOfBirth ?? '');
  const [gender, setGender] = React.useState<ProfileGender | null>(
    user?.gender ?? null
  );
  const [saving, setSaving] = React.useState(false);
  const [genderModalOpen, setGenderModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setDateOfBirth(user.dateOfBirth ?? '');
      setGender(user.gender ?? null);
    }
  }, [user?.id, user?.name, user?.email, user?.dateOfBirth, user?.gender]);

  const inputSurface = theme.colors.surface;
  const inputBorder = theme.colors.border;
  const screenBg = theme.colors.background;

  const handleSave = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName) {
      Alert.alert(t('common.error'), t('account.nameRequired'));
      return;
    }
    if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
      Alert.alert(t('common.error'), t('account.emailInvalid'));
      return;
    }
    const dobTrim = dateOfBirth.trim();
    if (dobTrim && !DOB_REGEX.test(dobTrim)) {
      Alert.alert(t('common.error'), t('account.invalidDateFormat'));
      return;
    }
    if (dobTrim) {
      const d = new Date(`${dobTrim}T12:00:00`);
      if (Number.isNaN(d.getTime())) {
        Alert.alert(t('common.error'), t('account.invalidDateFormat'));
        return;
      }
    }

    const token = authContext.token;
    if (!token) {
      return;
    }

    setSaving(true);
    try {
      const res = await authService.updateProfile(token, {
        name: trimmedName,
        email: trimmedEmail,
        dateOfBirth: dobTrim || null,
        gender: gender ?? null,
      });
      if (res.success && res.data) {
        await authContext.applyServerUser(res.data);
        Alert.alert(t('common.success'), t('account.profileUpdated'), [
          { text: t('common.ok'), onPress: () => router.back() },
        ]);
      } else {
        Alert.alert(
          t('common.error'),
          res.error?.message || t('account.profileUpdateFailed')
        );
      }
    } catch {
      Alert.alert(t('common.error'), t('account.profileUpdateFailed'));
    } finally {
      setSaving(false);
    }
  };

  const genderLabel = gender
    ? t(GENDERS.find((g) => g.value === gender)!.key)
    : t('account.genderNotSet');

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: screenBg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.avatarBlock}>
          <TouchableOpacity
            style={styles.avatarTouchable}
            onPress={openPhotoOptions}
            activeOpacity={0.88}
            disabled={!authContext.user?.id || uploadingPhoto}
            testID="edit-profile-change-photo-button"
            accessibilityRole="button"
            accessibilityLabel={t('account.changePhoto')}
          >
            <View
              style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
            >
              {displayPictureUrl ? (
                <Image
                  key={displayPictureUrl}
                  source={{ uri: displayPictureUrl }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                  accessibilityIgnoresInvertColors
                  onError={(e) => {
                    logger.warn(
                      'EditProfileScreen',
                      'Profile image failed to load',
                      {
                        uri: displayPictureUrl,
                        error: e.nativeEvent?.error,
                      }
                    );
                  }}
                />
              ) : (
                <Text style={styles.avatarText}>{initial}</Text>
              )}
            </View>
            <View
              style={[
                styles.avatarEditBadge,
                {
                  backgroundColor: theme.colors.primary,
                  ...Platform.select({
                    ios: {
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                    },
                    android: { elevation: 3 },
                    default: {},
                  }),
                },
              ]}
            >
              {uploadingPhoto ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              )}
            </View>
          </TouchableOpacity>
        </View>

        <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
          {t('onboarding.signUp.name')}
        </Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={[
            styles.input,
            {
              color: theme.colors.text,
              borderColor: inputBorder,
              backgroundColor: inputSurface,
            },
          ]}
          placeholderTextColor={theme.colors.placeholder}
          autoCapitalize="words"
          editable={!saving}
        />

        <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
          {t('onboarding.signUp.email')}
        </Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={[
            styles.input,
            {
              color: theme.colors.text,
              borderColor: inputBorder,
              backgroundColor: inputSurface,
            },
          ]}
          placeholderTextColor={theme.colors.placeholder}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!saving}
        />

        <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
          {t('account.dateOfBirth')}
        </Text>
        <TextInput
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
          style={[
            styles.input,
            {
              color: theme.colors.text,
              borderColor: inputBorder,
              backgroundColor: inputSurface,
            },
          ]}
          placeholder="yyyy-MM-dd"
          placeholderTextColor={theme.colors.placeholder}
          editable={!saving}
        />

        <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
          {t('account.gender')}
        </Text>
        <TouchableOpacity
          style={[
            styles.input,
            styles.genderButton,
            {
              borderColor: inputBorder,
              backgroundColor: inputSurface,
            },
          ]}
          onPress={() => setGenderModalOpen(true)}
          disabled={saving}
        >
          <Text
            style={{
              color:
                gender === null ? theme.colors.placeholder : theme.colors.text,
            }}
          >
            {genderLabel}
          </Text>
          <Ionicons
            name="chevron-down"
            size={18}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => void handleSave()}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>
              {t('account.saveProfile')}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={genderModalOpen}
        animationType="fade"
        transparent
        onRequestClose={() => setGenderModalOpen(false)}
      >
        <View style={styles.modalRoot}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setGenderModalOpen(false)}
            accessibilityRole="button"
            accessibilityLabel={t('common.cancel')}
          />
          <View
            style={[
              styles.sheet,
              {
                backgroundColor: isDark ? theme.colors.surface : '#FFFFFF',
              },
            ]}
          >
            <View style={styles.sheetHandleWrap}>
              <View
                style={[
                  styles.sheetHandle,
                  { backgroundColor: theme.colors.border },
                ]}
              />
            </View>
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: theme.colors.text }]}>
                {t('account.chooseGender')}
              </Text>
              <TouchableOpacity
                onPress={() => setGenderModalOpen(false)}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel={t('common.cancel')}
              >
                <Ionicons
                  name="close"
                  size={26}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            {GENDERS.map((g) => (
              <TouchableOpacity
                key={g.value}
                style={[
                  styles.genderOption,
                  gender === g.value && {
                    backgroundColor: isDark
                      ? 'rgba(255,255,255,0.06)'
                      : 'rgba(0,0,0,0.04)',
                  },
                ]}
                onPress={() => {
                  setGender(g.value);
                  setGenderModalOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.genderOptionText,
                    { color: theme.colors.text },
                  ]}
                >
                  {t(g.key)}
                </Text>
                {gender === g.value ? (
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color={theme.colors.primary}
                  />
                ) : null}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[
                styles.sheetDone,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => setGenderModalOpen(false)}
            >
              <Text style={styles.sheetDoneText}>{t('common.ok')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 40,
  },
  avatarBlock: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarTouchable: {
    position: 'relative',
  },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '700',
  },
  avatarEditBadge: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 20,
  },
  genderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  saveButton: {
    marginTop: 12,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  modalRoot: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  modalBackdrop: {
    flex: 1,
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: Platform.select({ ios: 28, default: 20 }),
    paddingTop: 8,
  },
  sheetHandleWrap: {
    alignItems: 'center',
    marginBottom: 12,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  genderOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  sheetDone: {
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  sheetDoneText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});
