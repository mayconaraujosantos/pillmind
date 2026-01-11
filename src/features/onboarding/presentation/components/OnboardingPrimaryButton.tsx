import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { borderRadius } from '@shared/theme/borderRadius';
import {
  adaptiveSpacing,
  adaptiveFontSizes,
  deviceSize,
} from '@shared/utils/dimensions';

interface OnboardingPrimaryButtonProps {
  label: string;
  onPress?: () => void;
  isLoading?: boolean;
  backgroundColor: string;
  textColor: string;
  shadowColor: string;
  style?: ViewStyle;
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
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading}
      style={[
        styles.button,
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
            styles.label,
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
