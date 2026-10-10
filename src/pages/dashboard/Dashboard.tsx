import { useState } from "react";
import { AlertTriangle, TrendingUp, ShieldCheck, PlusCircle, Pill, Zap, Download, CheckCircle2 } from "lucide-react";
import StatCard from "@/components/common/StatCard";
import StockBreakdownCard from "@/components/common/StockBreakdownCard";
import QuickActionCard from "@/components/common/QuickActionCard";
import ConsumptionChart from "./ConsumptionChart";
import AlertsFeed from "./AlertsFeed";
import InventoryTable from "./InventoryTable";
import ReceiptModal from "./ReceiptModal";
import IssueModal from "./IssueModal";

const stats = [
  { title: "AI Alerts Today", value: "12", subtitle: "2 critical discrepancies flagged", icon: AlertTriangle, iconBg: "#FEECEB", iconColor: "#F04438", trend: { value: "3.1%", direction: "down" as const } },
  { title: "Drugs at Risk", value: "5", subtitle: "Near expiry or low stock threshold", icon: TrendingUp, iconBg: "#FFF4E5", iconColor: "#F79009", badge: "High Risk" },
  { title: "Compliance Score", value: "94%", subtitle: "NDPS Audit Preparedness", icon: ShieldCheck, iconBg: "#ECFEFF", iconColor: "#0D9488", trend: { value: "2.0%", direction: "up" as const } },
];

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState("7D");
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const triggerToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Dashboard</h1>
          <p className="text-xs text-muted-foreground font-medium mt-0.5">A.I.-NAMS Narcotics Management Overview</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-card border border-border rounded-xl p-1 flex items-center text-xs">
            {["24H", "7D", "30D", "YTD"].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${timeframe === tf ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {tf}
              </button>
            ))}
          </div>

          <button
            onClick={() => triggerToast("Generating NDPS Schedule Compliance Report...")}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-card border border-border hover:bg-muted text-xs font-bold rounded-xl transition-all"
          >
            <Download size={14} className="text-primary" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StockBreakdownCard />
        {stats.map((s) => <StatCard key={s.title} {...s} />)}
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-bold tracking-wide">Quick Action</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <QuickActionCard
            title="New Receipt"
            subtitle="Log a bulk drug receipt"
            icon={PlusCircle}
            cardClassName="bg-gradient-to-r from-indigo-50/80 to-blue-50/60 border-indigo-100 hover:border-indigo-300"
            iconClassName="text-indigo-600 border-indigo-200"
            arrowClassName="text-indigo-600 border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white"
            onClick={() => setShowReceiptModal(true)}
          />
          <QuickActionCard
            title="Department Issue"
            subtitle="Issue stock to a department"
            icon={Pill}
            cardClassName="bg-gradient-to-r from-emerald-50/80 to-teal-50/60 border-emerald-100 hover:border-emerald-300"
            iconClassName="text-emerald-600 border-emerald-200"
            arrowClassName="text-emerald-600 border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white"
            onClick={() => setShowIssueModal(true)}
          />
          <QuickActionCard
            title="Emergency Dispense"
            subtitle="Fast-track OT / ICU override"
            icon={Zap}
            cardClassName="bg-gradient-to-r from-purple-50/80 to-cyan-50/60 border-purple-100 hover:border-purple-300"
            iconClassName="text-purple-600 border-purple-200"
            arrowClassName="text-purple-600 border-purple-200 group-hover:bg-purple-600 group-hover:text-white"
            onClick={() => triggerToast("Emergency Vault Override Mode Initiated")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ConsumptionChart />
        <AlertsFeed />
      </div>

      <InventoryTable />

      <ReceiptModal open={showReceiptModal} onClose={() => setShowReceiptModal(false)} onSuccess={triggerToast} />
      <IssueModal open={showIssueModal} onClose={() => setShowIssueModal(false)} onSuccess={triggerToast} />

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs border border-teal-500/40">
          <CheckCircle2 size={18} className="text-success shrink-0" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}


//StockBreakdownCard code

// import { useState } from "react";
// import { AlertTriangle, TrendingUp, ShieldCheck, PlusCircle, Pill, Zap, Download, CheckCircle2 } from "lucide-react";
// import StatCard from "@/components/common/StatCard";
// import StockBreakdownCard from "@/components/common/StockBreakdownCard";
// import QuickActionCard from "@/components/common/QuickActionCard";
// import ConsumptionChart from "./ConsumptionChart";
// import AlertsFeed from "./AlertsFeed";
// import InventoryTable from "./InventoryTable";
// import ReceiptModal from "./ReceiptModal";
// import IssueModal from "./IssueModal";

// const stats = [
//   { title: "AI Alerts Today", value: "12", subtitle: "2 critical discrepancies flagged", icon: AlertTriangle, iconBg: "#FEECEB", iconColor: "#F04438", trend: { value: "3.1%", direction: "down" as const } },
//   { title: "Drugs at Risk", value: "5", subtitle: "Near expiry or low vault threshold", icon: TrendingUp, iconBg: "#FFF4E5", iconColor: "#F79009", badge: "High Risk" },
//   { title: "Compliance Score", value: "94%", subtitle: "DEA & NDPS Audit Preparedness", icon: ShieldCheck, iconBg: "#ECFEFF", iconColor: "#0D9488", trend: { value: "2.0%", direction: "up" as const } },
// ];

// export default function Dashboard() {
//   const [timeframe, setTimeframe] = useState("7D");
//   const [showReceiptModal, setShowReceiptModal] = useState(false);
//   const [showIssueModal, setShowIssueModal] = useState(false);
//   const [toast, setToast] = useState<string | null>(null);

//   const triggerToast = (message: string) => {
//     setToast(message);
//     setTimeout(() => setToast(null), 3500);
//   };

//   return (
//     <div className="space-y-8">
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-black tracking-tight">Dashboard</h1>
//           <p className="text-xs text-muted-foreground font-medium mt-0.5">A.I.-NAMS Narcotics Management Overview</p>
//         </div>

//         <div className="flex items-center gap-2">
//           <div className="bg-card border border-border rounded-xl p-1 flex items-center text-xs">
//             {["24H", "7D", "30D", "YTD"].map((tf) => (
//               <button
//                 key={tf}
//                 onClick={() => setTimeframe(tf)}
//                 className={`px-3 py-1 rounded-lg font-semibold transition-all ${timeframe === tf ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
//               >
//                 {tf}
//               </button>
//             ))}
//           </div>

//           <button
//             onClick={() => triggerToast("Generating NDPS Schedule Compliance Report...")}
//             className="flex items-center gap-1.5 px-3.5 py-2 bg-card border border-border hover:bg-muted text-xs font-bold rounded-xl transition-all"
//           >
//             <Download size={14} className="text-primary" />
//             <span>Export</span>
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//         <StockBreakdownCard />
//         {stats.map((s) => <StatCard key={s.title} {...s} />)}
//       </div>

//       <div className="space-y-3">
//         <h2 className="text-sm font-bold tracking-wide">Quick Action</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//           <QuickActionCard
//             title="New Receipt"
//             subtitle="Log a bulk drug receipt"
//             icon={PlusCircle}
//             cardClassName="bg-gradient-to-r from-indigo-50/80 to-blue-50/60 border-indigo-100 hover:border-indigo-300"
//             iconClassName="text-indigo-600 border-indigo-200"
//             arrowClassName="text-indigo-600 border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white"
//             onClick={() => setShowReceiptModal(true)}
//           />
//           <QuickActionCard
//             title="Department Issue"
//             subtitle="Issue stock to a department"
//             icon={Pill}
//             cardClassName="bg-gradient-to-r from-emerald-50/80 to-teal-50/60 border-emerald-100 hover:border-emerald-300"
//             iconClassName="text-emerald-600 border-emerald-200"
//             arrowClassName="text-emerald-600 border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white"
//             onClick={() => setShowIssueModal(true)}
//           />
//           <QuickActionCard
//             title="Emergency Dispense"
//             subtitle="Fast-track OT / ICU override"
//             icon={Zap}
//             cardClassName="bg-gradient-to-r from-purple-50/80 to-cyan-50/60 border-purple-100 hover:border-purple-300"
//             iconClassName="text-purple-600 border-purple-200"
//             arrowClassName="text-purple-600 border-purple-200 group-hover:bg-purple-600 group-hover:text-white"
//             onClick={() => triggerToast("Emergency Vault Override Mode Initiated")}
//           />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <ConsumptionChart />
//         <AlertsFeed />
//       </div>

//       <InventoryTable />

//       <ReceiptModal open={showReceiptModal} onClose={() => setShowReceiptModal(false)} onSuccess={triggerToast} />
//       <IssueModal open={showIssueModal} onClose={() => setShowIssueModal(false)} onSuccess={triggerToast} />

//       {toast && (
//         <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs border border-teal-500/40">
//           <CheckCircle2 size={18} className="text-success shrink-0" />
//           <span>{toast}</span>
//         </div>
//       )}
//     </div>
//   );
// }