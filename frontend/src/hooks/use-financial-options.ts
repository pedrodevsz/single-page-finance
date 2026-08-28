"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { isDataSourceConfigured } from "@/lib/config/env";
import { financialOptionKeys } from "@/lib/query/query-keys";
import { financialOptionService } from "@/services/financialOption.service";
import type { CreateFinancialOptionPayload, FinancialOptionType, UpdateFinancialOptionPayload } from "@/types/financial-option";

export function useFinancialOptions(type: FinancialOptionType) {
  return useQuery({ queryKey: financialOptionKeys.list(type), queryFn: () => financialOptionService.list(type), enabled: isDataSourceConfigured });
}

function invalidate(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: financialOptionKeys.all });
}

export function useCreateFinancialOption() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (payload: CreateFinancialOptionPayload) => financialOptionService.create(payload), onSuccess: () => invalidate(queryClient) });
}

export function useUpdateFinancialOption() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: ({ id, payload }: { id: string; payload: UpdateFinancialOptionPayload }) => financialOptionService.update(id, payload), onSuccess: () => invalidate(queryClient) });
}

export function useDeleteFinancialOption() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (id: string) => financialOptionService.remove(id), onSuccess: () => invalidate(queryClient) });
}
