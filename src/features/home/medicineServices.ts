import { ApiMedicineRepository } from './data/apiMedicineRepository';
import { GetMedicinesUseCase } from './domain/useCases/GetMedicinesUseCase';
import { CreateMedicineUseCase } from './domain/useCases/CreateMedicineUseCase';
import { UpdateMedicineUseCase } from './domain/useCases/UpdateMedicineUseCase';
import { DeleteMedicineUseCase } from './domain/useCases/DeleteMedicineUseCase';
import { GetMedicineByIdUseCase } from './domain/useCases/GetMedicineByIdUseCase';

const medicineRepository = new ApiMedicineRepository();

export const getMedicinesUseCase = new GetMedicinesUseCase(medicineRepository);
export const createMedicineUseCase = new CreateMedicineUseCase(
  medicineRepository
);
export const updateMedicineUseCase = new UpdateMedicineUseCase(
  medicineRepository
);
export const deleteMedicineUseCase = new DeleteMedicineUseCase(
  medicineRepository
);
export const getMedicineByIdUseCase = new GetMedicineByIdUseCase(
  medicineRepository
);

export function uploadMedicinePicture(
  localUri: string,
  mimeType?: string
): Promise<string> {
  return medicineRepository.uploadMedicinePicture(localUri, mimeType);
}
