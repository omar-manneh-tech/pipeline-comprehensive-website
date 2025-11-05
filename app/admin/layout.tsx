/**
 * Admin Layout
 * Wraps all admin pages with the AdminLayout component
 */

import { AdminLayout } from "@/components/Admin/AdminLayout";

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}

