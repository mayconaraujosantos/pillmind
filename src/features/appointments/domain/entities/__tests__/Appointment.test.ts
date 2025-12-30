import { Appointment } from '../Appointment';

describe('Appointment entity', () => {
  it('should have required properties', () => {
    const appointment: Appointment = {
      id: '1',
      title: 'Consulta Cardiologista',
      date: new Date('2024-01-15'),
      time: '14:30',
      type: 'consultation',
    };

    expect(appointment.id).toBeDefined();
    expect(appointment.title).toBeDefined();
    expect(appointment.date).toBeDefined();
    expect(appointment.time).toBeDefined();
    expect(appointment.type).toBeDefined();
  });

  it('should allow all appointment types', () => {
    const types: Array<'consultation' | 'examination' | 'surgery' | 'other'> = [
      'consultation',
      'examination',
      'surgery',
      'other',
    ];

    types.forEach((type) => {
      const appointment: Appointment = {
        id: '1',
        title: 'Test Appointment',
        date: new Date(),
        time: '10:00',
        type,
      };

      expect(appointment.type).toBe(type);
    });
  });

  it('should allow optional properties', () => {
    const appointmentWithOptionals: Appointment = {
      id: '2',
      title: 'Exame de Sangue',
      description: 'Exames de rotina anuais',
      date: new Date('2024-02-20'),
      time: '09:00',
      location: 'Laboratório Central',
      doctorName: 'Dr. Silva',
      type: 'examination',
    };

    expect(appointmentWithOptionals.description).toBe(
      'Exames de rotina anuais'
    );
    expect(appointmentWithOptionals.location).toBe('Laboratório Central');
    expect(appointmentWithOptionals.doctorName).toBe('Dr. Silva');
  });

  it('should work without optional properties', () => {
    const appointmentMinimal: Appointment = {
      id: '3',
      title: 'Consulta Rápida',
      date: new Date('2024-03-10'),
      time: '16:00',
      type: 'other',
    };

    expect(appointmentMinimal.description).toBeUndefined();
    expect(appointmentMinimal.location).toBeUndefined();
    expect(appointmentMinimal.doctorName).toBeUndefined();
  });

  it('should handle different appointment types correctly', () => {
    const consultation: Appointment = {
      id: '4',
      title: 'Consulta Pediatra',
      date: new Date(),
      time: '15:30',
      type: 'consultation',
    };

    const surgery: Appointment = {
      id: '5',
      title: 'Cirurgia Menor',
      date: new Date(),
      time: '08:00',
      type: 'surgery',
    };

    expect(consultation.type).toBe('consultation');
    expect(surgery.type).toBe('surgery');
  });
});
