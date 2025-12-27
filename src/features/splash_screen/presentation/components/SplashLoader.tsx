import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native';
import {
  SPLASH_SCREEN_CONFIG,
  SPLASH_SCREEN_COLORS,
} from '../constants/splashScreen.constants';

interface SplashLoaderProps {
  color?: string;
}

export const SplashLoader: React.FC<SplashLoaderProps> = ({
  color = SPLASH_SCREEN_COLORS.PRIMARY,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: SPLASH_SCREEN_CONFIG.LOADER_ANIMATION_DURATION,
      delay: SPLASH_SCREEN_CONFIG.LOADER_ANIMATION_DELAY,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ActivityIndicator size="large" color={color} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
});
