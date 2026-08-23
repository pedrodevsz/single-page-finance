"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { fixedExpenseService } from "@/services/fixedExpense.service";
import { dashboardKeys, fixedExpenseKeys } from "@/lib/query/query-keys";

export function useDeleteFixedExpense() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => fixedExpenseService.deleteFixedExpense(id),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: fixedExpenseKeys.all });
            void queryClient.invalidateQueries({ queryKey: fixedExpenseKeys.history });
            void queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
        },
    });
}

export function useMarkFixedExpenseAsPaid() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => fixedExpenseService.markFixedExpenseAsPaid(id),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: fixedExpenseKeys.all });
            void queryClient.invalidateQueries({ queryKey: fixedExpenseKeys.history });
            void queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
        },
    });
}

function invalidateFixedExpenseData(queryClient: ReturnType<typeof useQueryClient>) {
    void queryClient.invalidateQueries({ queryKey: fixedExpenseKeys.all });
    void queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
}

export function useDeleteFixedExpenseSeries() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (seriesId: string) => fixedExpenseService.deleteFixedExpenseSeries(seriesId),
        onSuccess: () => invalidateFixedExpenseData(queryClient),
    });
}

export function useDeleteFixedExpenseInstallment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (installmentId: string) => fixedExpenseService.deleteFixedExpenseInstallment(installmentId),
        onSuccess: () => invalidateFixedExpenseData(queryClient),
    });
}

export function usePayFixedExpenseInstallment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (installmentId: string) => fixedExpenseService.payFixedExpenseInstallment(installmentId),
        onSuccess: () => invalidateFixedExpenseData(queryClient),
    });
}
