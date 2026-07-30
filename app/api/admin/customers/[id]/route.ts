import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const { accountStatus } = await request.json();
  if (!["ACTIVE", "SUSPENDED"].includes(accountStatus)) return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  const user = await prisma.user.update({ where: { id, role: "CUSTOMER" }, data: { accountStatus } });
  return NextResponse.json(user);
}
