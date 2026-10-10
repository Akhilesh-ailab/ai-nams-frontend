import type { DispensingRecord } from "@/types/dispensing";

export const INITIAL_DISPENSING: DispensingRecord[] = [
  { id: "DSP-6001", date: "2026-09-21", patientNameOrCode: "P-4402", uhid: "UHID-102938", diagnosis: "Post-operative pain management", wardUnit: "ICU Ward", prescribingDoctor: "Dr. A. Sharma", endName: "Fentanyl Citrate", dose: "50 mcg", frequency: "Every 6 hours", quantityIssued: 1, departmentStockBefore: 55, departmentStockAfter: 54, patientAttenderSignature: "Attender: R. Kumar", administeringNurseSignature: "Nurse Anita M." },
  { id: "DSP-6002", date: "2026-09-21", patientNameOrCode: "P-1189", uhid: "UHID-104771", diagnosis: "Cancer pain (palliative)", wardUnit: "Oncology Ward", prescribingDoctor: "Dr. V. Menon", endName: "Morphine Sulfate", dose: "10 mg", frequency: "Every 4 hours", quantityIssued: 1, departmentStockBefore: 60, departmentStockAfter: 59, patientAttenderSignature: "Attender: S. Patel", administeringNurseSignature: "Nurse Karen P." },
];