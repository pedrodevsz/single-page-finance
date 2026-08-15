"use client";

import { ExpenseForm } from "@/components/finance/expense-form";
import { IncomeForm } from "@/components/finance/income-form";
import { TransactionTypeSelector } from "@/components/finance/transaction-type-selector";
import { useFinanceUiStore } from "@/stores/finance-ui.store";
import { FixedExpenseForm } from "@/components/finance/fixed-expense-form";

export function TransactionFormSection() {
  const active = useFinanceUiStore((state) => state.activeFinanceView);

  const title = active === "income" ? "Registrar ganho" : active === "expense" ? "Registrar gasto" : "Registrar conta fixa";

  return (
    <section className="h-full w-full rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold leading-7 text-foreground">{title}</h2>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Registre movimentações ou contas fixas de acordo com o modo selecionado.
          </p>
        </div>

        <TransactionTypeSelector />

        <div className="pt-2">
          {active === "income" ? <IncomeForm /> : active === "expense" ? <ExpenseForm /> : <FixedExpenseForm />}
        </div>
      </div>
    </section>
  );
}
