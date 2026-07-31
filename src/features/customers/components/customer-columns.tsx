"use client";

import type { Column, ColumnDef } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDate, getInitials } from "@/utils/format";
import { CustomerRowActions } from "./customer-row-actions";
import { CustomerStatusBadge } from "./customer-status-badge";
import { getCustomerStatus, type CustomerListItem } from "../types";

function SortableHeader({
  column,
  label,
}: {
  column: Column<CustomerListItem, unknown>;
  label: string;
}) {
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

interface ColumnHandlers {
  onView: (customer: CustomerListItem) => void;
  onEdit: (customer: CustomerListItem) => void;
  onDelete: (customer: CustomerListItem) => void;
}

export function getCustomerColumns(handlers: ColumnHandlers): ColumnDef<CustomerListItem>[] {
  return [
    {
      id: "avatar",
      header: "",
      enableSorting: false,
      cell: ({ row }) => {
        const c = row.original;
        const fullName = `${c.first_name} ${c.last_name}`.trim();
        return (
          <Avatar size="sm">
            {c.avatar_url ? <AvatarImage src={c.avatar_url} alt={fullName} /> : null}
            <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
          </Avatar>
        );
      },
    },
    {
      id: "name",
      header: ({ column }) => <SortableHeader column={column} label="Full Name" />,
      cell: ({ row }) => (
        <span className="font-medium whitespace-nowrap">
          {`${row.original.first_name} ${row.original.last_name}`.trim()}
        </span>
      ),
    },
    {
      id: "email",
      accessorKey: "email",
      header: ({ column }) => <SortableHeader column={column} label="Email" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.email ?? "—"}</span>
      ),
    },
    {
      id: "phone",
      accessorKey: "phone",
      header: ({ column }) => <SortableHeader column={column} label="Phone" />,
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.phone ?? "—"}</span>
      ),
    },
    {
      id: "city",
      accessorKey: "city",
      header: ({ column }) => <SortableHeader column={column} label="City" />,
      cell: ({ row }) => <span>{row.original.city ?? "—"}</span>,
    },
    {
      id: "last_appointment",
      header: "Last Appointment",
      enableSorting: false,
      cell: ({ row }) => (
        <span className={cn(!row.original.last_appointment && "text-muted-foreground")}>
          {row.original.last_appointment ? formatDate(row.original.last_appointment) : "—"}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      enableSorting: false,
      cell: ({ row }) => <CustomerStatusBadge status={getCustomerStatus(row.original)} />,
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <CustomerRowActions
            customer={row.original}
            onView={handlers.onView}
            onEdit={handlers.onEdit}
            onDelete={handlers.onDelete}
          />
        </div>
      ),
    },
  ];
}
