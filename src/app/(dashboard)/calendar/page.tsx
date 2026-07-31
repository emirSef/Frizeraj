import type { Metadata } from "next";

import { CalendarPageClient } from "@/features/calendar";

export const metadata: Metadata = {
  title: "Calendar",
};

export default function CalendarPage() {
  return <CalendarPageClient />;
}
