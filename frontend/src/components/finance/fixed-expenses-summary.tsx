"use client";

import type { ComponentType } from "react";
import { CalendarCheck2, CalendarClock, Wallet } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isApiConfigured } from "@/lib/api/axios";
import { useFinancialSummary } from "@/hooks/dashboard/use-dashboard";
import { formatCentsToBrl } from "@/lib/money";
import { DashboardQueryError, DashboardQueryLoading } from "./dashboard-query-state";

function SummaryStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight text-foreground">{value}</p>
        </div>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
    </div>
  );
}

export function FixedExpensesSummary() {
  const summaryQuery = useFinancialSummary();

  if (!isApiConfigured) {
    return <DashboardQueryError message="Configure a API para carregar as contas fixas." />;
  }

  if (summaryQuery.isPending) {
    return <DashboardQueryLoading className="h-[280px]" />;
  }

  if (summaryQuery.isError || !summaryQuery.data) {
    return <DashboardQueryError message={summaryQuery.error?.message ?? "Não foi possível carregar as contas fixas."} />;
  }

  const { data } = summaryQuery;

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Contas fixas</CardTitle>
        <CardDescription>Acompanhe rapidamente o status mensal das contas fixas.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <SummaryStat label="Pagas" value={String(data.paidFixedExpenses)} icon={CalendarCheck2} />
          <SummaryStat label="Pendentes" value={String(data.pendingFixedExpenses)} icon={CalendarClock} />
        </div>

        <div className="rounded-xl border border-border bg-background p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total mensal</p>
              <p className="text-2xl font-semibold tracking-tight text-foreground">
                {formatCentsToBrl(data.fixedExpensesInCents)}
              </p>
            </div>
            <Wallet className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
