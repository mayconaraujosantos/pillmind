import { CreateMedicineUseCase } from '../domain/useCases/CreateMedicineUseCase';
import { GetMedicinesUseCase } from '../domain/useCases/GetMedicinesUseCase';
import { MockMedicineRepository } from './hooks/__mocks__/mockMedicineRepository';

export const medicineRepository = new MockMedicineRepository();
export const getMedicinesUseCase = new GetMedicinesUseCase(medicineRepository);
export const createMedicineUseCase = new CreateMedicineUseCase(
  medicineRepository
);
