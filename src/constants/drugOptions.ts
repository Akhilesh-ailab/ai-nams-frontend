import type { Formulation } from "@/types/procurement";

export const FORMULATION_OPTIONS: readonly { value: Formulation; label: string }[] = [
  { value: "Inj", label: "Injection" },
  { value: "Tab", label: "Tablet" },
  { value: "Syrup", label: "Syrup" },
  { value: "Patch", label: "Patch" },
  { value: "Other", label: "Other" },
];

export const formulationLabel = (value: Formulation): string =>
  FORMULATION_OPTIONS.find((o) => o.value === value)?.label ?? value;