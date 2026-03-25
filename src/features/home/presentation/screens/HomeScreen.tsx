import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
  Platform,
  Image,
} from 'react-native';
import { ScreenWrapper, Loader, SkeletonCard } from '@shared/components';
import { useOnboardingStorage } from '@features/onboarding';
import { useTheme } from '@shared/theme';
import type { Theme } from '@shared/theme';
import { useTranslation } from '@shared/i18n';
import type { TFunction } from 'i18next';
import { Ionicons } from '@expo/vector-icons';
import { MedicineReminderCalendar, HomeGreetingHero } from '../components';
import { useHomeData } from '../hooks/useHomeData';
import { GetMedicinesUseCase } from '../../domain/useCases/GetMedicinesUseCase';
import { MockMedicineRepository } from '../hooks/__mocks__/mockMedicineRepository';
import type { Medicine } from '../../domain/entities/Medicine';

// TODO: Replace with real repository when API is ready
const medicineRepository = new MockMedicineRepository();
const getMedicinesUseCase = new GetMedicinesUseCase(medicineRepository);

const MEDICINES_PREVIEW_LIMIT = 5;

const startOfLocalDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

const isMedicineActiveOnDay = (m: Medicine, day: Date) => {
  if (!m.startDate) return false;
  const dayT = startOfLocalDay(day);
  const start = startOfLocalDay(new Date(m.startDate));
  const end = m.endDate
    ? startOfLocalDay(new Date(m.endDate))
    : Number.MAX_SAFE_INTEGER;
  return dayT >= start && dayT <= end;
};

const timeStringToMinutes = (s: string): number | null => {
  const m = s.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) return null;
  const hh = Number(m[1]);
  const min = Number(m[2]);
  if (hh > 23 || min > 59) return null;
  return hh * 60 + min;
};

const formatMinutesAsClock = (minutes: number, locale?: string) => {
  const h = Math.floor(minutes / 60);
  const min = minutes % 60;
  const ref = new Date();
  ref.setHours(h, min, 0, 0);
  return ref.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

function computeHomeQuickStats(
  medicines: Medicine[],
  selectedDate: Date,
  now: Date,
  t: TFunction,
  locale?: string
): {
  scheduled: number;
  nextDoseLabel: string;
  adherencePct: number;
} {
  const activeOnDay = medicines.filter((m) =>
    isMedicineActiveOnDay(m, selectedDate)
  );
  const scheduled = activeOnDay.reduce(
    (acc, m) => acc + (m.times?.length ?? 0),
    0
  );

  const minutesList: number[] = [];
  for (const m of activeOnDay) {
    for (const slot of m.times ?? []) {
      const mins = timeStringToMinutes(slot);
      if (mins != null) minutesList.push(mins);
    }
  }
  minutesList.sort((a, b) => a - b);

  const selDay = startOfLocalDay(selectedDate);
  const todayDay = startOfLocalDay(now);
  let nextDoseLabel: string;
  if (minutesList.length === 0) {
    nextDoseLabel = t('home.quickStatNoNextDose');
  } else if (selDay < todayDay) {
    nextDoseLabel = t('home.quickStatPastDay');
  } else if (selDay > todayDay) {
    nextDoseLabel = formatMinutesAsClock(minutesList[0], locale);
  } else {
    const nowMins = now.getHours() * 60 + now.getMinutes();
    const upcoming = minutesList.find((x) => x > nowMins);
    const pick = upcoming != null ? upcoming : minutesList[0];
    nextDoseLabel = formatMinutesAsClock(pick, locale);
  }

  const withTimes = activeOnDay.filter(
    (m) => (m.times?.length ?? 0) > 0
  ).length;
  const adherencePct =
    activeOnDay.length === 0
      ? 0
      : Math.round((withTimes / activeOnDay.length) * 100);

  return { scheduled, nextDoseLabel, adherencePct };
}

function MedicineAlarmHeroCard({
  medicine,
  theme,
  t,
}: {
  medicine: Medicine;
  theme: Theme;
  t: TFunction;
}) {
  const [imageFailed, setImageFailed] = React.useState(false);
  const showPhoto = Boolean(medicine.imageUrl) && !imageFailed;
  const frequencyPretty = medicine.frequency.replace(/-/g, ' ');
  const alarmTimes =
    medicine.times.length > 0
      ? medicine.times.join(' · ')
      : t('home.noFixedAlarmTimes');

  const cardShadow = Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.07,
      shadowRadius: 16,
    },
    android: { elevation: 3 },
    default: {},
  });

  return (
    <View
      style={[
        styles.medicineHeroCard,
        {
          backgroundColor: theme.colors.surface,
          borderColor: 'rgba(0,0,0,0.06)',
          ...cardShadow,
        },
      ]}
    >
      <View style={styles.medicineHeroDecor} pointerEvents="none">
        <View style={[styles.medicineHeroBlob, styles.medicineHeroBlob1]} />
        <View style={[styles.medicineHeroBlob, styles.medicineHeroBlob2]} />
        <View style={[styles.medicineHeroBlob, styles.medicineHeroBlob3]} />
      </View>
      <View style={styles.medicineHeroInner}>
        <View style={styles.medicineHeroRow}>
          <View style={styles.medicineHeroTextCol}>
            <Text
              style={[styles.medicineHeroName, { color: theme.colors.text }]}
            >
              {medicine.name}
            </Text>
            <Text
              style={[
                styles.medicineHeroMeta,
                { color: theme.colors.textSecondary },
              ]}
            >
              {medicine.dosage} · {frequencyPretty}
            </Text>
            <View style={styles.medicineHeroAlarmRow}>
              <Ionicons
                name="alarm-outline"
                size={16}
                color={theme.colors.primary}
              />
              <Text
                style={[
                  styles.medicineHeroAlarmText,
                  { color: theme.colors.text },
                ]}
              >
                {alarmTimes}
              </Text>
            </View>
            {medicine.notes ? (
              <Text
                style={[
                  styles.medicineHeroNotes,
                  { color: theme.colors.textSecondary },
                ]}
                numberOfLines={3}
              >
                {medicine.notes}
              </Text>
            ) : null}
          </View>
          <View
            style={[
              styles.medicineHeroImageRing,
              { borderColor: '#D8DCFF', backgroundColor: '#F4F5FF' },
            ]}
          >
            {showPhoto ? (
              <Image
                source={{ uri: medicine.imageUrl }}
                style={styles.medicineHeroImage}
                resizeMode="cover"
                accessibilityIgnoresInvertColors
                onError={() => setImageFailed(true)}
              />
            ) : (
              <Ionicons name="medical" size={34} color={theme.colors.primary} />
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

export const HomeScreen: React.FC = () => {
  useOnboardingStorage();
  const { theme } = useTheme();
  const { t, i18n, ready } = useTranslation();
  const { medicines, loading, refreshing, error, refresh } =
    useHomeData(getMedicinesUseCase);
  const [showAllMedicines, setShowAllMedicines] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(() => new Date());
  const [viewMode, setViewMode] = React.useState<'today' | 'week' | 'month'>(
    'today'
  );

  const visibleMedicines = showAllMedicines
    ? medicines
    : medicines.slice(0, MEDICINES_PREVIEW_LIMIT);
  const viewAllLabel = showAllMedicines
    ? t('home.viewLess')
    : t('home.viewAll');

  const quickStats = React.useMemo(
    () =>
      computeHomeQuickStats(
        medicines,
        selectedDate,
        new Date(),
        t,
        i18n.language
      ),
    // `ready` + `t`: sem isso, a 1ª execução pode cachear a chave literal (ex.: home.quickStat…).
    [medicines, selectedDate, i18n.language, ready, t]
  );

  const renderMedicinesContent = () => {
    if (loading && medicines.length === 0) {
      return (
        <View>
          {[1, 2, 3].map((i) => (
            <SkeletonCard
              key={i}
              lines={2}
              showAvatar={false}
              style={styles.medicineHeroSkeleton}
            />
          ))}
        </View>
      );
    }

    if (medicines.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons
            name="medkit-outline"
            size={64}
            color={theme.colors.textSecondary}
          />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
            {t('home.noMedicationsScheduled')}
          </Text>
          <Text
            style={[
              styles.emptySubtitle,
              { color: theme.colors.textSecondary },
            ]}
          >
            {t('home.addFirstMedication')}
          </Text>
          <TouchableOpacity
            style={[
              styles.addMedicationButton,
              { backgroundColor: theme.colors.primary },
            ]}
            activeOpacity={0.85}
          >
            <Text style={styles.addMedicationText}>
              + {t('home.addMedication')}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <>
        {visibleMedicines.map((medicine) => (
          <MedicineAlarmHeroCard
            key={medicine.id}
            medicine={medicine}
            theme={theme}
            t={t}
          />
        ))}

        {medicines.length > MEDICINES_PREVIEW_LIMIT && (
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => setShowAllMedicines((prev) => !prev)}
          >
            <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
              {viewAllLabel}
            </Text>
          </TouchableOpacity>
        )}
      </>
    );
  };

  // Show error alert if there's an error
  React.useEffect(() => {
    if (error) {
      Alert.alert(t('common.error'), error, [
        {
          text: t('common.retry'),
          onPress: () => {
            void refresh();
          },
        },
        {
          text: t('common.ok'),
          style: 'cancel',
        },
      ]);
    }
  }, [error, refresh]);

  // Show full-screen loader on initial load
  if (loading && medicines.length === 0) {
    return (
      <ScreenWrapper tabContentCanvas homeSoftTint>
        <Loader
          variant="fullscreen"
          message={t('home.loadingMedications')}
          testID="home-initial-loader"
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper tabContentCanvas homeSoftTint>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              void refresh();
            }}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        testID="home-scroll-view"
      >
        <HomeGreetingHero />
        <View style={styles.searchRow}>
          <View
            style={[
              styles.searchCard,
              {
                backgroundColor: theme.colors.surface,
                ...Platform.select({
                  ios: {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.06,
                    shadowRadius: 10,
                  },
                  android: { elevation: 2 },
                  default: {},
                }),
              },
            ]}
          >
            <Ionicons
              name="search-outline"
              size={18}
              color={theme.colors.textSecondary}
            />
            <Text
              style={[
                styles.searchPlaceholder,
                { color: theme.colors.textSecondary },
              ]}
            >
              {t('home.searchPlaceholderDots')}
            </Text>
          </View>
          <View
            style={[
              styles.searchCalendarAction,
              {
                backgroundColor: theme.colors.surface,
                ...Platform.select({
                  ios: {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.06,
                    shadowRadius: 8,
                  },
                  android: { elevation: 2 },
                  default: {},
                }),
              },
            ]}
          >
            <Ionicons
              name="calendar-outline"
              size={18}
              color={theme.colors.text}
            />
          </View>
        </View>

        <MedicineReminderCalendar
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          quickStats={quickStats}
        />

        {/* Medicines — layout estilo card “Daily target”: info + foto no círculo */}
        <View style={styles.medicinesSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('home.yourMedications')}
          </Text>
          {refreshing && medicines.length > 0 && (
            <View style={styles.refreshLoader}>
              <Loader
                variant="inline"
                size="small"
                message={t('home.refreshingMedications')}
                testID="home-refresh-loader"
              />
            </View>
          )}
          {renderMedicinesContent()}
        </View>

        <View
          style={[
            styles.hydrationCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: 'rgba(0,0,0,0.06)',
              ...Platform.select({
                ios: {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.06,
                  shadowRadius: 14,
                },
                android: { elevation: 2 },
                default: {},
              }),
            },
          ]}
        >
          <View style={styles.hydrationHeader}>
            <Text style={[styles.hydrationTitle, { color: theme.colors.text }]}>
              {t('home.hydrationLikeTitle')}
            </Text>
            <TouchableOpacity
              style={styles.hydrationFilterBtn}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.hydrationFilter,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {t('home.thisWeekLabel')}
              </Text>
              <Ionicons
                name="chevron-down"
                size={16}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.chartRow}>
            <View style={styles.yAxis}>
              <Text
                style={[
                  styles.yAxisLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                100
              </Text>
              <Text
                style={[
                  styles.yAxisLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                75
              </Text>
              <Text
                style={[
                  styles.yAxisLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                50
              </Text>
            </View>
            <View style={styles.barRow}>
              {[42, 68, 55, 73, 34, 61, 80].map((value, idx) => (
                <View key={idx} style={styles.barCol}>
                  <View
                    style={[styles.barTrack, { backgroundColor: '#E8EAFF' }]}
                  >
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: `${value}%`,
                          backgroundColor: theme.colors.primary,
                        },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Controles de Debug - só aparecem em desenvolvimento */}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 18,
    paddingBottom: 28,
  },
  searchRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchCard: {
    flex: 1,
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchPlaceholder: {
    marginLeft: 10,
    fontSize: 14,
    flex: 1,
  },
  searchCalendarAction: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medicineHeroSkeleton: {
    marginBottom: 12,
    minHeight: 132,
    borderRadius: 28,
  },
  medicineHeroCard: {
    marginBottom: 14,
    borderRadius: 28,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  medicineHeroDecor: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  medicineHeroBlob: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.32,
  },
  medicineHeroBlob1: {
    width: 200,
    height: 200,
    backgroundColor: '#C9CEFF',
    bottom: -110,
    left: -50,
  },
  medicineHeroBlob2: {
    width: 140,
    height: 140,
    backgroundColor: '#A8B0FF',
    bottom: -70,
    right: -30,
  },
  medicineHeroBlob3: {
    width: 100,
    height: 100,
    backgroundColor: '#E2E4FF',
    bottom: -40,
    left: '38%',
  },
  medicineHeroInner: {
    padding: 18,
    zIndex: 1,
  },
  medicineHeroRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  medicineHeroTextCol: {
    flex: 1,
    minWidth: 0,
    paddingRight: 4,
  },
  medicineHeroName: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.35,
  },
  medicineHeroMeta: {
    fontSize: 13,
    marginTop: 6,
    lineHeight: 18,
  },
  medicineHeroAlarmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  medicineHeroAlarmText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
    flex: 1,
  },
  medicineHeroNotes: {
    fontSize: 12,
    marginTop: 8,
    lineHeight: 16,
  },
  medicineHeroImageRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  medicineHeroImage: {
    width: '100%',
    height: '100%',
  },
  hydrationCard: {
    marginTop: 14,
    borderRadius: 28,
    padding: 18,
    borderWidth: StyleSheet.hairlineWidth,
  },
  hydrationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  hydrationTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  hydrationFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hydrationFilter: {
    fontSize: 13,
    fontWeight: '600',
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  yAxis: {
    width: 28,
    justifyContent: 'space-between',
    paddingRight: 6,
    paddingBottom: 2,
    paddingTop: 4,
  },
  yAxisLabel: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'right',
  },
  barRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    height: 96,
  },
  barCol: {
    flex: 1,
  },
  barTrack: {
    height: 96,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 10,
  },
  medicinesSection: {
    marginTop: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 14,
  },
  refreshLoader: {
    marginBottom: 12,
  },
  viewAllButton: {
    alignSelf: 'center',
    paddingVertical: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySubtitle: {
    marginTop: 8,
    fontSize: 13,
    textAlign: 'center',
  },
  addMedicationButton: {
    marginTop: 18,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMedicationText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
