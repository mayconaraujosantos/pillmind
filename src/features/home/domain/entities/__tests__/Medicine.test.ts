import { Medicine } from '../Medicine';

describe('Medicine entity', () => {
  it('should have required properties', () => {
    const medicine: Medicine = {
      id: '1',
      name: 'Paracetamol',
      dosage: '500mg',
      frequency: '3x ao dia',
      times: ['08:00', '14:00', '20:00'],
      startDate: new Date('2024-01-01'),
    };

    expect(medicine.id).toBeDefined();
    expect(medicine.name).toBeDefined();
    expect(medicine.dosage).toBeDefined();
    expect(medicine.frequency).toBeDefined();
    expect(medicine.times).toBeDefined();
    expect(medicine.startDate).toBeDefined();
  });

  it('should allow optional properties', () => {
    const medicineWithOptionals: Medicine = {
      id: '2',
      name: 'Dipirona',
      dosage: '500mg',
      frequency: '2x ao dia',
      times: ['09:00', '21:00'],
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-15'),
      notes: 'Tomar após as refeições',
    };

    expect(medicineWithOptionals.endDate).toBeDefined();
    expect(medicineWithOptionals.notes).toBeDefined();
  });

  it('should work without optional properties', () => {
    const medicineWithoutOptionals: Medicine = {
      id: '3',
      name: 'Vitamina C',
      dosage: '1000mg',
      frequency: '1x ao dia',
      times: ['08:00'],
      startDate: new Date('2024-01-01'),
    };

    expect(medicineWithoutOptionals.endDate).toBeUndefined();
    expect(medicineWithoutOptionals.notes).toBeUndefined();
  });

  it('should handle multiple times correctly', () => {
    const medicine: Medicine = {
      id: '4',
      name: 'Antibiótico',
      dosage: '250mg',
      frequency: '4x ao dia',
      times: ['06:00', '12:00', '18:00', '00:00'],
      startDate: new Date('2024-01-01'),
    };

    expect(medicine.times).toHaveLength(4);
    expect(medicine.times).toContain('06:00');
    expect(medicine.times).toContain('00:00');
  });
});
