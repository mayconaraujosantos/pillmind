import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/theme';
import { useTranslation } from '@shared/i18n';

type IonIconName = React.ComponentProps<typeof Ionicons>['name'];

export interface MedicineReminderQuickStats {
  scheduled: number;
  nextDoseLabel: string;
  adherencePct: number;
}

interface MedicineReminderCalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  viewMode: 'today' | 'week' | 'month';
  onViewModeChange: (mode: 'today' | 'week' | 'month') => void;
  quickStats?: MedicineReminderQuickStats;
}

/** Week starting Sunday (matches common calendar strip UIs). */
const startOfWeekSunday = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getWeekDays = (date: Date) => {
  const start = startOfWeekSunday(date);
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
};

const formatTitleLine = (date: Date) => {
  return date.toLocaleString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/** Fundo branco nos 3 cards, como no mock (contraste com o painel lilás). */
const QUICK_STAT_CARD_BG_LIGHT = '#FFFFFF';
const QUICK_STAT_CARD_BG_DARK = 'rgba(255,255,255,0.09)';

/** Mesmo `gap` nas duas linhas da grade (7 colunas). */
const WEEK_GRID_GAP = 4;

/** Pílulas de dia ficam brancas no modo escuro também; texto precisa escuro para contraste. */
const DAY_PILL_ON_WHITE_NUMBER = '#1C1B1F';
const DAY_PILL_ON_WHITE_WEEKDAY = 'rgba(28,27,31,0.62)';

function QuickMetricCard({
  iconName,
  value,
  label,
  onMenu,
  menuA11y,
}: Readonly<{
  iconName: IonIconName;
  value: string;
  label: string;
  onMenu: () => void;
  menuA11y: string;
}>) {
  const { theme, isDark } = useTheme();
  const cardBg = isDark ? QUICK_STAT_CARD_BG_DARK : QUICK_STAT_CARD_BG_LIGHT;

  return (
    <View
      style={[
        styles.quickMetricCard,
        {
          backgroundColor: cardBg,
          borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.05)',
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: isDark ? 0.2 : 0.04,
              shadowRadius: 4,
            },
            android: { elevation: isDark ? 0 : 1 },
            default: {},
          }),
        },
      ]}
    >
      <View style={styles.quickMetricHeader}>
        <View
          style={[
            styles.quickMetricIconCircle,
            {
              backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : '#FFFFFF',
            },
          ]}
        >
          <Ionicons name={iconName} size={16} color={theme.colors.primary} />
        </View>
        <TouchableOpacity
          onPress={onMenu}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={menuA11y}
          style={styles.quickMetricKebab}
        >
          <Ionicons
            name="ellipsis-vertical"
            size={15}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
      <Text
        style={[styles.quickMetricValue, { color: theme.colors.text }]}
        numberOfLines={1}
      >
        {value}
      </Text>
      <Text
        style={[styles.quickMetricLabel, { color: theme.colors.textSecondary }]}
        numberOfLines={2}
      >
        {label}
      </Text>
    </View>
  );
}

export const MedicineReminderCalendar: React.FC<
  MedicineReminderCalendarProps
> = ({
  selectedDate,
  onDateChange,
  viewMode,
  onViewModeChange,
  quickStats,
}) => {
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();

  const weekDays = getWeekDays(selectedDate);
  const now = new Date();
  const titlePrefix = isSameDay(selectedDate, now)
    ? t('home.todayLabel')
    : t('home.dateLabel');
  const dateTitle = `${titlePrefix}, ${formatTitleLine(selectedDate)}`;

  const shellBg = isDark ? theme.colors.surface : '#DBDCFF';
  const panelBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)';

  const onStatMenu = () => {
    Alert.alert(t('home.statCardMenuTitle'), t('home.statCardMenuMessage'));
  };

  return (
    <View
      style={[
        styles.shell,
        {
          backgroundColor: shellBg,
          borderColor: panelBorder,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isDark ? 0.3 : 0.06,
              shadowRadius: 14,
            },
            android: { elevation: isDark ? 0 : 2 },
            default: {},
          }),
        },
      ]}
    >
      <View style={styles.calendarSection}>
        <Text style={[styles.calendarTitle, { color: theme.colors.text }]}>
          {dateTitle}
        </Text>
        <View style={styles.calendarMetricsTrack}>
          <View style={styles.weekGridRow}>
            {weekDays.map((day) => {
              const selected = isSameDay(day, selectedDate);
              const today = isSameDay(day, now);
              return (
                <View key={day.toISOString()} style={styles.gridColumn}>
                  <TouchableOpacity
                    testID={`calendar-day-${day.toISOString().split('T')[0]}`}
                    activeOpacity={0.85}
                    style={[
                      styles.dayPill,
                      selected
                        ? {
                            backgroundColor: theme.colors.primary,
                            borderColor: theme.colors.primary,
                            borderWidth: 0,
                            ...Platform.select({
                              ios: {
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: 0,
                                shadowRadius: 0,
                              },
                              android: { elevation: 0 },
                              default: {},
                            }),
                          }
                        : {
                            backgroundColor: '#FFFFFF',
                            borderColor: today
                              ? theme.colors.primary
                              : 'rgba(0,0,0,0.07)',
                            borderWidth: today ? 2 : StyleSheet.hairlineWidth,
                            ...Platform.select({
                              ios: {
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.06,
                                shadowRadius: 3,
                              },
                              android: { elevation: 1 },
                              default: {},
                            }),
                          },
                    ]}
                    onPress={() => onDateChange(day)}
                  >
                    <Text
                      style={[
                        styles.dayPillWeekday,
                        {
                          color: selected
                            ? '#FFFFFF'
                            : isDark
                            ? DAY_PILL_ON_WHITE_WEEKDAY
                            : theme.colors.textSecondary,
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {day.toLocaleDateString(undefined, { weekday: 'short' })}
                    </Text>
                    <Text
                      style={[
                        styles.dayPillNumber,
                        {
                          color: selected
                            ? '#FFFFFF'
                            : isDark
                            ? DAY_PILL_ON_WHITE_NUMBER
                            : theme.colors.text,
                        },
                      ]}
                    >
                      {day.getDate()}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          {quickStats && (
            <View style={styles.metricsRowThree}>
              <View style={styles.metricThird}>
                <QuickMetricCard
                  iconName="calendar-outline"
                  value={String(quickStats.scheduled)}
                  label={t('home.quickStatScheduled')}
                  onMenu={onStatMenu}
                  menuA11y={t('home.cardStatMenuA11y')}
                />
              </View>
              <View style={styles.metricThird}>
                <QuickMetricCard
                  iconName="alarm-outline"
                  value={quickStats.nextDoseLabel}
                  label={t('home.quickStatNextDose')}
                  onMenu={onStatMenu}
                  menuA11y={t('home.cardStatMenuA11y')}
                />
              </View>
              <View style={styles.metricThird}>
                <QuickMetricCard
                  iconName="pulse-outline"
                  value={`${quickStats.adherencePct}%`}
                  label={t('home.quickStatAdherence')}
                  onMenu={onStatMenu}
                  menuA11y={t('home.cardStatMenuA11y')}
                />
              </View>
            </View>
          )}
        </View>
      </View>

      <View style={styles.viewModeTabs}>
        <TouchableOpacity
          style={styles.viewModeTab}
          onPress={() => onViewModeChange('today')}
        >
          <Text
            style={[
              styles.viewModeTabText,
              viewMode === 'today' && styles.viewModeTabTextActive,
              {
                color:
                  viewMode === 'today'
                    ? theme.colors.primary
                    : theme.colors.textSecondary,
              },
            ]}
          >
            {t('home.viewModeToday')}
          </Text>
          {viewMode === 'today' && (
            <View
              style={[
                styles.viewModeTabUnderline,
                { backgroundColor: theme.colors.primary },
              ]}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.viewModeTab}
          onPress={() => onViewModeChange('week')}
        >
          <Text
            style={[
              styles.viewModeTabText,
              viewMode === 'week' && styles.viewModeTabTextActive,
              {
                color:
                  viewMode === 'week'
                    ? theme.colors.primary
                    : theme.colors.textSecondary,
              },
            ]}
          >
            {t('home.viewModeWeek')}
          </Text>
          {viewMode === 'week' && (
            <View
              style={[
                styles.viewModeTabUnderline,
                { backgroundColor: theme.colors.primary },
              ]}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.viewModeTab}
          onPress={() => onViewModeChange('month')}
        >
          <Text
            style={[
              styles.viewModeTabText,
              viewMode === 'month' && styles.viewModeTabTextActive,
              {
                color:
                  viewMode === 'month'
                    ? theme.colors.primary
                    : theme.colors.textSecondary,
              },
            ]}
          >
            {t('home.viewModeMonth')}
          </Text>
          {viewMode === 'month' && (
            <View
              style={[
                styles.viewModeTabUnderline,
                { backgroundColor: theme.colors.primary },
              ]}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shell: {
    borderRadius: 26,
    paddingHorizontal: 14,
    paddingTop: 18,
    paddingBottom: 10,
    marginTop: 12,
    marginBottom: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  calendarSection: {
    marginTop: 0,
  },
  calendarMetricsTrack: {
    width: '100%',
  },
  calendarTitle: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 14,
    letterSpacing: -0.5,
  },
  /** Grade só da semana (7 colunas). Os 3 cards usam `metricsRowThree` — largura total em terços. */
  weekGridRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: WEEK_GRID_GAP,
  },
  /** Três cards em larguras iguais, largura do painel (mock de referência). */
  metricsRowThree: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 12,
    gap: 8,
    width: '100%',
  },
  metricThird: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
    alignItems: 'stretch',
  },
  /**
   * Colunas iguais nas duas linhas: flexBasis 0 evita que conteúdo (cards vs. vazios)
   * roube largura umas das outras — era o que deixava os cards mais estreitos que as pílulas.
   */
  gridColumn: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
    alignItems: 'stretch',
  },
  /**
   * Cápsula vertical (mock): cantos bem arredondados, dia em cima e número embaixo.
   */
  dayPill: {
    width: '100%',
    minHeight: 72,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayPillWeekday: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
    marginBottom: 6,
  },
  dayPillNumber: {
    fontSize: 16,
    fontWeight: '800',
  },
  quickMetricCard: {
    width: '100%',
    minWidth: 0,
    flexGrow: 1,
    alignSelf: 'stretch',
    minHeight: 108,
    borderRadius: 20,
    paddingTop: 10,
    paddingBottom: 12,
    paddingHorizontal: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  quickMetricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    minWidth: 0,
  },
  quickMetricIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 2,
      },
      android: { elevation: 1 },
      default: {},
    }),
  },
  quickMetricKebab: {
    padding: 4,
    marginRight: -2,
  },
  quickMetricValue: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.35,
    textAlign: 'left',
  },
  quickMetricLabel: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'left',
    marginTop: 4,
    lineHeight: 13,
  },
  viewModeTabs: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 6,
    paddingHorizontal: 0,
    gap: 32,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  viewModeTab: {
    alignItems: 'center',
    paddingBottom: 8,
    position: 'relative',
    minWidth: 56,
  },
  viewModeTabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  viewModeTabTextActive: {
    fontWeight: '700',
  },
  viewModeTabUnderline: {
    height: 3,
    width: '100%',
    marginTop: 6,
    borderRadius: 1.5,
  },
});
