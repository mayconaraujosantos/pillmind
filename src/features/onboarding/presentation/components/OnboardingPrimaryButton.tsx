import React from 'react';
import {
  TouchableOpacity,
  Text,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { onboardingButtonStyles } from './onboardingButtonStyles';

interface OnboardingPrimaryButtonProps {
  label: string;
  onPress?: () => void;
  isLoading?: boolean;
  backgroundColor: string;
  textColor: string;
  shadowColor: string;
  style?: ViewStyle;
  testID?: string;
}

export const OnboardingPrimaryButton: React.FC<
  OnboardingPrimaryButtonProps
> = ({
  label,
  onPress,
  isLoading = false,
  backgroundColor,
  textColor,
  shadowColor,
  style,
  testID,
}) => {
  return (
    <TouchableOpacity
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      disabled={isLoading}
      style={[
        onboardingButtonStyles.button,
        {
          backgroundColor,
          shadowColor,
          opacity: isLoading ? 0.7 : 1,
        },
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text
          style={[
            onboardingButtonStyles.label,
            { color: textColor, textAlignVertical: 'center' },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
          adjustsFontSizeToFit
          minimumFontScale={0.9}
          allowFontScaling
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};
