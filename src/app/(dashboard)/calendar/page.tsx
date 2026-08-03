import type { Metadata } from "next";

import { CalendarPageClient } from "@/features/calendar";

export const metadata: Metadata = {
  title: "Calendar",
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const initialDate = date && ISO_DATE.test(date) ? date : undefined;

  // Keyed so FullCalendar remounts on its new initial date when the query changes.
  return <CalendarPageClient key={initialDate ?? "today"} initialDate={initialDate} />;
}
