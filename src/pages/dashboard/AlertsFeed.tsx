import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { INITIAL_ALERTS } from "@/constants/dashboardMockData";

const severityClass = {
  Critical: "bg-destructive/10 text-destructive",
  Warning: "bg-warning/10 text-warning",
  Info: "bg-muted text-muted-foreground",
} as const;

export default function AlertsFeed() {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold">AI Risk Radar</h3>
          <span className="text-xs bg-destructive/10 text-destructive font-bold px-2.5 py-1 rounded-full border border-destructive/20">
            Live Sync
          </span>
        </div>

        <div className="space-y-3">
          {INITIAL_ALERTS.map((alert) => (
            <div key={alert.id} className="p-3.5 rounded-xl border border-border bg-muted/50 hover:bg-muted transition-colors space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold">{alert.drug}</span>
                <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full", severityClass[alert.severity])}>
                  {alert.severity}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">{alert.details}</p>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground/70 pt-1">
                <span>{alert.location}</span>
                <span>{alert.time}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}