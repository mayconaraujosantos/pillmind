import type { Reminder } from '../entities/Reminder';

export interface ReminderRepository {
  getByMedicine(medicineId: string): Promise<Reminder[]>;
  create(data: Omit<Reminder, 'id'>): Promise<Reminder>;
  update(
    id: string,
    patch: Partial<Omit<Reminder, 'id' | 'medicineId'>>
  ): Promise<Reminder>;
  delete(id: string): Promise<void>;
}
