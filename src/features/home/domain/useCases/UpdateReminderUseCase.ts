import type { Reminder } from '../entities/Reminder';
import type { ReminderRepository } from '../repositories/ReminderRepository';

export class UpdateReminderUseCase {
  constructor(private readonly repo: ReminderRepository) {}

  execute(
    id: string,
    patch: Partial<Omit<Reminder, 'id' | 'medicineId'>>
  ): Promise<Reminder> {
    return this.repo.update(id, patch);
  }
}
