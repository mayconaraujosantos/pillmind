import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@shared/theme';
import {
  adaptiveSpacing,
  adaptiveFontSizes,
  deviceSize,
} from '@shared/utils/dimensions';

interface SuccessTooltipProps {
  visible: boolean;
  title: string;
  message?: string;
  onDismiss?: () => void;
  autoHide?: boolean;
  duration?: number;
}

export const SuccessTooltip: React.FC<SuccessTooltipProps> = ({
  visible,
  title,
  message,
  onDismiss,
  autoHide = true,
  duration = 4000,
}) => {
  const { theme: _theme } = useTheme();
  const insets = useSafeAreaInsets();
  const slideAnimation = useRef(new Animated.Value(-100)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto dismiss
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
      // Slide down and fade in
      Animated.parallel([
        Animated.spring(slideAnimation, {
          toValue: 0,
          useNativeDriver: true,
          tension: 120,
          friction: 8,
        }),
        Animated.timing(fadeAnimation, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (isAnimating) {
      // Slide up and fade out
      Animated.parallel([
        Animated.spring(slideAnimation, {
          toValue: -100,
          useNativeDriver: true,
          tension: 120,
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
        {
          top: insets.top + adaptiveSpacing.md,
          transform: [{ translateY: slideAnimation }],
          opacity: fadeAnimation,
        },
      ]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {message && <Text style={styles.message}>{message}</Text>}
        </View>

        <TouchableOpacity
          onPress={onDismiss}
          style={styles.dismissButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: adaptiveSpacing.lg,
    right: adaptiveSpacing.lg,
    zIndex: 1000,
    backgroundColor: '#10B981', // Green success color
    borderRadius: deviceSize(14, 16, 18),
    borderWidth: 2,
    borderColor: '#059669',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: adaptiveSpacing.lg,
    paddingHorizontal: adaptiveSpacing.lg,
    gap: adaptiveSpacing.md,
  },
  iconContainer: {
    marginTop: adaptiveSpacing.xs,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: adaptiveFontSizes.lg,
    fontWeight: '700',
    letterSpacing: 0.3,
    color: '#FFFFFF',
    marginBottom: adaptiveSpacing.xs,
  },
  message: {
    fontSize: adaptiveFontSizes.sm,
    fontWeight: '500',
    letterSpacing: 0.2,
    color: '#F0FDF4',
    lineHeight: adaptiveFontSizes.sm * 1.4,
  },
  dismissButton: {
    marginTop: adaptiveSpacing.xs,
    padding: adaptiveSpacing.xs,
    borderRadius: deviceSize(8, 10, 12),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
});
