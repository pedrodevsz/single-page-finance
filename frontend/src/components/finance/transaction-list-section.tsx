"use client";

import { ArrowDownRight, ArrowUpRight, CalendarDays, NotebookText } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { isApiConfigured } from "@/lib/api/axios";
import {
  formatTransactionAmount,
  formatTransactionDate,
  getPaymentMethodLabel,
} from "@/lib/transactions/transaction-formatters";
import { cn } from "@/lib/utils";
import { useTransactions } from "@/hooks/transactions/use-transactions";
import { TransactionListTypeSelector } from "@/components/finance/transaction-list-type-selector";
import { useFinanceUiStore } from "@/stores/finance-ui.store";

export function TransactionListSection() {
  const transactionListType = useFinanceUiStore((state) => state.transactionListType);
  const { data, error, isError, isFetching } = useTransactions();

  const title = transactionListType === "income" ? "Ganhos recentes" : "Gastos recentes";
  const emptyLabel = transactionListType === "income" ? "ganhos" : "gastos";

  return (
    <section className="w-full rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-3">
          <div className="space-y-1">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Movimentações
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              A lista abaixo reflete apenas o tipo selecionado, sem interferir no formulário de cadastro.
            </p>
          </div>

          <TransactionListTypeSelector />
        </div>

        {!isApiConfigured ? (
          <Alert variant="destructive">
            <AlertDescription>
              Configure `NEXT_PUBLIC_API_URL` para carregar a lista de transações.
            </AlertDescription>
          </Alert>
        ) : null}

        {isError ? (
          <Alert variant="destructive">
            <AlertDescription>
              {error instanceof Error ? error.message : "Não foi possível carregar a lista."}
            </AlertDescription>
          </Alert>
        ) : null}

        {isFetching ? (
          <div className="space-y-3" aria-live="polite" aria-busy="true">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`transaction-skeleton-${index}`}
                className="h-24 animate-pulse rounded-xl border border-border bg-muted/40"
              />
            ))}
          </div>
        ) : null}

        {!isFetching && data && data.length > 0 ? (
          <ul className="space-y-3">
            {data.map((transaction) => {
              const isIncome = transaction.type === "INCOME";
              const Icon = isIncome ? ArrowUpRight : ArrowDownRight;

              return (
                <li
                  key={transaction.id}
                  className="rounded-xl border border-border bg-background p-4 transition-colors hover:bg-muted/40"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                        isIncome
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      )}
                      aria-hidden="true"
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {transaction.description}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {transaction.category} · {getPaymentMethodLabel(transaction.paymentMethod)}
                          </p>
                        </div>

                        <div className="text-right">
                          <p
                            className={cn(
                              "text-sm font-semibold tabular-nums",
                              isIncome
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-rose-600 dark:text-rose-400"
                            )}
                          >
                            {formatTransactionAmount(transaction.amountInCents, transaction.type)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {isIncome ? "Entrada" : "Saída"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {formatTransactionDate(transaction.transactionDate)}
                        </span>
                        {transaction.notes ? (
                          <span className="inline-flex items-center gap-1.5">
                            <NotebookText className="h-3.5 w-3.5" />
                            {transaction.notes}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : null}

        {!isFetching && !isError && data && data.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center">
            <p className="text-sm font-medium text-foreground">Nenhum {emptyLabel} encontrado.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Assim que você cadastrar movimentações desse tipo, elas aparecerão aqui.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
