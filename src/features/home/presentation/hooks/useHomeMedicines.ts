import { syncMedicineReminderNotifications } from '@core/services/medicineReminderNotifications';
import { logger } from '@shared/utils/logger';
import { useCallback, useEffect, useState } from 'react';
import { Medicine } from '../../domain/entities/Medicine';
import { CreateMedicineUseCase } from '../../domain/useCases/CreateMedicineUseCase';
import { DeleteMedicineUseCase } from '../../domain/useCases/DeleteMedicineUseCase';
import { GetMedicinesUseCase } from '../../domain/useCases/GetMedicinesUseCase';
import { UpdateMedicineUseCase } from '../../domain/useCases/UpdateMedicineUseCase';

export interface UseHomeMedicinesResult {
  medicines: Medicine[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  refetch: () => Promise<void>;
  /** Recarrega a lista sem spinner (ex.: ao voltar da tela de formulário). */
  syncMedicines: () => Promise<void>;
  createMedicine: (data: Omit<Medicine, 'id'>) => Promise<Medicine>;
  updateMedicine: (id: string, patch: Partial<Medicine>) => Promise<Medicine>;
  deleteMedicine: (id: string) => Promise<void>;
}

export const useHomeMedicines = (
  getMedicinesUseCase: GetMedicinesUseCase,
  createMedicineUseCase: CreateMedicineUseCase,
  updateMedicineUseCase: UpdateMedicineUseCase,
  deleteMedicineUseCase: DeleteMedicineUseCase
): UseHomeMedicinesResult => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyList = useCallback(async (data: Medicine[]) => {
    setMedicines(data);
    await syncMedicineReminderNotifications(data, { requestPermission: false });
  }, []);

  const fetchData = useCallback(
    async (isRefresh: boolean) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        setError(null);
        const data = await getMedicinesUseCase.execute();
        await applyList(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to load data';
        logger.error(
          'useHomeMedicines',
          'Failed to load medicines',
          { message },
          err instanceof Error ? err : undefined
        );
        setError(message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [getMedicinesUseCase, applyList]
  );

  const syncMedicines = useCallback(async () => {
    try {
      const data = await getMedicinesUseCase.execute();
      setMedicines(data);
      await syncMedicineReminderNotifications(data, {
        requestPermission: false,
      });
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load data';
      setError(message);
    }
  }, [getMedicinesUseCase]);

  const refresh = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  const refetch = useCallback(async () => {
    await fetchData(false);
  }, [fetchData]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (mounted) await fetchData(false);
    })();
    return () => {
      mounted = false;
    };
  }, [fetchData]);

  const createMedicine = useCallback(
    async (data: Omit<Medicine, 'id'>) => {
      const created = await createMedicineUseCase.execute(data);
      await syncMedicines();
      return created;
    },
    [createMedicineUseCase, syncMedicines]
  );

  const updateMedicine = useCallback(
    async (id: string, patch: Partial<Medicine>) => {
      const updated = await updateMedicineUseCase.execute(id, patch);
      await syncMedicines();
      return updated;
    },
    [updateMedicineUseCase, syncMedicines]
  );

  const deleteMedicine = useCallback(
    async (id: string) => {
      await deleteMedicineUseCase.execute(id);
      await syncMedicines();
    },
    [deleteMedicineUseCase, syncMedicines]
  );

  return {
    medicines,
    loading,
    refreshing,
    error,
    refresh,
    refetch,
    syncMedicines,
    createMedicine,
    updateMedicine,
    deleteMedicine,
  };
};
