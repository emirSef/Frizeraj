import type { Metadata } from "next";

import { getSessionUser } from "@/features/auth/queries";
import { createClient } from "@/lib/supabase/server";
import { DashboardOverview } from "./dashboard-overview";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await getSessionUser();
  const supabase = await createClient();

  const [{ count: clientCount }, { count: appointmentCount }, { count: serviceCount }] =
    await Promise.all([
      supabase.from("clients").select("*", { count: "exact", head: true }),
      supabase.from("appointments").select("*", { count: "exact", head: true }),
      supabase.from("services").select("*", { count: "exact", head: true }),
    ]);

  const fullName = session?.profile?.full_name || session?.email || "there";
  const role = session?.profile?.role ?? null;

  return (
    <DashboardOverview
      fullName={fullName}
      role={role}
      clientCount={clientCount ?? 0}
      appointmentCount={appointmentCount ?? 0}
      serviceCount={serviceCount ?? 0}
    />
  );
}
