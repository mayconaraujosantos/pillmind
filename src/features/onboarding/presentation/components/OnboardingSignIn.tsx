import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '@shared/theme';
import { useTranslation } from '@shared/i18n';
import { getOnboardingColors } from '../constants/onboarding.constants';

interface OnboardingSignInProps {
  onSignInComplete?: () => void;
  onGoToSignUp?: () => void;
}

export const OnboardingSignIn: React.FC<OnboardingSignInProps> = ({
  onSignInComplete,
  onGoToSignUp,
}) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const colors = useMemo(() => getOnboardingColors(isDark), [isDark]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.BACKGROUND }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.TEXT_PRIMARY }]}>
          {t('onboarding.signIn.title')}
        </Text>
        <Text style={[styles.subtitle, { color: colors.TEXT_SECONDARY }]}>
          {t('onboarding.signIn.subtitle')}
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.TEXT_PRIMARY }]}>
            {t('onboarding.signIn.email')}
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: colors.INDICATOR_INACTIVE,
                color: colors.TEXT_PRIMARY,
              },
            ]}
            placeholder={t('onboarding.signIn.emailPlaceholder')}
            placeholderTextColor={colors.TEXT_SECONDARY}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.TEXT_PRIMARY }]}>
            {t('onboarding.signIn.password')}
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: colors.INDICATOR_INACTIVE,
                color: colors.TEXT_PRIMARY,
              },
            ]}
            placeholder={t('onboarding.signIn.passwordPlaceholder')}
            placeholderTextColor={colors.TEXT_SECONDARY}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
      </View>

      <View style={styles.divider}>
        <View
          style={[
            styles.dividerLine,
            { backgroundColor: colors.INDICATOR_INACTIVE },
          ]}
        />
        <Text style={[styles.dividerText, { color: colors.TEXT_SECONDARY }]}>
          {t('onboarding.signIn.or')}
        </Text>
        <View
          style={[
            styles.dividerLine,
            { backgroundColor: colors.INDICATOR_INACTIVE },
          ]}
        />
      </View>

      <View style={styles.socialButtons}>
        <TouchableOpacity
          style={[
            styles.socialButton,
            { borderColor: colors.INDICATOR_INACTIVE },
          ]}
        >
          <Text
            style={[styles.socialButtonText, { color: colors.TEXT_PRIMARY }]}
          >
            {t('onboarding.signIn.continueWithApple')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.socialButton,
            { borderColor: colors.INDICATOR_INACTIVE },
          ]}
        >
          <Text
            style={[styles.socialButtonText, { color: colors.TEXT_PRIMARY }]}
          >
            {t('onboarding.signIn.continueWithGoogle')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.signInButtonContainer}>
        <TouchableOpacity
          onPress={onSignInComplete}
          style={[
            styles.signInButton,
            {
              backgroundColor: colors.PRIMARY,
              shadowColor: colors.PRIMARY,
            },
          ]}
        >
          <Text
            style={[styles.signInButtonText, { color: colors.BUTTON_TEXT }]}
          >
            {t('onboarding.signIn.signInButton')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.termsContainer}>
        <Text style={[styles.termsText, { color: colors.TEXT_SECONDARY }]}>
          {t('onboarding.signIn.noAccount')}{' '}
          <Text
            onPress={onGoToSignUp}
            style={{ color: colors.PRIMARY, fontWeight: '600' }}
          >
            {t('onboarding.signIn.signUpLink')}
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.3,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    marginBottom: 32,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: '400',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 14,
    fontWeight: '500',
  },
  socialButtons: {
    gap: 12,
    marginBottom: 24,
  },
  socialButton: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  signInButtonContainer: {
    marginVertical: 24,
  },
  signInButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  termsContainer: {
    marginTop: 16,
  },
  termsText: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 18,
  },
});
