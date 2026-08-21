"use client";

import { TransactionToggleGroup } from "@/components/finance/transaction/transaction-toggle-group";
import { useFinanceUiStore } from "@/stores/finance-ui.store";
import { transactionTypeOptions } from "@/types/transaction";

const financeOptions = [
  ...transactionTypeOptions,
  { value: "fixed-expense", label: "Contas Fixas" },
] as const;

export function TransactionListTypeSelector() {
  const active = useFinanceUiStore((state) => state.activeFinanceView);
  const setActive = useFinanceUiStore((state) => state.setActiveFinanceView);

  return (
    <TransactionToggleGroup
      ariaLabel="Selecionar tipo da lista"
      onChange={setActive}
      options={financeOptions}
      value={active}
    />
  );
}
