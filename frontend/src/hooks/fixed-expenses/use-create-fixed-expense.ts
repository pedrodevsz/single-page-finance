"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { fixedExpenseService } from "@/services/fixedExpense.service";
import { fixedExpenseKeys } from "@/lib/query/query-keys";
import type { FixedExpenseFormValues } from "@/lib/schemas/fixed-expense.schema";

export function useCreateFixedExpense() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (values: FixedExpenseFormValues) => fixedExpenseService.createFixedExpense(values),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: fixedExpenseKeys.all });
        },
    });
}
