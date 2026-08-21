"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { mockTransactions } from "@/lib/mock/finance-mock";
import { buildExpensesByCategoryData } from "@/lib/transactions/expenses-by-category";
import { formatCentsToBrl } from "@/lib/money";

const chartConfig = {
  amountInCents: {
    label: "Gastos",
    color: "var(--chart-1)",
  },
} as const;

const chartData = buildExpensesByCategoryData(mockTransactions);
const chartHeight = Math.max(320, chartData.length * 42 + 72);

export function ExpensesByCategoryChart() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Gastos por categoria</CardTitle>
        <CardDescription>Veja rapidamente para onde o dinheiro está indo.</CardDescription>
      </CardHeader>

      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="w-full" style={{ height: chartHeight }}>
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 4, right: 12, top: 8, bottom: 8 }}>
                <CartesianGrid horizontal={false} stroke="var(--border)" strokeDasharray="4 4" />
                <XAxis
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  tickFormatter={(value) => formatCentsToBrl(Number(value))}
                  tickLine={false}
                  type="number"
                />
                <YAxis
                  axisLine={false}
                  dataKey="category"
                  tick={{ fill: "var(--foreground)", fontSize: 12 }}
                  tickLine={false}
                  type="category"
                  width={128}
                />
                <Tooltip
                  content={
                    <ChartTooltipContent
                      config={chartConfig}
                      formatter={(value) => formatCentsToBrl(value)}
                    />
                  }
                  cursor={{ fill: "var(--muted)" }}
                />
                <Bar dataKey="amountInCents" fill="var(--chart-1)" radius={[0, 10, 10, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center">
            <p className="text-sm font-medium text-foreground">Nenhum gasto disponível para análise por categoria.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
