import { MedicineRepository } from '../repositories/MedicineRepository';
import { Medicine } from '../entities/Medicine';

export class GetMedicinesUseCase {
  constructor(private medicineRepository: MedicineRepository) {}

  async execute(): Promise<Medicine[]> {
    return this.medicineRepository.getAll();
  }
}
