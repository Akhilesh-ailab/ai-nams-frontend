import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { User, Building2, Mail, UserRound, Lock, Eye, EyeOff, ArrowRight, Loader2, ChevronDown } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";
import AuthField from "@/components/forms/AuthField";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { registerSchema, type RegisterFormValues } from "@/lib/validations/auth";
import { registerUser } from "@/redux/slices/authSlice";
import type { RootState, AppDispatch } from "@/redux/store";
import type { UserRole } from "@/types/auth";
import { ROUTES } from "@/constants/routes";
import { ROLE_OPTIONS } from "@/constants/roles";
import { AUTH_BUTTON, AUTH_ERROR, AUTH_ICON, AUTH_INPUT, AUTH_LABEL, AUTH_TOGGLE_ICON } from "@/constants/authStyles";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.auth.users);

  const [showPassword, setShowPassword] = useState(false);
  const [registerError, setRegisterError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", hospitalName: "", email: "", role: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setRegisterError("");
    await new Promise((resolve) => setTimeout(resolve, 500));

    const emailExists = users.some((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (emailExists) {
      setRegisterError("An account with this email already exists.");
      return;
    }

    dispatch(
      registerUser({
        id: crypto.randomUUID(),
        fullName: data.fullName,
        hospitalName: data.hospitalName,
        email: data.email,
        password: data.password,
        role: data.role as UserRole,
      })
    );
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const passwordToggle = (
    <button type="button" onClick={() => setShowPassword((v) => !v)} tabIndex={-1} className={AUTH_TOGGLE_ICON}>
      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Register your hospital to start using A.I.-NAMS"
      footer={
        <>
          Already have an account?{" "}
          <Link to={ROUTES.LOGIN} className="font-semibold text-primary hover:underline">Sign in</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <AuthField id="fullName" label="Full Name" icon={User} placeholder="Dr. Jane Doe" error={errors.fullName?.message} {...register("fullName")} />
        <AuthField id="hospitalName" label="Hospital / Organization" icon={Building2} placeholder="AIIMS Raipur" error={errors.hospitalName?.message} {...register("hospitalName")} />
        <AuthField id="email" type="email" label="Email" icon={Mail} placeholder="you@hospital.com" error={errors.email?.message} {...register("email")} />

        <div className="space-y-1.5">
          <Label htmlFor="role" className={AUTH_LABEL}>Role <span className="text-primary">*</span></Label>
          <div className="relative">
            <UserRound className={AUTH_ICON} />
            <select id="role" className={`${AUTH_INPUT} h-11 appearance-none border pr-10 text-sm`} {...register("role")}>
              <option value="" disabled>Select your role</option>
              {ROLE_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
          {errors.role && <p className={AUTH_ERROR}>{errors.role.message}</p>}
        </div>

        <AuthField
          id="password"
          type={showPassword ? "text" : "password"}
          label="Password"
          icon={Lock}
          placeholder="••••••••••••"
          error={errors.password?.message}
          trailing={passwordToggle}
          {...register("password")}
        />
        <AuthField
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          label="Confirm Password"
          icon={Lock}
          placeholder="••••••••••••"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        {registerError && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2">
            <p className="text-sm text-destructive">{registerError}</p>
          </div>
        )}

        <Button type="submit" className={AUTH_BUTTON} disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Create Account <ArrowRight className="h-4 w-4" /></>}
        </Button>
      </form>
    </AuthLayout>
  );
}