"use client";

import { useQuery } from "@tanstack/react-query";

import { fixedExpenseKeys } from "@/lib/query/query-keys";
import { fixedExpenseService } from "@/services/fixedExpense.service";
import { isApiConfigured } from "@/lib/api/axios";

export function useFixedExpenses() {
    return useQuery({
        enabled: isApiConfigured,
        queryFn: ({ signal }) => fixedExpenseService.getFixedExpenses(),
        queryKey: fixedExpenseKeys.all,
    });
}
