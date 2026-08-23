import axios from "axios";

import { api, isApiConfigured } from "@/lib/api/axios";
import type {
  DashboardSummary,
  ExpenseByCategory,
  FinancialEvolutionItem,
} from "@/types/dashboard";

const dashboardEndpoint = "/api/v1/dashboard";

function assertApiConfigured() {
  if (!isApiConfigured) {
    throw new Error("Configure NEXT_PUBLIC_API_URL para carregar a análise financeira.");
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

  return error.message || fallbackMessage;
}

async function request<T>(requestFn: () => Promise<{ data: T }>, fallbackMessage: string) {
  assertApiConfigured();

  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    throw new Error(resolveApiErrorMessage(error, fallbackMessage));
  }
}

export function getSummary() {
  return request(
    () => api.get<DashboardSummary>(`${dashboardEndpoint}/summary`),
    "Não foi possível carregar o resumo financeiro."
  );
}

export function getEvolution(months = 6) {
  return request(
    () => api.get<FinancialEvolutionItem[]>(`${dashboardEndpoint}/evolution`, { params: { months } }),
    "Não foi possível carregar a evolução financeira."
  );
}

export function getExpensesByCategory() {
  return request(
    () => api.get<ExpenseByCategory[]>(`${dashboardEndpoint}/expenses-by-category`),
    "Não foi possível carregar os gastos por categoria."
  );
}

export const dashboardService = {
  getSummary,
  getEvolution,
  getExpensesByCategory,
};
