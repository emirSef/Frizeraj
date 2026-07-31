import type { Metadata } from "next";
import { CalendarDaysIcon, SparklesIcon, UsersIcon } from "lucide-react";

import { getSessionUser } from "@/features/auth/queries";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserRole } from "@/types";

export const metadata: Metadata = {
  title: "Dashboard",
};

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  manager: "Manager",
  stylist: "Stylist",
  receptionist: "Receptionist",
};

export default async function DashboardPage() {
  const session = await getSessionUser();
  const supabase = await createClient();

  // These counts are fetched as the authenticated user — they succeed only
  // because RLS grants read access to signed-in staff.
  const [{ count: clientCount }, { count: appointmentCount }, { count: serviceCount }] =
    await Promise.all([
      supabase.from("clients").select("*", { count: "exact", head: true }),
      supabase.from("appointments").select("*", { count: "exact", head: true }),
      supabase.from("services").select("*", { count: "exact", head: true }),
    ]);

  const fullName = session?.profile?.full_name || session?.email || "there";
  const role = session?.profile?.role ?? null;

  const stats = [
    { label: "Clients", value: clientCount ?? 0, icon: UsersIcon },
    { label: "Appointments", value: appointmentCount ?? 0, icon: CalendarDaysIcon },
    { label: "Services", value: serviceCount ?? 0, icon: SparklesIcon },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome, ${fullName}`}
        description="Here's an overview of your salon."
        actions={role ? <Badge variant="secondary">{ROLE_LABELS[role]}</Badge> : undefined}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader>
                <CardDescription className="flex items-center gap-2">
                  <Icon className="size-4" />
                  {stat.label}
                </CardDescription>
                <CardTitle className="text-3xl">{stat.value}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm">
                Total {stat.label.toLowerCase()} in your salon.
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
