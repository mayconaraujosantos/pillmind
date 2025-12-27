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
}

