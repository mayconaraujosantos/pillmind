import { Medicine } from '../../entities/Medicine';
import { MedicineRepository } from '../../repositories/MedicineRepository';
import { CreateMedicineUseCase } from '../CreateMedicineUseCase';
import { GetMedicinesUseCase } from '../GetMedicinesUseCase';
import { GetMedicineByIdUseCase } from '../GetMedicineByIdUseCase';
import { UpdateMedicineUseCase } from '../UpdateMedicineUseCase';
import { DeleteMedicineUseCase } from '../DeleteMedicineUseCase';

describe('Medicine use cases', () => {
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

  const baseRepositoryMock = (): MedicineRepository => ({
    create: jest.fn<Promise<Medicine>, [Omit<Medicine, 'id'>]>(),
    getAll: jest.fn<Promise<Medicine[]>, []>(),
    getById: jest.fn<Promise<Medicine | null>, [string]>(),
    update: jest.fn<Promise<Medicine>, [string, Partial<Medicine>]>(),
    delete: jest.fn<Promise<void>, [string]>(),
    search: jest.fn<Promise<Medicine[]>, [string]>(),
  });

  it('creates a medicine through the repository', async () => {
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

  it('retrieves a single medicine by id', async () => {
    const existing: Medicine = {
      id: 'x',
      name: 'A',
      dosage: '1',
      frequency: 'daily',
      times: [],
      startDate: new Date('2024-01-01'),
    };
    const repository = {
      ...baseRepositoryMock(),
      getById: jest.fn(async (id: string) => (id === 'x' ? existing : null)),
    } satisfies MedicineRepository;

    const useCase = new GetMedicineByIdUseCase(repository);

    await expect(useCase.execute('x')).resolves.toEqual(existing);
    await expect(useCase.execute('missing')).resolves.toBeNull();
  });

  it('updates a medicine through the repository', async () => {
    const repository = {
      ...baseRepositoryMock(),
      update: jest.fn(
        async (id: string, patch: Partial<Medicine>): Promise<Medicine> => ({
          id,
          name: 'Updated',
          dosage: '10mg',
          frequency: 'daily',
          times: [],
          startDate: new Date('2024-01-01'),
          ...patch,
        })
      ),
    } satisfies MedicineRepository;

    const useCase = new UpdateMedicineUseCase(repository);

    const result = await useCase.execute('1', { name: 'Updated' });

    expect(repository.update).toHaveBeenCalledWith('1', { name: 'Updated' });
    expect(result.name).toBe('Updated');
  });

  it('deletes a medicine through the repository', async () => {
    const repository = {
      ...baseRepositoryMock(),
      delete: jest.fn(async () => {}),
    } satisfies MedicineRepository;

    const useCase = new DeleteMedicineUseCase(repository);

    await useCase.execute('1');

    expect(repository.delete).toHaveBeenCalledWith('1');
  });
});
