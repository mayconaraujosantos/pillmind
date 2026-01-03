import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@shared/theme';
import { useTranslation } from '@shared/i18n';
import { getOnboardingColors } from '../constants/onboarding.constants';
import { Ionicons } from '@expo/vector-icons';

interface OnboardingSuccessProps {
  onFinish?: () => void;
}

export const OnboardingSuccess: React.FC<OnboardingSuccessProps> = ({
  onFinish,
}) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const colors = useMemo(() => getOnboardingColors(isDark), [isDark]);

  return (
    <View style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
      <View style={styles.content}>
        <View style={[styles.successIcon, { backgroundColor: colors.PRIMARY }]}>
          <Ionicons name="checkmark" size={64} color={colors.BUTTON_TEXT} />
        </View>

        <Text style={[styles.title, { color: colors.TEXT_PRIMARY }]}>
          {t('onboarding.success.title')}
        </Text>

        <Text style={[styles.subtitle, { color: colors.TEXT_SECONDARY }]}>
          {t('onboarding.success.subtitle')}
        </Text>

        <TouchableOpacity
          onPress={onFinish}
          style={[
            styles.button,
            {
              backgroundColor: colors.PRIMARY,
              shadowColor: colors.PRIMARY,
            },
          ]}
        >
          <Text style={[styles.buttonText, { color: colors.BUTTON_TEXT }]}>
            {t('onboarding.success.button')}
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
  content: {
    alignItems: 'center',
    width: '100%',
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
    marginBottom: 48,
  },
  button: {
    width: '100%',
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
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
