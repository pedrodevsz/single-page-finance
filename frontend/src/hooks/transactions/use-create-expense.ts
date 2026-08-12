"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toCreateExpensePayload } from "@/lib/transactions/transaction-mappers";
import { transactionKeys } from "@/lib/query/query-keys";
import { transactionService } from "@/services/transaction.service";
import type { ExpenseFormValues } from "@/lib/schemas/transaction.schema";

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: ExpenseFormValues) =>
      transactionService.createExpense(toCreateExpensePayload(values)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
}
