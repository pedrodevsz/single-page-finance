"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegendContent, ChartTooltipContent } from "@/components/ui/chart";
import { mockTransactions } from "@/lib/mock/finance-mock";
import { buildFinancialEvolutionSeries } from "@/lib/transactions/financial-evolution";
import { formatCentsToBrl } from "@/lib/money";

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

const chartData = buildFinancialEvolutionSeries(mockTransactions);

export function FinancialEvolution() {
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
