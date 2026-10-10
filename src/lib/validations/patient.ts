import { z } from "zod";
import { GENDER_OPTIONS, DEPARTMENT_OPTIONS } from "@/constants/clinicalOptions";
import { requiredText, nonNegativeNumberString, oneOf } from "./helpers";

export const patientSchema = z.object({
  registeredOn: requiredText("Registration date"),
  uhid: requiredText("UHID"),
  patientNameOrCode: requiredText("Patient name or code"),
  age: nonNegativeNumberString("Age"),
  gender: oneOf("gender", GENDER_OPTIONS),
  wardUnit: oneOf("ward / unit", DEPARTMENT_OPTIONS),
  diagnosis: requiredText("Diagnosis"),
});
export type PatientFormValues = z.infer<typeof patientSchema>;