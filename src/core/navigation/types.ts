// Navigation types
export type RootStackParamList = {
  Home: undefined;
  Appointments: undefined;
  Account: undefined;
  Parental: undefined;
  Nearby: undefined;
};

export type TabParamList = {
  HomeTab: undefined;
  AppointmentsTab: undefined;
  AccountTab: undefined;
  ParentalTab: undefined;
  NearbyTab: undefined;
};

/** Stack dentro da tab Home (ecrãs com header nativo + voltar). */
export type HomeTabParamList = {
  HomeMain: undefined;
  MedicineForm: { medicineId?: string };
};

export type AppointmentsTabParamList = {
  AppointmentsMain: undefined;
};

export type ParentalTabParamList = {
  ParentalMain: undefined;
};

export type NearbyTabParamList = {
  NearbyMain: undefined;
};
