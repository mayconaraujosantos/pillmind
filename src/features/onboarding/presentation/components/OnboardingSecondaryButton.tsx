import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { spacing } from '@shared/theme/spacing';
import { borderRadius } from '@shared/theme/borderRadius';
import { button as buttonTypography } from '@shared/theme/typography';

interface OnboardingSecondaryButtonProps {
  label: string;
  onPress?: () => void;
  borderColor: string;
  textColor: string;
  backgroundColor?: string;
  style?: ViewStyle;
}

export const OnboardingSecondaryButton: React.FC<
  OnboardingSecondaryButtonProps
> = ({ label, onPress, borderColor, textColor, backgroundColor, style }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        {
          borderColor,
          backgroundColor: backgroundColor ?? 'transparent',
        },
        style,
      ]}
    >
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    borderWidth: 1.5,
  },
  label: {
    ...buttonTypography.mMedium,
  },
});
