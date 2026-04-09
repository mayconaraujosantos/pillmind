import { apiService } from '@core/services/api.service';
import { getMedicineApiAccessToken } from '@core/services/medicineApiTokenBridge';
import type { Reminder } from '../domain/entities/Reminder';
import type { ReminderRepository } from '../domain/repositories/ReminderRepository';

type ReminderApiDto = {
  id: string;
  userId?: string;
  medicineId: string;
  times: string[];
  daysOfWeek: string[];
  active: boolean;
};

function fromApi(dto: ReminderApiDto): Reminder {
  return {
    id: dto.id,
    medicineId: dto.medicineId,
    times: Array.isArray(dto.times) ? dto.times : [],
    daysOfWeek: Array.isArray(dto.daysOfWeek) ? dto.daysOfWeek : [],
    active: dto.active ?? true,
  };
}

export class ApiReminderRepository implements ReminderRepository {
  private authHeaders(): Record<string, string> {
    const token = getMedicineApiAccessToken();
    if (!token?.trim()) {
      throw new Error(
        'Sessão indisponível. Inicie sessão para gerir lembretes.'
      );
    }
    return { 'x-access-token': token.trim() };
  }

  async getByMedicine(medicineId: string): Promise<Reminder[]> {
    const res = await apiService.get<ReminderApiDto[]>(
      `/api/reminders/medicine/${medicineId}`,
      { headers: this.authHeaders() }
    );
    if (!res.success) {
      throw new Error(res.error?.message ?? 'Falha ao listar lembretes');
    }
    return (res.data ?? []).map(fromApi);
  }

  async create(data: Omit<Reminder, 'id'>): Promise<Reminder> {
    const res = await apiService.post<ReminderApiDto>(
      '/api/reminders',
      {
        medicineId: data.medicineId,
        times: data.times,
        daysOfWeek: data.daysOfWeek,
        active: data.active,
      },
      { headers: this.authHeaders() }
    );
    if (!res.success || !res.data) {
      throw new Error(res.error?.message ?? 'Falha ao criar lembrete');
    }
    return fromApi(res.data);
  }

  async update(
    id: string,
    patch: Partial<Omit<Reminder, 'id' | 'medicineId'>>
  ): Promise<Reminder> {
    const res = await apiService.put<ReminderApiDto>(
      `/api/reminders/${id}`,
      patch,
      { headers: this.authHeaders() }
    );
    if (!res.success || !res.data) {
      throw new Error(res.error?.message ?? 'Falha ao atualizar lembrete');
    }
    return fromApi(res.data);
  }

  async delete(id: string): Promise<void> {
    const res = await apiService.delete<unknown>(`/api/reminders/${id}`, {
      headers: this.authHeaders(),
    });
    if (!res.success) {
      throw new Error(res.error?.message ?? 'Falha ao remover lembrete');
    }
  }
}
