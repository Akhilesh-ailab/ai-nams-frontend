import type { RiskLevel } from "@/types/aiAlert";

export const getRiskLevel = (score: number): RiskLevel => (score >= 0.8 ? "High" : score >= 0.5 ? "Medium" : "Low");

export const formatDateTime = (iso: string): string =>
  new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

// CRF Section 8: Alert Response Time = time from alert generation to pharmacologist review
export const formatResponseTime = (generatedAt: string, reviewedAt?: string): string => {
  if (!reviewedAt) return "—";
  const minutes = Math.max(0, Math.round((Date.parse(reviewedAt) - Date.parse(generatedAt)) / 60000));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ${minutes % 60} min`;
  return `${Math.floor(hours / 24)} d ${hours % 24} h`;
};