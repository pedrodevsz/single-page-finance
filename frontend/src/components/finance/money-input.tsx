"use client";

import type { ComponentPropsWithoutRef } from "react";

import { Input } from "@/components/ui/input";
import { formatCentsToBrl, parseBrlInputToCents } from "@/lib/money";

type MoneyInputProps = Omit<ComponentPropsWithoutRef<"input">, "value" | "onChange"> & {
  value: number;
  onValueChange: (amountInCents: number) => void;
};

export function MoneyInput({ value, onValueChange, ...props }: MoneyInputProps) {
  return (
    <Input
      inputMode="numeric"
      value={formatCentsToBrl(value)}
      onChange={(event) => onValueChange(parseBrlInputToCents(event.target.value))}
      {...props}
    />
  );
}
