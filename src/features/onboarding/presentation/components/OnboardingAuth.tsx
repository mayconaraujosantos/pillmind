import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInputProps,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '@shared/theme';
import { ModernInput, ValidationAlert } from '@shared/components';
import {
  adaptiveSpacing,
  scaleHeight,
  deviceSize,
} from '@shared/utils/dimensions';
import { getOnboardingColors } from '../constants/onboarding.constants';
import { OnboardingTitleBlock } from './OnboardingTitleBlock';
import { OnboardingPrimaryButton } from './OnboardingPrimaryButton';
import { OnboardingSecondaryButton } from './OnboardingSecondaryButton';

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
  testID?: string;
};

interface OnboardingAuthProps {
  title: string;
  subtitle: string;
  dividerLabel: string;
  fields: AuthField[];
  primaryLabel: string;
  onPrimaryPress?: () => void;
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
  isLoading?: boolean;
  appleLabel: string;
  onApplePress?: () => void;
  appleDisabled?: boolean;
  googleLabel: string;
  onGooglePress?: () => void;
  googleDisabled?: boolean;
  googleLoading?: boolean;
  termsText?: string;
  linkCta?: LinkCta;
  footerInfo?: string;
}

export const OnboardingAuth: React.FC<OnboardingAuthProps> = ({
  title,
  subtitle,
  dividerLabel,
  fields,
  primaryLabel,
  onPrimaryPress,
  secondaryLabel,
  onSecondaryPress,
  isLoading = false,
  appleLabel: _appleLabel,
  onApplePress,
  appleDisabled = false,
  googleLabel: _googleLabel,
  onGooglePress,
  googleDisabled = false,
  googleLoading = false,
  termsText,
  linkCta,
  footerInfo,
}) => {
  const { isDark } = useTheme();
  const colors = useMemo(() => getOnboardingColors(isDark), [isDark]);
  const [showPassword, setShowPassword] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  const validateFields = (): boolean => {
    const requiredFields = fields.filter(
      (field) =>
        field.key === 'email' ||
        field.key === 'password' ||
        field.key === 'name'
    );

    return requiredFields.every(
      (field) => field.value && field.value.trim() !== ''
    );
  };

  const handlePrimaryPress = () => {
    if (!validateFields()) {
      setShowValidation(true);
      // Remove validation state after 3 seconds
      setTimeout(() => setShowValidation(false), 3000);
      return;
    }

    setShowValidation(false);
    onPrimaryPress?.();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.BACKGROUND }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <ValidationAlert
        visible={showValidation}
        message="Por favor, preencha todos os campos obrigatórios (*)"
        onDismiss={() => setShowValidation(false)}
      />

      <OnboardingTitleBlock
        title={title}
        subtitle={subtitle}
        titleColor={colors.TEXT_PRIMARY}
        subtitleColor={colors.TEXT_SECONDARY}
      />

      <View style={styles.form}>
        {fields.map((field) => {
          const isPasswordField =
            field.key === 'password' || field.key === 'confirmPassword';
          const isRequired = field.key === 'email' || field.key === 'password';

          const getLeftIcon = () => {
            if (field.key === 'email') {
              return (
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={colors.TEXT_SECONDARY}
                />
              );
            }
            if (isPasswordField) {
              return (
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={colors.TEXT_SECONDARY}
                />
              );
            }
            return null;
          };

          return (
            <ModernInput
              key={field.key}
              label={field.label}
              placeholder={field.placeholder}
              value={field.value}
              onChangeText={field.onChangeText}
              keyboardType={field.keyboardType}
              autoCapitalize={field.autoCapitalize}
              secureTextEntry={isPasswordField && !showPassword}
              variant="modern"
              size="md"
              required={isRequired}
              showValidation={showValidation}
              leftIcon={getLeftIcon()}
              rightIcon={
                isPasswordField ? (
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    activeOpacity={0.6}
                  >
                    <Ionicons
                      name={showPassword ? 'eye' : 'eye-off'}
                      size={20}
                      color={colors.TEXT_SECONDARY}
                    />
                  </TouchableOpacity>
                ) : null
              }
            />
          );
        })}
      </View>

      <View style={styles.buttonsContainer}>
        <OnboardingPrimaryButton
          testID="onboarding-auth-submit-button"
          label={primaryLabel}
          isLoading={isLoading}
          onPress={handlePrimaryPress}
          backgroundColor={colors.PRIMARY}
          shadowColor={colors.PRIMARY}
          textColor={colors.BUTTON_TEXT}
        />
        {secondaryLabel && (
          <OnboardingSecondaryButton
            label={secondaryLabel}
            onPress={onSecondaryPress}
            borderColor={colors.PRIMARY}
            textColor={colors.PRIMARY}
          />
        )}
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
              backgroundColor: colors.BACKGROUND,
              borderColor: colors.INDICATOR_INACTIVE,
              opacity:
                !onGooglePress || googleDisabled || googleLoading ? 0.5 : 1,
            },
          ]}
          onPress={onGooglePress}
          activeOpacity={0.7}
          disabled={!onGooglePress || googleDisabled || googleLoading}
        >
          {googleLoading ? (
            <ActivityIndicator size="small" color="#EA4335" />
          ) : (
            <FontAwesome5 name="google" size={22} color="#EA4335" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.socialButton,
            {
              backgroundColor: colors.BACKGROUND,
              borderColor: colors.INDICATOR_INACTIVE,
              opacity: !onApplePress || appleDisabled ? 0.5 : 1,
            },
          ]}
          onPress={onApplePress}
          activeOpacity={0.7}
          disabled={!onApplePress || appleDisabled}
        >
          <FontAwesome5 name="apple" size={22} color={colors.TEXT_PRIMARY} />
        </TouchableOpacity>
      </View>

      {linkCta ? (
        <View style={styles.linkContainer}>
          <Text style={[styles.linkText, { color: colors.TEXT_SECONDARY }]}>
            {linkCta.text}{' '}
            <Text
              testID={linkCta.testID}
              onPress={linkCta.onPress}
              style={{ color: colors.PRIMARY, fontWeight: '700' }}
            >
              {linkCta.linkLabel}
            </Text>
          </Text>
        </View>
      ) : null}

      {footerInfo ? (
        <View style={styles.footerContainer}>
          <Text style={[styles.footerText, { color: colors.TEXT_SECONDARY }]}>
            {footerInfo}
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
    paddingTop: scaleHeight(50), // Reduzido de 40 para 32
    paddingBottom: adaptiveSpacing.xl, // Reduzido de xxl para xl
  },
  form: {
    marginBottom: adaptiveSpacing.lg,
    gap: adaptiveSpacing.sm, // Reduzido de lg para sm
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
  buttonsContainer: {
    marginVertical: adaptiveSpacing.md, // Reduzido de lg para md
    gap: adaptiveSpacing.sm,
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
    marginVertical: adaptiveSpacing.lg, // Reduzido de xl para lg
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
    marginBottom: adaptiveSpacing.lg, // Reduzido de xl para lg
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
    marginTop: adaptiveSpacing.md, // Reduzido de lg para md
    alignItems: 'center',
  },
  linkText: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  footerContainer: {
    marginTop: adaptiveSpacing.md,
    alignItems: 'center',
    paddingHorizontal: adaptiveSpacing.sm,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 18,
  },
});
