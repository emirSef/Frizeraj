"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { endOfWeek, startOfWeek, subDays } from "date-fns";
import { Loader2Icon, PlusIcon } from "lucide-react";
import type { DatesSetArg, EventDropArg } from "@fullcalendar/core";
import type { EventResizeDoneArg } from "@fullcalendar/interaction";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { CompleteAppointmentDialog } from "@/features/service-records";
import { useTranslations } from "@/i18n";
import {
  formatInBusinessTimeZone,
  parseBusinessDate,
  toDateString,
  toTimeString,
  todayDateString,
} from "@/lib/timezone";
import { useAppointments } from "../hooks/use-appointments";
import { useUpdateAppointmentTime } from "../hooks/use-appointment-mutations";
import { AppointmentDetailsDialog } from "./appointment-details-dialog";
import { AppointmentFormDialog } from "./appointment-form-dialog";
import type { AppointmentFormValues } from "../schemas/appointment-schema";
import type { CalendarAppointment, DateRange } from "../types";

function CalendarLoading() {
  const t = useTranslations();
  return (
    <div className="text-muted-foreground flex h-full items-center justify-center gap-2 text-sm">
      <Loader2Icon className="size-4 animate-spin" />
      {t("calendar.loading")}
    </div>
  );
}

const AppointmentCalendar = dynamic(
  () => import("./appointment-calendar").then((module) => module.AppointmentCalendar),
  {
    ssr: false,
    loading: () => <CalendarLoading />,
  },
);

interface CalendarPageClientProps {
  /** `yyyy-MM-dd` day to open on; defaults to the current week. */
  initialDate?: string;
}

export function CalendarPageClient({ initialDate }: CalendarPageClientProps) {
  const t = useTranslations();
  const focusDate = useMemo(
    () => parseBusinessDate(initialDate ?? todayDateString()),
    [initialDate],
  );
  const [range, setRange] = useState<DateRange>(() => ({
    start: toDateString(startOfWeek(focusDate, { weekStartsOn: 1 })),
    end: toDateString(endOfWeek(focusDate, { weekStartsOn: 1 })),
  }));

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CalendarAppointment | null>(null);
  const [createDefaults, setCreateDefaults] = useState<Partial<AppointmentFormValues>>();

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selected, setSelected] = useState<CalendarAppointment | null>(null);

  const [completeOpen, setCompleteOpen] = useState(false);
  const [completing, setCompleting] = useState<CalendarAppointment | null>(null);

  const appointmentsQuery = useAppointments(range);
  const updateTime = useUpdateAppointmentTime();

  const appointments = appointmentsQuery.data ?? [];

  const handleDatesSet = useCallback((arg: DatesSetArg) => {
    setRange({
      start: toDateString(arg.start),
      // arg.end is exclusive (start of the day after the last visible day).
      end: toDateString(subDays(arg.end, 1)),
    });
  }, []);

  const handleSelectSlot = useCallback((start: Date) => {
    setEditing(null);
    setCreateDefaults({
      date: toDateString(start),
      start_time: formatInBusinessTimeZone(start, "HH:mm"),
    });
    setFormOpen(true);
  }, []);

  const handleSelectEvent = useCallback((appointment: CalendarAppointment) => {
    setSelected(appointment);
    setDetailsOpen(true);
  }, []);

  const handleEventDrop = useCallback(
    (arg: EventDropArg) => {
      const { start, end, id } = arg.event;
      if (!start || !end) {
        arg.revert();
        return;
      }
      updateTime.mutate(
        {
          id,
          update: {
            date: toDateString(start),
            start_time: toTimeString(start),
            end_time: toTimeString(end),
          },
        },
        { onError: () => arg.revert() },
      );
    },
    [updateTime],
  );

  const handleEventResize = useCallback(
    (arg: EventResizeDoneArg) => {
      const { start, end, id } = arg.event;
      if (!start || !end) {
        arg.revert();
        return;
      }
      updateTime.mutate(
        {
          id,
          update: {
            date: toDateString(start),
            start_time: toTimeString(start),
            end_time: toTimeString(end),
          },
        },
        { onError: () => arg.revert() },
      );
    },
    [updateTime],
  );

  function handleEditFromDetails(appointment: CalendarAppointment) {
    setDetailsOpen(false);
    setEditing(appointment);
    setCreateDefaults(undefined);
    setFormOpen(true);
  }

  function handleCompleteFromDetails(appointment: CalendarAppointment) {
    setDetailsOpen(false);
    setCompleting(appointment);
    setCompleteOpen(true);
  }

  function openCreate() {
    setEditing(null);
    setCreateDefaults({
      date: toDateString(focusDate),
      start_time: "09:00",
    });
    setFormOpen(true);
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <PageHeader
        title={t("calendar.title")}
        description={t("calendar.description")}
        actions={
          <Button onClick={openCreate}>
            <PlusIcon className="size-4" />
            {t("calendar.newAppointment")}
          </Button>
        }
      />

      <div className="bg-card relative min-h-[32rem] flex-1 rounded-sm border p-3">
        {appointmentsQuery.isFetching ? (
          <div className="text-muted-foreground bg-background/80 absolute top-4 right-5 z-10 flex items-center gap-1.5 rounded-sm px-2 py-1 text-xs">
            <Loader2Icon className="size-3 animate-spin" />
            {t("calendar.updating")}
          </div>
        ) : null}
        <AppointmentCalendar
          initialDate={focusDate}
          appointments={appointments}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          onEventDrop={handleEventDrop}
          onEventResize={handleEventResize}
          onDatesSet={handleDatesSet}
        />
      </div>

      <AppointmentFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        appointment={editing}
        defaults={createDefaults}
      />

      <AppointmentDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        appointment={selected}
        onEdit={handleEditFromDetails}
        onComplete={handleCompleteFromDetails}
      />

      <CompleteAppointmentDialog
        open={completeOpen}
        onOpenChange={setCompleteOpen}
        appointment={completing}
      />
    </div>
  );
}
