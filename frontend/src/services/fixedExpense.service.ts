import axios from "axios";

import { api, isApiConfigured } from "@/lib/api/axios";
import type { CreateFixedExpensePayload, FixedExpense } from "@/types/fixed-expense";

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

    if (typeof error.message === "string" && error.message.trim()) {
        return error.message;
    }

    return fallbackMessage;
}

export async function getFixedExpenses() {
    assertApiConfigured();

    try {
        const response = await api.get<FixedExpense[]>(fixedExpensesEndpoint + "?paid=false");
        return response.data;
    } catch (error) {
        throw new Error(resolveApiErrorMessage(error, "Não foi possível carregar os gastos fixos."));
    }
}

export async function createFixedExpense(payload: CreateFixedExpensePayload) {
    assertApiConfigured();

    try {
        const response = await api.post<FixedExpense>(fixedExpensesEndpoint, payload);
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

export const fixedExpenseService = {
    getFixedExpenses,
    createFixedExpense,
    deleteFixedExpense,
    markFixedExpenseAsPaid,
};
