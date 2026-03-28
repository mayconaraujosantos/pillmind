import type { HomeTabParamList } from '@core/navigation/HomeTabNavigator';
import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenWrapper } from '@shared/components';
import { useSimpleNavLogger } from '@shared/hooks';
import { useTheme } from '@shared/theme';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
// USANDO IONICONS COMO FALLBACK (que funcionam)
import { Ionicons } from '@expo/vector-icons';

/**
 * VERSÃO COM CORREÇÃO: Usando Ionicons em vez de HealthIcons problemáticos
 */
export const MedicineFormScreenFixed: React.FC = () => {
  console.log('🔧 Fixed: Component starting...');
  
  try {
    const { logNavEvent } = useSimpleNavLogger('Fixed');
    const route = useRoute<RouteProp<HomeTabParamList, 'MedicineForm'>>();
    const navigation = useNavigation<NativeStackNavigationProp<HomeTabParamList>>();
    const { t } = useTranslation();
    const { theme, isDark } = useTheme();

    const medicineId = route.params?.medicineId;
    
    const [name, setName] = React.useState('');
    const [dosage, setDosage] = React.useState(''); 
    const [medicineType, setMedicineType] = React.useState('capsule');
    const [reminderOnEmpty, setReminderOnEmpty] = React.useState(true);
    const [frequency, setFrequency] = React.useState('once-a-day');

    console.log('🔧 Fixed: All hooks loaded successfully');

    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerTitle: medicineId ? 'Edit Medicine (Fixed)' : 'New Medicine (Fixed)',
      });
    }, [navigation, medicineId]);

    const inputSurface = isDark ? theme.colors.surface : '#F0F0F0';
    const inputBorder = theme.colors.border;

    // USANDO IONICONS EM VEZ DE HEALTHICONS PROBLEMÁTICOS
    const MEDICINE_TYPE_IDS = ['capsule', 'tablet', 'injection', 'liquid'] as const;
    const TYPE_IONICONS: Record<string, string> = {
      capsule: 'medical-outline',
      tablet: 'tablet-portrait-outline', 
      injection: 'bandage-outline',
      liquid: 'water-outline',
    };

    const handleSave = () => {
      Alert.alert(
        'Form Fixed!', 
        `Medicine: ${name}\nDosage: ${dosage}\nType: ${medicineType}\nReminder: ${reminderOnEmpty ? 'On' : 'Off'}`
      );
    };

    console.log('🔧 Fixed: About to render complete form with Ionicons');

    return (
      <ScreenWrapper tabContentCanvas homeSoftTint>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.container}>
              <Text style={[styles.title, { color: theme.colors.text }]}>
                🔧 Fixed Medicine Form
              </Text>
              <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                Usando Ionicons em vez de HealthIcons problemáticos
              </Text>
              
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                Medicine Name:
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter medicine name"
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

              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                Dosage:
              </Text>
              <TextInput
                value={dosage}
                onChangeText={setDosage}
                placeholder="Enter dosage (e.g., 10mg)"
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

              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                Medicine Type:
              </Text>
              <View style={styles.typeRow}>
                {MEDICINE_TYPE_IDS.map((id) => {
                  const selected = medicineType === id;
                  const iconName = TYPE_IONICONS[id] as any;
                  const iconColor = selected ? theme.colors.primary : theme.colors.textSecondary;
                  
                  return (
                    <Pressable
                      key={id}
                      onPress={() => setMedicineType(id)}
                      style={({ pressed }) => [
                        styles.typeChip,
                        {
                          borderColor: selected ? theme.colors.primary : inputBorder,
                          backgroundColor: selected ? theme.colors.primary + '22' : inputSurface,
                        },
                        pressed && { opacity: 0.85 },
                      ]}
                    >
                      <Ionicons name={iconName} size={24} color={iconColor} />
                      <Text style={[styles.typeLabel, { 
                        color: iconColor,
                        fontSize: 12,
                        marginTop: 4,
                      }]}>
                        {id}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.switchRow}>
                <Text style={[styles.switchLabel, { color: theme.colors.text }]}>
                  Reminder when empty:
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
              
              <TouchableOpacity 
                style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>
                  💾 Save Medicine (Fixed Version)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.backButton, { borderColor: theme.colors.primary }]}
                onPress={() => navigation.goBack()}
              >
                <Text style={[styles.backButtonText, { color: theme.colors.primary }]}>
                  ← Back to Home
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ScreenWrapper>
    );

  } catch (error) {
    console.error('🔧 Fixed Error:', error);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Fixed Version Error!</Text>
        <Text>{error instanceof Error ? error.message : 'Unknown error'}</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 25,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
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
  typeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
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
    fontWeight: '600',
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
  saveButton: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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