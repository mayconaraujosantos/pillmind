import { Medicine } from '../entities/Medicine';

export interface MedicineRepository {
  getAll(): Promise<Medicine[]>;
  getById(id: string): Promise<Medicine | null>;
  create(medicine: Omit<Medicine, 'id'>): Promise<Medicine>;
  update(id: string, medicine: Partial<Medicine>): Promise<Medicine>;
  delete(id: string): Promise<void>;
  search(query: string): Promise<Medicine[]>;
}
