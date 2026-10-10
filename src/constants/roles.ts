import type { UserRole } from "@/redux/slices/authSlice";

export const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "admin", label: "Administrator" },
  { value: "pharmacist", label: "Pharmacist" },
  { value: "doctor", label: "Doctor" },
  { value: "pharmacologist", label: "Pharmacologist" },
  { value: "hospital_admin", label: "Hospital Administrator" },
  { value: "regulatory_authority", label: "Regulatory Authority" },
];