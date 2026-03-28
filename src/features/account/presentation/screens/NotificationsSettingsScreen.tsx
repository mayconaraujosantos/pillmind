import {
  getMedicineReminderStatus,
  requestMedicineReminderPermission,
  scheduleTestReminderInMinutes,
  syncMedicineReminderNotifications,
} from '@core/services/medicineReminderNotifications';
import { getMedicinesUseCase } from '@features/home/medicineServices';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from '@shared/i18n';
import { useTheme } from '@shared/theme';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export const NotificationsSettingsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const [permissionGranted, setPermissionGranted] = React.useState(false);
  const [scheduledCount, setScheduledCount] = React.useState(0);
  const [notificationsAvailable, setNotificationsAvailable] = React.useState(true);

  const loadStatus = React.useCallback(async () => {
    setLoading(true);
    try {
      const status = await getMedicineReminderStatus();
      setPermissionGranted(status.permissionGranted);
      setScheduledCount(status.scheduledCount);
      setNotificationsAvailable(status.notificationsAvailable !== false);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      void loadStatus();
    }, [loadStatus])
  );

  const handleEnableNotifications = async () => {
    setLoading(true);
    try {
      const granted = await requestMedicineReminderPermission();
      setPermissionGranted(granted);
      if (granted) {
        const medicines = await getMedicinesUseCase.execute();
        const result = await syncMedicineReminderNotifications(medicines, {
          requestPermission: false,
        });
        setScheduledCount(result.scheduledCount);
        setNotificationsAvailable(result.notificationsAvailable !== false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSyncAlarms = async () => {
    setLoading(true);
    try {
      const medicines = await getMedicinesUseCase.execute();
      const result = await syncMedicineReminderNotifications(medicines, {
        requestPermission: true,
      });
      setPermissionGranted(result.permissionGranted);
      setScheduledCount(result.scheduledCount);
      setNotificationsAvailable(result.notificationsAvailable !== false);
    } finally {
      setLoading(false);
    }
  };

  const handleTestReminder = async () => {
    setLoading(true);
    try {
      const result = await scheduleTestReminderInMinutes(1);
      setNotificationsAvailable(result.notificationsAvailable !== false);

      if (!result.notificationsAvailable) {
        Alert.alert(
          t('common.error'),
          t('account.notificationsUnavailable')
        );
        return;
      }

      if (!result.scheduled) {
        Alert.alert(
          t('common.error'),
          t('account.notificationsPermissionDenied')
        );
        return;
      }

      const scheduleLabel = result.scheduledFor
        ? result.scheduledFor.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })
        : t('common.loading');

      Alert.alert(
        t('common.success'),
        t('account.notificationsTestScheduledMessage', {
          time: scheduleLabel,
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.body, { color: theme.colors.textSecondary }]}>
        {t('account.notificationsIntro')}
      </Text>

      {notificationsAvailable ? null : (
        <Text style={[styles.warning, { color: theme.colors.textSecondary }]}> 
          {t('account.notificationsUnavailable')}
        </Text>
      )}

      <View
        style={[
          styles.statusCard,
          {
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
          },
        ]}
      >
        <Text style={[styles.statusLabel, { color: theme.colors.textSecondary }]}> 
          {t('account.notificationsPermissionLabel')}
        </Text>
        <Text style={[styles.statusValue, { color: theme.colors.text }]}> 
          {permissionGranted
            ? t('account.notificationsPermissionGranted')
            : t('account.notificationsPermissionDenied')}
        </Text>
        <Text style={[styles.statusLabel, styles.topGap, { color: theme.colors.textSecondary }]}> 
          {t('account.notificationsScheduledLabel')}
        </Text>
        <Text style={[styles.statusValue, { color: theme.colors.text }]}> 
          {String(scheduledCount)}
        </Text>
      </View>

      {permissionGranted ? null : (
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => void handleEnableNotifications()}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {t('account.notificationsEnableCta')}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[
          styles.secondaryButton,
          {
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.background,
            opacity: notificationsAvailable ? 1 : 0.5,
          },
        ]}
        onPress={() => void handleSyncAlarms()}
        disabled={loading || !notificationsAvailable}
      >
        <Text style={[styles.secondaryButtonText, { color: theme.colors.text }]}> 
          {t('account.notificationsSyncCta')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.secondaryButton,
          styles.topGap,
          {
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.background,
            opacity: notificationsAvailable ? 1 : 0.5,
          },
        ]}
        onPress={() => void handleTestReminder()}
        disabled={loading || !notificationsAvailable}
      >
        <Text style={[styles.secondaryButtonText, { color: theme.colors.text }]}> 
          {t('account.notificationsTestCta')}
        </Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.loaderRow}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  body: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  warning: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  statusCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  statusValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  topGap: {
    marginTop: 12,
  },
  primaryButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  loaderRow: {
    marginTop: 12,
    alignItems: 'center',
  },
});
