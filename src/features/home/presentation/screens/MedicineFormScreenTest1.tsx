import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * TESTE 1: Versão SEM useNavigation para testar se o problema é contexto de navegação
 */
export const MedicineFormScreenTest1: React.FC = () => {
  console.log('🧪 TEST 1: Component rendering WITHOUT useNavigation...');

  const handleGoBack = () => {
    console.log('🧪 TEST 1: Button pressed - showing alert instead of navigation');
    Alert.alert(
      'Navigation Test', 
      'Se você vê este alerta, o problema É o contexto de navegação!',
      [{ text: 'OK' }]
    );
  };

  try {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🧪 TEST 1: NO Navigation Hook</Text>
        <Text style={styles.subtitle}>
          Testando sem useNavigation() para verificar se o problema é contexto
        </Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={handleGoBack}
        >
          <Text style={styles.buttonText}>Testar (Alert)</Text>
        </TouchableOpacity>

        <Text style={styles.debugText}>
          Se esta tela aparecer SEM crash:
          {'\n'}→ O problema É o useNavigation()
          {'\n'}→ Configuração de navegação está quebrada
        </Text>

        <View style={styles.statusContainer}>
          <Text style={styles.status}>✅ Renderizou sem useNavigation</Text>
          <Text style={styles.status}>✅ Não houve crash nativo</Text>
          <Text style={styles.status}>🔍 Teste bem-sucedido</Text>
        </View>
      </View>
    );
  } catch (error) {
    console.error('🧪 TEST 1 Error:', error);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>ERRO NO TEST 1!</Text>
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
    backgroundColor: '#e8f5e8', // Verde claro para indicar teste
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2e7d32',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 25,
    textAlign: 'center',
    color: '#4caf50',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#4caf50',
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
    color: '#2e7d32',
    fontStyle: 'italic',
    marginBottom: 20,
    lineHeight: 18,
  },
  statusContainer: {
    backgroundColor: '#c8e6c9',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  status: {
    fontSize: 12,
    color: '#1b5e20',
    marginBottom: 3,
    textAlign: 'center',
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