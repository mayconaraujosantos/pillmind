import { MedicineRepository } from '../repositories/MedicineRepository';
import { Medicine } from '../entities/Medicine';

export class UpdateMedicineUseCase {
  constructor(private readonly medicineRepository: MedicineRepository) {}

  async execute(id: string, patch: Partial<Medicine>): Promise<Medicine> {
    return this.medicineRepository.update(id, patch);
  }
}
