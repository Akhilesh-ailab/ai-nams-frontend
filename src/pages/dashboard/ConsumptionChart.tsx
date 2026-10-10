import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { CONSUMPTION_DATA } from "@/constants/dashboardMockData";

export default function ConsumptionChart() {
  const maxValue = 120;

  return (
    <Card className="lg:col-span-2">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold">7-Day Essential Narcotic Drug (END) Consumption</h3>
            <p className="text-xs text-muted-foreground">Real-time automated logging per schedule group</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-primary">
              <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" /> Morphine
            </span>
            <span className="flex items-center gap-1.5 text-teal-600">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block" /> Fentanyl
            </span>
          </div>
        </div>

        <div className="h-56 w-full pt-4 flex items-end justify-between gap-3 border-b border-border">
          {CONSUMPTION_DATA.map((point) => (
            <div key={point.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <div className="w-full flex items-end justify-center gap-1.5 h-44">
                <div style={{ height: `${(point.morphine / maxValue) * 100}%` }} className="w-3.5 bg-primary rounded-t-md group-hover:opacity-90 transition-all relative">
                  <span className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] py-0.5 px-1.5 rounded font-bold transition-opacity pointer-events-none">
                    {point.morphine}
                  </span>
                </div>
                <div style={{ height: `${(point.fentanyl / maxValue) * 100}%` }} className="w-3.5 bg-teal-400 rounded-t-md group-hover:opacity-90 transition-all relative">
                  <span className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] py-0.5 px-1.5 rounded font-bold transition-opacity pointer-events-none">
                    {point.fentanyl}
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-muted-foreground">{point.day}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
          <span>Total Units Dispensed: <strong className="text-foreground">555 Vials</strong></span>
          <span className="text-success font-bold flex items-center gap-1">
            <CheckCircle2 size={13} /> 100% Reconciliation Matched
          </span>
        </div>
      </CardContent>
    </Card>
  );
}