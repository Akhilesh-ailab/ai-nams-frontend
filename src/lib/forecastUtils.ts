import type { ForecastMetrics, ForecastRecord, ReorderSettings, ReorderSummary } from "@/types/forecast";

type ScoredRecord = ForecastRecord & { aiPredictedConsumption: number };

const byMonth = (a: ForecastRecord, b: ForecastRecord) => a.month.localeCompare(b.month);

export const formatMonth = (month: string): string =>
  new Date(`${month}-01T00:00:00`).toLocaleDateString("en-IN", { month: "short", year: "numeric" });

export const absoluteError = (record: ForecastRecord): number | null =>
  record.aiPredictedConsumption === null ? null : Math.abs(record.quantityDispensed - record.aiPredictedConsumption);

// CRF formula: (1 - |Actual - Predicted| / Actual) x 100
export const forecastAccuracy = (record: ForecastRecord): number | null => {
  const error = absoluteError(record);
  return error === null || record.quantityDispensed === 0 ? null : (1 - error / record.quantityDispensed) * 100;
};

export const calculateMetrics = (records: ForecastRecord[]): ForecastMetrics | null => {
  const scored = records.filter((r): r is ScoredRecord => r.aiPredictedConsumption !== null);
  if (scored.length === 0) return null;

  const errors = scored.map((r) => r.quantityDispensed - r.aiPredictedConsumption);
  const mae = errors.reduce((sum, e) => sum + Math.abs(e), 0) / errors.length;
  const rmse = Math.sqrt(errors.reduce((sum, e) => sum + e * e, 0) / errors.length);

  const accuracies = scored.map((r) => forecastAccuracy(r)).filter((a): a is number => a !== null);
  const accuracy = accuracies.length > 0 ? accuracies.reduce((sum, a) => sum + a, 0) / accuracies.length : 0;

  return { mae, rmse, accuracy };
};

// Stand-in for the real AI model: average of the (up to) 3 previous months' actual consumption.
export const placeholderForecast = (history: ForecastRecord[], month: string): number | null => {
  const previous = history.filter((r) => r.month < month).sort(byMonth).slice(-3);
  if (previous.length === 0) return null;
  return Math.round(previous.reduce((sum, r) => sum + r.quantityDispensed, 0) / previous.length);
};

// Reorder level = (average monthly consumption / 30) x lead time + safety stock
export const calculateReorder = (records: ForecastRecord[], settings: ReorderSettings): ReorderSummary | null => {
  const lastSix = [...records].sort(byMonth).slice(-6);
  const latest = lastSix.at(-1);
  if (!latest) return null;

  const averageMonthlyConsumption = Math.round(lastSix.reduce((sum, r) => sum + r.quantityDispensed, 0) / lastSix.length);
  const reorderLevel = Math.ceil((averageMonthlyConsumption / 30) * settings.leadTimeDays + settings.safetyStock);

  return {
    averageMonthlyConsumption,
    leadTimeDays: settings.leadTimeDays,
    safetyStock: settings.safetyStock,
    reorderLevel,
    currentStock: latest.closingStock,
    earlyReorderAlert: latest.closingStock <= reorderLevel,
  };
};