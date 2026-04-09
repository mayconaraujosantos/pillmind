import type { ReminderRepository } from '../repositories/ReminderRepository';

export class DeleteReminderUseCase {
  constructor(private readonly repo: ReminderRepository) {}

  execute(id: string): Promise<void> {
    return this.repo.delete(id);
  }
}
