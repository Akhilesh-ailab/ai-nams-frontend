import { memo, type ReactNode } from "react";
import {
  ShieldCheck, Sparkles, Lock, Activity, Pill, Microscope, Dna,
  Shield, Building2,
} from "lucide-react";

import { APP_NAME, APP_TAGLINE } from "@/constants/app";
import aiimsLogo from "@/assets/aiims-logo.png";

const BrandPanel = memo(function BrandPanel() {
  return (
    <div className="hidden lg:flex lg:w-7/12 relative flex-col justify-between overflow-hidden p-12 bg-gradient-to-br from-slate-900 via-cyan-950 to-teal-900 border-r border-slate-700/50">
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-15"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
      />
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-x-0 h-1 top-1/3 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent animate-pulse pointer-events-none" />

      <div className="absolute inset-0 pointer-events-none z-0">
        <Pill size={80} className="absolute top-24 right-32 text-cyan-200/15 rotate-45 animate-bounce" />
        <Microscope size={96} className="absolute bottom-1/3 left-16 text-teal-200/15 animate-pulse" />
        <Dna size={110} className="absolute bottom-28 right-24 text-sky-200/10" />
      </div>

      <div className="relative z-10 flex items-center gap-3">
        <div className="relative p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-cyan-300">
          <ShieldCheck size={28} className="animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400" />
          </span>
        </div>
        <div>
          <span className="text-xl font-black tracking-wider text-white">
            A.I.<span className="text-cyan-400">-NAMS</span>
          </span>
<p className="text-[10px] text-cyan-200/80 font-medium tracking-widest uppercase">{APP_TAGLINE}</p>        </div>
      </div>

      <div className="relative z-10 my-auto max-w-lg space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold backdrop-blur-md">
          <Sparkles size={14} />
          <span>Smart Narcotics Compliance & Stock Tracking</span>
        </div>

        <h1 className="text-4xl xl:text-5xl font-black text-white tracking-tight leading-tight">Advanced Analytics for Essential Narcotic Drugs</h1>
        <p className="text-slate-300 text-sm xl:text-base leading-relaxed">Real-time automated logging, schedule compliance, prescription verification, and AI-driven inventory forecasting for licensed medical institutions.</p>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-300"><Lock size={18} /></div>
            <div>
              <p className="text-xs font-bold text-white">NDPS Compliant</p>
              <p className="text-[11px] text-slate-300">Double-Lock Storage Control</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-3">
            <div className="p-2 bg-teal-500/20 rounded-lg text-teal-300"><Activity size={18} /></div>
            <div>
              <p className="text-xs font-bold text-white">Live Discrepancy Alerts</p>
              <p className="text-[11px] text-slate-300">24/7 Audit Logging</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-400">
        <div className="flex items-center gap-2 text-slate-300 font-medium">
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
    <div className="min-h-screen flex bg-slate-50">
      <BrandPanel />

      <div
        className="w-full lg:w-5/12 relative flex items-center justify-center p-6 sm:p-12 overflow-hidden"
        style={{ backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)", backgroundSize: "22px 22px" }}
      >
        <Shield size={340} strokeWidth={1} className="absolute -top-16 -right-16 text-slate-300/50 pointer-events-none" />
        <Lock size={280} strokeWidth={1} className="absolute -bottom-20 -left-16 text-slate-300/50 pointer-events-none" />

        <div className="w-full max-w-sm relative z-10 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/60 space-y-6">
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

          {footer && <div className="text-center text-sm text-slate-500 pt-4 border-t border-slate-100">{footer}</div>}
        </div>
      </div>
    </div>
  );
}