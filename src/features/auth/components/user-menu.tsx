"use client";

import * as React from "react";
import { LogOutIcon } from "lucide-react";

import { signOut } from "@/features/auth/actions";
import { getInitials } from "@/utils/format";
import type { UserRole } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "@/i18n";

interface UserMenuProps {
  fullName: string;
  email: string | null;
  role: UserRole | null;
}

export function UserMenu({ fullName, email, role }: UserMenuProps) {
  const [isPending, startTransition] = React.useTransition();
  const t = useTranslations();
  const displayName = fullName || email || t("auth.user");

  function handleSignOut() {
    startTransition(async () => {
      await signOut();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="h-auto gap-2 px-2 py-1.5"
            aria-label={t("auth.openUserMenu")}
          >
            <Avatar size="sm">
              <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
            </Avatar>
            <span className="hidden text-left sm:flex sm:flex-col sm:leading-tight">
              <span className="text-sm font-medium">{displayName}</span>
              {role ? (
                <span className="text-muted-foreground text-xs">{t(`roles.${role}`)}</span>
              ) : null}
            </span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">{displayName}</span>
            {email ? <span className="text-muted-foreground text-xs">{email}</span> : null}
            {role ? (
              <Badge variant="secondary" className="mt-1 w-fit">
                {t(`roles.${role}`)}
              </Badge>
            ) : null}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} disabled={isPending} variant="destructive">
          <LogOutIcon className="size-4" />
          {isPending ? t("auth.signingOut") : t("auth.signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
