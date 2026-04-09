import { MedicineTaken } from '../entities/MedicineTaken';

export interface MedicineTakenRepository {
  markAsTaken(
    medicineId: string,
    date: Date,
    scheduledTime: string
  ): Promise<MedicineTaken>;
  skipDose(
    medicineId: string,
    date: Date,
    scheduledTime: string
  ): Promise<MedicineTaken>;
  getTodayTakes(): Promise<MedicineTaken[]>;
  getTakesForDate(date: Date): Promise<MedicineTaken[]>;
  getTakesForMedicine(medicineId: string, date: Date): Promise<MedicineTaken[]>;
}
