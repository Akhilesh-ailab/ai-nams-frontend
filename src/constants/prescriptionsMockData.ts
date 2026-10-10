import type { PrescriptionRecord } from "@/types/prescription";

export const INITIAL_PRESCRIPTIONS: PrescriptionRecord[] = [
  { id: "RX-5101", date: "2026-09-21", uhid: "UHID-102938", patientNameOrCode: "P-4402", prescribingDoctor: "Dr. A. Sharma", endName: "Fentanyl Citrate", dose: "50 mcg", frequency: "Every 6 hours", durationDays: 3, quantityPrescribed: 12 },
  { id: "RX-5102", date: "2026-09-21", uhid: "UHID-104771", patientNameOrCode: "P-1189", prescribingDoctor: "Dr. V. Menon", endName: "Morphine Sulfate", dose: "10 mg", frequency: "Every 4 hours", durationDays: 5, quantityPrescribed: 30 },
];