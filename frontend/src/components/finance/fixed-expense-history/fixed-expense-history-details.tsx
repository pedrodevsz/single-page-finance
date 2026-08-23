"use client";

import { CheckCircle2, Clock3 } from "lucide-react";

import { useFixedExpenseHistoryDetails } from "@/hooks/fixed-expenses/use-fixed-expense-history";
import { formatTransactionDate, getPaymentMethodLabel } from "@/lib/transactions/transaction-formatters";
import { formatCentsToBrl } from "@/lib/money";
import { SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Loading } from "@/components/shared/loading";

export function FixedExpenseHistoryDetails({ seriesId }: { seriesId: string }) {
    const query = useFixedExpenseHistoryDetails(seriesId);

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <SheetHeader className="shrink-0 pr-14">
                <SheetTitle>Detalhes do histórico</SheetTitle>
                <SheetDescription>Registros mais recentes primeiro.</SheetDescription>
            </SheetHeader>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
                {query.isPending && <Loading label="Carregando detalhes..." className="min-h-40" />}
                {query.isError && <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{query.error.message}</div>}
                {query.isSuccess && query.data.length === 0 && <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Nenhum registro disponível.</p>}
                {query.isSuccess && query.data.length > 0 && <div className="space-y-3">
                    {query.data.map((record) => (
                        <article key={record.id} className="rounded-xl border border-border bg-card p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium text-card-foreground">Vencimento {formatTransactionDate(record.dueDate)}</p>
                                    <p className="mt-1 text-lg font-semibold text-foreground">{formatCentsToBrl(record.amountInCents)}</p>
                                </div>
                                <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-1 text-xs text-muted-foreground">
                                    {record.paid ? <CheckCircle2 className="size-3" /> : <Clock3 className="size-3" />}
                                    {record.paid ? "Pago" : "Pendente"}
                                </span>
                            </div>
                            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                                <div><dt className="text-muted-foreground">Pagamento</dt><dd className="mt-1 text-foreground">{getPaymentMethodLabel(record.paymentMethod)}</dd></div>
                                {record.paidAt && <div><dt className="text-muted-foreground">Pago em</dt><dd className="mt-1 text-foreground">{formatTransactionDate(record.paidAt)}</dd></div>}
                                {record.totalInstallments ? <div><dt className="text-muted-foreground">Parcela</dt><dd className="mt-1 text-foreground">{record.installmentNumber} de {record.totalInstallments}</dd></div> : <div><dt className="text-muted-foreground">Tipo</dt><dd className="mt-1 text-foreground">Recorrente</dd></div>}
                                {record.notes && <div className="col-span-2"><dt className="text-muted-foreground">Observações</dt><dd className="mt-1 text-foreground">{record.notes}</dd></div>}
                            </dl>
                        </article>
                    ))}
                </div>}
            </div>
        </div>
    );
}
