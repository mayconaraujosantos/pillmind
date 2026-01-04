import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { spacing } from '@shared/theme/spacing';
import { borderRadius } from '@shared/theme/borderRadius';
import { button as buttonTypography } from '@shared/theme/typography';

interface OnboardingPrimaryButtonProps {
  label: string;
  onPress?: () => void;
  backgroundColor: string;
  textColor: string;
  shadowColor: string;
  style?: ViewStyle;
}

export const OnboardingPrimaryButton: React.FC<
  OnboardingPrimaryButtonProps
> = ({ label, onPress, backgroundColor, textColor, shadowColor, style }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor,
          shadowColor,
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
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  label: {
    ...buttonTypography.mMedium,
  },
});
