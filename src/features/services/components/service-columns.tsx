"use client";

import type { Column, ColumnDef } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ServiceRowActions } from "./service-row-actions";
import { ServiceStatusBadge } from "./service-status-badge";
import type { ServiceItem } from "../types";

function SortableHeader({ column, label }: { column: Column<ServiceItem, unknown>; label: string }) {
  const sorted = column.getIsSorted();
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-2 h-7 gap-1 data-[sorted=true]:text-foreground"
      data-sorted={Boolean(sorted)}
      onClick={column.getToggleSortingHandler()}
    >
      {label}
      {sorted === "asc" ? (
        <ArrowUpIcon className="size-3.5" />
      ) : sorted === "desc" ? (
        <ArrowDownIcon className="size-3.5" />
      ) : (
        <ArrowUpDownIcon className="text-muted-foreground size-3.5" />
      )}
    </Button>
  );
}

interface ColumnOptions {
  canManage: boolean;
  onEdit: (service: ServiceItem) => void;
  onToggleActive: (service: ServiceItem) => void;
}

export function getServiceColumns({
  canManage,
  onEdit,
  onToggleActive,
}: ColumnOptions): ColumnDef<ServiceItem>[] {
  const columns: ColumnDef<ServiceItem>[] = [
    {
      id: "color",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <span
          aria-hidden
          className="block size-4 rounded-full ring-1 ring-foreground/10"
          style={{ backgroundColor: row.original.color }}
        />
      ),
    },
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => <SortableHeader column={column} label="Name" />,
      cell: ({ row }) => <span className="font-medium whitespace-nowrap">{row.original.name}</span>,
    },
    {
      id: "duration",
      accessorKey: "duration",
      header: ({ column }) => <SortableHeader column={column} label="Duration" />,
      cell: ({ row }) => <span className="whitespace-nowrap">{row.original.duration} min</span>,
    },
    {
      id: "default_price",
      accessorKey: "default_price",
      header: ({ column }) => <SortableHeader column={column} label="Price" />,
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.default_price} KM</span>
      ),
    },
    {
      id: "is_active",
      accessorKey: "is_active",
      header: ({ column }) => <SortableHeader column={column} label="Status" />,
      cell: ({ row }) => <ServiceStatusBadge isActive={row.original.is_active} />,
    },
  ];

  if (canManage) {
    columns.push({
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <ServiceRowActions
            service={row.original}
            onEdit={onEdit}
            onToggleActive={onToggleActive}
          />
        </div>
      ),
    });
  }

  return columns;
}
