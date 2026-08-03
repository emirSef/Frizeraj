"use client";

import { CalendarPlusIcon, CalendarX2Icon, PencilIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/shared/empty-state";
import { ServiceRecordsTab } from "@/features/service-records";
import { useTranslations } from "@/i18n";
import { formatDate, getInitials } from "@/utils/format";
import { GENDER_OPTIONS } from "../schemas/customer-schema";
import { useCustomerAppointments } from "../hooks/use-customer-appointments";
import type { CustomerListItem } from "../types";

interface CustomerDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: CustomerListItem | null;
  onEdit: (customer: CustomerListItem) => void;
  onNewAppointment: (customer: CustomerListItem) => void;
}

function genderLabel(value: string | null): string {
  return GENDER_OPTIONS.find((option) => option.value === value)?.label ?? "—";
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-2 py-2">
      <dt className="text-muted-foreground text-sm">{label}</dt>
      <dd className="col-span-2 text-sm">{value || "—"}</dd>
    </div>
  );
}

export function CustomerDetailsDialog({
  open,
  onOpenChange,
  customer,
  onEdit,
  onNewAppointment,
}: CustomerDetailsDialogProps) {
  const t = useTranslations();
  const appointmentsQuery = useCustomerAppointments(open ? (customer?.id ?? null) : null);

  if (!customer) return null;

  const fullName = `${customer.first_name} ${customer.last_name}`.trim();
  const appointments = appointmentsQuery.data ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("customers.customerDetails")}</DialogTitle>
          <DialogDescription className="sr-only">
            View {fullName}&apos;s profile and appointment history.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3">
          <Avatar size="lg">
            {customer.avatar_url ? <AvatarImage src={customer.avatar_url} alt={fullName} /> : null}
            <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium">{fullName}</p>
            <p className="text-muted-foreground truncate text-sm">
              {customer.email ?? customer.phone ?? "No contact info"}
            </p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="mt-2">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointment History</TabsTrigger>
            <TabsTrigger value="records">Service Records</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <dl className="divide-y">
              <DetailRow label="Phone" value={customer.phone} />
              <DetailRow label="Email" value={customer.email} />
              <DetailRow label="City" value={customer.city} />
              <DetailRow label="Country" value={customer.country} />
              <DetailRow label="Gender" value={genderLabel(customer.gender)} />
              <DetailRow
                label="Birth Date"
                value={customer.birth_date ? formatDate(customer.birth_date) : "—"}
              />
              <DetailRow label="Notes" value={customer.notes} />
            </dl>
          </TabsContent>

          <TabsContent value="appointments" className="min-w-0">
            {appointmentsQuery.isLoading ? (
              <div className="space-y-2 py-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-10 w-full" />
                ))}
              </div>
            ) : appointments.length ? (
              <div className="max-h-80 min-w-0 overflow-auto rounded-sm border">
                <Table className="table-fixed">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[7rem]">Date</TableHead>
                      <TableHead>Treatment</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="w-[5rem] text-right">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell className="whitespace-nowrap">
                          {formatDate(appointment.date)}
                        </TableCell>
                        <TableCell className="truncate">
                          {appointment.treatment ?? appointment.service?.name ?? "—"}
                        </TableCell>
                        <TableCell className="text-muted-foreground truncate">
                          {appointment.products ?? "—"}
                        </TableCell>
                        <TableCell className="text-muted-foreground truncate">
                          {appointment.notes ?? "—"}
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          {appointment.price != null ? `${appointment.price} KM` : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <EmptyState
                icon={CalendarX2Icon}
                title="No appointments yet"
                description="This customer has no appointment history."
              />
            )}
          </TabsContent>

          <TabsContent value="records">
            <ServiceRecordsTab clientId={open ? customer.id : null} />
          </TabsContent>
        </Tabs>

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={() => onEdit(customer)}>
            <PencilIcon className="size-4" />
            {t("customers.edit")}
          </Button>
          <Button type="button" onClick={() => onNewAppointment(customer)}>
            <CalendarPlusIcon className="size-4" />
            {t("calendar.newAppointment")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
