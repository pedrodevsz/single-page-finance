"use client";

import { FinancialSummary } from "../finance/financial-summary";
import { FinancialEvolution } from "../finance/financial-evolution";
import { ExpensesByCategoryChart } from "../finance/expenses-by-category-chart";
import { FixedExpensesSummary } from "../finance/fixed-expenses-summary";

export function FinancialDashboard() {
    return (
        <section className="space-y-6 p-4 sm:p-6">
            <header className="space-y-1">
                <h2 className="text-xl font-semibold text-foreground">
                    Análise financeira
                </h2>

                <p className="text-sm text-muted-foreground">
                    Acompanhe sua situação financeira e evolução ao longo do tempo.
                </p>
            </header>

            <div>
                <FinancialSummary />
            </div>

            <FinancialEvolution />

            <div className="grid gap-6 lg:grid-cols-2">
                <ExpensesByCategoryChart />
                <FixedExpensesSummary />
            </div>
        </section>
    );
}
