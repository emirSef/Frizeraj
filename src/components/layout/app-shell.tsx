import { AppSidebar } from "@/components/layout/app-sidebar";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { UserMenu } from "@/features/auth";
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
        <header className="bg-background/80 sticky top-0 z-10 flex h-14 items-center justify-end gap-2 border-b px-4 backdrop-blur">
          <ThemeToggle />
          <UserMenu fullName={user.fullName} email={user.email} role={user.role} />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
