import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@shared/theme';
import { useTranslation } from '@shared/i18n';
import { getOnboardingColors } from '../constants/onboarding.constants';
import { Ionicons } from '@expo/vector-icons';
import { OnboardingTitleBlock } from './OnboardingTitleBlock';
import { OnboardingPrimaryButton } from './OnboardingPrimaryButton';

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

        <OnboardingTitleBlock
          title={t('onboarding.success.title')}
          subtitle={t('onboarding.success.subtitle')}
          titleColor={colors.TEXT_PRIMARY}
          subtitleColor={colors.TEXT_SECONDARY}
          containerMarginBottom={0}
          subtitleMarginBottom={48}
        />

        <OnboardingPrimaryButton
          label={t('onboarding.success.button')}
          onPress={onFinish}
          backgroundColor={colors.PRIMARY}
          textColor={colors.BUTTON_TEXT}
          shadowColor={colors.PRIMARY}
          style={{ width: '100%' }}
        />
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
});
