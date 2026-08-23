"use client";

import { ArrowDownRight, CalendarDays, NotebookText, TrashIcon } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { EmptyListState } from "@/components/ui/empty-list-state";
import { formatTransactionAmount, formatTransactionDate } from "@/lib/transactions/transaction-formatters";
import { getPaymentMethodLabel } from "@/lib/transactions/transaction-formatters";
import { useFixedExpenses } from "@/hooks/fixed-expenses/use-fixed-expenses";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useDeleteFixedExpense, useMarkFixedExpenseAsPaid } from "@/hooks/fixed-expenses/use-delete-fixed-expense";
import { ShowMoreToggle } from "@/components/ui/show-more-toggle";

export function FixedExpenseList() {
    const { data, isError, error, isFetching } = useFixedExpenses();
    const deleteMutation = useDeleteFixedExpense();
    const markPaidMutation = useMarkFixedExpenseAsPaid();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [showAll, setShowAll] = useState(false);

    return (
        <div>
            {isError ? (
                <Alert variant="destructive"><AlertDescription>{error instanceof Error ? error.message : "Não foi possível carregar"}</AlertDescription></Alert>
            ) : null}

            {isFetching ? (
                <div className="space-y-3" aria-live="polite" aria-busy="true">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-24 animate-pulse rounded-xl border border-border bg-muted/40" />
                    ))}
                </div>
            ) : null}

            {!isFetching && data && data.length > 0 ? (
                <div className={showAll && data.length > 4 ? "max-h-[calc(4*6rem+0.75rem*3)] overflow-y-auto" : ""}>
                    <ul className="space-y-3">
                        {data.slice(0, showAll ? data.length : 4).map((fe) => (
                            <li key={fe.id} className="relative rounded-xl border border-border bg-background p-4 transition-colors hover:bg-muted/40">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400" aria-hidden>
                                        <ArrowDownRight className="h-5 w-5" />
                                    </div>

                                    <div className="min-w-0 flex-1 space-y-2">
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-foreground">{fe.description}</p>
                                                <p className="text-sm text-muted-foreground">{fe.category} · {getPaymentMethodLabel(fe.paymentMethod)}</p>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-sm font-semibold tabular-nums text-rose-600">{formatTransactionAmount(fe.amountInCents, "EXPENSE")}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                                            <span className="inline-flex items-center gap-1.5">
                                                <CalendarDays className="h-3.5 w-3.5" />
                                                {formatTransactionDate(fe.dueDate)}
                                            </span>
                                            {fe.notes ? (
                                                <span className="inline-flex items-center gap-1.5">
                                                    <NotebookText className="h-3.5 w-3.5" />
                                                    {fe.notes}
                                                </span>
                                            ) : null}
                                            {fe.totalInstallments ? (
                                                <span className="inline-flex items-center gap-1.5">Parcela {fe.installmentNumber} de {fe.totalInstallments}</span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5">Recorrente</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute right-3 bottom-3">
                                    {!fe.paid ? (
                                        <div className="flex items-center gap-2">
                                            <Checkbox id="paid" checked={fe.paid} onCheckedChange={async (checked) => {
                                                if (checked) {
                                                    try {
                                                        await markPaidMutation.mutateAsync(fe.id);
                                                    } catch (_) {
                                                    }
                                                }
                                            }} disabled={markPaidMutation.isPending} />
                                            <Button variant="ghost" size="icon" aria-label={`Excluir ${fe.description}`} onClick={() => setSelectedId(fe.id)} disabled={deleteMutation.isPending && selectedId === fe.id}>
                                                <TrashIcon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <span className="text-sm text-green-600">Pago</span>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}

            {/* show more toggle for fixed expenses */}
            {!isFetching && data && data.length > 4 ? (
                <ShowMoreToggle expanded={showAll} onToggle={() => setShowAll((s) => !s)} hiddenCount={data.length - 4} />
            ) : null}

            {!isFetching && data && data.length === 0 ? (
                <EmptyListState type="fixed-expense" />
            ) : null}

            {selectedId ? (
                <div role="alertdialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/40" onClick={() => setSelectedId(null)} />
                    <div className="relative z-10 w-full max-w-lg rounded-lg border border-border bg-card p-6 shadow-lg">
                        <h3 className="text-lg font-semibold">Excluir gasto fixo</h3>
                        <p className="mt-2 text-sm text-muted-foreground">Tem certeza que deseja excluir este gasto fixo?</p>
                        {deleteMutation.isError ? (
                            <div className="mt-4"><Alert variant="destructive"><AlertDescription>{deleteMutation.error instanceof Error ? deleteMutation.error.message : "Não foi possível deletar."}</AlertDescription></Alert></div>
                        ) : null}
                        <div className="mt-4 flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setSelectedId(null)} disabled={deleteMutation.isPending}>Cancelar</Button>
                            <Button variant="destructive" onClick={async () => { try { await deleteMutation.mutateAsync(selectedId); setSelectedId(null); } catch (_) { } }} disabled={deleteMutation.isPending}>{deleteMutation.isPending ? "Excluindo..." : "Excluir"}</Button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
