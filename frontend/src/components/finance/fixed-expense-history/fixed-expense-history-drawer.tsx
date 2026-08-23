"use client";

import { useState } from "react";
import { CheckCircle2, ChevronRight, Clock3, History, ReceiptText } from "lucide-react";

import { useFixedExpenseHistory } from "@/hooks/fixed-expenses/use-fixed-expense-history";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { FixedExpenseHistoryDetails } from "./fixed-expense-history-details";

function HistorySkeleton() {
    return <div className="divide-y divide-border" aria-label="Carregando histórico">
        {[1, 2, 3].map((item) => (
            <div key={item} className="space-y-3 py-4 first:pt-1">
                <div className="h-4 w-2/5 animate-pulse bg-muted/50" />
                <div className="h-3 w-1/3 animate-pulse bg-muted/50" />
                <div className="h-3 w-1/2 animate-pulse bg-muted/50" />
            </div>
        ))}
    </div>;
}

export function FixedExpenseHistoryDrawer() {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const historyQuery = useFixedExpenseHistory();

    return (
        <>
            <Drawer>
                <DrawerTrigger render={<Button variant="ghost" size="icon" aria-label="Abrir histórico de contas" />}>
                    <History />
                </DrawerTrigger>
                <DrawerContent className="max-h-[90dvh] overflow-hidden shadow-none">
                    <DrawerHeader className="shrink-0 p-4 pb-0">
                        <DrawerTitle>Histórico de contas</DrawerTitle>
                        <DrawerDescription>Consulte pagamentos e pendências das suas contas fixas.</DrawerDescription>
                    </DrawerHeader>
                    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 pt-3">
                        {historyQuery.isPending && <HistorySkeleton />}
                        {historyQuery.isError && (
                            <div className="p-4 text-sm text-destructive">
                                {historyQuery.error.message}
                            </div>
                        )}
                        {historyQuery.isSuccess && historyQuery.data.length === 0 && (
                            <div className="p-6 text-center">
                                <ReceiptText className="mx-auto size-6 text-muted-foreground" />
                                <p className="mt-3 text-sm font-medium text-foreground">Nenhum histórico encontrado.</p>
                                <p className="mt-1 text-sm text-muted-foreground">As contas fixas cadastradas aparecerão aqui.</p>
                            </div>
                        )}
                        {historyQuery.isSuccess && historyQuery.data.length > 0 && (
                            <div>
                                {historyQuery.data.map((item) => (
                                    <button
                                        key={item.seriesId}
                                        type="button"
                                        className="flex w-full items-center gap-3 border-b border-border py-4 text-left transition-colors last:border-b-0 hover:bg-muted/30"
                                        onClick={() => setSelectedId(item.seriesId)}
                                    >
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-sm font-medium text-foreground">{item.description}</span>
                                            <span className="mt-1 block text-xs text-muted-foreground">{item.category} · {item.recordCount} registros</span>
                                            <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                                <span className="inline-flex items-center gap-1"><CheckCircle2 className="size-3" /> {item.paidCount} pagos</span>
                                                <span className="inline-flex items-center gap-1"><Clock3 className="size-3" /> {item.pendingCount} pendentes</span>
                                            </span>
                                        </span>
                                        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </DrawerContent>
            </Drawer>
            <Sheet open={selectedId !== null} onOpenChange={(open) => !open && setSelectedId(null)}>
                <SheetContent className="max-h-dvh overflow-hidden shadow-none sm:max-w-lg">
                    {selectedId && <FixedExpenseHistoryDetails seriesId={selectedId} />}
                </SheetContent>
            </Sheet>
        </>
    );
}
