import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CustomerStatus } from "../types";

const STATUS_STYLES: Record<CustomerStatus, string> = {
  active:
    "border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  new: "border-transparent bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
};

const STATUS_LABELS: Record<CustomerStatus, string> = {
  active: "Active",
  new: "New",
};

export function CustomerStatusBadge({ status }: { status: CustomerStatus }) {
  return (
    <Badge variant="outline" className={cn(STATUS_STYLES[status])}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
