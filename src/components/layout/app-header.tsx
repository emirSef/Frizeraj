"use client";

import { HeaderSlot } from "@/components/layout/header-slot";
import { LanguageToggle } from "@/components/shared/language-toggle";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { UserMenu } from "@/features/auth";
import { APP_NAME } from "@/lib/constants";
import type { UserRole } from "@/types";

interface AppHeaderProps {
  user: {
    fullName: string;
    email: string | null;
    role: UserRole | null;
  };
}

export function AppHeader({ user }: AppHeaderProps) {
  return (
    <header className="bg-background/80 sticky top-0 z-10 flex h-14 items-center gap-3 border-b px-4 backdrop-blur">
      <span className="text-sm font-semibold tracking-tight md:hidden">{APP_NAME}</span>
      <HeaderSlot className="min-w-0 flex-1" />
      <div className="ml-auto flex shrink-0 items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
        <UserMenu fullName={user.fullName} email={user.email} role={user.role} />
      </div>
    </header>
  );
}
