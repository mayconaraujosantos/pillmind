import { MedicineRepository } from '../repositories/MedicineRepository';
import { Medicine } from '../entities/Medicine';

export class CreateMedicineUseCase {
  constructor(private medicineRepository: MedicineRepository) {}

  async execute(medicine: Omit<Medicine, 'id'>): Promise<Medicine> {
    return this.medicineRepository.create(medicine);
  }
}

