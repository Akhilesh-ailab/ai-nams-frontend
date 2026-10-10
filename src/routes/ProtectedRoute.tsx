import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import type { RootState } from "@/redux/store";
import type { UserRole } from "@/redux/slices/authSlice";
import { ROUTES } from "@/constants/routes";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({
  allowedRoles,
}: ProtectedRouteProps) {
  const location = useLocation();

  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        replace
        state={{ from: location }}
      />
    );
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return (
      <Navigate
        to={ROUTES.DASHBOARD}
        replace
      />
    );
  }

  return <Outlet />;
}

//protectedroutes.tsx