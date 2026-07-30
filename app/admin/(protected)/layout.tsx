import { requireAdmin } from "@/lib/admin";
import AdminShell from "../components/AdminShell";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return <AdminShell adminName={admin.name || admin.email || "Admin"}>{children}</AdminShell>;
}
