import { MedicineRepository } from '../repositories/MedicineRepository';
import { Medicine } from '../entities/Medicine';

export class GetMedicinesUseCase {
  constructor(private readonly medicineRepository: MedicineRepository) {}

  async execute(): Promise<Medicine[]> {
    return this.medicineRepository.getAll();
  }
}
