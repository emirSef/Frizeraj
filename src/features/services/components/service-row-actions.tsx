"use client";

import { MoreVerticalIcon, PencilIcon, PowerIcon, PowerOffIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ServiceItem } from "../types";

interface ServiceRowActionsProps {
  service: ServiceItem;
  onEdit: (service: ServiceItem) => void;
  onToggleActive: (service: ServiceItem) => void;
}

export function ServiceRowActions({ service, onEdit, onToggleActive }: ServiceRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label="Open actions">
            <MoreVerticalIcon className="size-4" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={() => onEdit(service)}>
          <PencilIcon className="size-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {service.is_active ? (
          <DropdownMenuItem variant="destructive" onClick={() => onToggleActive(service)}>
            <PowerOffIcon className="size-4" />
            Deactivate
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => onToggleActive(service)}>
            <PowerIcon className="size-4" />
            Activate
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
