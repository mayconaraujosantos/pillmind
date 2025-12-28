import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { OnboardingStep as OnboardingStepType } from '../constants/onboarding.constants';
import { ONBOARDING_COLORS } from '../constants/onboarding.constants';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const IMAGE_HEIGHT = Math.min(SCREEN_HEIGHT * 0.4, 320);

interface OnboardingStepProps {
  step: OnboardingStepType;
  isLastStep?: boolean;
}

export const OnboardingStepComponent: React.FC<OnboardingStepProps> = ({
  step,
  isLastStep = false,
}) => {
  return (
    <View style={styles.container}>
      {!isLastStep && (
        <View style={styles.imageContainer}>
          {step.image ? (
            <Image
              source={{ uri: step.image }}
              style={styles.image}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.placeholderImage} />
          )}
        </View>
      )}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.description}>{step.description}</Text>
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
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: ONBOARDING_COLORS.INDICATOR_INACTIVE,
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
    color: ONBOARDING_COLORS.TEXT_PRIMARY,
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.3,
    lineHeight: 36,
    width: '100%',
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    color: ONBOARDING_COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 24,
    width: '100%',
  },
});
