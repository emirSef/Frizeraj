import { AppMobileNav } from "@/components/layout/app-mobile-nav";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { UserMenu } from "@/features/auth";
import { APP_NAME } from "@/lib/constants";
import type { UserRole } from "@/types";

interface AppShellProps {
  children: React.ReactNode;
  user: {
    fullName: string;
    email: string | null;
    role: UserRole | null;
  };
}

export function AppShell({ children, user }: AppShellProps) {
  return (
    <div className="flex min-h-svh w-full">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="bg-background/80 sticky top-0 z-10 flex h-14 items-center justify-between gap-2 border-b px-4 backdrop-blur">
          <span className="text-sm font-semibold tracking-tight md:hidden">{APP_NAME}</span>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <UserMenu fullName={user.fullName} email={user.email} role={user.role} />
          </div>
        </header>
        <main className="flex-1 p-4 pb-20 md:p-6 md:pb-6">{children}</main>
        <AppMobileNav />
      </div>
    </div>
  );
}
