"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { fixedExpenseService } from "@/services/fixedExpense.service";
import { fixedExpenseKeys } from "@/lib/query/query-keys";

export function useDeleteFixedExpense() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => fixedExpenseService.deleteFixedExpense(id),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: fixedExpenseKeys.all });
        },
    });
}

export function useMarkFixedExpenseAsPaid() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => fixedExpenseService.markFixedExpenseAsPaid(id),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: fixedExpenseKeys.all });
        },
    });
}
