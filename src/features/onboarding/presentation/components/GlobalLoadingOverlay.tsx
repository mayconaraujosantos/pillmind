import React from 'react';
import { Modal, View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { COMMON_STYLES } from '@shared/constants/styles';

interface GlobalLoadingOverlayProps {
  visible: boolean;
  message?: string;
  submessage?: string;
}

/**
 * Overlay de loading global para processos que não precisam de interação do usuário
 * Exemplo: Aguardando resposta do backend após autenticação social
 */
export const GlobalLoadingOverlay: React.FC<GlobalLoadingOverlayProps> = ({
  visible,
  message = 'Processando...',
  submessage,
}) => {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator
            size="large"
            color={COMMON_STYLES.colors.primary}
          />
          <Text style={styles.message}>{message}</Text>
          {submessage && <Text style={styles.submessage}>{submessage}</Text>}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginTop: 16,
    textAlign: 'center',
  },
  submessage: {
    fontSize: 13,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
});
