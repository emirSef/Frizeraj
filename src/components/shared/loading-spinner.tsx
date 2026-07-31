import { Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  label?: string;
}

export function LoadingSpinner({ className, label }: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("text-muted-foreground flex items-center gap-2 text-sm", className)}
    >
      <Loader2Icon className="size-4 animate-spin" />
      {label ? <span>{label}</span> : <span className="sr-only">Loading</span>}
    </div>
  );
}
