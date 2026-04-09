import { syncMedicineReminderNotifications } from '@core/services/medicineReminderNotifications';
import { useEffect, useState } from 'react';
import { ApiMedicineRepository } from '../../data/apiMedicineRepository';
import { Medicine } from '../../domain/entities/Medicine';
import { GetMedicinesUseCase } from '../../domain/useCases/GetMedicinesUseCase';

// Hook para gerenciar medicamentos
export const useMedicines = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Instanciar repositório e use case
  const repository = new ApiMedicineRepository();
  const getMedicinesUseCase = new GetMedicinesUseCase(repository);

  // Função para buscar medicamentos
  const fetchMedicines = async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const result = await getMedicinesUseCase.execute();
      setMedicines(result);
      void syncMedicineReminderNotifications(result, {
        requestPermission: false,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao buscar medicamentos';
      setError(errorMessage);
      console.error('Error fetching medicines:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Buscar medicamentos ao montar o componente
  useEffect(() => {
    fetchMedicines();
  }, []);

  // Função para atualizar a lista (pull-to-refresh)
  const refresh = () => {
    fetchMedicines(true);
  };

  // Função para buscar medicamentos específicos por query
  const searchMedicines = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await repository.search(query);
      setMedicines(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro na busca';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    medicines,
    loading,
    error,
    refreshing,
    refresh,
    searchMedicines,
    fetchMedicines,
  };
};
