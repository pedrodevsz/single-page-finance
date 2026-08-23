import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

const iconSizes = {
  sm: "size-4",
  md: "size-5",
  lg: "size-7",
} as const;

const textSizes = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
} as const;

type LoadingProps = {
  label?: string;
  size?: keyof typeof iconSizes;
  className?: string;
};

export function Loading({
  label = "Carregando...",
  size = "md",
  className,
}: LoadingProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 text-muted-foreground",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <LoaderCircle
        className={cn("shrink-0 animate-spin motion-reduce:animate-none", iconSizes[size])}
        aria-hidden="true"
      />
      <span className={cn("font-medium", textSizes[size])}>{label}</span>
    </div>
  );
}
