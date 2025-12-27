import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

export const SplashScreenComponent: React.FC = () => {
  useEffect(() => {
    // Prevenir que a splash screen do Expo oculte automaticamente
    SplashScreen.preventAutoHideAsync();

    // Simular tempo de carregamento (remover quando integrar com lógica real)
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    marginTop: 16,
  },
});
