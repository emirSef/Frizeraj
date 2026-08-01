"use client";

import { CalendarDaysIcon, SparklesIcon, UsersIcon } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "@/i18n";
import type { UserRole } from "@/types";

interface DashboardOverviewProps {
  fullName: string;
  role: UserRole | null;
  clientCount: number;
  appointmentCount: number;
  serviceCount: number;
}

export function DashboardOverview({
  fullName,
  role,
  clientCount,
  appointmentCount,
  serviceCount,
}: DashboardOverviewProps) {
  const t = useTranslations();

  const stats = [
    { key: "clients", label: t("dashboard.clients"), value: clientCount, icon: UsersIcon },
    {
      key: "appointments",
      label: t("dashboard.appointments"),
      value: appointmentCount,
      icon: CalendarDaysIcon,
    },
    { key: "services", label: t("dashboard.services"), value: serviceCount, icon: SparklesIcon },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("dashboard.welcome", { name: fullName })}
        description={t("dashboard.overview")}
        actions={
          role ? <Badge variant="secondary">{t(`roles.${role}`)}</Badge> : undefined
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.key}>
              <CardHeader>
                <CardDescription className="flex items-center gap-2">
                  <Icon className="size-4" />
                  {stat.label}
                </CardDescription>
                <CardTitle className="text-3xl">{stat.value}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm">
                {t("dashboard.totalInSalon", { label: stat.label.toLowerCase() })}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
