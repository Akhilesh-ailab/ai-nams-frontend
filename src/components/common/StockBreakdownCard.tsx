import { ArrowUp, ChevronDown, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { INITIAL_INVENTORY } from "@/constants/dashboardMockData";

export default function StockBreakdownCard() {
  const totalStock = INITIAL_INVENTORY.reduce((sum, item) => sum + item.stock, 0);
  const breakdown = [...INITIAL_INVENTORY].sort((a, b) => b.stock - a.stock);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <span className="flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-bold border bg-success/10 text-success border-success/20">
                <ArrowUp className="h-3 w-3" /> 12.4%
              </span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Total Stock</p>
                <p className="text-3xl font-black tracking-tight mt-1">{totalStock.toLocaleString()}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground mb-1" />
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 font-medium">Schedule II - IV · tap for breakdown</p>
          </CardContent>
        </Card>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-72 p-3">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide px-1 pb-2">Stock by Drug</p>
        <div className="space-y-2.5">
          {breakdown.map((item) => {
            const percentage = Math.round((item.stock / totalStock) * 100);
            return (
              <div key={item.id} className="px-1">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-muted-foreground">{item.stock} {item.unit}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}