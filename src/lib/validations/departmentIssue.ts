import { z } from "zod";
import { DEPARTMENT_OPTIONS, END_OPTIONS } from "@/constants/clinicalOptions";
import { requiredText, nonNegativeNumberString, positiveNumberString, oneOf } from "./helpers";

export const departmentIssueSchema = z
  .object({
    dateOfIssue: requiredText("Date of issue"),
    departmentName: oneOf("department", DEPARTMENT_OPTIONS),
    indentingOfficer: requiredText("Indenting officer name"),
    indentReferenceNumber: requiredText("Indent reference number"),
    drugName: oneOf("drug", END_OPTIONS),
    batchNumber: requiredText("Batch number"),
    stockBeforeIssue: nonNegativeNumberString("Stock before issue"),
    quantityIssued: positiveNumberString("Quantity issued"),
    departmentReceivingSignatory: requiredText("Department receiving signatory"),
    issuingPharmacist: requiredText("Issuing pharmacist name"),
    discrepancyNoted: oneOf("Yes or No", ["yes", "no"]),
    discrepancyAmount: z.string().optional(),
  })
  .refine((d) => Number(d.quantityIssued) <= Number(d.stockBeforeIssue), {
    message: "Quantity issued cannot be more than the stock before issue",
    path: ["quantityIssued"],
  })
  .refine((d) => d.discrepancyNoted !== "yes" || Number(d.discrepancyAmount) > 0, {
    message: "Enter the discrepancy amount (more than 0)",
    path: ["discrepancyAmount"],
  });
export type DepartmentIssueFormValues = z.infer<typeof departmentIssueSchema>;