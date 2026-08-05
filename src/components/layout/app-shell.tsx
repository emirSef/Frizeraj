import { AppHeader } from "@/components/layout/app-header";
import { AppMobileNav } from "@/components/layout/app-mobile-nav";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { HeaderSlotProvider } from "@/components/layout/header-slot";
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
    <HeaderSlotProvider>
      <div className="flex min-h-svh w-full">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AppHeader user={user} />
          <main className="flex-1 p-4 pb-20 md:p-6 md:pb-6">{children}</main>
          <AppMobileNav />
        </div>
      </div>
    </HeaderSlotProvider>
  );
}
