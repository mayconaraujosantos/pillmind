import { computeMedicineReminderOccurrences } from '@core/services/medicineReminderSchedule';
import type { Medicine } from '@features/home/domain/entities/Medicine';
import { logger } from '@shared/utils';
import { Platform } from 'react-native';

const MEDICINE_REMINDER_KIND = 'medicine-reminder';
const MEDICINE_CHANNEL_ID = 'medicine-reminders';

let notificationsInitialized = false;
let notificationsUnavailable = false;
let notificationsModulePromise: Promise<
  typeof import('expo-notifications') | null
> | null = null;

export interface ReminderSyncResult {
  permissionGranted: boolean;
  scheduledCount: number;
  notificationsAvailable?: boolean;
}

export interface OneOffReminderResult {
  scheduled: boolean;
  notificationsAvailable: boolean;
  notificationId?: string;
}

export interface TestReminderResult extends OneOffReminderResult {
  scheduledFor?: Date;
}

type NotificationModuleLike = Partial<typeof import('expo-notifications')> & {
  default?: Partial<typeof import('expo-notifications')>;
};

function resolveNotificationsModuleShape(
  module: NotificationModuleLike
): Partial<typeof import('expo-notifications')> {
  if (typeof module.setNotificationHandler === 'function') {
    return module;
  }

  const fallbackModule = module.default;
  if (
    fallbackModule &&
    typeof fallbackModule.setNotificationHandler === 'function'
  ) {
    return fallbackModule;
  }

  return module;
}

function hasNotificationCoreApi(
  module: Partial<typeof import('expo-notifications')>
): module is typeof import('expo-notifications') {
  return (
    typeof module.getPermissionsAsync === 'function' &&
    typeof module.requestPermissionsAsync === 'function' &&
    typeof module.getAllScheduledNotificationsAsync === 'function' &&
    typeof module.cancelScheduledNotificationAsync === 'function' &&
    typeof module.scheduleNotificationAsync === 'function'
  );
}

async function getNotificationsModule(): Promise<
  typeof import('expo-notifications') | null
> {
  if (notificationsUnavailable || Platform.OS === 'web') {
    return null;
  }

  notificationsModulePromise ??= import('expo-notifications')
    .then((module) => {
      const normalizedModule = resolveNotificationsModuleShape(
        module as NotificationModuleLike
      );

      if (!hasNotificationCoreApi(normalizedModule)) {
        notificationsUnavailable = true;
        logger.warn(
          'medicineReminderNotifications',
          'Notifications module loaded without required scheduling APIs'
        );
        return null;
      }

      return normalizedModule;
    })
    .catch((error: unknown) => {
      notificationsUnavailable = true;
      const message = error instanceof Error ? error.message : String(error);
      logger.warn(
        'medicineReminderNotifications',
        'Notifications native module unavailable',
        {
          message,
        }
      );
      return null;
    });

  return notificationsModulePromise;
}

export async function initializeMedicineReminderNotifications(): Promise<void> {
  if (notificationsInitialized) return;

  const Notifications = await getNotificationsModule();
  if (!Notifications) return;

  if (typeof Notifications.setNotificationHandler === 'function') {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  } else {
    logger.warn(
      'medicineReminderNotifications',
      'Notifications handler API is unavailable in the current runtime'
    );
  }

  if (
    Platform.OS === 'android' &&
    typeof Notifications.setNotificationChannelAsync === 'function'
  ) {
    await Notifications.setNotificationChannelAsync(MEDICINE_CHANNEL_ID, {
      name: 'Medication reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      sound: 'default',
    });
  }

  notificationsInitialized = true;
}

export async function requestMedicineReminderPermission(): Promise<boolean> {
  const Notifications = await getNotificationsModule();
  if (!Notifications) return false;

  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

async function clearMedicineReminderNotifications(): Promise<void> {
  const Notifications = await getNotificationsModule();
  if (!Notifications) return;

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((entry) => entry.content.data?.kind === MEDICINE_REMINDER_KIND)
      .map((entry) =>
        Notifications.cancelScheduledNotificationAsync(entry.identifier)
      )
  );
}

export async function syncMedicineReminderNotifications(
  medicines: Medicine[],
  options?: { requestPermission?: boolean }
): Promise<ReminderSyncResult> {
  const Notifications = await getNotificationsModule();
  if (!Notifications) {
    return {
      permissionGranted: false,
      scheduledCount: 0,
      notificationsAvailable: false,
    };
  }

  await initializeMedicineReminderNotifications();

  const requestPermission = options?.requestPermission === true;
  const currentPermission = await Notifications.getPermissionsAsync();
  let permissionGranted = currentPermission.granted;

  if (!permissionGranted && requestPermission) {
    permissionGranted = await requestMedicineReminderPermission();
  }

  // First-run UX: when the OS has not asked yet, request once automatically.
  if (
    !permissionGranted &&
    !requestPermission &&
    currentPermission.status === 'undetermined'
  ) {
    permissionGranted = await requestMedicineReminderPermission();
  }

  if (!permissionGranted) {
    logger.warn(
      'medicineReminderNotifications',
      'Skipping reminder sync because notifications permission is not granted'
    );
    return {
      permissionGranted: false,
      scheduledCount: 0,
      notificationsAvailable: true,
    };
  }

  await clearMedicineReminderNotifications();

  let scheduledCount = 0;
  const now = new Date();

  for (const medicine of medicines) {
    const occurrences = computeMedicineReminderOccurrences(medicine, now);

    if (occurrences.length === 0) {
      logger.debug(
        'medicineReminderNotifications',
        'No reminder occurrences computed for medicine',
        {
          medicineId: medicine.id,
          medicineName: medicine.name,
          frequency: medicine.frequency,
          times: medicine.times,
        }
      );
    }

    for (const occurrence of occurrences) {
      const timeLabel = occurrence.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      await Notifications.scheduleNotificationAsync({
        content: {
          title: medicine.name,
          body: `Tomar ${medicine.dosage} às ${timeLabel}`,
          sound: 'default',
          data: {
            kind: MEDICINE_REMINDER_KIND,
            medicineId: medicine.id,
            time: timeLabel,
            fireDate: occurrence.toISOString(),
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: occurrence,
        },
      });

      scheduledCount += 1;
    }
  }

  logger.info('medicineReminderNotifications', 'Medicine reminders synced', {
    medicinesCount: medicines.length,
    scheduledCount,
  });

  return {
    permissionGranted: true,
    scheduledCount,
    notificationsAvailable: true,
  };
}

export async function getMedicineReminderStatus(): Promise<ReminderSyncResult> {
  const Notifications = await getNotificationsModule();
  if (!Notifications) {
    return {
      permissionGranted: false,
      scheduledCount: 0,
      notificationsAvailable: false,
    };
  }

  const permissionGranted = (await Notifications.getPermissionsAsync()).granted;
  if (!permissionGranted) {
    return {
      permissionGranted: false,
      scheduledCount: 0,
      notificationsAvailable: true,
    };
  }

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const scheduledCount = scheduled.filter(
    (entry) => entry.content.data?.kind === MEDICINE_REMINDER_KIND
  ).length;

  return {
    permissionGranted: true,
    scheduledCount,
    notificationsAvailable: true,
  };
}

export async function scheduleOneOffMedicineReminder(
  medicine: Medicine,
  reminderAt: Date,
  scheduledTime: string,
  label?: string
): Promise<OneOffReminderResult> {
  const Notifications = await getNotificationsModule();
  if (!Notifications) {
    return { scheduled: false, notificationsAvailable: false };
  }

  await initializeMedicineReminderNotifications();

  const permissionGranted = (await Notifications.getPermissionsAsync()).granted;
  if (!permissionGranted) {
    return { scheduled: false, notificationsAvailable: true };
  }

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: medicine.name,
      body:
        label ??
        `Lembrete adiado: tomar ${medicine.dosage} às ${scheduledTime}`,
      sound: 'default',
      data: {
        kind: MEDICINE_REMINDER_KIND,
        medicineId: medicine.id,
        time: scheduledTime,
        fireDate: reminderAt.toISOString(),
        postponed: true,
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: reminderAt,
    },
  });

  return {
    scheduled: true,
    notificationsAvailable: true,
    notificationId,
  };
}

export async function cancelScheduledReminder(
  notificationId?: string
): Promise<void> {
  if (!notificationId) return;
  const Notifications = await getNotificationsModule();
  if (!Notifications) return;
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

export async function scheduleTestReminderInMinutes(
  minutes: number = 1
): Promise<TestReminderResult> {
  const Notifications = await getNotificationsModule();
  if (!Notifications) {
    return { scheduled: false, notificationsAvailable: false };
  }

  await initializeMedicineReminderNotifications();

  const permissionGranted = (await Notifications.getPermissionsAsync()).granted;
  if (!permissionGranted) {
    return { scheduled: false, notificationsAvailable: true };
  }

  const scheduledFor = new Date(Date.now() + minutes * 60 * 1000);
  const timeLabel = scheduledFor.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Teste de lembrete PillMind',
      body: `Se você recebeu isso às ${timeLabel}, as notificações estão OK.`,
      sound: 'default',
      data: {
        kind: MEDICINE_REMINDER_KIND,
        test: true,
        fireDate: scheduledFor.toISOString(),
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: scheduledFor,
    },
  });

  return {
    scheduled: true,
    notificationsAvailable: true,
    notificationId,
    scheduledFor,
  };
}
