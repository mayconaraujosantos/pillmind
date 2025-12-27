// Domain entity for Appointment
export interface Appointment {
  id: string;
  title: string;
  description?: string;
  date: Date;
  time: string;
  location?: string;
  doctorName?: string;
  type: 'consultation' | 'examination' | 'surgery' | 'other';
}
