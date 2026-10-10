export type ComplianceCheckKey =
  | "dailyClosingBalance"
  | "doubleLockStorage"
  | "dualSignature"
  | "monthlyReconciliation"
  | "inspectionReady";

export type ComplianceChecks = Record<ComplianceCheckKey, boolean>;

export interface ComplianceRecord extends ComplianceChecks {
  id: string;
  date: string;
  area: string;
  score: number;
  checkedBy: string;
}

export type ScoreLevel = "good" | "fair" | "poor";