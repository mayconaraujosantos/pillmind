import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleProp, StyleSheet, ViewStyle } from 'react-native';

interface FloatingAlertProps {
  visible: boolean;
  topOffset: number;
  onDismiss?: () => void;
  autoHide?: boolean;
  duration?: number;
  containerStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export const FloatingAlert: React.FC<FloatingAlertProps> = ({
  visible,
  topOffset,
  onDismiss,
  autoHide = true,
  duration = 4000,
  containerStyle,
  children,
}) => {
  const slideAnimation = useRef(new Animated.Value(-100)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (visible && autoHide) {
      const timer = setTimeout(() => {
        onDismiss?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, autoHide, duration, onDismiss]);

  useEffect(() => {
    if (visible) {
      setIsAnimating(true);
      Animated.parallel([
        Animated.spring(slideAnimation, {
          toValue: 0,
          useNativeDriver: true,
          tension: 110,
          friction: 8,
        }),
        Animated.timing(fadeAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (isAnimating) {
      Animated.parallel([
        Animated.spring(slideAnimation, {
          toValue: -100,
          useNativeDriver: true,
          tension: 110,
          friction: 8,
        }),
        Animated.timing(fadeAnimation, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsAnimating(false);
      });
    }
  }, [visible, slideAnimation, fadeAnimation, isAnimating]);

  if (!visible && !isAnimating) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        containerStyle,
        {
          top: topOffset,
          transform: [{ translateY: slideAnimation }],
          opacity: fadeAnimation,
        },
      ]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1000,
  },
});
