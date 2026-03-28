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

// IMPORTS SUSPEITOS da versão Full
import { Ionicons } from '@expo/vector-icons';

// HealthIcons with fallback
let HealthIconsAvailable = false;
let Pills2: any = null;
let Pill1: any = null;
let Syringe: any = null;
let Medicines: any = null;

// Try to import HealthIcons safely
try {
  const HealthIcons = require('healthicons-react-native/outline-24px');
  Pills2 = HealthIcons.Pills2;
  Pill1 = HealthIcons.Pill1;
  Syringe = HealthIcons.Syringe;
  Medicines = HealthIcons.Medicines;
  
  // Verify all components exist
  if (Pills2 && Pill1 && Syringe && Medicines) {
    HealthIconsAvailable = true;
    console.log('✅ HealthIcons loaded successfully');
  } else {
    console.warn('⚠️ Some HealthIcons components missing');
  }
} catch (error) {
  console.warn('⚠️ HealthIcons import failed:', error);
  console.log('💡 Will fallback to Ionicons');
}

/**
 * BRIDGE PROGRESSION - Adiciona componentes da versão Full gradualmente
 */
export const MedicineFormScreenBridge: React.FC = () => {
  console.log('🌉 Bridge: Component starting...');
  
  try {
    const { logNavEvent, logNavError } = useSimpleNavLogger('Bridge');
    const route = useRoute<RouteProp<HomeTabParamList, 'MedicineForm'>>();
    const navigation = useNavigation<NativeStackNavigationProp<HomeTabParamList>>();
    const { t } = useTranslation();
    const { theme, isDark } = useTheme();

    const medicineId = route.params?.medicineId;
    
    const [progressLevel, setProgressLevel] = React.useState(1);
    const [name, setName] = React.useState('');
    const [dosage, setDosage] = React.useState(''); 
    const [medicineType, setMedicineType] = React.useState('capsule');
    const [reminderOnEmpty, setReminderOnEmpty] = React.useState(true);
    const [bootLoading, setBootLoading] = React.useState(false);

    console.log('🌉 Bridge: All hooks loaded, progressLevel:', progressLevel);

    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerTitle: `Bridge Progress Level ${progressLevel}`,
      });
    }, [navigation, progressLevel]);

    console.log('🌉 Bridge: About to render level:', progressLevel);

    // LEVEL 1: Igual Simple - apenas View básico
    if (progressLevel === 1) {
      return (
        <View style={styles.container}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            🌉 Bridge Level 1: Basic View
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Começando com estrutura igual à Simple que funciona
          </Text>
          
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={() => setProgressLevel(2)}
          >
            <Text style={styles.buttonText}>Next: ScreenWrapper →</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // LEVEL 2: Adicionar ScreenWrapper com props da versão Full
    if (progressLevel === 2) {
      return (
        <ScreenWrapper tabContentCanvas homeSoftTint>
          <View style={styles.container}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              🌉 Bridge Level 2: + ScreenWrapper Props
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Adicionado tabContentCanvas + homeSoftTint
            </Text>
            
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.buttonSmall, { backgroundColor: theme.colors.border }]}
                onPress={() => setProgressLevel(1)}
              >
                <Text style={styles.buttonText}>← Back</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.buttonSmall, { backgroundColor: theme.colors.primary }]}
                onPress={() => setProgressLevel(3)}
              >
                <Text style={styles.buttonText}>+ KeyboardView →</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScreenWrapper>
      );
    }

    // LEVEL 3: Adicionar KeyboardAvoidingView
    if (progressLevel === 3) {
      return (
        <ScreenWrapper tabContentCanvas homeSoftTint>
          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={styles.container}>
              <Text style={[styles.title, { color: theme.colors.text }]}>
                🌉 Bridge Level 3: + KeyboardAvoidingView
              </Text>
              <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                ScreenWrapper → KeyboardAvoidingView → View
              </Text>
              
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={[styles.buttonSmall, { backgroundColor: theme.colors.border }]}
                  onPress={() => setProgressLevel(2)}
                >
                  <Text style={styles.buttonText}>← Back</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.buttonSmall, { backgroundColor: theme.colors.primary }]}
                  onPress={() => setProgressLevel(4)}
                >
                  <Text style={styles.buttonText}>+ ScrollView →</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </ScreenWrapper>
      );
    }

    // LEVEL 4: Adicionar ScrollView
    if (progressLevel === 4) {
      return (
        <ScreenWrapper tabContentCanvas homeSoftTint>
          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.container}>
                <Text style={[styles.title, { color: theme.colors.text }]}>
                  🌉 Bridge Level 4: + ScrollView
                </Text>
                <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                  ScreenWrapper → KeyboardAvoidingView → ScrollView
                </Text>
                
                <View style={styles.buttonRow}>
                  <TouchableOpacity 
                    style={[styles.buttonSmall, { backgroundColor: theme.colors.border }]}
                    onPress={() => setProgressLevel(3)}
                  >
                    <Text style={styles.buttonText}>← Back</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.buttonSmall, { backgroundColor: theme.colors.primary }]}
                    onPress={() => setProgressLevel(5)}
                  >
                    <Text style={styles.buttonText}>+ TextInput →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </ScreenWrapper>
      );
    }

    // LEVEL 5: Adicionar TextInput com styling da versão Full
    if (progressLevel === 5) {
      const inputSurface = isDark ? theme.colors.surface : '#F0F0F0';
      const inputBorder = theme.colors.border;

      return (
        <ScreenWrapper tabContentCanvas homeSoftTint>
          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.container}>
                <Text style={[styles.title, { color: theme.colors.text }]}>
                  🌉 Bridge Level 5: + TextInput Styled
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
                  placeholder="Enter dosage"
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
                
                <View style={styles.buttonRow}>
                  <TouchableOpacity 
                    style={[styles.buttonSmall, { backgroundColor: theme.colors.border }]}
                    onPress={() => setProgressLevel(4)}
                  >
                    <Text style={styles.buttonText}>← Back</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.buttonSmall, { backgroundColor: theme.colors.primary }]}
                    onPress={() => setProgressLevel(6)}
                  >
                    <Text style={styles.buttonText}>+ SVG Icons →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </ScreenWrapper>
      );
    }

    // LEVEL 6: Adicionar componentes suspeitos (SVG Icons, Pressable, Switch)
    if (progressLevel >= 6) {
      const inputSurface = isDark ? theme.colors.surface : '#F0F0F0';
      const inputBorder = theme.colors.border;

      // Definir os tipos de medicina e ícones (com fallback para Ionicons)
      const MEDICINE_TYPE_IDS = ['capsule', 'tablet', 'injection', 'liquid'] as const;
      
      // Use HealthIcons if available, otherwise Ionicons
      const createIconComponent = (healthIcon: any, ionicon: string) => {
        if (HealthIconsAvailable && healthIcon) {
          return healthIcon;
        }
        // Fallback to Ionicons
        return (props: any) => <Ionicons name={ionicon as any} size={24} color={props.color || '#666'} />;
      };
      
      const TYPE_HEALTH_ICONS: Record<string, any> = {
        capsule: createIconComponent(Pills2, 'medical'),
        tablet: createIconComponent(Pill1, 'tablet-portrait'),
        injection: createIconComponent(Syringe, 'medical-outline'),
        liquid: createIconComponent(Medicines, 'flask'),
      };

      return (
        <ScreenWrapper tabContentCanvas homeSoftTint>
          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.container}>
                <Text style={[styles.title, { color: theme.colors.text }]}>
                  🌉 Bridge Level 6: + SVG Icons & Components
                </Text>
                <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                  Testando HealthIcons SVG + Pressable + Switch
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
                  Medicine Type (SVG Icons Test):
                </Text>
                <View style={styles.typeRow}>
                  {MEDICINE_TYPE_IDS.map((id) => {
                    const selected = medicineType === id;
                    const HealthIcon = TYPE_HEALTH_ICONS[id];
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
                        <HealthIcon width={24} height={24} color={iconColor} />
                      </Pressable>
                    );
                  })}
                </View>

                <View style={styles.switchRow}>
                  <Text style={[styles.switchLabel, { color: theme.colors.text }]}>
                    Reminder On Empty (Switch Test):
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
                
                <View style={styles.buttonRow}>
                  <TouchableOpacity 
                    style={[styles.buttonSmall, { backgroundColor: theme.colors.border }]}
                    onPress={() => setProgressLevel(5)}
                  >
                    <Text style={styles.buttonText}>← Back</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.buttonSmall, { backgroundColor: theme.colors.success || theme.colors.primary }]}
                    onPress={() => {
                      Alert.alert('Level 6 Success!', 'Se chegou aqui, SVG Icons + Pressable + Switch funcionam!');
                    }}
                  >
                    <Text style={styles.buttonText}>✅ All Components OK!</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </ScreenWrapper>
      );
    }

  } catch (error) {
    console.error('🌉 Bridge Error:', error);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Bridge Error!</Text>
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 25,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonSmall: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
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
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  typeRow: {
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