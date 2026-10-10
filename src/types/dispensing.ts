export interface DispensingRecord {
  id: string;
  date: string;
  patientNameOrCode: string;
  uhid: string;
  diagnosis: string;
  wardUnit: string;
  prescribingDoctor: string;
  endName: string;
  dose: string;
  frequency: string;
  quantityIssued: number;
  departmentStockBefore: number;
  departmentStockAfter: number;
  patientAttenderSignature: string;
  administeringNurseSignature: string;
}