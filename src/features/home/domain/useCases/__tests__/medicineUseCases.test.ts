import { CreateMedicineUseCase } from '../CreateMedicineUseCase';
import { GetMedicinesUseCase } from '../GetMedicinesUseCase';
import { Medicine } from '../../entities/Medicine';
import { MedicineRepository } from '../../repositories/MedicineRepository';

describe('Medicine use cases', () => {
  const baseRepositoryMock = (): MedicineRepository => ({
    create: jest.fn<Promise<Medicine>, [Omit<Medicine, 'id'>]>(),
    getAll: jest.fn<Promise<Medicine[]>, []>(),
    getById: jest.fn<Promise<Medicine | null>, [string]>(),
    update: jest.fn<Promise<Medicine>, [string, Partial<Medicine>]>(),
    delete: jest.fn<Promise<void>, [string]>(),
    search: jest.fn<Promise<Medicine[]>, [string]>(),
  });

  it('creates a medicine through the repository', async () => {
    const medicineData: Omit<Medicine, 'id'> = {
      name: 'Ibuprofen',
      dosage: '200mg',
      frequency: 'twice-a-day',
      times: ['08:00', '20:00'],
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-07'),
      notes: 'Take with food',
      imageUrl: 'https://example.com/ibuprofen.png',
    };

    const repository = {
      ...baseRepositoryMock(),
      create: jest.fn(
        async (data: Omit<Medicine, 'id'>): Promise<Medicine> => ({
          id: 'generated-id',
          ...data,
        })
      ),
    } satisfies MedicineRepository;

    const useCase = new CreateMedicineUseCase(repository);

    const result = await useCase.execute(medicineData);

    expect(repository.create).toHaveBeenCalledWith(medicineData);
    expect(result).toMatchObject({ ...medicineData, id: 'generated-id' });
  });

  it('propagates repository errors when creating a medicine', async () => {
    const medicineData: Omit<Medicine, 'id'> = {
      name: 'Ibuprofen',
      dosage: '200mg',
      frequency: 'twice-a-day',
      times: ['08:00', '20:00'],
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-07'),
      notes: 'Take with food',
      imageUrl: 'https://example.com/ibuprofen.png',
    };

    const repository = {
      ...baseRepositoryMock(),
      create: jest.fn(async () => {
        throw new Error('failed');
      }),
    } satisfies MedicineRepository;

    const useCase = new CreateMedicineUseCase(repository);

    await expect(useCase.execute(medicineData)).rejects.toThrow('failed');
    expect(repository.create).toHaveBeenCalledWith(medicineData);
  });

  it('retrieves medicines through the repository', async () => {
    const repository = {
      ...baseRepositoryMock(),
      getAll: jest.fn(
        async (): Promise<Medicine[]> => [
          {
            id: '1',
            name: 'Vitamin C',
            dosage: '500mg',
            frequency: 'daily',
            times: ['09:00'],
            startDate: new Date('2024-02-01'),
          },
        ]
      ),
    } satisfies MedicineRepository;

    const useCase = new GetMedicinesUseCase(repository);

    const result = await useCase.execute();

    expect(repository.getAll).toHaveBeenCalled();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Vitamin C');
  });

  it('returns an empty list when repository has no medicines', async () => {
    const repository = {
      ...baseRepositoryMock(),
      getAll: jest.fn(async (): Promise<Medicine[]> => []),
    } satisfies MedicineRepository;

    const useCase = new GetMedicinesUseCase(repository);

    const result = await useCase.execute();

    expect(repository.getAll).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
