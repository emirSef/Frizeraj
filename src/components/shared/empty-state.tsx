import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * Placeholder shown when a list or resource has no data yet.
 */
export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
<<<<<<< HEAD
        "flex flex-col items-center justify-center rounded-sm border border-dashed p-12 text-center",
=======
        "flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center",
>>>>>>> 6691118 (Add customers list/grid toolbar, filters, and sidebar mini calendar.)
        className,
      )}
    >
      {Icon ? (
        <div className="bg-muted text-muted-foreground mb-4 flex size-12 items-center justify-center rounded-full">
          <Icon className="size-6" />
        </div>
      ) : null}
      <h3 className="text-lg font-medium">{title}</h3>
      {description ? (
        <p className="text-muted-foreground mt-1 max-w-sm text-sm">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
