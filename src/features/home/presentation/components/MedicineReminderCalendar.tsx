import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/theme';
import { useTranslation } from '@shared/i18n';

interface MedicineReminderCalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  viewMode: 'today' | 'week' | 'month';
  onViewModeChange: (mode: 'today' | 'week' | 'month') => void;
}

const startOfWeek = (date: Date) => {
  const day = date.getDay();
  const diff = (day + 6) % 7;
  const start = new Date(date);
  start.setDate(date.getDate() - diff);
  return start;
};

const getWeekDays = (date: Date) => {
  const start = startOfWeek(date);
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
};

const formatHeaderDate = (date: Date) => {
  const month = date.toLocaleString(undefined, { month: 'long' });
  return `${month} ${date.getDate()}`;
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const MedicineReminderCalendar: React.FC<
  MedicineReminderCalendarProps
> = ({ selectedDate, onDateChange, viewMode, onViewModeChange }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const weekDays = getWeekDays(selectedDate);
  const todayLabel = isSameDay(selectedDate, new Date())
    ? t('home.todayLabel')
    : t('home.dateLabel');
  const dateLabel = `${todayLabel}, ${formatHeaderDate(selectedDate)}`;

  return (
    <View>
      {/* Calendar Section */}
      <View style={styles.calendarSection}>
        <Text style={[styles.calendarTitle, { color: theme.colors.text }]}>
          {dateLabel}
        </Text>
        <View style={styles.calendarRow}>
          <TouchableOpacity
            style={styles.calendarArrow}
            onPress={() => {
              const next = new Date(selectedDate);
              next.setDate(selectedDate.getDate() - 7);
              onDateChange(next);
            }}
          >
            <Ionicons
              name="chevron-back"
              size={18}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>

          <View style={styles.calendarDays}>
            {weekDays.map((day, index) => {
              const isToday = isSameDay(day, new Date());
              return (
                <TouchableOpacity
                  key={day.toISOString()}
                  style={[
                    styles.dayItem,
                    { backgroundColor: theme.colors.surface },
                    isToday && styles.dayItemToday,
                    isToday && {
                      backgroundColor: theme.colors.primary,
                      shadowColor: theme.colors.primary,
                    },
                  ]}
                  onPress={() => onDateChange(day)}
                >
                  <Text
                    style={[
                      styles.dayLabel,
                      isToday && styles.dayLabelToday,
                      !isToday && { color: theme.colors.textSecondary },
                    ]}
                  >
                    {'MTWTFSS'[index]}
                  </Text>
                  <Text
                    style={[
                      styles.dayNumber,
                      isToday && styles.dayNumberToday,
                      !isToday && { color: theme.colors.text },
                    ]}
                  >
                    {day.getDate()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={styles.calendarArrow}
            onPress={() => {
              const next = new Date(selectedDate);
              next.setDate(selectedDate.getDate() + 7);
              onDateChange(next);
            }}
          >
            <Ionicons
              name="chevron-forward"
              size={18}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* View Mode Tabs */}
      <View style={styles.viewModeTabs}>
        <TouchableOpacity
          style={[
            styles.viewModeTab,
            viewMode === 'today' && styles.viewModeTabActive,
          ]}
          onPress={() => onViewModeChange('today')}
        >
          <Text
            style={[
              styles.viewModeTabText,
              viewMode === 'today' && styles.viewModeTabTextActive,
              {
                color:
                  viewMode === 'today' ? '#0A63FF' : theme.colors.textSecondary,
              },
            ]}
          >
            Today
          </Text>
          {viewMode === 'today' && <View style={styles.viewModeTabUnderline} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.viewModeTab,
            viewMode === 'week' && styles.viewModeTabActive,
          ]}
          onPress={() => onViewModeChange('week')}
        >
          <Text
            style={[
              styles.viewModeTabText,
              viewMode === 'week' && styles.viewModeTabTextActive,
              {
                color:
                  viewMode === 'week' ? '#0A63FF' : theme.colors.textSecondary,
              },
            ]}
          >
            Week
          </Text>
          {viewMode === 'week' && <View style={styles.viewModeTabUnderline} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.viewModeTab,
            viewMode === 'month' && styles.viewModeTabActive,
          ]}
          onPress={() => onViewModeChange('month')}
        >
          <Text
            style={[
              styles.viewModeTabText,
              viewMode === 'month' && styles.viewModeTabTextActive,
              {
                color:
                  viewMode === 'month' ? '#0A63FF' : theme.colors.textSecondary,
              },
            ]}
          >
            Month
          </Text>
          {viewMode === 'month' && <View style={styles.viewModeTabUnderline} />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  calendarSection: {
    marginTop: 20,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  calendarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calendarArrow: {
    padding: 6,
  },
  calendarDays: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
    justifyContent: 'center',
  },
  dayItem: {
    flex: 1,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  dayItemToday: {
    backgroundColor: '#FF6B9D',
    shadowColor: '#FF6B9D',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  dayLabelToday: {
    color: '#FFFFFF',
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: '700',
  },
  dayNumberToday: {
    color: '#FFFFFF',
  },
  viewModeTabs: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 24,
    paddingHorizontal: 0,
    gap: 32,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  viewModeTab: {
    alignItems: 'center',
    paddingBottom: 8,
    position: 'relative',
  },
  viewModeTabActive: {
    // Active state handled by conditional styling
  },
  viewModeTabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  viewModeTabTextActive: {
    fontWeight: '600',
  },
  viewModeTabUnderline: {
    height: 3,
    width: '100%',
    backgroundColor: '#0A63FF',
    marginTop: 6,
    borderRadius: 1.5,
  },
});
