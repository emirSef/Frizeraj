"use client";

import * as React from "react";
import {
  getCoreRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { PlusIcon, SearchIcon } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { useTranslations } from "@/i18n";
import { getCustomerColumns } from "./customer-columns";
import { CustomerDetailsDialog } from "./customer-details-dialog";
import { CustomerFormDialog } from "./customer-form-dialog";
import { CustomersTable } from "./customers-table";
import { useCustomers } from "../hooks/use-customers";
import { useDeleteCustomer } from "../hooks/use-customer-mutations";
import type { CustomerListItem, CustomerSortField } from "../types";

export function CustomersPageClient() {
  const t = useTranslations();
  const [searchInput, setSearchInput] = React.useState("");
  const search = useDebounce(searchInput, 300);

  const [page, setPage] = React.useState(1);
  const pageSize = DEFAULT_PAGE_SIZE;
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "name", desc: false }]);

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingCustomer, setEditingCustomer] = React.useState<CustomerListItem | null>(null);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [detailsCustomer, setDetailsCustomer] = React.useState<CustomerListItem | null>(null);

  const sortField = (sorting[0]?.id ?? "name") as CustomerSortField;
  const sortOrder = sorting[0]?.desc ? "desc" : "asc";

  // Reset to the first page whenever the query inputs change.
  React.useEffect(() => {
    setPage(1);
  }, [search, sortField, sortOrder]);

  const { data, isLoading, isFetching } = useCustomers({
    search,
    page,
    pageSize,
    sortField,
    sortOrder,
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
    setFormOpen(true);
  }, []);

  const handleEditFromDetails = React.useCallback(
    (customer: CustomerListItem) => {
      setDetailsOpen(false);
      handleEdit(customer);
    },
    [handleEdit],
  );

  const handleDelete = React.useCallback(
    (customer: CustomerListItem) => {
      const name = `${customer.first_name} ${customer.last_name}`.trim();
      if (window.confirm(t("customers.deleteConfirm", { name }))) {
        deleteCustomer.mutate(customer.id);
      }
    },
    [deleteCustomer, t],
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
    setFormOpen(true);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("customers.title")}
        description={t("customers.description")}
        actions={
          <Button onClick={openCreate}>
            <PlusIcon className="size-4" />
            {t("customers.newCustomer")}
          </Button>
        }
      />

      <Card className="gap-0 p-0">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder={t("customers.searchPlaceholder")}
              className="pl-8"
              aria-label={t("customers.searchPlaceholder")}
            />
          </div>
          {isFetching ? (
            <span className="text-muted-foreground text-xs">{t("customers.updating")}</span>
          ) : null}
        </div>

        <CustomersTable table={table} isLoading={isLoading} onRowClick={handleView} />

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

      <CustomerFormDialog open={formOpen} onOpenChange={setFormOpen} customer={editingCustomer} />
      <CustomerDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        customer={detailsCustomer}
        onEdit={handleEditFromDetails}
      />
    </div>
  );
}
