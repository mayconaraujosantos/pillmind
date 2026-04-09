import { useCallback, useEffect, useState } from 'react';
import type { Reminder } from '../../domain/entities/Reminder';
import {
  createReminderUseCase,
  deleteReminderUseCase,
  getRemindersByMedicineUseCase,
  updateReminderUseCase,
} from '../../reminderServices';

export interface UseRemindersResult {
  reminders: Reminder[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createReminder: (data: Omit<Reminder, 'id'>) => Promise<Reminder>;
  updateReminder: (
    id: string,
    patch: Partial<Omit<Reminder, 'id' | 'medicineId'>>
  ) => Promise<Reminder>;
  deleteReminder: (id: string) => Promise<void>;
}

export function useReminders(medicineId: string): UseRemindersResult {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRemindersByMedicineUseCase.execute(medicineId);
      setReminders(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao carregar lembretes'
      );
    } finally {
      setLoading(false);
    }
  }, [medicineId]);

  useEffect(() => {
    let active = true;
    getRemindersByMedicineUseCase
      .execute(medicineId)
      .then((data) => {
        if (active) {
          setReminders(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Erro');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [medicineId]);

  const createReminder = useCallback(async (data: Omit<Reminder, 'id'>) => {
    const created = await createReminderUseCase.execute(data);
    setReminders((prev) => [...prev, created]);
    return created;
  }, []);

  const updateReminder = useCallback(
    async (id: string, patch: Partial<Omit<Reminder, 'id' | 'medicineId'>>) => {
      const updated = await updateReminderUseCase.execute(id, patch);
      setReminders((prev) => prev.map((r) => (r.id === id ? updated : r)));
      return updated;
    },
    []
  );

  const deleteReminder = useCallback(async (id: string) => {
    await deleteReminderUseCase.execute(id);
    setReminders((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return {
    reminders,
    loading,
    error,
    refetch,
    createReminder,
    updateReminder,
    deleteReminder,
  };
}
