import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OnboardingIndicator } from '../components/OnboardingIndicator';
import { OnboardingStepComponent } from '../components/OnboardingStep';
import {
  ONBOARDING_STEPS,
  ONBOARDING_COLORS,
  ONBOARDING_TEXTS,
} from '../constants/onboarding.constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingScreenProps {
  onFinish?: () => void;
  onSkip?: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onFinish,
  onSkip,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const insets = useSafeAreaInsets();

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newStep = Math.round(contentOffsetX / SCREEN_WIDTH);

    if (newStep >= 0 && newStep < ONBOARDING_STEPS.length) {
      setCurrentStep(newStep);
    }
  };

  const skip = () => {
    onSkip?.();
  };

  const handleSignIn = () => {
    //  Implementar navegação para Sign In
    onFinish?.();
  };

  const handleSignUp = () => {
    //  Implementar navegação para Sign Up
    onFinish?.();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {Platform.OS === 'android' && (
        <RNStatusBar
          barStyle="dark-content"
          backgroundColor={ONBOARDING_COLORS.BACKGROUND}
          translucent={false}
        />
      )}
      <View
        style={[styles.header, { paddingTop: Math.max(insets.top, 20) + 20 }]}
      >
        <TouchableOpacity
          onPress={skip}
          style={styles.skipButton}
          activeOpacity={0.7}
        >
          <Ionicons
            name="close"
            size={20}
            color={ONBOARDING_COLORS.TEXT_SECONDARY}
            style={styles.skipIcon}
          />
          <Text style={styles.skipText}>{ONBOARDING_TEXTS.SKIP}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {ONBOARDING_STEPS.map((step) => (
          <View key={step.id} style={styles.stepContainer}>
            <OnboardingStepComponent step={step} />
          </View>
        ))}
      </ScrollView>

      <View style={styles.indicatorContainer}>
        <OnboardingIndicator
          totalSteps={ONBOARDING_STEPS.length}
          currentStep={currentStep}
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleSignIn}
            style={[styles.button, styles.signInButton]}
          >
            <Text style={styles.signInButtonText}>
              {ONBOARDING_TEXTS.SIGN_IN}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSignUp}
            style={[styles.button, styles.signUpButton]}
          >
            <Text style={styles.signUpButtonText}>
              {ONBOARDING_TEXTS.SIGN_UP}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ONBOARDING_COLORS.BACKGROUND,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 8,
    alignItems: 'flex-end',
    zIndex: 1,
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    minWidth: 80,
  },
  skipIcon: {
    marginRight: 6,
  },
  skipText: {
    fontSize: 14,
    color: ONBOARDING_COLORS.TEXT_SECONDARY,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  scrollView: {
    flex: 1,
  },
  stepContainer: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  indicatorContainer: {
    paddingVertical: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 48,
    paddingTop: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  button: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  signInButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: ONBOARDING_COLORS.PRIMARY,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: ONBOARDING_COLORS.PRIMARY,
    letterSpacing: 0.5,
  },
  signUpButton: {
    backgroundColor: ONBOARDING_COLORS.PRIMARY,
    shadowColor: ONBOARDING_COLORS.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: ONBOARDING_COLORS.BUTTON_TEXT,
    letterSpacing: 0.5,
  },
});
