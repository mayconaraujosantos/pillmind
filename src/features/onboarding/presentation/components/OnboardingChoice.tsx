import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useTheme } from '@shared/theme';
import {
  OnboardingStep as OnboardingStepType,
  getOnboardingColors,
} from '../constants/onboarding.constants';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const IMAGE_HEIGHT = Math.min(SCREEN_HEIGHT * 0.4, 320);

interface OnboardingChoiceProps {
  step: OnboardingStepType;
  onCreateAccount?: () => void;
  onLogin?: () => void;
}

export const OnboardingChoice: React.FC<OnboardingChoiceProps> = ({
  step,
  onCreateAccount,
  onLogin,
}) => {
  const { isDark } = useTheme();
  const colors = useMemo(() => getOnboardingColors(isDark), [isDark]);

  return (
    <View style={styles.container}>
      {step.image && (
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

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={onCreateAccount}
          style={[
            styles.button,
            styles.createButton,
            {
              backgroundColor: colors.PRIMARY,
              shadowColor: colors.PRIMARY,
            },
          ]}
        >
          <Text style={[styles.buttonText, { color: colors.BUTTON_TEXT }]}>
            Create an account
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onLogin}
          style={[
            styles.button,
            styles.loginButton,
            { borderColor: colors.PRIMARY },
          ]}
        >
          <Text style={[styles.buttonText, { color: colors.PRIMARY }]}>
            Login
          </Text>
        </TouchableOpacity>
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
    marginBottom: 48,
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
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  createButton: {
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
});
