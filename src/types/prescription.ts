export interface PrescriptionRecord {
  id: string;
  date: string;
  uhid: string;
  patientNameOrCode: string;
  prescribingDoctor: string;
  endName: string;
  dose: string;
  frequency: string;
  durationDays: number;
  quantityPrescribed: number;
}