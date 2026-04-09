import { Ionicons } from '@expo/vector-icons';
import { useOnboardingStorage } from '@features/onboarding';
import { Loader, ScreenWrapper, SkeletonCard } from '@shared/components';
import { useComponentTracker, useNavigationLogger } from '@shared/hooks';
import { useTranslation } from '@shared/i18n';
import { useTheme } from '@shared/theme';
import { useFocusEffect, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import type { TFunction } from 'i18next';
import React from 'react';
import {
  Alert,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { Medicine } from '../../domain/entities/Medicine';
import {
  createMedicineUseCase,
  deleteMedicineUseCase,
  getMedicinesUseCase,
  updateMedicineUseCase,
} from '../../medicineServices';
import {
  HomeGreetingHero,
  MedicationScheduleRow,
  MedicineReminderCalendar,
  TodayProgressSummary,
} from '../components';
import { useHomeMedicines } from '../hooks/useHomeMedicines';

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

export const HomeScreen: React.FC = () => {
  // Hooks de logging e tracking
  const { logScreenEvent, logError } = useNavigationLogger({
    screenName: 'Home',
    additionalData: { version: '1.0' },
  });
  const { trackEvent, trackError } = useComponentTracker('HomeScreen');

  useOnboardingStorage();
  const { theme, isDark } = useTheme();
  const { t, i18n, ready } = useTranslation();
  const router = useRouter();
  const {
    medicines,
    loading,
    refreshing,
    error,
    refresh,
    syncMedicines,
    deleteMedicine,
  } = useHomeMedicines(
    getMedicinesUseCase,
    createMedicineUseCase,
    updateMedicineUseCase,
    deleteMedicineUseCase
  );
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showAllMedicines, setShowAllMedicines] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(() => new Date());
  const [viewMode, setViewMode] = React.useState<'today' | 'week' | 'month'>(
    'today'
  );

  useFocusEffect(
    React.useCallback(() => {
      logScreenEvent('Screen Focused - Syncing Medicines');
      trackEvent('screen_focus_sync', { medicineCount: medicines.length });
      void syncMedicines();
    }, [syncMedicines, medicines.length])
  );

  const medicinesFiltered = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return medicines;

    const filtered = medicines.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.dosage.toLowerCase().includes(q) ||
        m.notes?.toLowerCase().includes(q)
    );

    trackEvent('medicines_filtered', {
      query: q,
      totalMedicines: medicines.length,
      filteredCount: filtered.length,
    });

    return filtered;
  }, [medicines, searchQuery]);

  const medicinesForSelectedDay = React.useMemo(
    () =>
      medicinesFiltered.filter((m) => isMedicineActiveOnDay(m, selectedDate)),
    [medicinesFiltered, selectedDate]
  );

  const visibleMedicines = showAllMedicines
    ? medicinesForSelectedDay
    : medicinesForSelectedDay.slice(0, MEDICINES_PREVIEW_LIMIT);
  const viewAllLabel = showAllMedicines
    ? t('home.viewLess')
    : t('home.viewAll');
  const showViewAllToggle =
    medicinesForSelectedDay.length > MEDICINES_PREVIEW_LIMIT;

  const quickStats = React.useMemo(
    () =>
      computeHomeQuickStats(
        medicinesFiltered,
        selectedDate,
        new Date(),
        t,
        i18n.language
      ),
    // `ready` + `t`: sem isso, a 1ª execução pode cachear a chave literal (ex.: home.quickStat…).
    [medicinesFiltered, selectedDate, i18n.language, ready, t]
  );

  const onAddMedication = () => {
    try {
      logScreenEvent('Add Medication Button Pressed');
      trackEvent('navigate_to_medicine_form', { source: 'home' });
      router.push('/medicine-form');
    } catch (error) {
      const errorInstance =
        error instanceof Error ? error : new Error(String(error));
      logError(errorInstance, 'Add Medication Navigation');
      trackError(errorInstance, 'onAddMedication');
    }
  };

  const openEditMedication = (id: string) => {
    try {
      logScreenEvent('Edit Medication Button Pressed', { medicineId: id });
      trackEvent('navigate_to_medicine_form', {
        action: 'edit',
        medicineId: id,
      });
      router.push({
        pathname: '/medicine-form',
        params: { medicineId: id },
      });
    } catch (error) {
      const errorInstance =
        error instanceof Error ? error : new Error(String(error));
      logError(errorInstance, 'Edit Medication Navigation');
      trackError(errorInstance, 'openEditMedication');
    }
  };

  const confirmDeleteMedication = (m: Medicine) => {
    try {
      logScreenEvent('Delete Medication Confirm Dialog', {
        medicineId: m.id,
        medicineName: m.name,
      });
      trackEvent('delete_medicine_confirm', {
        medicineId: m.id,
        medicineName: m.name,
      });

      Alert.alert(
        t('home.deleteMedicationTitle'),
        t('home.deleteMedicationMessage', { name: m.name }),
        [
          {
            text: t('common.cancel'),
            style: 'cancel',
            onPress: () => {
              trackEvent('delete_medicine_cancelled', { medicineId: m.id });
            },
          },
          {
            text: t('home.deleteMedication'),
            style: 'destructive',
            onPress: () => {
              void (async () => {
                try {
                  trackEvent('delete_medicine_confirmed', { medicineId: m.id });
                  logScreenEvent('Deleting Medication', { medicineId: m.id });
                  await deleteMedicine(m.id);
                  trackEvent('delete_medicine_success', { medicineId: m.id });
                  logScreenEvent('Medication Deleted Successfully', {
                    medicineId: m.id,
                  });
                } catch (e) {
                  const errorInstance =
                    e instanceof Error ? e : new Error(String(e));
                  const msg =
                    e instanceof Error ? e.message : t('common.error');

                  logError(errorInstance, 'Delete Medication Error');
                  trackError(errorInstance, 'confirmDeleteMedication');
                  trackEvent('delete_medicine_failed', {
                    medicineId: m.id,
                    error: msg,
                  });

                  Alert.alert(t('common.error'), msg);
                }
              })();
            },
          },
        ]
      );
    } catch (error) {
      const errorInstance =
        error instanceof Error ? error : new Error(String(error));
      logError(errorInstance, 'Confirm Delete Medication Dialog');
      trackError(errorInstance, 'confirmDeleteMedication');
    }
  };

  const renderMedicinesContent = () => {
    if (loading && medicines.length === 0) {
      return (
        <View>
          {[1, 2, 3].map((i) => (
            <SkeletonCard
              key={i}
              lines={2}
              showAvatar={false}
              style={styles.scheduleRowSkeleton}
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
            Add your first medication to start smart reminders and daily
            tracking.
          </Text>
          <View style={styles.emptyBenefits}>
            <View style={styles.emptyBenefitRow}>
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={theme.colors.primary}
              />
              <Text
                style={[
                  styles.emptyBenefitText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Automatic dose reminders
              </Text>
            </View>
            <View style={styles.emptyBenefitRow}>
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={theme.colors.primary}
              />
              <Text
                style={[
                  styles.emptyBenefitText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Adherence progress every day
              </Text>
            </View>
            <View style={styles.emptyBenefitRow}>
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={theme.colors.primary}
              />
              <Text
                style={[
                  styles.emptyBenefitText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Low stock alerts
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.addMedicationButton,
              { backgroundColor: theme.colors.primary },
            ]}
            activeOpacity={0.85}
            onPress={onAddMedication}
          >
            <Text style={styles.addMedicationText}>+ Add first medication</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (medicinesForSelectedDay.length === 0) {
      return (
        <View
          style={[
            styles.emptyForDay,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Ionicons
            name="calendar-outline"
            size={40}
            color={theme.colors.textSecondary}
          />
          <Text style={[styles.emptyForDayTitle, { color: theme.colors.text }]}>
            {t('home.noMedicationsScheduled')}
          </Text>
          <Text
            style={[
              styles.emptyForDaySubtitle,
              { color: theme.colors.textSecondary },
            ]}
          >
            {t('home.pickAnotherDay')}
          </Text>
        </View>
      );
    }

    return (
      <>
        <View
          style={[
            styles.scheduleListCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              ...Platform.select({
                ios: {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 10,
                },
                android: { elevation: 1 },
                default: {},
              }),
            },
          ]}
        >
          {visibleMedicines.map((medicine, index) => (
            <MedicationScheduleRow
              key={medicine.id}
              medicine={medicine}
              theme={theme}
              t={t}
              isLast={index === visibleMedicines.length - 1}
              onEdit={() => openEditMedication(medicine.id)}
              onDelete={() => confirmDeleteMedication(medicine)}
            />
          ))}
        </View>

        {showViewAllToggle && (
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

  // Header uses surface (white/dark-card) so it visually separates from the scroll canvas
  const stickyHeaderBg = theme.colors.surface;

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
      <StatusBar style={isDark ? 'light' : 'dark'} animated />
      <View style={styles.layoutRoot}>
        <View
          style={[
            styles.stickyTopBar,
            {
              backgroundColor: stickyHeaderBg,
              borderBottomWidth: isDark ? StyleSheet.hairlineWidth : 1,
              borderBottomColor: theme.colors.border,
              ...Platform.select({
                ios: {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isDark ? 0.3 : 0.1,
                  shadowRadius: 6,
                },
                default: {},
              }),
            },
          ]}
        >
          <View style={styles.stickyTopBarInner}>
            <HomeGreetingHero />
          </View>
        </View>
        <ScrollView
          style={styles.scrollArea}
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
          {medicines.length > 0 ? (
            <TodayProgressSummary quickStats={quickStats} />
          ) : null}
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
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={t('home.searchPlaceholderDots')}
                placeholderTextColor={theme.colors.placeholder}
                style={[styles.searchInput, { color: theme.colors.text }]}
                autoCapitalize="none"
                autoCorrect={false}
                {...(Platform.OS === 'ios'
                  ? { clearButtonMode: 'while-editing' as const }
                  : {})}
                accessibilityLabel={t('home.searchPlaceholder')}
              />
            </View>
            <View
              style={[
                styles.searchCalendarAction,
                {
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Ionicons
                name="calendar-outline"
                size={18}
                color={theme.colors.textSecondary}
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

          <View style={styles.medicinesSection}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitles}>
                <Text
                  style={[
                    styles.sectionEyebrow,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {t('home.scheduleSectionEyebrow')}
                </Text>
                <Text
                  style={[styles.sectionTitle, { color: theme.colors.text }]}
                >
                  {t('home.yourMedications')}
                </Text>
              </View>
              <TouchableOpacity
                onPress={onAddMedication}
                style={styles.addLink}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={t('home.addMedication')}
                activeOpacity={0.75}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={22}
                  color={theme.colors.primary}
                />
                <Text
                  style={[styles.addLinkText, { color: theme.colors.primary }]}
                >
                  {t('home.addMedicineShort')}
                </Text>
              </TouchableOpacity>
            </View>
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
                borderColor: theme.colors.border,
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
              <Text
                style={[styles.hydrationTitle, { color: theme.colors.text }]}
              >
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
                      style={[
                        styles.barTrack,
                        { backgroundColor: theme.colors.border },
                      ]}
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
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  layoutRoot: {
    flex: 1,
  },
  stickyTopBar: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    ...Platform.select({
      ios: {
        zIndex: 1,
      },
      android: {
        elevation: 3,
      },
      default: {},
    }),
  },
  stickyTopBarInner: {
    paddingHorizontal: 18,
  },
  scrollArea: {
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
  searchInput: {
    marginLeft: 10,
    fontSize: 14,
    flex: 1,
    paddingVertical: 0,
  },
  searchCalendarAction: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    opacity: 0.75,
  },
  scheduleRowSkeleton: {
    marginBottom: 10,
    minHeight: 76,
    borderRadius: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  sectionTitles: {
    flex: 1,
    minWidth: 0,
  },
  sectionEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  addLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingLeft: 8,
  },
  addLinkText: {
    fontSize: 15,
    fontWeight: '700',
  },
  scheduleListCard: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 4,
    overflow: 'hidden',
  },
  emptyForDay: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  emptyForDayTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyForDaySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
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
    lineHeight: 18,
  },
  emptyBenefits: {
    marginTop: 14,
    gap: 6,
  },
  emptyBenefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emptyBenefitText: {
    fontSize: 13,
    fontWeight: '500',
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
