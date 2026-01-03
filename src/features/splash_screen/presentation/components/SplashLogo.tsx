import React, { useEffect, useRef } from 'react';
import { Animated, Image, ImageSourcePropType, StyleSheet } from 'react-native';
import { SPLASH_SCREEN_CONFIG } from '../constants/splashScreen.constants';

interface SplashLogoProps {
  source: ImageSourcePropType;
  onAnimationComplete?: () => void;
}

export const SplashLogo: React.FC<SplashLogoProps> = ({
  source,
  onAnimationComplete,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(
    new Animated.Value(SPLASH_SCREEN_CONFIG.LOGO_INITIAL_SCALE)
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: SPLASH_SCREEN_CONFIG.LOGO_ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: SPLASH_SCREEN_CONFIG.LOGO_FINAL_SCALE,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onAnimationComplete?.();
    });
  }, [fadeAnim, scaleAnim, onAnimationComplete]);

  return (
    <Animated.View
      style={[
        styles.logoContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Image
        testID="splash-logo-image"
        source={source}
        style={styles.logo}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 200,
    height: 200,
  },
});
