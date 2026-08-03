"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScissorsIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";
import { NAV_ITEMS } from "@/components/layout/nav-items";
import { useTranslations } from "@/i18n";

export function AppSidebar() {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <aside className="bg-sidebar hidden w-60 shrink-0 flex-col border-r md:flex">
      <div className="flex h-14 items-center gap-2 border-b px-4">
        <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-sm">
          <ScissorsIcon className="size-4" />
        </div>
        <span className="text-sm font-semibold tracking-tight">{APP_NAME}</span>
      </div>

      <nav className="flex-1 space-y-1 p-3" aria-label={t("nav.main")}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          const label = t(item.labelKey);

          if (item.disabled) {
            return (
              <span
                key={item.href}
                aria-disabled
                className="text-muted-foreground/60 flex cursor-not-allowed items-center gap-3 rounded-sm px-3 py-2 text-sm"
              >
                <Icon className="size-4" />
                {label}
              </span>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-sm px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
