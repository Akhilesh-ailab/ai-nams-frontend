import { z } from "zod";
import { ROLE_OPTIONS } from "@/constants/roles";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    hospitalName: z.string().min(1, "Hospital / organization name is required"),
    email: z.string().min(1, "Email is required").email("Enter a valid email address"),
    role: z
      .string()
      .min(1, "Please select a role")
      .refine((value) => ROLE_OPTIONS.some((r) => r.value === value), {
        message: "Please select a valid role",
      }),
    password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type RegisterFormValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
});
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;