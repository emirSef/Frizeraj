"use client";

import * as React from "react";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { PlusIcon, SearchIcon } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useTranslations } from "@/i18n";
import { getServiceColumns } from "./service-columns";
import { ServiceFormDialog } from "./service-form-dialog";
import { ServicesTable } from "./services-table";
import { useServicesList } from "../hooks/use-services";
import { useSetServiceActive } from "../hooks/use-service-mutations";
import type { ServiceItem } from "../types";

export function ServicesPageClient({ canManage }: { canManage: boolean }) {
  const t = useTranslations();
  const [searchInput, setSearchInput] = React.useState("");
  const search = useDebounce(searchInput, 300);
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "name", desc: false }]);

  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ServiceItem | null>(null);

  const { data, isLoading } = useServicesList();
  const setActive = useSetServiceActive();

  const services = React.useMemo(() => data ?? [], [data]);
  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return services;
    return services.filter((service) => service.name.toLowerCase().includes(query));
  }, [services, search]);

  const handleEdit = React.useCallback((service: ServiceItem) => {
    setEditing(service);
    setFormOpen(true);
  }, []);

  const handleToggleActive = React.useCallback(
    (service: ServiceItem) => {
      if (service.is_active) {
        const confirmed = window.confirm(
          `Deactivate "${service.name}"? It will be hidden from new bookings but existing appointments keep it.`,
        );
        if (!confirmed) return;
      }
      setActive.mutate({ id: service.id, isActive: !service.is_active });
    },
    [setActive],
  );

  const columns = React.useMemo(
    () => getServiceColumns({ canManage, onEdit: handleEdit, onToggleActive: handleToggleActive }),
    [canManage, handleEdit, handleToggleActive],
  );

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("services.title")}
        description={t("services.description")}
        actions={
          canManage ? (
            <Button onClick={openCreate}>
              <PlusIcon className="size-4" />
              {t("services.newService")}
            </Button>
          ) : undefined
        }
      />

      <Card className="gap-0 p-0">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder={t("services.searchPlaceholder")}
              className="pl-8"
              aria-label={t("services.searchPlaceholder")}
            />
          </div>
        </div>

        <ServicesTable
          table={table}
          isLoading={isLoading}
          onRowClick={canManage ? handleEdit : undefined}
        />

        <div className="flex items-center justify-between gap-3 border-t p-4">
          <p className="text-muted-foreground text-sm">
            {filtered.length > 0
              ? `${filtered.length} ${filtered.length === 1 ? "service" : "services"}`
              : "No services"}
          </p>
        </div>
      </Card>

      {canManage ? (
        <ServiceFormDialog open={formOpen} onOpenChange={setFormOpen} service={editing} />
      ) : null}
    </div>
  );
}
