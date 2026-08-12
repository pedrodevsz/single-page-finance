export const transactionTypeOptions = [
  { value: "income", label: "Ganhos" },
  { value: "expense", label: "Gastos" },
] as const;

export type TransactionType = (typeof transactionTypeOptions)[number]["value"];

export type TransactionApiType = "INCOME" | "EXPENSE";

export const paymentMethodOptions = [
  { value: "PIX", label: "Pix" },
  { value: "CASH", label: "Dinheiro" },
  { value: "BANK_ACCOUNT", label: "Conta bancária" },
  { value: "CREDIT_CARD", label: "Cartão de crédito" },
  { value: "DEBIT_CARD", label: "Cartão de débito" },
  { value: "BANK_TRANSFER", label: "Transferência bancária" },
  { value: "CRYPTO", label: "Cripto" },
  { value: "OTHER", label: "Outro" },
] as const;

export type PaymentMethod = (typeof paymentMethodOptions)[number]["value"];

export const incomeCategories = [
  "Salário",
  "Freelance",
  "Venda",
  "Investimento",
  "Presente",
  "Reembolso",
  "Outros",
] as const;

export type IncomeCategory = (typeof incomeCategories)[number];

export const expenseCategories = [
  "Alimentação",
  "Moradia",
  "Transporte",
  "Saúde",
  "Educação",
  "Lazer",
  "Assinaturas",
  "Compras",
  "Viagem",
  "Impostos",
  "Outros",
] as const;

export type ExpenseCategory = (typeof expenseCategories)[number];

export interface Transaction {
  id: string;
  type: TransactionApiType;
  description: string;
  amountInCents: number;
  category: string;
  transactionDate: string;
  paymentMethod: PaymentMethod;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionBasePayload {
  type: TransactionApiType;
  description: string;
  amountInCents: number;
  category: string;
  transactionDate: string;
  paymentMethod: PaymentMethod;
  notes?: string | null;
}

export interface CreateIncomePayload extends TransactionBasePayload {
  type: "INCOME";
}

export interface CreateExpensePayload extends TransactionBasePayload {
  type: "EXPENSE";
}
