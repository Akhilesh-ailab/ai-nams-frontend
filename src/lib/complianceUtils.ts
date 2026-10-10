import { COMPLIANCE_CHECKS } from "@/constants/complianceOptions";
import type { ComplianceRecord, ScoreLevel } from "@/types/compliance";

// The CRF gives no formula for the score, so each of the 5 checks answered "Yes" earns an equal share of 100.
export const calculateScore = (yesCount: number): number =>
  Math.round((yesCount / COMPLIANCE_CHECKS.length) * 100);

export const getScoreLevel = (score: number): ScoreLevel => (score >= 90 ? "good" : score >= 60 ? "fair" : "poor");

// The most recent check recorded for each department / area. New records are added at the
// front of the list, so reversing first lets the newest record win when two share a date.
export const latestPerArea = (records: ComplianceRecord[]): ComplianceRecord[] => {
  const latest = new Map<string, ComplianceRecord>();
  [...records]
    .reverse()
    .sort((a, b) => a.date.localeCompare(b.date))
    .forEach((record) => latest.set(record.area, record));
  return Array.from(latest.values());
};

export const countFailedChecks = (records: ComplianceRecord[]): number =>
  records.reduce((total, record) => total + COMPLIANCE_CHECKS.filter((check) => !record[check.key]).length, 0);