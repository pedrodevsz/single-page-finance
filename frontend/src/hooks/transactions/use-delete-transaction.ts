"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { dashboardKeys, transactionKeys } from "@/lib/query/query-keys";
import { transactionService } from "@/services/transaction.service";

export function useDeleteTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (transactionId: string) => transactionService.deleteTransaction(transactionId),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: transactionKeys.all });
            void queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
        },
    });
}
