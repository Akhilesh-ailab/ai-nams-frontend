import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
} from "lucide-react";

import AuthLayout from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  loginSchema,
  type LoginFormValues,
} from "@/lib/validations/auth";

import {
  login,
} from "@/redux/slices/authSlice";

import type {
  RootState,
  AppDispatch,
} from "@/redux/store";

import { ROUTES } from "@/constants/routes";

import {
  AUTH_INPUT,
  AUTH_INPUT_WITH_TOGGLE,
  AUTH_ICON,
  AUTH_TOGGLE_ICON,
  AUTH_LABEL,
  AUTH_BUTTON,
  AUTH_ERROR,
} from "@/constants/authStyles";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch<AppDispatch>();

  const users = useSelector(
    (state: RootState) => state.auth.users
  );

  const [showPassword, setShowPassword] =
    useState(false);

  const [loginError, setLoginError] =
    useState("");

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (
    data: LoginFormValues
  ) => {
    setLoginError("");

    await new Promise((resolve) =>
      setTimeout(resolve, 500)
    );

    const existingUser = users.find(
      (user) =>
        user.email.toLowerCase() ===
          data.email.toLowerCase() &&
        user.password === data.password
    );

    if (!existingUser) {
      setLoginError(
        "Invalid email or password."
      );
      return;
    }

    const { password, ...user } = existingUser;

    dispatch(
      login({
        user,
        token: `demo-token-${existingUser.id}`,
      })
    );

    const from =
      location.state?.from?.pathname ||
      ROUTES.DASHBOARD;

    navigate(from, {
      replace: true,
    });
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to access your A.I.-NAMS dashboard"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            to={ROUTES.REGISTER}
            className="font-semibold text-primary hover:underline"
          >
            Register
          </Link>
        </>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >

        {/* Email */}
        <div className="space-y-1.5">
          <Label
            htmlFor="email"
            className={AUTH_LABEL}
          >
            Email{" "}
            <span className="text-primary">
              *
            </span>
          </Label>

          <div className="relative">
            <Mail className={AUTH_ICON} />

            <Input
              id="email"
              type="email"
              placeholder="john@hospital.com"
              className={AUTH_INPUT}
              {...register("email")}
            />
          </div>

          {errors.email && (
            <p className={AUTH_ERROR}>
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className={AUTH_LABEL}
            >
              Password{" "}
              <span className="text-primary">
                *
              </span>
            </Label>

            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-sm font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <Lock className={AUTH_ICON} />

            <Input
              id="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="••••••••••••"
              className={
                AUTH_INPUT_WITH_TOGGLE
              }
              {...register("password")}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (value) => !value
                )
              }
              tabIndex={-1}
              className={
                AUTH_TOGGLE_ICON
              }
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {errors.password && (
            <p className={AUTH_ERROR}>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Login error */}
        {loginError && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2">
            <p className="text-sm text-destructive">
              {loginError}
            </p>
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          className={AUTH_BUTTON}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Sign In
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>

      </form>
    </AuthLayout>
  );
}

//login.tsx