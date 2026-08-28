export const financialOptionTypes = [
  "EXPENSE_CATEGORY",
  "INCOME_CATEGORY",
  "PAYMENT_METHOD",
  "RECEIPT_METHOD",
] as const;

export type FinancialOptionType = (typeof financialOptionTypes)[number];

export interface FinancialOption {
  id: string;
  name: string;
  type: FinancialOptionType;
  defaultOption: boolean;
  usageCount: number;
}

export interface CreateFinancialOptionPayload {
  name: string;
  type: FinancialOptionType;
}

export interface UpdateFinancialOptionPayload {
  name: string;
}
