import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * Versão mínima da MedicineFormScreen para debug
 */
export const MedicineFormScreenSimple: React.FC = () => {
  const navigation = useNavigation();

  console.log('🏥 MedicineFormScreenSimple: Component rendering...');

  try {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Tela de Medicamentos (Debug)</Text>
        <Text style={styles.subtitle}>Se você está vendo isto, a navegação funcionou!</Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => {
            console.log('🏥 Going back to home...');
            navigation.goBack();
          }}
        >
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.debugText}>
          Esta é uma versão simplificada para debug.
          {'\n'}Se funcionar, o problema é na implementação da tela original.
        </Text>
      </View>
    );
  } catch (error) {
    console.error('🏥 Error in simple MedicineForm screen:', error);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erro até na versão simples!</Text>
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
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  debugText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#888',
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
    color: 'red',
    marginBottom: 10,
  },
  errorDetails: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});