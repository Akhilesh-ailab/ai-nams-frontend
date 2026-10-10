import { z } from "zod";
import { FORMULATION_OPTIONS } from "@/constants/drugOptions";
import { requiredText, oneOf } from "./helpers";

export const drugSchema = z.object({
  name: requiredText("Drug name"),
  formulation: oneOf("formulation", FORMULATION_OPTIONS.map((f) => f.value)),
  strength: requiredText("Strength"),
});
export type DrugFormValues = z.infer<typeof drugSchema>;