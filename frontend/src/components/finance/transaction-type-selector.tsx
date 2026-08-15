"use client";

import { useFinanceUiStore } from "@/stores/finance-ui.store";
import { TransactionToggleGroup } from "@/components/finance/transaction-toggle-group";
import { transactionTypeOptions } from "@/types/transaction";

const financeOptions = [
  ...transactionTypeOptions,
  { value: "fixed-expense", label: "Contas Fixas" },
];

export function TransactionTypeSelector() {
  const active = useFinanceUiStore((state) => state.activeFinanceView);
  const setActive = useFinanceUiStore((state) => state.setActiveFinanceView);

  return <TransactionToggleGroup ariaLabel="Selecionar modo financeiro" onChange={(v) => setActive(v as any)} value={active} options={financeOptions} />;
}
