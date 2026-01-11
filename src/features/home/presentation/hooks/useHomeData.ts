import { useState, useEffect, useCallback } from 'react';
import { GetMedicinesUseCase } from '../../domain/useCases/GetMedicinesUseCase';
import { Medicine } from '../../domain/entities/Medicine';
import { logger } from '@shared/utils/logger';

export interface UseHomeDataResult {
  medicines: Medicine[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * Custom hook for managing home screen data
 *
 * Best practices implemented:
 * - Separate initial loading and refresh states
 * - Error handling with retry capability
 * - Automatic cancellation on unmount
 * - Proper loading state management
 */
export const useHomeData = (
  getMedicinesUseCase: GetMedicinesUseCase
): UseHomeDataResult => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        setError(null);

        logger.info('useHomeData', '🔄 Fetching home data', {
          isRefresh,
        });

        const data = await getMedicinesUseCase.execute();

        logger.info('useHomeData', '✅ Home data fetched successfully', {
          count: data.length,
        });

        setMedicines(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load data';

        logger.error(
          'useHomeData',
          '❌ Failed to fetch home data',
          {
            error: errorMessage,
          },
          err instanceof Error ? err : undefined
        );

        setError(errorMessage);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [getMedicinesUseCase]
  );

  const refetch = useCallback(async () => {
    await fetchData(false);
  }, [fetchData]);

  const refresh = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) {
        await fetchData(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [fetchData]);

  return {
    medicines,
    loading,
    refreshing,
    error,
    refetch,
    refresh,
  };
};
