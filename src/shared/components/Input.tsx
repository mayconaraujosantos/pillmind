import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { COMMON_STYLES } from '@shared/constants/styles';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  variant?: 'filled' | 'outlined';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  style,
  icon,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [scaleValue] = useState(new Animated.Value(1));
  const [borderOpacity] = useState(new Animated.Value(0));
  const isAndroid = Platform.OS === 'android';

  const handleFocus = () => {
    setIsFocused(true);
    const animations: Animated.CompositeAnimation[] = [
      Animated.timing(borderOpacity, {
        toValue: 1,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: false,
      }),
    ];

    if (isAndroid) {
      animations.push(
        Animated.spring(scaleValue, {
          toValue: 1.02,
          useNativeDriver: true,
          speed: 20,
          tension: 100,
        })
      );
    }

    Animated.parallel(animations).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    const animations: Animated.CompositeAnimation[] = [
      Animated.timing(borderOpacity, {
        toValue: 0,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: false,
      }),
    ];

    if (isAndroid) {
      animations.push(
        Animated.spring(scaleValue, {
          toValue: 1,
          useNativeDriver: true,
          speed: 20,
          tension: 100,
        })
      );
    }

    Animated.parallel(animations).start();
  };

  const animatedBorderColor = borderOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [
      error ? COMMON_STYLES.colors.error : 'rgba(0, 122, 255, 0)',
      error ? COMMON_STYLES.colors.error : COMMON_STYLES.colors.primary,
    ],
  });

  // Styles for iOS (clean, minimal)
  const iosStyles = [
    styles.iosWrapper,
    {
      borderColor: error ? COMMON_STYLES.colors.error : animatedBorderColor,
    },
  ];

  // Styles for Android (material design)
  const androidStyles = [
    styles.androidWrapper,
    error && styles.androidInputError,
    {
      transform: [{ scale: scaleValue }],
    },
  ];

  return (
    <View style={styles.container}>
      {label && (
        <Text
          style={[
            styles.label,
            error && styles.labelError,
            isFocused && styles.labelActive,
          ]}
        >
          {label}
        </Text>
      )}
      <Animated.View
        style={[
          isAndroid ? styles.androidWrapper : styles.iosWrapper,
          isAndroid ? androidStyles : iosStyles,
        ]}
      >
        {icon && <View style={styles.iconLeft}>{icon}</View>}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={COMMON_STYLES.colors.text.secondary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </Animated.View>
      <View style={styles.messageContainer}>
        {error && <Text style={styles.errorText}>{error}</Text>}
        {hint && !error && <Text style={styles.hintText}>{hint}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    color: COMMON_STYLES.colors.text.primary,
    letterSpacing: 0.3,
    textTransform: 'capitalize',
  },
  labelActive: {
    color: COMMON_STYLES.colors.primary,
  },
  labelError: {
    color: COMMON_STYLES.colors.error,
  },
  // iOS Styles - Clean & Minimal
  iosWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 0,
    paddingVertical: 0,
    minHeight: 48,
    backgroundColor: 'transparent',
    borderBottomWidth: 1.5,
    borderBottomColor: '#D0D7E0',
  },
  // Android Styles - Material Design
  androidWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 0,
    minHeight: 56,
    backgroundColor: '#F5F9FC',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  androidInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    fontSize: 16,
    fontWeight: '500',
    color: COMMON_STYLES.colors.text.primary,
    borderRadius: 12,
  },
  androidInputError: {
    backgroundColor: '#FFF5F5',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 0,
    fontSize: 16,
    fontWeight: '500',
    color: COMMON_STYLES.colors.text.primary,
  },
  iconLeft: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    minHeight: 22,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  errorText: {
    color: COMMON_STYLES.colors.error,
    fontSize: 11,
    marginTop: 6,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  hintText: {
    color: COMMON_STYLES.colors.text.secondary,
    fontSize: 11,
    marginTop: 6,
    fontWeight: '400',
  },
});
