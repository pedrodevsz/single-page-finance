"use client";

import { useEffect } from "react";
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
import { expenseSchema, type ExpenseFormValues } from "@/lib/schemas/transaction.schema";
import { useCreateExpense } from "@/hooks/transactions/use-create-expense";

const expenseDefaultValues: ExpenseFormValues = {
  description: "",
  amountInCents: 0,
  category: "Outros",
  transactionDate: "",
  notes: "",
  paymentMethod: "PIX",
};

export function ExpenseForm() {
  const createExpenseMutation = useCreateExpense();
  const form = useForm<ExpenseFormValues>({
    defaultValues: expenseDefaultValues,
    resolver: zodResolver(expenseSchema),
  });

  const {
    control,
    getValues,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
  } = form;

  const isSubmitting = createExpenseMutation.isPending;
  const mutationErrorMessage =
    createExpenseMutation.error instanceof Error ? createExpenseMutation.error.message : null;

  const onSubmit = handleSubmit((values) => {
    createExpenseMutation.mutate(values, {
      onSuccess: () => {
        reset(expenseDefaultValues);
        setValue("transactionDate", getLocalDateInputValue(), { shouldDirty: false });
      },
    });
  });

  useEffect(() => {
    if (!getValues("transactionDate")) {
      setValue("transactionDate", getLocalDateInputValue(), { shouldDirty: false });
    }
  }, [getValues, setValue]);

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          className="md:col-span-2"
          error={errors.description?.message}
          label="Descrição"
          labelFor="expense-description"
        >
          <Input id="expense-description" placeholder="Supermercado" {...register("description")} />
        </FormField>

        <FormField error={errors.amountInCents?.message} label="Valor" labelFor="expense-amount">
          <Controller
            control={control}
            name="amountInCents"
            render={({ field }) => (
              <MoneyInput
                id="expense-amount"
                placeholder="R$ 0,00"
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />
        </FormField>

        <FormField
          error={errors.transactionDate?.message}
          label="Data"
          labelFor="expense-transaction-date"
        >
          <Input id="expense-transaction-date" type="date" {...register("transactionDate")} />
        </FormField>

        <ManagedOptionSelect id="expense-category" label="Categoria" title="Categorias" type="EXPENSE_CATEGORY" registration={register("category")} error={errors.category?.message} onOptionCreated={(name) => setValue("category", name, { shouldDirty: true })} />

        <ManagedOptionSelect id="expense-payment-method" label="Pagamento" title="Formas de pagamento" type="PAYMENT_METHOD" registration={register("paymentMethod")} error={errors.paymentMethod?.message} onOptionCreated={(name) => setValue("paymentMethod", name, { shouldDirty: true })} />

        <FormField
          className="md:col-span-2"
          error={errors.notes?.message}
          hint="Opcional"
          label="Observação"
          labelFor="expense-notes"
        >
          <Textarea
            id="expense-notes"
            placeholder="Compra parcelada no cartão"
            {...register("notes")}
          />
        </FormField>
      </div>

      {mutationErrorMessage ? (
        <Alert variant="destructive">
          <AlertDescription>{mutationErrorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Salvando..." : "Adicionar gasto"}
        </Button>
      </div>
    </form>
  );
}
