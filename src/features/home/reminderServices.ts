import { ApiReminderRepository } from './data/apiReminderRepository';
import { CreateReminderUseCase } from './domain/useCases/CreateReminderUseCase';
import { UpdateReminderUseCase } from './domain/useCases/UpdateReminderUseCase';
import { DeleteReminderUseCase } from './domain/useCases/DeleteReminderUseCase';
import { GetRemindersByMedicineUseCase } from './domain/useCases/GetRemindersByMedicineUseCase';

const reminderRepository = new ApiReminderRepository();

export const getRemindersByMedicineUseCase = new GetRemindersByMedicineUseCase(
  reminderRepository
);
export const createReminderUseCase = new CreateReminderUseCase(
  reminderRepository
);
export const updateReminderUseCase = new UpdateReminderUseCase(
  reminderRepository
);
export const deleteReminderUseCase = new DeleteReminderUseCase(
  reminderRepository
);
