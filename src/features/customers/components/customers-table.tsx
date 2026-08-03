"use client";

import { flexRender, type Table as TableInstance } from "@tanstack/react-table";
import { UsersIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";
import type { CustomerListItem } from "../types";

interface CustomersTableProps {
  table: TableInstance<CustomerListItem>;
  isLoading: boolean;
  onRowClick?: (customer: CustomerListItem) => void;
}

export function CustomersTable({ table, isLoading, onRowClick }: CustomersTableProps) {
  const columnCount = table.getAllLeafColumns().length;
  const rows = table.getRowModel().rows;

  return (
    <div className="w-full p-4">
      <Table className="border-separate border-spacing-y-2">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="hover:bg-transparent border-0 bg-transparent"
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    "bg-muted/60 text-muted-foreground h-11 px-4 first:rounded-l-sm last:rounded-r-sm",
                    header.column.id === "actions" && "text-right",
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <TableRow
                key={`skeleton-${index}`}
                className="hover:bg-transparent border-0 bg-transparent"
              >
                {Array.from({ length: columnCount }).map((__, cellIndex) => (
                  <TableCell
                    key={`skeleton-cell-${cellIndex}`}
                    className="bg-card border-border h-16 border-y px-4 first:rounded-l-sm first:border-l last:rounded-r-sm last:border-r"
                  >
                    <Skeleton className="h-5 w-full max-w-[140px]" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : rows.length ? (
            rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                className={cn(
                  "hover:bg-transparent border-0 bg-transparent",
                  onRowClick && "cursor-pointer",
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    onClick={
                      cell.column.id === "actions"
                        ? (event) => event.stopPropagation()
                        : undefined
                    }
                    className={cn(
                      "bg-card border-border h-16 border-y px-4 transition-colors first:rounded-l-sm first:border-l last:rounded-r-sm last:border-r",
                      "group-hover/row:bg-muted/20",
                      onRowClick && "hover:bg-muted/20",
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent border-0">
              <TableCell colSpan={columnCount} className="h-64 p-0">
                <EmptyState
                  icon={UsersIcon}
                  title="No customers found"
                  description="Try adjusting your search, or add your first customer."
                  className="border-0"
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
