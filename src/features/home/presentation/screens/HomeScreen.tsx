import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, ScreenWrapper } from '@shared/components';
import { useOnboardingStorage } from '@features/onboarding';
import { SHOW_DEBUG_CONTROLS } from '@features/onboarding/presentation/constants/onboarding.constants';

export const HomeScreen: React.FC = () => {
  const { resetOnboarding } = useOnboardingStorage();

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Card>
          <Text style={styles.title}>PillMind Home</Text>
          <Text style={styles.subtitle}>
            Bem-vindo ao seu assistente de medicamentos!
          </Text>
        </Card>

        {/* Controles de Debug - só aparecem em desenvolvimento */}
        {SHOW_DEBUG_CONTROLS && (
          <Card style={styles.debugCard}>
            <Text style={styles.debugTitle}>🛠️ Debug Controls</Text>
            <TouchableOpacity
              style={styles.debugButton}
              onPress={resetOnboarding}
            >
              <Text style={styles.debugButtonText}>↻ Resetar Onboarding</Text>
            </TouchableOpacity>
            <Text style={styles.debugInfo}>
              Aperte para testar o onboarding novamente
            </Text>
          </Card>
        )}
      </View>
    </ScreenWrapper>
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
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#5A6C7D',
    textAlign: 'center',
  },
  debugCard: {
    marginTop: 20,
    backgroundColor: '#FFF3CD',
    borderColor: '#FFEAA7',
    borderWidth: 1,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 12,
    textAlign: 'center',
  },
  debugButton: {
    backgroundColor: '#FD79A8',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 8,
  },
  debugButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  debugInfo: {
    fontSize: 12,
    color: '#856404',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
