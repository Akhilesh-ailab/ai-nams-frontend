import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import { ROUTES } from "@/constants/routes";
import { ALERT_ROLES, CLINICAL_ROLES, COMPLIANCE_ROLES, FORECAST_ROLES, PHARMACY_ROLES } from "@/constants/permissions";
import type { RootState } from "@/redux/store";

const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"));
const DrugMaster = lazy(() => import("@/pages/pharmacy/DrugMaster"));
const Procurement = lazy(() => import("@/pages/pharmacy/Procurement"));
const DepartmentIssue = lazy(() => import("@/pages/pharmacy/DepartmentIssue"));
const DepartmentStockRegister = lazy(() => import("@/pages/pharmacy/DepartmentStockRegister"));
const Patients = lazy(() => import("@/pages/clinical/Patients"));
const Prescriptions = lazy(() => import("@/pages/clinical/Prescriptions"));
const Dispensing = lazy(() => import("@/pages/clinical/Dispensing"));
const Alerts = lazy(() => import("@/pages/ai/Alerts"));
const Forecasting = lazy(() => import("@/pages/ai/Forecasting"));
const Analytics = lazy(() => import("@/pages/ai/Analytics"));
const Compliance = lazy(() => import("@/pages/compliance/Compliance"));
const Reports = lazy(() => import("@/pages/reports/Reports"));

function RootRedirect() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return <Navigate to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN} replace />;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <Routes>
        <Route path="/" element={<RootRedirect />} />

        <Route element={<PublicRoute />}>
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
        </Route>

        {/* Any logged-in user */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={PHARMACY_ROLES} />}>
          <Route element={<AppLayout />}>
            <Route path={ROUTES.PHARMACY_DRUGS} element={<DrugMaster />} />
            <Route path={ROUTES.PHARMACY_RECEIPT} element={<Procurement />} />
            <Route path={ROUTES.PHARMACY_ISSUES} element={<DepartmentIssue />} />
            <Route path={ROUTES.PHARMACY_INVENTORY} element={<DepartmentStockRegister />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={CLINICAL_ROLES} />}>
          <Route element={<AppLayout />}>
            <Route path={ROUTES.CLINICAL_PATIENTS} element={<Patients />} />
            <Route path={ROUTES.CLINICAL_PRESCRIPTIONS} element={<Prescriptions />} />
            <Route path={ROUTES.CLINICAL_DISPENSING} element={<Dispensing />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={ALERT_ROLES} />}>
          <Route element={<AppLayout />}>
            <Route path={ROUTES.AI_ALERTS} element={<Alerts />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={FORECAST_ROLES} />}>
          <Route element={<AppLayout />}>
            <Route path={ROUTES.AI_FORECASTING} element={<Forecasting />} />
            <Route path={ROUTES.AI_ANALYTICS} element={<Analytics />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={COMPLIANCE_ROLES} />}>
          <Route element={<AppLayout />}>
            <Route path={ROUTES.COMPLIANCE} element={<Compliance />} />
            <Route path={ROUTES.REPORTS} element={<Reports />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}