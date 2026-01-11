import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated,
  ActivityIndicator,
  View,
} from 'react-native';
import { COMMON_STYLES } from '@shared/constants/styles';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
}) => {
  const [scaleValue] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 20,
      tension: 100,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      tension: 100,
    }).start();
  };

  const isDisabled = disabled || loading;

  return (
    <View style={fullWidth && styles.fullWidth}>
      <Animated.View
        style={{
          transform: [{ scale: scaleValue }],
        }}
      >
        <TouchableOpacity
          style={[
            styles.button,
            styles[size],
            styles[`${variant}Background`],
            isDisabled && styles.disabled,
            fullWidth && styles.fullWidthButton,
            style,
          ]}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isDisabled}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator
              color={getIndicatorColor(variant)}
              size={size === 'small' ? 'small' : 'large'}
              style={styles.loader}
            />
          ) : (
            <View style={styles.buttonContent}>
              {icon && <View style={styles.icon}>{icon}</View>}
              <Text
                style={[
                  styles[`${size}Text`],
                  styles[`${variant}Text`],
                  textStyle,
                ]}
              >
                {title}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const getIndicatorColor = (variant: ButtonVariant): string => {
  switch (variant) {
    case 'primary':
    case 'secondary':
    case 'danger':
      return '#FFFFFF';
    case 'outline':
    case 'ghost':
      return COMMON_STYLES.colors.primary;
    default:
      return '#FFFFFF';
  }
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  fullWidthButton: {
    width: '100%',
  },
  // Sizes
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  // Variants Background
  primaryBackground: {
    backgroundColor: COMMON_STYLES.colors.primary,
  },
  secondaryBackground: {
    backgroundColor: COMMON_STYLES.colors.secondary,
  },
  dangerBackground: {
    backgroundColor: COMMON_STYLES.colors.error,
  },
  outlineBackground: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COMMON_STYLES.colors.primary,
  },
  ghostBackground: {
    backgroundColor: 'transparent',
  },
  // Text Sizes
  smallText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  mediumText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  largeText: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  // Text Colors
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  dangerText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: COMMON_STYLES.colors.primary,
  },
  ghostText: {
    color: COMMON_STYLES.colors.primary,
  },
  // States
  disabled: {
    opacity: 0.5,
  },
  icon: {
    marginRight: 8,
  },
  loader: {
    marginRight: 0,
  },
});
