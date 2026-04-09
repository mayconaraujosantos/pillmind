// Navigation types
export type RootStackParamList = {
  Home: undefined;
  Appointments: undefined;
  Account: undefined;
  Parental: undefined;
  Nearby: undefined;
};

export type TabParamList = {
  index: undefined;
  appointments: undefined;
  account: undefined;
  parental: undefined;
  nearby: undefined;
};

export type ExpoRouterTabParamList = TabParamList;

/** Stack dentro da tab Home (ecrãs com header nativo + voltar). */
export type HomeTabParamList = {
  HomeMain: undefined;
  MedicineForm: { medicineId?: string };
  Schedule: undefined;
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
