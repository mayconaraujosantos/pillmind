// Domain entity for Medicine
export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  startDate: Date;
  endDate?: Date;
  notes?: string;
  imageUrl?: string;
  /** e.g. capsule, tablet, injection, liquid — alinhado ao backend */
  medicineType?: string;
  prescribedFor?: string;
  quantity?: number;
  reminderOnEmpty?: boolean;
}
