import { Assets } from '@shared/assets';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SplashLoader } from '../components/SplashLoader';
import { SplashLogo } from '../components/SplashLogo';
import {
  SPLASH_SCREEN_COLORS,
  SPLASH_SCREEN_TEXTS,
} from '../constants/splashScreen.constants';
import { useSplashScreen } from '../hooks/useSplashScreen';

interface SplashScreenProps {
  onFinish?: () => void;
  testID?: string;
}

export const SplashScreenComponent: React.FC<SplashScreenProps> = ({
  onFinish,
  testID,
}) => {
  const [logoAnimationComplete, setLogoAnimationComplete] = useState(false);
  const { isAppReady } = useSplashScreen({
    onFinish,
  });

  // Não renderizar nada se o app estiver pronto
  // O componente será desmontado pelo App.tsx
  if (isAppReady) {
    return null;
  }

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.content}>
        <SplashLogo
          source={Assets.pillLogo}
          onAnimationComplete={() => setLogoAnimationComplete(true)}
        />
        <Text style={styles.appName}>{SPLASH_SCREEN_TEXTS.APP_NAME}</Text>
        <Text style={styles.tagline}>{SPLASH_SCREEN_TEXTS.TAGLINE}</Text>
      </View>
      {logoAnimationComplete && <SplashLoader />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SPLASH_SCREEN_COLORS.BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: SPLASH_SCREEN_COLORS.TEXT_PRIMARY,
    marginTop: 16,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: SPLASH_SCREEN_COLORS.TEXT_SECONDARY,
    marginTop: 8,
    fontWeight: '400',
    textAlign: 'center',
  },
});
