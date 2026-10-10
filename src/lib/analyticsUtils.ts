import { DEPARTMENT_EXCESS_THRESHOLD_PERCENT, PRESCRIBER_OUTLIER_THRESHOLD_PERCENT } from "@/constants/aiOptions";
import { percentChange } from "@/lib/numberUtils";
import type {
  DepartmentRow,
  DepartmentUtilization,
  PrescriberAnalytics,
  PrescriberRow,
} from "@/types/analytics";

export const toPrescriberRow = (p: PrescriberAnalytics): PrescriberRow => {
  const averageQuantity = p.totalQuantity / p.prescriptions;
  const deviation = percentChange(averageQuantity, p.departmentAverageQuantity);
  return {
    ...p,
    averageQuantity,
    deviation,
    flagged: deviation !== null && deviation >= PRESCRIBER_OUTLIER_THRESHOLD_PERCENT,
  };
};

export const toDepartmentRow = (d: DepartmentUtilization): DepartmentRow => {
  const deviation = percentChange(d.thisMonth, d.sixMonthAverage);
  return {
    ...d,
    deviation,
    flagged: deviation !== null && deviation >= DEPARTMENT_EXCESS_THRESHOLD_PERCENT,
  };
};

export const formatDeviation = (deviation: number | null): string =>
  deviation === null ? "—" : `${deviation > 0 ? "+" : ""}${deviation}%`;