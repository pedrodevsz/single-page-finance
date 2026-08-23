"use client";

import { useQuery } from "@tanstack/react-query";

import { fixedExpenseKeys } from "@/lib/query/query-keys";
import { isApiConfigured } from "@/lib/api/axios";
import { fixedExpenseService } from "@/services/fixedExpense.service";

export function useFixedExpenseHistory() {
    return useQuery({
        queryKey: fixedExpenseKeys.history,
        queryFn: fixedExpenseService.getFixedExpenseHistory,
        enabled: isApiConfigured,
    });
}

export function useFixedExpenseHistoryDetails(id: string | null) {
    return useQuery({
        queryKey: fixedExpenseKeys.historyDetails(id ?? "none"),
        queryFn: () => {
            if (!id) {
                throw new Error("Selecione uma conta fixa para consultar o histórico.");
            }
            return fixedExpenseService.getFixedExpenseHistoryDetails(id);
        },
        enabled: isApiConfigured && id !== null,
    });
}
