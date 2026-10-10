export type Gender = "Male" | "Female" | "Other";

export interface PatientRecord {
  id: string;
  uhid: string;
  patientNameOrCode: string;
  age: number;
  gender: Gender;
  wardUnit: string;
  diagnosis: string;
  registeredOn: string;
}