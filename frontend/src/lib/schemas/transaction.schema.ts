import { z } from "zod";

import {
  expenseCategories,
  incomeCategories,
  paymentMethodOptions,
} from "@/types/transaction";

const descriptionSchema = z
  .string()
  .trim()
  .min(3, "Informe uma descrição.")
  .max(120, "A descrição deve ter no máximo 120 caracteres.");

const amountSchema = z
  .number()
  .int("Informe um valor maior que zero.")
  .positive("Informe um valor maior que zero.");

const dateSchema = z
  .string()
  .trim()
  .min(1, "Informe uma data.")
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Informe uma data válida.");

const notesSchema = z
  .string()
  .trim()
  .max(255, "A observação deve ter no máximo 255 caracteres.");

const paymentMethodSchema = z.enum(
  paymentMethodOptions.map((option) => option.value) as [
    (typeof paymentMethodOptions)[number]["value"],
    ...(typeof paymentMethodOptions)[number]["value"][]
  ],
  {
    error: () => "Selecione um meio de pagamento.",
  }
);

export const incomeSchema = z.object({
  description: descriptionSchema,
  amountInCents: amountSchema,
  category: z.enum(incomeCategories, {
    error: () => "Selecione uma categoria.",
  }),
  transactionDate: dateSchema,
  paymentMethod: paymentMethodSchema,
  notes: notesSchema,
});

export const expenseSchema = z.object({
  description: descriptionSchema,
  amountInCents: amountSchema,
  category: z.enum(expenseCategories, {
    error: () => "Selecione uma categoria.",
  }),
  transactionDate: dateSchema,
  paymentMethod: paymentMethodSchema,
  notes: notesSchema,
});

export type IncomeFormValues = z.infer<typeof incomeSchema>;
export type ExpenseFormValues = z.infer<typeof expenseSchema>;
