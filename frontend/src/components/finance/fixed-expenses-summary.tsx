"use client";

import type { ComponentType } from "react";
import { CalendarCheck2, CalendarClock, Wallet } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockFixedExpenses } from "@/lib/mock/finance-mock";
import { buildFixedExpensesSummary } from "@/lib/transactions/fixed-expenses-summary";
import { formatCentsToBrl } from "@/lib/money";

const fixedExpensesSummary = buildFixedExpensesSummary(mockFixedExpenses);

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
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Contas fixas</CardTitle>
        <CardDescription>Acompanhe rapidamente o status mensal das contas fixas.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <SummaryStat label="Pagas" value={String(fixedExpensesSummary.paidCount)} icon={CalendarCheck2} />
          <SummaryStat label="Pendentes" value={String(fixedExpensesSummary.pendingCount)} icon={CalendarClock} />
        </div>

        <div className="rounded-xl border border-border bg-background p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total mensal</p>
              <p className="text-2xl font-semibold tracking-tight text-foreground">
                {formatCentsToBrl(fixedExpensesSummary.totalInCents)}
              </p>
            </div>
            <Wallet className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
