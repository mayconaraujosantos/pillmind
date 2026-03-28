import type { HomeTabParamList } from '@core/navigation/types';
import { Ionicons } from '@expo/vector-icons';
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

/**
 * Usando @expo/vector-icons em vez de HealthIcons
 * Mapeamento:
 * - capsule: Medicamentos em cápsula → medical (Ionicons)
 * - tablet: Comprimidos → tablet-portrait (Ionicons)
 * - injection: Injeções → medical-outline (Ionicons) 
 * - liquid: Líquidos → flask (Ionicons)
 */
const TYPE_VECTOR_ICONS: Record<MedicineTypeId, ComponentType<any>> = {
  capsule: (props: any) => <Ionicons name="medical" {...props} />,
  tablet: (props: any) => <Ionicons name="tablet-portrait" {...props} />,
  injection: (props: any) => <Ionicons name="medical-outline" {...props} />,
  liquid: (props: any) => <Ionicons name="flask" {...props} />,
};

export const MedicineFormScreenVectorIcons: React.FC = () => {
  console.log('🏥 MedicineFormScreenVectorIcons: Component starting with @expo/vector-icons...');
  
  try {
    // Logging para debug
    const { logNavEvent, logNavError } = useSimpleNavLogger('MedicineFormVectorIcons');
    console.log('🏥 MedicineFormScreenVectorIcons: Logger initialized');
    
    logNavEvent('Screen Loading Started');

    const route = useRoute<RouteProp<HomeTabParamList, 'MedicineForm'>>();
    const navigation =
      useNavigation<NativeStackNavigationProp<HomeTabParamList>>();
    
    console.log('🏥 MedicineFormScreenVectorIcons: Navigation hooks initialized');
    
    const { t } = useTranslation();
    const { theme, isDark } = useTheme();

    console.log('🏥 MedicineFormScreenVectorIcons: Theme and translation initialized');

    const medicineId = route.params?.medicineId;
    
    console.log('🏥 MedicineFormScreenVectorIcons: Medicine ID extracted:', medicineId);

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
    }, [medicineId, t, navigation, logNavEvent, logNavError]);

    const pickImage = React.useCallback(async () => {
      try {
        logNavEvent('Image picker opening');
        
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (permissionResult.granted === false) {
          logNavEvent('Image permission denied');
          Alert.alert(t('common.error'), t('home.imagePermissionDenied'));
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

        if (!result.canceled && result.assets?.[0]) {
          const asset = result.assets[0];
          logNavEvent('Image selected', { 
            uri: asset.uri,
            type: asset.type,
            size: asset.fileSize 
          });
          
          setLocalImageUri(asset.uri);
          setLocalImageMime(asset.type || 'image/jpeg');
          setImageCleared(false);
        } else {
          logNavEvent('Image selection cancelled');
        }
      } catch (error) {
        logNavError(error, 'Image picker');
        Alert.alert(t('common.error'), t('home.imagePickerFailed'));
      }
    }, [logNavEvent, logNavError, t]);

    const clearImage = React.useCallback(() => {
      logNavEvent('Image cleared');
      setLocalImageUri(undefined);
      setLocalImageMime(undefined);
      setImageCleared(true);
    }, [logNavEvent]);

    const handleSave = React.useCallback(async () => {
      if (!name.trim()) {
        Alert.alert(t('common.error'), t('home.nameRequired'));
        return;
      }

      setSaving(true);
      logNavEvent('Save started');

      try {
        const quantity = parseInt(quantityStr, 10) || 1;
        const times = parseDoseTimesField(timesStr);
        const startDate = parseISODateOnly(startStr) ?? new Date();
        const endDate = endStr ? parseISODateOnly(endStr) : undefined;

        // Upload image if there's a local image
        let imageUrl = serverImageUrl;
        if (localImageUri && localImageMime && !imageCleared) {
          logNavEvent('Uploading image');
          imageUrl = await uploadMedicinePicture(localImageUri, localImageMime);
          logNavEvent('Image uploaded', { imageUrl });
        } else if (imageCleared) {
          logNavEvent('Image cleared - removing from server');
          imageUrl = undefined;
        }

        const medicineData = {
          name: name.trim(),
          dosage: dosage.trim(),
          frequency,
          times,
          startDate,
          endDate,
          notes: notes.trim(),
          medicineType,
          prescribedFor: prescribedFor.trim(),
          quantity,
          reminderOnEmpty,
          imageUrl,
        };

        logNavEvent('Medicine data prepared', medicineData);

        if (medicineId) {
          logNavEvent('Updating existing medicine');
          await updateMedicineUseCase.execute(medicineId, medicineData);
          logNavEvent('Medicine updated successfully');
        } else {
          logNavEvent('Creating new medicine');
          await createMedicineUseCase.execute(medicineData);
          logNavEvent('Medicine created successfully');
        }

        navigation.goBack();
      } catch (error) {
        logNavError(error, 'Save medicine');
        Alert.alert(t('common.error'), t('home.saveFailed'));
      } finally {
        setSaving(false);
      }
    }, [
      name,
      dosage,
      frequency,
      timesStr,
      startStr,
      endStr,
      notes,
      medicineType,
      prescribedFor,
      quantityStr,
      reminderOnEmpty,
      localImageUri,
      localImageMime,
      imageCleared,
      serverImageUrl,
      medicineId,
      navigation,
      t,
      logNavEvent,
      logNavError,
    ]);

    if (bootLoading) {
      return (
        <ScreenWrapper tabContentCanvas homeSoftTint>
          <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.text }]}>
              {t('home.loadingMedicine')}
            </Text>
          </View>
        </ScreenWrapper>
      );
    }

    const displayedImageUri = resolveMedicineImageUrlForDevice(
      imageCleared
        ? undefined
        : localImageUri || serverImageUrl
    );

    return (
      <ScreenWrapper tabContentCanvas homeSoftTint>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              💊 Medicine Form with Vector Icons
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Using @expo/vector-icons instead of HealthIcons
            </Text>

            {/* Medicine Name */}
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {t('home.medicineName')}
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={t('home.enterMedicineName')}
              style={[
                styles.input,
                {
                  backgroundColor: inputSurface,
                  borderColor: inputBorder,
                  color: theme.colors.text,
                },
              ]}
              placeholderTextColor={theme.colors.placeholder}
              autoFocus={!medicineId}
            />

            {/* Dosage */}
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {t('home.dosage')}
            </Text>
            <TextInput
              value={dosage}
              onChangeText={setDosage}
              placeholder={t('home.enterDosage')}
              style={[
                styles.input,
                {
                  backgroundColor: inputSurface,
                  borderColor: inputBorder,
                  color: theme.colors.text,
                },
              ]}
              placeholderTextColor={theme.colors.placeholder}
            />

            {/* Medicine Type - Vector Icons */}
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Medicine Type (Vector Icons)
            </Text>
            <View style={styles.typeGrid}>
              {MEDICINE_TYPE_IDS.map((typeId) => {
                const selected = medicineType === typeId;
                const VectorIcon = TYPE_VECTOR_ICONS[typeId];
                const iconColor = selected ? theme.colors.primary : theme.colors.textSecondary;
                
                return (
                  <Pressable
                    key={typeId}
                    onPress={() => setMedicineType(typeId)}
                    style={({ pressed }) => [
                      styles.typeChip,
                      {
                        borderColor: selected ? theme.colors.primary : inputBorder,
                        backgroundColor: selected 
                          ? theme.colors.primary + '22' 
                          : inputSurface,
                      },
                      pressed && { opacity: 0.85 },
                    ]}
                  >
                    <VectorIcon size={24} color={iconColor} />
                    <Text
                      style={[
                        styles.typeLabel,
                        { 
                          color: iconColor,
                          marginTop: 4,
                        },
                      ]}
                    >
                      {typeId}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Frequency */}
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {t('home.frequency')}
            </Text>
            <View style={styles.frequencyGrid}>
              {['once-a-day', 'twice-a-day', 'three-times-a-day', 'four-times-a-day'].map((freq) => (
                <Pressable
                  key={freq}
                  onPress={() => setFrequency(freq)}
                  style={({ pressed }) => [
                    styles.frequencyChip,
                    {
                      borderColor: frequency === freq ? theme.colors.primary : inputBorder,
                      backgroundColor: frequency === freq 
                        ? theme.colors.primary + '22' 
                        : inputSurface,
                    },
                    pressed && { opacity: 0.85 },
                  ]}
                >
                  <Text
                    style={[
                      styles.frequencyText,
                      { 
                        color: frequency === freq 
                          ? theme.colors.primary 
                          : theme.colors.text,
                      },
                    ]}
                  >
                    {freq.replace(/-/g, ' ')}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Times */}
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {t('home.times')} (8:00, 16:00)
            </Text>
            <TextInput
              value={timesStr}
              onChangeText={setTimesStr}
              placeholder="8:00, 16:00, 22:00"
              style={[
                styles.input,
                {
                  backgroundColor: inputSurface,
                  borderColor: inputBorder,
                  color: theme.colors.text,
                },
              ]}
              placeholderTextColor={theme.colors.placeholder}
            />

            {/* Start Date */}
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {t('home.startDate')}
            </Text>
            <TextInput
              value={startStr}
              onChangeText={setStartStr}
              placeholder="YYYY-MM-DD"
              style={[
                styles.input,
                {
                  backgroundColor: inputSurface,
                  borderColor: inputBorder,
                  color: theme.colors.text,
                },
              ]}
              placeholderTextColor={theme.colors.placeholder}
            />

            {/* End Date */}
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {t('home.endDate')} ({t('common.optional')})
            </Text>
            <TextInput
              value={endStr}
              onChangeText={setEndStr}
              placeholder="YYYY-MM-DD"
              style={[
                styles.input,
                {
                  backgroundColor: inputSurface,
                  borderColor: inputBorder,
                  color: theme.colors.text,
                },
              ]}
              placeholderTextColor={theme.colors.placeholder}
            />

            {/* Quantity */}
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {t('home.quantity')}
            </Text>
            <TextInput
              value={quantityStr}
              onChangeText={setQuantityStr}
              placeholder="1"
              keyboardType="numeric"
              style={[
                styles.input,
                {
                  backgroundColor: inputSurface,
                  borderColor: inputBorder,
                  color: theme.colors.text,
                },
              ]}
              placeholderTextColor={theme.colors.placeholder}
            />

            {/* Prescribed For */}
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {t('home.prescribedFor')} ({t('common.optional')})
            </Text>
            <TextInput
              value={prescribedFor}
              onChangeText={setPrescribedFor}
              placeholder={t('home.enterPrescribedFor')}
              style={[
                styles.input,
                {
                  backgroundColor: inputSurface,
                  borderColor: inputBorder,
                  color: theme.colors.text,
                },
              ]}
              placeholderTextColor={theme.colors.placeholder}
            />

            {/* Notes */}
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {t('home.notes')} ({t('common.optional')})
            </Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder={t('home.enterNotes')}
              multiline
              numberOfLines={3}
              style={[
                styles.input,
                styles.notesInput,
                {
                  backgroundColor: inputSurface,
                  borderColor: inputBorder,
                  color: theme.colors.text,
                },
              ]}
              placeholderTextColor={theme.colors.placeholder}
            />

            {/* Reminder Switch */}
            <View style={styles.switchRow}>
              <Text style={[styles.switchLabel, { color: theme.colors.text }]}>
                {t('home.reminderOnEmpty')}
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

            {/* Medicine Image */}
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {t('home.medicineImage')} ({t('common.optional')})
            </Text>
            <View style={styles.imageSection}>
              {displayedImageUri ? (
                <View style={styles.imageContainer}>
                  <Image source={{ uri: displayedImageUri }} style={styles.medicineImage} />
                  <TouchableOpacity 
                    style={[styles.imageAction, { backgroundColor: theme.colors.error }]}
                    onPress={clearImage}
                  >
                    <Ionicons name="trash" size={16} color="white" />
                    <Text style={styles.imageActionText}>{t('home.removeImage')}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  style={[styles.imagePicker, { borderColor: inputBorder, backgroundColor: inputSurface }]}
                  onPress={pickImage}
                >
                  <Ionicons name="camera" size={32} color={theme.colors.textSecondary} />
                  <Text style={[styles.imagePickerText, { color: theme.colors.textSecondary }]}>
                    {t('home.addImage')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={[
                styles.saveButton,
                { 
                  backgroundColor: theme.colors.primary,
                  opacity: saving ? 0.7 : 1,
                },
              ]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Ionicons name="checkmark" size={20} color="white" />
                  <Text style={styles.saveButtonText}>
                    {medicineId ? t('home.updateMedicine') : t('home.saveMedicine')}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </ScreenWrapper>
    );

  } catch (error) {
    console.error('🏥 MedicineFormScreenVectorIcons Error:', error);
    logNavError(error, 'Component render');
    
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Vector Icons Medicine Form Error!</Text>
        <Text>{error instanceof Error ? error.message : 'Unknown error'}</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  typeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  typeChip: {
    padding: 12,
    borderWidth: 2,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  frequencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  frequencyChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 6,
    minWidth: '45%',
    alignItems: 'center',
  },
  frequencyText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
    paddingVertical: 10,
  },
  switchLabel: {
    fontSize: 16,
    flex: 1,
  },
  imageSection: {
    marginVertical: 10,
  },
  imagePicker: {
    height: 120,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerText: {
    marginTop: 8,
    fontSize: 16,
  },
  imageContainer: {
    position: 'relative',
  },
  medicineImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  imageAction: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  imageActionText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
  },
  saveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 30,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffebee',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 10,
  },
});


