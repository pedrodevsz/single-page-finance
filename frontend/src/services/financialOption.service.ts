import axios from "axios";

import { useMocks } from "@/lib/config/env";
import { api } from "@/lib/api/axios";
import { mockFinancialOptionService } from "@/services/financialOption.mock";
import type { CreateFinancialOptionPayload, FinancialOption, FinancialOptionType, UpdateFinancialOptionPayload } from "@/types/financial-option";

const endpoint = "/api/v1/financial-options";

function resolveError(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) return error instanceof Error ? error.message : fallback;
  const data = error.response?.data as { detail?: unknown; message?: unknown; title?: unknown } | undefined;
  return [data?.detail, data?.message, data?.title].find((value): value is string => typeof value === "string" && value.trim().length > 0) ?? error.message ?? fallback;
}

async function request<T>(fn: () => Promise<{ data: T }>, fallback: string) {
  try {
    return (await fn()).data;
  } catch (error) {
    throw new Error(resolveError(error, fallback));
  }
}

export const financialOptionService = {
  list(type: FinancialOptionType): Promise<FinancialOption[]> {
    if (useMocks) return mockFinancialOptionService.list(type);
    return request(() => api.get<FinancialOption[]>(endpoint, { params: { type } }), "Não foi possível carregar as opções.");
  },
  create(payload: CreateFinancialOptionPayload) {
    if (useMocks) return mockFinancialOptionService.create(payload);
    return request(() => api.post<FinancialOption>(endpoint, payload), "Não foi possível criar a opção.");
  },
  update(id: string, payload: UpdateFinancialOptionPayload) {
    if (useMocks) return mockFinancialOptionService.update(id, payload);
    return request(() => api.put<FinancialOption>(`${endpoint}/${id}`, payload), "Não foi possível editar a opção.");
  },
  remove(id: string) {
    if (useMocks) return mockFinancialOptionService.remove(id);
    return request(async () => { await api.delete(`${endpoint}/${id}`); return { data: undefined }; }, "Não foi possível excluir a opção.");
  },
};
