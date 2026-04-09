import type { Reminder } from '../entities/Reminder';
import type { ReminderRepository } from '../repositories/ReminderRepository';

export class GetRemindersByMedicineUseCase {
  constructor(private readonly repo: ReminderRepository) {}

  execute(medicineId: string): Promise<Reminder[]> {
    return this.repo.getByMedicine(medicineId);
  }
}
