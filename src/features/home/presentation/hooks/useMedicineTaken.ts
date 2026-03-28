import {
  cancelScheduledReminder,
  scheduleOneOffMedicineReminder,
} from '@core/services/medicineReminderNotifications';
import React from 'react';
import {
  clearTodayPostponedDose,
  getTodayPostponedDoses,
  type PostponedDoseRecord,
  upsertTodayPostponedDose,
} from '../../data/postponedDoseStore';
import type { Medicine } from '../../domain/entities/Medicine';
import { MedicineTaken } from '../../domain/entities/MedicineTaken';
import {
  getMedicineTakesUseCase,
  markMedicineAsTakenUseCase,
  skipMedicineDoseUseCase
} from '../../medicineTakenServices';

type DoseStatus = 'taken' | 'skipped' | 'postponed' | 'pending';
const DEFAULT_POSTPONE_MINUTES = 10;

export interface UseMedicineTakenReturn {
  todayTakes: MedicineTaken[];
  loading: boolean;
  error: string | null;
  markAsTaken: (medicineId: string, scheduledTime: string) => Promise<void>;
  skipDose: (medicineId: string, scheduledTime: string) => Promise<void>;
  postponeDose: (medicine: Medicine, scheduledTime: string, minutes?: number) => Promise<void>;
  getTakeStatus: (medicineId: string, scheduledTime: string) => DoseStatus;
  getPostponedUntil: (medicineId: string, scheduledTime: string) => Date | null;
  refreshTodayTakes: () => Promise<void>;
}

export const useMedicineTaken = (): UseMedicineTakenReturn => {
  const [todayTakes, setTodayTakes] = React.useState<MedicineTaken[]>([]);
  const [postponedDoses, setPostponedDoses] = React.useState<PostponedDoseRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadTodayTakes = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [takes, postponed] = await Promise.all([
        getMedicineTakesUseCase.executeForToday(),
        getTodayPostponedDoses(),
      ]);
      setTodayTakes(takes);
      setPostponedDoses(postponed);
    } catch (err) {
      console.error('Failed to load today takes:', err);
      setError(err instanceof Error ? err.message : 'Failed to load medicine takes');
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsTaken = React.useCallback(async (medicineId: string, scheduledTime: string) => {
    try {
      const postponed = await clearTodayPostponedDose(medicineId, scheduledTime);
      await cancelScheduledReminder(postponed?.notificationId);
      const taken = await markMedicineAsTakenUseCase.execute(medicineId, scheduledTime);
      setTodayTakes(prev => {
        const existing = prev.find(t => t.medicineId === medicineId && t.scheduledTime === scheduledTime);
        if (existing) {
          return prev.map(t => (t.id === existing.id ? taken : t));
        }
        return [...prev, taken];
      });
      setPostponedDoses((prev) =>
        prev.filter(
          (entry) =>
            !(entry.medicineId === medicineId && entry.scheduledTime === scheduledTime)
        )
      );
    } catch (err) {
      console.error('Failed to mark medicine as taken:', err);
      throw err;
    }
  }, []);

  const skipDose = React.useCallback(async (medicineId: string, scheduledTime: string) => {
    try {
      const postponed = await clearTodayPostponedDose(medicineId, scheduledTime);
      await cancelScheduledReminder(postponed?.notificationId);
      const skipped = await skipMedicineDoseUseCase.execute(medicineId, scheduledTime);
      setTodayTakes(prev => {
        const existing = prev.find(t => t.medicineId === medicineId && t.scheduledTime === scheduledTime);
        if (existing) {
          return prev.map(t => (t.id === existing.id ? skipped : t));
        }
        return [...prev, skipped];
      });
      setPostponedDoses((prev) =>
        prev.filter(
          (entry) =>
            !(entry.medicineId === medicineId && entry.scheduledTime === scheduledTime)
        )
      );
    } catch (err) {
      console.error('Failed to skip medicine dose:', err);
      throw err;
    }
  }, []);

  const postponeDose = React.useCallback(
    async (medicine: Medicine, scheduledTime: string, minutes = DEFAULT_POSTPONE_MINUTES) => {
      const reminderAt = new Date(Date.now() + minutes * 60 * 1000);
      const current = await clearTodayPostponedDose(medicine.id, scheduledTime);
      await cancelScheduledReminder(current?.notificationId);

      const result = await scheduleOneOffMedicineReminder(
        medicine,
        reminderAt,
        scheduledTime,
        `Lembrete adiado: tomar ${medicine.dosage} em ${minutes} min`
      );

      await upsertTodayPostponedDose(
        medicine.id,
        scheduledTime,
        reminderAt,
        result.notificationId
      );

      setPostponedDoses((prev) => {
        const next = prev.filter(
          (entry) =>
            !(entry.medicineId === medicine.id && entry.scheduledTime === scheduledTime)
        );
        const todayDateKey = new Date().toISOString().split('T')[0];
        return [
          ...next,
          {
            medicineId: medicine.id,
            scheduledTime,
            dateKey: todayDateKey,
            postponedUntil: reminderAt.toISOString(),
            notificationId: result.notificationId,
          },
        ];
      });
    },
    []
  );

  const getTakeStatus = React.useCallback((medicineId: string, scheduledTime: string): DoseStatus => {
    const postponed = postponedDoses.find(
      (entry) =>
        entry.medicineId === medicineId &&
        entry.scheduledTime === scheduledTime &&
        new Date(entry.postponedUntil).getTime() > Date.now()
    );
    const taken = todayTakes.find(t => 
      t.medicineId === medicineId && t.scheduledTime === scheduledTime
    );
    
    if (!taken && postponed) return 'postponed';
    if (!taken) return 'pending';
    if (taken.skipped) return 'skipped';
    if (taken.takenAt) return 'taken';
    if (postponed) return 'postponed';
    return 'pending';
  }, [todayTakes, postponedDoses]);

  const getPostponedUntil = React.useCallback(
    (medicineId: string, scheduledTime: string): Date | null => {
      const postponed = postponedDoses.find(
        (entry) =>
          entry.medicineId === medicineId &&
          entry.scheduledTime === scheduledTime &&
          new Date(entry.postponedUntil).getTime() > Date.now()
      );

      return postponed ? new Date(postponed.postponedUntil) : null;
    },
    [postponedDoses]
  );

  const refreshTodayTakes = React.useCallback(() => {
    return loadTodayTakes();
  }, [loadTodayTakes]);

  // Load data on mount
  React.useEffect(() => {
    loadTodayTakes();
  }, [loadTodayTakes]);

  return {
    todayTakes,
    loading,
    error,
    markAsTaken,
    skipDose,
    postponeDose,
    getTakeStatus,
    getPostponedUntil,
    refreshTodayTakes,
  };
};