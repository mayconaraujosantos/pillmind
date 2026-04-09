import { apiService } from '@core/services/api.service';
import { getMedicineApiAccessToken } from '@core/services/medicineApiTokenBridge';
import type { Medicine } from '../domain/entities/Medicine';
import type { MedicineRepository } from '../domain/repositories/MedicineRepository';

type MedicineApiDto = {
  id: string;
  userId?: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  startDate: string;
  endDate?: string | null;
  notes?: string | null;
  imageUrl?: string | null;
  medicineType?: string | null;
  prescribedFor?: string | null;
  quantity?: number | null;
  reminderOnEmpty?: boolean | null;
};

function dateOnlyLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseDateOnly(isoDay: string): Date {
  const [y, mo, d] = isoDay.split('-').map(Number);
  return new Date(y, mo - 1, d);
}

function fromApi(row: MedicineApiDto): Medicine {
  return {
    id: row.id,
    name: row.name,
    dosage: row.dosage,
    frequency: row.frequency,
    times: Array.isArray(row.times) ? row.times : [],
    startDate: parseDateOnly(row.startDate),
    endDate:
      row.endDate != null && row.endDate !== ''
        ? parseDateOnly(row.endDate)
        : undefined,
    notes: row.notes ?? undefined,
    imageUrl: row.imageUrl ?? undefined,
    medicineType: row.medicineType ?? undefined,
    prescribedFor: row.prescribedFor ?? undefined,
    quantity:
      row.quantity != null && row.quantity > 0 ? row.quantity : undefined,
    reminderOnEmpty: row.reminderOnEmpty ?? undefined,
  };
}

function toWriteBody(m: Medicine): Record<string, unknown> {
  return {
    name: m.name,
    dosage: m.dosage,
    frequency: m.frequency,
    times: m.times,
    startDate: dateOnlyLocal(m.startDate),
    endDate: m.endDate ? dateOnlyLocal(m.endDate) : null,
    notes: m.notes ?? null,
    imageUrl: m.imageUrl ?? null,
    medicineType: m.medicineType ?? 'capsule',
    prescribedFor: m.prescribedFor ?? null,
    quantity: m.quantity != null && m.quantity > 0 ? m.quantity : 1,
    reminderOnEmpty: m.reminderOnEmpty ?? true,
  };
}

function toCreateBody(data: Omit<Medicine, 'id'>): Record<string, unknown> {
  const synthetic: Medicine = {
    id: '',
    name: data.name,
    dosage: data.dosage,
    frequency: data.frequency,
    times: data.times,
    startDate: data.startDate,
    endDate: data.endDate,
    notes: data.notes,
    imageUrl: data.imageUrl,
    medicineType: data.medicineType,
    prescribedFor: data.prescribedFor,
    quantity: data.quantity,
    reminderOnEmpty: data.reminderOnEmpty,
  };
  return toWriteBody(synthetic);
}

export class ApiMedicineRepository implements MedicineRepository {
  private authHeaders(): Record<string, string> {
    const token = getMedicineApiAccessToken();
    if (!token?.trim()) {
      throw new Error(
        'Sessão indisponível. Inicie sessão para gerir medicamentos.'
      );
    }
    return { 'x-access-token': token.trim() };
  }

  async getAll(): Promise<Medicine[]> {
    const res = await apiService.get<MedicineApiDto[]>('/api/medicines', {
      headers: this.authHeaders(),
    });
    if (!res.success) {
      throw new Error(res.error?.message ?? 'Falha ao listar medicamentos');
    }
    const list = res.data ?? [];
    return list.map(fromApi);
  }

  async getById(id: string): Promise<Medicine | null> {
    const res = await apiService.get<MedicineApiDto>(`/api/medicines/${id}`, {
      headers: this.authHeaders(),
    });
    if (!res.success) {
      if (res.error?.status === 404) {
        return null;
      }
      throw new Error(res.error?.message ?? 'Falha ao carregar medicamento');
    }
    if (!res.data) return null;
    return fromApi(res.data);
  }

  async create(data: Omit<Medicine, 'id'>): Promise<Medicine> {
    const res = await apiService.post<MedicineApiDto>(
      '/api/medicines',
      toCreateBody(data),
      { headers: this.authHeaders() }
    );
    if (!res.success || !res.data) {
      throw new Error(res.error?.message ?? 'Falha ao criar medicamento');
    }
    return fromApi(res.data);
  }

  async update(id: string, patch: Partial<Medicine>): Promise<Medicine> {
    const current = await this.getById(id);
    if (!current) {
      throw new Error('Medicamento não encontrado');
    }
    const merged: Medicine = { ...current, ...patch, id };
    const res = await apiService.put<MedicineApiDto>(
      `/api/medicines/${id}`,
      toWriteBody(merged),
      { headers: this.authHeaders() }
    );
    if (!res.success || !res.data) {
      throw new Error(res.error?.message ?? 'Falha ao atualizar medicamento');
    }
    return fromApi(res.data);
  }

  async delete(id: string): Promise<void> {
    const res = await apiService.delete<unknown>(`/api/medicines/${id}`, {
      headers: this.authHeaders(),
    });
    if (!res.success) {
      throw new Error(res.error?.message ?? 'Falha ao remover medicamento');
    }
  }

  async search(query: string): Promise<Medicine[]> {
    const all = await this.getAll();
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.dosage.toLowerCase().includes(q) ||
        m.notes?.toLowerCase().includes(q) ||
        m.prescribedFor?.toLowerCase().includes(q)
    );
  }

  /**
   * Envia foto (multipart); devolve URL pública para guardar em {@link Medicine.imageUrl}.
   */
  async uploadMedicinePicture(
    localUri: string,
    mimeType: string = 'image/jpeg'
  ): Promise<string> {
    const formData = new FormData();
    const normalized =
      mimeType === 'image/png'
        ? 'image/png'
        : mimeType === 'image/webp'
          ? 'image/webp'
          : 'image/jpeg';
    const filename =
      normalized === 'image/png'
        ? 'medicine.png'
        : normalized === 'image/webp'
          ? 'medicine.webp'
          : 'medicine.jpg';
    formData.append('file', {
      uri: localUri,
      name: filename,
      type: normalized,
    } as unknown as Blob);
    const res = await apiService.postFormData<{ imageUrl: string }>(
      '/api/medicines/picture',
      formData,
      this.authHeaders()
    );
    if (!res.success || !res.data?.imageUrl) {
      throw new Error(res.error?.message ?? 'Falha ao enviar imagem');
    }
    return res.data.imageUrl;
  }
}
