import type { Medicine } from '@features/home/domain/entities/Medicine';
import {
    computeMedicineReminderOccurrences,
    medicineReminderScheduleConstants,
    parsePrescriptionFrequency,
} from '../medicineReminderSchedule';

function buildMedicine(overrides?: Partial<Medicine>): Medicine {
  return {
    id: 'med-1',
    name: 'Amoxilina',
    dosage: '500 mg',
    frequency: '8/8h durante 7 dias',
    times: ['08:00'],
    startDate: new Date(2026, 2, 27),
    reminderOnEmpty: true,
    ...overrides,
  };
}

describe('medicineReminderSchedule', () => {
  it('parses interval and duration from prescription text', () => {
    expect(parsePrescriptionFrequency('Tomar amoxilina de 8/8h durante 7 dias')).toEqual({
      intervalHours: 8,
      durationDays: 7,
    });
  });

  it('builds exact interval reminders for 8/8h over 7 days from the first prescribed time', () => {
    const now = new Date(2026, 2, 27, 7, 0, 0);
    const occurrences = computeMedicineReminderOccurrences(buildMedicine(), now);

    expect(occurrences).toHaveLength(21);
    expect(occurrences[0].toISOString()).toBe(new Date(2026, 2, 27, 8, 0, 0).toISOString());
    expect(occurrences[1].toISOString()).toBe(new Date(2026, 2, 27, 16, 0, 0).toISOString());
    expect(occurrences[2].toISOString()).toBe(new Date(2026, 2, 28, 0, 0, 0).toISOString());
    expect(occurrences[20].toISOString()).toBe(new Date(2026, 3, 3, 0, 0, 0).toISOString());
  });

  it('uses fixed daily times when multiple prescribed times are provided', () => {
    const now = new Date(2026, 2, 27, 7, 0, 0);
    const occurrences = computeMedicineReminderOccurrences(
      buildMedicine({
        frequency: 'tomar após café e jantar durante 2 dias',
        times: ['08:00', '20:00'],
      }),
      now
    );

    expect(occurrences).toHaveLength(4);
    expect(occurrences.map((entry) => entry.toISOString())).toEqual([
      new Date(2026, 2, 27, 8, 0, 0).toISOString(),
      new Date(2026, 2, 27, 20, 0, 0).toISOString(),
      new Date(2026, 2, 28, 8, 0, 0).toISOString(),
      new Date(2026, 2, 28, 20, 0, 0).toISOString(),
    ]);
  });

  it('limits rolling schedules for ongoing treatments', () => {
    const now = new Date(2026, 2, 27, 7, 0, 0);
    const occurrences = computeMedicineReminderOccurrences(
      buildMedicine({
        frequency: 'uso contínuo',
        times: ['08:00', '20:00'],
        endDate: undefined,
      }),
      now
    );

    expect(occurrences.length).toBeLessThanOrEqual(
      medicineReminderScheduleConstants.MAX_SCHEDULED_OCCURRENCES
    );
  });
});
