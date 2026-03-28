import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * TESTE 2: useNavigation COM proteção de contexto
 */
export const MedicineFormScreenTest2: React.FC = () => {
  console.log('🧪 TEST 2: Component rendering WITH PROTECTED useNavigation...');

  // PROTEÇÃO EXTRA: Verificar se estamos no contexto correto
  let navigation: NavigationProp<any> | null = null;
  let navigationError: string | null = null;

  try {
    console.log('🧪 TEST 2: Attempting to get navigation...');
    navigation = useNavigation();
    console.log('🧪 TEST 2: Navigation obtained successfully!', !!navigation);
  } catch (error) {
    console.error('🧪 TEST 2: Navigation hook failed:', error);
    navigationError = error instanceof Error ? error.message : 'Unknown navigation error';
  }

  const handleGoBack = () => {
    if (navigation) {
      console.log('🧪 TEST 2: Using navigation.goBack()');
      try {
        navigation.goBack();
      } catch (error) {
        console.error('🧪 TEST 2: Navigation.goBack() failed:', error);
        Alert.alert('Navigation Error', 'goBack() failed: ' + String(error));
      }
    } else {
      console.log('🧪 TEST 2: No navigation available, showing alert');
      Alert.alert('No Navigation', navigationError || 'Navigation context not available');
    }
  };

  try {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🧪 TEST 2: Protected Navigation</Text>
        <Text style={styles.subtitle}>
          Testando useNavigation() com proteção de contexto
        </Text>
        
        <View style={styles.statusContainer}>
          <Text style={styles.status}>
            Navigation Available: {navigation ? '✅ YES' : '❌ NO'}
          </Text>
          {navigationError && (
            <Text style={styles.errorStatus}>
              Error: {navigationError}
            </Text>
          )}
        </View>
        
        <TouchableOpacity 
          style={[
            styles.button, 
            { backgroundColor: navigation ? '#4caf50' : '#ff9800' }
          ]}
          onPress={handleGoBack}
        >
          <Text style={styles.buttonText}>
            {navigation ? 'Go Back (Navigation)' : 'Show Error (Alert)'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.debugText}>
          Se esta tela aparecer:
          {'\n'}• Navigation null = Contexto não disponível  
          {'\n'}• Navigation ok = Problema é timing/chamada
          {'\n'}• Crash = Problema é no hook em si
        </Text>
      </View>
    );
  } catch (error) {
    console.error('🧪 TEST 2 Render Error:', error);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>ERRO NO TEST 2!</Text>
        <Text style={styles.errorDetails}>
          {error instanceof Error ? error.message : 'Erro desconhecido'}
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff3e0', // Laranja claro para indicar teste
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ef6c00',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 25,
    textAlign: 'center',
    color: '#ff9800',
    lineHeight: 20,
  },
  button: {
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  debugText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#ef6c00',
    fontStyle: 'italic',
    marginTop: 20,
    lineHeight: 18,
  },
  statusContainer: {
    backgroundColor: '#ffe0b2',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  status: {
    fontSize: 14,
    color: '#e65100',
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: '600',
  },
  errorStatus: {
    fontSize: 12,
    color: '#d84315',
    textAlign: 'center',
    fontStyle: 'italic',
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
    color: '#d32f2f',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  errorDetails: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});