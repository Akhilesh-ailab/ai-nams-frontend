import type { AlertType } from "./aiAlert";

export interface AlertTypeSummary {
  alertType: AlertType;
  count: number;
}

export interface PrescriberAnalytics {
  id: string;
  prescriber: string;
  department: string;
  prescriptions: number;
  totalQuantity: number;
  departmentAverageQuantity: number;
}

export interface PrescriberRow extends PrescriberAnalytics {
  averageQuantity: number;
  deviation: number | null;
  flagged: boolean;
}

export interface DepartmentUtilization {
  id: string;
  department: string;
  thisMonth: number;
  sixMonthAverage: number;
}

export interface DepartmentRow extends DepartmentUtilization {
  deviation: number | null;
  flagged: boolean;
}

export interface SystemPerformance {
  timeToDetectDiscrepancyHours: number;
  alertResponseMinutes: number;
  forecastErrorUnits: number;
  alertAccuracyPercent: number;
}