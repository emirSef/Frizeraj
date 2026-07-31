import type { Metadata } from "next";

import { CustomersPageClient } from "@/features/customers";

export const metadata: Metadata = {
  title: "Customers",
};

export default function CustomersPage() {
  return <CustomersPageClient />;
}
