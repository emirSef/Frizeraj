"use client";

import { CheckCircle2Icon, PencilIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/utils/format";
import { AppointmentStatusBadge } from "./appointment-status-badge";
import { useDeleteAppointment } from "../hooks/use-appointment-mutations";
import { clientLabel, type CalendarAppointment } from "../types";

interface AppointmentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: CalendarAppointment | null;
  onEdit: (appointment: CalendarAppointment) => void;
  onComplete: (appointment: CalendarAppointment) => void;
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-2 py-2">
      <dt className="text-muted-foreground text-sm">{label}</dt>
      <dd className="col-span-2 text-sm">{value || "—"}</dd>
    </div>
  );
}

export function AppointmentDetailsDialog({
  open,
  onOpenChange,
  appointment,
  onEdit,
  onComplete,
}: AppointmentDetailsDialogProps) {
  const deleteAppointment = useDeleteAppointment();

  if (!appointment) return null;

  const timeRange = `${appointment.start_time.slice(0, 5)} – ${appointment.end_time.slice(0, 5)}`;
  const isCompleted = appointment.status === "completed";

  function handleDelete() {
    if (!appointment) return;
    const confirmed = window.confirm("Delete this appointment? This cannot be undone.");
    if (!confirmed) return;
    deleteAppointment.mutate(appointment.id, { onSuccess: () => onOpenChange(false) });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between gap-3 pr-8">
            <DialogTitle>{clientLabel(appointment.client)}</DialogTitle>
            <AppointmentStatusBadge status={appointment.status} />
          </div>
          <DialogDescription>
            {appointment.service?.name ?? "Appointment"} · {formatDate(appointment.date)} ·{" "}
            {timeRange}
          </DialogDescription>
        </DialogHeader>

        <dl className="divide-y">
          <DetailRow label="Service" value={appointment.service?.name} />
          <DetailRow label="Date" value={formatDate(appointment.date)} />
          <DetailRow label="Time" value={timeRange} />
          <DetailRow label="Treatment" value={appointment.treatment} />
          <DetailRow label="Products" value={appointment.products} />
          <DetailRow label="Notes" value={appointment.notes} />
          <DetailRow
            label="Price"
            value={appointment.price != null ? `${appointment.price} KM` : "—"}
          />
        </dl>

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteAppointment.isPending}
          >
            <Trash2Icon className="size-4" />
            Delete
          </Button>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <Button type="button" variant="outline" onClick={() => onEdit(appointment)}>
              <PencilIcon className="size-4" />
              Edit
            </Button>
            <Button type="button" onClick={() => onComplete(appointment)}>
              <CheckCircle2Icon className="size-4" />
              {isCompleted ? "Edit service record" : "Complete appointment"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
