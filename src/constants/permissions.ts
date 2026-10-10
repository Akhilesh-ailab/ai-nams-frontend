import type { UserRole } from "@/types/auth";

export const PHARMACY_ROLES: UserRole[] = ["admin", "hospital_admin", "pharmacist"];
export const CLINICAL_ROLES: UserRole[] = ["admin", "hospital_admin", "doctor"];
export const ALERT_ROLES: UserRole[] = ["admin", "hospital_admin", "pharmacist", "pharmacologist", "regulatory_authority"];
export const FORECAST_ROLES: UserRole[] = ["admin", "hospital_admin", "pharmacist", "pharmacologist"];
export const COMPLIANCE_ROLES: UserRole[] = ["admin", "hospital_admin", "regulatory_authority"];