import { mockTransactions } from "@/lib/mock/finance-mock";
import type {
  CreateExpensePayload,
  CreateIncomePayload,
  TransactionApiType,
} from "@/types/transaction";
import type { Transaction } from "@/types/transaction";

let transactions = [...mockTransactions];

async function postTransaction<TPayload extends CreateIncomePayload | CreateExpensePayload>(
  payload: TPayload
) {
  const now = new Date().toISOString();
  const transaction: Transaction = { ...payload, id: `mock-${now}`, notes: payload.notes ?? null, createdAt: now, updatedAt: now };
  transactions = [transaction, ...transactions];
  return transaction;
}

async function getTransactions(transactionType?: TransactionApiType) {
  return transactions.filter((transaction) => !transactionType || transaction.type === transactionType);
}

async function DeleteTransaction(transactionId: string) {
  transactions = transactions.filter((transaction) => transaction.id !== transactionId);
}

export const transactionService = {
  getTransactions,
  createIncome(payload: CreateIncomePayload) {
    return postTransaction(payload);
  },

  createExpense(payload: CreateExpensePayload) {
    return postTransaction(payload);
  },
  deleteTransaction(transactionId: string) {
    return DeleteTransaction(transactionId);
  }
};
