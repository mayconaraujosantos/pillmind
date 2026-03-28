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
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

/**
 * Versão de debug da MedicineFormScreen para identificar qual componente causa crash nativo
 */
export const MedicineFormScreenDebug: React.FC = () => {
  console.log('🔧 MedicineFormScreenDebug: Starting component...');
  
  try {
    // Hooks básicos que sabemos que funcionam
    const { logNavEvent, logNavError } = useSimpleNavLogger('MedicineFormDebug');
    const route = useRoute<RouteProp<HomeTabParamList, 'MedicineForm'>>();
    const navigation = useNavigation<NativeStackNavigationProp<HomeTabParamList>>();
    const { t } = useTranslation();
    const { theme, isDark } = useTheme();

    console.log('🔧 Hooks initialized successfully');

    const medicineId = route.params?.medicineId;
    
    // Estados mínimos
    const [debugStep, setDebugStep] = React.useState(1);
    const [name, setName] = React.useState('');
    
    console.log('🔧 States initialized');

    // Header setup (sabemos que funciona)
    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerTitle: medicineId ? 'Edit Medicine (Debug)' : 'New Medicine (Debug)',
      });
    }, [navigation, medicineId]);

    console.log('🔧 About to render, step:', debugStep);

    // Renderização gradual para identificar problema
    return (
      <ScreenWrapper tabContentCanvas homeSoftTint>
        <View style={styles.container}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Medicine Form Debug - Step {debugStep}
          </Text>
          
          {/* STEP 1: Apenas texto básico */}
          {debugStep >= 1 && (
            <View style={styles.section}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                Step 1: Basic Text (✅ Working)
              </Text>
            </View>
          )}

          {/* STEP 2: TextInput simples */}
          {debugStep >= 2 && (
            <View style={styles.section}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                Medicine Name
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter medicine name"
                style={[
                  styles.textInput,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                    color: theme.colors.text,
                  },
                ]}
                placeholderTextColor={theme.colors.placeholder}
              />
            </View>
          )}

          {/* STEP 3: ScrollView */}
          {debugStep >= 3 && (
            <ScrollView style={styles.scrollArea}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                Step 3: ScrollView Content
              </Text>
              <Text>This is inside a ScrollView</Text>
              <Text>Second line</Text>
              <Text>Third line</Text>
            </ScrollView>
          )}

          {/* Debug controls */}
          <View style={styles.controls}>
            <Text 
              style={[styles.button, { backgroundColor: theme.colors.primary }]}
              onPress={() => setDebugStep(Math.max(1, debugStep - 1))}
            >
              ◀ Prev Step
            </Text>
            <Text style={{ color: theme.colors.text, marginHorizontal: 20 }}>
              Step {debugStep}/3
            </Text>
            <Text 
              style={[styles.button, { backgroundColor: theme.colors.primary }]}
              onPress={() => setDebugStep(Math.min(3, debugStep + 1))}
            >
              Next Step ▶
            </Text>
          </View>
        </View>
      </ScreenWrapper>
    );

  } catch (error) {
    console.error('🔧 Error in debug screen:', error);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Debug Screen Error!</Text>
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
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    height: 40,
  },
  scrollArea: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
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