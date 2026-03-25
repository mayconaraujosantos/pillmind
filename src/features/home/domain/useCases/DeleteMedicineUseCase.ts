import { MedicineRepository } from '../repositories/MedicineRepository';

export class DeleteMedicineUseCase {
  constructor(private readonly medicineRepository: MedicineRepository) {}

  async execute(id: string): Promise<void> {
    return this.medicineRepository.delete(id);
  }
}
