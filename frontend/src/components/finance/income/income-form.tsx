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
import { incomeSchema, type IncomeFormValues } from "@/lib/schemas/transaction.schema";
import { useCreateIncome } from "@/hooks/transactions/use-create-income";

const incomeDefaultValues: IncomeFormValues = {
  description: "",
  amountInCents: 0,
  category: "Outros",
  transactionDate: "",
  notes: "",
  paymentMethod: "PIX",
};

export function IncomeForm() {
  const createIncomeMutation = useCreateIncome();
  const form = useForm<IncomeFormValues>({
    defaultValues: incomeDefaultValues,
    resolver: zodResolver(incomeSchema),
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

  const isSubmitting = createIncomeMutation.isPending;
  const mutationErrorMessage =
    createIncomeMutation.error instanceof Error ? createIncomeMutation.error.message : null;

  const onSubmit = handleSubmit((values) => {
    createIncomeMutation.mutate(values, {
      onSuccess: () => {
        reset(incomeDefaultValues);
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
          labelFor="income-description"
        >
          <Input
            id="income-description"
            placeholder="Freelance desenvolvimento"
            {...register("description")}
          />
        </FormField>

        <FormField error={errors.amountInCents?.message} label="Valor" labelFor="income-amount">
          <Controller
            control={control}
            name="amountInCents"
            render={({ field }) => (
              <MoneyInput
                id="income-amount"
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
          labelFor="income-transaction-date"
        >
          <Input id="income-transaction-date" type="date" {...register("transactionDate")} />
        </FormField>

        <ManagedOptionSelect id="income-category" label="Categoria" title="Categorias" type="INCOME_CATEGORY" registration={register("category")} error={errors.category?.message} onOptionCreated={(name) => setValue("category", name, { shouldDirty: true })} />

        <ManagedOptionSelect id="income-payment-method" label="Recebimento" title="Formas de recebimento" type="RECEIPT_METHOD" registration={register("paymentMethod")} error={errors.paymentMethod?.message} onOptionCreated={(name) => setValue("paymentMethod", name, { shouldDirty: true })} />

        <FormField
          className="md:col-span-2"
          error={errors.notes?.message}
          hint="Opcional"
          label="Observação"
          labelFor="income-notes"
        >
          <Textarea
            id="income-notes"
            placeholder="Pagamento referente ao projeto X"
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
          {isSubmitting ? "Salvando..." : "Adicionar ganho"}
        </Button>
      </div>
    </form>
  );
}
