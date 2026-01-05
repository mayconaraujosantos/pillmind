import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TextInputProps,
} from 'react-native';
import { useTheme } from '@shared/theme';
import { spacing } from '@shared/theme/spacing';
import { borderRadius } from '@shared/theme/borderRadius';
import { body } from '@shared/theme/typography';
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
  appleLabel: string;
  googleLabel: string;
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
  appleLabel,
  googleLabel,
  termsText,
  linkCta,
}) => {
  const { isDark } = useTheme();
  const colors = useMemo(() => getOnboardingColors(isDark), [isDark]);

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
        {fields.map((field) => (
          <View key={field.key} style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.TEXT_PRIMARY }]}>
              {field.label}
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.INDICATOR_INACTIVE,
                  color: colors.TEXT_PRIMARY,
                },
              ]}
              placeholder={field.placeholder}
              placeholderTextColor={colors.TEXT_SECONDARY}
              value={field.value}
              onChangeText={field.onChangeText}
              keyboardType={field.keyboardType}
              autoCapitalize={field.autoCapitalize}
              secureTextEntry={field.secureTextEntry}
            />
          </View>
        ))}
      </View>

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
        {[appleLabel, googleLabel].map((label) => (
          <TouchableOpacity
            key={label}
            style={[
              styles.socialButton,
              { borderColor: colors.INDICATOR_INACTIVE },
            ]}
          >
            <Text
              style={[styles.socialButtonText, { color: colors.TEXT_PRIMARY }]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.primaryButtonContainer}>
        <OnboardingPrimaryButton
          label={primaryLabel}
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

      {linkCta ? (
        <View style={styles.linkContainer}>
          <Text style={[styles.linkText, { color: colors.TEXT_SECONDARY }]}>
            {linkCta.text}{' '}
            <Text
              onPress={linkCta.onPress}
              style={{ color: colors.PRIMARY, fontWeight: '600' }}
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  form: {
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  inputGroup: {
    gap: spacing.xs,
  },
  label: {
    ...body.lMedium,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    ...body.mRegular,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
    gap: spacing.xs,
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
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  socialButton: {
    borderWidth: 1.5,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonText: {
    ...body.lMedium,
  },
  primaryButtonContainer: {
    marginVertical: spacing.md,
  },
  termsContainer: {
    marginTop: spacing.sm,
  },
  termsText: {
    ...body.xmRegular,
    textAlign: 'center',
  },
  linkContainer: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  linkText: {
    ...body.mRegular,
    textAlign: 'center',
  },
});
