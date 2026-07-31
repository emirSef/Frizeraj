import type { Metadata } from "next";

import { getSessionUser } from "@/features/auth/queries";
import { ServicesPageClient } from "@/features/services";

export const metadata: Metadata = {
  title: "Services",
};

export default async function ServicesPage() {
  const session = await getSessionUser();
  const role = session?.profile?.role ?? null;
  const canManage = role === "admin" || role === "manager";

  return <ServicesPageClient canManage={canManage} />;
}
