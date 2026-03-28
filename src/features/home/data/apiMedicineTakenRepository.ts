import { apiService } from '@core/services/api.service';
import { getMedicineApiAccessToken } from '@core/services/medicineApiTokenBridge';
import type { MedicineTaken } from '../domain/entities/MedicineTaken';
import type { MedicineTakenRepository } from '../domain/repositories/MedicineTakenRepository';

type MedicineTakenApiDto = {
  id: string;
  medicineId: string;
  date: string; // ISO date string
  scheduledTime: string;
  takenAt?: string | null; // ISO datetime string
  skipped: boolean;
};

function dateOnlyLocal(d: Date): string {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
    .toISOString()
    .split('T')[0];
}

function parseDate(isoString: string): Date {
  return new Date(isoString);
}

function fromApi(row: MedicineTakenApiDto): MedicineTaken {
  return {
    id: row.id,
    medicineId: row.medicineId,
    date: parseDate(row.date),
    scheduledTime: row.scheduledTime,
    takenAt: row.takenAt ? new Date(row.takenAt) : undefined,
    skipped: row.skipped,
  };
}

export class ApiMedicineTakenRepository implements MedicineTakenRepository {
  private authHeaders(): Record<string, string> {
    const token = getMedicineApiAccessToken();
    return token ? { 'x-access-token': token } : {};
  }

  async markAsTaken(medicineId: string, date: Date, scheduledTime: string): Promise<MedicineTaken> {
    const response = await apiService.post(
      `/api/medicines/${medicineId}/doses/take`,
      {
        date: dateOnlyLocal(date),
        scheduledTime,
        takenAt: new Date().toISOString(),
      },
      {
        headers: this.authHeaders(),
      }
    );
    return fromApi(response.data);
  }

  async skipDose(medicineId: string, date: Date, scheduledTime: string): Promise<MedicineTaken> {
    const response = await apiService.post(
      `/api/medicines/${medicineId}/doses/skip`,
      {
        date: dateOnlyLocal(date),
        scheduledTime,
      },
      {
        headers: this.authHeaders(),
      }
    );
    return fromApi(response.data);
  }

  async getTodayTakes(): Promise<MedicineTaken[]> {
    const response = await apiService.get('/api/medicines/doses/today', {
      headers: this.authHeaders(),
    });
    return response.data.map(fromApi);
  }

  async getTakesForDate(date: Date): Promise<MedicineTaken[]> {
    const response = await apiService.get('/api/medicines/doses', {
      headers: this.authHeaders(),
      params: { date: dateOnlyLocal(date) },
    });
    return response.data.map(fromApi);
  }

  async getTakesForMedicine(medicineId: string, date: Date): Promise<MedicineTaken[]> {
    const response = await apiService.get(`/api/medicines/${medicineId}/doses`, {
      headers: this.authHeaders(),
      params: { date: dateOnlyLocal(date) },
    });
    return response.data.map(fromApi);
  }
}