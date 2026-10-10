import type { ReportRow } from "@/types/report";

// Text starting with = + - @ can be run as a formula when the file is opened in Excel, so it gets a leading '.
const escapeCell = (value: string | number): string => {
  let text = String(value);
  if (typeof value === "string" && /^[=+\-@]/.test(text)) text = `'${text}`;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export const rowsToCsv = (rows: ReportRow[]): string => {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const lines = rows.map((row) => headers.map((h) => escapeCell(row[h] ?? "")).join(","));
  return [headers.map(escapeCell).join(","), ...lines].join("\r\n");
};

export const downloadCsv = (filename: string, rows: ReportRow[]): void => {
  // The BOM at the start makes Excel read the file as UTF-8.
  const blob = new Blob(["\uFEFF" + rowsToCsv(rows)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};