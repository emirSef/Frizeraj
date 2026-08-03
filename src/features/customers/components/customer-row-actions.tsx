"use client";

import { EyeIcon, MoreVerticalIcon, PencilIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "@/i18n";
import type { CustomerListItem } from "../types";

interface CustomerRowActionsProps {
  customer: CustomerListItem;
  onView: (customer: CustomerListItem) => void;
  onEdit: (customer: CustomerListItem) => void;
  onDelete: (customer: CustomerListItem) => void;
}

export function CustomerRowActions({
  customer,
  onView,
  onEdit,
  onDelete,
}: CustomerRowActionsProps) {
  const t = useTranslations();

  return (
    <div className="flex items-center justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={t("customers.viewDetails")}
              onClick={(event) => event.stopPropagation()}
            >
              <MoreVerticalIcon className="size-4" />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={() => onView(customer)}>
            <EyeIcon className="size-4" />
            {t("customers.viewDetails")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(customer)}>
            <PencilIcon className="size-4" />
            {t("common.edit")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => onDelete(customer)}>
            <Trash2Icon className="size-4" />
            {t("common.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
