import type { OutcomeReportData, ReportRow } from "@/types/report";

export const yesNo = (value: boolean): string => (value ? "Yes" : "No");

// Flattens the Study Outcome Report (CRF Sections 7 and 8) into rows for the CSV download.
export const outcomeReportToRows = (r: OutcomeReportData): ReportRow[] => {
  const row = (section: string, item: string, value: string | number): ReportRow => ({
    Month: r.month,
    Section: section,
    Item: item,
    Value: value,
  });

  return [
    row("7A Central Pharmacy Level", "Monthly Bulk Receipt Quantity", r.monthlyBulkReceiptQuantity),
    row("7A Central Pharmacy Level", "Monthly Department Issue Total", r.monthlyDepartmentIssueTotal),
    row("7A Central Pharmacy Level", "Monthly Stock Discrepancy", r.monthlyStockDiscrepancy),
    ...r.departments.flatMap((d) => [
      row(`7B Department Level - ${d.department}`, "Monthly Department Consumption", d.monthlyConsumption),
      row(`7B Department Level - ${d.department}`, "Stock-Out Occurred?", yesNo(d.stockOutOccurred)),
      row(`7B Department Level - ${d.department}`, "Overstocking Observed?", yesNo(d.overstockingObserved)),
    ]),
    row("7C Patient Level", "Total Patients Receiving END", r.totalPatientsReceivingEnd),
    row("7C Patient Level", "Average Dose per Patient (mg)", r.averageDosePerPatientMg),
    row("7C Patient Level", "AI-Flagged Prescriptions", r.aiFlaggedPrescriptions),
    row("8 System Performance", "Time to Detect Discrepancy (hours)", r.timeToDetectDiscrepancyHours),
    row("8 System Performance", "Forecast Error, Actual - Predicted (units)", r.forecastErrorUnits),
    row("8 System Performance", "Alert Response Time (minutes)", r.alertResponseMinutes),
  ];
};