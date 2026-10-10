import { Timer, Clock, Target, ShieldCheck } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import StatCard from "@/components/common/StatCard";
import TableTitle from "@/components/common/TableTitle";
import DataTable, { type Column } from "@/components/common/DataTable";
import HorizontalBarList from "@/components/charts/HorizontalBarList";
import { Card, CardContent } from "@/components/ui/card";
import {
  ALERT_TYPE_SUMMARY,
  DEPARTMENT_UTILIZATION,
  PRESCRIBER_ANALYTICS,
  SYSTEM_PERFORMANCE,
} from "@/constants/analyticsMockData";
import { DEPARTMENT_EXCESS_THRESHOLD_PERCENT, PRESCRIBER_OUTLIER_THRESHOLD_PERCENT } from "@/constants/aiOptions";
import { formatDeviation, toDepartmentRow, toPrescriberRow } from "@/lib/analyticsUtils";
import type { DepartmentRow, PrescriberRow } from "@/types/analytics";

const stats = [
  { title: "Time to Detect Discrepancy", value: `${SYSTEM_PERFORMANCE.timeToDetectDiscrepancyHours} h`, subtitle: "Average, from occurrence to AI flag", icon: Timer, iconBg: "#ECFEFF", iconColor: "#0891B2" },
  { title: "Alert Response Time", value: `${SYSTEM_PERFORMANCE.alertResponseMinutes} min`, subtitle: "Average, from alert to pharmacologist review", icon: Clock, iconBg: "#FFF4E5", iconColor: "#F79009" },
  { title: "Forecast Error", value: `${SYSTEM_PERFORMANCE.forecastErrorUnits} units`, subtitle: "Average gap between actual and predicted", icon: Target, iconBg: "#FEECEB", iconColor: "#F04438" },
  { title: "Alert Accuracy", value: `${SYSTEM_PERFORMANCE.alertAccuracyPercent}%`, subtitle: "Alerts confirmed as true positive", icon: ShieldCheck, iconBg: "#E7F9EF", iconColor: "#12B76A" },
];

const alertBars = [...ALERT_TYPE_SUMMARY]
  .sort((a, b) => b.count - a.count)
  .map((item) => ({ label: item.alertType, value: item.count }));

const prescriberRows = PRESCRIBER_ANALYTICS.map(toPrescriberRow);
const departmentRows = DEPARTMENT_UTILIZATION.map(toDepartmentRow);

const deviationBadge = (deviation: number | null, flagged: boolean, flagLabel: string) => (
  <span
    className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
      flagged ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
    }`}
  >
    {formatDeviation(deviation)}
    {flagged ? ` · ${flagLabel}` : ""}
  </span>
);

const departmentColumns: Column<DepartmentRow>[] = [
  { key: "department", label: "Department", render: (r) => <span className="font-bold">{r.department}</span> },
  { key: "thisMonth", label: "This Month (units)", render: (r) => <span className="font-black">{r.thisMonth}</span> },
  { key: "sixMonthAverage", label: "6-Month Average (units)" },
  { key: "deviation", label: "Change", render: (r) => deviationBadge(r.deviation, r.flagged, "Excessive") },
];

const prescriberColumns: Column<PrescriberRow>[] = [
  { key: "prescriber", label: "Prescriber", render: (r) => <span className="font-bold">{r.prescriber}</span> },
  { key: "department", label: "Department" },
  { key: "prescriptions", label: "Prescriptions" },
  { key: "totalQuantity", label: "Total Quantity Prescribed" },
  { key: "averageQuantity", label: "Average per Prescription", render: (r) => r.averageQuantity.toFixed(1) },
  { key: "departmentAverageQuantity", label: "Department Average" },
  { key: "deviation", label: "Compared with Department", render: (r) => deviationBadge(r.deviation, r.flagged, "Outlier") },
];

export default function Analytics() {
  return (
    <>
      <PageHeader
        title="AI Analytics"
        subtitle="System performance, alert patterns, prescriber analytics and department utilization"
      />

      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardContent className="space-y-4 p-6">
            <div>
              <h3 className="text-base font-extrabold">Alerts by Type</h3>
              <p className="text-xs text-muted-foreground">Last 30 days, across the six AI alert types</p>
            </div>
            <HorizontalBarList items={alertBars} />
          </CardContent>
        </Card>

        <div className="min-w-0 lg:col-span-2">
          <DataTable
            columns={departmentColumns}
            rows={departmentRows}
            getRowId={(r) => r.id}
            header={<TableTitle title="Department Utilization" subtitle="This month's consumption compared with each department's 6-month average" />}
          />
        </div>
      </div>

      <DataTable
        columns={prescriberColumns}
        rows={prescriberRows}
        getRowId={(r) => r.id}
        header={<TableTitle title="Prescriber Analytics" subtitle="Average quantity per prescription compared with the prescriber's department" />}
      />

      <p className="mt-4 text-xs text-muted-foreground">
        Sample analytics. Flags currently use placeholder thresholds (+{PRESCRIBER_OUTLIER_THRESHOLD_PERCENT}% for prescribers, +{DEPARTMENT_EXCESS_THRESHOLD_PERCENT}% for departments); the AI model will set the real ones.
      </p>
    </>
  );
}