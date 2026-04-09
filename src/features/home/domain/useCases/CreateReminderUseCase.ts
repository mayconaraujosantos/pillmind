import type { Reminder } from '../entities/Reminder';
import type { ReminderRepository } from '../repositories/ReminderRepository';

export class CreateReminderUseCase {
  constructor(private readonly repo: ReminderRepository) {}

  execute(data: Omit<Reminder, 'id'>): Promise<Reminder> {
    return this.repo.create(data);
  }
}
