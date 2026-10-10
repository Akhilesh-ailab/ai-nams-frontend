import { useState } from "react";
import { Download } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import MetricGrid from "@/components/common/MetricGrid";
import TableTitle from "@/components/common/TableTitle";
import DataTable, { type Column } from "@/components/common/DataTable";
import YesNoBadge from "@/components/common/YesNoBadge";
import FormField from "@/components/forms/FormField";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OUTCOME_REPORTS } from "@/constants/outcomeReportMockData";
import { REPORT_CATALOG } from "@/constants/reportCatalog";
import { SELECT_CLASS } from "@/constants/formStyles";
import { downloadCsv } from "@/lib/csvUtils";
import { outcomeReportToRows } from "@/lib/reportUtils";
import { formatMonth } from "@/lib/forecastUtils";
import type { DepartmentOutcome } from "@/types/report";

const departmentColumns: Column<DepartmentOutcome>[] = [
  { key: "department", label: "Department", render: (r) => <span className="font-bold">{r.department}</span> },
  { key: "monthlyConsumption", label: "Monthly Department Consumption (units)", render: (r) => <span className="font-black">{r.monthlyConsumption}</span> },
  { key: "stockOutOccurred", label: "Stock-Out Occurred?", render: (r) => <YesNoBadge value={r.stockOutOccurred} goodWhen={false} /> },
  { key: "overstockingObserved", label: "Overstocking Observed?", render: (r) => <YesNoBadge value={r.overstockingObserved} goodWhen={false} /> },
];

export default function Reports() {
  const [month, setMonth] = useState(OUTCOME_REPORTS[0].month);
  const report = OUTCOME_REPORTS.find((r) => r.month === month) ?? OUTCOME_REPORTS[0];
  const stamp = new Date().toLocaleDateString("en-CA");

  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="Study outcome report and downloadable reports for Essential Narcotic Drugs (END)"
        actionLabel="Download Outcome Report"
        actionIcon={<Download className="h-4 w-4" />}
        onAction={() => downloadCsv(`outcome-report-${report.month}.csv`, outcomeReportToRows(report))}
      />

      <div className="mb-6 max-w-xs">
        <FormField label="Report Month">
          <select className={SELECT_CLASS} value={month} onChange={(e) => setMonth(e.target.value)}>
            {OUTCOME_REPORTS.map((r) => (
              <option key={r.month} value={r.month}>{formatMonth(r.month)}</option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="space-y-6">
        <MetricGrid
          title="Central Pharmacy Level"
          subtitle="CRF Section 7A"
          items={[
            { label: "Monthly Bulk Receipt Quantity", value: `${report.monthlyBulkReceiptQuantity} units` },
            { label: "Monthly Department Issue Total", value: `${report.monthlyDepartmentIssueTotal} units` },
            { label: "Monthly Stock Discrepancy", value: `${report.monthlyStockDiscrepancy} units` },
          ]}
        />

        <DataTable
          columns={departmentColumns}
          rows={report.departments}
          getRowId={(r) => r.department}
          header={<TableTitle title="Department Level" subtitle="CRF Section 7B" />}
        />

        <MetricGrid
          title="Patient Level"
          subtitle="CRF Section 7C"
          items={[
            { label: "Total Patients Receiving END", value: String(report.totalPatientsReceivingEnd) },
            { label: "Average Dose per Patient", value: `${report.averageDosePerPatientMg} mg` },
            { label: "AI-Flagged Prescriptions", value: String(report.aiFlaggedPrescriptions) },
          ]}
        />

        <MetricGrid
          title="System Performance"
          subtitle="CRF Section 8"
          items={[
            { label: "Time to Detect Discrepancy", value: `${report.timeToDetectDiscrepancyHours} hours` },
            { label: "Forecast Error (Actual − Predicted)", value: `${report.forecastErrorUnits} units` },
            { label: "Alert Response Time", value: `${report.alertResponseMinutes} minutes` },
          ]}
        />

        <div className="space-y-3">
          <div>
            <h2 className="text-base font-extrabold">Downloadable Reports</h2>
            <p className="text-xs text-muted-foreground">CSV files that open in Excel</p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {REPORT_CATALOG.map((def) => (
              <Card key={def.id}>
                <CardContent className="flex h-full flex-col justify-between gap-4 p-5">
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold">{def.name}</h3>
                      <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-primary">
                        {def.crfSection}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{def.description}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => downloadCsv(`${def.id}-${stamp}.csv`, def.buildRows())}
                  >
                    <Download className="h-4 w-4" />
                    Download CSV
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}