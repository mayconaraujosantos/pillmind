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
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

/**
 * DEBUG SISTEMÁTICO - Versão que remove componentes suspeitos um por um
 */
export const MedicineFormScreenFixing: React.FC = () => {
  console.log('🔧 MedicineFormScreenFixing: Starting systematic debug...');
  
  try {
    const { logNavEvent, logNavError } = useSimpleNavLogger('MedicineFormFixing');
    const route = useRoute<RouteProp<HomeTabParamList, 'MedicineForm'>>();
    const navigation = useNavigation<NativeStackNavigationProp<HomeTabParamList>>();
    const { t } = useTranslation();
    const { theme, isDark } = useTheme();

    const medicineId = route.params?.medicineId;
    
    const [debugLevel, setDebugLevel] = React.useState(1);
    const [name, setName] = React.useState('');
    const [dosage, setDosage] = React.useState('');

    console.log('🔧 States and hooks loaded, debugLevel:', debugLevel);

    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerTitle: `Debug Medicine Form (Level ${debugLevel})`,
      });
    }, [navigation, debugLevel]);

    console.log('🔧 About to render with debug level:', debugLevel);

    // LEVEL 1: ScreenWrapper básico sem props especiais
    if (debugLevel === 1) {
      return (
        <ScreenWrapper>
          <View style={styles.container}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Level 1: Basic ScreenWrapper ✅
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Se você vê isso, ScreenWrapper básico funciona!
            </Text>
            
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: theme.colors.primary }]}
              onPress={() => setDebugLevel(2)}
            >
              <Text style={styles.buttonText}>Next Level →</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.buttonSecondary, { borderColor: theme.colors.primary }]}
              onPress={() => navigation.goBack()}
            >
              <Text style={[styles.buttonSecondaryText, { color: theme.colors.primary }]}>
                ← Back to Home
              </Text>
            </TouchableOpacity>
          </View>
        </ScreenWrapper>
      );
    }

    // LEVEL 2: ScreenWrapper com props específicas (tabContentCanvas, homeSoftTint) 
    if (debugLevel === 2) {
      return (
        <ScreenWrapper tabContentCanvas homeSoftTint>
          <View style={styles.container}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Level 2: ScreenWrapper com Props ✅/❌
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              ScreenWrapper com tabContentCanvas + homeSoftTint
            </Text>
            
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.buttonSmall, { backgroundColor: theme.colors.border }]}
                onPress={() => setDebugLevel(1)}
              >
                <Text style={styles.buttonText}>← Prev</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.buttonSmall, { backgroundColor: theme.colors.primary }]}
                onPress={() => setDebugLevel(3)}
              >
                <Text style={styles.buttonText}>Next →</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScreenWrapper>
      );
    }

    // LEVEL 3: Adicionar ScrollView básico
    if (debugLevel === 3) {
      return (
        <ScreenWrapper tabContentCanvas homeSoftTint>
          <ScrollView>
            <View style={styles.container}>
              <Text style={[styles.title, { color: theme.colors.text }]}>
                Level 3: + ScrollView ✅/❌
              </Text>
              <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                ScreenWrapper + ScrollView aninhado
              </Text>
              <Text>Line 1</Text>
              <Text>Line 2</Text>
              <Text>Line 3</Text>
              <Text>Line 4</Text>
              <Text>Line 5</Text>
              
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={[styles.buttonSmall, { backgroundColor: theme.colors.border }]}
                  onPress={() => setDebugLevel(2)}
                >
                  <Text style={styles.buttonText}>← Prev</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.buttonSmall, { backgroundColor: theme.colors.primary }]}
                  onPress={() => setDebugLevel(4)}
                >
                  <Text style={styles.buttonText}>Next →</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </ScreenWrapper>
      );
    }

    // LEVEL 4: Adicionar KeyboardAvoidingView
    if (debugLevel === 4) {
      return (
        <ScreenWrapper tabContentCanvas homeSoftTint>
          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.container}>
                <Text style={[styles.title, { color: theme.colors.text }]}>
                  Level 4: + KeyboardAvoidingView ✅/❌
                </Text>
                <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                  ScreenWrapper → KeyboardAvoidingView → ScrollView
                </Text>
                
                <View style={styles.buttonRow}>
                  <TouchableOpacity 
                    style={[styles.buttonSmall, { backgroundColor: theme.colors.border }]}
                    onPress={() => setDebugLevel(3)}
                  >
                    <Text style={styles.buttonText}>← Prev</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.buttonSmall, { backgroundColor: theme.colors.primary }]}
                    onPress={() => setDebugLevel(5)}
                  >
                    <Text style={styles.buttonText}>Next →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </ScreenWrapper>
      );
    }

    // LEVEL 5: Adicionar TextInput básico
    if (debugLevel === 5) {
      return (
        <ScreenWrapper tabContentCanvas homeSoftTint>
          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.container}>
                <Text style={[styles.title, { color: theme.colors.text }]}>
                  Level 5: + TextInput ✅/❌
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
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
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
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                      color: theme.colors.text,
                    },
                  ]}
                  placeholderTextColor={theme.colors.placeholder}
                />
                
                <View style={styles.buttonRow}>
                  <TouchableOpacity 
                    style={[styles.buttonSmall, { backgroundColor: theme.colors.border }]}
                    onPress={() => setDebugLevel(4)}
                  >
                    <Text style={styles.buttonText}>← Prev</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.buttonSmall, { backgroundColor: theme.colors.success || theme.colors.primary }]}
                    onPress={() => {
                      Alert.alert('Debug Complete!', 'Se chegou até aqui, a estrutura básica funciona!');
                    }}
                  >
                    <Text style={styles.buttonText}>✅ Complete!</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </ScreenWrapper>
      );
    }

    // Fallback
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Debug Error!</Text>
      </View>
    );

  } catch (error) {
    console.error('🔧 Error in fixing screen:', error);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Fixing Screen Error!</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonSecondary: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
    borderWidth: 1,
  },
  buttonSmall: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonSecondaryText: {
    fontWeight: '600',
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
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