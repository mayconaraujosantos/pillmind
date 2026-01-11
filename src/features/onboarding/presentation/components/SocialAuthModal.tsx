import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { COMMON_STYLES } from '@shared/constants/styles';

interface SocialAuthModalProps {
  visible: boolean;
  provider: 'google' | 'apple';
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const providerNames: Record<'google' | 'apple', string> = {
  google: 'Google',
  apple: 'Apple',
};

const providerDomains: Record<'google' | 'apple', string> = {
  google: 'google.com',
  apple: 'apple.com',
};

export const SocialAuthModal: React.FC<SocialAuthModalProps> = ({
  visible,
  provider,
  loading,
  onConfirm,
  onCancel,
}) => {
  const providerName = providerNames[provider];
  const providerDomain = providerDomains[provider];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {loading ? (
            // Loading state
            <>
              <ActivityIndicator
                size="large"
                color={COMMON_STYLES.colors.primary}
              />
              <Text style={styles.loadingText}>
                {`Conectando com ${providerName}...`}
              </Text>
              <Text style={styles.loadingSubtext}>Por favor, aguarde</Text>
            </>
          ) : (
            // Confirmation state
            <>
              <Text style={styles.title}>
                {`"PillMind" Deseja Usar "${providerDomain}" para Iniciar Sessão`}
              </Text>

              <Text style={styles.description}>
                Isso permite que o app e o site compartilhem informações sobre
                você.
              </Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onCancel}
                  disabled={loading}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  onPress={onConfirm}
                  disabled={loading}
                >
                  <Text style={styles.confirmButtonText}>Continuar</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 24,
    width: Dimensions.get('window').width - 40,
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginTop: 16,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 13,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#E5E5E5',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  confirmButton: {
    backgroundColor: COMMON_STYLES.colors.primary,
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COMMON_STYLES.colors.text.white,
  },
});
