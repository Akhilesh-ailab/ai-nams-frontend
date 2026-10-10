import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ElementType } from "react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: ElementType;
  iconBg: string;
  iconColor: string;
  trend?: { value: string; direction: "up" | "down" };
  badge?: string;
}

export default function StatCard({ title, value, subtitle, icon: Icon, iconBg, iconColor, trend, badge }: StatCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: iconBg }}>
            <Icon className="h-5 w-5" style={{ color: iconColor }} />
          </div>
          {trend && (
            <span className={cn(
              "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-bold border",
              trend.direction === "up" ? "bg-success/10 text-success border-success/20" : "bg-destructive/10 text-destructive border-destructive/20"
            )}>
              {trend.direction === "up" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {trend.value}
            </span>
          )}
          {badge && !trend && (
            <span className="text-[11px] font-bold text-warning bg-warning/10 px-2 py-0.5 rounded-full border border-warning/20">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs font-semibold text-muted-foreground">{title}</p>
        <p className="text-3xl font-black tracking-tight mt-1">{value}</p>
        <p className="text-[10px] text-muted-foreground mt-2 font-medium">{subtitle}</p>
      </CardContent>
    </Card>
  );
}