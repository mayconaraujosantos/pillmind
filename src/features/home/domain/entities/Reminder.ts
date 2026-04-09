export interface Reminder {
  id: string;
  medicineId: string;
  /** e.g. ["09:00", "14:00"] */
  times: string[];
  /** e.g. ["MON","TUE","WED"] — empty means every day */
  daysOfWeek: string[];
  active: boolean;
}
