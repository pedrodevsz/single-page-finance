import { cn } from "@/lib/utils";

import * as React from "react";

type SelectProps = React.ComponentPropsWithRef<"select">;

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, ...props },
  ref
) {
  return (
    <select
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});

Select.displayName = "Select";

export { Select };
