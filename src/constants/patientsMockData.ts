import type { PatientRecord } from "@/types/patient";

export const INITIAL_PATIENTS: PatientRecord[] = [
  { id: "PAT-5001", uhid: "UHID-102938", patientNameOrCode: "P-4402", age: 58, gender: "Male", wardUnit: "ICU Ward", diagnosis: "Post-operative pain management", registeredOn: "2026-09-12" },
  { id: "PAT-5002", uhid: "UHID-104771", patientNameOrCode: "P-1189", age: 64, gender: "Female", wardUnit: "Oncology Ward", diagnosis: "Cancer pain (palliative)", registeredOn: "2026-09-14" },
  { id: "PAT-5003", uhid: "UHID-108215", patientNameOrCode: "P-3321", age: 41, gender: "Male", wardUnit: "Trauma Unit", diagnosis: "Fracture, severe acute pain", registeredOn: "2026-09-19" },
];