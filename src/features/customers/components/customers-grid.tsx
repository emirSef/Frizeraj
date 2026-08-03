"use client";

import { CalendarDaysIcon, MailIcon, MapPinIcon, PhoneIcon, UsersIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate, getInitials } from "@/utils/format";
import { useTranslations } from "@/i18n";
import { CustomerRowActions } from "./customer-row-actions";
import { CustomerStatusBadge } from "./customer-status-badge";
import { getCustomerStatus, type CustomerListItem } from "../types";

const SKELETON_COUNT = 6;

function DetailRow({ icon: Icon, value }: { icon: LucideIcon; value: string | null }) {
  return (
    <div className="text-muted-foreground flex items-center gap-2 text-sm">
      <Icon className="size-3.5 shrink-0" />
      <span className="truncate">{value ?? "—"}</span>
    </div>
  );
}

interface CustomersGridProps {
  customers: CustomerListItem[];
  isLoading: boolean;
  onView: (customer: CustomerListItem) => void;
  onEdit: (customer: CustomerListItem) => void;
  onDelete: (customer: CustomerListItem) => void;
}

export function CustomersGrid({
  customers,
  isLoading,
  onView,
  onEdit,
  onDelete,
}: CustomersGridProps) {
  const t = useTranslations();

  if (isLoading) {
    return (
      <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <div key={index} className="ring-foreground/10 rounded-xl p-4 ring-1">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
            <Skeleton className="mt-4 h-3 w-full" />
            <Skeleton className="mt-2 h-3 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (!customers.length) {
    return (
      <div className="p-4">
        <EmptyState
          icon={UsersIcon}
          title={t("customers.noCustomersFound")}
          description={t("customers.tryAdjustSearch")}
        />
      </div>
    );
  }

  return (
    <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3">
      {customers.map((customer) => {
        const fullName = `${customer.first_name} ${customer.last_name}`.trim();

        return (
          <div
            key={customer.id}
            className="bg-card ring-foreground/10 hover:ring-foreground/25 flex flex-col rounded-xl p-4 ring-1 transition-shadow"
          >
            <div className="flex items-start gap-3">
              <Avatar size="lg">
                {customer.avatar_url ? (
                  <AvatarImage src={customer.avatar_url} alt={fullName} />
                ) : null}
                <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{fullName}</p>
                <div className="mt-1">
                  <CustomerStatusBadge status={getCustomerStatus(customer)} />
                </div>
              </div>
              <CustomerRowActions
                customer={customer}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>

            <div className="mt-4 space-y-1.5">
              <DetailRow icon={MailIcon} value={customer.email} />
              <DetailRow icon={PhoneIcon} value={customer.phone} />
              <DetailRow icon={MapPinIcon} value={customer.city} />
              <DetailRow
                icon={CalendarDaysIcon}
                value={customer.last_appointment ? formatDate(customer.last_appointment) : null}
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-full"
              onClick={() => onView(customer)}
            >
              {t("customers.viewDetails")}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
