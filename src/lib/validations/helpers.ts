import { z } from "zod";

const isNumber = (value: string) => value.trim() !== "" && !Number.isNaN(Number(value));

export const requiredText = (label: string) => z.string().min(1, `${label} is required`);

export const nonNegativeNumberString = (label: string) =>
  z
    .string()
    .min(1, `${label} is required`)
    .refine((v) => isNumber(v) && Number(v) >= 0, { message: `${label} must be 0 or more` });

export const positiveNumberString = (label: string) =>
  z
    .string()
    .min(1, `${label} is required`)
    .refine((v) => isNumber(v) && Number(v) >= 1, { message: `${label} must be at least 1` });

export const oneOf = (label: string, options: readonly string[]) =>
  z
    .string()
    .min(1, `Please select ${label}`)
    .refine((v) => options.includes(v), { message: `Please select a valid ${label}` });