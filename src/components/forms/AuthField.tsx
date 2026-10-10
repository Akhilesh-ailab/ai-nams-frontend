import type { ComponentProps, ElementType, ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AUTH_ERROR, AUTH_ICON, AUTH_INPUT, AUTH_INPUT_WITH_TOGGLE, AUTH_LABEL } from "@/constants/authStyles";

interface AuthFieldProps extends ComponentProps<"input"> {
  label: string;
  icon: ElementType;
  error?: string;
  labelAction?: ReactNode;
  trailing?: ReactNode;
}

export default function AuthField({
  label,
  icon: Icon,
  error,
  labelAction,
  trailing,
  className,
  ...inputProps
}: AuthFieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor={inputProps.id} className={AUTH_LABEL}>
          {label} <span className="text-primary">*</span>
        </Label>
        {labelAction}
      </div>
      <div className="relative">
        <Icon className={AUTH_ICON} />
        <Input {...inputProps} className={cn(trailing ? AUTH_INPUT_WITH_TOGGLE : AUTH_INPUT, className)} />
        {trailing}
      </div>
      {error && <p className={AUTH_ERROR}>{error}</p>}
    </div>
  );
}