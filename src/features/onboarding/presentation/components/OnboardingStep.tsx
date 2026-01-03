import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { useTheme } from '@shared/theme';
import {
  OnboardingStep as OnboardingStepType,
  getOnboardingColors,
} from '../constants/onboarding.constants';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const IMAGE_HEIGHT = Math.min(SCREEN_HEIGHT * 0.4, 320);

interface OnboardingStepProps {
  step: OnboardingStepType;
}

export const OnboardingStepComponent: React.FC<OnboardingStepProps> = ({
  step,
}) => {
  const { isDark } = useTheme();
  const colors = useMemo(() => getOnboardingColors(isDark), [isDark]);

  // Mostra a imagem se ela existir, independente de ser o último step
  const shouldShowImage = step.image !== undefined && step.image !== null;

  return (
    <View style={styles.container}>
      {shouldShowImage && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: step.image }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      )}
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: colors.TEXT_PRIMARY }]}>
          {step.title}
        </Text>
        <Text style={[styles.description, { color: colors.TEXT_SECONDARY }]}>
          {step.description}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  imageContainer: {
    width: '100%',
    height: IMAGE_HEIGHT,
    maxHeight: 320,
    marginBottom: 48,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.3,
    lineHeight: 36,
    width: '100%',
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 24,
    width: '100%',
  },
});
