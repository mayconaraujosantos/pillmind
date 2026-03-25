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
  TextInput,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeTabParamList } from '@core/navigation/types';
import { ScreenWrapper, Loader, SkeletonCard } from '@shared/components';
import { useOnboardingStorage } from '@features/onboarding';
import { useTheme } from '@shared/theme';
import { useTranslation } from '@shared/i18n';
import type { TFunction } from 'i18next';
import { Ionicons } from '@expo/vector-icons';
import {
  MedicineReminderCalendar,
  HomeGreetingHero,
  TodayProgressSummary,
  MedicationScheduleRow,
} from '../components';
import { useHomeMedicines } from '../hooks/useHomeMedicines';
import {
  getMedicinesUseCase,
  createMedicineUseCase,
  updateMedicineUseCase,
  deleteMedicineUseCase,
} from '../../medicineServices';
import type { Medicine } from '../../domain/entities/Medicine';

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

const HOME_TINT_LIGHT = '#F0F2FA';

export const HomeScreen: React.FC = () => {
  useOnboardingStorage();
  const { theme, isDark } = useTheme();
  const { t, i18n, ready } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeTabParamList>>();
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
      void syncMedicines();
    }, [syncMedicines])
  );

  const medicinesFiltered = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return medicines;
    return medicines.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.dosage.toLowerCase().includes(q) ||
        m.notes?.toLowerCase().includes(q)
    );
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
    navigation.navigate('MedicineForm', {});
  };

  const openEditMedication = (id: string) => {
    navigation.navigate('MedicineForm', { medicineId: id });
  };

  const confirmDeleteMedication = (m: Medicine) => {
    Alert.alert(
      t('home.deleteMedicationTitle'),
      t('home.deleteMedicationMessage', { name: m.name }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('home.deleteMedication'),
          style: 'destructive',
          onPress: () => {
            void (async () => {
              try {
                await deleteMedicine(m.id);
              } catch (e) {
                const msg =
                  e instanceof Error ? e.message : t('common.error');
                Alert.alert(t('common.error'), msg);
              }
            })();
          },
        },
      ]
    );
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
            {t('home.addFirstMedication')}
          </Text>
          <TouchableOpacity
            style={[
              styles.addMedicationButton,
              { backgroundColor: theme.colors.primary },
            ]}
            activeOpacity={0.85}
            onPress={onAddMedication}
          >
            <Text style={styles.addMedicationText}>
              + {t('home.addMedication')}
            </Text>
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

  const homeCanvasBackground = isDark
    ? theme.colors.surface
    : HOME_TINT_LIGHT;

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
      <View style={styles.layoutRoot}>
        <View
          style={[
            styles.stickyTopBar,
            {
              backgroundColor: homeCanvasBackground,
              borderBottomColor: theme.colors.border,
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
              style={[
                styles.searchInput,
                { color: theme.colors.text },
              ]}
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
