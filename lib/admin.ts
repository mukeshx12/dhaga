import "server-only";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/prisma";

export async function getAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  return prisma.user.findFirst({
    where: {
      id: session.user.id,
      role: "ADMIN",
      accountStatus: "ACTIVE",
    },
    select: { id: true, name: true, email: true, role: true },
  });
}

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
