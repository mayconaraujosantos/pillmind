import { getAppHeaderChrome } from '@core/navigation/appHeaderChrome';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@shared/components';
import { useSimpleNavLogger } from '@shared/hooks';
import { useTranslation } from '@shared/i18n';
import { useTheme } from '@shared/theme';
import { resolveMedicineImageUrlForDevice } from '@shared/utils/medicineImageUrl';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import type { ComponentProps, ComponentType } from 'react';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  createMedicineUseCase,
  getMedicineByIdUseCase,
  updateMedicineUseCase,
  uploadMedicinePicture,
} from '../../medicineServices';
import { EndDatePicker } from '../components/EndDatePicker';
import { FrequencyPicker } from '../components/FrequencyPicker';
import { StartDatePicker } from '../components/StartDatePicker';
import { TimePicker } from '../components/TimePicker';

const MEDICINE_TYPE_IDS = ['capsule', 'tablet', 'injection', 'liquid'] as const;

type MedicineTypeId = (typeof MEDICINE_TYPE_IDS)[number];
type MedicineIconProps = Pick<
  ComponentProps<typeof FontAwesome5>,
  'color' | 'size'
>;

/** Ícones FontAwesome5 específicos para medicamentos! 💊 */
const TYPE_HEALTH_ICONS: Record<
  MedicineTypeId,
  ComponentType<MedicineIconProps>
> = {
  // Cápsulas - Ícone perfeito de cápsulas
  capsule: ({ color, size = 24 }) => (
    <FontAwesome5 name="capsules" size={size} color={color} />
  ),
  // Comprimidos - Ícone de pílulas/comprimidos
  tablet: ({ color, size = 24 }) => (
    <FontAwesome5 name="pills" size={size} color={color} />
  ),
  // Injeções - Ícone de seringa
  injection: ({ color, size = 24 }) => (
    <FontAwesome5 name="syringe" size={size} color={color} />
  ),
  // Líquidos - Ícone de frasco/medicamento líquido
  liquid: ({ color, size = 24 }) => (
    <FontAwesome5 name="prescription-bottle" size={size} color={color} />
  ),
};

export const MedicineFormScreen: React.FC = () => {
  console.log('🏥 MedicineFormScreen: Component starting...');

  try {
    // Logging para debug
    const { logNavEvent, logNavError } = useSimpleNavLogger('MedicineForm');
    console.log('🏥 MedicineFormScreen: Logger initialized');

    logNavEvent('Screen Loading Started');

    const router = useRouter();

    console.log('🏥 MedicineFormScreen: Navigation hooks initialized');

    const { t } = useTranslation();
    const { theme, isDark } = useTheme();

    console.log('🏥 MedicineFormScreen: Theme and translation initialized');

    const { medicineId: rawMedicineId } = useLocalSearchParams<{
      medicineId?: string | string[];
    }>();
    const medicineId = Array.isArray(rawMedicineId)
      ? rawMedicineId[0]
      : rawMedicineId;

    console.log('🏥 MedicineFormScreen: Medicine ID extracted:', medicineId);

    logNavEvent('Medicine ID extracted', { medicineId });

    const [bootLoading, setBootLoading] = React.useState(Boolean(medicineId));
    const [saving, setSaving] = React.useState(false);
    const [name, setName] = React.useState('');
    const [dosage, setDosage] = React.useState('');
    const [frequency, setFrequency] = React.useState('once-a-day');
    const [times, setTimes] = React.useState<string[]>(['08:00']);
    const [startDate, setStartDate] = React.useState(new Date());
    const [endDate, setEndDate] = React.useState<Date | undefined>(undefined);
    const [notes, setNotes] = React.useState('');
    const [medicineType, setMedicineType] =
      React.useState<MedicineTypeId>('capsule');
    const [prescribedFor, setPrescribedFor] = React.useState('');
    const [quantityStr, setQuantityStr] = React.useState('1');
    const [reminderOnEmpty, setReminderOnEmpty] = React.useState(true);
    const [serverImageUrl, setServerImageUrl] = React.useState<
      string | undefined
    >();
    const [localImageUri, setLocalImageUri] = React.useState<
      string | undefined
    >();
    const [localImageMime, setLocalImageMime] = React.useState<
      string | undefined
    >();
    const [imageCleared, setImageCleared] = React.useState(false);

    const inputSurface = theme.colors.surface;
    const inputBorder = theme.colors.border;

    React.useEffect(() => {
      logNavEvent('Data loading effect started', { medicineId });

      if (!medicineId) {
        logNavEvent('No medicineId - setting boot loading to false');
        setBootLoading(false);
        return;
      }

      let cancelled = false;
      (async () => {
        try {
          logNavEvent('Fetching medicine data', { medicineId });
          const m = await getMedicineByIdUseCase.execute(medicineId);

          logNavEvent('Medicine data fetched', { found: !!m });

          if (cancelled) {
            logNavEvent('Request cancelled');
            return;
          }

          if (!m) {
            logNavEvent('Medicine not found', { medicineId });
            Alert.alert(t('common.error'), t('home.medicineNotFound'), [
              { text: t('common.ok'), onPress: () => router.back() },
            ]);
            return;
          }

          logNavEvent('Setting medicine data to form');

          setName(m.name);
          setDosage(m.dosage);
          setFrequency(m.frequency);
          setTimes(m.times.length > 0 ? [...m.times] : ['08:00']);
          setStartDate(new Date(m.startDate));
          setEndDate(m.endDate ? new Date(m.endDate) : undefined);
          setNotes(m.notes ?? '');
          const mt = (m.medicineType ?? 'capsule') as MedicineTypeId;
          setMedicineType(
            (MEDICINE_TYPE_IDS as readonly string[]).includes(mt)
              ? mt
              : 'capsule'
          );
          setPrescribedFor(m.prescribedFor ?? '');
          setQuantityStr(String(m.quantity ?? 1));
          setReminderOnEmpty(m.reminderOnEmpty ?? true);
          setServerImageUrl(m.imageUrl);
          setLocalImageUri(undefined);
          setLocalImageMime(undefined);
          setImageCleared(false);

          logNavEvent('Medicine data set successfully');
        } catch (error) {
          logNavError(error, 'Loading medicine data');

          if (!cancelled) {
            Alert.alert(t('common.error'), t('home.medicineLoadFailed'), [
              { text: t('common.ok'), onPress: () => router.back() },
            ]);
          }
        } finally {
          if (!cancelled) setBootLoading(false);
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [medicineId, router, t]);

    const pickMedicinePhoto = async () => {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(t('common.error'), t('home.medicinePhotoPermissionDenied'));
        return;
      }
      const picked = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.85,
      });
      if (picked.canceled || !picked.assets?.[0]) return;
      const a = picked.assets[0];
      setLocalImageUri(a.uri);
      setLocalImageMime(a.mimeType ?? 'image/jpeg');
      setImageCleared(false);
    };

    const clearMedicinePhoto = () => {
      setLocalImageUri(undefined);
      setLocalImageMime(undefined);
      setImageCleared(true);
    };

    const displayImageUri = resolveMedicineImageUrlForDevice(
      localImageUri ?? (!imageCleared ? serverImageUrl : undefined)
    );

    const bumpQuantity = (delta: number) => {
      const n = Math.max(
        1,
        (parseInt(quantityStr.replace(/\D/g, ''), 10) || 1) + delta
      );
      setQuantityStr(String(n));
    };

    const onSave = async () => {
      logNavEvent('Save function started');

      try {
        const trimmedName = name.trim();
        const trimmedDosage = dosage.trim();
        const start = startDate;

        logNavEvent('Save validation', {
          hasName: !!trimmedName,
          hasDosage: !!trimmedDosage,
          hasStart: !!start,
        });

        if (!trimmedName || !trimmedDosage || !start) {
          logNavEvent('Save validation failed');
          Alert.alert(t('common.error'), t('home.medicineFormValidation'));
          return;
        }

        const qty = Math.max(
          1,
          parseInt(quantityStr.replace(/\D/g, ''), 10) || 1
        );

        logNavEvent('Starting save process', { medicineId });
        setSaving(true);

        let imageUrl: string | undefined;
        if (localImageUri) {
          imageUrl = await uploadMedicinePicture(localImageUri, localImageMime);
        } else if (!imageCleared) {
          imageUrl = serverImageUrl;
        }

        const payload = {
          name: trimmedName,
          dosage: trimmedDosage,
          frequency: frequency.trim() || 'once-a-day',
          times,
          startDate: start,
          endDate: endDate,
          notes: notes.trim() ? notes.trim() : undefined,
          medicineType,
          prescribedFor: prescribedFor.trim() || undefined,
          quantity: qty,
          reminderOnEmpty,
          imageUrl,
        };

        if (medicineId) {
          await updateMedicineUseCase.execute(medicineId, payload);
          router.back();
        } else {
          const created = await createMedicineUseCase.execute(payload);
          router.back();
          // Ask user if they want to configure reminders for the new medicine
          setTimeout(() => {
            Alert.alert(
              t('home.reminderSetupTitle'),
              t('home.reminderSetupMessage'),
              [
                { text: t('common.cancel'), style: 'cancel' },
                {
                  text: t('home.reminderSetupCta'),
                  onPress: () =>
                    router.push({
                      pathname: '/medicine-reminders',
                      params: {
                        medicineId: created.id,
                        medicineName: created.name,
                      },
                    }),
                },
              ]
            );
          }, 400);
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : t('common.error');
        Alert.alert(t('common.error'), msg);
        logNavError(
          e instanceof Error ? e : new Error('Unknown error'),
          'Save operation failed'
        );
      } finally {
        setSaving(false);
      }
    };

    if (bootLoading) {
      return (
        <ScreenWrapper tabContentCanvas homeSoftTint>
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        </ScreenWrapper>
      );
    }

    return (
      <ScreenWrapper tabContentCanvas homeSoftTint>
        <Stack.Screen
          options={{
            title: medicineId
              ? t('home.editMedication')
              : t('home.newMedication'),
            ...getAppHeaderChrome({
              theme,
              isDark,
              contentBackgroundColor: theme.colors.background,
            }),
          }}
        />
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              {t('home.medicineNameLabel')}
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={t('home.medicineNamePlaceholder')}
              placeholderTextColor={theme.colors.placeholder}
              style={[
                styles.input,
                {
                  backgroundColor: inputSurface,
                  borderColor: inputBorder,
                  color: theme.colors.text,
                },
              ]}
            />

            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              {t('home.medicineTypeLabel')}
            </Text>
            <View style={styles.typeRow}>
              {MEDICINE_TYPE_IDS.map((id) => {
                const selected = medicineType === id;
                const HealthIcon = TYPE_HEALTH_ICONS[id];
                const iconColor = selected
                  ? theme.colors.primary
                  : theme.colors.textSecondary;
                return (
                  <Pressable
                    key={id}
                    onPress={() => setMedicineType(id)}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    accessibilityLabel={t(`home.medicineType_${id}`)}
                    style={({ pressed }) => [
                      styles.typeChip,
                      {
                        borderColor: selected
                          ? theme.colors.primary
                          : inputBorder,
                        backgroundColor: selected
                          ? theme.colors.primary + '22'
                          : inputSurface,
                      },
                      pressed && { opacity: 0.85 },
                    ]}
                  >
                    <HealthIcon size={28} color={iconColor} />
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              {t('home.medicinePrescribedForLabel')}
            </Text>
            <TextInput
              value={prescribedFor}
              onChangeText={setPrescribedFor}
              placeholder={t('home.medicinePrescribedForPlaceholder')}
              placeholderTextColor={theme.colors.placeholder}
              style={[
                styles.input,
                {
                  backgroundColor: inputSurface,
                  borderColor: inputBorder,
                  color: theme.colors.text,
                },
              ]}
            />

            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              {t('home.medicineQuantityLabel')}
            </Text>
            <View style={styles.quantityRow}>
              <TouchableOpacity
                onPress={() => bumpQuantity(-1)}
                style={[
                  styles.qtyBtn,
                  { borderColor: inputBorder, backgroundColor: inputSurface },
                ]}
                accessibilityRole="button"
                accessibilityLabel={t('home.medicineQuantityDecrease')}
              >
                <Text style={[styles.qtyBtnText, { color: theme.colors.text }]}>
                  −
                </Text>
              </TouchableOpacity>
              <TextInput
                value={quantityStr}
                onChangeText={setQuantityStr}
                keyboardType="number-pad"
                style={[
                  styles.qtyInput,
                  {
                    backgroundColor: inputSurface,
                    borderColor: inputBorder,
                    color: theme.colors.text,
                  },
                ]}
              />
              <TouchableOpacity
                onPress={() => bumpQuantity(1)}
                style={[
                  styles.qtyBtn,
                  { borderColor: inputBorder, backgroundColor: inputSurface },
                ]}
                accessibilityRole="button"
                accessibilityLabel={t('home.medicineQuantityIncrease')}
              >
                <Text style={[styles.qtyBtnText, { color: theme.colors.text }]}>
                  +
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.switchRow}>
              <Text style={[styles.switchLabel, { color: theme.colors.text }]}>
                {t('home.medicineReminderOnEmptyLabel')}
              </Text>
              <Switch
                value={reminderOnEmpty}
                onValueChange={setReminderOnEmpty}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary + '88',
                }}
                thumbColor={reminderOnEmpty ? theme.colors.primary : '#f4f3f4'}
              />
            </View>

            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              {t('home.medicinePhotoLabel')}
            </Text>
            {displayImageUri ? (
              <View style={styles.photoPreviewWrap}>
                <Image
                  source={{ uri: displayImageUri }}
                  style={styles.photoPreview}
                  accessibilityIgnoresInvertColors
                />
                <View style={styles.photoActions}>
                  <TouchableOpacity
                    onPress={() => void pickMedicinePhoto()}
                    style={[
                      styles.photoSecondaryBtn,
                      { borderColor: theme.colors.primary },
                    ]}
                  >
                    <Text
                      style={[
                        styles.photoSecondaryBtnText,
                        { color: theme.colors.primary },
                      ]}
                    >
                      {t('home.medicinePhotoChange')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={clearMedicinePhoto}
                    style={[
                      styles.photoSecondaryBtn,
                      { borderColor: theme.colors.border },
                    ]}
                  >
                    <Text
                      style={[
                        styles.photoSecondaryBtnText,
                        { color: theme.colors.textSecondary },
                      ]}
                    >
                      {t('home.medicinePhotoRemove')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => void pickMedicinePhoto()}
                style={[
                  styles.photoPlaceholder,
                  {
                    borderColor: inputBorder,
                    backgroundColor: inputSurface,
                  },
                ]}
                activeOpacity={0.85}
              >
                <Ionicons
                  name="image-outline"
                  size={32}
                  color={theme.colors.textSecondary}
                />
                <Text
                  style={[
                    styles.photoPlaceholderText,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {t('home.medicinePhotoPick')}
                </Text>
              </TouchableOpacity>
            )}

            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              {t('home.medicineDosageLabel')}
            </Text>
            <TextInput
              value={dosage}
              onChangeText={setDosage}
              placeholder={t('home.medicineDosagePlaceholder')}
              placeholderTextColor={theme.colors.placeholder}
              style={[
                styles.input,
                {
                  backgroundColor: inputSurface,
                  borderColor: inputBorder,
                  color: theme.colors.text,
                },
              ]}
            />

            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              {t('home.medicineFrequencyLabel')}
            </Text>
            <FrequencyPicker
              value={frequency}
              onChange={setFrequency}
              onTimeSuggestion={(suggested) => {
                // Only auto-fill times if the user hasn't customised them yet
                // (i.e. the current times are the default or empty)
                setTimes(suggested);
              }}
              primaryColor={theme.colors.primary}
              surface={inputSurface}
              border={inputBorder}
              textColor={theme.colors.text}
              textSecondary={theme.colors.textSecondary}
            />

            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              {t('home.medicineTimesLabel')}
            </Text>
            <TimePicker
              times={times}
              onChange={setTimes}
              primaryColor={theme.colors.primary}
              surface={inputSurface}
              border={inputBorder}
              textColor={theme.colors.text}
              textSecondary={theme.colors.textSecondary}
              background={theme.colors.background}
            />

            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              {t('home.medicineStartLabel')}
            </Text>
            <StartDatePicker
              startDate={startDate}
              onChange={setStartDate}
              primaryColor={theme.colors.primary}
              surface={inputSurface}
              border={inputBorder}
              textColor={theme.colors.text}
              textSecondary={theme.colors.textSecondary}
              background={theme.colors.background}
            />

            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              {t('home.medicineEndLabel')}
            </Text>
            <EndDatePicker
              endDate={endDate}
              onChange={setEndDate}
              primaryColor={theme.colors.primary}
              surface={inputSurface}
              border={inputBorder}
              textColor={theme.colors.text}
              textSecondary={theme.colors.textSecondary}
              background={theme.colors.background}
            />

            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              {t('home.medicineNotesLabel')}
            </Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder={t('home.medicineNotesPlaceholder')}
              placeholderTextColor={theme.colors.placeholder}
              multiline
              numberOfLines={3}
              style={[
                styles.input,
                styles.textArea,
                {
                  backgroundColor: inputSurface,
                  borderColor: inputBorder,
                  color: theme.colors.text,
                },
              ]}
            />

            {/* Reminders button — only visible when editing an existing medicine */}
            {medicineId ? (
              <TouchableOpacity
                style={[
                  styles.remindersBtn,
                  {
                    borderColor: theme.colors.primary,
                    backgroundColor: theme.colors.primary + '14',
                  },
                ]}
                onPress={() =>
                  router.push({
                    pathname: '/medicine-reminders',
                    params: {
                      medicineId,
                      medicineName: name.trim() || t('home.editMedication'),
                    },
                  })
                }
                activeOpacity={0.85}
              >
                <Ionicons
                  name="alarm-outline"
                  size={18}
                  color={theme.colors.primary}
                />
                <Text
                  style={[
                    styles.remindersBtnText,
                    { color: theme.colors.primary },
                  ]}
                >
                  {t('home.manageReminders')}
                </Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              style={[
                styles.saveBtn,
                { backgroundColor: theme.colors.primary },
                saving && { opacity: 0.7 },
              ]}
              onPress={() => void onSave()}
              disabled={saving}
              activeOpacity={0.85}
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveBtnText}>{t('home.medicineSave')}</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </ScreenWrapper>
    );
  } catch (error) {
    console.error('🏥 MedicineFormScreen: Critical error:', error);

    // Fallback UI
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
        <Text style={{ fontSize: 18, color: 'red', marginBottom: 10 }}>
          Erro na tela de medicamentos
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: '#666',
            textAlign: 'center',
            marginBottom: 20,
          }}
        >
          {error instanceof Error ? error.message : 'Erro desconhecido'}
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 32,
    paddingTop: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 14,
    marginBottom: 6,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
  remindersBtn: {
    marginTop: 20,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  remindersBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  saveBtn: {
    marginTop: 12,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  typeRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  typeChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 52,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  qtyBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    fontSize: 22,
    fontWeight: '600',
  },
  qtyInput: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingVertical: 4,
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    paddingRight: 12,
  },
  photoPreviewWrap: {
    marginTop: 4,
  },
  photoPreview: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    backgroundColor: '#00000014',
  },
  photoActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  photoSecondaryBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  photoSecondaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  photoPlaceholder: {
    marginTop: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    borderStyle: 'dashed',
    paddingVertical: 28,
    alignItems: 'center',
    gap: 8,
  },
  photoPlaceholderText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
