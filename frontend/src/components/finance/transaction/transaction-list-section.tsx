"use client";

import { ArrowDownRight, ArrowUpRight, CalendarDays, NotebookText, TrashIcon } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { useDeleteTransaction } from "@/hooks/transactions/use-delete-transaction";
import {
  formatTransactionAmount,
  formatTransactionDate,
  getPaymentMethodLabel,
} from "@/lib/transactions/transaction-formatters";
import { cn } from "@/lib/utils";
import { useTransactions } from "@/hooks/transactions/use-transactions";
import { TransactionListTypeSelector } from "@/components/finance/transaction/transaction-list-type-selector";
import { EmptyListState } from "@/components/ui/empty-list-state";
import { useFinanceUiStore } from "@/stores/finance-ui.store";
import { Button } from "../../ui/button";
import { ShowMoreToggle } from "@/components/ui/show-more-toggle";
import { FixedExpenseList } from "../expense/fixed-expense-list";
import { Loading } from "@/components/shared/loading";

export function TransactionListSection() {
  const active = useFinanceUiStore((state) => state.activeFinanceView);
  const { data, error, isError, isFetching } = useTransactions();
  const deleteMutation = useDeleteTransaction();
  const [selectedTransaction, setSelectedTransaction] = useState<null | { id: string; description: string; type: string }>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const title = active === "income" ? "Ganhos recentes" : active === "expense" ? "Gastos recentes" : "Contas fixas recentes"

  return (
    <section className="h-full w-full rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
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

        {isError ? (
          <Alert variant="destructive">
            <AlertDescription>
              {error instanceof Error ? error.message : "Não foi possível carregar a lista."}
            </AlertDescription>
          </Alert>
        ) : null}

        {active !== "fixed-expense" && isFetching && !data ? (
          <Loading label="Carregando movimentações..." className="min-h-32" />
        ) : null}

        {active === "fixed-expense" ? (
          <FixedExpenseList />
        ) : data && data.length > 0 ? (
          <>
            <div className={showAll && data.length > 4 ? "max-h-[calc(4*6rem+0.75rem*3)] overflow-y-auto" : ""}>
              <ul className="space-y-3">
                {data.slice(0, showAll ? data.length : 4).map((transaction) => {
                  const isIncome = transaction.type === "INCOME";
                  const Icon = isIncome ? ArrowUpRight : ArrowDownRight;

                  return (
                    <li
                      key={transaction.id}
                      className="relative rounded-xl border border-border bg-background p-4 transition-colors hover:bg-muted/40"
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
                      <div className="absolute right-3 bottom-3">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Excluir ${transaction.description}`}
                          className="text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                          onClick={() => setSelectedTransaction({ id: transaction.id, description: transaction.description, type: transaction.type })}
                          disabled={deletingId === transaction.id}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* show more toggle for income/expense lists */}
            {data && data.length > 4 ? (
              <ShowMoreToggle expanded={showAll} onToggle={() => setShowAll((s) => !s)} hiddenCount={data.length - 4} />
            ) : null}
          </>
        ) : !isFetching && !isError && data && data.length === 0 ? (
          <EmptyListState type={active === "income" ? "income" : "expense"} />
        ) : null}

        {selectedTransaction ? (
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="fixed inset-0 bg-black/40" onClick={() => setSelectedTransaction(null)} />
            <div className="relative z-10 w-full max-w-lg rounded-lg border border-border bg-card p-6 shadow-lg">
              <h3 id="delete-dialog-title" className="text-lg font-semibold">
                Excluir movimentação
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Tem certeza que deseja excluir <strong>{selectedTransaction.description}</strong>?
              </p>

              {deleteMutation.isError ? (
                <div className="mt-4">
                  <Alert variant="destructive">
                    <AlertDescription>
                      {deleteMutation.error instanceof Error
                        ? deleteMutation.error.message
                        : "Não foi possível deletar a transação."}
                    </AlertDescription>
                  </Alert>
                </div>
              ) : null}

              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedTransaction(null)}
                  disabled={deleteMutation.isPending}
                >
                  Cancelar
                </Button>

                <Button
                  variant="destructive"
                  onClick={async () => {
                    const id = selectedTransaction.id;
                    try {
                      setDeletingId(id);
                      await deleteMutation.mutateAsync(id);
                      setSelectedTransaction(null);
                    } catch {
                      // error handled/displayed via deleteMutation.isError
                    } finally {
                      setDeletingId(null);
                    }
                  }}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
