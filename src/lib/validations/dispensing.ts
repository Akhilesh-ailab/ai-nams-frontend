import { z } from "zod";
import { DEPARTMENT_OPTIONS, END_OPTIONS } from "@/constants/clinicalOptions";
import { requiredText, positiveNumberString, nonNegativeNumberString, oneOf } from "./helpers";

export const dispensingSchema = z
  .object({
    date: requiredText("Date"),
    patientNameOrCode: requiredText("Patient name or code"),
    uhid: requiredText("UHID"),
    diagnosis: requiredText("Diagnosis"),
    wardUnit: oneOf("ward / unit", DEPARTMENT_OPTIONS),
    prescribingDoctor: requiredText("Prescribing doctor"),
    endName: oneOf("drug", END_OPTIONS),
    dose: requiredText("Dose"),
    frequency: requiredText("Frequency"),
    departmentStockBefore: nonNegativeNumberString("Department stock before issue"),
    quantityIssued: positiveNumberString("Quantity issued"),
    patientAttenderSignature: requiredText("Patient / attender signature"),
    administeringNurseSignature: requiredText("Administering nurse signature"),
  })
  .refine((d) => Number(d.quantityIssued) <= Number(d.departmentStockBefore), {
    message: "Quantity issued cannot be more than the department stock",
    path: ["quantityIssued"],
  });
export type DispensingFormValues = z.infer<typeof dispensingSchema>;