import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import type { Medicine } from '../domain/entities/Medicine';
import type { MedicineRepository } from '../domain/repositories/MedicineRepository';

const STORAGE_KEY = '@pillmind/medicines/v1';

type StoredMedicine = Omit<Medicine, 'startDate' | 'endDate'> & {
  startDate: string;
  endDate?: string;
};

function serialize(m: Medicine): StoredMedicine {
  return {
    ...m,
    startDate: m.startDate.toISOString(),
    endDate: m.endDate?.toISOString(),
  };
}

function deserialize(raw: StoredMedicine): Medicine {
  return {
    ...raw,
    startDate: new Date(raw.startDate),
    endDate: raw.endDate ? new Date(raw.endDate) : undefined,
    medicineType: raw.medicineType ?? 'capsule',
    quantity: raw.quantity != null && raw.quantity > 0 ? raw.quantity : 1,
    reminderOnEmpty: raw.reminderOnEmpty ?? true,
  };
}

async function readAll(): Promise<Medicine[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredMedicine[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map(deserialize);
  } catch {
    return [];
  }
}

async function writeAll(medicines: Medicine[]): Promise<void> {
  const stored = medicines.map(serialize);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
}

/**
 * CRUD local com AsyncStorage até existir API no backend.
 */
export class AsyncStorageMedicineRepository implements MedicineRepository {
  async getAll(): Promise<Medicine[]> {
    return readAll();
  }

  async getById(id: string): Promise<Medicine | null> {
    const all = await readAll();
    return all.find((m) => m.id === id) ?? null;
  }

  async create(data: Omit<Medicine, 'id'>): Promise<Medicine> {
    const all = await readAll();
    const medicine: Medicine = {
      id: Crypto.randomUUID(),
      ...data,
    };
    all.push(medicine);
    await writeAll(all);
    return medicine;
  }

  async update(id: string, patch: Partial<Medicine>): Promise<Medicine> {
    const all = await readAll();
    const index = all.findIndex((m) => m.id === id);
    if (index < 0) {
      throw new Error('Medicine not found');
    }
    const merged: Medicine = { ...all[index], ...patch, id };
    all[index] = merged;
    await writeAll(all);
    return merged;
  }

  async delete(id: string): Promise<void> {
    const all = await readAll();
    await writeAll(all.filter((m) => m.id !== id));
  }

  async search(query: string): Promise<Medicine[]> {
    const all = await readAll();
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.dosage.toLowerCase().includes(q) ||
        m.notes?.toLowerCase().includes(q)
    );
  }
}
