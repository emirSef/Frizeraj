import { Badge } from "@/components/ui/badge";
import type { AppointmentStatus } from "@/types";
import { statusColor, statusLabel } from "../schemas/appointment-schema";

export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <Badge variant="outline" className="gap-1.5">
      <span
        aria-hidden
        className="size-2 rounded-full"
        style={{ backgroundColor: statusColor(status) }}
      />
      {statusLabel(status)}
    </Badge>
  );
}
