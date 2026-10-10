export type ReportRow = Record<string, string | number>;

export interface ReportDefinition {
  id: string;
  name: string;
  description: string;
  crfSection: string;
  buildRows: () => ReportRow[];
}

export interface DepartmentOutcome {
  department: string;
  monthlyConsumption: number;
  stockOutOccurred: boolean;
  overstockingObserved: boolean;
}

export interface OutcomeReportData {
  month: string; // YYYY-MM
  // Section 7A: Central Pharmacy level
  monthlyBulkReceiptQuantity: number;
  monthlyDepartmentIssueTotal: number;
  monthlyStockDiscrepancy: number;
  // Section 7B: Department level
  departments: DepartmentOutcome[];
  // Section 7C: Patient level
  totalPatientsReceivingEnd: number;
  averageDosePerPatientMg: number;
  aiFlaggedPrescriptions: number;
  // Section 8: System performance
  timeToDetectDiscrepancyHours: number;
  forecastErrorUnits: number;
  alertResponseMinutes: number;
}