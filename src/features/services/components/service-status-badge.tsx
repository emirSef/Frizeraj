import { Badge } from "@/components/ui/badge";

export function ServiceStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge variant={isActive ? "secondary" : "outline"} className="gap-1.5">
      <span
        aria-hidden
        className={isActive ? "size-2 rounded-full bg-emerald-500" : "size-2 rounded-full bg-muted-foreground"}
      />
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );
}
