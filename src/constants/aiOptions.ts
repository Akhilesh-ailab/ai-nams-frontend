import type { ActionTaken, AlertType, ValidationResult } from "@/types/aiAlert";
import type { SeasonalFactor } from "@/types/forecast";
import type { UserRole } from "@/types/auth";

export const ALERT_TYPE_OPTIONS: readonly AlertType[] = [
  "High Dose",
  "Excessive Department Utilization",
  "Prescriber Outlier",
  "Rapid Stock Depletion",
  "Night-Time Pattern",
  "Forecast Deviation",
];

export const VALIDATION_OPTIONS: readonly ValidationResult[] = ["True Positive", "False Positive"];

export const ACTION_OPTIONS: readonly ActionTaken[] = [
  "No Action",
  "Internal Audit",
  "Clinical Review",
  "Reporting to Authority",
];

export const SEASONAL_FACTOR_OPTIONS: readonly SeasonalFactor[] = [
  "Normal",
  "Festival Period",
  "Disaster/Epidemic",
  "High Surgery Month",
];

export const ALERT_FILTERS = ["All", "Pending Review", "Reviewed"] as const;

// CRF Section 5: "Validation by Pharmacologist". Administrator is included so you can test the review form.
export const ALERT_REVIEWER_ROLES: readonly UserRole[] = ["pharmacologist", "admin"];

// Placeholder thresholds for the sample analytics flags; the AI model will set the real ones.
export const PRESCRIBER_OUTLIER_THRESHOLD_PERCENT = 50;
export const DEPARTMENT_EXCESS_THRESHOLD_PERCENT = 30;