"use client";

import { useFinanceUiStore } from "@/stores/finance-ui.store";
import { TransactionToggleGroup } from "@/components/finance/transaction/transaction-toggle-group";
import { transactionTypeOptions } from "@/types/transaction";

const financeOptions = [
  ...transactionTypeOptions,
  { value: "fixed-expense", label: "Contas Fixas" },
] as const;

export function TransactionTypeSelector() {
  const active = useFinanceUiStore((state) => state.activeFinanceView);
  const setActive = useFinanceUiStore((state) => state.setActiveFinanceView);

  return (
    <TransactionToggleGroup
      ariaLabel="Selecionar modo financeiro"
      onChange={setActive}
      options={financeOptions}
      value={active}
    />
  );
}
