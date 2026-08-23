"use client";

import { useQuery } from "@tanstack/react-query";

import { isApiConfigured } from "@/lib/api/axios";
import { dashboardKeys } from "@/lib/query/query-keys";
import { dashboardService } from "@/services/dashboard.service";

export function useFinancialSummary() {
  return useQuery({
    enabled: isApiConfigured,
    queryFn: dashboardService.getSummary,
    queryKey: dashboardKeys.summary,
  });
}

export function useFinancialEvolution(months = 6) {
  return useQuery({
    enabled: isApiConfigured,
    queryFn: () => dashboardService.getEvolution(months),
    queryKey: dashboardKeys.evolution(months),
  });
}

export function useExpensesByCategory() {
  return useQuery({
    enabled: isApiConfigured,
    queryFn: dashboardService.getExpensesByCategory,
    queryKey: dashboardKeys.expensesByCategory,
  });
}
