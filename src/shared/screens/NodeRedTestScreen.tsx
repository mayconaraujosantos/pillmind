import React from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import { NodeRedConfigComponent } from '@shared/components/NodeRedConfigComponent';
import { useNodeRedDiscovery } from '@shared/hooks/useNodeRedDiscovery';

// Componente de teste para o sistema de descoberta do Node-RED
export const NodeRedTestScreen: React.FC = () => {
  const { nodeRedURL, isDiscovering, error } = useNodeRedDiscovery();

  const testConnection = async () => {
    if (!nodeRedURL) {
      console.log('❌ Node-RED URL not available');
      return;
    }

    try {
      console.log('🧪 Testing Node-RED connection...');
      const response = await fetch(`${nodeRedURL}/settings`);
      const data = await response.json();
      console.log('✅ Node-RED connection test successful:', data);
    } catch (err) {
      console.log('❌ Node-RED connection test failed:', err);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🔧 Node-RED Discovery Test</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Status: {isDiscovering ? '🔍 Discovering...' : nodeRedURL ? '🟢 Found' : '🔴 Not found'}
        </Text>
        
        {nodeRedURL && (
          <Text style={styles.urlText}>URL: {nodeRedURL}</Text>
        )}
        
        {error && (
          <Text style={styles.errorText}>Error: {error}</Text>
        )}
      </View>

      <Button
        title="Test Connection"
        onPress={testConnection}
        disabled={!nodeRedURL || isDiscovering}
      />

      <NodeRedConfigComponent />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  statusContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 8,
  },
  urlText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#F44336',
  },
});