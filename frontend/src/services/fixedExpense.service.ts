import axios from "axios";

import { api, isApiConfigured } from "@/lib/api/axios";
import type { CreateFixedExpensePayload, FixedExpenseInstallment } from "@/types/fixed-expense";
import type { FixedExpenseHistoryRecord, FixedExpenseHistorySummary } from "@/types/fixed-expense-history";

const fixedExpensesEndpoint = "/api/v1/fixed-expenses";

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

    return error.message || fallbackMessage;
}

export async function getFixedExpenses() {
    assertApiConfigured();

    try {
        const response = await api.get<FixedExpenseInstallment[]>(`${fixedExpensesEndpoint}?paid=false`);
        return response.data;
    } catch (error) {
        throw new Error(resolveApiErrorMessage(error, "Não foi possível carregar os gastos fixos."));
    }
}

export async function createFixedExpense(payload: CreateFixedExpensePayload) {
    assertApiConfigured();

    try {
        const response = await api.post<FixedExpenseInstallment>(fixedExpensesEndpoint, payload);
        return response.data;
    } catch (error) {
        throw new Error(resolveApiErrorMessage(error, "Não foi possível salvar o gasto fixo."));
    }
}

export async function deleteFixedExpense(id: string) {
    assertApiConfigured();

    try {
        await api.delete(`${fixedExpensesEndpoint}/${id}`);
    } catch (error) {
        throw new Error(resolveApiErrorMessage(error, "Não foi possível deletar o gasto fixo."));
    }
}

export async function markFixedExpenseAsPaid(id: string) {
    assertApiConfigured();

    try {
        await api.patch(`${fixedExpensesEndpoint}/${id}/paid`);
    } catch (error) {
        throw new Error(resolveApiErrorMessage(error, "Não foi possível marcar o gasto fixo como pago."));
    }
}

export async function getFixedExpenseHistory() {
    assertApiConfigured();

    try {
        const response = await api.get<FixedExpenseHistorySummary[]>(`${fixedExpensesEndpoint}/history`);
        return response.data;
    } catch (error) {
        throw new Error(resolveApiErrorMessage(error, "Não foi possível carregar o histórico de contas."));
    }
}

export async function getFixedExpenseHistoryDetails(id: string) {
    assertApiConfigured();

    try {
        const response = await api.get<FixedExpenseHistoryRecord[]>(`${fixedExpensesEndpoint}/${id}/history`);
        return response.data;
    } catch (error) {
        throw new Error(resolveApiErrorMessage(error, "Não foi possível carregar os detalhes do histórico."));
    }
}

export const fixedExpenseService = {
    getFixedExpenses,
    createFixedExpense,
    deleteFixedExpense,
    markFixedExpenseAsPaid,
    getFixedExpenseHistory,
    getFixedExpenseHistoryDetails,
};
