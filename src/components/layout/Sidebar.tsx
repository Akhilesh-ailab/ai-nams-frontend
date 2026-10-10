import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  LayoutDashboard, Pill, Receipt, Package, ArrowLeftRight,
  Users, FileText, Syringe, AlertTriangle, TrendingUp,
  BarChart3, ShieldCheck, FileBarChart, Lock, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { APP_NAME, APP_TAGLINE } from "@/constants/app";
import { ALERT_ROLES, CLINICAL_ROLES, COMPLIANCE_ROLES, FORECAST_ROLES, PHARMACY_ROLES } from "@/constants/permissions";
import type { RootState } from "@/redux/store";
import type { MenuGroup } from "@/types/navigation";

const menuGroups: MenuGroup[] = [
  { section: "", items: [{ title: "Dashboard", path: ROUTES.DASHBOARD, icon: LayoutDashboard }] },
  {
    section: "Pharmacy",
    items: [
      { title: "Drugs", path: ROUTES.PHARMACY_DRUGS, icon: Pill, allowedRoles: PHARMACY_ROLES },
      { title: "Receipt", path: ROUTES.PHARMACY_RECEIPT, icon: Receipt, allowedRoles: PHARMACY_ROLES },
      { title: "Inventory", path: ROUTES.PHARMACY_INVENTORY, icon: Package, allowedRoles: PHARMACY_ROLES },
      { title: "Issues", path: ROUTES.PHARMACY_ISSUES, icon: ArrowLeftRight, allowedRoles: PHARMACY_ROLES },
    ],
  },
  {
    section: "Clinical",
    items: [
      { title: "Patients", path: ROUTES.CLINICAL_PATIENTS, icon: Users, allowedRoles: CLINICAL_ROLES },
      { title: "Prescriptions", path: ROUTES.CLINICAL_PRESCRIPTIONS, icon: FileText, allowedRoles: CLINICAL_ROLES },
      { title: "Dispensing", path: ROUTES.CLINICAL_DISPENSING, icon: Syringe, allowedRoles: CLINICAL_ROLES },
    ],
  },
  {
    section: "AI Analytics",
    items: [
      { title: "Alerts", path: ROUTES.AI_ALERTS, icon: AlertTriangle, badge: "12", allowedRoles: ALERT_ROLES },
      { title: "Forecasting", path: ROUTES.AI_FORECASTING, icon: TrendingUp, allowedRoles: FORECAST_ROLES },
      { title: "Analytics", path: ROUTES.AI_ANALYTICS, icon: BarChart3, allowedRoles: FORECAST_ROLES },
    ],
  },
  {
    section: "",
    items: [
      { title: "Compliance", path: ROUTES.COMPLIANCE, icon: ShieldCheck, allowedRoles: COMPLIANCE_ROLES },
      { title: "Reports", path: ROUTES.REPORTS, icon: FileBarChart, allowedRoles: COMPLIANCE_ROLES },
    ],
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const role = user?.role;

  const visibleGroups = menuGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.allowedRoles || (role && item.allowedRoles.includes(role))),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} />}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen w-[260px] flex-col justify-between overflow-y-auto border-r border-border bg-card transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        <div>
          <div className="flex items-center justify-between gap-3 px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-cyan-600 to-teal-800 p-2 text-white shadow-md shadow-cyan-600/20">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h1 className="text-base font-black leading-none tracking-tight">{APP_NAME}</h1>
                <p className="mt-1 text-[10px] font-medium leading-tight text-muted-foreground">{APP_TAGLINE}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground lg:hidden">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="border-t border-border" />
          <nav className="py-2">
            {visibleGroups.map((group, i) => (
              <div key={i} className="mb-1">
                {group.section && (
                  <p className="px-5 pb-1 pt-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {group.section}
                  </p>
                )}
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        "mx-3 my-0.5 flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors",
                        isActive ? "border border-primary/15 bg-secondary text-primary" : "text-foreground/70 hover:bg-muted"
                      )
                    }
                  >
                    <span className="flex items-center gap-2.5">
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </span>
                    {item.badge && (
                      <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold text-destructive">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>
        </div>

        <div className="border-t border-border p-4">
          <div className="space-y-2 rounded-2xl border border-teal-900/40 bg-gradient-to-r from-slate-900 to-teal-950 p-3 text-xs text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-300">
                <Lock size={12} />
                <span>Double-Lock Storage Active</span>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </div>
            <p className="text-[10px] text-slate-300">AIIMS Raipur — Central Pharmacy</p>
          </div>
        </div>
      </aside>
    </>
  );
}