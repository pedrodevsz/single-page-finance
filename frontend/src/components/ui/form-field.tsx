import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FormFieldProps = {
  children: ReactNode;
  className?: string;
  error?: string;
  hint?: string;
  label: string;
  labelFor?: string;
};

export function FormField({ children, className, error, hint, label, labelFor }: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={labelFor}>{label}</Label>
      {children}
      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-sm text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
