export const toNumber = (value?: string): number | null =>
  value && value.trim() !== "" && !Number.isNaN(Number(value)) ? Number(value) : null;

export const percentChange = (current: number, baseline: number): number | null =>
  baseline === 0 ? null : Math.round(((current - baseline) / baseline) * 100);