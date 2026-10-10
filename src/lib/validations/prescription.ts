import { z } from "zod";
import { END_OPTIONS } from "@/constants/clinicalOptions";
import { requiredText, positiveNumberString, oneOf } from "./helpers";

export const prescriptionSchema = z.object({
  date: requiredText("Date"),
  uhid: requiredText("UHID"),
  patientNameOrCode: requiredText("Patient name or code"),
  prescribingDoctor: requiredText("Prescribing doctor"),
  endName: oneOf("drug", END_OPTIONS),
  dose: requiredText("Dose"),
  frequency: requiredText("Frequency"),
  durationDays: positiveNumberString("Duration"),
  quantityPrescribed: positiveNumberString("Quantity prescribed"),
});
export type PrescriptionFormValues = z.infer<typeof prescriptionSchema>;