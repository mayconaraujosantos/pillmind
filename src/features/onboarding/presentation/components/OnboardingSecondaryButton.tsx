import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { borderRadius } from '@shared/theme/borderRadius';
import {
  adaptiveSpacing,
  adaptiveFontSizes,
  deviceSize,
} from '@shared/utils/dimensions';

interface OnboardingSecondaryButtonProps {
  label: string;
  onPress?: () => void;
  textColor: string;
  backgroundColor?: string;
  style?: ViewStyle;
}

export const OnboardingSecondaryButton: React.FC<
  OnboardingSecondaryButtonProps
> = ({ label, onPress, textColor, backgroundColor, style }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: backgroundColor ?? 'transparent',
        },
        style,
      ]}
    >
      <Text
        style={[styles.label, { color: textColor }]}
        numberOfLines={1}
        ellipsizeMode="tail"
        adjustsFontSizeToFit
        minimumFontScale={0.9}
        allowFontScaling
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: adaptiveSpacing.md,
    paddingHorizontal: adaptiveSpacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: deviceSize(52, 56, 60),
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: adaptiveFontSizes.lg,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.4,
  },
});
