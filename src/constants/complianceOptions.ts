import type { ComplianceCheckKey } from "@/types/compliance";
import type { UserRole } from "@/types/auth";
import { DEPARTMENT_OPTIONS } from "@/constants/clinicalOptions";

// The five checks in CRF Section 6, in CRF order.
export const COMPLIANCE_CHECKS: readonly { key: ComplianceCheckKey; label: string }[] = [
  { key: "dailyClosingBalance", label: "Daily Closing Balance Maintained?" },
  { key: "doubleLockStorage", label: "Double Lock Storage Confirmed?" },
  { key: "dualSignature", label: "Dual Signature System Followed?" },
  { key: "monthlyReconciliation", label: "Monthly Reconciliation Done?" },
  { key: "inspectionReady", label: "Inspection Ready at Any Time?" },
];

export const COMPLIANCE_AREA_OPTIONS: readonly string[] = ["Central Pharmacy", ...DEPARTMENT_OPTIONS];

// The Regulatory Authority has read-only access to compliance records.
export const COMPLIANCE_RECORDER_ROLES: readonly UserRole[] = ["admin", "hospital_admin"];