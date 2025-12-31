import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { COMMON_STYLES } from '@shared/constants/styles';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  style,
  ...props
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor="#999"
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: COMMON_STYLES.padding.vertical.large,
  },
  label: {
    fontSize: COMMON_STYLES.fontSize.medium,
    fontWeight: COMMON_STYLES.fontWeight.semibold,
    marginBottom: COMMON_STYLES.padding.vertical.small,
    color: COMMON_STYLES.colors.text.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: COMMON_STYLES.colors.border.default,
    borderRadius: COMMON_STYLES.borderRadius.small,
    paddingHorizontal: COMMON_STYLES.padding.horizontal.medium,
    paddingVertical: COMMON_STYLES.padding.vertical.medium,
    fontSize: COMMON_STYLES.fontSize.large,
    backgroundColor: COMMON_STYLES.colors.background.white,
  },
  inputError: {
    borderColor: COMMON_STYLES.colors.error,
  },
  errorText: {
    color: COMMON_STYLES.colors.error,
    fontSize: COMMON_STYLES.fontSize.small,
    marginTop: 4,
  },
});
