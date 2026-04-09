import { Ionicons } from '@expo/vector-icons';
import type { Theme } from '@shared/theme';
import type { TFunction } from 'i18next';
import React from 'react';
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { Medicine } from '../../domain/entities/Medicine';

type TakeStatus = 'taken' | 'skipped' | 'postponed' | 'pending';

interface MedicationScheduleRowProps {
  medicine: Medicine;
  theme: Theme;
  t: TFunction;
  isLast?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  scheduledTime?: string; // The specific time for this row
  takeStatus?: TakeStatus; // Status for this specific time
  onMarkAsTaken?: () => void; // Callback to mark this dose as taken
  onSkipDose?: () => void; // Callback to skip this dose
  onPostponeDose?: () => void;
}

/**
 * Linha compacta estilo apps de lembrete: horário, nome/dose, menu e marcar dose.
 */
export const MedicationScheduleRow: React.FC<MedicationScheduleRowProps> = ({
  medicine,
  theme,
  t,
  isLast,
  onEdit,
  onDelete,
  scheduledTime,
  takeStatus = 'pending',
  onMarkAsTaken,
  onSkipDose,
  onPostponeDose,
}) => {
  const frequencyPretty = medicine.frequency.replaceAll('-', ' ');
  const primaryTime = scheduledTime || medicine.times[0] || '—';
  const extraCount = Math.max(0, medicine.times.length - 1);
  const timesLine =
    medicine.times.length > 0
      ? medicine.times.join(' · ')
      : t('home.noFixedAlarmTimes');

  const onMark = () => {
    if (takeStatus === 'pending' && onMarkAsTaken) {
      onMarkAsTaken();
    } else {
      Alert.alert(t('home.quickAddDoseTitle'), t('home.quickAddDoseMessage'));
    }
  };

  const onSkip = () => {
    if (takeStatus === 'pending' && onSkipDose) {
      onSkipDose();
    }
  };

  const onPostpone = () => {
    if (takeStatus === 'pending' && onPostponeDose) {
      onPostponeDose();
    }
  };

  const openRowMenu = () => {
    Alert.alert(medicine.name, undefined, [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('home.editMedication'), onPress: onEdit },
      {
        text: t('home.deleteMedication'),
        style: 'destructive',
        onPress: onDelete,
      },
    ]);
  };

  // Get status-specific styling and content
  const getStatusDisplay = () => {
    switch (takeStatus) {
      case 'taken':
        return {
          icon: 'checkmark-circle' as const,
          color: '#22C55E', // green
          text: t('home.doseTaken'),
        };
      case 'skipped':
        return {
          icon: 'close-circle' as const,
          color: '#EF4444', // red
          text: t('home.doseSkipped'),
        };
      case 'postponed':
        return {
          icon: 'alarm' as const,
          color: '#F59E0B',
          text: t('home.dosePostponed'),
        };
      default:
        return null;
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <View
      style={[
        styles.row,
        {
          borderBottomColor: theme.colors.border,
          borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
        },
      ]}
      testID={`medication-row-${medicine.id}`}
    >
      <View style={styles.timeCol}>
        <Text style={[styles.timePrimary, { color: theme.colors.primary }]}>
          {primaryTime}
        </Text>
        {extraCount > 0 ? (
          <Text
            style={[styles.extraBadge, { color: theme.colors.textSecondary }]}
          >
            +{extraCount}
          </Text>
        ) : null}
      </View>

      <Pressable
        onPress={onEdit}
        style={({ pressed }) => [styles.mid, pressed && { opacity: 0.85 }]}
        accessibilityRole="button"
        accessibilityLabel={t('home.editMedication')}
      >
        <Text
          style={[styles.name, { color: theme.colors.text }]}
          numberOfLines={1}
        >
          {medicine.name}
        </Text>
        <Text
          style={[styles.meta, { color: theme.colors.textSecondary }]}
          numberOfLines={1}
        >
          {medicine.prescribedFor
            ? `${medicine.dosage} · ${medicine.prescribedFor}`
            : `${medicine.dosage} · ${frequencyPretty}`}
          {medicine.quantity != null && medicine.quantity > 0
            ? ` · ×${medicine.quantity}`
            : ''}
        </Text>
        <Text
          style={[styles.times, { color: theme.colors.textSecondary }]}
          numberOfLines={1}
        >
          {timesLine}
        </Text>
      </Pressable>

      <View style={styles.actions}>
        {statusDisplay ? (
          // Show status when taken or skipped
          <View style={styles.statusContainer}>
            <Ionicons
              name={statusDisplay.icon}
              size={20}
              color={statusDisplay.color}
            />
            <Text style={[styles.statusText, { color: statusDisplay.color }]}>
              {statusDisplay.text}
            </Text>
          </View>
        ) : (
          // Show action buttons when pending
          <View style={styles.actionButtons}>
            <Pressable
              onPress={onMark}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={t('home.markAsTakenA11y')}
              style={({ pressed }) => [
                styles.actionButton,
                styles.takeButton,
                { backgroundColor: theme.colors.primary },
                pressed && { opacity: 0.75 },
              ]}
              testID={`take-${medicine.id}`}
            >
              <Ionicons name="checkmark" size={16} color="white" />
            </Pressable>

            {onSkipDose && (
              <Pressable
                onPress={onSkip}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={t('home.skipDoseA11y')}
                style={({ pressed }) => [
                  styles.actionButton,
                  styles.skipButton,
                  { borderColor: theme.colors.border },
                  pressed && { opacity: 0.75 },
                ]}
                testID={`skip-${medicine.id}`}
              >
                <Ionicons
                  name="close"
                  size={16}
                  color={theme.colors.textSecondary}
                />
              </Pressable>
            )}
            {onPostponeDose && (
              <Pressable
                onPress={onPostpone}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={t('home.postponeDoseA11y')}
                style={({ pressed }) => [
                  styles.actionButton,
                  styles.postponeButton,
                  { borderColor: '#F59E0B' },
                  pressed && { opacity: 0.75 },
                ]}
                testID={`postpone-${medicine.id}`}
              >
                <Ionicons name="alarm-outline" size={16} color="#F59E0B" />
              </Pressable>
            )}
          </View>
        )}

        <Pressable
          onPress={openRowMenu}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={t('home.medicineRowMenuA11y')}
          style={({ pressed }) => [styles.menuHit, pressed && { opacity: 0.7 }]}
        >
          <Ionicons
            name="ellipsis-vertical"
            size={20}
            color={theme.colors.textSecondary}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 2,
    gap: 8,
  },
  timeCol: {
    width: 52,
    alignItems: 'flex-start',
  },
  timePrimary: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  extraBadge: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  mid: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  meta: {
    fontSize: 13,
    marginTop: 3,
    lineHeight: 18,
  },
  times: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: { elevation: 2 },
      default: {},
    }),
  },
  takeButton: {
    // backgroundColor set dynamically
  },
  skipButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  postponeButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  menuHit: {
    padding: 6,
  },
});
