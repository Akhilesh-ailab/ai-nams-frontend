import type { Formulation } from "@/types/procurement";

export interface DrugRecord {
  id: string;
  name: string;
  formulation: Formulation;
  strength: string;
}