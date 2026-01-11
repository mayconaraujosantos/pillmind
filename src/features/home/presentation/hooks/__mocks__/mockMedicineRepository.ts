import { MedicineRepository } from '../../../domain/repositories/MedicineRepository';
import { Medicine } from '../../../domain/entities/Medicine';

/**
 * Mock implementation of MedicineRepository for development/testing
 * Simulates API delay for realistic loading states
 */
export class MockMedicineRepository implements MedicineRepository {
  private simulateDelay(): Promise<void> {
    // Simulate network delay (1-2 seconds)
    const delay = 1000 + Math.random() * 1000;
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  async getAll(): Promise<Medicine[]> {
    await this.simulateDelay();

    // Return mock data
    return [
      {
        id: '1',
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: 'as-needed',
        times: [],
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        notes: 'Take for pain relief',
      },
      {
        id: '2',
        name: 'Ibuprofen',
        dosage: '200mg',
        frequency: 'twice-a-day',
        times: ['08:00', '20:00'],
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-07'),
        notes: 'Take with food',
      },
      {
        id: '3',
        name: 'Aspirina',
        dosage: '100mg',
        frequency: 'once-a-day',
        times: ['08:00'],
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-07'),
        notes: 'Take with food',
      },
      {
        id: '4',
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: 'as-needed',
        times: [],
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        notes: 'Take for pain relief',
      },
      {
        id: '5',
        name: 'Ibuprofen',
        dosage: '200mg',
        frequency: 'twice-a-day',
        times: ['08:00', '20:00'],
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-07'),
        notes: 'Take with food',
      },
      {
        id: '6',
        name: 'Aspirina',
        dosage: '100mg',
        frequency: 'once-a-day',
        times: ['08:00'],
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-07'),
        notes: 'Take with food',
      },
      {
        id: '7',
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: 'as-needed',
        times: [],
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        notes: 'Take for pain relief',
      },
      {
        id: '8',
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: 'as-needed',
        times: [],
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        notes: 'Take for pain relief',
      },
      {
        id: '9',
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: 'as-needed',
        times: [],
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        notes: 'Take for pain relief',
      },
      {
        id: '10',
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: 'as-needed',
        times: [],
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        notes: 'Take for pain relief',
      },
      {
        id: '11',
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: 'as-needed',
        times: [],
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        notes: 'Take for pain relief',
      },
      {
        id: '12',
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: 'as-needed',
        times: [],
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        notes: 'Take for pain relief',
      },
      {
        id: '13',
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: 'as-needed',
        times: [],
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        notes: 'Take for pain relief',
      },
      {
        id: '14',
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: 'as-needed',
        times: [],
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        notes: 'Take for pain relief',
      },
      {
        id: '15',
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: 'as-needed',
        times: [],
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        notes: 'Take for pain relief',
      },
      {
        id: '16',
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: 'as-needed',
        times: [],
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        notes: 'Take for pain relief',
      },
      {
        id: '17',
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: 'as-needed',
        times: [],
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        notes: 'Take for pain relief',
      },
      {
        id: '18',
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: 'as-needed',
        times: [],
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        notes: 'Take for pain relief',
      },
      {
        id: '19',
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: 'as-needed',
        times: [],
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        notes: 'Take for pain relief',
      },
      {
        id: '20',
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: 'as-needed',
        times: [],
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        notes: 'Take for pain relief',
      },
    ];
  }

  async getById(id: string): Promise<Medicine | null> {
    await this.simulateDelay();
    const all = await this.getAll();
    return all.find((m) => m.id === id) || null;
  }

  async create(medicine: Omit<Medicine, 'id'>): Promise<Medicine> {
    await this.simulateDelay();
    return {
      id: Date.now().toString(),
      ...medicine,
    };
  }

  async update(id: string, medicine: Partial<Medicine>): Promise<Medicine> {
    await this.simulateDelay();
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error('Medicine not found');
    }
    return { ...existing, ...medicine };
  }

  async delete(_id: string): Promise<void> {
    await this.simulateDelay();
  }

  async search(query: string): Promise<Medicine[]> {
    await this.simulateDelay();
    const all = await this.getAll();
    const lowerQuery = query.toLowerCase();
    return all.filter(
      (m) =>
        m.name.toLowerCase().includes(lowerQuery) ||
        m.notes?.toLowerCase().includes(lowerQuery)
    );
  }
}
