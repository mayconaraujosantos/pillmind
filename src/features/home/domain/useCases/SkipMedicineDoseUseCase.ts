import { MedicineTaken } from '../entities/MedicineTaken';
import { MedicineTakenRepository } from '../repositories/MedicineTakenRepository';

export class SkipMedicineDoseUseCase {
  constructor(private readonly medicineTakenRepository: MedicineTakenRepository) {}

  async execute(medicineId: string, scheduledTime: string, date?: Date): Promise<MedicineTaken> {
    const useDate = date || new Date();
    return this.medicineTakenRepository.skipDose(medicineId, useDate, scheduledTime);
  }
}