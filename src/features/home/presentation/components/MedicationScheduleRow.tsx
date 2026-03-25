import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Theme } from '@shared/theme';
import type { TFunction } from 'i18next';
import type { Medicine } from '../../domain/entities/Medicine';

interface MedicationScheduleRowProps {
  medicine: Medicine;
  theme: Theme;
  t: TFunction;
  isLast?: boolean;
  onEdit: () => void;
  onDelete: () => void;
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
}) => {
  const frequencyPretty = medicine.frequency.replace(/-/g, ' ');
  const primaryTime = medicine.times[0] ?? '—';
  const extraCount = Math.max(0, medicine.times.length - 1);
  const timesLine =
    medicine.times.length > 0
      ? medicine.times.join(' · ')
      : t('home.noFixedAlarmTimes');

  const onMark = () =>
    Alert.alert(t('home.quickAddDoseTitle'), t('home.quickAddDoseMessage'));

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
        style={({ pressed }) => [
          styles.mid,
          pressed && { opacity: 0.85 },
        ]}
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
      <Pressable
        onPress={openRowMenu}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={t('home.medicineRowMenuA11y')}
        style={({ pressed }) => [
          styles.menuHit,
          pressed && { opacity: 0.7 },
        ]}
      >
        <Ionicons
          name="ellipsis-vertical"
          size={20}
          color={theme.colors.textSecondary}
        />
      </Pressable>
      <Pressable
        onPress={onMark}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel={t('home.markDoseCheckboxA11y')}
        style={({ pressed }) => [
          styles.checkHit,
          pressed && { opacity: 0.75 },
        ]}
      >
        <View
          style={[
            styles.checkCircle,
            {
              borderColor: theme.colors.primary,
            },
          ]}
        />
      </Pressable>
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
  menuHit: {
    padding: 6,
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
  checkHit: {
    padding: 4,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      default: {},
    }),
  },
});
