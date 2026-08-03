"use client";

import type { Column, ColumnDef } from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronsUpDownIcon,
  MailIcon,
  MapPinIcon,
  MarsIcon,
  PhoneIcon,
  VenusIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getInitials } from "@/utils/format";
import { GENDER_OPTIONS } from "../schemas/customer-schema";
import { CustomerRowActions } from "./customer-row-actions";
import type { CustomerListItem } from "../types";

function SortableHeader({
  column,
  label,
}: {
  column: Column<CustomerListItem, unknown>;
  label: string;
}) {
  const sorted = column.getIsSorted();
  return (
    <button
      type="button"
      className={cn(
        "text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase transition-colors",
        sorted && "text-foreground",
      )}
      onClick={column.getToggleSortingHandler()}
    >
      {label}
      {sorted === "asc" ? (
        <ArrowUpIcon className="size-3.5" />
      ) : sorted === "desc" ? (
        <ArrowDownIcon className="size-3.5" />
      ) : (
        <ChevronsUpDownIcon className="size-3.5 opacity-60" />
      )}
    </button>
  );
}

function genderMeta(value: string | null) {
  const label = GENDER_OPTIONS.find((option) => option.value === value)?.label ?? "—";
  if (value === "female") {
    return { label, Icon: VenusIcon };
  }
  if (value === "male") {
    return { label, Icon: MarsIcon };
  }
  return { label, Icon: null };
}

interface ColumnHandlers {
  onView: (customer: CustomerListItem) => void;
  onEdit: (customer: CustomerListItem) => void;
  onDelete: (customer: CustomerListItem) => void;
}

export function getCustomerColumns(handlers: ColumnHandlers): ColumnDef<CustomerListItem>[] {
  return [
    {
      id: "name",
      header: ({ column }) => <SortableHeader column={column} label="Name" />,
      cell: ({ row }) => {
        const customer = row.original;
        const fullName = `${customer.first_name} ${customer.last_name}`.trim();
        return (
          <div className="flex items-center gap-3">
            <Avatar size="sm">
              {customer.avatar_url ? (
                <AvatarImage src={customer.avatar_url} alt={fullName} />
              ) : null}
              <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
            </Avatar>
            <span className="text-foreground font-semibold whitespace-nowrap">{fullName}</span>
          </div>
        );
      },
    },
    {
      id: "email",
      accessorKey: "email",
      header: ({ column }) => <SortableHeader column={column} label="Email" />,
      cell: ({ row }) => {
        const email = row.original.email;
        if (!email) {
          return <span className="text-muted-foreground">—</span>;
        }
        return (
          <span className="text-muted-foreground inline-flex items-center gap-2">
            <MailIcon className="size-3.5 shrink-0" />
            <span className="text-foreground underline underline-offset-2">{email}</span>
          </span>
        );
      },
    },
    {
      id: "phone",
      accessorKey: "phone",
      header: ({ column }) => <SortableHeader column={column} label="Phone" />,
      cell: ({ row }) => {
        const phone = row.original.phone;
        if (!phone) {
          return <span className="text-muted-foreground">—</span>;
        }
        return (
          <span className="text-muted-foreground inline-flex items-center gap-2 whitespace-nowrap">
            <PhoneIcon className="size-3.5 shrink-0" />
            {phone}
          </span>
        );
      },
    },
    {
      id: "city",
      accessorKey: "city",
      header: ({ column }) => <SortableHeader column={column} label="Location" />,
      cell: ({ row }) => {
        const city = row.original.city;
        if (!city) {
          return <span className="text-muted-foreground">—</span>;
        }
        return (
          <span className="text-muted-foreground inline-flex items-center gap-2 whitespace-nowrap">
            <MapPinIcon className="size-3.5 shrink-0" />
            {city}
          </span>
        );
      },
    },
    {
      id: "gender",
      accessorKey: "gender",
      header: () => (
        <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Gender
        </span>
      ),
      enableSorting: false,
      cell: ({ row }) => {
        const { label, Icon } = genderMeta(row.original.gender);
        return (
          <span className="text-muted-foreground inline-flex items-center gap-2 whitespace-nowrap">
            {Icon ? <Icon className="size-3.5 shrink-0" /> : null}
            {label}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: () => (
        <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Action
        </span>
      ),
      enableSorting: false,
      cell: ({ row }) => (
        <CustomerRowActions
          customer={row.original}
          onView={handlers.onView}
          onEdit={handlers.onEdit}
          onDelete={handlers.onDelete}
        />
      ),
    },
  ];
}
