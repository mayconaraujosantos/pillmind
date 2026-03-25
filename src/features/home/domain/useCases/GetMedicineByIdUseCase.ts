import { MedicineRepository } from '../repositories/MedicineRepository';
import { Medicine } from '../entities/Medicine';

export class GetMedicineByIdUseCase {
  constructor(private readonly medicineRepository: MedicineRepository) {}

  async execute(id: string): Promise<Medicine | null> {
    return this.medicineRepository.getById(id);
  }
}
