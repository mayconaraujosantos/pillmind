import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TextInputProps,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '@shared/theme';
import {
  adaptiveSpacing,
  scaleHeight,
  deviceSize,
} from '@shared/utils/dimensions';
import { getOnboardingColors } from '../constants/onboarding.constants';
import { OnboardingTitleBlock } from './OnboardingTitleBlock';
import { OnboardingPrimaryButton } from './OnboardingPrimaryButton';

type AuthField = {
  key: string;
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: TextInputProps['keyboardType'];
  secureTextEntry?: boolean;
  autoCapitalize?: TextInputProps['autoCapitalize'];
};

type LinkCta = {
  text: string;
  linkLabel: string;
  onPress?: () => void;
};

interface OnboardingAuthProps {
  title: string;
  subtitle: string;
  dividerLabel: string;
  fields: AuthField[];
  primaryLabel: string;
  onPrimaryPress?: () => void;
  isLoading?: boolean;
  appleLabel: string;
  onApplePress?: () => void;
  googleLabel: string;
  onGooglePress?: () => void;
  termsText?: string;
  linkCta?: LinkCta;
}

export const OnboardingAuth: React.FC<OnboardingAuthProps> = ({
  title,
  subtitle,
  dividerLabel,
  fields,
  primaryLabel,
  onPrimaryPress,
  isLoading = false,
  appleLabel: _appleLabel,
  onApplePress,
  googleLabel: _googleLabel,
  onGooglePress,
  termsText,
  linkCta,
}) => {
  const { isDark } = useTheme();
  const colors = useMemo(() => getOnboardingColors(isDark), [isDark]);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.BACKGROUND }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <OnboardingTitleBlock
        title={title}
        subtitle={subtitle}
        titleColor={colors.TEXT_PRIMARY}
        subtitleColor={colors.TEXT_SECONDARY}
      />

      <View style={styles.form}>
        {fields.map((field) => {
          const isPasswordField = field.key === 'password';

          return (
            <View key={field.key} style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.TEXT_PRIMARY }]}>
                {field.label}
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  {
                    borderBottomColor: isDark ? '#444' : '#E8E8E8',
                  },
                ]}
              >
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: colors.TEXT_PRIMARY,
                    },
                  ]}
                  placeholder={field.placeholder}
                  placeholderTextColor={colors.TEXT_SECONDARY}
                  value={field.value}
                  onChangeText={field.onChangeText}
                  keyboardType={field.keyboardType}
                  autoCapitalize={field.autoCapitalize}
                  secureTextEntry={isPasswordField && !showPassword}
                />
                {isPasswordField && (
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                    activeOpacity={0.6}
                  >
                    <Ionicons
                      name={showPassword ? 'eye' : 'eye-off'}
                      size={20}
                      color={colors.TEXT_SECONDARY}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.primaryButtonContainer}>
        <OnboardingPrimaryButton
          label={primaryLabel}
          isLoading={isLoading}
          onPress={onPrimaryPress}
          backgroundColor={colors.PRIMARY}
          shadowColor={colors.PRIMARY}
          textColor={colors.BUTTON_TEXT}
        />
      </View>

      {termsText ? (
        <View style={styles.termsContainer}>
          <Text style={[styles.termsText, { color: colors.TEXT_SECONDARY }]}>
            {termsText}
          </Text>
        </View>
      ) : null}

      <View style={styles.divider}>
        <View
          style={[
            styles.dividerLine,
            { backgroundColor: colors.INDICATOR_INACTIVE },
          ]}
        />
        <Text style={[styles.dividerText, { color: colors.TEXT_SECONDARY }]}>
          {dividerLabel}
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
            {
              backgroundColor: isDark ? '#2C2C2C' : '#FFFFFF',
              borderColor: isDark ? '#444' : '#E8E8E8',
            },
          ]}
          onPress={onGooglePress}
          activeOpacity={0.7}
          disabled={!onGooglePress}
        >
          <FontAwesome5 name="google" size={22} color="#EA4335" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.socialButton,
            {
              backgroundColor: isDark ? '#2C2C2C' : '#FFFFFF',
              borderColor: isDark ? '#444' : '#E8E8E8',
            },
          ]}
          onPress={onApplePress}
          activeOpacity={0.7}
          disabled={!onApplePress}
        >
          <FontAwesome5 name="apple" size={22} color={colors.TEXT_PRIMARY} />
        </TouchableOpacity>
      </View>

      {linkCta ? (
        <View style={styles.linkContainer}>
          <Text style={[styles.linkText, { color: colors.TEXT_SECONDARY }]}>
            {linkCta.text}{' '}
            <Text
              onPress={linkCta.onPress}
              style={{ color: colors.PRIMARY, fontWeight: '700' }}
            >
              {linkCta.linkLabel}
            </Text>
          </Text>
        </View>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: adaptiveSpacing.lg,
    paddingTop: scaleHeight(40),
    paddingBottom: adaptiveSpacing.xxl,
  },
  form: {
    marginBottom: adaptiveSpacing.xl,
    gap: adaptiveSpacing.lg,
  },
  inputGroup: {
    gap: adaptiveSpacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0,
    borderBottomWidth: 1.5,
    paddingHorizontal: 0,
    paddingVertical: adaptiveSpacing.md,
    gap: adaptiveSpacing.sm,
    minHeight: deviceSize(48, 52, 56),
  },
  input: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 0,
    fontSize: 16,
    fontWeight: '500',
  },
  eyeIcon: {
    padding: adaptiveSpacing.sm,
    marginRight: -adaptiveSpacing.sm,
  },
  primaryButtonContainer: {
    marginVertical: adaptiveSpacing.lg,
  },
  termsContainer: {
    marginVertical: adaptiveSpacing.md,
  },
  termsText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: deviceSize(16, 18, 20),
    fontWeight: '400',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: adaptiveSpacing.xl,
    gap: adaptiveSpacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '500',
  },
  socialButtons: {
    flexDirection: 'row',
    gap: adaptiveSpacing.lg,
    justifyContent: 'center',
    marginBottom: adaptiveSpacing.xl,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  linkContainer: {
    marginTop: adaptiveSpacing.lg,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
  },
});
