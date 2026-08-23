"use client";

import { useQuery } from "@tanstack/react-query";

import { isApiConfigured } from "@/lib/api/axios";
import { fixedExpenseKeys } from "@/lib/query/query-keys";
import { fixedExpenseService } from "@/services/fixedExpense.service";

export function useFixedExpenses() {
    return useQuery({
        enabled: isApiConfigured,
        queryFn: () => fixedExpenseService.getFixedExpenses(),
        queryKey: fixedExpenseKeys.all,
    });
}
