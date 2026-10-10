import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, MailCheck, ArrowRight, Loader2 } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";
import AuthField from "@/components/forms/AuthField";
import { Button } from "@/components/ui/button";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/lib/validations/auth";
import { ROUTES } from "@/constants/routes";
import { AUTH_BUTTON } from "@/constants/authStyles";

export default function ForgotPassword() {
  const [requestedFor, setRequestedFor] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    await new Promise((r) => setTimeout(r, 500)); // TODO: replace with real API call
    setRequestedFor(data.email);
  };

  return (
    <AuthLayout
      title="Forgot password"
      subtitle="Enter your email and we'll send you a reset link"
      footer={
        <>
          Remembered it?{" "}
          <Link to={ROUTES.LOGIN} className="font-semibold text-primary hover:underline">Back to sign in</Link>
        </>
      }
    >
      {requestedFor ? (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
            <MailCheck className="h-6 w-6 text-success" />
          </div>
          <p className="font-medium">Reset requested for {requestedFor}</p>
          <p className="text-sm text-muted-foreground">
            Demo version: no email is sent yet. Password reset by email will work once the backend is connected.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <AuthField id="email" type="email" label="Email" icon={Mail} placeholder="you@hospital.com" error={errors.email?.message} {...register("email")} />
          <Button type="submit" className={AUTH_BUTTON} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Send Reset Link <ArrowRight className="h-4 w-4" /></>}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}