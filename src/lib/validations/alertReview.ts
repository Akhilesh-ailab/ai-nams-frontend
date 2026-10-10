import { z } from "zod";
import { ACTION_OPTIONS, VALIDATION_OPTIONS } from "@/constants/aiOptions";
import { oneOf } from "./helpers";

export const alertReviewSchema = z.object({
  validation: oneOf("validation result", VALIDATION_OPTIONS),
  actionTaken: oneOf("action", ACTION_OPTIONS),
});
export type AlertReviewFormValues = z.infer<typeof alertReviewSchema>;