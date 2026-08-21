"use client";

import { useQuery } from "@tanstack/react-query";

import { fixedExpenseKeys } from "@/lib/query/query-keys";
import { fixedExpenseService } from "@/services/fixedExpense.service";

export function useFixedExpenses() {
    return useQuery({
        queryFn: () => fixedExpenseService.getFixedExpenses(),
        queryKey: fixedExpenseKeys.all,
    });
}
