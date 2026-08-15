"use client";

import { useQuery } from "@tanstack/react-query";

import { toTransactionApiType } from "@/lib/transactions/transaction-mappers";
import { transactionKeys } from "@/lib/query/query-keys";
import { transactionService } from "@/services/transaction.service";
import { useFinanceUiStore } from "@/stores/finance-ui.store";
import { isApiConfigured } from "@/lib/api/axios";
import type { UseQueryResult } from "@tanstack/react-query";
import type { Transaction } from "@/types/transaction";
export function useTransactions(): UseQueryResult<Transaction[], Error> {
  const active = useFinanceUiStore((state) => state.activeFinanceView);

  if (active === "fixed-expense") {
    // return a disabled query that holds an empty array when viewing fixed expenses
    return useQuery<Transaction[], Error>({
      queryKey: ["transactions", "idle-fixed"],
      queryFn: async () => [],
      enabled: false,
      initialData: [],
    });
  }

  return useQuery({
    enabled: isApiConfigured,
    queryFn: () => transactionService.getTransactions(toTransactionApiType(active === "income" ? "income" : "expense")),
    queryKey: transactionKeys.list(active === "income" ? "income" : "expense"),
  });
}
