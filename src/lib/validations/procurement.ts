import { z } from "zod";
import { END_OPTIONS } from "@/constants/clinicalOptions";
import { FORMULATION_OPTIONS } from "@/constants/drugOptions";
import { requiredText, nonNegativeNumberString, positiveNumberString, oneOf } from "./helpers";

export const bulkReceiptSchema = z.object({
  dateOfReceipt: requiredText("Date of receipt"),
  drugName: oneOf("drug", END_OPTIONS),
  formulation: oneOf("formulation", FORMULATION_OPTIONS.map((f) => f.value)),
  strength: requiredText("Strength"),
  batchNumber: requiredText("Batch number"),
  supplierName: requiredText("Supplier name"),
  invoiceNumber: requiredText("Invoice number"),
  invoiceDate: requiredText("Invoice date"),
  expiryDate: requiredText("Expiry date"),
  openingStock: nonNegativeNumberString("Opening stock"),
  quantityReceived: positiveNumberString("Quantity received"),
  verifiedBy: requiredText("Verifier name"),
  storageConfirmed: oneOf("Yes or No", ["yes", "no"]),
});
export type BulkReceiptFormValues = z.infer<typeof bulkReceiptSchema>;