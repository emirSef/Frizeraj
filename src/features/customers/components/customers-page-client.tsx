"use client";

import * as React from "react";
import { getCoreRowModel, useReactTable, type SortingState } from "@tanstack/react-table";
import { PlusIcon, SearchIcon } from "lucide-react";

import { todayDateString } from "@/lib/timezone";

import { HeaderSlotContent } from "@/components/layout/header-slot";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AppointmentFormDialog } from "@/features/calendar/components/appointment-form-dialog";
import type { AppointmentFormValues } from "@/features/calendar/schemas/appointment-schema";
import { useDebounce } from "@/hooks/use-debounce";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { useTranslations } from "@/i18n";
import { getCustomerColumns } from "./customer-columns";
import { CustomerDetailsDialog } from "./customer-details-dialog";
import { CustomerFormDialog } from "./customer-form-dialog";
import { CustomersGrid } from "./customers-grid";
import { CustomersTable } from "./customers-table";
import { CustomersSortFilter, CustomersViewToggle } from "./customers-toolbar";
import { useCustomers } from "../hooks/use-customers";
import { useDeleteCustomer } from "../hooks/use-customer-mutations";
import {
  DEFAULT_CUSTOMER_FILTERS,
  type CustomerFilters,
  type CustomerListItem,
  type CustomerSortField,
  type CustomerViewMode,
  type SortOrder,
} from "../types";

export function CustomersPageClient() {
  const t = useTranslations();
  const [searchInput, setSearchInput] = React.useState("");
  const search = useDebounce(searchInput, 300);

  const [page, setPage] = React.useState(1);
  const pageSize = DEFAULT_PAGE_SIZE;
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "name", desc: false }]);
  const [filters, setFilters] = React.useState<CustomerFilters>(DEFAULT_CUSTOMER_FILTERS);
  const [view, setView] = React.useState<CustomerViewMode>("list");

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingCustomer, setEditingCustomer] = React.useState<CustomerListItem | null>(null);
  const [editReturnToDetails, setEditReturnToDetails] = React.useState(false);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [detailsCustomer, setDetailsCustomer] = React.useState<CustomerListItem | null>(null);
  const [appointmentFormOpen, setAppointmentFormOpen] = React.useState(false);
  const [appointmentDefaults, setAppointmentDefaults] = React.useState<
    Partial<AppointmentFormValues> | undefined
  >(undefined);
  const [appointmentReturnToDetails, setAppointmentReturnToDetails] = React.useState(false);

  const sortField = (sorting[0]?.id ?? "name") as CustomerSortField;
  const sortOrder: SortOrder = sorting[0]?.desc ? "desc" : "asc";

  // Reset to the first page whenever the query inputs change.
  React.useEffect(() => {
    setPage(1);
  }, [search, sortField, sortOrder, filters]);

  const { data, isLoading, isFetching } = useCustomers({
    search,
    page,
    pageSize,
    sortField,
    sortOrder,
    ...filters,
  });

  const deleteCustomer = useDeleteCustomer();

  const rows = data?.rows ?? [];
  const total = data?.count ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const handleView = React.useCallback((customer: CustomerListItem) => {
    setDetailsCustomer(customer);
    setDetailsOpen(true);
  }, []);

  const handleEdit = React.useCallback((customer: CustomerListItem) => {
    setEditingCustomer(customer);
    setEditReturnToDetails(false);
    setFormOpen(true);
  }, []);

  const handleEditFromDetails = React.useCallback((customer: CustomerListItem) => {
    setDetailsCustomer(customer);
    setDetailsOpen(false);
    setEditingCustomer(customer);
    setEditReturnToDetails(true);
    setFormOpen(true);
  }, []);

  const handleBackFromEdit = React.useCallback(() => {
    setFormOpen(false);
    setEditReturnToDetails(false);
    setDetailsOpen(true);
  }, []);

  const handleFormOpenChange = React.useCallback((open: boolean) => {
    setFormOpen(open);
    if (!open) {
      setEditReturnToDetails(false);
    }
  }, []);

  const handleNewAppointmentFromDetails = React.useCallback((customer: CustomerListItem) => {
    setDetailsCustomer(customer);
    setDetailsOpen(false);
    setAppointmentReturnToDetails(true);
    setAppointmentDefaults({
      client_id: customer.id,
      date: todayDateString(),
      start_time: "09:00",
    });
    setAppointmentFormOpen(true);
  }, []);

  const handleBackFromAppointment = React.useCallback(() => {
    setAppointmentFormOpen(false);
    setAppointmentReturnToDetails(false);
    setDetailsOpen(true);
  }, []);

  const handleAppointmentOpenChange = React.useCallback((open: boolean) => {
    setAppointmentFormOpen(open);
    if (!open) {
      setAppointmentReturnToDetails(false);
    }
  }, []);

  const handleDelete = React.useCallback(
    (customer: CustomerListItem) => {
      const name = `${customer.first_name} ${customer.last_name}`.trim();
      if (window.confirm(t("customers.deleteConfirm", { name }))) {
        deleteCustomer.mutate(customer.id);
      }
    },
    [deleteCustomer, t],
  );

  const handleSortChange = React.useCallback(
    (nextField: CustomerSortField, nextOrder: SortOrder) => {
      setSorting([{ id: nextField, desc: nextOrder === "desc" }]);
    },
    [],
  );

  const columns = React.useMemo(
    () => getCustomerColumns({ onView: handleView, onEdit: handleEdit, onDelete: handleDelete }),
    [handleView, handleEdit, handleDelete],
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    manualSorting: true,
    manualPagination: true,
    pageCount,
    getCoreRowModel: getCoreRowModel(),
  });

  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, total);

  function openCreate() {
    setEditingCustomer(null);
    setEditReturnToDetails(false);
    setFormOpen(true);
  }

  return (
    <div className="space-y-6">
      <HeaderSlotContent>
        <div className="relative w-full max-w-md">
          <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder={t("customers.searchPlaceholder")}
            className="pl-8"
            aria-label={t("customers.searchPlaceholder")}
          />
        </div>
      </HeaderSlotContent>

      <PageHeader
        title={t("customers.title")}
        titleAside={<CustomersViewToggle view={view} onViewChange={setView} />}
        className="-mx-4 border-b px-4 md:-mx-6 md:px-6"
        actions={
          <>
            {isFetching ? (
              <span className="text-muted-foreground text-xs">{t("customers.updating")}</span>
            ) : null}
            <CustomersSortFilter
              sortField={sortField}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
              filters={filters}
              onFiltersChange={setFilters}
            />
            <Separator orientation="vertical" className="mx-1 hidden h-[30px] w-[2px] sm:block" />
            <Button onClick={openCreate}>
              <PlusIcon className="size-4" />
              {t("customers.newCustomer")}
            </Button>
          </>
        }
      />

      <Card className="gap-0 p-0">
        {view === "list" ? (
          <CustomersTable table={table} isLoading={isLoading} onRowClick={handleView} />
        ) : (
          <CustomersGrid
            customers={rows}
            isLoading={isLoading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        <div className="flex flex-col items-center justify-between gap-3 border-t p-4 sm:flex-row">
          <p className="text-muted-foreground text-sm">
            {total > 0
              ? t("customers.showing", { from: rangeStart, to: rangeEnd, total })
              : t("customers.noCustomers")}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1 || isFetching}
            >
              {t("common.previous")}
            </Button>
            <span className="text-muted-foreground text-sm">
              {t("customers.pageOf", { page, pages: pageCount })}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
              disabled={page >= pageCount || isFetching}
            >
              {t("common.next")}
            </Button>
          </div>
        </div>
      </Card>

      <CustomerFormDialog
        open={formOpen}
        onOpenChange={handleFormOpenChange}
        customer={editingCustomer}
        onBack={editReturnToDetails ? handleBackFromEdit : undefined}
      />
      <CustomerDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        customer={detailsCustomer}
        onEdit={handleEditFromDetails}
        onNewAppointment={handleNewAppointmentFromDetails}
      />
      <AppointmentFormDialog
        open={appointmentFormOpen}
        onOpenChange={handleAppointmentOpenChange}
        defaults={appointmentDefaults}
        preferredClient={
          detailsCustomer && appointmentDefaults?.client_id === detailsCustomer.id
            ? {
                id: detailsCustomer.id,
                first_name: detailsCustomer.first_name,
                last_name: detailsCustomer.last_name,
              }
            : null
        }
        lockClient={appointmentReturnToDetails}
        onBack={appointmentReturnToDetails ? handleBackFromAppointment : undefined}
      />
    </div>
  );
}
