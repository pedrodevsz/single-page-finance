"use client";

import { useState } from "react";
import { Check, CheckCircle2, Clock3, Trash2 } from "lucide-react";

import {
    useDeleteFixedExpenseInstallment,
    useDeleteFixedExpenseSeries,
    usePayFixedExpenseInstallment,
} from "@/hooks/fixed-expenses/use-delete-fixed-expense";
import { useFixedExpenseHistoryDetails } from "@/hooks/fixed-expenses/use-fixed-expense-history";
import { formatCentsToBrl } from "@/lib/money";
import { formatTransactionDate, getPaymentMethodLabel } from "@/lib/transactions/transaction-formatters";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogClose,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { FixedExpenseHistoryRecord } from "@/types/fixed-expense-history";
import { Loading } from "@/components/shared/loading";

type FixedExpenseHistoryDetailsProps = {
    seriesId: string;
    onSeriesDeleted: () => void;
};

function wasPaidEarly(record: FixedExpenseHistoryRecord) {
    return Boolean(record.paidAt && record.paidAt.slice(0, 10) < record.dueDate);
}

export function FixedExpenseHistoryDetails({ seriesId, onSeriesDeleted }: FixedExpenseHistoryDetailsProps) {
    const query = useFixedExpenseHistoryDetails(seriesId);
    const deleteSeriesMutation = useDeleteFixedExpenseSeries();
    const deleteInstallmentMutation = useDeleteFixedExpenseInstallment();
    const payInstallmentMutation = usePayFixedExpenseInstallment();
    const [seriesDialogOpen, setSeriesDialogOpen] = useState(false);
    const [installmentToDelete, setInstallmentToDelete] = useState<string | null>(null);
    const orderedInstallments = query.data?.toReversed() ?? [];

    async function deleteSeries() {
        try {
            await deleteSeriesMutation.mutateAsync(seriesId);
            setSeriesDialogOpen(false);
            onSeriesDeleted();
        } catch {
            // The mutation error is rendered in the confirmation dialog.
        }
    }

    async function deleteInstallment(record: FixedExpenseHistoryRecord) {
        try {
            await deleteInstallmentMutation.mutateAsync(record.id);
            setInstallmentToDelete(null);
            if (query.data?.length === 1) {
                onSeriesDeleted();
            }
        } catch {
            // The mutation error is rendered below the sheet header.
        }
    }

    async function payInstallment(installmentId: string) {
        try {
            await payInstallmentMutation.mutateAsync(installmentId);
        } catch {
            // The mutation error is rendered below the sheet header.
        }
    }

    const actionError = deleteInstallmentMutation.error ?? payInstallmentMutation.error;

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <SheetHeader className="shrink-0 pr-14">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <SheetTitle>Detalhes do histórico</SheetTitle>
                        <SheetDescription>Registros mais recentes primeiro.</SheetDescription>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setSeriesDialogOpen(true)}
                    >
                        <Trash2 aria-hidden="true" />
                        <span className="hidden sm:inline">Excluir conta</span>
                        <span className="sr-only sm:hidden">Excluir conta inteira</span>
                    </Button>
                </div>
            </SheetHeader>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
                {actionError && (
                    <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive" role="alert">
                        {actionError.message}
                    </div>
                )}
                {query.isPending && <Loading label="Carregando detalhes..." className="min-h-40" />}
                {query.isError && <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive" role="alert">{query.error.message}</div>}
                {query.isSuccess && query.data.length === 0 && <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Nenhum registro disponível.</p>}
                {query.isSuccess && query.data.length > 0 && <div className="space-y-3">
                    {orderedInstallments.map((record) => (
                        <HistoryRecord
                            key={record.id}
                            record={record}
                            isPaying={payInstallmentMutation.isPending && payInstallmentMutation.variables === record.id}
                            isDeleting={deleteInstallmentMutation.isPending && deleteInstallmentMutation.variables === record.id}
                            onPay={() => void payInstallment(record.id)}
                            onDelete={() => setInstallmentToDelete(record.id)}
                        />
                    ))}
                </div>}
            </div>

            <AlertDialog open={seriesDialogOpen} onOpenChange={setSeriesDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir esta conta?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Todas as parcelas e todo o histórico desta conta serão removidos permanentemente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    {deleteSeriesMutation.error && (
                        <p className="mt-4 text-sm text-destructive" role="alert">{deleteSeriesMutation.error.message}</p>
                    )}
                    <AlertDialogFooter>
                        <AlertDialogClose render={<Button variant="outline" disabled={deleteSeriesMutation.isPending} />}>
                            Cancelar
                        </AlertDialogClose>
                        <Button
                            variant="destructive"
                            onClick={() => void deleteSeries()}
                            disabled={deleteSeriesMutation.isPending}
                        >
                            <Trash2 aria-hidden="true" />
                            {deleteSeriesMutation.isPending ? "Excluindo..." : "Excluir conta"}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={installmentToDelete !== null} onOpenChange={(open) => !open && setInstallmentToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir esta parcela?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Somente esta parcela será removida do histórico.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogClose render={<Button variant="outline" disabled={deleteInstallmentMutation.isPending} />}>
                            Cancelar
                        </AlertDialogClose>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                const record = query.data?.find((item) => item.id === installmentToDelete);
                                if (record) void deleteInstallment(record);
                            }}
                            disabled={deleteInstallmentMutation.isPending || installmentToDelete === null}
                        >
                            <Trash2 aria-hidden="true" />
                            {deleteInstallmentMutation.isPending ? "Excluindo..." : "Excluir"}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

function HistoryRecord({
    record,
    isPaying,
    isDeleting,
    onPay,
    onDelete,
}: {
    record: FixedExpenseHistoryRecord;
    isPaying: boolean;
    isDeleting: boolean;
    onPay: () => void;
    onDelete: () => void;
}) {
    return (
        <article className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-card-foreground">
                        {record.installmentNumber ? `Parcela ${record.installmentNumber}` : "Conta recorrente"}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">Vencimento {formatTransactionDate(record.dueDate)}</p>
                    <p className="mt-1 text-lg font-semibold text-foreground">{formatCentsToBrl(record.amountInCents)}</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border px-2 py-1 text-xs text-muted-foreground">
                    {record.paid ? <CheckCircle2 className="size-3" /> : <Clock3 className="size-3" />}
                    {record.paid ? "Pago" : "Pendente"}
                </span>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                <div><dt className="text-muted-foreground">Pagamento</dt><dd className="mt-1 text-foreground">{getPaymentMethodLabel(record.paymentMethod)}</dd></div>
                {record.paidAt && <div><dt className="text-muted-foreground">Pago em</dt><dd className="mt-1 text-foreground">{formatTransactionDate(record.paidAt)}</dd></div>}
                {record.totalInstallments ? <div><dt className="text-muted-foreground">Parcela</dt><dd className="mt-1 text-foreground">{record.installmentNumber} de {record.totalInstallments}</dd></div> : <div><dt className="text-muted-foreground">Tipo</dt><dd className="mt-1 text-foreground">Recorrente</dd></div>}
                {wasPaidEarly(record) && <div className="col-span-2 text-muted-foreground">Pago antecipadamente</div>}
                {record.notes && <div className="col-span-2"><dt className="text-muted-foreground">Observações</dt><dd className="mt-1 text-foreground">{record.notes}</dd></div>}
            </dl>
            {!record.paid && (
                <div className="mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-border pt-3">
                    <Button variant="outline" size="sm" onClick={onPay} disabled={isPaying || isDeleting}>
                        <Check aria-hidden="true" />
                        {isPaying ? "Registrando..." : "Pagar agora"}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={onDelete} disabled={isPaying || isDeleting}>
                        <Trash2 aria-hidden="true" />
                        <span className="sr-only sm:not-sr-only">Excluir</span>
                    </Button>
                </div>
            )}
        </article>
    );
}
