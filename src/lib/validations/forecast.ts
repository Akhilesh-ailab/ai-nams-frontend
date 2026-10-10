import { z } from "zod";
import { END_OPTIONS } from "@/constants/clinicalOptions";
import { SEASONAL_FACTOR_OPTIONS } from "@/constants/aiOptions";
import { requiredText, nonNegativeNumberString, oneOf } from "./helpers";

export const forecastSchema = z.object({
  month: requiredText("Month").refine((v) => /^\d{4}-(0[1-9]|1[0-2])$/.test(v), { message: "Select a valid month" }),
  endName: oneOf("drug", END_OPTIONS),
  openingStock: nonNegativeNumberString("Opening stock"),
  quantityReceived: nonNegativeNumberString("Quantity received"),
  quantityIssued: nonNegativeNumberString("Quantity issued"),
  quantityDispensed: nonNegativeNumberString("Quantity dispensed"),
  closingStock: nonNegativeNumberString("Closing stock"),
  stockOutDays: nonNegativeNumberString("Stock-out days").refine((v) => Number(v) <= 31, {
    message: "Stock-out days cannot be more than 31",
  }),
  emergencyIndents: nonNegativeNumberString("Emergency indents"),
  oncologyAdmissions: nonNegativeNumberString("Oncology admissions"),
  icuAdmissions: nonNegativeNumberString("ICU admissions"),
  surgicalCases: nonNegativeNumberString("Surgical cases"),
  palliativePatients: nonNegativeNumberString("Palliative care patients"),
  traumaCases: nonNegativeNumberString("Trauma cases"),
  averageDosePerPatientMg: nonNegativeNumberString("Average dose"),
  seasonalFactor: oneOf("seasonal factor", SEASONAL_FACTOR_OPTIONS),
});
export type ForecastFormValues = z.infer<typeof forecastSchema>;