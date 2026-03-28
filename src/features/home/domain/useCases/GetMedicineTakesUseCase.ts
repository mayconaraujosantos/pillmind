import { MedicineTaken } from '../entities/MedicineTaken';
import { MedicineTakenRepository } from '../repositories/MedicineTakenRepository';

export class GetMedicineTakesUseCase {
  constructor(private readonly medicineTakenRepository: MedicineTakenRepository) {}

  async executeForToday(): Promise<MedicineTaken[]> {
    return this.medicineTakenRepository.getTodayTakes();
  }

  async executeForDate(date: Date): Promise<MedicineTaken[]> {
    return this.medicineTakenRepository.getTakesForDate(date);
  }

  async executeForMedicine(medicineId: string, date?: Date): Promise<MedicineTaken[]> {
    const useDate = date || new Date();
    return this.medicineTakenRepository.getTakesForMedicine(medicineId, useDate);
  }
}