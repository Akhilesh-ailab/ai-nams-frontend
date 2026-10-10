export type SeasonalFactor = "Normal" | "Festival Period" | "Disaster/Epidemic" | "High Surgery Month";

export interface ForecastRecord {
  id: string;
  month: string; // YYYY-MM
  endName: string;
  openingStock: number;
  quantityReceived: number;
  quantityIssued: number;
  quantityDispensed: number; // actual consumption
  closingStock: number;
  stockOutDays: number;
  emergencyIndents: number;
  oncologyAdmissions: number;
  icuAdmissions: number;
  surgicalCases: number;
  palliativePatients: number;
  traumaCases: number;
  averageDosePerPatientMg: number;
  seasonalFactor: SeasonalFactor;
  aiPredictedConsumption: number | null;
}

export interface ForecastMetrics {
  mae: number;
  rmse: number;
  accuracy: number;
}

export interface ReorderSettings {
  leadTimeDays: number;
  safetyStock: number;
}

export interface ReorderSummary {
  averageMonthlyConsumption: number;
  leadTimeDays: number;
  safetyStock: number;
  reorderLevel: number;
  currentStock: number;
  earlyReorderAlert: boolean;
}