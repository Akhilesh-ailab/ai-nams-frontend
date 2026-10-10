import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionIcon?: ReactNode;
  onAction?: () => void;
}

export default function PageHeader({ title, subtitle, actionLabel, actionIcon, onAction }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="gap-2">
          {actionIcon}
          {actionLabel}
        </Button>
      )}
    </div>
  );
}