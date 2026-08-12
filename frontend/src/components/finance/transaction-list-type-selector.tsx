"use client";

import { TransactionToggleGroup } from "@/components/finance/transaction-toggle-group";
import { useFinanceUiStore } from "@/stores/finance-ui.store";

export function TransactionListTypeSelector() {
  const transactionListType = useFinanceUiStore((state) => state.transactionListType);
  const setTransactionListType = useFinanceUiStore((state) => state.setTransactionListType);

  return (
    <TransactionToggleGroup
      ariaLabel="Selecionar tipo da lista"
      onChange={setTransactionListType}
      value={transactionListType}
    />
  );
}
