"use client";

import { useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import luxonPlugin from "@fullcalendar/luxon3";
import type {
  DateSelectArg,
  DatesSetArg,
  EventClickArg,
  EventDropArg,
  EventInput,
} from "@fullcalendar/core";
import type { EventResizeDoneArg } from "@fullcalendar/interaction";

import { BUSINESS_TIMEZONE } from "@/lib/timezone";
import { statusColor } from "../schemas/appointment-schema";
import { clientLabel, type CalendarAppointment } from "../types";

/** Pick readable text color (black/white) for a given hex background. */
function contrastText(hex: string): string {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return "#ffffff";
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#111827" : "#ffffff";
}

interface AppointmentCalendarProps {
  appointments: CalendarAppointment[];
  initialDate?: Date;
  onSelectSlot: (start: Date) => void;
  onSelectEvent: (appointment: CalendarAppointment) => void;
  onEventDrop: (arg: EventDropArg) => void;
  onEventResize: (arg: EventResizeDoneArg) => void;
  onDatesSet: (arg: DatesSetArg) => void;
}

export function AppointmentCalendar({
  appointments,
  initialDate,
  onSelectSlot,
  onSelectEvent,
  onEventDrop,
  onEventResize,
  onDatesSet,
}: AppointmentCalendarProps) {
  const events = useMemo<EventInput[]>(
    () =>
      appointments.map((appointment) => {
        const background = appointment.service?.color ?? "#64748b";
        const muted = appointment.status === "cancelled" || appointment.status === "no_show";
        return {
          id: appointment.id,
          title: `${clientLabel(appointment.client)} · ${appointment.service?.name ?? "Service"}`,
          start: `${appointment.date}T${appointment.start_time}`,
          end: `${appointment.date}T${appointment.end_time}`,
          backgroundColor: background,
          borderColor: statusColor(appointment.status),
          textColor: contrastText(background),
          classNames: muted ? ["fc-appt-muted"] : [],
          extendedProps: { appointment },
        };
      }),
    [appointments],
  );

  return (
    <FullCalendar
      plugins={[timeGridPlugin, interactionPlugin, luxonPlugin]}
      initialView="timeGridWeek"
      initialDate={initialDate}
      timeZone={BUSINESS_TIMEZONE}
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "timeGridWeek,timeGridDay",
      }}
      buttonText={{ today: "Today", week: "Week", day: "Day" }}
      firstDay={1}
      allDaySlot={false}
      nowIndicator
      editable
      eventResizableFromStart
      selectable
      selectMirror
      expandRows
      height="100%"
      slotDuration="00:30:00"
      slotMinTime="07:00:00"
      slotMaxTime="21:00:00"
      events={events}
      select={(arg: DateSelectArg) => onSelectSlot(arg.start)}
      eventClick={(arg: EventClickArg) =>
        onSelectEvent(arg.event.extendedProps.appointment as CalendarAppointment)
      }
      eventDrop={onEventDrop}
      eventResize={onEventResize}
      datesSet={onDatesSet}
    />
  );
}
