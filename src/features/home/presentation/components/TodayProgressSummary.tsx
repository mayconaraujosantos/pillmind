import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Alert,
} from 'react-native';
import { useTheme } from '@shared/theme';
import { useTranslation } from '@shared/i18n';
import type { MedicineReminderQuickStats } from './MedicineReminderCalendar';

interface TodayProgressSummaryProps {
  quickStats: MedicineReminderQuickStats;
}

/**
 * Bloco superior estilo Medisafe/MyTherapy: progresso do dia + próxima dose + CTA principal.
 */
export const TodayProgressSummary: React.FC<TodayProgressSummaryProps> = ({
  quickStats,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const taken = 0;
  const total = Math.max(0, quickStats.scheduled);
  const pct = total > 0 ? Math.min(100, (taken / total) * 100) : 0;

  const onLog = () =>
    Alert.alert(t('home.quickAddDoseTitle'), t('home.quickAddDoseMessage'));

  const cardShadow = Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 10,
    },
    android: { elevation: 2 },
    default: {},
  });

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          ...cardShadow,
        },
      ]}
      testID="home-today-progress-summary"
    >
      <Text
        style={[styles.eyebrow, { color: theme.colors.textSecondary }]}
        accessibilityRole="text"
      >
        {t('home.todayPlanEyebrow')}
      </Text>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {t('home.dailyTargetTitle')}
      </Text>
      {total > 0 ? (
        <>
          <Text
            style={[styles.doseLine, { color: theme.colors.textSecondary }]}
          >
            {t('home.dailyTargetDoseLine', { taken, total })}
          </Text>
          <View
            style={[styles.track, { backgroundColor: theme.colors.border }]}
            accessibilityRole="progressbar"
            accessibilityValue={{ now: taken, min: 0, max: total }}
          >
            <View
              style={[
                styles.fill,
                {
                  width: `${pct}%`,
                  backgroundColor: theme.colors.primary,
                },
              ]}
            />
          </View>
        </>
      ) : (
        <Text
          style={[styles.doseLine, { color: theme.colors.textSecondary }]}
        >
          {t('home.dailyTargetSubtitle')}
        </Text>
      )}
      <View style={styles.nextBlock}>
        <Text
          style={[styles.nextLabel, { color: theme.colors.textSecondary }]}
        >
          {t('home.quickStatNextDose')}
        </Text>
        <Text style={[styles.nextValue, { color: theme.colors.text }]}>
          {quickStats.nextDoseLabel}
        </Text>
      </View>
      <Pressable
        onPress={onLog}
        accessibilityRole="button"
        accessibilityLabel={t('home.markDoseCta')}
        style={({ pressed }) => [
          styles.cta,
          {
            backgroundColor: theme.colors.primary,
            opacity: pressed ? 0.9 : 1,
          },
        ]}
      >
        <Text style={styles.ctaText}>{t('home.markDoseCta')}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    marginTop: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.35,
    marginBottom: 8,
  },
  doseLine: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 14,
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  nextBlock: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 14,
  },
  nextLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  nextValue: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
  cta: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
