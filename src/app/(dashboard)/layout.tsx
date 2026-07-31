import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { getSessionUser } from "@/features/auth/queries";
import { ROUTES } from "@/lib/constants";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionUser();

  // The middleware already guards these routes; this is a defense-in-depth check
  // that also gives us the profile for the shell.
  if (!session) {
    redirect(ROUTES.login);
  }

  return (
    <AppShell
      user={{
        fullName: session.profile?.full_name ?? "",
        email: session.email,
        role: session.profile?.role ?? null,
      }}
    >
      {children}
    </AppShell>
  );
}
