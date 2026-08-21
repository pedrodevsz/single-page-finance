"use client";

import { cn } from "@/lib/utils";

type Option<V extends string> = { value: V; label: string };

type TransactionToggleGroupProps<V extends string> = {
  value: V;
  onChange: (value: V) => void;
  ariaLabel: string;
  options: readonly Option<V>[];
};

export function TransactionToggleGroup<V extends string>({
  value,
  onChange,
  ariaLabel,
  options,
}: TransactionToggleGroupProps<V>) {
  return (
    <div aria-label={ariaLabel} className="inline-flex rounded-full border border-border bg-muted p-1" role="group">
      {options.map((option) => {
        const isSelected = option.value === value;

        return (
          <button
            key={option.value}
            aria-pressed={isSelected}
            className={cn(
              "inline-flex h-8 items-center rounded-full px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
              isSelected ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => onChange(option.value)}
            type="button"
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
