"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegendContent, ChartTooltipContent } from "@/components/ui/chart";
import { isApiConfigured } from "@/lib/api/axios";
import { useFinancialEvolution } from "@/hooks/dashboard/use-dashboard";
import { formatCentsToBrl } from "@/lib/money";
import { DashboardQueryError, DashboardQueryMessage, DashboardQuerySkeleton } from "./dashboard-query-state";

const chartConfig = {
  incomeInCents: {
    label: "Entradas",
    color: "var(--primary)",
  },
  expenseInCents: {
    label: "Saídas",
    color: "var(--destructive)",
  },
} as const;

function formatMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  const label = new Intl.DateTimeFormat("pt-BR", { month: "short" })
    .format(new Date(year, month - 1, 1))
    .replace(".", "");

  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function FinancialEvolution() {
  const evolutionQuery = useFinancialEvolution();

  if (!isApiConfigured) {
    return <DashboardQueryError message="Configure a API para carregar a evolução financeira." />;
  }

  if (evolutionQuery.isPending) {
    return <DashboardQuerySkeleton className="h-[420px]" />;
  }

  if (evolutionQuery.isError) {
    return <DashboardQueryError message={evolutionQuery.error.message} />;
  }

  if (evolutionQuery.data.length === 0) {
    return <DashboardQueryMessage>Nenhuma movimentação disponível para a evolução financeira.</DashboardQueryMessage>;
  }

  const chartData = evolutionQuery.data.map((point) => ({
    ...point,
    month: formatMonthLabel(point.month),
  }));

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Evolução Financeira</CardTitle>
        <CardDescription>Compare entradas e saídas ao longo dos últimos meses.</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-[320px] w-full">
          <ResponsiveContainer height="100%" width="100%">
            <LineChart data={chartData} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" vertical={false} />
              <XAxis
                axisLine={false}
                dataKey="month"
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                tickFormatter={(value) => formatCentsToBrl(Number(value))}
                tickLine={false}
              />
              <Tooltip
                content={
                  <ChartTooltipContent
                    config={chartConfig}
                    formatter={(value) => formatCentsToBrl(value)}
                  />
                }
                cursor={{ stroke: "var(--border)", strokeDasharray: "4 4" }}
              />
              <Legend content={<ChartLegendContent config={chartConfig} />} />
              <Line
                activeDot={{ r: 5 }}
                dataKey="incomeInCents"
                dot={false}
                name="Entradas"
                stroke="var(--primary)"
                strokeWidth={2.5}
                type="monotone"
              />
              <Line
                activeDot={{ r: 5 }}
                dataKey="expenseInCents"
                dot={false}
                name="Saídas"
                stroke="var(--destructive)"
                strokeWidth={2.5}
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
