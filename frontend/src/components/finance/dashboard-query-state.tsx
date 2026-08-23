import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Loading } from "@/components/shared/loading";

export function DashboardQueryMessage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("rounded-xl border border-border bg-muted/20 p-6 text-center", className)}
      role="status"
    >
      <p className="text-sm font-medium text-foreground">{children}</p>
    </div>
  );
}

export function DashboardQueryError({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-6 text-center" role="alert">
      <p className="text-sm font-medium text-destructive">{message}</p>
    </div>
  );
}

export function DashboardQueryLoading({ className }: { className?: string }) {
  return <Loading label="Carregando dados..." className={cn("min-h-24", className)} />;
}
