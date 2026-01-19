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
  borderColor?: string;
  backgroundColor?: string;
  style?: ViewStyle;
}

export const OnboardingSecondaryButton: React.FC<
  OnboardingSecondaryButtonProps
> = ({ label, onPress, textColor, borderColor, backgroundColor, style }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: backgroundColor ?? 'transparent',
          borderColor: borderColor ?? textColor,
          borderWidth: borderColor ? 2 : 0,
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
    paddingVertical: adaptiveSpacing.sm,
    paddingHorizontal: adaptiveSpacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: deviceSize(46, 50, 54),
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: adaptiveFontSizes.md,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.4,
  },
});
