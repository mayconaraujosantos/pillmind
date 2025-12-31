import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COMMON_STYLES } from '@shared/constants/styles';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, styles[`${variant}Text`], textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: COMMON_STYLES.padding.vertical.medium,
    paddingHorizontal: COMMON_STYLES.padding.horizontal.large,
    borderRadius: COMMON_STYLES.borderRadius.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: COMMON_STYLES.colors.primary,
  },
  secondary: {
    backgroundColor: COMMON_STYLES.colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COMMON_STYLES.colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: COMMON_STYLES.fontSize.large,
    fontWeight: COMMON_STYLES.fontWeight.semibold,
  },
  primaryText: {
    color: COMMON_STYLES.colors.text.white,
  },
  secondaryText: {
    color: COMMON_STYLES.colors.text.white,
  },
  outlineText: {
    color: COMMON_STYLES.colors.primary,
  },
});
