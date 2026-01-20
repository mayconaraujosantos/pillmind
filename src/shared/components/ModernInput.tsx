import React, { useState, useRef, useEffect } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '@shared/theme';
import {
  adaptiveSpacing,
  adaptiveFontSizes,
  deviceSize,
} from '@shared/utils/dimensions';

interface ModernInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'modern' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  containerStyle?: object;
  inputStyle?: object;
  required?: boolean;
  showValidation?: boolean;
}

export const ModernInput: React.FC<ModernInputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  variant = 'modern',
  size = 'md',
  containerStyle,
  inputStyle,
  value,
  placeholder,
  required = false,
  showValidation = false,
  ...props
}) => {
  const { theme, isDark } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const inputRef = useRef<TextInput>(null);

  const isEmpty = !value || value.trim() === '';
  const hasValidationError = showValidation && required && isEmpty;
  const displayError =
    error ||
    (hasValidationError ? `${label || 'Este campo'} é obrigatório` : null);

  // Animação de shake quando há erro de validação
  useEffect(() => {
    if (hasValidationError) {
      // Reset animations to ensure clean state
      shakeAnimation.setValue(0);
      pulseAnimation.setValue(1);

      // Shake animation
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      // Pulse animation
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.05,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [hasValidationError, shakeAnimation, pulseAnimation]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleContainerPress = () => {
    inputRef.current?.focus();
  };

  const sizeStyles = getSizeStyles(size);

  const borderColor = displayError
    ? theme.colors.error
    : isFocused
    ? theme.colors.primary
    : theme.colors.border;

  // Better background color handling for different themes
  const backgroundColor = 'transparent';

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            sizeStyles.label,
            {
              color: displayError
                ? theme.colors.error
                : theme.colors.textSecondary,
            },
          ]}
          testID="modern-input-label"
        >
          {label}
          {required && <Text style={{ color: theme.colors.error }}> *</Text>}
        </Text>
      )}

      <TouchableWithoutFeedback onPress={handleContainerPress}>
        <Animated.View
          style={[
            styles.inputContainer,
            sizeStyles.container,
            {
              backgroundColor: hasValidationError
                ? isDark
                  ? 'rgba(220, 0, 0, 0.15)' // Dark theme: red overlay
                  : theme.colors.error + '10' // Light theme: error with opacity
                : backgroundColor,
              borderColor,
              borderWidth: variant === 'modern' ? 2 : 1,
              transform: [
                { translateX: shakeAnimation },
                { scale: pulseAnimation },
              ],
            },
          ]}
        >
          {leftIcon && (
            <View style={styles.leftIcon} testID="left-icon">
              {leftIcon}
            </View>
          )}

          <TextInput
            ref={inputRef}
            testID="modern-input"
            style={[
              styles.input,
              sizeStyles.input,
              { color: theme.colors.text, backgroundColor: 'transparent' },
              inputStyle,
            ]}
            placeholderTextColor={theme.colors.placeholder}
            placeholder={placeholder}
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={value}
            underlineColorAndroid="transparent"
            {...props}
          />

          {rightIcon && (
            <View style={styles.rightIcon} testID="right-icon">
              {rightIcon}
            </View>
          )}
        </Animated.View>
      </TouchableWithoutFeedback>

      {/* Error/Hint messages */}
      {(displayError || hint) && (
        <Animated.View
          style={[
            styles.messageContainer,
            hasValidationError && { opacity: pulseAnimation },
          ]}
          testID="message-container"
        >
          {displayError ? (
            <Text
              style={[styles.errorText, { color: theme.colors.error }]}
              testID="error-text"
            >
              {displayError}
            </Text>
          ) : (
            <Text
              style={[styles.hintText, { color: theme.colors.textSecondary }]}
              testID="hint-text"
            >
              {hint}
            </Text>
          )}
        </Animated.View>
      )}
    </View>
  );
};

const getSizeStyles = (size: 'sm' | 'md' | 'lg') => {
  const configs = {
    sm: {
      height: deviceSize(48, 52, 56),
      fontSize: adaptiveFontSizes.sm,
      labelSize: adaptiveFontSizes.xs,
      padding: adaptiveSpacing.md,
    },
    md: {
      height: deviceSize(56, 60, 64),
      fontSize: adaptiveFontSizes.md,
      labelSize: adaptiveFontSizes.sm,
      padding: adaptiveSpacing.lg,
    },
    lg: {
      height: deviceSize(64, 68, 72),
      fontSize: adaptiveFontSizes.lg,
      labelSize: adaptiveFontSizes.md,
      padding: adaptiveSpacing.xl,
    },
  };

  const config = configs[size];

  return {
    container: {
      minHeight: config.height,
    },
    input: {
      fontSize: config.fontSize,
      paddingHorizontal: config.padding,
      paddingVertical: config.padding * 0.7,
    },
    label: {
      fontSize: config.labelSize,
    },
  };
};

const styles = StyleSheet.create({
  container: {
    marginBottom: adaptiveSpacing.md, // Reduzido de lg para md
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: deviceSize(16, 18, 20), // Bordas bem arredondadas
    borderWidth: 2,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 0,
  },
  input: {
    flex: 1,
    fontWeight: '500',
    letterSpacing: 0.3,
    includeFontPadding: false,
    textAlignVertical: 'center',
    backgroundColor: 'transparent',
  },
  label: {
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: adaptiveSpacing.sm,
  },
  leftIcon: {
    marginLeft: adaptiveSpacing.lg,
    marginRight: adaptiveSpacing.sm,
  },
  rightIcon: {
    marginLeft: adaptiveSpacing.sm,
    marginRight: adaptiveSpacing.lg,
  },
  messageContainer: {
    marginTop: adaptiveSpacing.xs, // Reduzido de sm para xs
    minHeight: adaptiveSpacing.md, // Reduzido de lg para md
  },
  errorText: {
    fontSize: adaptiveFontSizes.xs,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  hintText: {
    fontSize: adaptiveFontSizes.xs,
    fontWeight: '400',
    letterSpacing: 0.2,
  },
});
