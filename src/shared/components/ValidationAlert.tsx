import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@shared/theme';
import {
  adaptiveSpacing,
  adaptiveFontSizes,
  deviceSize,
} from '@shared/utils/dimensions';

const { width: _SCREEN_WIDTH } = Dimensions.get('window');

interface ValidationAlertProps {
  visible: boolean;
  message?: string;
  onDismiss?: () => void;
  type?: 'error' | 'success' | 'warning';
}

export const ValidationAlert: React.FC<ValidationAlertProps> = ({
  visible,
  message = 'Por favor, preencha todos os campos obrigatórios',
  onDismiss,
  type = 'error',
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const slideAnimation = useRef(new Animated.Value(-100)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto dismiss after 4 seconds
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onDismiss?.();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [visible, onDismiss]);

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#10B981',
          icon: 'checkmark-circle',
          iconColor: '#FFFFFF',
        };
      case 'warning':
        return {
          backgroundColor: '#F59E0B',
          icon: 'warning',
          iconColor: '#FFFFFF',
        };
      default: // error
        return {
          backgroundColor: theme.colors.error,
          icon: 'alert-circle',
          iconColor: '#FFFFFF',
        };
    }
  };

  const typeConfig = getTypeConfig();

  useEffect(() => {
    if (visible) {
      setIsAnimating(true);
      // Slide down and fade in
      Animated.parallel([
        Animated.spring(slideAnimation, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(fadeAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (isAnimating) {
      // Slide up and fade out
      Animated.parallel([
        Animated.spring(slideAnimation, {
          toValue: -100,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(fadeAnimation, {
          toValue: 0,
          duration: 200,
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
          backgroundColor: typeConfig.backgroundColor,
          top: insets.top + adaptiveSpacing.sm, // Usa safe area + pequeno espaço
          transform: [{ translateY: slideAnimation }],
          opacity: fadeAnimation,
        },
      ]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <View style={styles.content}>
        <Ionicons
          name={
            typeConfig.icon as 'checkmark-circle' | 'alert-circle' | 'warning'
          }
          size={20}
          color={typeConfig.iconColor}
        />

        <Text
          style={styles.message}
          numberOfLines={2}
          testID="validation-message"
        >
          {message}
        </Text>

        <TouchableOpacity
          onPress={onDismiss}
          style={styles.dismissButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close" size={16} color={typeConfig.iconColor} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: adaptiveSpacing.md,
    right: adaptiveSpacing.md,
    zIndex: 1000,
    borderRadius: deviceSize(12, 14, 16),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: adaptiveSpacing.md,
    paddingHorizontal: adaptiveSpacing.lg,
    gap: adaptiveSpacing.sm,
  },
  message: {
    flex: 1,
    fontSize: adaptiveFontSizes.sm,
    fontWeight: '600',
    letterSpacing: 0.2,
    color: '#FFFFFF',
    lineHeight: adaptiveFontSizes.sm * 1.3,
  },
  dismissButton: {
    padding: adaptiveSpacing.xs,
    borderRadius: deviceSize(8, 10, 12),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});
