// Medicine Taken Services Configuration
import { ApiMedicineTakenRepository } from './data/apiMedicineTakenRepository';
import { GetMedicineTakesUseCase } from './domain/useCases/GetMedicineTakesUseCase';
import { MarkMedicineAsTakenUseCase } from './domain/useCases/MarkMedicineAsTakenUseCase';
import { SkipMedicineDoseUseCase } from './domain/useCases/SkipMedicineDoseUseCase';

// Repository instance
const medicineTakenRepository = new ApiMedicineTakenRepository();

// Use cases instances
export const markMedicineAsTakenUseCase = new MarkMedicineAsTakenUseCase(medicineTakenRepository);
export const skipMedicineDoseUseCase = new SkipMedicineDoseUseCase(medicineTakenRepository);
export const getMedicineTakesUseCase = new GetMedicineTakesUseCase(medicineTakenRepository);