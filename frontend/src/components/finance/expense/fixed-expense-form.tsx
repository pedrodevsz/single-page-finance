"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { MoneyInput } from "@/components/ui/money-input";
import { paymentMethodOptions, expenseCategories } from "@/types/transaction";
import { getLocalDateInputValue } from "@/lib/date";
import { fixedExpenseSchema, type FixedExpenseFormValues } from "@/lib/schemas/fixed-expense.schema";
import { useCreateFixedExpense } from "@/hooks/fixed-expenses/use-create-fixed-expense";

const defaultValues: FixedExpenseFormValues = {
    description: "",
    amountInCents: 0,
    category: expenseCategories[0],
    dueDate: getLocalDateInputValue(),
    paymentMethod: paymentMethodOptions[0].value,
    notes: "",
    installments: null,
};

export function FixedExpenseForm() {
    const createMutation = useCreateFixedExpense();
    const form = useForm<FixedExpenseFormValues>({ defaultValues, resolver: zodResolver(fixedExpenseSchema) });

    const { control, register, handleSubmit, reset, formState: { errors } } = form;

    const isSubmitting = createMutation.isPending;
    const mutationErrorMessage = createMutation.error instanceof Error ? createMutation.error.message : null;

    const onSubmit = handleSubmit((values) => {
        createMutation.mutate(values, {
            onSuccess: () => {
                reset(defaultValues);
            },
        });
    });

    return (
        <form className="space-y-5" onSubmit={onSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
                <FormField className="md:col-span-2" error={errors.description?.message} label="Descrição" labelFor="fixed-description">
                    <Input id="fixed-description" placeholder="Aluguel" {...register("description")} />
                </FormField>

                <FormField error={errors.amountInCents?.message} label="Valor" labelFor="fixed-amount">
                    <Controller
                        control={control}
                        name="amountInCents"
                        render={({ field }) => (
                            <MoneyInput id="fixed-amount" placeholder="R$ 0,00" value={field.value} onValueChange={field.onChange} />
                        )}
                    />
                </FormField>

                <FormField error={errors.dueDate?.message} label="Vencimento (data)" labelFor="fixed-due-date">
                    <Input id="fixed-due-date" type="date" {...register("dueDate")} />
                </FormField>

                <FormField error={errors.category?.message} label="Categoria" labelFor="fixed-category">
                    <Select id="fixed-category" {...register("category")}>
                        {expenseCategories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </Select>
                </FormField>

                <FormField error={errors.paymentMethod?.message} label="Pagamento" labelFor="fixed-payment-method">
                    <Select id="fixed-payment-method" {...register("paymentMethod")}>{paymentMethodOptions.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                    ))}</Select>
                </FormField>

                <FormField className="md:col-span-2" error={errors.notes?.message} hint="Opcional" label="Observação" labelFor="fixed-notes">
                    <Textarea id="fixed-notes" placeholder="Contrato de aluguel" {...register("notes")} />
                </FormField>

                <FormField className="md:col-span-2" error={errors.installments?.message} hint="Opcional" label="Parcelas" labelFor="fixed-installments">
                    <Input id="fixed-installments" type="number" min={1} {...register("installments", { valueAsNumber: true })} />
                </FormField>
            </div>

            {mutationErrorMessage ? (
                <Alert variant="destructive">
                    <AlertDescription>{mutationErrorMessage}</AlertDescription>
                </Alert>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Salvando..." : "Adicionar gasto fixo"}</Button>
            </div>
        </form>
    );
}
