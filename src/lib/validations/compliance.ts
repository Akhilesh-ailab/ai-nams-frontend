import { z } from "zod";
import { COMPLIANCE_AREA_OPTIONS } from "@/constants/complianceOptions";
import { requiredText, oneOf } from "./helpers";

const yesNoAnswer = oneOf("Yes or No", ["yes", "no"]);

export const complianceSchema = z.object({
  date: requiredText("Date"),
  area: oneOf("department / area", COMPLIANCE_AREA_OPTIONS),
  dailyClosingBalance: yesNoAnswer,
  doubleLockStorage: yesNoAnswer,
  dualSignature: yesNoAnswer,
  monthlyReconciliation: yesNoAnswer,
  inspectionReady: yesNoAnswer,
});
export type ComplianceFormValues = z.infer<typeof complianceSchema>;