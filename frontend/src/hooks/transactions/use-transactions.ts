"use client";

import { useQuery } from "@tanstack/react-query";

import { isApiConfigured } from "@/lib/api/axios";
import { toTransactionApiType } from "@/lib/transactions/transaction-mappers";
import { transactionKeys } from "@/lib/query/query-keys";
import { transactionService } from "@/services/transaction.service";
import { useFinanceUiStore } from "@/stores/finance-ui.store";
import type { UseQueryResult } from "@tanstack/react-query";
import type { Transaction } from "@/types/transaction";
export function useTransactions(): UseQueryResult<Transaction[], Error> {
  const active = useFinanceUiStore((state) => state.activeFinanceView);
  const isFixedExpenseView = active === "fixed-expense";

  return useQuery<Transaction[], Error>({
    enabled: isApiConfigured && !isFixedExpenseView,
    initialData: isFixedExpenseView ? [] : undefined,
    queryFn: () => isFixedExpenseView
      ? Promise.resolve([])
      : transactionService.getTransactions(toTransactionApiType(active === "income" ? "income" : "expense")),
    queryKey: isFixedExpenseView
      ? ["transactions", "idle-fixed"]
      : transactionKeys.list(active === "income" ? "income" : "expense"),
  });
}
