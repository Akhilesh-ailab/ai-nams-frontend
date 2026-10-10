import { z } from "zod";
import { DEPARTMENT_OPTIONS, END_OPTIONS } from "@/constants/clinicalOptions";
import { requiredText, nonNegativeNumberString, oneOf } from "./helpers";

export const departmentStockSchema = z
  .object({
    date: requiredText("Date"),
    departmentName: oneOf("department", DEPARTMENT_OPTIONS),
    drugName: oneOf("drug", END_OPTIONS),
    openingBalance: nonNegativeNumberString("Opening balance"),
    quantityReceived: nonNegativeNumberString("Quantity received"),
    quantityDispensed: nonNegativeNumberString("Quantity dispensed"),
    closingBalanceRecorded: nonNegativeNumberString("Closing balance"),
    physicalVerifiedBalance: nonNegativeNumberString("Physical verified balance"),
    dateOfDetection: z.string().optional(),
  })
  .refine((d) => Number(d.quantityDispensed) <= Number(d.openingBalance) + Number(d.quantityReceived), {
    message: "Quantity dispensed cannot be more than the total available",
    path: ["quantityDispensed"],
  })
  .refine(
    (d) =>
      Number(d.closingBalanceRecorded) === Number(d.physicalVerifiedBalance) ||
      (d.dateOfDetection && d.dateOfDetection.trim().length > 0),
    { message: "Date of detection is required when a discrepancy is present", path: ["dateOfDetection"] }
  );
export type DepartmentStockFormValues = z.infer<typeof departmentStockSchema>;