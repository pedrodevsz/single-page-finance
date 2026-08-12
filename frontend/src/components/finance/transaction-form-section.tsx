"use client";

import { ExpenseForm } from "@/components/finance/expense-form";
import { IncomeForm } from "@/components/finance/income-form";
import { TransactionTypeSelector } from "@/components/finance/transaction-type-selector";
import { useFinanceUiStore } from "@/stores/finance-ui.store";

export function TransactionFormSection() {
  const transactionType = useFinanceUiStore((state) => state.transactionType);

  return (
    <section className="w-full rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold leading-7 text-foreground">Registrar transação</h2>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Registre ganhos e gastos com uma interface simples e intuitiva. Mantenha o controle das suas finanças de forma prática e eficiente.
          </p>
        </div>

        <TransactionTypeSelector />

        <div className="pt-2">
          {transactionType === "income" ? <IncomeForm /> : <ExpenseForm />}
        </div>
      </div>
    </section>
  );
}
