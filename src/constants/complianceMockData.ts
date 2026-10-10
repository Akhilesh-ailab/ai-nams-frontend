import type { ComplianceRecord } from "@/types/compliance";

export const INITIAL_COMPLIANCE_RECORDS: ComplianceRecord[] = [
  { id: "CMP-8001", date: "2026-09-22", area: "Central Pharmacy", dailyClosingBalance: true, doubleLockStorage: true, dualSignature: true, monthlyReconciliation: true, inspectionReady: true, score: 100, checkedBy: "Dr. P. Iyer" },
  { id: "CMP-8002", date: "2026-09-22", area: "ICU Ward", dailyClosingBalance: true, doubleLockStorage: true, dualSignature: true, monthlyReconciliation: true, inspectionReady: true, score: 100, checkedBy: "Dr. P. Iyer" },
  { id: "CMP-8003", date: "2026-09-22", area: "Operation Theatre (OT)", dailyClosingBalance: true, doubleLockStorage: true, dualSignature: true, monthlyReconciliation: false, inspectionReady: true, score: 80, checkedBy: "Dr. P. Iyer" },
  { id: "CMP-8004", date: "2026-09-22", area: "Emergency Ward", dailyClosingBalance: true, doubleLockStorage: true, dualSignature: true, monthlyReconciliation: true, inspectionReady: true, score: 100, checkedBy: "Dr. P. Iyer" },
  { id: "CMP-8005", date: "2026-09-22", area: "Oncology Ward", dailyClosingBalance: true, doubleLockStorage: true, dualSignature: true, monthlyReconciliation: true, inspectionReady: true, score: 100, checkedBy: "Dr. P. Iyer" },
  { id: "CMP-8006", date: "2026-09-01", area: "Central Pharmacy", dailyClosingBalance: true, doubleLockStorage: true, dualSignature: true, monthlyReconciliation: true, inspectionReady: true, score: 100, checkedBy: "Pharmacist R. Nair" },
  { id: "CMP-8007", date: "2026-09-01", area: "ICU Ward", dailyClosingBalance: true, doubleLockStorage: true, dualSignature: false, monthlyReconciliation: true, inspectionReady: true, score: 80, checkedBy: "Pharmacist R. Nair" },
  { id: "CMP-8008", date: "2026-09-01", area: "Operation Theatre (OT)", dailyClosingBalance: true, doubleLockStorage: true, dualSignature: true, monthlyReconciliation: false, inspectionReady: false, score: 60, checkedBy: "Pharmacist R. Nair" },
  { id: "CMP-8009", date: "2026-09-01", area: "Emergency Ward", dailyClosingBalance: false, doubleLockStorage: true, dualSignature: true, monthlyReconciliation: true, inspectionReady: true, score: 80, checkedBy: "Pharmacist R. Nair" },
  { id: "CMP-8010", date: "2026-09-01", area: "Oncology Ward", dailyClosingBalance: true, doubleLockStorage: true, dualSignature: true, monthlyReconciliation: true, inspectionReady: true, score: 100, checkedBy: "Pharmacist R. Nair" },
];