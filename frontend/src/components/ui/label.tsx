import * as React from "react";

import { cn } from "@/lib/utils";

type LabelProps = React.ComponentProps<"label">;

function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn("text-sm font-medium leading-none text-foreground", className)}
      {...props}
    />
  );
}

export { Label };
