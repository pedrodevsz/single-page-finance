"use client";

import { useFinanceUiStore } from "@/stores/finance-ui.store";
import { TransactionToggleGroup } from "@/components/finance/transaction-toggle-group";

export function TransactionTypeSelector() {
  const transactionType = useFinanceUiStore((state) => state.transactionType);
  const setTransactionType = useFinanceUiStore((state) => state.setTransactionType);

  return (
    <TransactionToggleGroup
      ariaLabel="Selecionar tipo do formulário"
      onChange={setTransactionType}
      value={transactionType}
    />
  );
}
