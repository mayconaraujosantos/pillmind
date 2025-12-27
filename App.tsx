import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from '@core/navigation/AppNavigator';
import { SplashScreenComponent } from '@features/splash_screen';

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  const handleSplashFinish = () => {
    setIsAppReady(true);
  };

  if (!isAppReady) {
    return <SplashScreenComponent onFinish={handleSplashFinish} />;
  }

  return (
    <>
      <AppNavigator />
      <StatusBar style="auto" />
    </>
  );
}
