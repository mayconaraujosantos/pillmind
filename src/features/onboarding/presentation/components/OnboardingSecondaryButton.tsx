import React from 'react';
import { TouchableOpacity, Text, ViewStyle } from 'react-native';
import { onboardingButtonStyles } from './onboardingButtonStyles';

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
        onboardingButtonStyles.button,
        {
          backgroundColor: backgroundColor ?? 'transparent',
          borderColor: borderColor ?? textColor,
          borderWidth: borderColor ? 2 : 0,
        },
        style,
      ]}
    >
      <Text
        style={[onboardingButtonStyles.label, { color: textColor }]}
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
