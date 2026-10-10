export type AlertType =
  | "High Dose"
  | "Excessive Department Utilization"
  | "Prescriber Outlier"
  | "Rapid Stock Depletion"
  | "Night-Time Pattern"
  | "Forecast Deviation";

export type ValidationResult = "True Positive" | "False Positive";

export type ActionTaken = "No Action" | "Internal Audit" | "Clinical Review" | "Reporting to Authority";

export type AlertStatus = "Pending Review" | "Reviewed";

export type RiskLevel = "High" | "Medium" | "Low";

export interface AiAlertRecord {
  id: string;
  generatedAt: string;
  alertType: AlertType;
  drugName: string;
  department: string;
  riskScore: number;
  reason: string;
  status: AlertStatus;
  validation?: ValidationResult;
  actionTaken?: ActionTaken;
  reviewedBy?: string;
  reviewedAt?: string;
}