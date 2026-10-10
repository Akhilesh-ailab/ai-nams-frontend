import type {
  AlertTypeSummary,
  DepartmentUtilization,
  PrescriberAnalytics,
  SystemPerformance,
} from "@/types/analytics";

export const SYSTEM_PERFORMANCE: SystemPerformance = {
  timeToDetectDiscrepancyHours: 6.5,
  alertResponseMinutes: 38,
  forecastErrorUnits: 7,
  alertAccuracyPercent: 72,
};

export const ALERT_TYPE_SUMMARY: AlertTypeSummary[] = [
  { alertType: "High Dose", count: 14 },
  { alertType: "Rapid Stock Depletion", count: 11 },
  { alertType: "Excessive Department Utilization", count: 9 },
  { alertType: "Forecast Deviation", count: 8 },
  { alertType: "Prescriber Outlier", count: 6 },
  { alertType: "Night-Time Pattern", count: 5 },
];

export const PRESCRIBER_ANALYTICS: PrescriberAnalytics[] = [
  { id: "PRS-01", prescriber: "Dr. A. Sharma", department: "ICU Ward", prescriptions: 24, totalQuantity: 96, departmentAverageQuantity: 3.8 },
  { id: "PRS-02", prescriber: "Dr. V. Menon", department: "Oncology Ward", prescriptions: 31, totalQuantity: 112, departmentAverageQuantity: 3.5 },
  { id: "PRS-03", prescriber: "Dr. S. Mehta", department: "Operation Theatre (OT)", prescriptions: 18, totalQuantity: 99, departmentAverageQuantity: 3.2 },
  { id: "PRS-04", prescriber: "Dr. R. Gupta", department: "Emergency Ward", prescriptions: 27, totalQuantity: 88, departmentAverageQuantity: 3.4 },
];

export const DEPARTMENT_UTILIZATION: DepartmentUtilization[] = [
  { id: "DEP-01", department: "ICU Ward", thisMonth: 190, sixMonthAverage: 140 },
  { id: "DEP-02", department: "Operation Theatre (OT)", thisMonth: 96, sixMonthAverage: 90 },
  { id: "DEP-03", department: "Emergency Ward", thisMonth: 120, sixMonthAverage: 118 },
  { id: "DEP-04", department: "Oncology Ward", thisMonth: 150, sixMonthAverage: 128 },
  { id: "DEP-05", department: "Palliative Care Unit", thisMonth: 64, sixMonthAverage: 80 },
];