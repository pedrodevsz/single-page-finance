"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toCreateIncomePayload } from "@/lib/transactions/transaction-mappers";
import { transactionKeys } from "@/lib/query/query-keys";
import { transactionService } from "@/services/transaction.service";
import type { IncomeFormValues } from "@/lib/schemas/transaction.schema";

export function useCreateIncome() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: IncomeFormValues) =>
      transactionService.createIncome(toCreateIncomePayload(values)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: transactionKeys.all });
    },
  });
}
