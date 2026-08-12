import axios from "axios";

import { api, isApiConfigured } from "@/lib/api/axios";
import type {
  CreateExpensePayload,
  CreateIncomePayload,
  TransactionApiType,
} from "@/types/transaction";
import type { Transaction } from "@/types/transaction";

const transactionsEndpoint = "/api/v1/transactions";

function assertApiConfigured() {
  if (!isApiConfigured) {
    throw new Error("Configure NEXT_PUBLIC_API_URL para habilitar o envio dos formulários.");
  }
}

function resolveApiErrorMessage(error: unknown, fallbackMessage: string) {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error && error.message ? error.message : fallbackMessage;
  }

  const responseData = error.response?.data as
    | { detail?: unknown; message?: unknown; title?: unknown }
    | undefined;

  if (typeof responseData?.detail === "string" && responseData.detail.trim()) {
    return responseData.detail;
  }

  if (typeof responseData?.message === "string" && responseData.message.trim()) {
    return responseData.message;
  }

  if (typeof responseData?.title === "string" && responseData.title.trim()) {
    return responseData.title;
  }

  if (typeof error.message === "string" && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
}

async function postTransaction<TPayload extends CreateIncomePayload | CreateExpensePayload>(
  payload: TPayload
) {
  assertApiConfigured();

  try {
    const response = await api.post<Transaction>(transactionsEndpoint, payload);
    return response.data;
  } catch (error) {
    throw new Error(resolveApiErrorMessage(error, "Não foi possível salvar a transação."));
  }
}

async function getTransactions(transactionType?: TransactionApiType) {
  assertApiConfigured();

  try {
    const response = await api.get<Transaction[]>(transactionsEndpoint, {
      params: transactionType ? { type: transactionType } : undefined,
    });

    return response.data;
  } catch (error) {
    throw new Error(resolveApiErrorMessage(error, "Não foi possível carregar as transações."));
  }
}

export const transactionService = {
  getTransactions,
  createIncome(payload: CreateIncomePayload) {
    return postTransaction(payload);
  },

  createExpense(payload: CreateExpensePayload) {
    return postTransaction(payload);
  },
};
