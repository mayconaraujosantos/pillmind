import type { HomeTabParamList } from '@core/navigation/types';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenWrapper } from '@shared/components';
import { useSimpleNavLogger } from '@shared/hooks';
import { useTranslation } from '@shared/i18n';
import { useTheme } from '@shared/theme';
import { resolveMedicineImageUrlForDevice } from '@shared/utils/medicineImageUrl';
import * as ImagePicker from 'expo-image-picker';
import type { ComponentType } from 'react';
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
// Removed SvgProps import - using Vector Icons instead
import {
  createMedicineUseCase,
  getMedicineByIdUseCase,
  updateMedicineUseCase,
  uploadMedicinePicture,
} from '../../medicineServices';
import {
  formatDateInput,
  parseDoseTimesField,
  parseISODateOnly,
} from '../utils/medicineFormParse';

const MEDICINE_TYPE_IDS = [
  'capsule',
  'tablet',
  'injection',
  'liquid',
] as const;

type MedicineTypeId = (typeof MEDICINE_TYPE_IDS)[number];

/** Ícones FontAwesome5 específicos para medicamentos! 💊 */
const TYPE_HEALTH_ICONS: Record<MedicineTypeId, ComponentType<any>> = {
  // Cápsulas - Ícone perfeito de cápsulas
  capsule: (props: any) => <FontAwesome5 name="capsules" size={24} color={props.color} />,
  // Comprimidos - Ícone de pílulas/comprimidos  
  tablet: (props: any) => <FontAwesome5 name="pills" size={24} color={props.color} />,
  // Injeções - Ícone de seringa
  injection: (props: any) => <FontAwesome5 name="syringe" size={24} color={props.color} />,
  // Líquidos - Ícone de frasco/medicamento líquido
  liquid: (props: any) => <FontAwesome5 name="prescription-bottle" size={24} color={props.color} />,
};

export const MedicineFormScreen: React.FC = () => {
  console.log('🏥 MedicineFormScreen: Component starting...');
  
  try {
    // Logging para debug
    const { logNavEvent, logNavError } = useSimpleNavLogger('MedicineForm');
    console.log('🏥 MedicineFormScreen: Logger initialized');
    
    logNavEvent('Screen Loading Started');

    const route = useRoute<RouteProp<HomeTabParamList, 'MedicineForm'>>();
    const navigation =
      useNavigation<NativeStackNavigationProp<HomeTabParamList>>();
    
    console.log('🏥 MedicineFormScreen: Navigation hooks initialized');
    
    const { t } = useTranslation();
    const { theme, isDark } = useTheme();

    console.log('🏥 MedicineFormScreen: Theme and translation initialized');

    const medicineId = route.params?.medicineId;
    
    console.log('🏥 MedicineFormScreen: Medicine ID extracted:', medicineId);

    logNavEvent('Medicine ID extracted', { medicineId });

  const [bootLoading, setBootLoading] = React.useState(Boolean(medicineId));
  const [saving, setSaving] = React.useState(false);
  const [name, setName] = React.useState('');
  const [dosage, setDosage] = React.useState('');
  const [frequency, setFrequency] = React.useState('once-a-day');
  const [timesStr, setTimesStr] = React.useState('');
  const [startStr, setStartStr] = React.useState(() =>
    formatDateInput(new Date())
  );
  const [endStr, setEndStr] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [medicineType, setMedicineType] = React.useState<MedicineTypeId>(
    'capsule'
  );
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

  const inputSurface = isDark ? theme.colors.surface : '#F0F0F0';
  const inputBorder = theme.colors.border;

  React.useLayoutEffect(() => {
    logNavEvent('Navigation header setup starting');
    try {
      navigation.setOptions({
        headerTitle: medicineId
          ? t('home.editMedication')
          : t('home.newMedication'),
      });
      logNavEvent('Navigation header setup completed');
    } catch (error) {
      logNavError(error, 'Navigation header setup');
    }
  }, [navigation, medicineId, t]);

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
            { text: t('common.ok'), onPress: () => navigation.goBack() },
          ]);
          return;
        }
        
        logNavEvent('Setting medicine data to form');
        
        setName(m.name);
        setDosage(m.dosage);
        setFrequency(m.frequency);
        setTimesStr(m.times.join(', '));
        setStartStr(formatDateInput(new Date(m.startDate)));
        setEndStr(m.endDate ? formatDateInput(new Date(m.endDate)) : '');
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
            { text: t('common.ok'), onPress: () => navigation.goBack() },
          ]);
        }
      } finally {
        if (!cancelled) setBootLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [medicineId, navigation, t]);

  const pickMedicinePhoto = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        t('common.error'),
        t('home.medicinePhotoPermissionDenied')
      );
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
    localImageUri ??
    (!imageCleared ? serverImageUrl : undefined)
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
      const start = parseISODateOnly(startStr);
      
      logNavEvent('Save validation', { 
        hasName: !!trimmedName, 
        hasDosage: !!trimmedDosage, 
        hasStart: !!start 
      });
      
      if (!trimmedName || !trimmedDosage || !start) {
        logNavEvent('Save validation failed');
        Alert.alert(t('common.error'), t('home.medicineFormValidation'));
        return;
      }
      
      let endDateOut: Date | undefined;
      if (endStr.trim()) {
        const ed = parseISODateOnly(endStr);
        if (!ed) {
          logNavError(new Error('Invalid end date'), 'Date parsing');
          Alert.alert(t('common.error'), t('home.medicineEndDateInvalid'));
          return;
        }
        endDateOut = ed;
      }
      
      const times = parseDoseTimesField(timesStr);
      const qty = Math.max(
        1,
        parseInt(quantityStr.replace(/\D/g, ''), 10) || 1
      );
      
      logNavEvent('Starting save process', { medicineId });
      setSaving(true);
      
      let imageUrl: string | undefined;
      if (localImageUri) {
        imageUrl = await uploadMedicinePicture(
          localImageUri,
          localImageMime
        );
      } else if (!imageCleared) {
        imageUrl = serverImageUrl;
      }
      
      const payload = {
        name: trimmedName,
        dosage: trimmedDosage,
        frequency: frequency.trim() || 'once-a-day',
        times,
        startDate: start,
        endDate: endDateOut,
        notes: notes.trim() ? notes.trim() : undefined,
        medicineType,
        prescribedFor: prescribedFor.trim() || undefined,
        quantity: qty,
        reminderOnEmpty,
        imageUrl,
      };
      
      if (medicineId) {
        await updateMedicineUseCase.execute(medicineId, payload);
      } else {
        await createMedicineUseCase.execute(payload);
      }
      
      navigation.goBack();
    } catch (e) {
      const msg = e instanceof Error ? e.message : t('common.error');
      Alert.alert(t('common.error'), msg);
      logNavError(e instanceof Error ? e : new Error('Unknown error'), 'Save operation failed');
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
            <Text
              style={[styles.switchLabel, { color: theme.colors.text }]}
            >
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
          <TextInput
            value={frequency}
            onChangeText={setFrequency}
            placeholder={t('home.medicineFrequencyPlaceholder')}
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
            {t('home.medicineTimesLabel')}
          </Text>
          <TextInput
            value={timesStr}
            onChangeText={setTimesStr}
            placeholder={t('home.medicineTimesPlaceholder')}
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
            {t('home.medicineStartLabel')}
          </Text>
          <TextInput
            value={startStr}
            onChangeText={setStartStr}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme.colors.placeholder}
            autoCapitalize="none"
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
            {t('home.medicineEndLabel')}
          </Text>
          <TextInput
            value={endStr}
            onChangeText={setEndStr}
            placeholder={t('home.medicineEndPlaceholder')}
            placeholderTextColor={theme.colors.placeholder}
            autoCapitalize="none"
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, color: 'red', marginBottom: 10 }}>
          Erro na tela de medicamentos
        </Text>
        <Text style={{ fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 }}>
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
  saveBtn: {
    marginTop: 28,
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
