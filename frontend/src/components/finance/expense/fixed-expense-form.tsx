"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ManagedOptionSelect } from "@/components/finance/managed-option-select";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { MoneyInput } from "@/components/ui/money-input";
import { getLocalDateInputValue } from "@/lib/date";
import { fixedExpenseSchema, type FixedExpenseFormValues } from "@/lib/schemas/fixed-expense.schema";
import { useCreateFixedExpense } from "@/hooks/fixed-expenses/use-create-fixed-expense";

const defaultValues: FixedExpenseFormValues = {
    description: "",
    amountInCents: 0,
    category: "Outros",
    dueDate: getLocalDateInputValue(),
    paymentMethod: "PIX",
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

                <ManagedOptionSelect id="fixed-category" label="Categoria" title="Categorias" type="EXPENSE_CATEGORY" registration={register("category")} error={errors.category?.message} onOptionCreated={(name) => form.setValue("category", name, { shouldDirty: true })} />

                <ManagedOptionSelect id="fixed-payment-method" label="Pagamento" title="Formas de pagamento" type="PAYMENT_METHOD" registration={register("paymentMethod")} error={errors.paymentMethod?.message} onOptionCreated={(name) => form.setValue("paymentMethod", name, { shouldDirty: true })} />

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
