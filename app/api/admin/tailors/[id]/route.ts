import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Context) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { action } = await request.json();
  const updates = {
    APPROVE: { status: "VERIFIED" as const, isVerified: true },
    REJECT: { status: "REJECTED" as const, isVerified: false },
    SUSPEND: { status: "SUSPENDED" as const, isVerified: false },
    REACTIVATE: { status: "PENDING" as const, isVerified: false },
  };
  const data = updates[action as keyof typeof updates];

  if (!data) return NextResponse.json({ message: "Invalid action" }, { status: 400 });

  const existing = await prisma.tailorProfile.findUnique({ where: { id }, select: { userId: true } });
  if (!existing) return NextResponse.json({ message: "Tailor not found" }, { status: 404 });
  const [, tailor] = await prisma.$transaction([
    prisma.user.update({
      where: { id: existing.userId },
      data: { accountStatus: action === "SUSPEND" ? "SUSPENDED" : "ACTIVE" },
    }),
    prisma.tailorProfile.update({ where: { id }, data }),
  ]);
  return NextResponse.json(tailor);
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const existing = await prisma.tailorProfile.findUnique({ where: { id }, select: { userId: true } });
  if (!existing) return NextResponse.json({ message: "Tailor not found" }, { status: 404 });
  await prisma.$transaction([
    prisma.user.update({ where: { id: existing.userId }, data: { accountStatus: "SUSPENDED" } }),
    prisma.tailorProfile.update({ where: { id }, data: { status: "SUSPENDED", isVerified: false } }),
  ]);
  return NextResponse.json({ removed: false, archived: true });
}
