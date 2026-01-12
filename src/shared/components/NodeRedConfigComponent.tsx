import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@shared/theme';
import { useTranslation } from '@shared/i18n';
import { adaptiveSpacing, adaptiveFontSizes } from '@shared/utils/dimensions';
import { useNodeRedDiscovery, useNodeRedConnection } from '@shared/hooks/useNodeRedDiscovery';

export const NodeRedConfigComponent: React.FC = () => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const [manualURL, setManualURL] = useState('');
  
  const {
    nodeRedURL,
    isDiscovering,
    error,
    manualSetURL,
    rediscover,
    clearConfig,
  } = useNodeRedDiscovery();

  const { isConnected, isTestingConnection } = useNodeRedConnection(nodeRedURL);

  const handleManualConfig = async () => {
    if (!manualURL.trim()) {
      Alert.alert(t('common.error'), t('errors.invalidUrl'));
      return;
    }

    let formattedURL = manualURL.trim();
    if (!formattedURL.startsWith('http')) {
      formattedURL = `http://${formattedURL}`;
    }

    const success = await manualSetURL(formattedURL);
    if (success) {
      setManualURL('');
      Alert.alert(t('common.success'), t('errors.configuredSuccess'));
    } else {
      Alert.alert(t('common.error'), t('errors.connectionFailed'));
    }
  };

  const getStatusColor = () => {
    if (isTestingConnection || isDiscovering) return '#FFA500'; // Orange
    if (isConnected) return '#4CAF50'; // Green
    return '#F44336'; // Red
  };

  const getStatusText = () => {
    if (isDiscovering) return 'Descobrindo...';
    if (isTestingConnection) return 'Testando conexão...';
    if (nodeRedURL && isConnected) return `Conectado: ${nodeRedURL}`;
    if (nodeRedURL && !isConnected) return `Desconectado: ${nodeRedURL}`;
    return 'Node-RED não configurado';
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: isDark ? '#FFF' : '#000' }]}>
        Configuração do Node-RED
      </Text>

      {/* Status da Conexão */}
      <View style={styles.statusContainer}>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
        <Text style={[styles.statusText, { color: isDark ? '#CCC' : '#666' }]}>
          {getStatusText()}
        </Text>
      </View>

      {/* Erro */}
      {error && (
        <Text style={[styles.errorText, { color: '#F44336' }]}>
          {error}
        </Text>
      )}

      {/* Configuração Manual */}
      <View style={styles.manualConfig}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#000' }]}>
          Configuração Manual
        </Text>
        
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? '#333' : '#F5F5F5',
              color: isDark ? '#FFF' : '#000',
              borderColor: isDark ? '#555' : '#DDD',
            },
          ]}
          placeholder="Ex: 192.168.1.100:1880 ou localhost:1880"
          placeholderTextColor={isDark ? '#888' : '#999'}
          value={manualURL}
          onChangeText={setManualURL}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity
          style={[
            styles.button,
            { opacity: isDiscovering ? 0.6 : 1 },
          ]}
          onPress={handleManualConfig}
          disabled={isDiscovering}
        >
          {isDiscovering ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <Text style={styles.buttonText}>Configurar</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Botões de Ação */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.rediscoverButton]}
          onPress={rediscover}
          disabled={isDiscovering}
        >
          <Text style={styles.actionButtonText}>
            {isDiscovering ? 'Descobrindo...' : 'Redescobrir'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.clearButton]}
          onPress={clearConfig}
        >
          <Text style={styles.actionButtonText}>Limpar Config</Text>
        </TouchableOpacity>
      </View>

      {/* Dicas */}
      <View style={styles.tipsContainer}>
        <Text style={[styles.tipsTitle, { color: isDark ? '#FFF' : '#000' }]}>
          💡 Dicas:
        </Text>
        <Text style={[styles.tipText, { color: isDark ? '#CCC' : '#666' }]}>
          • O Node-RED geralmente roda na porta 1880
        </Text>
        <Text style={[styles.tipText, { color: isDark ? '#CCC' : '#666' }]}>
          • Para localhost use: localhost:1880
        </Text>
        <Text style={[styles.tipText, { color: isDark ? '#CCC' : '#666' }]}>
          • Para outra máquina: IP_DA_MÁQUINA:1880
        </Text>
        <Text style={[styles.tipText, { color: isDark ? '#CCC' : '#666' }]}>
          • Ex: 192.168.1.100:1880
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: adaptiveSpacing.lg,
  },
  title: {
    fontSize: adaptiveFontSizes.xl,
    fontWeight: 'bold',
    marginBottom: adaptiveSpacing.lg,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: adaptiveSpacing.md,
    padding: adaptiveSpacing.md,
    borderRadius: 8,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: adaptiveSpacing.sm,
  },
  statusText: {
    fontSize: adaptiveFontSizes.md,
    flex: 1,
  },
  errorText: {
    fontSize: adaptiveFontSizes.sm,
    marginBottom: adaptiveSpacing.md,
    textAlign: 'center',
  },
  manualConfig: {
    marginVertical: adaptiveSpacing.lg,
  },
  sectionTitle: {
    fontSize: adaptiveFontSizes.lg,
    fontWeight: '600',
    marginBottom: adaptiveSpacing.md,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: adaptiveSpacing.md,
    marginBottom: adaptiveSpacing.md,
    fontSize: adaptiveFontSizes.md,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: adaptiveSpacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: adaptiveFontSizes.md,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: adaptiveSpacing.lg,
  },
  actionButton: {
    flex: 1,
    padding: adaptiveSpacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: adaptiveSpacing.xs,
  },
  rediscoverButton: {
    backgroundColor: '#2196F3',
  },
  clearButton: {
    backgroundColor: '#FF9800',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: adaptiveFontSizes.sm,
    fontWeight: '600',
  },
  tipsContainer: {
    marginTop: adaptiveSpacing.lg,
    padding: adaptiveSpacing.md,
    borderRadius: 8,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
  },
  tipsTitle: {
    fontSize: adaptiveFontSizes.md,
    fontWeight: '600',
    marginBottom: adaptiveSpacing.sm,
  },
  tipText: {
    fontSize: adaptiveFontSizes.sm,
    marginBottom: 4,
  },
});