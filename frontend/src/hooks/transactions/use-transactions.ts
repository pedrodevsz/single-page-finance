"use client";

import { useQuery } from "@tanstack/react-query";

import { toTransactionApiType } from "@/lib/transactions/transaction-mappers";
import { transactionKeys } from "@/lib/query/query-keys";
import { transactionService } from "@/services/transaction.service";
import { useFinanceUiStore } from "@/stores/finance-ui.store";
import { isApiConfigured } from "@/lib/api/axios";

export function useTransactions() {
  const transactionListType = useFinanceUiStore((state) => state.transactionListType);

  return useQuery({
    enabled: isApiConfigured,
    queryFn: () => transactionService.getTransactions(toTransactionApiType(transactionListType)),
    queryKey: transactionKeys.list(transactionListType),
  });
}
