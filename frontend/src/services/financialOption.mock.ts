import type { CreateFinancialOptionPayload, FinancialOption, FinancialOptionType, UpdateFinancialOptionPayload } from "@/types/financial-option";
import { delay, clone } from "@/mocks/utils/delay";
import { getMockFixedExpensesForDashboard, getMockTransactionsForDashboard } from "@/mocks/state";

const initialOptions: FinancialOption[] = [
  ["Alimentação", "EXPENSE_CATEGORY"], ["Moradia", "EXPENSE_CATEGORY"], ["Transporte", "EXPENSE_CATEGORY"], ["Saúde", "EXPENSE_CATEGORY"], ["Educação", "EXPENSE_CATEGORY"], ["Lazer", "EXPENSE_CATEGORY"], ["Assinaturas", "EXPENSE_CATEGORY"], ["Compras", "EXPENSE_CATEGORY"], ["Viagem", "EXPENSE_CATEGORY"], ["Impostos", "EXPENSE_CATEGORY"], ["Outros", "EXPENSE_CATEGORY"],
  ["Salário", "INCOME_CATEGORY"], ["Freelance", "INCOME_CATEGORY"], ["Venda", "INCOME_CATEGORY"], ["Investimento", "INCOME_CATEGORY"], ["Presente", "INCOME_CATEGORY"], ["Reembolso", "INCOME_CATEGORY"], ["Outros", "INCOME_CATEGORY"],
  ["PIX", "PAYMENT_METHOD"], ["CASH", "PAYMENT_METHOD"], ["BANK_ACCOUNT", "PAYMENT_METHOD"], ["CREDIT_CARD", "PAYMENT_METHOD"], ["BANK_SLIP", "PAYMENT_METHOD"], ["DEBIT_CARD", "PAYMENT_METHOD"], ["BANK_TRANSFER", "PAYMENT_METHOD"], ["CRYPTO", "PAYMENT_METHOD"], ["OTHER", "PAYMENT_METHOD"], ["Outros", "PAYMENT_METHOD"],
  ["PIX", "RECEIPT_METHOD"], ["CASH", "RECEIPT_METHOD"], ["BANK_ACCOUNT", "RECEIPT_METHOD"], ["CREDIT_CARD", "RECEIPT_METHOD"], ["BANK_SLIP", "RECEIPT_METHOD"], ["DEBIT_CARD", "RECEIPT_METHOD"], ["BANK_TRANSFER", "RECEIPT_METHOD"], ["CRYPTO", "RECEIPT_METHOD"], ["OTHER", "RECEIPT_METHOD"], ["Outros", "RECEIPT_METHOD"],
].map(([name, type], index) => ({
  id: `mock-option-${index + 1}`,
  name,
  type: type as FinancialOptionType,
  defaultOption: name === "Outros",
  usageCount: 0,
}));

let options = clone(initialOptions);
let nextId = 1000;

function normalize(name: string) {
  return name.trim().replace(/\s+/g, " ");
}

function find(id: string) {
  return options.find((option) => option.id === id);
}

function usageCount(option: FinancialOption) {
  const matches = (value: string) => value.localeCompare(option.name, undefined, { sensitivity: "accent" }) === 0;
  const transactions = getMockTransactionsForDashboard();
  const fixedExpenses = getMockFixedExpensesForDashboard();
  if (option.type === "INCOME_CATEGORY") return transactions.filter((item) => item.type === "INCOME" && matches(item.category)).length;
  if (option.type === "EXPENSE_CATEGORY") return transactions.filter((item) => item.type === "EXPENSE" && matches(item.category)).length + fixedExpenses.filter((item) => matches(item.category)).length;
  if (option.type === "RECEIPT_METHOD") return transactions.filter((item) => item.type === "INCOME" && matches(item.paymentMethod)).length;
  return transactions.filter((item) => item.type === "EXPENSE" && matches(item.paymentMethod)).length + fixedExpenses.filter((item) => matches(item.paymentMethod)).length;
}

function withUsage(option: FinancialOption): FinancialOption {
  return { ...option, usageCount: usageCount(option) };
}

function assertUnique(name: string, type: FinancialOptionType, id?: string) {
  const normalized = normalize(name).toLocaleLowerCase();
  if (options.some((option) => option.type === type && option.id !== id && normalize(option.name).toLocaleLowerCase() === normalized)) {
    throw new Error("Já existe uma opção com este nome.");
  }
}

export const mockFinancialOptionService = {
  async list(type: FinancialOptionType) {
    await delay();
    return clone(options.filter((option) => option.type === type).map(withUsage).sort((a, b) => a.defaultOption === b.defaultOption ? a.name.localeCompare(b.name) : a.defaultOption ? -1 : 1));
  },
  async create(payload: CreateFinancialOptionPayload) {
    await delay();
    if (options.filter((option) => option.type === payload.type).length >= 15) throw new Error("Limite de 15 opções atingido.");
    const name = normalize(payload.name);
    if (!name) throw new Error("Informe um nome.");
    assertUnique(name, payload.type);
    const option: FinancialOption = { id: `mock-option-${++nextId}`, name, type: payload.type, defaultOption: false, usageCount: 0 };
    options = [...options, option];
    return clone(option);
  },
  async update(id: string, payload: UpdateFinancialOptionPayload) {
    await delay();
    const option = find(id);
    if (!option) throw new Error("Opção não encontrada.");
    if (option.defaultOption) throw new Error("A opção padrão não pode ser editada.");
    if (usageCount(option) > 0) throw new Error("Esta opção está sendo utilizada e não pode ser editada.");
    const name = normalize(payload.name);
    assertUnique(name, option.type, id);
    option.name = name;
    return clone(option);
  },
  async remove(id: string) {
    await delay();
    const option = find(id);
    if (!option) throw new Error("Opção não encontrada.");
    if (option.defaultOption) throw new Error("A opção padrão não pode ser excluída.");
    if (usageCount(option) > 0) throw new Error("Esta opção está sendo utilizada e não pode ser excluída.");
    options = options.filter((item) => item.id !== id);
  },
};
