// Domain entity for MedicineTaken - tracks individual medicine doses
export interface MedicineTaken {
  id: string;
  medicineId: string;
  date: Date;
  scheduledTime: string; // "08:00", "14:00", etc
  takenAt?: Date; // actual time when taken (if taken)
  skipped: boolean; // true if user explicitly skipped this dose
}
