"use client";

import * as React from "react";
import type { CSSProperties, ReactNode } from "react";
import { Legend, Tooltip } from "recharts";

import { cn } from "@/lib/utils";

export type ChartConfig = Record<
  string,
  {
    label?: string;
    color?: string;
  }
>;

type ChartContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  config: ChartConfig;
  children: ReactNode;
};

type ChartTooltipContentProps = {
  active?: boolean;
  payload?: Array<{
    dataKey?: string;
    name?: string;
    value?: number | string;
    color?: string;
  }>;
  label?: string;
  hideLabel?: boolean;
  config: ChartConfig;
  className?: string;
  formatter?: (value: number) => string;
};

type ChartLegendContentProps = {
  payload?: Array<{
    dataKey?: string;
    value?: string;
    color?: string;
  }>;
  config: ChartConfig;
};

function buildChartStyle(config: ChartConfig): CSSProperties {
  return Object.fromEntries(
    Object.entries(config).map(([key, value]) => [`--color-${key}`, value.color ?? "currentColor"])
  ) as CSSProperties;
}

function getConfigLabel(config: ChartConfig, key: string | undefined, fallback?: string | number) {
  if (!key) {
    return fallback === undefined ? "" : String(fallback);
  }

  return config[key]?.label ?? (fallback === undefined ? key : String(fallback));
}

export function ChartContainer({ config, className, children, style, ...props }: ChartContainerProps) {
  return (
    <div className={cn("w-full", className)} data-chart style={{ ...buildChartStyle(config), ...style }} {...props}>
      {children}
    </div>
  );
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  hideLabel,
  config,
  className,
  formatter,
}: ChartTooltipContentProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "min-w-[180px] rounded-xl border border-border bg-background px-3 py-2 shadow-lg",
        className
      )}
    >
      {hideLabel ? null : (
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          {typeof label === "string" ? label : ""}
        </p>
      )}

      <div className="space-y-1.5">
        {payload.map((entry) => {
          const dataKey = entry.dataKey?.toString();
          const entryLabel = getConfigLabel(config, dataKey, entry.name);
          const entryColor = dataKey ? config[dataKey]?.color ?? entry.color ?? "currentColor" : entry.color ?? "currentColor";
          const formattedValue =
            typeof entry.value === "number"
              ? formatter?.(entry.value) ?? new Intl.NumberFormat("pt-BR").format(entry.value)
              : String(entry.value ?? "-");

          return (
            <div className="flex items-center justify-between gap-3 text-sm" key={dataKey ?? String(entryLabel)}>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entryColor }} />
                <span className="text-muted-foreground">{entryLabel}</span>
              </div>
              <span className="font-medium text-foreground tabular-nums">{formattedValue}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ChartLegendContent({ payload, config }: ChartLegendContentProps) {
  if (!payload?.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {payload.map((entry) => {
        const dataKey = entry.dataKey?.toString();
        const entryLabel = getConfigLabel(config, dataKey, entry.value);
        const entryColor = dataKey ? config[dataKey]?.color ?? entry.color ?? "currentColor" : entry.color ?? "currentColor";

        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground" key={dataKey ?? String(entryLabel)}>
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entryColor }} />
            <span>{entryLabel}</span>
          </div>
        );
      })}
    </div>
  );
}

export { Legend as ChartLegend, Tooltip as ChartTooltip };
