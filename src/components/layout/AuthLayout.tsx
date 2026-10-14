import { memo, type ReactNode } from "react";
import { Sparkles, Lock, Activity, Pill, Microscope, Dna, Shield, Building2 } from "lucide-react";
import Logo from "@/components/common/Logo";
import { APP_NAME } from "@/constants/app";
import aiimsLogo from "@/assets/aiims-logo.png";

const BrandPanel = memo(function BrandPanel() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden border-r border-slate-700/50 bg-gradient-to-br from-slate-900 via-cyan-950 to-teal-900 p-12 lg:flex lg:w-7/12">
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-15"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
      />
      <div className="pointer-events-none absolute -left-20 top-1/4 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-96 w-96 rounded-full bg-teal-400/15 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-1/3 h-1 animate-pulse bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

      <div className="pointer-events-none absolute inset-0 z-0">
        <Pill size={80} className="absolute right-32 top-24 rotate-45 animate-bounce text-cyan-200/15" />
        <Microscope size={96} className="absolute bottom-1/3 left-16 animate-pulse text-teal-200/15" />
        <Dna size={110} className="absolute bottom-28 right-24 text-sky-200/10" />
      </div>

      <div className="relative z-10">
        <Logo tone="light" size="lg" showTagline uppercaseTagline />
      </div>

      <div className="relative z-10 my-auto max-w-lg space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-300 backdrop-blur-md">
          <Sparkles size={14} />
          <span>Smart Narcotics Compliance & Stock Tracking</span>
        </div>

        <h1 className="text-4xl font-black leading-tight tracking-tight text-white xl:text-5xl">
          Advanced Analytics for Essential Narcotic Drugs
        </h1>
        <p className="text-sm leading-relaxed text-slate-300 xl:text-base">
          Real-time automated logging, schedule compliance, prescription verification, and AI-driven inventory forecasting for licensed medical institutions.
        </p>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur-md">
            <div className="rounded-lg bg-cyan-500/20 p-2 text-cyan-300"><Lock size={18} /></div>
            <div>
              <p className="text-xs font-bold text-white">NDPS Compliant</p>
              <p className="text-[11px] text-slate-300">Double-Lock Storage Control</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur-md">
            <div className="rounded-lg bg-teal-500/20 p-2 text-teal-300"><Activity size={18} /></div>
            <div>
              <p className="text-xs font-bold text-white">Live Discrepancy Alerts</p>
              <p className="text-[11px] text-slate-300">24/7 Audit Logging</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-400">
        <div className="flex items-center gap-2 font-medium text-slate-300">
          <Building2 size={14} className="text-cyan-400" />
          <span>Institutional Access Only</span>
        </div>
        <span>System V1.0 • Encrypted (AES-256)</span>
      </div>
    </div>
  );
});

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <BrandPanel />

      <div
        className="relative flex w-full items-center justify-center overflow-hidden p-6 sm:p-12 lg:w-5/12"
        style={{ backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)", backgroundSize: "22px 22px" }}
      >
        <Shield size={340} strokeWidth={1} className="pointer-events-none absolute -right-16 -top-16 text-slate-300/50" />
        <Lock size={280} strokeWidth={1} className="pointer-events-none absolute -bottom-20 -left-16 text-slate-300/50" />

        <div className="relative z-10 w-full max-w-sm space-y-6">
          {/* The brand panel is hidden on phones and tablets, so the logo is shown here instead */}
          <Logo size="md" showTagline className="lg:hidden" />

          <div className="space-y-6 rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-200/60 sm:p-10">
            <div className="flex items-center gap-3 pb-1">
              <img src={aiimsLogo} alt="AIIMS Raipur" className="h-11 w-11 object-contain" />
              <div>
                <p className="text-sm font-bold text-slate-900">{APP_NAME}</p>
                <p className="text-[11px] text-slate-500">AIIMS Raipur</p>
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
              <p className="text-sm text-slate-500">{subtitle}</p>
            </div>

            {children}

            {footer && <div className="border-t border-slate-100 pt-4 text-center text-sm text-slate-500">{footer}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}