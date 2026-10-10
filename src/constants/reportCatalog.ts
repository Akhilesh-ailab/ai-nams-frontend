import { INITIAL_RECEIPTS } from "./procurementMockData";
import { INITIAL_ISSUES } from "./departmentIssueMockData";
import { INITIAL_STOCK_REGISTER } from "./departmentStockMockData";
import { INITIAL_DISPENSING } from "./dispensingMockData";
import { INITIAL_AI_ALERTS } from "./aiAlertsMockData";
import { DEFAULT_REORDER_SETTINGS, INITIAL_FORECAST_RECORDS, REORDER_SETTINGS } from "./forecastingMockData";
import { PRESCRIBER_ANALYTICS } from "./analyticsMockData";
import { INITIAL_COMPLIANCE_RECORDS } from "./complianceMockData";
import { COMPLIANCE_CHECKS } from "./complianceOptions";
import { absoluteError, calculateReorder, forecastAccuracy } from "@/lib/forecastUtils";
import { toPrescriberRow } from "@/lib/analyticsUtils";
import { yesNo } from "@/lib/reportUtils";
import type { ReportDefinition } from "@/types/report";

export const REPORT_CATALOG: ReportDefinition[] = [
  {
    id: "central-pharmacy-stock",
    name: "Central Pharmacy Stock Report",
    description: "Bulk receipts of Essential Narcotic Drugs (END) at Central Pharmacy",
    crfSection: "Section 1",
    buildRows: () =>
      INITIAL_RECEIPTS.map((r) => ({
        "Date of Receipt": r.dateOfReceipt,
        "Drug Name": r.drugName,
        Formulation: r.formulation,
        Strength: r.strength,
        "Batch Number": r.batchNumber,
        "Supplier Name": r.supplierName,
        "Invoice Number": r.invoiceNumber,
        "Invoice Date": r.invoiceDate,
        "Expiry Date": r.expiryDate,
        "Opening Stock": r.openingStock,
        "Quantity Received": r.quantityReceived,
        "Total Available Stock": r.totalAvailableStock,
        "Verified By": r.verifiedBy,
        "Double Lock Storage Confirmed": yesNo(r.storageConfirmed),
      })),
  },
  {
    id: "department-issue",
    name: "Issue to Department Report",
    description: "Every issue of END from Central Pharmacy to a department",
    crfSection: "Section 2",
    buildRows: () =>
      INITIAL_ISSUES.map((i) => ({
        "Date of Issue": i.dateOfIssue,
        "Department Name": i.departmentName,
        "Indenting Officer": i.indentingOfficer,
        "Indent Reference Number": i.indentReferenceNumber,
        "Drug Name": i.drugName,
        "Batch Number": i.batchNumber,
        "Quantity Issued": i.quantityIssued,
        "Stock Before Issue": i.stockBeforeIssue,
        "Stock After Issue": i.stockAfterIssue,
        "Department Receiving Signatory": i.departmentReceivingSignatory,
        "Issuing Pharmacist": i.issuingPharmacist,
        "Discrepancy Noted": yesNo(i.discrepancyNoted),
        "Discrepancy Amount": i.discrepancyAmount ?? 0,
      })),
  },
  {
    id: "departmental-stock-register",
    name: "Departmental Stock Register Report",
    description: "Opening, received, dispensed and closing balance in each department",
    crfSection: "Section 3",
    buildRows: () =>
      INITIAL_STOCK_REGISTER.map((s) => ({
        Date: s.date,
        "Department Name": s.departmentName,
        "Drug Name": s.drugName,
        "Opening Balance": s.openingBalance,
        "Quantity Received from Central Pharmacy": s.quantityReceived,
        "Total Available": s.totalAvailable,
        "Quantity Dispensed to Patients": s.quantityDispensed,
        "Closing Balance (Recorded)": s.closingBalanceRecorded,
        "Physical Verified Balance": s.physicalVerifiedBalance,
        "Discrepancy Present": yesNo(s.discrepancyPresent),
        "Discrepancy Quantity": s.discrepancyQuantity ?? 0,
        "Date of Detection": s.dateOfDetection ?? "",
      })),
  },
  {
    id: "patient-dispensing",
    name: "Patient-wise Dispensing Report",
    description: "Every dose of END given to a patient, with signatures",
    crfSection: "Section 4",
    buildRows: () =>
      INITIAL_DISPENSING.map((d) => ({
        Date: d.date,
        "Patient Name or Code": d.patientNameOrCode,
        UHID: d.uhid,
        Diagnosis: d.diagnosis,
        "Ward / Unit": d.wardUnit,
        "Prescribing Doctor": d.prescribingDoctor,
        "END Name": d.endName,
        Dose: d.dose,
        Frequency: d.frequency,
        "Quantity Issued": d.quantityIssued,
        "Department Stock Before Issue": d.departmentStockBefore,
        "Department Stock After Issue": d.departmentStockAfter,
        "Patient / Attender Signature": d.patientAttenderSignature,
        "Administering Nurse Signature": d.administeringNurseSignature,
      })),
  },
  {
    id: "ai-alerts",
    name: "AI Alert Report",
    description: "AI alerts with the pharmacologist's validation and action taken",
    crfSection: "Section 5",
    buildRows: () =>
      INITIAL_AI_ALERTS.map((a) => ({
        "Generated At": a.generatedAt,
        "Alert Type": a.alertType,
        "Drug Name": a.drugName,
        Department: a.department,
        "AI Risk Score (%)": Math.round(a.riskScore * 100),
        "Why the AI Flagged This": a.reason,
        "Validation by Pharmacologist": a.validation ?? "Pending Review",
        "Action Taken": a.actionTaken ?? "",
        "Reviewed By": a.reviewedBy ?? "",
        "Reviewed At": a.reviewedAt ?? "",
      })),
  },
  {
    id: "compliance",
    name: "NDPS Compliance Report",
    description: "NDPS compliance checks and scores for each department and Central Pharmacy",
    crfSection: "Section 6",
    buildRows: () =>
      INITIAL_COMPLIANCE_RECORDS.map((r) => ({
        Date: r.date,
        "Department / Area": r.area,
        ...Object.fromEntries(COMPLIANCE_CHECKS.map((check) => [check.label, yesNo(r[check.key])])),
        "Compliance Score (out of 100)": r.score,
        "Checked By": r.checkedBy,
      })),
  },
  {
    id: "discrepancy",
    name: "Discrepancy Report",
    description: "Stock discrepancies found at issue or in a department's stock register",
    crfSection: "Sections 2 and 3",
    buildRows: () => [
      ...INITIAL_ISSUES.filter((i) => i.discrepancyNoted).map((i) => ({
        Source: "Issue to Department",
        Date: i.dateOfIssue,
        Department: i.departmentName,
        "Drug Name": i.drugName,
        "Discrepancy Quantity": i.discrepancyAmount ?? 0,
        "Date of Detection": i.dateOfIssue,
      })),
      ...INITIAL_STOCK_REGISTER.filter((s) => s.discrepancyPresent).map((s) => ({
        Source: "Departmental Stock Register",
        Date: s.date,
        Department: s.departmentName,
        "Drug Name": s.drugName,
        "Discrepancy Quantity": s.discrepancyQuantity ?? 0,
        "Date of Detection": s.dateOfDetection ?? "",
      })),
    ],
  },
  {
    id: "monthly-consumption",
    name: "Monthly Consumption Report",
    description: "Monthly opening, received, issued, dispensed and closing stock for each END",
    crfSection: "Section 9, Part A",
    buildRows: () =>
      INITIAL_FORECAST_RECORDS.map((r) => ({
        Month: r.month,
        "Drug Name": r.endName,
        "Opening Stock": r.openingStock,
        "Total Quantity Received": r.quantityReceived,
        "Total Quantity Issued to All Departments": r.quantityIssued,
        "Total Quantity Dispensed (Actual Consumption)": r.quantityDispensed,
        "Closing Stock": r.closingStock,
        "Stock-Out Days": r.stockOutDays,
        "Emergency Indents": r.emergencyIndents,
      })),
  },
  {
    id: "stock-out",
    name: "Stock-Out Report",
    description: "Months in which a stock-out occurred, with emergency indents raised",
    crfSection: "Section 9, Part A",
    buildRows: () =>
      INITIAL_FORECAST_RECORDS.filter((r) => r.stockOutDays > 0).map((r) => ({
        Month: r.month,
        "Drug Name": r.endName,
        "Stock-Out Days": r.stockOutDays,
        "Emergency Indents": r.emergencyIndents,
        "Closing Stock": r.closingStock,
      })),
  },
  {
    id: "forecast",
    name: "Forecast Report",
    description: "AI predicted consumption against actual consumption, with error and accuracy",
    crfSection: "Section 9, Part D",
    buildRows: () =>
      INITIAL_FORECAST_RECORDS.map((r) => ({
        Month: r.month,
        "Drug Name": r.endName,
        "Actual Consumption": r.quantityDispensed,
        "AI Predicted Consumption": r.aiPredictedConsumption ?? "",
        "Absolute Error": absoluteError(r) ?? "",
        "Forecast Accuracy (%)": forecastAccuracy(r)?.toFixed(1) ?? "",
      })),
  },
  {
    id: "reorder",
    name: "Reorder Report",
    description: "Reorder level, safety stock and early reorder alert for each END",
    crfSection: "Section 9, Part E",
    buildRows: () =>
      Array.from(new Set(INITIAL_FORECAST_RECORDS.map((r) => r.endName))).flatMap((drug) => {
        const summary = calculateReorder(
          INITIAL_FORECAST_RECORDS.filter((r) => r.endName === drug),
          REORDER_SETTINGS[drug] ?? DEFAULT_REORDER_SETTINGS
        );
        return summary
          ? [
              {
                "Drug Name": drug,
                "Average Monthly Consumption (Last 6 Months)": summary.averageMonthlyConsumption,
                "Lead Time for Procurement (Days)": summary.leadTimeDays,
                "Safety Stock Level": summary.safetyStock,
                "Reorder Level": summary.reorderLevel,
                "Current Closing Stock": summary.currentStock,
                "Early Reorder Alert": yesNo(summary.earlyReorderAlert),
              },
            ]
          : [];
      }),
  },
  {
    id: "prescriber-analytics",
    name: "Prescriber Analytics Report",
    description: "Average quantity per prescription compared with each prescriber's department",
    crfSection: "AI Analytics",
    buildRows: () =>
      PRESCRIBER_ANALYTICS.map(toPrescriberRow).map((p) => ({
        Prescriber: p.prescriber,
        Department: p.department,
        Prescriptions: p.prescriptions,
        "Total Quantity Prescribed": p.totalQuantity,
        "Average per Prescription": Number(p.averageQuantity.toFixed(1)),
        "Department Average": p.departmentAverageQuantity,
        "Change Compared with Department (%)": p.deviation ?? "",
        Flag: p.flagged ? "Outlier" : "Normal",
      })),
  },
];