import { borderRadius } from '@shared/theme/borderRadius';
import {
  adaptiveFontSizes,
  adaptiveSpacing,
  deviceSize,
} from '@shared/utils/dimensions';
import { StyleSheet } from 'react-native';

export const onboardingButtonStyles = StyleSheet.create({
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
