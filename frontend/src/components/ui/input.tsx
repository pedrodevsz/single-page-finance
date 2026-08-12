import { cn } from "@/lib/utils";

import * as React from "react";

type InputProps = React.ComponentPropsWithRef<"input">;

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type = "text", ...props },
  ref
) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
