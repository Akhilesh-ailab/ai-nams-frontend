import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ElementType } from "react";

interface QuickActionCardProps {
  title: string;
  subtitle: string;
  icon: ElementType;
  cardClassName: string;
  iconClassName: string;
  arrowClassName: string;
  onClick?: () => void;
}

export default function QuickActionCard({ title, subtitle, icon: Icon, cardClassName, iconClassName, arrowClassName, onClick }: QuickActionCardProps) {
  return (
    <Card onClick={onClick} className={cn("cursor-pointer transition-all hover:shadow-md group", cardClassName)}>
      <CardContent className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={cn("w-11 h-11 rounded-full flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform border bg-white", iconClassName)}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold">{title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          </div>
        </div>
        <div className={cn("w-8 h-8 rounded-full border bg-white flex items-center justify-center transition-colors", arrowClassName)}>
          <ArrowRight className="h-4 w-4" />
        </div>
      </CardContent>
    </Card>
  );
}