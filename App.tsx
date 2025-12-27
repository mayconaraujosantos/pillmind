import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from '@core/navigation/AppNavigator';
import { SplashScreenComponent } from '@features/splash_screen';

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simular inicialização do app
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return <SplashScreenComponent />;
  }

  return (
    <>
      <AppNavigator />
      <StatusBar style="auto" />
    </>
  );
}
